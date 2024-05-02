> 平安蜀黍的前端教程 > React 必学知识点 > 使用 Context 实现跨级组件通讯

今天的课堂上我们有提到过 Context 的简单使用，为了大家能更好地理解 Context 的功能与熟悉它的使用方法，这里提供了一个小实例，希望会给大家学习 Context 带来一定的帮助:

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
        value={ {
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

> 1. 在组件树中，如果中间某一个组件在 ShouldComponentUpdate 中返回了 false，会阻碍 context 的正常传值，导致子组件无法获取更新
>
> 2. 子组件本身如果在声明时继承了 React.PureComponent 也会阻碍 context 的更新
>
> 3. 如果 Provider 中的值被改变，会导致它的所有被 Consumer 包裹的子组件被重新渲染，所以，当你的状态非常多的时候，我们仍然建议使用 redux
