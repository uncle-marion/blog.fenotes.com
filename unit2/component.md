> Marion 的 react 实战课程 > 第二单元 React 基础与关联知识 > 组件与状态

### 一、什么是组件

组件是什么？每个程序员都有自己的理解：在传统语言中, 组件的定义一般来说是一个从特定的组件类中派生出来的特定的对象；而在早期的前端开发者眼里, 组件是一个可复用的独立 UI 模块；在 React 中, 得益于 JSX 语法, 所有的页面元素都被转换成了 React 对象。只要你的方法** return 的是一个 React 元素, 小到一个 text, 大到一个 page, 都可以认为是 React 组件**。
归纳起来一句话：**<font color=red>如果一个方法接受一个唯一的属性, 返回一个 React 元素, 那它就是一个 React 组件。</font>**

#### 实例：最简单的组件实现

最简单的组件是函数组件, 如同我们在上面所说明的那样, **如果一个函数接受一个唯一的属性, 返回一个 React 元素**；那么我们就可以认为它是一个标准的 React 函数组件, 这种也可以称之为**<font color=red>无状态组件, 因为它没有自己的 constructor 方法, 无法定义自己的状态集 state</font>**;

```javascript
function Welcome(props) {
  // 这个return div，就是上面说到的react元素，是一种被称之为jsx的语法，react会将这种代码转化成标准的dom元素后嵌入到html中去
  // 关于jsx，稍后我们会讲到，这里只要了解这种写法是没有问题的即可
  return <div>函数组件</div>;
}
```

也可以使用 ES6 中所学习的类来定义, 下面这个实现与上面的实现在 React 中是等效的, 我们一般将这种使用类的方式定义的组件称之为类组件或者有状态组件, 它可以**<font color=red>在自己内部的 constructor 中定义一个自身的状态集 state, 然后可以在组件中通过指定的方法来对 state 进行一些改变，通过这些改变来影响 Dom 元素进行一些视觉或数据上的变化</font>**;

```javascript
class Welcome extends React.Component {
  render() {
    return <div>类组件</div>;
  }
}
```

---

### 二、什么是状态

有了组件，我们的页面就能正常呈现了，但目前展示的内容仍然是静态的，我们需要让用户界面与数据的变化保持同步，有什么方式能实现呢？React 中提供了一个叫 state 的对象来供我们管理、更新页面中显示的内容。这个 state 对象就是我们常说的状态集。

#### 组件自身的状态 State

state 是组件**用于保存、控制及修改自身属性的 javascript 对象**, 在类组件中它只能在 constructor 中被初始化, 我们可以用 setState 方法来改变 state 里的状态以完成对组件行为的控制、数据的更新以及界面的渲染。

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

react 使用 state 来存储组件自身需要的数据, 它的每次改变都会引发组件的更新。每次数据的更新都是通过修改 state 属性的值, 然后 ReactJS 内部通过监听 state 属性的变化来触发 render 方法, 更新 DOM 结构，这样就达到了界面与数据同步。

整个 state 的描述归纳起来一句话可表达: **<font color=red>state 是组件用来存储自身数据的一个对象, 它是可改变的, 它的每次改变都会引发组件的更新。</font>**

#### 影响组件的外部状态 Props

当 React 元素为用户自定义组件时, 它会将 JSX 所接收的属性（attributes）以及子组件（children）转换为单个对象传递给组件, 这个对象就被称之为 “props”。

props 是一个从外部传进组件内的参数, 由于 React 具有**单向数据流**的特性, 所以它的主要作用是**从父组件向子组件中传递数据**, 它是**不可变**的, 如果想要改变它, 只能**通过外部组件传入新的 props 来重新渲染子组件**, 否则子组件的 props 和展示形式不会改变。

props 除了**可以传递字符串, 数字, 还可以传递对象, 数组甚至是回调函数**。归纳起来一句话：**<font color=red>props 是一个对象, 可以接受几乎所有类型的属性, 它是组件用来接收父组件传入的参数的, 不允许在该组件内部进行改变, 而只能通过父组件来修改。</font>**

```javascript
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}

class App extends React.Component {
  return (
    <div>
      {/*我们在这里, 使用刚刚定义的组件名, 就可以直接调用这个组件, 其内部的属性, 就是组件即将接收到的props参数*/}
      <Welcome name="abc" />
    </div>
  );
}

```

#### state 与 props 的不同点与相同点

