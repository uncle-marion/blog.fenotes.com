> 平安蜀黍的前端教程 > Redux 必学知识点 > redux 中间件与 applyMiddleware

### redux 中间件是什么

redux 本身提供了很强大的数据流管理功能，但这并不是它唯一的强大之处，为了降低耦合性减少它自身的代码量，它抛弃了当前一些流行库的大而全的作法，只是提供了最基础的数据流管理，store.dispatch 所能接受的 action 只允许是一个 JavaScript 对象，先看源码：

```javascript
function dispatch(action) {
  // 函数运行的第一件事就是判断传入的action参数是否是一个普通对象
  // isPlainObject就是一个用于判断参数是否为一个普通对象的方法
  if (!isPlainObject(action)) {
    // 提示你，传入的action必须是一个普通对象
    throw new Error(
      "Actions must be plain objects. Instead, the actual type was: '" +
        kindOf(action) +
        "'. You may need to add middleware to your store setup to handle dispatching other values, such as 'redux-thunk' to handle dispatching functions. See https://redux.js.org/tutorials/fundamentals/part-4-store#middleware and https://redux.js.org/tutorials/fundamentals/part-6-async-logic#using-the-redux-thunk-middleware for examples."
    );
  }

  // 这里也是，所有的action对象必须有type属性
  if (typeof action.type === 'undefined') {
    throw new Error(
      'Actions may not have an undefined "type" property. You may have misspelled an action type string constant.'
    );
  }

  // 同一时间只允许发生一个dispatch操作
  if (isDispatching) {
    throw new Error('Reducers may not dispatch actions.');
  }

  // 尝试使用reducer函数去修改state
  try {
    isDispatching = true;
    // 如果我们在创建store时使用了combineReducers方法合并所有的reducer函数，那么根据compose规则，这里会从外到内逐个执行所有的reducer
    currentState = currentReducer(currentState, action);
  } finally {
    // finally区块的代码表示无论如何都会执行
    // 修改完成后
    isDispatching = false;
  }
  // ...
}
```

通过源码我们知道了 dispatch 只能接受一个普通对象作为它的参数，那么，当我们有特殊需求了要怎么办呢？比如说，我们需要支持错误处理或传入某个函数执行完成后返回的结果：

```javascript
// 这种情况会报错，因为Dispatch不能接受非Object类型的值
store.dispatch(value => vlaue * 100);

// 逻辑简单时我们可以这样做
function multiply(value) {
  return value * 100;
}
// javascript在执行赋值表达式时，会先计算赋值表达式右边的语句，所以，在这里它会先将multiply执行完成后返回的值赋给payload
store.dispatch({ type: 'multiply', payload: multiply(value) });
```

上面的代码在逻辑比较简单的时候可以用，但是如果遇上比较复杂的逻辑呢？或者遇上异步操作，怎么办呢？redux 提供了一个 applyMiddleware 方法，用于接受第三方插件来扩展自身的功能，这样就实现了一个即插即用的概念：

```javascript
// store.js
import thunk from 'redux-thunk';

// ...
// 调用createStore方法创建store库
const store = createStore(reducer, applyMiddleware(thunk));
// ...

// 应用了中间件以后，这样派发action就不会报错了
store.dispatch({ type: 'multiply', payload: value => vlaue * 100 });
```

所以，applyMiddlerware 是什么呢？就是 redux 提供的一个用于接受外部函数来处理 action 的接口。而中间件就是这类的外部函数，我们可以利用 applyMiddleware 方法对 action 进行一些处理后再重新派发到 store，这样就很容易地让 redux 支持自身以外的功能。

### 解析 applyMiddleware

为了更好地理解中间件的运行机制，我们来看看 redux 相关的源码，因为原码都是 typeScript 格式的，所以我们要看 javaScript 格式的代码需要进到 dist 目录下：

首先，看看 createStore 与 applyMiddleware 相关的部分，了解 redux 中增强器是怎样执行的：

