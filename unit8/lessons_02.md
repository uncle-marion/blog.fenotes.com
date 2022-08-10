# lessons_02. dva 与 umi

## dva 是什么？

dva 首先是一个基于 redux 和 redux-saga 的数据流方案，然后为了简化开发体验，dva 还额外内置了 react-router 和 fetch，所以也可以理解为一个轻量级的应用框架。

## dvab 的特性

- 易学易用，仅有 6 个 api，对 redux 用户尤其友好，配合 umi 使用后更是降低为 0 API
- elm 概念，通过 reducers, effects 和 subscriptions 组织 model

> 这个 model 其实就是把所有跟 redux 相关的 reducer 整合到一个 model 文件中，通过 namespace 区分 model ，通过 state 存储数据，通过 subscriptions 实现 history 的监听，通过 effect 发起异步操作，通过 reducer 执行同步操作。

**model**正是 dva 区别于我们使用 react 所创建其它项目的地方，所以，我们在 dva 这一块主要学习的就是 model，然后再使用 umi 的路由和插件管理，dva 和 umi 就学习完成了

- 插件机制，比如 dva-loading 可以自动处理 loading 状态，不用一遍遍地写 showLoading 和 hideLoading
- 支持 HMR，基于 babel-plugin-dva-hmr 实现 components、routes 和 models 的 HMR

> 所谓的 hmr 就是热更新（HotModuleReplacement），暂时我还没去了解 dva 中的热更新是基于什么技术实现的，不过之前我们在使用 create-react-app 创建项目时，因为使用了 webpack-dev-server，所以也是有热更新的，热更新的意思就是当我们在修改代码的时候不需要刷新页面，修改的内容可直接在页面中渲染出来

- webpack-dev-server 热更新的实现流程大概是这样的：

> 第一步：webpack 对文件系统进行 watch 打包到内存中

> 第二步：devServer 通知浏览器端文件发生改变，它会通过一个叫 sockjs 的插件在服务器和客户端之间建立一个长连接，然后监听 webpack 编译和打包的各个阶段状态并告知浏览器

> 第三步：webpack-dev-server/client 接收到服务端消息做出响应

> 第四步：webpack 接收到最新 hash 值验证并请求模块代码

> 第五步：HotModuleReplacement.runtime 对模块进行热更新

> 第六步：调用 accept 方法，及时将更新后的内容插入到页面中

## 数据流向

要理解 model，应该是需要先理解数据流向。数据的改变发生通常是通过用户交互行为或者浏览器行为（如路由跳转等）触发的，当此类行为会改变数据的时候可以通过 dispatch 发起一个 action，如果是同步行为会直接通过 Reducers 改变 State ，如果是异步行为（副作用）会先触发 Effects 然后流向 Reducers 最终改变 State，所以在 dva 中，数据流向非常清晰简明，并且思路基本跟开源社区保持一致（也是来自于开源社区）

<img src="https://zos.alipayobjects.com/rmsportal/PPrerEAKbIoDZYr.png">

## Models

dva 的 models 提供了 6 个 api:

#### state

与 redux 中 reducer 里的 state 类似，State 表示 Model 的状态数据，通常表现为一个 javascript 对象（当然它可以是任何值）；操作的时候每次都要当作不可变数据（immutable data）来对待，保证每次都是全新对象，没有引用关系，这样才能保证 State 的独立性，便于测试和追踪变化。

> store 里可以有很多的 state

#### action

Action 是一个普通 javascript 对象，它是改变 State 的唯一途径。无论是从 UI 事件、网络回调，还是 WebSocket 等数据源所获得的数据，最终都会通过 dispatch 函数调用一个 action，从而改变对应的数据。action 必须带有 type 属性指明具体的行为，其它字段可以自定义，如果要发起一个 action 需要使用 dispatch 函数；需要注意的是 dispatch 是在组件 connect Models 以后，通过 props 传入的

> 不用怀疑，它就是 redux 的 action

#### dispatch

dispatching function 是一个用于触发 action 的函数，action 是改变 State 的唯一途径，但是它只描述了一个行为，而 dipatch 可以看作是触发这个行为的方式，而 Reducer 则是描述如何改变数据的。

在 dva 中，connect Model 的组件通过 props 可以访问到 dispatch，可以调用 Model 中的 Reducer 或者 Effects

> redux 中的 dispatch 方法

#### reducer

Reducer（也称为 reducing function）函数接受两个参数：之前已经累积运算的结果和当前要被累积的值，返回的是一个新的累积结果。该函数把一个集合归并成一个单值。

Reducer 的概念来自于是函数式编程，很多语言中都有 reduce API

```javascript
[{ x: 1 }, { y: 2 }, { z: 3 }].reduce(function (prev, next) {
  return Object.assign(prev, next);
});
//return {x:1, y:2, z:3}
```

在 dva 中，reducers 聚合积累的结果是当前 model 的 state 对象。通过 actions 中传入的值，与当前 reducers 中的值进行运算获得新的值（也就是新的 state）。需要注意的是 Reducer 必须是纯函数，所以同样的输入必然得到同样的输出，它们不应该产生任何副作用。并且，每一次的计算都应该使用 immutable data，这种特性简单理解就是每次操作都是返回一个全新的数据（独立，纯净），所以热重载和时间旅行这些功能才能够使用

> redux 中的 reducer 概念

#### effect

Effect 被称为副作用，在我们的应用中，最常见的就是异步操作。它来自于函数编程的概念，之所以叫副作用是因为它使得我们的函数变得不纯，同样的输入不一定获得同样的输出。

dva 为了控制副作用的操作，底层引入了 redux-sagas 做异步流程控制，由于采用了 generator 的相关概念，所以将异步转成同步写法，从而将 effects 转为纯函数。至于为什么我们这么纠结于 纯函数，如果你想了解更多可以阅读 Mostly adequate guide to FP，或者它的中文译本 JS 函数式编程指南

> 把 useEffect 概念拿来这边参考也是可以的

#### subscription

Subscription 语义是订阅，用于订阅一个数据源，然后根据条件 dispatch 需要的 action。数据源可以是当前的时间、服务器的 websocket 连接、keyboard 输入、geolocation 变化、history 路由变化等等。

> 看起来似乎是 redux 中的 subscribe

## 实例

上面把概念基本上讲完了，因为之前我们花过一些精力来学习 redux，所以，这块的理论应该是没有太多问题。那么，接下来，我们就进入实例讲解环节：为了减少写代码的时间，这边我直接从 dva 官网下载了一个项目回来使用：

https://github.com/dvajs/dva/tree/master/examples/user-dashboard
