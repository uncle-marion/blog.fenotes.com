> Marion 的 react 实战课程 > 第三部分 > React 全局状态管理

之前在组件中有提到，React 中的状态管理工具库目前比较流行的有 mobx 与 redux，因为时间有限，我们优先学习 redux。对于 mobx，有时间我们会用一到两节课时来学习，否则就只能让大家自学了。

### 一、什么是 Redux

- Redux 是用于解决 React 没有官方的状态管理机制问题的, 所以 Redux 其实是 React 事实上的状态管理工具, 它的功能是提供一个应用于 JavaScript 的可预测的状态容器, 提供可预测的状态管理。

这句话是官方的解释，但可能大多数同学还是没有办法理解 Redux，所以为了让大家能更好地理解什么是 redux，我们先不去理解 Redux，只是在项目中使用 redux 简单地实现一个状态管理操作：

#### 1. Redux 的简单使用

首先我们需要安装 redux 及 react 的 redux 辅助工具：react-redux

```bash
yarn add redux react-redux
```

我们昨天在 src 目录下创建了一个 models 目录，这个目录就是用来存储数据相关的文件的，首先在 models 目录下建立一个叫 store.js 的文件：

```javascript
// 导入creageStaore 用于创建store库
import { createStore } from 'redux';

/**
 * 用于管理状态的方法，redux会以当前这个函数名在状态库中创建一个状态树用于保存数据
 * @param {*} state 当前状态库中对应于这个方法的状态树，状态初始化时需要传入默认值
 * @param {*} action 用于描述改变状态的对象
 */
function reducer(state = { count: 0 }, action) {
  // 加法操作
  if (action.type === 'add') {
    return { ...state, count: state.count++ };
  }
  // 减法操作
  if (action.type === 'sub') {
    return { ...state, count: state.count-- };
  }
  // 因为store在被调用时会同时激活所有的reducer，所以，我们在无法匹配到正确的action.type时，必须要返回原有的state，否则会造成store中对应的属性变成undefined的情况
  return state;
}

// 调用createStore方法创建store库
const store = createStore(reducer);

// 抛出store库
export default store;
```

修改根目录下的 index.jsx 文件，加入 store 配置信息：

```javascript
// 导入生产者用于注入store库
import { Provider } from 'react-redux';
// 导入store库
import Store from '@/models/store';

// ...
Root.render(
  // 使用生产者组件包裹路由组件，使得每个路由所访问的组件都会被生产者组件包裹并注入store库
  <Provider store={Store}>
    <Router />
  </Provider>
);
```

然后回到我们的首页，将 store 中的数据渲染到页面中并且传入修改数据的方法：

```javascript
import React, { Component } from 'react';
// 导入connect用于读写store中的数据
import { connect } from 'react-redux';

class Index extends Component {
  render() {
    return (
      <div>
        <h1>{this.props.count}</h1>
        {/* 数字加减事件按钮 */}
        <button onClick={this.props.add}>+</button>
        <button onClick={this.props.sub}>-</button>
      </div>
    );
  }
}

// 通过connect方法将store中的数据及用于处理数据的方法以props的形式传入组件中
export default connect(state => state, {
  // action函数，这里返回的action对象必须包含有type属性
  // 调用action函数后返回的内容会被react-redux接收到并派发到store中去，由store分发给所有的reducer函数进行匹配处理
  add() {
    return { type: 'add' };
  },
  sub() {
    return { type: 'sub' };
  },
})(Index);
```

#### 2. 理解 Redux

通过上面的例子，我们知道了 Redux 大致的工作方式以及它的功能，通俗点来说，Redux 是通过 Context 在 root 下注入了一个全局可用的状态的管理工具。使用了 Redux 后，我们就可以比较简单地实现**统一的全局状态通讯**。

或者换个说法：Redux 其实只是一个高级的对象管理程序, 它内部存储了一棵对象树, 同时向外暴露了一些方法让我们可以通过调用这些方法来对树中的内容做一些增删改查的工作，同时会通过一些内部的事件订阅来通知所有的组件有哪些状态发生了变化，以便于我们的组件在对应的状态发生变化时进行状态更新和渲染。

### 二、相关名词解释

在开始理解之前，我们必须要了解一些术语和概念：

#### 1. Immutable 不可变性

在我们之前所学习到的与 JavaScript 有关的知识中，都在说 JavaScript 的自由的、可变的：

