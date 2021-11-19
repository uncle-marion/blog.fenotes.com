> Marion 的 react 实战课程 > 第八部分 > redux 相关知识点回顾

## redux

### 一、redux 三大原则

##### 单一数据源

- 整个应用的 state 被储存在一棵 object tree 中，并且这个 object tree 在应用中是唯一的。

##### State 是只读的

- state 是不可以修改的，唯一改变 state 的方法就是使用 dispatch 派发 action，而 action 是一个用于描述即将发生的事件的普通对象。

##### 使用纯函数来执行修改

- 使用纯函数来接收当前的 state 和 action，并在进行计算后返回一个新的 state，在运行期间，不可以有任何修改参数 state 的操作。

### 二、redux 的三大要素

##### store

- Store 就是用来维持应用所有的 state 树 的一个对象。 改变 store 内 state 的惟一途径是对它 dispatch 一个 action。

- Store 不是类。它只是有几个方法的对象。 要创建它，只需要把根部的 reducer 函数传递给 createStore

##### action

- action 是一个对象，它主要用来表示即将改变 state 的描述。

> action 对象必须有一个 type 属性，store 用它来区别处理当前 action 的 reducer 方法  
> 正常来说，action 对象其它属性可以有很多个，但在最初的 Flux 架构中，只允许使用 payload 来表示有效载荷(payload 的译文)，所以这个规则就一直沿用下来了

- 注意：必须记住的一点就是，action 是 redux 中改变 store 的唯一途径，无论是从 UI 事件、API 返回还是其它 websocket 之类的数据，最终都需要经过 dispatch 方法来派发一个 action 给 store，否则会导致 store 中的 subscribe 方法无法监听到数据更新从而无法更新和渲染组件

##### reducer

- reducer 是一个函数，这个函数接受两个参数：

  > 参数一：当前 store 中最新的状态树，如果我们未能匹配到对应的 reducer 处理函数，则一定要将当前接收到的 state 重新返回给 store，否则 store 会因为获取不到计算后的 state 而报错  
  > 参数二：action，一个用于描述这次数据更新的对象，参考上面说的 action

- 注意：reducer 必须是一个纯函数，我们不能在这个函数里使用或修改任何外部状态，**包括但不限于从 window 中取值、获取异步 api、修改 UI 界面或是调用 window 中的方法！也不能对参数做任何修改，比如改变 state 中的内容。**这些操作很容易导致数据无法更新或直接进入死循环导致浏览器假死的情况发生。

### 三、redux 常用方法(API)详解

##### createStore(reducer, [preloadedState], [enhancer])

###### 功能：

- 创建一个 Redux store 来存放应用中所有的 state，要求项目中必须有且只有一个 store。

###### 参数：

- **reducer** _{function}_ 接收两个参数，参数一是当前的 state 对象，参数二是要处理的 action，执行后返回新的 state 对象
- **preloadedState** _{any}_ 可选参数 初始的 state，我们一般都在 reducer 中定义了对应的初始 state，所以这个参数可以忽略
- **enhancer** _{function}_ 可选参数 用于增强 createStorage 的方法，用于添加第三方插件如中间件、持久化等功能来增强 store。

###### 返回值：

一个保存了当前应用的所有 state 的对象，改变 state 的唯一途径是派发 action。我们可以通过 subscribe 来监听 state 的变化，然后通过 getstate 来更新 UI。

##### combineReducers(reducers)

###### 功能：

- 将多个管理不同 state 的 reducer 函数组合成一个统一的 reducer 函数，然后就可以将这个函数在 createStore 时作为第一个参数传入。合并后的 reducer 可以调用每一个子 reducer 函数，并将它们返回的结果合并成一个 state 对象，结果的属性名是合并时的函数名称。

###### 参数：

- **reducers** _{object<reducer>}_ 由一个或多个 reducer 组成的对象

###### 返回值：

- **reducer** _{function}_ 一个调用 reducers 对象里所有 reducer 的 redeucer，它会构造一个与 reducers 对象结构相同的 state 对象。

##### applyMiddleware(...middleware)

###### 功能：

- 使用一些包含自定义功能的 middleware 来扩展 Redux 的方法，最常见的使用场景是通过 redux-thunk/redux-promise 来实现派发异步 actions。

###### 参数：

- **...middleware** _{arguments}_ 一些遵循 Redux middleware 规范的函数。每个 middleware 接收 Store 的 dispatch 和 getState 作为命名参数并返回一个被称之为 next 的函数，这个函数的执行结果是一个 action。

###### 返回值：

