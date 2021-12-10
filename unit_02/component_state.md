> Marion 的 react 实战课程 > 第二部分 > 组件与 state

## 什么是组件

组件是什么？每个程序员都有自己的理解：在传统语言中, 组件的定义一般来说是一个从特定的组件类中派生出来的特定的对象；而在早期的前端开发者眼里, 组件是一个可复用的独立 UI 模块；在 React 中, 得益于 JSX 语法, 所有的页面元素都被转换成了 React 对象。只要你的方法 return 的是一个 React 元素, 小到一个 text, 大到一个 page, 都可以认为是 React 组件。
归纳起来一句话：**<font color=red>如果一个方法接受一个唯一的属性, 返回一个 React 元素, 那它就是一个 React 组件。</font>**

## 实例：最简单的组件实现

最简单的组件是函数组件, 如同我们在上面所说明的那样, **<font color=red>如果一个函数接受一个唯一的属性, 返回一个 React 元素</font>**；那么我们就可以认为它是一个标准的 React 函数组件, 这种也可以称之为无状态组件, 因为它没有自己的 constructor 方法, 无法定义自己的状态集 state;

```javascript
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}
```

也可以使用 ES 中所学习的类来定义, 下面这个实现与上面的实现在 React 中是等效的, 我们一般将这种使用类的方式定义的组件称之为类组件或者有状态组件, 它可以在自己内部的 constructor 中定义一个自身的状态集 state, 然后可以在组件中对自己进行一些改变;

```javascript
class Welcome extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}
```

## 什么是 State

React 中的 state 主要作用是组件用于保存、控制及修改组件自己的状态, 它只能在 constructor 中初始化, 我们可以用 state 来完成对行为的控制、数据的更新及界面的渲染, 由于组件不能修改父组件传入的 props, 所以我们需要使用 state 来存储组件自身需要的数据, 它的每次改变都会引发组件的更新。即每次数据的更新都是通过修改 state 属性的值, 然后 ReactJS 内部会监听 state 属性的变化, 一旦发生变化, 就会触发组件的 render 方法来更新 DOM 结构。
归纳起来一句话: **<font color=red>state 是组件用来存储自身数据的一个对象, 它是可以改变的, 它的每次改变都会引发组件的更新。</font>**

## 实例:State 的简单操作

```javascript
class Welcome extends React.Component {
  // 构造函数
  constructor(props) {
    // 继承父类React.Component的属性和方法
    super(props);
    // 设定组件state对象
    this.state = {
      msg: 'Hello',
    };
  },
  // 事件执行方法
  onClick() {
    // 事件被触发后, 通过steState来改变state中的属性
    this.setState({
      msg: 'Hallo'
    })
  },
  render() {
    return <h1 onClick="onClick">${this.state.msg}, {this.props.name}</h1>;
  }
}

```

## 哪些属性应该放到 state 中去

上面我们说到了, 我们可以用 state 来完成对行为的控制、数据的更新及界面的渲染, 所以为了避免不必要的函数调用或 Dom 渲染, 我们需要判断每一个变量是否需要记录成一个 state。

> .1 变量如果是通过 props 从父组件中获取, 就不需要

> .2 如果这个变量可以通过其他的 state 属性或者 props 属性经过数据处理得到, 就不需要

> .3 如果变量在 render 中没有使用到, 就不需要

> .4 变量在整个生命周期中都保持不变时, 也不需要

## setState

在 hooks 出现之前, setState 是 React 中使用频率最高的一个 API, 因为 React 中并没有像 Vue 中那样去实现了一个 Object.defineProperty 来监听数据的变化, 所以, 我们想要在数据改变时能让 react 知道数据发生了变化并且重新渲染 view 层就必须使用 setState 方法来通知 React 数据发生了变化:

1. 最常用的一种: 我们不需要进行计算, 也不需要实时获取改变后的内容, 直接 setState 就行

```javascript
onClick() {
  this.setState({
    msg: 'Hallo'
  });
}

```

2. 带回调函数的: setState 方法主要是告诉 React 组件有数据需要更新, 可能会导致重新渲染。所以, 为了避免每一次 setState 都重新渲染, React 在这里做了一个节流的封装, 在接收到一个 setState 操作后, 首先会将它放到一个队列内, 然后去检查是否正在更新组件, 如果正在更新组件, 无论你调用了多少次 setState, 它只会将你的操作放入这个队列, 等待当前的更新操作完成后再执行。