> **不同点:**
>
> 1.  初始值来源:  
>     state 的初始值来自于当前组件的 constructor 函数  
>     props 来自于父组件
> 2.  修改方式:  
>     state 只能使用当前组件中的 setState 来修改, 不能由父组件修改  
>     props 只能由父组件修改, 不能在当前组件修改
> 3.  对子组件:  
>     state 代表的是当前组件内部自身的状态, 只能在当前组件中存在  
>     props 是一个由父组件传递给子组件的数据流, 这个数据流可以向下一直传递到子孙组件
>
> **相同点:**
>
> 1.  props 和 state 都是用于编译成 HTML 的原始数据
> 2.  都能由自身组件的相应初始化函数设定初始值
> 3.  props 和 state 的改变都会触发 render 的重新渲染
> 4.  props 和 state 都是纯 JS 对象

---

### 三、状态的更新 setState

在上面的组件示例中，我们学习了组件和状态，也通过 setState 这个方法来改变组件的状态达到更新页面内容的需求。接下来我们要学习的是 setState。

setState 是 react 的核心 API，可以这么说，在 react-hooks 出现之前, setState 是 React 中使用频率最高的一个 API, 因为 React 中并没有像 Vue 中那样去实现一个 Object.defineProperty 来监听数据的变化, 所以, 我们想要在数据改变时能让 react 知道数据发生了变化并且重新渲染 view 层就必须使用 setState 这个方法来通知 React 数据发生了变化。

```javascript
/**
 * @param {object || function} state
 * @param {function} callback 可选参数，react修改状态成功后调用此方法
setState(state, callback)
```

#### 最常见的用法

直接获取到了状态的值，对于这种我们不需要进行计算, 也不需要实时获取改变后的内容, 直接 setState 就行

```javascript
// setState是用的浅拷贝方式合并写入的对象
onClick() {
  this.setState({
    msg: 'Hallo'
  });
}
```

#### 需要计算的

setState 的第一个参数不仅仅只是一个 state 对象, 它也可以是一个同步返回 state 对象的回调函数, 这个函数提供两个参数：参数一是当前的 state 对象, 参数二是当前的 props 对象, 我们可以在这个函数中对它们进行一些简单的计算后再返回; 注意这里不要使用 this.state, 因为我们刚才说了, setState 是一个异步的操作, 所以这里你使用 this.state 极有可能就会拿到一个在刚刚被改变的 state:

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

#### 带回调函数的

**setState 方法主要是告诉 React 组件有数据需要更新, 可能会导致重新渲染**。所以, 为了**避免每一次 setState 都重新渲染**, React 在这里做了一个节流的封装, 在**接收到一个 setState 操作后, 首先会将新的 state 放到一个队列内, 然后去检查是否正在更新组件, 如果正在更新组件**, 无论你调用了多少次 setState, 它只会**将你的操作放入这个队列, 等待当前的更新操作完成后再执行**。

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

但实际开发过程中，我们总会有些基于最新的 state 来实现的业务流程, React 这样一搞可能就没办法进行了, 虽然官方推荐我们在 componentDidUpdate 中获取并实现业务, 但这样的话整个的代码逻辑就分离了, 可能会引起一些阅读的不便, 甚至造成一些代码冗余:

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

所以, React 在这里给我们提供了一个方法可以实时获取被改变的属性: **setState 方法还可以接受第二个参数**用于接收一个回调函数, 当 **setState 队列被执行完毕后, React 会执行这个回调函数**, 这样的话我们就可以在这个回调函数中获取被改变的 state 属性的值了:

```javascript
onClick() {
  this.setState({
    msg: 'Hallo'
  },
  // 这个是setState成功后的回调, 它在setState执行完成后且组件渲染后被调用
  () => {
    console.log(this.state.msg)
  });
}

```

#### 在事件回调中使用

刚刚上面说到了, setState 是一个异步的操作, 需要使用回调来重新读取被改变的值, 但也有例外的时候, 比如我们在一些**类似于 setTimeout 这些异步方法中调用 setState 时, 因为 <font color="red">React 无法感知开发者的渲染顺序</font>, 所以采用了直接更新 state 的操作, 而不会进行批量更新**。

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

---

### 四、组件间的消息传递

#### 通过 props 实现父传子的通讯

这是最简单也是最常用的一种通讯方式：**<font color=red>父组件通过向子组件传递 props，子组件得到 props 后进行相应的处理后渲染至视图界面</font>**，如同我们刚才用于解释 props 的这段代码，App 做为一个父组件，将 name 通过 props 传入子组件由子组件进行处理后渲染到 view 中。

#### 通过 props 中的回调函数实现子传父的通讯

在解释什么是 props 时，我们知道了，props 不仅仅可以传递字符串和数字这些基本类型对象，也能传递函数、对象等引用类型的属性。所以，我们可以利用回调函数来实现子组件向父组件通讯：父组件**<font color=red>将一个函数作为 props 的属性传递给子组件，子组件调用该回调函数，便可以向父组件通讯</font>**