- **enhancer** _{function}_ 一个应用了 middleware 后的 store enhancer 函数，一般来说我们会将这个返回函数作为 createStore 的最后一个参数。

##### compose(...functions)

###### 功能：

- 不是很常用，函数式编程中的函数合并方法，从左到右依次合并多个函数，redux 配置中唯一的使用场景是合并 redux-devtools 与 applyMiddleware

##### bindActionCreators(actionCreators, dispatch)

###### 功能：

- 不常用，唯一的使用场景是当需要把 action create 往下传到一个组件上，并且不希望传入 dispatch 与 store 时，比如我们使用的一些异步 action，不需要 redux 管理返回值的时候。

### 四、 Store 常用方法（API）详解

##### getState()

###### 功能：

- 返回应用当前的状态树，这个状态树中的状态与最后一次计算的 reducer 的返回值相同

##### dispatch(action)

###### 功能：

- 派发 action 的方法，这是我们触发 state 变化的唯一途径。

- 注意：dispatch 只能接受一个普通 action 对象作为它的参数，任何其它类型的参数都会导致 store 报错。如果你需要使用 dispatch 派发一个返回 action 的函数，需要使用 redux-thunk 这个中间件；如果你需要使用 dispatch 派发一个 promise，需要使用 redux-promise 这个中间件。

##### subscribe(listener)

###### 功能：

- 用于监听 store 中状态变化的方法

###### 参数：

- **listener** _{function}_ 当 store 中任意状态发生变化后都会调用这个函数，我们可以在这个函数中调用 getState 方法来获取最新的状态树

###### 返回值：

- **unsubscribe** _{function}_ 解绑 subscribe 的函数

##### replaceReducer(nextReducer)

###### 功能：

- 高级 API，不常用，用于替换 store 当前用来计算的 reducer，当我们在计算过程中需要加载另一些 reducer 时会用到它

## react-redux

### 一、配置方法

##### Provider

- 从名字可以看出，它是一个基于 react.context 的生产者组件，这个组件接受的 props 与 context 不一样，叫 store，它的值是我们使用 createStore 方法返回的对象，我们通过在 react 根组件上包裹一个 Provider 组件来将 Redux 的 store 向下传递到所有的组件中，并在嵌套组件中使用 connect 方法或 useSelector 来获取最新的 state

### 二、类组件中使用

##### connect([mapStateToProps], [mapDispatchToProps], [mergeProps], [options])(Component)

###### 功能：

- connect 是 react-redux 提供的让我们将组件与 store 关联起来的一个小工具，它是一个高阶函数，第一次执行需要传入上面 4 个参数后返回一个高阶组件，这个高阶组件会将第一次执行的参数注入到当前组件中，这样我们就可以在当前组件中获取最新的 store 或调用 dispatch 方法来派发 action 对象到 store 中去。

###### 参数：

- **mapStateToProps** _{function}_ 可选参数 mapStateToProps，从名字可以看出，这个方法是将 state 映射到当前组件的 props 当中，从这点可以看出来，我们平时强调的语义化有多重要。

```javascript
// 将store中所有state映射到props中
function mapStateToProps(state) {
  return state
}
// 或
const mapStateToProps = state => state

// 将store中指定的state映射到props中
function mapStateToProps(state) {
  return {
    [状态名]: state[状态名]
  }
}
// 或
const mapStateToProps = ({[状态名]}) => ({[状态名]})
```

- **mapDispatchToProps** _{function|object}_ 可选参数 mapDispatchToProps，这个参数可以是一个对象也可以是一个回调函数，当它是一个对象时，只需写入我们导入的 action 方法即可；当它是一个回调函数时，它提供了两个参数，参数一是 store 的 dispatch 方法，参数二是 ownProps，我们可以在这个函数中直接调用 dispatch 方法

```javascript
// 当它是一个函数时
function mapDispatchToProps(dispatch, ownProps) {
  return {
    actionName: (...args) => dispatch({type: 'xxx', payload: {}...args}})
  }
}
// 当mapDispatchToProps是一个对象时
const mapDispatchToProps = {
  ['从actions中导入的action方法']
}
```

### 三、函数组件中使用

虽然在 hooks 中提供了 useReduce 钩子，我们使用它结合 useContext 可以模拟出部分 redux 的功能，但终归还是提高了学习门槛，增加了新的逻辑层。为了解决这个问题，在 react-redux v7.1 版本中，提供了 useDispatch 与 useSelector 两个钩子，让我们在函数组件中也可以很好地使用 redux

##### useDispatch()

###### 功能：

