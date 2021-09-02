> Marion 的 react 实战课程 > 第二部分 > 生命周期与组件优化

# React 的生命周期

## 关于生命周期的一些时间节点(简单了解即可)

- 2018 年 3 月, 16.3 版本更新, 对生命周期函数做出了比较大的调整, 出现了两个新的生命周期函数 getDerivedStateFromProps 与 getSnapshotBeforeUpdate, 并声明将逐渐废弃 componentWillMount、componentWillReceiveProps、componentWillUpdate

- 2018 年 5 月, 16.4 版本更新, 再次修正并确认了新的生命周期；

- 2019 年 2 月, hooks 出现, 部分比较前卫的小公司新开项目, 都直接上了 hooks, 但大公司因为旧的项目太多, 所以还在类组件上折腾着, 只有少数比较前卫的团队开始使用 hooks;

react 更新日志, 感兴趣的同学可以课后去看一看, 了解一下就行, 不用花太多时间, 主要是你们工作以后, 需要关注这块以了解最近的更新有了哪些新特性或者有哪些特性被宣布被废弃, 这些都是很重要的, 关系着你在写项目时可以使用哪些方法不能使用哪些方法, 比如生命周期, 现在还有很多大公司因为早期的项目中 16.4 以前的代码太多, 无法使用最新的 react 版本。

https://github.com/facebook/react/blob/master/CHANGELOG.md

## 什么是生命周期

这个问题已经问得比较滥了, 其实生命周期（Life Cycle）的概念应用很广泛, 特别是在政治、经济、环境、技术、社会等诸多领域经常出现, 其基本涵义可以通俗地理解为“从摇篮到坟墓”（Cradle-to-Grave）的整个过程。而对于 React 来讲, 应该称之为组件的生命周期, 这样可以从字面理解, 就是一个组件从加载到更新再到卸载的整个流程。

## React 组件生命周期函数有哪些

## 16.3 以前的生命周期

参考下面的图: 早期的生命周期函数比较多, 分以下 4 个阶段: 创建阶段、实例化阶段、更新阶段、卸载阶段

<img src="../assets/images/react_lifecycle_old.png" />

- ##### 创建阶段

> getDefaultProps<font color=red>(16.4 后废弃)</font>

这个阶段只会触发一个 getDefaultProps 方法, 该方法返回一个对象并缓存起来。然后与父组件指定的 props 对象合并, 最后赋值给 this.props 作为该组件的默认属性。

- ##### 实例化阶段

该阶段主要发生在实例化组件类的时候, 也就是该组件类被调用的时候触发。这个阶段会触发一系列的流程, 按执行顺序如下:

> getInitialState<font color=red>(16.4 后废弃)</font>: 初始化组件的 state 的值。其返回值会赋值给组件的 this.state 属性。  
> componentWillMount<font color=red>(16.4 后废弃)</font>: 这里可以根据业务逻辑来对 this.state 进行一些相应的操作。  
> render: 根据 this.state 的值, 生成页面需要的虚拟 DOM 结构, 并返回该结构。  
> componentDidMount: 在 render 完成后触发, 这个时候已经可以通过 ReactDOM.findDOMNode(this) 来获取当前组件的节点, 然后就可以像 Web 开发中那样操作里面的 DOM 元素了。

- ##### 更新阶段

这主要发生在用户操作之后或者父组件有更新的时候, 此时会根据用户的操作行为进行相应的页面结构的调整。这个阶段也会触发一系列的流程, 按执行顺序如下:

> componentWillReceiveProps<font color=red>(16.4 后废弃)</font>: 当组件接收到新的 props 时, 会触发这个函数。在这个函数中, 通常可以调用 this.setState 方法来完成对 this.state 的修改。  
> shouldComponentUpdate: 该方法用来拦截新的 props 或 state, 然后根据事先设定好的判断逻辑, 做出最后要不要更新组件的决定。  
> componentWillUpdate<font color=red>(16.4 后废弃)</font>: 当上面的方法拦截返回 true 的时候, 就可以在该方法中做一些更新之前的操作。  
> render: 根据一系列的 diff 算法, 生成需要更新的虚拟 DOM 数据。（在 render 中只允许进行数据和模板的组合, 不允许对 state 进行修改, 一是维护代码可读性, 最关键的是避免因为修改属性而造成的死循环）  
> componentDidUpdate: 该方法在组件的更新已经同步到真实 DOM 后触发, 我们常在该方法中做一些 DOM 操作。

- ##### 卸载阶段

> componentWillUnmount

