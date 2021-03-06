> Marion 的 react 实战课程 > 第三部分 > 什么是 Redux

## 什么是 Redux

- 由于 React 并没有官方的状态管理机制, 所以 Redux 其实是 React 事实上的状态管理工具, 提供一个应用于 JavaScript 的可预测的状态容器, 提供可预测的状态管理。

> 因为我在使用 React 时并没有太复杂的应用需要使用 Redux, 所以我也是在最近在梳理 React 知识的过程中学习的 Redux, 有些词语描述的可能不是太精准, 大家理解这个意思就行。

> 在我看来, Redux 其实只是一个简单的对象管理程序, 它内部存储了一棵对象树, 向外暴露了一些方法让我们对这个树中的内容做一些增删改查的工作。 它可以应用在任何的 JS 程序中, 包括 vue 或 jquery, 而不是仅适用于 React。

> 因为 Redux 并非是为 React 定制开发的, 所以我们在平时使用中与 React 配合还需要另一个库 React-Redux, 这是一种被称之为“绑定”(官方文档中称之为 binding)的方法, 用来把 React 和 Redux 集成到一块工作。

---

## 什么是状态, 为什么要使用 Redux 来管理状态

- 所谓状态, 一般用来描述人或事物表现出来的形态。是指某种事物处于生成、生存、发展、消亡时期或各转化临界点时的形态或事物态势。在这里可以简单地理解为变量, 即 React 组件自身的一些能影响它自己长什么样子的变量。

> Redux 可以帮助我们更好地管理应用的共享状态, 这就是我们平时说的组件通讯。

> 因为 React 只能通过 Props 来处理一些简单的父子组件的通讯, 通过 Context 来处理一些深层嵌套的组件的通讯, 但对于兄弟节点、两个不相关的节点等这些状态的管理就有些力不从心了。

> 而 Redux 作为一个“前端状态管理器”, 不仅能让我们方便且有条理地存储状态数据, 还能容易地在任何位置快速获取指定的数据, 我们只需要告诉 Redux 需要哪个数据, 它就会处理好一切后将数据传出。

---

## Redux 有三大原则, 分别是哪些原则

- 单一数据源: 整个应用的 State 存储在全站唯一的一个 Store 中的对象/状态树里

> 单一的 State 树可以更容易地跟踪变化、进行调试或检查应用程序

- State 是只读的: 改变状态的唯一方法是去触发一个 Action

> 这样确保了视图或网络请求或其它用户操作都无法直接修改 State, 而只能通过 Action 来表示需要改变的意图。Action 只是一个用来描述变化的普通 JS 对象。就像 State 是数据的最小表示一样, 该操作是对数据更改的最小表示;

- 使用纯函数来修改 State

> 为了指定状态树如何通过操作进行转换, 我们需要一个纯函数来处理参数并返回我们处理过的内容, 纯函数是那些返回值仅取决于其参数值的函数。

---

## 什么是纯函数

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

---

## 什么是 Action

- Action 是把数据从**应用**传到 store 的有效载荷。它是 store 数据的唯一来源。在不使用任何插件的情况下，我们需要通过 store.dispatch() 将 action 传回到 store。

> 这里之所以不叫 view 是因为这些数据有可能是服务器响应, 用户输入或其它非 view 的数据

```javascript
{
  type: 'ORDER_DISHES',              // 描述动作
  payload: '谁谁谁要了一份西红杮炒鸡蛋'  // 描述内容
}
const reducer = function(state = '最简单的redux', action) {
  if (action.type === 'changeText') {
    // 我们把action里的内容直接返回，redux会将这个返回值写到store中对应的属性里
    // 这样我们下一次getState时就是新的内容了
    return action.text;
  }
  return state;
}
```

Action 本质上是一个 JavaScript 普通对象。所以我们约定, Action 内必须使用一个字符串类型的 Type 字段来表示将要执行的动作。多数情况下, Type 会被定义成字符串常量。当应用规模越来越大时, 可以使用单独的模块或文件来存放 Action

```javascript
// actionTypes.js
export const ORDER_DISHES = "ORDER_DISHES";

// action.js
import { MSG_NAME } from "../actionTypes";

export function orderDishes() {
  return {
    type: "ORDER_DISHES", // 描述动作
    payload: "谁谁谁要了一份西红杮炒鸡蛋", // 描述内容
  };
}

// 注意：reduce方法接受两个参数
// 参数一是一个函数, 该函数接受两个参数, 如果调用reduce时没有传入第二个参数, 就是数组的第一个元素, 如果传值就是传进来的值
// 比如这里, 我把上面定义的elList传了进来, 那参数一就是esList
// 参数二是当前循环的数组元素
```

reduxDevTools 的安装

reducer 使用中的一些注意事项

1. reducer 要求必须是一个“纯函数”, 也就是不要调用任何可能引起副作用的操作, 如发起网络请求等。
2. reducer 的返回值必须是一个新的对象, 它的 previousState 参数一定不能被修改
3. reducer 还有一个比较核心的问题, 就是 state 数据结构的规划。我们应该尽量避免嵌套的数据结构, 而应该尽量定义为扁平的数据结构, 这个思想其实有点类似于关系型数据库（如 MySQL）的数据组织方式。这一部分讲起来比较冗长, 就不在这里详细论述了, 目前从学校已经毕业的其他同学那里, 也没有反馈过这种面试题, 所以大家也不必要深究, 只需要记得, 尽量扁平化。

---

## 一个纯的 Redux Demo

```javascript
import { PureComponent } from "react";
// 从redux中引入一个createStore
import { createStore } from "redux";

// 定义一个reduce方法
// reduce方法需要两个参数，一个当前状态对象state，一个用于描述将要对store做些什么的对象
function clickReduce(state = { text: "这是什么" }, action) {
  // 如果是指定的点击事件，新建一个对象，将原有的state与新的属性合并后返回
  if (action.type === "BTN_CLICK") {
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
const store = createStore(clickReduce, { a: "aa", b: "bb" });
// 我们来看看store里面有些什么内容
// store.dispatch 用于向store派发action消息的方法
// store.getState 用于向store获取state的方法
// store.subscribe 用于监听store内部的值的变化，当它被调用时，我们可以拿到最新的store

console.log(store, store.getState());

// action对象
const clickAction = {
  // reduce里注册的事件type
  type: "BTN_CLICK", // action用于区别与其它action的标记
  // 需要传入的状态
  text: "这是redux返回的内容", // payload必须是同步的
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

## 什么时候应该用 Redux

- 随着单页面应用变得越来越复杂, 正确地管理状态这一需求更加重要。什么时候用 redux, 什么时候不应该用 redux?

> 有一个说法是这样的：除了管理我们熟知的组件状态, 应用可能还需要管理：服务器响应、缓存的数据（例如用户）、尚未保存到服务器上的本地数据；除此之外, UI 状态也越来越复杂。同一应用可能还需要跟踪：当前路由、当前选择的标签页、页码控件等, Redux 便因此而生, 它专门用于管理上述所有这些内容。

> 于是我们试着排除上面这些, 如果我们的应用并没有这么多复杂的状态需要管理呢？比如在我们只需要使用 props 或 context 就能解决问题的情况下, 我们有必要使用 Redux 吗。答案是肯定的, redux 这东西, 能不用就不用。使用它除了给应用增加一堆复杂代码以外, 并没有任何好处。