```javascript
/**
 * createStore接受的3个参数
 * @param {Function} reducer 用于处理action的函数
 * @param {Object} preloadedState 可选的初始store属性参数
 * @param {Function} enhance 增强器函数
 * @returns 经过enhance增强后的createStore函数
 */
export function createStore(reducer, preloadedState, enhance) {
  // 不允许传入3个以上参数
  if (
    (typeof preloadedState === 'function' && typeof enhancer === 'function') ||
    (typeof enhancer === 'function' && typeof arguments[3] === 'function')
  ) {
    // 这段提示的意思是不要同时传入很多个增强器，而是将它们合并成一个以后再传入
    throw new Error(
      'It looks like you are passing several store enhancers to ' +
        'createStore(). This is not supported. Instead, compose them ' +
        'together to a single function. See https://redux.js.org/tutorials/fundamentals/part-4-store#creating-a-store-with-enhancers for an example.'
    );
  }

  // 如果只传了两个参数且第二个参数是函数类型的，就认为preloadedState没传
  if (typeof preloadedState === 'function' && typeof enhancer === 'undefined') {
    // 调整参数的值
    enhancer = preloadedState;
    preloadedState = undefined;
  }

  // 判断是否有传入增强函数
  if (typeof enhancer !== 'undefined') {
    // 如果参数类型不正确
    if (typeof enhancer !== 'function') {
      throw new Error(
        "Expected the enhancer to be a function. Instead, received: '" +
          kindOf(enhancer) +
          "'"
      );
    }
    /*
    使用传入的增强器增强createStore方法后重新执行并返回增强函数的执行结果，相当于react的高阶函数
    如果使用中间件，这里 enhancer 就是 applyMiddleware 函数
    */
    return enhancer(createStore)(reducer, preloadedState);
  }
  // 其它的代码暂时不关注，感兴趣的同学可以课后自己去看看
}
```

从上面的代码我们可以看出，applyMiddleware 这一部分代码其实非常简单，就是判断它是否是一个函数，如果是一个函数，就把 createStore 方法和接收到的其它参数传过去，那么接下来我们看看 applyMiddleware 的源码：

```javascript
function applyMiddleware() {
  // 通过arguments来获取参数，这个遍历操作就是将类数组的arguments转换成数组格式。
  for (
    var _len = arguments.length, middlewares = new Array(_len), _key = 0;
    _key < _len;
    _key++
  ) {
    middlewares[_key] = arguments[_key];
  }

  /**
   * 这里返回的这个函数就是我们刚刚看到的enhancer方法，它在被调用时会收到作为参数传入的createStore方法
   */
  return function (createStore) {
    /**
     * 这个函数就是我们在外面看到的，执行enhancer(createStore)后返回的方法，也就是说，它接受的参数是reducer和preloadedState
     */
    return function () {
      // void表示计算但不返回任何值，也就是说，这里执行的createStore的this指针指向了不存在，所以这里实际上等于createStore(arguments)
      // 创建一个store
      var store = createStore.apply(void 0, arguments);

      // 这里是为了警告middleware开发者，不要在middleware内部使用dispatch，因为这个时候还没有dispatch，如果调用会导致错误
      var _dispatch = function dispatch() {
        throw new Error(
          'Dispatching while constructing your middleware is not allowed. ' +
            'Other middleware would not be applied to this dispatch.'
        );
      };

      // 从store中获取getState方法
      var middlewareAPI = {
        getState: store.getState,
        dispatch: function dispatch() {
          return _dispatch.apply(void 0, arguments);
        },
      };
      // 通过数组的map方法来将接收到的所有中间件都执行一遍，这样我们所有的中间件里面就都能使用getState和不可用的dispatch方法了
      var chain = middlewares.map(function (middleware) {
        return middleware(middlewareAPI);
      });
      // 使用compose将所有的中间件合并成一个函数，然后传入可用的dispatch，最后返回的是一个经过修改的可用的dispatch
      _dispatch = compose.apply(void 0, chain)(store.dispatch);
      // 复制一个新的store对象，同时修改这个对象的所有属性为可改变、可删除、可枚举
      // 这块与整体逻辑没有太大关系，我们可以暂时忽略，感兴趣的同学可以课后去看源码
      return _objectSpread2(
        _objectSpread2({}, store),
        {},
        {
          dispatch: _dispatch,
        }
      );
    };
  };
}
```

从上面的代码中可以看出，其实 applyMiddleware 最核心的部分就是使用 compose，所以，我们还需要看看 compose 的实现：

```javascript
function compose() {
  // 将arguments也就是传入的中间件参数转换成数组格式
  for (
    var _len = arguments.length, funcs = new Array(_len), _key = 0;
    _key < _len;
    _key++
  ) {
    funcs[_key] = arguments[_key];
  }
  // 如果没有中间件
  if (funcs.length === 0) {
    return function (arg) {
      return arg;
    };
  }

  // 如果只有一个中间件
  if (funcs.length === 1) {
    return funcs[0];
  }

  // 将所有的中间件从左至右依次合并起来成一个洋葱圈的样子
  return funcs.reduce(function (a, b) {
    // 这个就是我们在中间件里获取到的next函数
    return function () {
      // 根据javascript的赋值表达式(参数===隐性赋值)，先计算后赋值，所以这里需要先调用b函数，
      // 就是funs数组里的下一个函数，传入的参数则是next函数接收到的action
      return a(b.apply(void 0, arguments));
    };
  });
}
```

