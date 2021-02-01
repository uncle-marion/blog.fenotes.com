> 企业项目实战 > 第二部分 > React 基础回顾

### React 的 Props 与组件通讯

#### 什么是 Props

当 React 元素为用户自定义组件时, 它会将 JSX 所接收的属性（attributes）以及子组件（children）转换为单个对象传递给组件, 这个对象就被称之为 “props”。

props 是一个从外部传进组件内的参数, 由于 React 具有单向数据流的特性, 所以它的主要作用是从父组件向子组件中传递数据, 它是不可变的, 如果想要改变它, 只能通过外部组件传入新的 props 来重新渲染子组件, 否则子组件的 props 和展示形式不会改变。

props 除了可以传字符串, 数字, 还可以传递对象, 数组甚至是回调函数。

归纳起来一句话：**<font color=red>props 是一个对象, 可以接受几乎所有类型的属性, 它是组件用来接收父组件传入的参数的, 不允许在该组件内部进行改变, 而只能通过父组件来修改。</font>**

#### 实例：组件的调用与 props

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

> 不同点:
>
> 1.  初始值来源: state 的初始值来自于自身的 getInitalState(constructor) 函数  
>     props 来自于父组件或者自身 getDefaultProps( 若 key 相同 props 的值会被 state 的值覆盖 )
> 2.  修改方式: state 只能在自身组件中 setState, 不能由父组件修改  
>     props 只能由父组件修改, 不能在自身组件修改
> 3.  对子组件: state 代表的是一个组件内部自身的状态, 只能在自身组件中存在  
>     props 是一个由父组件传递给子组件的数据流, 这个数据流可以一直传递到子孙组件
>
> 相同点: 1. props 和 state 都是导出 HTML 的原始数据  
>  2. 都能由自身组件的相应初始化函数设定初始值  
>  3. props 和 state 的改变都会触发 render 的重新渲染  
>  4. props 和 state 都是纯 JS 对象（用 typeof 来判断, 结果都是 object）

#### 通过 props 实现父传子的通讯

这是最简单也是最常用的一种通讯方式：父组件通过向子组件传递 props，子组件得到 props 后进行相应的处理，如同我们刚才用于解释 props 的这段代码，App 做为一个父组件，将 name 通过 props 传入子组件由子组件进行处理后渲染到 view 中。

#### 通过 props 中的回调函数实现子传父的通讯

在解释什么是 props 时，我们知道了，props 不仅仅可以传递字符串和数字这些基本类型对象，也能传递函数、对象等引用类型的属性。所以，我们可以利用回调函数来实现子组件向父组件通讯：父组件将一个函数作为 props 传递给子组件，子组件调用该回调函数，便可以向父组件通讯

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

#### 使用 Context 实现跨级组件通讯

所谓跨级组件通讯，就是父组件向子组件的子组件通讯，向更深层的子组件通讯。
我们可以使用 props 层层向下传递来实现爷孙组件通讯，但如果父组件结构较深，那么中间的每一层组件都要去传递 props，无疑增加了复杂度，并且这些 props 并不是这些中间组件自己所需要的, 可能组件层次在三层以内时我们可以采用这种方式，但当组件嵌套过深时，采用这种方式就需要斟酌了。

所以在这里我们推荐使用 context 来实现多级嵌套的组件通讯，React 中的 Context 相当于一个全局变量，是一个大容器，我们可以把要传递的状态放在这个容器中，这样一来，不管嵌套有多深，都可以随意取用。

```javascript
// 函数组件没办法通过 ContextType 来挂载 Context, 但可以通过 Consumer来获取 Context内容
function Son(props) {
  return (
    // Consukmer 需要一个函数做为子元素，这个函数接收当前的 Context 值并且返回一个React节点
    // 传递给函数的 value 值来自于组件树上方离这个 Context 最近的 Provider 提供的 value 值
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
    <TestContext.Provider value={{
      name: 'abc',
      clickName: this.nameClick
    }>
      <Welcome />
    </TestContext.Provider>
  );
}

```

上面我们理解了 Context 的简单使用，下面我们进入一个小实例，更深入地理解 Context 的一些使用方式。首先我们建立一个新的页面文件，路由与文件名自定义

index.jsx