```javascript
const obj = { a: 1, b: 2 };
// 内存地址不变，但引用内容发生变化
obj.c = 3;

const arr = [1, 2, 3, 4];
// 内存地址不变，但引用内容发生变化
arr.push(5);
```

上面的代码，演示的是当我们定义了一个对象或数组以后，可以通过各种方式去改变它里面的内容而不会影响它在内存中的地址，这就是 JavaScript 的不可变性。

Immutable 的意思是不可以改变原有的对象或数组，如果需要改变，必须先复制原来对象或数组的引用，然后再去更新这个复制出来的对象

```javascript
const obj = { a: 1, b: 2 };
// 通过展开运算符可以轻易地复制原有对象中的属性，从而为变量建立一个全新的引用对象而不改变原有对象中的内容
const obj2 = { ...obj, c: 3 };

const arr = [1, 2, 3, 4];
const arr2 = [...arr, 5];
```

Redux 内部的状态比较机制是基于内存地址的，所以，如果我们在原对象中进行改变会导致 Redux 无法察觉到状态的变化，从而无法激活 subscribe 方法导致状态更新不能映射到组件中去，所以，Redux 要求我们所有的状态更新都是使用不可变的方式。

#### 2. store

store 是 redux 用于存储 state 数据的仓库，对于整个项目来说，它是一个由 createStore 方法创建的全局对象，它的内部提供了以下几种方法用于访问对象中的属性：

> getState 方法用于获取当前的状态树

> dispatch 方法用于派发 action 对象，redux 只允许使用这种方式来改变 store 中的状态

> subscribe 方法可以传入回调函数来创建一个订阅 store 中状态变化的监听器，每当 store 中的状态变化时，我们传入的回调函数就会被执行

> replaceReducer 用于替换 store 中的 reducer 函数，这是一个高级 API，尽量避免使用它

下面这段代码是在没有使用 react-redux 时实现组件中的状态管理，我们可以在这里去理解一下 redux 提供的用于访问 store 的那些方法：

```javascript
import { PureComponent } from 'react';
// 从redux中引入一个createStore
import { createStore } from 'redux';

// 定义一个reduce方法
// reduce方法需要两个参数，一个当前状态对象state，一个用于描述将要对store做些什么的对象
function clickReduce(state = { text: '这是什么' }, action) {
  // 如果是指定的点击事件，新建一个对象，将原有的state与新的属性合并后返回
  if (action.type === 'BTN_CLICK') {
    // 这里我们不能直接改变state的内容，只需要返回一个我们修改完成的对象就行
    return Object.assign({}, state, action);
  }
  // 如果不是，返回原有的state(无任何变动)
  return state;
}

// 新建一个状态仓库，Redux通过全局唯一的store对象管理项目中所有的状态
// createStore接受三个参数 (reducer, preloadedState, enhancer)
// 参数一, 必填 reducer 一个reduce或reduce的集合
// 参数二, 可选 preloadedState 一个state或state的集合
// 参数三, 可选 store增强器，一个柯里化工具
const store = createStore(clickReduce, { a: 'aa', b: 'bb' });
// 我们来看看store里面有些什么内容
// store.dispatch 用于向store派发action消息的方法
// store.getState 用于向store获取state的方法
// store.subscribe 用于监听store内部的值的变化，当它被调用时，我们可以拿到最新的store
console.log(store, store.getState());

// action对象
const clickAction = {
  // reduce里注册的事件type
  type: 'BTN_CLICK', // action用于区别与其它action的标记
  // 需要传入的状态
  text: '这是redux返回的内容', // payload必须是同步的
};

export default class MiniRedux extends PureComponent {
  constructor(props) {
    super(props);
    // 设定组件state为从store中获取
    this.state = store.getState();
  }

  componentDidMount() {
    // 我们可以理解为这是一个事件监听回调，类似于JQ中的on
    store.subscribe(() => {
      // 当store发生改变的时候，我们重新读取state
      console.log(store.getState(), 2222);
      this.setState(store.getState());
    });
  }

  btnClick() {
    // 通过store的dispatch方法去主动触发reduce，参数是一个action对象；
    // 类似于JQ中的trigger或是vue中的emit
    store.dispatch(clickAction);
  }

  render() {
    return (
      <div className="miniRedux">
        <span>{this.state.text}</span>
        <button onClick={this.btnClick}>点我</button>
      </div>
    );
  }
}
```

注：重申一遍，改变 store 的唯一合法途径就是通过 store.dispatch 给它派发一个 action!

#### 3. action