```javascript
onClick() {
  this.setState({
    msg: 'Hallo'
  });
  // 节流封装会让上面的改变无法实时呈现
  console.log(this.state.msg)
  // 'Hello'
}

```

这样的话就有点小尴尬了, 我们总会有些基于最新的 state 来实现的业务流程, React 这样一搞可能就没办法进行了, 虽然官方推荐我们在 componentDidUpdate 中获取并实现业务, 但这样的话整个的代码逻辑就分离了, 可能会引起一些阅读的不便, 甚至造成一些代码冗余:

```javascript
// 举个不太好的例子, 比如我们某次点击时需要对某个属性累加两次
onClick() {
  this.setState({
    num: this.state.num + 1
  });
  this.setState({
    num: this.state.num + 1
  });
}
```

所以, React 在这里给我们提供了一个方法可以实时获取被改变的属性: setState 方法还可以接受第二个参数用于接收一个回调函数, 当 setState 队列被执行完毕时, React 会执行这个回调函数, 这样的话我们就可以在这个回调函数中获取被改变的 state 属性的值了:

```javascript
onClick() {
  this.setState({
    msg: 'Hallo'
  },
  // 这个是setState成功后的回调, 它在setState执行完成后组件开始渲染前被调用
  () => {
    console.log(this.state.msg)
  });
}

```

3. 需要进行一些计算的: setState 的第一个参数不仅仅只是一个 state 对象, 它也可以是一个同步返回 state 对象的回调函数, 这个函数提供两个参数：参数一是当前的 state 对象, 参数二是当前的 props 对象, 我们可以在这个函数中对它们进行一些简单的计算后再返回; 注意这里不要使用 this.state, 因为我们刚才说了, setState 是一个异步的操作, 所以这里你使用 this.state 极有可能就会拿到一个在刚刚被改变的 state:

```javascript
onClick() {
  this.setState(prevState => {
    // 我们可以在这里去做一些简单的计算
    return {
      msg: 'Hallo'
    }
  }, () => {
    // 这个是setState成功后的回调
    console.log(this.state.msg);
    // 'Hallo'
  });
}
```

4. 刚刚上面说到了, setState 是一个异步的操作, 需要使用回调来重新读取被改变的值, 但也有例外的时候, 比如我们在一些类似于 setTimeout 这些异步方法中调用 setState 时, 因为 React 无法感知开发者的渲染顺序, 所以采用了直接更新 state 的操作, 而不会进行批量更新, 因为这种操作会导致 Dom 的立即渲染, 所以我们不建议使用这种方法。

```javascript
componentDidMount() {
  this.setState({val: this.state.val + 1});
  console.log('第 1 次 log:', this.state.val);
  this.setState({val: this.state.val + 1});
  console.log('第 2 次 log:', this.state.val);

 setTimeout(() => {
  this.setState({val: this.state.val + 1});
  console.log('第 3 次 log:', this.state.val);
  this.setState({val: this.state.val + 1});
  console.log('第 4 次 log:', this.state.val);
 }, 0);
}
```

## setState 实现的简单描述

在 React 的 setState 函数实现中, 会根据一个变量 isBatchingUpdates 判断是直接更新 this.state 还是放到 enqueueSetState 队列中, isBatchingUpdates 默认值是 false, 也就表示 setState 会同步更新 this.state。

但是 setState 中有一个函数 batchedUpdates, 这个函数会把 isBatchingUpdates 修改为 true, 而当 React 在进行队列事件处理之前就会调用这个 batchedUpdates 函数, 造成的后果, 就是由 React 在接收到一个 setState 请求时, 不会直接更新 state。关于 isBatchingUpdates 方法，除了 enqueueSetState 队列更新时会调用 batchedUpdates 来标记当前更新状态, 所有的 React 生命周期函数在执行的时候也会修改 isBatchingUpdates 的值为 true。

最后有一种例外不得不提的是，当我们在一些类似于 setTimeout 这种异步函数中执行 setState 时, 因为 React 无法感知我们的渲染顺序, 所以它放弃了修改 isBatchingUpdates 而是直接更新了 state。