当组件需要从 DOM 中移除的时候, 我们通常会做一些取消事件绑定、移除虚拟 DOM 中对应的组件数据结构、销毁一些无效的定时器等工作。这些事情都可以在这个方法中处理

```javascript
class Test extends Readt.component {
  /* 1.创建阶段 */
  //在创建类的时候被调用
  getDefaultProps: function() {
    console.log("getDefaultProps");
    return {};
  },

  /* 2.实例化阶段 */
  //获取this.state的默认值
  getInitialState: function() {
    console.log("getInitialState");
    return {name: "hangge.com"};
  },
  //组件将要加载, 在render之前调用此方法
  componentWillMount: function() {
    //业务逻辑的处理都应该放在这里, 比如对state的操作等
    console.log("componentWillMount");
  },
  //渲染并返回一个虚拟DOM
  render: function() {
    console.log("render");
    return (
            <div>欢迎访问: {this.state.name}</div>
    );
  },
  //组件完成加载, 在render之后调用此方法
  componentDidMount: function() {
    //在该方法中, ReactJS会使用render方法返回的虚拟DOM对象来创建真实的DOM结构
    console.log("componentDidMount");
    var node = ReactDOM.findDOMNode(this);
    console.log(node);
  },

  /* 3.更新阶段 */
  //该方法发生在this.props被修改或父组件调用setProps()方法之后
  componentWillReceiveProps: function() {
    console.log("componentWillRecieveProps");
  },
  //是否需要更新
  shouldComponentUpdate: function() {
    console.log("shouldComponentUpdate");
    return true;
  },
  //将要更新
  componentWillUpdate: function() {
    console.log("componentWillUpdate");
  },
  //更新完毕
  componentDidUpdate: function() {
    console.log("componentDidUpdate");
  },

  /* 4.销毁阶段 */
  //销毁时会被调用
  componentWillUnmount: function() {
    console.log("componentWillUnmount");
  },
}
```

注意: 如果你是 3~4 年的工作经验的话, 也就是说到你毕业, 应该是 2021 年年初, 往前回溯 4 年, 应该是 2017 年左右, 那么相对来说早期的生命周期不需要记太多, 面试官如果问起, 可以说很长时间没有用到了, 基本忘记了, 因为你使用的时间太短, 记不住是允许的。如果你的简历是在 2016 年就开始工作的话, 需要记下来一部分, 至少要把后面标红的这些记下来。

但是接下来的 16.3 以后的生命周期需要记一下, 因为时间点比较近, 对比国内的生产环境, 应该还有很多公司在用着。哪怕是你说你 hooks 出现以后就直接没再使用生命周期也不可能全忘记的。

## 16.3 以后的生命周期

React 16.3 时, 对生命周期函数做出了比较大的调整, 出现了两个新的生命周期函数 getDerivedStateFromProps 与 getSnapshotBeforeUpdate, 并声明将因为安全问题，即将废弃 componentWillMount、componentWillReceiveProps、componentWillUpdate 这三个生命周期

参考下图, 新的生命周期被精简为三个阶段: 挂载阶段、更新阶段以及卸载阶段

<img src="../assets/images/react_lifecycle_new.png" />

从图中我们可以看到, 新版的生命周期引入了两个全新的生命周期函数: getDerivedStateFromProps, getSnapShotBeforeUpdate; 这两个生命周期都属于特殊的生命周期，可能我们很少有机会能用到，简单给大家介绍一下，有个印象就行。

getDerivedStateFromProps: 这个生命周期函数在官网上被称之为获取派生状态，用于取代早期的 componentWillMount、componentWillUpdate 和 componentWillReceiveProps, 也就是说无论是挂载阶段还是更新阶段全部都会调用。它适用于一种比较罕见的场景:当前组件的所有 state 均依赖于 props 中的内容

react 官方要求是谨慎使用这个生命周期，因为它会导致代码冗余，并且使组件难以维护。我们现在先简单了解一下它的使用方式。

首先这个生命周期会在调用 render 方法之前调用，并且在初始挂载及后续更新时都会被调用。它应返回一个对象来更新 state，如果返回 null 则不更新任何内容

```javascript
// 早期的
componentWillReceiveProps(nextProps) {
  if (nextProps.isLogin !== this.props.isLogin) {
    this.setState({
      isLogin: nextProps.isLogin,
    });
  }
  if (nextProps.isLogin) {
    this.handleClose();
  }
}
// 新版的
static getDerivedStateFromProps(nextProps, prevState) {
  // 判断最传入的props中的值是否与现有的state中的值相同，如果相同返回空，如果不同则将新接收到的props中的值覆盖当前state里的值
  if (nextProps.isLogin !== prevState.isLogin) {
    return {
      isLogin: nextProps.isLogin,
    };
  }
  return null;
}
componentDidUpdate(prevProps, prevState) {
  // 这里的prevProps
  if (!prevState.isLogin && this.props.isLogin) {
    this.handleClose();
  }
}
```