```javascript
function Welcome(props) {
  return <h1 onClick={props.nameClick}>Hello, {props.name}</h1>;
}

class App extends React.Component {
  constructor(props) {
    super(props)
    // 所有需要绑定this对象的处理函数，尽量在constructor中绑定
    // 因为每一次bind都会生成一个新的函数，如果写在jsx中就会导致每次调用或渲染时都会生成一个新的函数
    // 这是一种不专业的表现，合格的前端要合理使用并珍惜每一分资源
    this.nameClick = this.nameClick.bind(this)
  }
  nameClick() {
    console.log(this, '#######')
  }
  return (
    <div>
      <Welcome name="abc" nameClick={this.nameClick} />
    </div>
  );
}
```

#### 通过 Context 进行跨级组件通讯

Context 是 React 内部提供的一个无需为每层组件手动添加 props，就能在组件树间进行数据传递的方法。所谓跨级组件通讯，**就是父组件向子组件的子组件通讯，向更深层的子组件通讯**。

我们可以使用 props 层层向下传递来实现爷孙组件通讯，但如果父组件结构较深，那么中间的每一层组件都要去传递 props，无疑增加了复杂度，并且这些 props 并不是这些中间组件自己所需要的, 可能组件层次在嵌套较浅时我们可以采用这种方式，但当组件嵌套过深时，采用这种方式就需要斟酌了。

所以在这里我们推荐**<font color=red>使用 context 来实现多级嵌套的组件通讯</font>**，React 中的 Context 相当于一个全局变量，是一个大容器，我们可以把要传递的状态放在这个容器中，这样一来，不管嵌套有多深，都可以随意取用。

```javascript
// 函数组件没办法通过 ContextType 来挂载 Context, 但可以通过 Consumer来获取 Context内容
function Son(props) {
  return (
    // Consukmer 需要一个函数做为子元素，这个函数接收当前的 Context 值并且返回一个React节点
    // 传递给函数的 value 值来自于组件树上方离这个 Context 最近的 Provider 提供的 value 值
    // 注意：Consumer包裹的内容只能是一个返回JSX代码的函数
    <TestContext.Consumer>
      {({name, clickName}) => (<span onClick={clickName}>{name}</span>)}
    </TestContext.Consumer>
  )
}
// 中间层什么都不知道
function Welcome(props) {
  return <h1>Hello, <Son /></h1>;
}
// 使用之前我们需要创建一个context对象
const TestContext = React.createContext();
class App extends React.Component {
  nameClick() {
    console.log(this, '#######')
  }
  return (
    // Provider 接收一个 value 属性，传递给消费组件
    <TestContext.Provider value={ {
      name: 'abc',
      clickName: this.nameClick
    }}>
      <Welcome />
    </TestContext.Provider>
  );
}

```

#### 通过事件订阅/发布模式来实现组件通讯

所谓的订阅发布模式，就是**建立一个对象，然后向外提供一个用于订阅消息的接口，同时提供一个发布消息的接口**。然后我们在需要响应事件的地方**使用订阅接口来监听事件**，再**通过发布消息接口来实现一个事件发布**的功能：

```javascript
// 一个简单的事件订阅发布程序
const reactEmitter = {
  // 事件队列
  eventList: {},
  /**
   * 事件订阅程序
   * @param {*} eventName
   * @param {*} eventHandler
   */
  addListener(eventName, eventHandler) {
    //
  },
  /**
   * 移除事件
   * @param {*} eventName
   */
  removeListener(eventName) {
    //
  },
  /**
   * 发布事件
   * @param {*} eventName
   * @param {*} args
   */
  emit(eventName, args) {
    //
  },
};
export default reactEmitter;
```

#### 使用事件订阅/发布来实现组件通讯

这是我用得比较多的一种方式, 毕竟在接触到 vuex 或 redux 这种状态管理系统前的将近十年的职业生涯中，一直使用的是事件订阅/发布这种方式来完成业务逻辑的，而且，个人以为在一些小型团队合作开发的中小型应用中，这种方式要比 Redux 更方便。

为什么？因为小型团队三五个人，非常容易沟通协调，极少出现一个事件被多个开发者使用/修改的情况；中小型应用实际上并没有那么多的状态需要管理，使用 redux 什么的感觉杀鸡用了牛刀；第三就是毫无技术门槛，只要你会写 js 就能实现代码逻辑。这也是为什么我的 redux 一直都用不好的主要原因。

要使用事件订阅发布模式，我们需要安装一个 events 的依赖包：

```javascript
npm i events -S
```

然后在你的 utils 工具包中生成一个 events.js 文件来引入 events 包并且抛出一个可用的 emitter 对象

```javascript
import { EventEmitter } from 'events';
export default new EventEmitter();
```

现在就可以来自由地实现事件订阅了：