```javascript
import React, { Component } from 'react';

import ContextFirst from './childer_first';

import './style.less';

// 创建一个Context对象，便于后续的子孙级组件调用
export const { Provider, Consumer } = React.createContext();

/**
 * @module React.context组件功能演示
 *
 * @typedef {props} Props 父组件传入的状态集
 * @extends {React.Component<Props>}
 */
export default class ContextDemo extends Component {
  /**
   * 构造函数，react16.3以后把它归纳到了生命周期函数。
   * 注意：不要将state写在外面, 使用constructor方法是一个标准
   */
  constructor(props) {
    // ES6要求，子类的构造函数必须执行super方法，否则会报错
    super(props);
    this.state = {
      text: '这是通过context往下传的文字属性',
      value: 123,
    };

    /**
     * 合理地使用多行注释
     *
     * JSX中的事件绑定只传递函数引用，没有上下文(隐式绑定)，而changeText方法没有
     * 使用箭头函数，所以this指针会被偏移至全局对象(默认绑定)，但React中的class
     * 组件中因为使用了严格模式，导致全局对象被指向了undefined，为了正常使用this
     * 我们在这里对函数做一个显式绑定。
     *
     * 显式绑定可以用箭头函数来避免，如不可避免，则一定要在constructor中绑定，避
     * 免在render中绑定造成每次渲染时都会创建一个新的function对象
     */
    this.changeText = this.changeText.bind(this);
  }

  /**
   * 改变value属性的方法
   *
   * 这里使用了箭头函数，所以this在函数被定义时就已经绑定在这个类上面了，可以不需要
   * 进行显式绑定也能正常使用this.setState
   */
  changeValue = () => {
    this.setState({ value: 456 });
  };

  /**
   * 改变文字属性的方法
   *
   * @param {object event} e 事件对象
   * @param {string} newText 要显示的文字内容
   * 对象中的方法属性的简易写法
   */
  changeText(e, newText) {
    // 通过一个实时返回的匿名函数来计算新的state
    this.setState(
      prevState => {
        if (!newText) {
          return {
            text: '孙子组件什么都没传，我随便改着玩',
          };
        }
        return { text: newText };
      },
      // setState的第二个参数，回调函数，setState完成，页面开始渲染前被调用
      () => {
        console.log('%c看看使用context通讯的结果怎样', 'color:#f00');
      }
    );
  }

  /**
   * render方法，类组件必须有这个方法
   * 16.3以后它也成了一个生命周期
   */
  render() {
    // 使用解构可以避免代码冗余，关键是减少临时引用
    const { text, value } = this.state;
    return (
      // Provider 生产者，在这里创建属性和方法
      <Provider
        value={{
          // 能使用简易写法的就必须使用简易写法，这也是规范
          text,
          value,
          changeText: this.changeText,
          changeValue: this.changeValue,
        }}
      >
        <div className="ancestor">
          <h2>
            祖先级组件, 定义了一个context,
            将通讯内容通过context传下去，props什么都没传
          </h2>
          {/* 渲染子元素 子组件在没有childer的情况下，要使用自闭合标签以减少代码冗余*/}
          <ContextFirst />
        </div>
      </Provider>
    );
  }
}
```

childer_first.jsx

```javascript
import React, { Component } from 'react';

import ChilderSecond from './childer_second';
import ChilderFourth from './childer_fourth';

/**
 * @module 第一级的子组件
 *
 * @typedef {props} Props 父组件传入的状态集
 * @extends {React.Component<Props>}
 */
export default class ChilderFirst extends Component {
  constructor(props) {
    super(props);

    this.state = {
      typeName: '',
      text: '通过props向我的子组件传入了一个文字属性',
    };

    this.changeText = this.changeText.bind(this);
  }

  /**
   * 改变text属性的方法
   * 必须进行显式绑定才能正常使用this.setState
   */
  changeText() {
    this.setState({
      typeName: 'changed',
      text: '我的子组件通过我提供的方法改变了我的state',
    });
  }

  render() {
    const { text, typeName } = this.state;

    return (
      <div className="first">
        <h2>我是一级子组件, 我渲染了一个二级子组件，其它的我不知道</h2>
        {/* 通过props与子组件进行通讯 */}
        <ChilderSecond
          text={text}
          typeName={typeName}
          changeText={this.changeText}
        />
        {/* 另一个二级子组件，什么都没传 */}
        <ChilderFourth />
      </div>
    );
  }
}
```

childer_second.jsx

```javascript
import React from 'react';

import ChilderThird from './childer_third';

/**
 * @module 二级子组件
 *
 * @typedef {Props} Props
 * @prop {string} [Props.text] 用于演示父子通讯中向下传递消息的参数
 * @prop {string} [Props.typeName] 同上，用于改变文字颜色的css属性名，默认值为空字符串
 * @prop {Function} [Props.changeText] 用于演示父子通讯中向上传递消息的方法
 * @extends {React.Component<Props>}
 * 上面这行的意思是说这是一个React类组件
 */
/**
 * 合理地使用解构以减少临时引用和代码冗余
 * 参数的默认属性可以有效地避免我们在使用三元等方式做判断时造成类似于0或false参数
 * 无法正常传递的问题。
 */
export default function ChilderSecond({ text, typeName = '', changeText }) {
  return (
    <div className={`second ${typeName}`}>
      <h2>
        我是二级子组件，我显示了父组件传入的文字，还有一个按钮可以改变文字，其它的我不关心
      </h2>
      <h1>{text}</h1>
      <button onClick={changeText}>调用父组件props传入的方法</button>
      {/* 渲染三级组件 */}
      <ChilderThird />
    </div>
  );
}
```

childer_third.jsx