```javascript
// 为了看清代码执行步骤，在这定义一个无用的变量
let step = 1;
// 定义一个状态树
let oldState = { msg: "原始值" };
// 定义一个用于判断是否正在执行setState事件的标记
let isBatchingUpdates = false; // false表示未更新
// 定义一个队列，用于储存所有的setState调用
let enqueueSetState = [];
// 定义一个队列，用于储存setState第二个参数，也就是更新完成的回调函数
let callbackList = [];
// 定义一个方法，模拟React.setState方法
function mySetState(state, callback) {
  // 将当前需要更新的state存入setState队列
  if (state) {
    Object.prototype.toString.call(state) === "[object Object]" &&
      enqueueSetState.push(state);
  } else {
    console.log("%c递归调用，没有传值", "color:#f00");
  }
  console.log(
    "%c看看它们调用的顺序" + step + JSON.stringify(state),
    "color: #060"
  );
  step += 1;
  // 如果有回调函数把回调函数则存入回调队列里
  callback &&
    // 这里是判断它是否是一个函数，只有当它是函数时才存储，避免无法执行报错
    Object.prototype.toString.call(callback) === "[object Function]" &&
    callbackList.push(callback);

  // 判断是否正在更新,如果正在更新，等待更新完成后第45行的调用
  if (isBatchingUpdates) {
    console.log("%c看看谁被挡出去了" + JSON.stringify(state), "color:#00f");
    return;
  }
  // 修改状态表示正在更新state，新加入队列的setState不再进行处理
  // 因为前面已经将state存入了enqueueSetState队列，所以不用担心这个state会丢失
  isBatchingUpdates = true;

  // 创建一个队列副本
  // 这个副本的作用是避免当我们对enqueueSetState队列进行操作时，有新的setState命令进入导致队列长度发生变化
  const newSetState = [...enqueueSetState];
  // 清空原有队列，保证当新的setState命令进入时不与原有操作发生冲突
  enqueueSetState = [];
  const newCallback = [...callbackList];
  callbackList = [];

  // 写state的方法
  function setState(state) {
    // 使用新的state覆盖旧的state
    oldState = Object.assign(oldState, state);
    // 打印结果
    console.log("%c处理完毕，over!", "color: #909");
    // 检查是否有回调，如果有，执行它
    for (let cb of newCallback) {
      cb(oldState);
    }
  }
  console.log("主线程执行到这，mysetState已经执行完成，被弹出");
  setTimeout(() => {
    // 如果没有在更新状态，开始处理数据
    const newState = newSetState.reduce((prev, next) => {
      return Object.assign(prev, next);
    }, {});
    console.log("看看有哪些数据被合并了", newSetState);
    // 数据合并完成，写入当前state
    setState(newState);

    // 数据写入完成，修改更新状态，表示可以进行另一个队列的操作了
    isBatchingUpdates = false;
    // 检查是不是还有数据在排队，如果有排队的，从头再来
    if (enqueueSetState.length) {
      mySetState();
    }
  });
}
mySetState({ msg: "哥是第一个,后来的等着" }, (state) => {
  console.log("第一步更新完成", state);
});
mySetState({ msg: "后来的排个队" }, (state) => {
  console.log("第二步更新完成", state);
});
mySetState({ msg: "排队ing..." }, (state) => {
  console.log("第三步更新完成", state);
});
setTimeout(() => {
  mySetState({ msg: "又没赶上。。继续排队ing..." }, (state) => {
    console.log("第四步更新完成", state);
  });
});
setTimeout(() => {
  mySetState({ msg: "me too..." }, (state) => {
    console.log("第五步更新完成", state);
  });
});
```

## 小节结束

什么是组件，什么是 state，这两个问题，是需要大家死记的，不一定要用我讲的这些词语描述，但要大致能说清楚

setState 是一个很灵活的方法，它接受两个参数，参数一可以是一个 state 对象，也可以是一个实时返回 state 对象的函数，参数二是一个回调，用于实时获取改变后的 state 进行更多的业务处理

然后，setState 的简单描述也要记一下，最好是把这些英文单词发音都背下来，这样面试时一旦问起，你娴熟的术语描述将会大大提升你在面试官眼中的形象，关键是，这段描述代表着你已经把 setState 的这段源码看完且理解透彻了。