action 是一个用于描述怎样改变 state 的对象。它必须有一个属性 type，type 属性用于向 reducer 描述需要发生的变化，以及其它的我们在 reducer 中用于处理变化的属性，业内约定的属性名是 payload。reducer 在接收到这个 action 对象后，开始匹配其内部是否有匹配的处理程序，如果有，则按照定义的计算方式对 state 进行计算并返回，如果没有，则返回之前的 state。

```javascript
// action对象
const action = {
  // type 用于描述做什么事情
  type: 'add',
  // payload传递用于计算的参数及其它描述
  payload: Math.ceil(Math.random() * 100),
};
```

**action creator：**用于创建 action 的函数，它的功能是当我们需要传递变量时可以避免每次变量发生变化都要重写 action 对象：

```javascript
/**
 * action生成器
 * @param {any} payload 需要传递给reducer的计算参数
 * @returns action
 */
function actionCreator(payload) {
  return {
    type: 'add',
    payload,
  };
}
```

#### 4. reducer

reducer 是用来创建 store 中 state 的方法，同时也是用于处理 store 中接收到的 action 对象的方法，它是一个**纯函数**，也就是说它的返回值只允许使用 state 和 action 来计算，而且在计算的过程中不会影响外部变量。reducer 方法接受两个参数：

- 参数一 state

用于初始化 store 中的属性，它被定义成一个需要有默认值的参数。当我们的项目运行时，redux 会将当前的 reducer 函数名作为 key，以默认值为 value 存储在 store 中；当我们通过 dispatch 派发 action 时，redux 会将当前 store 中对应的属性作为这个参数传入，然后根据 action 的描述来决定是否修改并返回新的 state。需要注意的是，即便是我们没有任何修改也必须返回原有的 state，否则会造成 store 中当前对应的属性值被修改为 undefined。

- 参数二 action

```javascript
/**
 * reducer方法
 * @param {object} state 存入到store中的状态集，必须指定默认值，否则会导致错误发生
 * @param {object} action 用于描述变化的对象
 * @returns state 返回到store中的状态集，如果没有变化也必须返回原有的state，否则会导致错误发生
 */
function reducer(state = { count: 0 }, action) {
  switch (type) {
    case 'add':
      // 必须在保证原有数据结构的基础上作修改，否则会造成状态丢失导致组件发生错误
      return { ...state, count: state.count + action.data };
    default:
      // 没匹配成功也需要返回state，否则会导致store中的state变成undefined从而导致组件发生错误
      return state;
  }
}
```

reducer 函数必须符合以下规则：

- 仅使用 state 和 action 参数计算新的状态值

- 禁止直接修改 state。必须通过复制现有的 state 并对复制的值进行更改的方式来做**不可变更新**（immutable updates）。

- 禁止任何异步逻辑、依赖随机值或导致其他“副作用”的代码

reducer 还有一个比较核心的问题, 就是 state 数据结构的规划。我们应该尽量避免嵌套的数据结构, 而应该尽量定义为扁平的数据结构, 这个思想其实有点类似于关系型数据库（如 MySQL）的数据组织方式。这一部分讲起来比较冗长, 就不在这里详细论述了, 目前从学校已经毕业的其他同学那里, 也没有反馈过这种面试题, 所以大家也不必要深究, 只需要**记得, 尽量扁平化**。

#### 5. 纯函数

纯函数是来自于函数式编程中的概念：

- 输入输出数据流是显式的：如果函数的调用参数相同，则永远返回相同的结果。

> 它不依赖于程序执行期间函数外部任何状态或数据的变化，必须只依赖于其输入参数; 这个函数不会产生任何可观察的副作用，例如网络请求。

```javascript
// 纯函数
function a(b, c) {
  return b + c
}
a(1,2)

// 非纯函数
let b = 1;
function a(c) {
  return b + c
}
a(2)
let aa = 2;
let bb = 3;

function a(aa, bb) {
  bb = 2
  return aa + bb
}

function b(aa, bb) {
  return aa * bb
}
a(aa, bb)
b(aa, bb)

// 它没有尝试去改变外部环境的任何内容，只是将输入的参数经过计算后返回
handlerValue() {
  const a = 'abc';
  const b = 'xyz';
  return a
}
// 它尝试着改变state的内容，所以它是个非纯函数
onChage() {
  this.setState({
    inputValue: this.handlerValue(this.refs.input.value)
  })
}

```