getSnapshotBeforeUpdate: 这个生命周期函数被放置在了 render 之后, 可以读取但无法使用 DOM 的时候。它使得我们的组件可以在可能更改之前就能从 DOM 中获得一些信息, 比如滚动位置。这个生命周期函数里的任何值都将会作为参数传递给 componentDidUpdate。

来自官网的 getSnapshotBeforeUpdate 的例子

```javascript
class ScrollingList extends React.Component {
  constructor(props) {
    super(props);
    this.listRef = React.createRef();
  }

  getSnapshotBeforeUpdate(prevProps, prevState) {
    // 我们是否要添加新的 items 到列表
    // 捕捉滚动位置, 以便我们可以稍后调整滚动
    if (prevProps.list.length < this.props.list.length) {
      const list = this.listRef.current;
      return list.scrollHeight - list.scrollTop;
    }
    return null;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    // 如果我们有snapshot值, 我们已经添加了 新的items
    // 调整滚动以至于这些新的items 不会将旧items推出视图
    // (这边的snapshot是 getSnapshotBeforeUpdate方法的返回值)
    if (snapshot !== null) {
      const list = this.listRef.current;
      list.scrollTop = list.scrollHeight - snapshot;
    }
  }

  render() {
    return <div ref={this.listRef}>{/* ...contents... */}</div>;
  }
}
```

[关联阅读](../../relevance/r15&r16.md)

- React 组件的生命周期有三个不同的阶段

## 生命周期的总结：

如果有面试官问起这个问题, 你可以直接描述 16.4 以后版本的生命周期, 如果面试官问起你更多的生命周期, 那么, 你可以把 WillMount、WillUpdate 这两个方法也简单说下, 甚至可以说说它们为什么会被弃用, 这应该可以给你加分

> #### 挂载阶段:
>
> - constructor: React 在这里完成对数据的初始化，它接受两个参数：props 和 context，当想在函数内部使用这两个参数时，需使用 super()传入这两个参数
> - render: React 在这里将你写入的 JSX 生成一个虚拟 Dom 树，然后渲染到页面中；
> - componentDidMount: 组件第一次渲染完成，这个时候 DOM 节点已经生成，我们可以在这里以 refs 的方式获取元素或者调用 ajax 请求，返回数据 setState 后组件会重新渲染
>
> #### 更新阶段:
>
> - getDerivedStateFromProps: 它提供了两个参数: nextProps 与 prevState;旧版本的 componentWillReceiveProps 方法需要在这里判断前后两个 props 是否相同，如果不同再将新的 props 更新到相应的 state 上去，这样就破坏了 state 数据的单一数据源特性，导致组件状态变得不可控；在这个方法中，我们将不再有权访问 this.props,而只能通过比较 nextProps 与 prevState 的值来判断是否需要更新当前的 state。
> - shouldComponentUpdate: 它的功能主要是用于优化，它提供了两个参数: nextProps 与 nextState; 在正常的 react 渲染流程中，当我们的父组件 state 发生变化时，无论是否影响到了当前组件的 props 都会造成当前组件的重新渲染。shouldComponentUpdate 可以让我们避免这种情况。同时，react 也给我们推荐了一种避免手动编写 shouldComponentUpdate 函数的方法就是使用 PureComponent
> - render: 这里就是上面挂载阶段的 Render 方法，只不过在每一次组件更新时，React 会在这里通过其 diff 算法比较更新前后的新旧 DOM 树，比较以后，找到最小的有差异的 DOM 节点，并重新渲染；
> - getSnapshotBeforeUpdate: 生命周期走到这里，代表着整个 DOM 已经生成完成但还没有渲染到页面中。我们可以在这里读取当前某个 DOM 元素的状态，并在 componentDidUpdate 中进行相应的处理。
> - componentDidUpdate: 与挂载阶段的 componentDidMount 几乎一致，唯一的区别是 componentDidMount 只会在组件首次渲染时被触发，而页面每次被更新后都会触发 componentDidUpdate
>
> #### 卸载阶段:
>
> - componentWillUnmount: 这个与旧版完全一致，组件被卸载前触发，我们要在这将所有的事件监听、计时器等统统干掉

# React 的组件优化