通过将不同的 middleware 一层层地包裹到原生的 dispatch 上面来形成所谓的洋葱圈的形态，让所有的 Middleware 里都会有一个 next 方法，同时还保持了 store 的一致性

### 自定义中间件

看完上面的源码后，可能有一部分同学觉得逻辑有些绕，还是没有捋明白代码运行的整体思路，那么，接下来我们尝试自定义一个中间件：

```javascript
/**
 * 从上面的代码里，我们知道，每一个中间件在被执行时都会传入一个middlewareAPI对象，这个对象中包含有dispatch属性和getState属性
 */
function logger({ dispatch, getState }) {
  // 返回一个函数，这个函数接收一个next属性，这个next属性是什么呢？如果不记得的同学可以回想一下我们之前介绍的compose方法
  return function (next) {
    // 这里就是我们自己需要实现的中间件函数了，处理action的逻辑都在这个函数里去完成
    return function (action) {
      console.log('传入了action:', action);
      // 将action传给下一个中间件进行处理
      const result = next(action);
      console.log('处理完成的state', result);
      return result;
    };
  };
}
```

### 常用中间件及原码

理解了 applyMiddleware 的运行机制后，我们可以来看看市面上常见的一些中间件了：

#### redux-thunk

在 redux 的中间件中，redux-thunk 是用得最多的影响范围最广的。它是通过函数式编程的思想来设计的，让每个函数的功能都尽量地小，然后通过函数的嵌套组合来实现复杂的功能，它的工作机制相对简单却很好地解决了平时业务场景中的异步问题：

```javascript
/**
 * 创建redux-thunk主函数的方法
 * @param {Object} extraArgument 额外的参数
 * 也就是说，我们在应用redux-thunk时可以直接应用，也可以通过createThunkMiddleware来配置一些额外参数后再应用
 */
function createThunkMiddleware(extraArgument) {
  // 执行createThunkMiddleware后返回下面这个中间件函数并利用闭包的原理缓存了extraArgument参数
  return ({ dispatch, getState }) =>
    // dispatch调用或洋葱圈外层函数调用
    next =>
    // 接收到action对象
    action => {
      // 如果action是一个函数，则执行这个函数
      if (typeof action === 'function') {
        // 我们的函数可以接收到的参数：dispatch, getState, 以及上面定义的额外参数
        return action(dispatch, getState, extraArgument);
      }
      // 否则转交给洋葱圈更内层的中间件进行运算并将运算结果返回给上一层函数或dispatch
      return next(action);
    };
}
// 为了更方便使用，在这里创建一个thunk中间件，这样我们在使用applyMiddleware时可以直接传入
// 默认的thunk是没有额外参数的，但是我们可以使用thunk.withExtraArgument方法来创建一个新的thunk来传入新的参数。
const thunk = createThunkMiddleware();
thunk.withExtraArgument = createThunkMiddleware;

export default thunk;
```

我们再来看看 redux-thunk 的用法：

1. 首先安装 redux-thunk：

```bash
npm i -S redux-thunk
```

2. 修改 store.js

```javascript
// 然后需要修改store.js文件，导入applyMiddleware并将thunk应用到store
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
// ...

// 创建store时先使用applyMiddleware增强
const store = createStore(reducer, applyMiddleware(thunk));
// ...

// 如果需要定义额外的参数
const store = createStore(
  reducer,
  applyMiddleware(thunk.withExtraArgument({ a: '额外的参数' }))
);
```

3. 页面调用

```javascript
// 同步函数
dispatch(function (dispatch, getState, extraArgument) {
  // 以action的形式返回
  return {
    type: 'sync',
    payload: {
      //...
    },
  };
});

// 异步函数
dispatch(function (dispatch, getState, extraArgument) {
  console.log('看看额外的参数', extraArgument);
  axios.get('url', { ...data }).then(res => {
    // ...
    // 经过计算后派发一个新的action
    dispatch({
      type: 'async',
      payload: { data: res.data },
    });
  });
});
```

4. 为什么要使用 redux-thunk

```javascript
// 使用mapDispatchToProps也可以达成异步操作
function mapDispatchToProps(dispatch, ownProps) {
  return {
    test(value) {
      setTimeout(() => {
        dispatch({
          type: 'sub',
          payload: value + 1,
        });
      }, 2000);
    },
  };
}
```