> 可观察的副作用就是会引起页面显示内容变化的操作, 比如我们去修改一个元素外的变量或者试图修改传入的参数。

> 纯函数的主要好处是它们使得我们维护和重构代码变得更加容易。我们可以随时随地放心地重构一个纯函数而不必担心因为没注意到的修改影响到整个应用。

#### 6. compose

compose 是来自于函数式编程中的方法，它的功能是在我们写深度嵌套函数时，避免代码的向右偏移。比如，有这样一个几个函数：

```javascript
const multiply = price => price * 20;
const divide = price => price / 100;
const normalize = price => price.toFixed(2);
```

我们需要如下三个步骤：

> 调用第一个函数，将传入的价格乘以 20

> 调用第二个函数，将上一步返回的值除以 100

> 调用第三个函数，将上一步返回的值转换成字符串格式并保留两位小数

```javascript
// 逐步实现
const price = 200;
const multiplyPrice = multiply(price);
const dividePrice = divide(multiplyPrice);
const result = normalize(dividePrice);

// 或者嵌套调用
normalizePrice(divide100(multiply20(200)));
```

上面的代码，要么就是步骤太多而且需要定义太多的变量，要么就是因为太多层的嵌套导致代码在后期维护变得非常困难。而 compose 方法可以让我们的代码更加容易维护：

```javascript
// javascript并没有提供compose方法，一般都是使用第三方或干脆自己手写

function compose(...funs) {
  // 返回一个函数用于接收参数
  return function (price) {
    // 使用array的reduce方法实现函数的逐个执行
    // reduce方法是从左至右执行的，如果有必要，我们也可以使用reduceRight从右至左来执行函数
    return funs.reduce((res, fn) => fn(res), price);
  };
}

// 实现上面的需求
const handlerPrice = compose(multiply, divide, normalize);
// 调用函数计算
const result = handlerPrice(200); // 40.00
```

#### 7. Redux 三大原则

- 单一数据源: 整个应用的 State 存储在全站唯一的一个 Store 中的对象/状态树里

> 单一的 State 树可以更容易地跟踪变化、进行调试或检查应用程序

- State 是只读的: 改变状态的唯一方法是去触发一个 Action

> 这样确保了视图或网络请求或其它用户操作都无法直接修改 State, 而只能通过 Action 来表示需要改变的意图。Action 只是一个用来描述变化的普通 JS 对象。就像 State 是数据的最小表示一样, 该操作是对数据更改的最小表示;

- 使用纯函数来修改 State

> 为了指定状态树如何通过操作进行转换, 我们需要一个纯函数来处理参数并返回我们处理过的内容, 纯函数是那些返回值仅取决于其参数值的函数。

---

### 三、Redux 提供的 API

#### 1.createStore

上面的例子中已经有提到过这个 api，我们通过调用这个 api 并传入一些 reducer，redux 会返回一个 store 给我们

```javascript
// 本段代码来自于官网
import { createStore } from 'redux';

function todos(state = [], action) {
  switch (action.type) {
    case 'ADD_TODO':
      return state.concat([action.text]);
    default:
      return state;
  }
}

// createStore返回的是一个state对象树，我们将它称之为store
const store = createStore(todos, ['Use Redux']);

store.dispatch({
  type: 'ADD_TODO',
  text: 'Read the docs',
});

console.log(store.getState());
// [ 'Use Redux', 'Read the docs' ]
```

createStore 方法接受三个参数：

> reducer: Function 类型，必填参数。用于定义 state 和处理 action 的函数，它的返回结果是新的 state。

> preloadedState: any 类型，可选参数，初始化 store 时传入，因为我们大多数情况都是使用 reducer 来设定 store 库中的状态，所以，这个参数可以暂时忽略。

> enhancer: Function 类型，可选参数，当我们需要使用一些中间件比如 redux-promise 时需要 applyMiddleware 等。

#### 2.combineReducers

因为 createStore 方法只能接受一个 reducer 函数，但是为了更方便地管理状态，更多的时候我们可能会希望状态能更加扁平化，所以这里就需要使用多个 reducer 来管理数据，而 combineReducers 这个方法就是用于将多个 reducer 函数合并成一个函数，同时以 reducer 函数名作为 store 中的属性名，分别管理各自的状态：

```javascript
function reducer1(state = {a: null}, action) {}
function reducer2(state = {b: null}, action) {}

// 合并reducer函数
const reducers = combinReducers({ra: reducer1, rb: reducer2})

// 调用createStore方法创建store库
const store = createStore(reducers)
// store对象的属性
{
  ra: {
    a: null
  },
  rb: {
    b: null
  }
}
```