- dispatch 钩子，我们可以直接使用 useDispatch 获得 store.dispatch 方法，然后在组件中使用它；因为它来自于 store，所以，它与 useRef 一样，除非我们手动改变它，否则在整个组件的生命周期内，它只被执行一次。

```javascript
const dispatch = useDispatch();

useEffect(() => {
  dispatch({ type: 'xxx', payload: { xxx: 'xxx' } });
}, []);
```

##### useSelector(state => state)

###### 功能：

从 store 中获取最新 state 的钩子，我们可以像使用 mapStateToProps 一样使用它，当 store 中状态发生变化时，同样也会触发 useSelector 的状态变化，同时，它与 useMemo 或 useCallback 一样，不会随着组件状态变化而重复执行，只有在 store 中状态发生变化后才会执行。

```javascript
const state = useSelector(state => state);
```

## redux-thunk

###### 功能：

上面在讲 store.dispatch 时讲到过，dispatch 方法只能派发一个普通函数作为其参数，如传入其它类型参数都会引起 store 报错。按照这个规则，在使用 redux 管理一些状态的时候，我们不能像 setState 或调用其它方法一样，在传递参数时进行计算，必须使用函数计算完成后再调用 dispatch 派发状态，这无疑是违背了 redux 的初衷的。

而 redux-thunk 就是为了让 redux 更好地管理状态而出现的，通过这个中间件，我们可以直接使用 dispatch 派发一个有实时返回内容的函数方法，redux-thunk 会拦截 dispatch 方法，将其中的方法运行后，再次调用 dispatch 派发这个函数运行的结果给 store，这样就避免了因为 store 无法接收函数而报错

使用方法：
在 store.js 文件中，使用 applyMiddleware 方法

```javascript
// redux api
import { createStore, applyMiddleware } from 'redux';
// redux-thunk
import thunk from 'redux-thunk';
// 我们自己写的reducer, createStore接收的第一个参数
import rootReducer from './index';

// 参考上面的教程，applyMiddleware返回的是一个store enhancer函数，我们将它作为createStore的最后一个参数
const thunkMiddle = applyMiddleware(thunk);
// 使用增强方法（上面我们讲createStore时，它的第三个参数，第二个参数被忽略了）
const store = createStore(rootReducer, thunkMiddle);

export default store;
```

新版本的 thunk 还可以这样使用

```javascript
// get与post是我们需要让thunk载入到reduce中的属性或方法，这样我们就可以在action中直接调用它了
const store = createStore(
  persistedReducer,
  applyMiddleware(thunk.withExtraArgument({ get, post }))
);
```

###### redux-thunk 的原码

```javascript
function createThunkMiddleware(extraArgument) {
  return function ({ dispatch, getState }) {
  // 第一次调用 返回一个闭包
  return function (next) {
    // 外界调用闭包的时候，再次返回一个新的闭包函数，这个闭包函数就是我们dispatch(action)
    // 到store里面去的时候用于拦截并比较我们的action用的

    // 它接收一个action参数，就是我们平时dispatch派发的那个参数
    return function (action) {
      // 如果它接收到的参数是一个function, 那就执行它并且传入dispatch和getState这两个方法给传入的action方法
      if (typeof action === 'function') {
        return action(dispatch, getState)
      }
      // 如果它不是一个函数，那么就直接使用next将它转发给下一个中间件或直接扔给store
      return next(action)
    }
  }
  // 原码
  // ({ dispatch, getState }) =>
  //   next =>
  //   action => {
  //     if (typeof action === 'function') {
  //       return action(dispatch, getState, extraArgument);
  //     }

  //     return next(action);
  //   };
}

const thunk = createThunkMiddleware();
thunk.withExtraArgument = createThunkMiddleware;

export default thunk;
```

## redux-promise

###### 功能：

redux-promise 的功能是让我们的 dispatch 能够读取 promise 对象中的返回值并将它重新派发到 store 中去

###### 使用方法：

```javascript
// redux api
import { createStore, applyMiddleware } from 'redux';
// redux-thunk
import promise from 'redux-promise';
// 我们自己写的reducer, createStore接收的第一个参数
import rootReducer from './index';

// 参考上面的教程，applyMiddleware返回的是一个store enhancer函数，我们将它作为createStore的最后一个参数
const promiseMiddle = applyMiddleware(promise);
// 使用增强方法（上面我们讲createStore时，它的第三个参数，第二个参数被忽略了）
const store = createStore(rootReducer, promiseMiddle);

export default store;
```

###### redux-promise 原码

