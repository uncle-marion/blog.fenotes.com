> Marion 的 react 实战课程 > 第一部分 > 组件通讯

## 什么是 state, 什么是 props, 简单说下它们的相同点与不同点

- state 是当前组件定义自己的状态的对象，props 是父组件向下传递的包含有一个或多个状态和方法的对象；
- props 和 state 的变化都会造成组件的重新渲染；
- props 可以被父组件的 setState 方法修改但不能被当前组件修改，state 可以被当前组件的 setState 方法修改但不能被父组件修改；
- state 和 props 都是管理状态的容器，但 state 只存在于组件本身，当它被传往子组件时就自动成为了 props，子组件只能通过 props 来读取它里面的属性和方法。

## setState 是同步还是异步, 大致描述下它的实现思路

setState 方法默认是同步执行的；

但它内部有一个变量，这个变量的名字记不太清了，为了方便表达，先暂时将它命名为"变量 A"吧。"变量 A"的作用是判断当前是否正在更新 state，如果没有更新，它就会立即更新 state，这就是我们平时所说的同步更新；

而如果正在更新 state，为了避免同时修改某个状态导致出错，setState 方法会将接收到的 state 放到一个叫"变量 B"的队列里，等待上一个更新完成后再进行更新；这就是我们平时所说的异步更新。

当我们在 react 生命周期方法中调用 setState 时，react 的生命周期会自动调用一个方法，修改"变量 A"的状态为正在更新状态，所以，我们传入的 state 只能被放到"变量 B"的队列里等待稍后更新，展现出来的效果就是异步更新。

然后在一些类似于 setTimeout 方法中或其它异步操作中，因为 react 无法感知到具体的渲染顺序，为了避免出错，所以会强行修改"变量 A"的值为未更新状态，这样 setState 调用时就会直接修改 state 中的内容，就是所谓的同步更新了。

## react 的组件通讯有哪些？具体描述至少一种

在 react 中较常见的组件通讯方法有以下几种

- props: 父子组件通讯
- context: 多级嵌套组件通讯
- event/emit: 通过一个事件的订阅发布程序来实现不相关的组件间的通讯
- redux/mobx: 通过一些第三方的依赖来实现全局的组件通讯，一般来说它们都是通过 context 方法来实现的

- props 通讯详述

  > 通过在父组件中定义属性与方法，然后将它们以 attribute 的方式向下传递给子组件，子组件以 props 的方式来获取这些属性用于渲染，
  > 调用这些方法用于把参数传往父组件；

- context 详述

  > context 主要用于解决多层级嵌套子组件的通讯问题，为了减少中间组件对于无关状态的透传问题，react.context 提供了一个叫 Provider(生产者)的组件，我们可以通过这个组件的 value 属性，向下传递一个对象，这个对象里包含我们需要通讯的属性和方法；react.context 还提供了一个叫 consumer(消费者)的组件，我们可以在当前组件的嵌套组件中使用 consumer 组件来获取 provider 的 value 属性中的方法和属性用于渲染或调用。

- event/emit

  > 这种方法是我在最早的时候，刚接触 react，不是很能理解 context，也没学习 redux 的时候用的。因为我所在的公司没有太多规范，而且前端成员也不是很多，基本上都是一个人负责一个项目，平时也没有人可以请教，在为了解决兄弟组件通讯的时候，想到 vue 的$emit，觉得很好用，所以就在 react 里自己写了一个方法，然后将它绑定到了 react 对象上，在需要通讯的组件中通过调用方法向外暴露的 addEventListener 方法注册事件，在另一个组件中通过 emit 方法来发布事件。

- redux/mbox
  > 第三方的通讯工具，redux 好像是 react 官方维护的一个状态管理工具，使用起来比较麻烦，需要 createStore\reduce\action 等比较多的 api 和 redux-thunk\redux-promise 等一些中间件来完成通讯，我不是很常用，不过基本使用流程还是了解的，用起来也没有什么问题。而 mbox 是一个类似于 vuex 的状态管理工具，以前的我不太了解，最近的新版本我用起来感觉像 vuex 一样，很好用。只需要在同一个类中创建属性和方法，然后使用 inject 方式将这些属性和方法注入到组件中就可以直接使用了。

## 简述 react 类组件的生命周期方法

我不太清楚您需要了解的是哪个生命周期，早先的 16.3 版本以前的生命我只是稍有些了解，因为之前的公司没有项目使用 react，我入职前不久才有的 react 项目，所以我只是对一些常用的 16.4 以后的生命周期比较了解。具体来说，react 类组件的生命周期分为三个阶段：挂载期、更新期和销毁期。