#### 3.applyMiddleware

applyMiddleware 函数是 redux 推荐的用于扩展 redux 功能的一种方式。我们可以通过使用 Middleware 来实现对 store 的 dispatch 进行功能增强。例如，redux-thunk 支持 dispatch function，以此让 action creator 控制反转。被 dispatch 的 function 会接收 dispatch 作为参数，并且可以异步调用它。这类的 function 就称为 thunk。另一个 middleware 的示例是 redux-promise。它支持 dispatch 一个异步的 Promise action，并且在 Promise resolve 后可以 dispatch 一个普通的 action。

```javascript
//
import { createStore, applyMiddleware } from 'redux';
import todos from './reducers';

function logger({ getState }) {
  return next => action => {
    console.log('will dispatch', action);

    // 调用 middleware 链中下一个 middleware 的 dispatch。
    const returnValue = next(action);

    console.log('state after dispatch', getState());

    // 一般会是 action 本身，除非
    // 后面的 middleware 修改了它。
    return returnValue;
  };
}

const store = createStore(todos, ['Use Redux'], applyMiddleware(logger));

store.dispatch({
  type: 'ADD_TODO',
  text: 'Understand the middleware',
});
// (将打印如下信息:)
// will dispatch: { type: 'ADD_TODO', text: 'Understand the middleware' }
// state after dispatch: [ 'Use Redux', 'Understand the middleware' ]
```

附录：[常用中间件](./middleware.md)

#### 4.compose

compose，我们在上面有讲到，compose 它的功能是将多个函数组合成一个函数。这个其实是函数式编程中的方法，为了方便才把它集成到了 Redux 中。因为 createStaore 的第三个参数只能是一个函数，但往往我们需要用到较多的增强函数，比如我们同时需要中间件支持，也需要 devtools 支持，像这种情况我们只能通过 compose 来对这两个函数进行组合：

```javascript
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import DevTools from './containers/DevTools';
import reducer from '../reducers';

// 调用 createStore 创建store
const store = createStore(
  reducer,
  compose(
    // 应用thunk中间件和devTools
    applyMiddleware(thunk),
    DevTools.instrument()
  )
);
```

##### 5.bindActionCreators

---

### 四、react-redux

因为 Redux 并非是为 React 定制开发的, 所以我们在平时使用中与 React 配合还需要另一个库 React-Redux, 这是一种被称之为“绑定”(官方文档中称之为 binding)的方法, 用来把 React 和 Redux 集成到一块工作。

#### 1. Provider

provicer 组件是基于 Context 开发的，它的主要功能是将我们通过 CreateStore 方法创建的 store 注入到 React Root 组件中，这样我们就可以在项目中任意一个组件中读取到 store 中的内容：

```javascript
// 导入Provider组件
import { Provider } from 'react-redux'
// 导入创建完成的store库
import Store from '@/models/store'
import Router from '@/routes/router'

const Root = ReactDOM.createRoot(document.getElementById('root'))

Root.render(
  {/* 这里的store，与Context中的value一致 */}
  <Provider store={Store}>
    <Router />
  </Provider>
)
```

#### 2. connect

connect，用于在调用组件时将 state 与 action creator 注入到组件的 props 中去。connect 接受 4 个不同的参数，这些参数都是可选的：

##### param a: mapStateToProps

从名字可以看出，mapStateToProps 是用于将 store 中的状态映射到组件的 props 中去的方法，如果我们在 connect 中传入了 mapStateToProps，表示这个组件将会在每一次 store 发生变化时进行更新。如果不需要更新，可以不传，或传入 null。

mapStateToProps 必须是一个函数，当函数被调用时会传入两个参数：

> state: store 中最新的状态

> ownProps: 父组件传下来的 props，这是一个可选参数，如果 mapStateToProps 方法接受了这个参数，表示注入到组件中的状态是需要与 props 进行计算的，当 props 发生变化时，mapStateToProps 方法也会被重新执行。

```javascript
function mapStateToProps(state, ownProps) {
  // 返回的对象会被合并到当前组件的props当中去，我们可以通过this.props[属性名]直接获取到
  return {
    // 取出的数据依赖于props中的id属性，当store中的属性发生变化或props中的状态发生变化都会重新获取
    data: state.data[ownProps.id],
  };
}
```

##### param b: mapDispatchToProps