```javascript
'use strict';

// 给exports添加一个新的属性，__esModule 用于判断是返回原对象还是返回一个default新对象
Object.defineProperty(exports, '__esModule', {
  value: true,
});

// 与export default 一致，这里其实是抛出一个promiseMiddleware函数
exports.default = promiseMiddleware;

// 第三方插件，如果它是一个标准化的es模块，就返回当前的，如果不是一个标准化模块，给它加成一个对象
var _isPromise = _interopRequireDefault(require('is-promise'));

var _fluxStandardAction = require('flux-standard-action');

function _interopRequireDefault(obj) {
  // 如果没有引入到isPromise这个插件，它就是个false,否则返回这个插件的内容
  // export 抛出的只能是一个对象，我们要用的话就必须解构
  // export.default抛出的则是一个可以被模块解析系统直接引用的属性，我们可以直接import它的值
  return obj && obj.__esModule ? obj : { default: obj };
}

function _objectSpread(target) {
  // 遍历当前的所有参数
  for (var i = 1; i < arguments.length; i++) {
    // 如果这个参数存在，否则是一个空对象
    var source = arguments[i] != null ? arguments[i] : {};
    // 取出所有的key
    var ownKeys = Object.keys(source);
    // 剔除对象原型上所有的方法
    if (typeof Object.getOwnPropertySymbols === 'function') {
      ownKeys = ownKeys.concat(
        Object.getOwnPropertySymbols(source).filter(function (sym) {
          return Object.getOwnPropertyDescriptor(source, sym).enumerable;
        })
      );
    }
    // 遍历它所有的key,
    ownKeys.forEach(function (key) {
      _defineProperty(target, key, source[key]);
    });
  }
  return target;
}

function _defineProperty(obj, key, value) {
  // 如果对象中已经有这个属性，就使用defineProperty方法来改写这个属性
  if (key in obj) {
    // 其实就是一个给对象添加属性或给对象的属性赋值的方法，只不过通过它添加的属性会增加一些控制属性
    // Object.defineProperty(对象名称, 属性名称, {
    //   value: 属性的值, // 赋值，注意这个值与get\set不能同时存在，否则会内存溢出
    //   get(){} // 读取器
    //   set(){} // 存储器
    //   writable: true // 是否可以改变，默认为不可改变
    //   configurable: true // 是否可以删除，默认为不可删除
    //   enumerable: true // 是否可以被for in遍历或通过Object.keys获取，默认不可遍历
    // })
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true,
    });
  }
  // 没有这个属性就直接赋值
  else {
    obj[key] = value;
  }
  return obj;
}
// promiseMiddleware
/**
 * 接受一个对象作为它的参数
 */
function promiseMiddleware(_ref) {
  var dispatch = _ref.dispatch;
  // 它第一次返回一个函数，这个函数中会有一个next,(可能是下一个中间件，也可能是dispatch)
  return function (next) {
    // 我们调用到的中间件，action是我们在组件传入那个action对象
    return function (action) {
      // flux标准action属性：
      // 必须为标准的Json对象。
      // 必须包含type属性。
      // 可以包含error、payload、meta属性，除这些属性外，不应再包含其他属性。
      // 各属性含义如下：

      // 我们需要判断当前的action是不是一个标准的flux action 对象
      if (!(0, _fluxStandardAction.isFSA)(action)) {
        // 不是，就去判断它是不是一个promise方法
        if (0, _isPromise.default)(action) {
          // 是，调用这个promise的.then方法并传入一个dispatch；这样的话，就等是使用dispatch将这个promise获取到的结果派发给了store
          return action.then(dispatch)
        }
        // 不是，丢给下一个中间件处理
        return next(action)
      }
      // 注意，上面的两个if的意义
      // (0, __fluxStandardAction.isFSA)(action) (0, _isPromise.default)(action)
      // 这里利用了逗号操作符的运行规则，对__fluxStandardAction.isFSA这个方法进行了取值，然后调用取值获取到的方法并传入action这个参数
      // 所以，这里的目的是将方法的this指向指向到window，如果是在严格模式下则会被指向undefined

      // 当前的action是一个标准的flux action 对象
      // 判断它的payload是不是一个promise方法
      if (0, _isPromise.default)(action.payload) {
        // 是，调用它的.then方法，并将它的结果与当前的action合并。这样这个新的对象里就有了action中所有的属性和promise中返回的结果
        return action.payload
            .then(function (result) {
              // 使用dispatch方法派发新的action对象到store中
              return dispatch(
                // 将它的结果与当前的action合并
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
      }

      // 不是，丢给下一个中间件处理
      next(action);
    };
  };
}
```

###### 功能：

new Promise(res => res(123)).then(dispatch) dispatch(res)

action 的必要属性