挂载期的第一个方法是 constructor，就是 es6 中类的构造函数，我们在这里去定义或计算当前组件需要的状态；第二个方法是 render，这个方法是一个公用方法，在更新期中也会被调用，它的作用是将我们写在方法中的 jsx 代码渲染到虚拟 DOM 中去；第三个方法是 componentDidMount，这个方法是页面首次加载完成后调用的，一般来说我们可以在这个方法中去定义计时器或请求异步数据。

更新期，更新期的第一个方法是 shouldComponentUpdate，这个方法主要是为了解决父组件状态发生变化导致子组件重新渲染问题的，它里面提供了新的 props 和 state 属性，我们通过将新属性与旧属性比较来判断当前改变的属性是否真的需要更新我们的组件；第二个方法是 render，刚才已经说过了；第三个方法是 componentDidUpdate，它与 componentDidMount 一样，是在组件被渲染完成后被调用，与 componentDidMount 不同的是，componentDidMount 在组件中一定会被调用而且只调用一次，而 componentDidUpdate 会在每次状态发生变化时被调用，可以调用多次，如果没有状态发生变化，它也可能永远不会被调用。

卸载期，这个生命周期里只有一个方法，componentWillMount，表示组件即将被制裁，当前组件里的一些计时器什么的需要赶紧清除。

## 简述 react 类组件的渲染流程

> 第一步：使用 constructor 方法创建组件内部需要的状态  
> 第二步：调用 render 方法将状态以 jsx 方式渲染到 DOM 中  
> 第三步：监听状态的变化，实时更新虚拟 DOM 中的内容并将其渲染到真实 DOM 中

## 简述 react 类组件的优化方法

react 类组件的优化有两种方法，都是为了避免父组件状态更新而导致子组件被重新渲染问题的。

第一个方法是直接使用 React.PureComponent 来取代 React.Component，PureComponent 这个类有一个内置的 props 比较方法，它会对每次 props 的改变进行比较，如果 props 的引用地址没有发生变化就不会重新渲染当前的组件，因为它是浅比较，如果我们对 props 中某个引用类型的值进行改变时，它不会监听到内部的变化而导致组件无法正常渲染

第二个方法就是 shouldComponentUpdate，我们可以在这个方法里比较旧的 props 和新的 props 以及旧的 state 与新的 state 来判断是否需要渲染组件；

## redux 的三大原则是什么

- 单一数据源: 整个应用的 State 存储在全站唯一的一个 Store 中的对象/状态树里

> 单一的 State 树可以更容易地跟踪变化、进行调试或检查应用程序

- State 是只读的: 改变状态的唯一方法是去触发一个 Action

> 这样确保了视图或网络请求或其它用户操作都无法直接修改 State, 而只能通过 Action 来表示需要改变的意图。Action 只是一个用来描述变化的普通 JS 对象。就像 State 是数据的最小表示一样, 该操作是对数据更改的最小表示;

- 使用纯函数来修改 State

> 为了指定状态树如何通过操作进行转换, 我们需要一个纯函数来处理参数并返回我们处理过的内容, 纯函数是那些返回值仅取决于其参数值的函数。

## 什么是 action

action 是用来告诉 store 应该怎么改变的一个对象，它里面有两个属性，一个是 type，type 对应的是 reduce 里的方法，我们将它称之为对改变的描述；一个是 payload，payload 是我们需要改变的某个状态的值，我们将它称之为具体需要改变的内容，一般来说，我们需要通过 store.dispatch 方法来将 action 派发到 store 中，再由 store 来匹配对应的 reduce 方法对 payload 进行处理后将它返回给 store 自身。但现在我们一般都会使用 react-redux 来绑定 store 与组件，所以现在基本都不会写 dispatch 了。

## 什么是 reduce

reduce 是 store 用来管理自身内部状态的方法，store 中每一条状态都对应一个 reduce 方法，当我们通过 dispatch 派发一个 action 时，redux 会比较 type 的值来寻找对应的方法用于处理 action 中的 payload 属性，并将处理完成后的属性返回给 store。

## redux 常用的 API

- creactStore
  > 创建一个 store, 创建 store 的时候必须至少有一个 reduce, 这个 reduce 负责提供初始的状态和管理状态的方法
- getState
  > 用于获取 store 中最新的状态，在没有 react-redux 的时候，我们需要自己通过这个方法手动去获取 store 中的内容；
- subscribe
  > 订阅 store 中变化的回调，在没有 react-redux 的时候，我们需要在生命周期函数里通过这个方法来订阅 store 中的变化并通过 getState 方法来获取最新的状态；