```javascript
// 所有需要订阅/发布事件的组件都需要引入这个工具
import ev from '@utils/events';
// 我们假装A组件有自己的状态而B组件没有
class A extends React.Component {
  // 需要在这里面进行事件订阅操作
  componentDidMount() {
    this.clickName = ev.addListener('clickName', msg => {
      console.log(
        '我订阅了一个事件, 事件名叫clickName, 我现在要通知父组件把name这个值改掉'
      );
      this.props.nameClick();
    });
  }
  // 所有当前组件订阅的事件，在组件销毁前都必须注销
  componentWillUnmount() {
    ev.removeListener(this.clickName);
  }
  render() {
    return <span>Hello</span>;
  }
}
// B组件是一个无状态组件
function B(props) {
  function clickName() {
    ev.emit('clickName', '我是B组件，我这边点击了name标签');
  }
  return <span onClick={clickName}>{props.name}</span>;
}
```

#### 使用第三方工具实现组件通讯

第三方工具很多，目前比较常见的是 redux 与 mobx，redux 目前算是主流，所以我们会在本单元稍后的课程中学习到 redux。mobx 的课程要放到后面，在整个的课程学习完成后再进行学习。

---

### 五、受控组件与非受控组件

在 React 中，状态又可分为两种：一种被称之为 props，它来自于组件外部，在**类组件实例化时传入**或在**函数组件被调用时传入**，因为 react 的 immutable 原则，我们无法在组件中修改 props 中的状态；另一种被称之为 state，是组件自身定义的一个状态集 this.state，state 里的状态由组件自身控制，外部组件或方法无法改变 state 里的值。

基于这两种状态的改变方式，我们将组件分类成受控组件与非受控组件：

#### 受控组件

受控组件指的是只使用了 props 作为自身的状态集的组件，它呈现的数据和修改数据的方法都来自于外部，自身无法控制：

```javascript
export default function ControlledComponent(props) {
  /* 组件中显示的内容来自于外部，修改显示内容的方法也来自于外部 */
  return <input value={props.value} onChange={props.onChange} />;
}
```

受控组件因为缺少自己的状态和方法，所以一般都是作为容器组件的子组件出现。

#### 非受控组件

与受控组件相反，非受控组件所呈现的数据来自于自身的 state 状态集，方法由自身定义

```javascript
export default class UncontrolledComponent extends Component {
  state = {
    value: '非受控组件',
    childValue: '受控组件'
  }
  // 定义自身value的change方法
  changeValue = (e) => {
    this.setState({
      value: e.target.value
    })
  }
  // 定义受控组件的change方法
  changeChildValue = (e) => {
    this.setState({
      value: e.target.value
    })
  }
  render() {
    return <div>
      {/* 展示自身状态集中的数据并绑定事件方法 */}
      <input value={this.state.value} onChange={this.changeValue}>
      {/* 调用受控子组件并以props的方式向下传参 */}
      <ControlledComponent value={this.state.childValue} onChange={this.changeChildValue}>
    </div>;
  }
}
```

上面分别演示了受控组件与非受控组件，但是，在平常的业务中，存在的受控组件要复杂得多，并非只是一个 input，甚至可能是一个复杂的表单，内部也有自己的方法和状态，只是这些状态仍然会受到 props 中的状态或方法间接控制。正常情况下我们写的大多数组件都应该是受控组件，有时候也会被称之为展示组件或渲染组件。

而非受控组件我们一般用来管理一些复杂的逻辑或方法，也会被称之为容器组件。然后在咱们学习的第三阶段会讲到的一种叫 umi（乌米）的框架，甚至所有的组件都没有自己的状态，它把所有的状态与修改状态的方法都提取到了一个逻辑层中进行处理。这是后话，等我们能完整地做完这个学习项目再来讲。

---

### 六、高阶组件

这块相对来说稍有点复杂，而且因为目前 hooks 成为了主流，所以我们的主要课程中以学习 hooks 为主。为了不影响咱们的入门课程，我将它放到了后面[React 高阶组件]()

---

### 思考：哪些属性应该放到 state 中去

上面的代码中可以看到, 我们可以通过改变 state 来完成对行为的控制、数据的更新及界面的渲染,而且只要 state 发生变化就会造成函数调用及 Dom 的重新渲染。所以为了避免不必要的函数调用或 Dom 渲染, 我们在进行程序设计时需要判断每一个变量是否需要记录成一个 state。

> .1 如果变量在 render 中没有使用到, 就不需要

> .2 变量如果是通过 props 从父组件中直接获取, 就不需要

> .3 如果这个变量可以通过其他的 state 属性或者 props 属性经过简单的数据处理得到, 也不需要

> .4 变量在整个生命周期中都保持不变时, 也不需要