```javascript
import React from 'react';

// 导入组先级组件中定义的消费者组件，将自己定义为一个消费者
import { Consumer } from './index';

/**
 * @module 三级组件
 *
 * @typedef {Props} Props
 * @type {React.StatelessComponent<Props>}
 * 上面这行的意思是说这是一个无状态组件
 */
/**
 * 无状态组件因为在渲染时省略掉了实例化的过程，相对来说
 */
export default function ChilderThird() {
  return (
    // 声明自己是一个消费者，通过回调方法获取从祖宗那继承下来的资产
    <Consumer>
      {/* 消费者的内部返回的必须是一个返回React对象的方法 */}
      {({ text, changeValue }) => {
        return (
          <div className="third">
            <h2>
              我是三级子组件，我能显示文字，还能改变父组件的兄弟组件中的数字
            </h2>
            <h1>
              {/* 这里显示的是从context中获取到的文字 */}
              {text}
            </h1>
            <button onClick={changeValue}>
              点我改变父组件的兄弟组件显示的数字
            </button>
          </div>
        );
      }}
    </Consumer>
  );
}
```

childer_fourth.jsx

```javascript
import React from 'react';

// 导入组先级组件中定义的消费者组件，将自己定义为一个消费者
import { Consumer } from './index';

/**
 * @module 二级组件的兄弟组件
 *
 * @typedef {Props} Props
 * @type {React.StatelessComponent<Props>}
 */
export default function ChilderFourth() {
  return (
    // 声明自己是一个消费者，通过回调方法获取从祖宗那继承下来的资产
    <Consumer>
      {/* 消费者的内部返回的必须是一个返回React对象的方法 */}
      {({ value, changeText }) => {
        return (
          <div className="third">
            <h2>
              我是二级子组件的兄弟，我能显示数字，也能改变我哥们的子组件的内容
            </h2>
            <h1>
              {/* 这里显示的是从context中获取到的数字 */}
              {value}
            </h1>
            <button
              onClick={e => changeText(e, '改变兄弟节点的子组件中的内容')}
            >
              点我改变兄弟组件的子组件里显示的文字
            </button>
          </div>
        );
      }}
    </Consumer>
  );
}
```

注意:

> 1. 在组件树中，如果中间某一个组件 ShouldComponentUpdate returning false 了，会阻碍 context 的正常传值，导致子组件无法获取更新
> 2. 子组件本身如果是 extends React.PureComponent 也会阻碍 context 的更新
> 3. 如果 Provider 中的值被改变，会导致它的所有被 Consumer 包裹的子组件被重新渲染，所以，当你的状态非常多的时候，我们仍然建议使用 redux

context 目前仍然还在完善中，还有一些问题，导致官方仍然没有大面积推广，但是我们在一些复杂度不高的项目中，还是可以使用它的，毕竟 react-redux/react-router 等这些官方的插件都在用它。

#### 使用事件订阅/发布来实现组件通讯

这是我一直以来惯用的方式, 毕竟在接触到 vuex 或 redux 这种状态管理系统前的近十年的职业生涯中，一直使用的是事件订阅/发布这种方式来完成业务逻辑的，而且，个人以为在一些小型团队合作开发的中小型应用中，这种方式要比 Redux 更方便。

为什么？因为小型团队三五个人，非常容易沟通协调，极少出现一个事件被多个开发者使用/修改的情况；中小型应用实际上并没有那么多的状态需要管理，使用 redux 什么的感觉杀鸡用了牛刀；第三就是毫无技术门槛，只要你会写 js 就能实现代码逻辑。这也是为什么我的 redux 一直都用不好的主要原因。

好了，闲话少述，首先我们需要安装一个 events 的包

```javascript
npm i events -S
```

然后在你的 utils 工具包中生成一个 events.js 文件来引入 events 包并且抛出一个可用的 emitter 对象

```javascript
import { EventEmitter } from 'events';
export default new EventEmitter();
```

现在就可以来自由地实现事件订阅了：
emitter 对象有

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
  // 最大的麻烦在这里，所有当前组件订阅的事件，在组件销毁前都必须注销
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
// 使用之前我们需要创建一个context对象
const TestContext = React.createContext();
class App extends React.Component {
  nameClick() {
    this.setState({
      name: 'cbd',
    });
  }
  render() {
    return (
      <h1>
        <A nameClick={this.nameClick} />
        <B name={this.state.name} />
      </h1>
    );
  }
}
```

#### 使用 redux 来实现事件通讯

redux 实现事件通讯比较复杂，而且，非大型项目我个人以为还是可以不用 redux 的。。所以，我们把这块放在下一周，react 进阶课程中去讲

#### 小节结束

什么是 props 与 state 与 props 的相同点与不同点，这两个问题，希望大家课后能把它死记下来，这两道题面试时提到的频率相对还是比较高的；

然后是事件通讯，React 中实现组件通讯的方式还是挺多的，我们要学会择优去用，比如你就是需要实现一个父子/爷孙组件的通讯，那么就没必要引用一堆 redux 相关的插件了，不合适，我个人建议还是使用 props 比较方便；如果有多级且项目中并没有使用 redux，那么你可以使用 context 来实现通讯；如果整站范围有少量的全局通讯需求，事件发布/订阅也是不错的选择，总之，不是在没有办法的情况下，我个人建议，我们今天学习的这些通讯方式就完全够用了。