这个问题曾经也困扰过我，直到有一天我在[stackoverflow 上找到了这篇得到了官方推荐的回答](https://stackoverflow.com/questions/35411423/how-to-dispatch-a-redux-action-with-a-timeout/35415559#35415559)：

> **原文**

> Don’t fall into the trap of thinking a library should prescribe how to do everything. If you want to do something with a timeout in JavaScript, you need to use . There is no reason why Redux actions should be any different.setTimeout

> Redux does offer some alternative ways of dealing with asynchronous stuff, but you should only use those when you realize you are repeating too much code. Unless you have this problem, use what the language offers and go for the simplest solution.

> **译文**

> **不要认为一个库应该规定怎样去做所有的事情。**如果您想在 JavaScript 中处理延时任务，直接使用 setTimeout 就可以实现。没有理由认为 Redux 操作应该有任何不同。

> Redux 确实提供了一些处理异步内容的替代方法，但只有在您意识到在您的**项目中存在了太多重复的代码时**才应该使用这些方法。如果您并没有太多重复代码，建议您采用该语言的原生方案也许是最简单的解决方案。

---

上面这段话我希望你们都会用心去理解，**很多时候我们都需要考虑做一件事情的成本与得到的效益是否匹配，当成本超过收益时，就要考虑这件事情该不该做了**。比如，当你们决定在项目中使用 redux-thunk 时，认真地考虑一下是否真的需要使用这个库，不要轻易地往你的项目里堆砌太多不必要的依赖。

到这里为止，我们的 redux-thunk 就算是学习完成了，而且我们的 redux 也可以正常地处理异步操作了。但程序员总该是有些追求的，总会想着要实现**更加优雅的方式**来实现 redux 异步流的控制，所以，又有了 redux-promise 这个中间件

#### redux-promise

不同的中间件都有着自己的适用场景，redux-thunk 比较适合简单的 API 请求的场景，而 redux-promise 则更加适合更复杂的输入输出操作，我们先来看看 redux-promise 的原码：

```javascript
'use strict';

// 使用defineProperty往exports里加了一个__esModule属性
// 这一步的操作是为了能够在当前环境正确引入is-promise这个依赖
Object.defineProperty(exports, '__esModule', {
  value: true,
});

exports.default = promiseMiddleware;
var _isPromise = _interopRequireDefault(require('is-promise'));

var _fluxStandardAction = require('flux-standard-action');

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    var ownKeys = Object.keys(source);
    if (typeof Object.getOwnPropertySymbols === 'function') {
      ownKeys = ownKeys.concat(
        Object.getOwnPropertySymbols(source).filter(function (sym) {
          return Object.getOwnPropertyDescriptor(source, sym).enumerable;
        })
      );
    }
    ownKeys.forEach(function (key) {
      _defineProperty(target, key, source[key]);
    });
  }
  return target;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true,
    });
  } else {
    obj[key] = value;
  }
  return obj;
}

function promiseMiddleware(_ref) {
  var dispatch = _ref.dispatch;
  // dispatch或洋葱圈外部函数调用
  return function (next) {
    return function (action) {
      // 这种写法比较少见，它的本质是javascript中的逗号操作符
      // 逗号操作符的功能是从左至右对每一个操作对象进行求值，然后返回最后一个操作对象的值
      // 那么这里的操作就是将后面的这个函数转换成匿名函数然后调用并传入下一个括号中的参数
      // 为什么要这样写呢？
      // 这种写法的目的主要是为了修改这个函数的this指向，然而，我们都知道可以使用call或apply，这里为什么不使用呢？
      // 因为有的时候有些程序员习惯于修改prototype，将call或apply指向自己写的一些函数甚至改变prototype的指向，这样就会导致原型链上的方法不可用，所以只好使用这种方式
      // 所以，为了能让自己的代码可读性更高，不影响其它程序的正常执行，开发中我们千万不要去修改原型链！

      // 首先，判断整个action是否是一个flux格式的action
      // flux格式的action就是一个包含有type和payload的对象
      if (!(0, _fluxStandardAction.isFSA)(action)) {
        // 如果不是flux的action,那么就判断它是否是一个promise对象
        return (0, _isPromise.default)(action)
          ? // 是promise对象，执行它
            action.then(dispatch)
          : // 不是promise对象，交给下一个中间件进行处理
            next(action);
      }

      // 判断action的payload属性是否是一个promise对象
      return (0, _isPromise.default)(action.payload)
        ? // 是promise对象，执行它
          action.payload
            .then(function (result) {
              // 获得结果后使用dispatch派发包含有结果和当前action的新对象
              return dispatch(
                _objectSpread({}, action, {
                  payload: result,
                })
              );
            })
            .catch(function (error) {
              dispatch(
                _objectSpread({}, action, {
                  payload: error,
                  error: true,
                })
              );
              return Promise.reject(error);
            })
        : // 否则，丢给下一个中间件进行处理
          next(action);
    };
  };
}
```

#### redux-saga