###### 算法：

重点： 是否是 flux action 对象
是否是一个 promise

2.
3.

## redux-actions

## 项目亮点描述

项目名称 **电商网站的后台管理项目**

功能模块 **添加商品功能**

亮点功能 **规格选择和规格添加**

##### 思路解释：

因为商品添加页面本身就是一个很大的表单，包含有商品名称、商品分类、商品封面图片和商品轮播图等等一堆下拉选择器和输入框十几项，但是产品在设计添加商品时，用户还可以直接在当前的商品规格列表中添加新的规格，这就涉及到一个动态表单的设计，然后，这个动态表单在确认后还会在页面的下方生成一个 sku 表格，表格里要包含所有的商品 sku，这块也涉及到一个 sku 生成的概念；如果将这此内容都写入到一个表单中，代码会显得特别复杂，逻辑互相影响不好处理，后期维护起来也特别麻烦。所以我就拆分了一下逻辑，将其中可以单列出来的逻辑整理成了一个规格生成组件，然后又将这个组件分拆成了容器组件、表单组件与表格组件。

这样拆解的好处是，整个表单组件逻辑中的增加与删除不会影响到大表单的数据更新，减少了与大表单关联的组件反复渲染的问题；同时每个组件只需要关注自己的功能实现，不需要处理父组件或其它兄弟组件的状态变化，减少了逻辑层的耦合。

##### 组件依赖：Form.Item, Form.List, Select, Input

##### 组件通讯：props

##### 组件拆分：

一、 容器组件 producdSpec： 这个组件主要负责处理各个子组件的显示与隐藏，另外，因为动态表单与表格之间存在数据交互，所以，还需要管理一个规格列表的数组。

###### 算法实现：

> **step 1** 分别建立规格匹配、下拉选择、动态表单、sku 表格 4 个属性用于管理子组件的渲染

> **step 2** 正常渲染 radio 部分，并监听 radio 的变化以判断显示单规格格还是多规格，这里默认选择单规格

> **step 3** 选择单规格则显示单规格列表，表格仅渲染一行数据

> **step 4** 选择多规格时首先渲染出规格选择下拉列表，待用户选择现有规格后再根据用户的选择生成并渲染动态表单

> **step 5** 根据动态表单返回的规格列表，生成 sku 列表并使用 form.setFieldsValue 方法设定表格组件的渲染内容

二、 动态表单组件 productSpecForm: 这个组件接收两个参数，参数一是用户选择的规格列表 specs，参数二是修改规格列表的方法 updateSpecs；主要负责渲染规格列表与规格添加功能，实现在当前规格列表中添加新规格和原规格中添加新属性的功能，当用户选择和添加完成后，点击生成时调用 updateSpecs 方法，将新的规格列表回传给父组件进行下一步处理。

###### 算法实现：

> **step 1** 创建一个 newSpecAttrs 状态，用于管理当前组件中所有新增的属性值

> **step 2** 创建 newSpecName 与 newSpecAttr 状态，用于管理添加新规格时输入的规格名称和属性值

> **step 3** 渲染规格列表时在每个规格后渲染一个 input 组件，将状态存入到 newSpecAttrs 中并监听它的变化，当用户点击添加后，调用 updateSpecs 将状态传往父组件，由父组件进行下一步处理。

> **step 4** 在规格列表的底部渲染一个用于添加新规格的表单，因为 form 表单无法嵌套，所以这里直接使用了两个受控的 input 来管理状态，当用户输入完成并点击确认后，调用 updateSpecs 将状态传往父组件，由父组件进行下一步处理

三、 sku 表格组件 productSpecTable: 这个组件相对来说比较麻烦，因为 antd 的 table 组件并不支持分行渲染的操作，所以我们无法将 form.list 渲染到表格里，这里我自己写了一个表格渲染的方法，将父组件传入的规格拆解成具体的 sku 列表并将其渲染成表格，用户可以在表格中输入单价、进货价、库存等一系列 sku 并将其收集到大表单的 attrs 属性中；

###### 算法实现：

> **step 1** 创建初始的 columnList，根据父组件传入的状态来确认是否合并显示规格表头与操作列表头

> **step 2** 创建一个表头组件，根据 columnList 渲染表头

> **step 3** 使用 form.list，将父组件中通过 setFieldsValue 方法传入的数组渲染到页面

##### 名词解释

- SPU: 属性值、特性相同的商品就可以称为一个 SPU，与颜色、款式无关。 比如 Iphone 13
- SKU: 库存进出计量的单位，如规格、颜色、款式等等。比如红色 Iphone 13 Pro
