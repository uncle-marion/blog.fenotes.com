> Marion 的 react 实战课程 > 第三部分 > React 全局状态管理

之前在组件中有提到，React 中的状态管理工具库目前比较流行的有 mobx 与 redux，因为时间有限，我们优先学习 redux。对于 mobx，有时间我们会用一到两节课时来学习，否则就只能让大家自学了。

### 一、什么是 Redux

- Redux 是用于解决 React 没有官方的状态管理机制问题的, 所以 Redux 其实是 React 事实上的状态管理工具, 它的功能是提供一个应用于 JavaScript 的可预测的状态容器, 提供可预测的状态管理。

这句话是官方的解释，但可能大多数同学还是没有办法理解 Redux，所以为了让大家能更好地理解什么是 redux，我们先不去理解 Redux，只是在项目中使用 redux 简单地实现一个状态管理操作：

1. #### Redux 的简单配置

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

2. #### 理解 Redux

通过上面的例子，我们知道了 Redux 大致的工作方式以及它的功能，通俗点来说，Redux 是通过 Context 在 root 下注入了一个全局可用的状态的管理工具。使用了 Redux 后，我们就可以比较简单地实现**统一的全局状态通讯**。

或者换个说法：Redux 其实只是一个高级的对象管理程序, 它内部存储了一棵对象树, 同时向外暴露了一些方法让我们可以通过调用这些方法来对树中的内容做一些增删改查的工作，同时会通过一些内部的事件订阅来通知所有的组件有哪些状态发生了变化，以便于我们的组件在对应的状态发生变化时进行状态更新和渲染。

---

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

store 是 redux 用于存储数据的仓库，对于整个项目来说，它是一个由 createStore 方法创建的全局对象，它的内部提供了以下几种方法用于访问对象中的属性：

- getState

getState 方法用于获取当前的状态树

- dispatch

dispatch 方法用于派发 action 对象，redux 只允许使用这种方式来改变 store 中的状态

- subscribe

subscribe 方法可以传入回调函数来创建一个订阅 store 中状态变化的监听器，每当 store 中的状态变化时，我们传入的回调函数就会被执行

- replaceReducer

replaceReducer 用于替换 store 中的 reducer 函数，这是一个高级 API，尽量避免使用它

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

- action creator

用于创建 action 的函数，它的功能是当我们需要传递变量时可以避免每次变量发生变化都要重写 action 对象：

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

纯函数是来自于数学中的概念：

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

#### 6. 三大原则

- 单一数据源: 整个应用的 State 存储在全站唯一的一个 Store 中的对象/状态树里

> 单一的 State 树可以更容易地跟踪变化、进行调试或检查应用程序

- State 是只读的: 改变状态的唯一方法是去触发一个 Action

> 这样确保了视图或网络请求或其它用户操作都无法直接修改 State, 而只能通过 Action 来表示需要改变的意图。Action 只是一个用来描述变化的普通 JS 对象。就像 State 是数据的最小表示一样, 该操作是对数据更改的最小表示;

- 使用纯函数来修改 State

> 为了指定状态树如何通过操作进行转换, 我们需要一个纯函数来处理参数并返回我们处理过的内容, 纯函数是那些返回值仅取决于其参数值的函数。

---

### 三、react-redux

因为 Redux 并非是为 React 定制开发的, 所以我们在平时使用中与 React 配合还需要另一个库 React-Redux, 这是一种被称之为“绑定”(官方文档中称之为 binding)的方法, 用来把 React 和 Redux 集成到一块工作。

- #### 不使用 React-Redux 实现状态管理

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

---

### 什么时候应该用 Redux

- 随着单页面应用变得越来越复杂, 正确地管理状态这一需求更加重要。什么时候用 redux, 什么时候不应该用 redux?

> 有一个说法是这样的：除了管理我们熟知的组件状态, 应用可能还需要管理：服务器响应、缓存的数据（例如用户）、尚未保存到服务器上的本地数据；除此之外, UI 状态也越来越复杂。同一应用可能还需要跟踪：当前路由、当前选择的标签页、页码控件等, Redux 便因此而生, 它专门用于管理上述所有这些内容。

> 于是我们试着排除上面这些, 如果我们的应用并没有这么多复杂的状态需要管理呢？比如在我们只需要使用 props 或 context 就能解决问题的情况下, 我们有必要使用 Redux 吗。答案是肯定的, redux 这东西, 能不用就不用。使用它除了给应用增加一堆复杂代码以外, 并没有任何好处。