将 dispatch 映射到组件中去。如果我们在 connect 中传入了 mapDispatchToProps，表示我们的组件中某些事件需要派发 action 以改变 store 中的状态。如果不需要改变 store 中的状态可以不传或传入 null。

mapDispatchToProps 可以是函数也可以是一个对象，当它是函数时，被调用时也会传入两个参数：

> dispatch: redux 的 dispatch 方法，用于在函数中生成并派发 action

> ownProps: 可选参数，与 mapStateToProps 中的 ownProps 功能与用法一致

```javascript
function mapDispatchToProps(dispatch, ownProps) {
  // 这个对象也会被合并到当前组件的props中去，我们可以通过this.props[属性名]直接获取到
  return {
    // 通过调用this.props.add方法来激活reducer中对应的add方法并传入参数
    add(payload) {
      dispatch({ type: 'add', payload });
    },
    // 根据最新的props中的某个属性进行计算后再派发
    reset() {
      dispatch({ type: 'reset', payload: data[ownProps.id] });
    },
  };
}
```

当 mapDispatchToProps 是一个对象时，我们需要传入 actionCreator 方法：

```javascript
function add(payload) {
  return {
    type: 'add',
    payload,
  };
}
const mapDispatchToProps = {
  add,
};
```

当一个项目比较简单，页面状态不多时，我们可以使用第一种方式，通过传入一个 mapDispatchToProps 来实现 action 的派发。但是当一个项目非常复杂时，最好还是**使用对象的方式来传入 actionCreator**，然后我们需要将所有的 reducer 和 actionCreator 都放到 models 目录下，这样第一个我们可以**减少组件的复杂度，让数据与表现分离**，让组件只需要实现渲染；第二个，统一的 actionCreator 目录可以让我们**更方便地复用**；第三个，更加符合企业代码的规范。

##### param c: mergeProps

mergeProps，将前两个参数的返回值进行计算后再合并到当前 props 中去，如果不传这个参数，组件的合并规则是 Object.assign({}, ownProps, stateProps, dispatchProps)

```javascript
/**
 * @param {object} stateProps mapStateToProps函数的执行结果
 * @param {object} dispatchProps mapDispatchToProps函数的执行结果
 * @param {object} ownProps 父组件传入的state
 * @returns 需要注入到组件的props，必须返回，否则当前组件无法接收到任何参数
 */
function mergeProps(stateProps, dispatchProps, ownProps) {
  return { ...ownProps, ...dispatchProps, ...stateProps };
}
```

**注意: 如果传入了这个参数就必须有返回值，否则会导致当前组件无法接收到任何 props。**

##### param d: options

options 是一个对象，用于定制 connect 的行为，当发生 store 中变化的数据与当前组件无关时，我们可以在这里进行 shouldComponentUpdate 操作。options 接受以下几个属性：

> areStatesEqual: Function 比较新旧两次的 state 是否有变化，返回 true 表示数据一致，不更新组件

```javascript
connect({mapStateToProps, mapDispatchToProps, mergeProps, {
  areStatesEqual(next, prev) {
    // 只有在state里的count属性发生变化时才会更新组件
    return next.count === prev.count
  }
}})
```

> areOwnPropsEqual: Function 比较新旧两次的 props 是否有变化，返回 true 表示数据一致，不更新组件

> areMergedPropsEqual: Function 比较新旧两次合并完成后的 props 是否有变化，返回 true 表示数据一致，不更新组件

...还有一些其它的属性，我们基本上不会用到，所以在这里就省略了...

---

### 什么时候应该用 Redux

- 随着单页面应用变得越来越复杂, 正确地管理状态这一需求更加重要。什么时候用 redux, 什么时候不应该用 redux?

> 有一个说法是这样的：除了管理我们熟知的组件状态, 应用可能还需要管理：服务器响应、缓存的数据（例如用户）、尚未保存到服务器上的本地数据；除此之外, UI 状态也越来越复杂。同一应用可能还需要跟踪：当前路由、当前选择的标签页、页码控件等, Redux 便因此而生, 它专门用于管理上述所有这些内容。

> 于是我们试着排除上面这些, 如果我们的应用并没有这么多复杂的状态需要管理呢？比如在我们只需要使用 props 或 context 就能解决问题的情况下, 我们有必要使用 Redux 吗。答案是肯定的, redux 这东西, 能不用就不用。使用它除了给应用增加一堆复杂代码以外, 并没有任何好处。