- dispatch
  > 派发一个变化的描述(action)到 store，在我们需要改变 store 中的内容时，必须使用这个方法派发一个 action 对象来对 store 中的内容进行修改；

## react-redux 的常用 API

- Provider
  > 来自于 React.context 的生产者组件，react-redux 使用它来将整个 store 传入到当前组件所有的嵌套子组件里，使用方式与 context 一致，用这个组件包裹需要向下传递状态的组件，再将 store 以 props 的形式写入到 Provider 组件即可。
- connect

  > react-redux 的消费者组件，它负责订阅并更新 store 中的变化并将这个变化传递到组件中去。
  > connect 是一个高阶函数，它接受两个回调函数作为它的参数，然后返回一个高阶组件来装饰我们的组件，使我们的组件可以通过 props 来实时获取到 store 中的变化；
  > connect 接受的第一个函数 mapStateToProps 方法。这个方法会自动订阅库中的变化，并将最新的状态映射到我们的 props 中去。这是一个可选参数，当我们不需要它时则表示我们的组件并不需要依赖 redux 的状态来进行渲染；
  > connect 接受的第二个函数 mapDispatchToProps 方法。这个方法要求返回一个由 action 方法组成的对象，并将这个对象中的 action 方法映射到我们的 props 中，当我们在组件中调用 action 方法时，react-redux 会接收到方法中返回的 action 对象并将它们派发给 store 进行处理。

## redux 的中间件是什么

```javascript
let next = store.dispatch;
store.dispatch = action => {
  console.info('修改内容为：', action);
  next(action);
};
```

因为 redux 的 dispatch 方法只能接受一个对象作为它的参数，对于函数和异步调用等方法的则完全不支持。而 redux 的 applyMiddleware 方法就是一个用于增强改造 dispatch 的方法，它会分析接收到的每一个参数并将这个参数交给对应的中间件来处理。比如，当我们使用 applyMiddleware 方法注册了 redux-thunk 后，dispatch 在接收到一个函数时，就会将它丢给 redux-thunk 来处理，redux-thunk 在执行完这个函数后会将结果再次使用 dispatch 派发到 store，而这个过程中如果遇到了 promise 而我们又注册了 redux-promise 时，dispatch 又会将这个 promise 丢给 redux-promise 处理，一直这样执行下去，直到 dispatch 接收到的是一个标准的 action 对象才会被派发到 store 中去由 reduce 进行最后的处理。

```javascript
// redux-thunk的原码
function createThunkMiddleware(extraArgument) {
  return ({ dispatch, getState }) =>
    next =>
    action => {
      if (typeof action === 'function') {
        return action(dispatch, getState, extraArgument);
      }

      return next(action);
    };
}
const thunk = createThunkMiddleware();
thunk.withExtraArgument = createThunkMiddleware;

export default thunk;
```

```javascript
// redux-promise的原码
import isPromise from 'is-promise';
import { isFSA } from 'flux-standard-action';
export default function promiseMiddleware({ dispatch }) {
  return next => action => {
    if (!isFSA(action)) {
      return isPromise(action) ? action.then(dispatch) : next(action);
    }

    return isPromise(action.payload)
      ? action.payload
          .then(result => dispatch({ ...action, payload: result }))
          .catch(error => {
            dispatch({ ...action, payload: error, error: true });
            return Promise.reject(error);
          })
      : next(action);
  };
}
```

## redux-promise

技术面 选时，参与的时间点，买点及卖点确定；

基本面 选方向，选行业：每股收益，净利润，行业热度

w 底的特征：

1. 急跌缓加；
2. 第二次下跌时缩量（表示基本上没人卖了）且不会跌破上次的低点；
3. 第二次反弹时要突破上次的反弹价格

操作推荐：

1. 长期下跌或盘整趋势中，发现倒 N 形走势，下跌未踩破破上次低点且成交量急剧缩小（双底的初步形态）；
2. 股票开始反弹，且成交量缓慢回升（不能是爆涨，爆涨可能是有人在清仓）可进入一笔（极少量买入建仓观察）；
3. 回弹后如突破上次高点，这时基本可以确认 w 形态形成，在回落开始时卖出（可能卖出机会不是很多，不需要犹豫，甚至可以在回落前卖出，不用担心踏空）；
4. 观察回落是否会踩破上次高点，一般来说这里会在颈线位置盘整若干天，我们有机会观察，每次确认回落低点均在颈线之上，买入一笔（缓慢补仓，拒绝诱多）；
5. 后势上涨则继续观察，如发生回落，只要超过颈线，无论盈亏，必须清仓或仅仅保留 1 手用于观察未来走势，积累更多经验。
