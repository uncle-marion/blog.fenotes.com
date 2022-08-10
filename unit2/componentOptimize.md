> 平安蜀黍的前端教程 > React 必学知识点 > 组件内优化

### React 的组件优化

#### 组件卸载前必须清理避免无效操作

在组件中为 window 注册的全局事件, 以及定时器, 在组件卸载前要清理掉, 防止组件卸载后继续执行影响应用性能。

```javascript
import React from 'react';

export default class App extends React.Component {
  state = {
    count: 1,
    request: false,
  };
  timer = null;
  render() {
    return <div>{this.state.count}</div>;
  }
  // 组件初始化完成后创建定时器或发送请求绑定全局事件等
  componentDidMount() {
    // 定时器
    this.timer = setInterval(() => {
      this.setState({
        count: this.state.count + 1,
      });
    }, 1000);
    // 全局事件
    document.body.addEventListener('click', this.onClick);

    // ajax请求
    this.source = axios.CancelToken.source();
    this.request = true;
    axios.get(url, { cancelToken: this.source }).then().catch();
  }
  componentWillUnmount() {
    // 清除定时器
    clearInterval(this.timer);
    // 定时器在清除后仍然有值，无法被垃圾回收机制清除，所以在这里需要手动置为null
    this.timer = null;
    // 清除全局事件
    document.body.removeEventListener('click', this.onClick);
    // 取消未完成的请求
    if (this.request) {
      this.source.cancel('组件被卸载，取消未完成请求');
    }
  }
}
```

#### 使用 ShouldComponentUpdate 避免重复渲染

例如有组件用于渲染员工信息，我们从服务器获取到的数据中包含有员工的姓名、性别与年龄、职位等信息，但组件中只需要渲染姓名和年龄，也就是说，只有姓名和年龄发生变化时才会重新渲染组件，其它信息发生变化则不必渲染组件：

```javascript
class App extends React.Component {
  // 定义state
  // ES6中定义，如果没有显式提供constructor方法，它会自动使用一个默认的构造函数
  // 因为我们这个例子中代码并不复杂，所以直接定义state对象
  state = {
    name: 'fdasf',
    age: 12,
    sex: 1,
  };
  /**
   * 将组件渲染到DOM容器中
   */
  render() {
    // 无论改变状态的是什么，只要发生了setState事件，因为react的render流程原因，都会重新渲染
    // 使用了shouldComponentUpdate后可有效避免这种情况的发生
    console.log('组件渲染了', this.state);
    const { name, age } = this.state;
    return (
      <div>
        {name}, {age}
      </div>
    );
  }
  /**
   * 组件渲染完成
   */
  componentDidMount() {
    // 计时结束改变状态
    setTimeout(() => {
      this.setState({
        sex: 0,
      });
    }, 3000);
  }
  /**
   * 比较发生变化的状态
   * @param {object} nextProps 最新的props
   * @param {object} nextState 最新的state
   * @returns {boolean} 是否需要渲染
   */
  shouldComponentUpdate(nextProps, nextState) {
    const { name, age } = this.state;
    // 只有name或age发生变化才会渲染
    if (name !== nextState.name || age !== nextState.age) {
      return true;
    }
    return false;
  }
}
```

#### 使用 PureComponent 避免重复渲染

什么是 PureComponent（纯组件）呢？PureComponent 是 React 对 shouldComponentUpdate 做的一个封装，当我们的类组件继承了 React.PureComponent 后，当传入的 props 发生变化时，这个组件自动与当前的 props 进行一个浅比较，如果两个数据相同则不更新（渲染）组件

- 浅比较：比较引用数据类型在内存中的引用地址是否相同，比较基本数据类型的值是否相同。

- 深比较：比较基本数据类型的值是否相同，如果是引用类型，则递归引用类型中的属性或元素进行比较。

```javascript
class Children extends React.PureComponent {
  render() {
    // 如果继承React.Component组件，这里会被执行两次; 在使用了React.PureComponent后这里就只执行一次了
    console.log('子组件被重新渲染了', this.props);
    const { name, age } = this.props;
    return (
      <div>
        {name}, {age}
      </div>
    );
  }
}

class App extends React.Component {
  state = {
    name: 'fdasf',
    age: 12,
    sex: 1,
  };
  render() {
    const { name, age } = this.state;
    return (
      <div>
        {/* 在这里调用子组件并进行传参 */}
        <Children name={name} age={age} />
      </div>
    );
  }
  componentDidMount() {
    setTimeout(() => {
      this.setState({
        sex: 0,
      });
    }, 3000);
  }
}
```

#### 避免内联函数定义

什么是内联函数？就是在书写 JSX 代码时，在需要传递函数的位置直接写入一个函数，比如：

```javascript
class App extends React.PureComponent {
  render() {
    return (
      <button
        {/* 错误的方式：每次渲染都会重新创建 */}
        onClick={() => {
          console.log('这种写法就是内联函数');
        }}
        value="click me"
        type="button"
      />
    );
  }
}
```

为什么要避免使用内联函数？react 中每一次 render 时都会重新构建 JSX 中的代码，我们写在 JSX 中的内容都会被重新创建包括函数，这样就会导致 React 总是需要为元素绑定新的函数实例，而旧的函数实例还需要交给垃圾回收处理。更重要的是，当我们使用这种方式向下级组件传递函数时会导致子组件认为 props 发生了变化进而重新渲染。

```javascript
class App extends React.PureComponent {
  onClick() {
    console.log('在组件中定义函数以避免每次渲染时创建新的函数实例')
  }
  render() {
    return (
      <button
        {/* 将函数绑定到事件，每次渲染只是读取组件中定义的变量 */}
        onClick={this.onClick}
        value="click me"
        type="button"
      />
    );
  }
}
```

上面这种是在函数中不需要依赖 this 的情况下，如果在函数中调用 this，比如使用 setState 修改状态时会报错，因为事件调用栈直接调用这个函数会将 this 指针指向 window，而 window 下并没有 setState 这个方法。那么如果需要依赖 this 怎么用呢？可以用 bind：

```javascript
class App extends React.PureComponent {
  constructor() {
    super()
    // 在构造器中绑定this对象，这样当生成组件实例时，this.onClick的this对象就作为静态属性绑定到了这个函数上
    // 关于bind这个方法，我们在第五单元也会讲到，这里暂时略过。
    this.onClick = this.onClick.bind(this)
  }
  onClick() {
    console.log('在组件中定义函数以避免每次渲染时创建新的函数实例')
    // 如果没有在构造器中绑定this对象，这里会报setState并不是一个函数。因为this指针被指向了window，而window下是没有setState这个方法的
    this.setState({})
  }
  render() {
    return (
      <button
        {/* 将函数绑定到事件，每次渲染只是读取组件中定义的变量 */}
        onClick={this.onClick}
        value="click me"
        type="button"
      />
    );
  }
}
```

#### 组件中尽量不要使用箭头函数

上面学习了在构造器中使用 bind 来给函数绑定 this 以解决函数指针偏移的问题。同时我们也可以使用箭头函数来解决指针问题，因为箭头函数本身并没有 this，它的 this 来自于它所在的词法作用域，换句话说，箭头函数声明在哪它的 this 就指向哪。我们在组件中声明箭头函数，那么 this 就指向这个组件：

```javascript
class App extends React.PureComponent {
  onClick = () => {
    console.log('在组件中定义函数以避免每次渲染时创建新的函数实例')
  }
  render() {
    return (
      <button
        {/* 将函数绑定到事件，每次渲染只是读取组件中定义的变量 */}
        onClick={this.onClick}
        value="click me"
        type="button"
      />
    );
  }
}
```

但是要注意的是，在一些可能被重用的组件中，不推荐使用箭头函数。因为我们使用箭头函数时，这个函数会被添加为类的实例对象的属性而不是原型对象属性。这样，当组件被多次复用时，每个组件的实例对象中都会有一些相同的函数实例，导致降低了函数实例的可重用性而造成了资源浪费。

#### 优化条件渲染以减少组件挂载

我们在 JSX 课程中学过在 React 中怎样进行条件渲染，但我发现有的同学在练习中对于条件渲染理解的不是很好，所以在这里需要大家注意一下：

```javascript
class App extends React.Component {
  state = {
    name: 'fdasf',
    age: 12,
    sex: 1,
  };
  render() {
    const { name, age } = this.state;
    // 根据父元素传入的参数来决定是否需要挂载Header组件
    return this.props.showHeader ? (
      <div>
        <Header />
        <Children {...this.state} />
      </div>
    ) : (
      <div>
        <Children {...this.state} />
      </div>
    );
  }
  componentDidMount() {
    setTimeout(() => {
      this.setState({
        sex: 0,
      });
    }, 3000);
  }
}
```

上面这种写法是不可取的，因为一旦渲染条件发生变化，React 在进行虚拟 DOM 比对时会发现，更新前第一个组件是 Header，更新后第一个组件是 Children；更新前第二个组件是 Children，更新后不存在第二个组件。于是 React 就会先卸载 Header 与 Children，然后重新挂载 Children。对于 Children 来说，这种卸载和挂载操作都是没有必要的

```javascript
// 这样写，代码简洁易维护同时也完成了需求
<div>
  {this.props.showHeader && <Header>}
  <Children {...this.state} />
</div>
```

#### 使用 Fragment 标记

在 JSX 中是不能返回多个同级元素的，如果需要就必须有一个共同的父级：

```javascript
function Children() {
  return (
    <div className="name">{props.name}</div>
    <div className="age">{props.age}</div>
  )
}

class App extends React.Component {
  state = {
    name: 'fdasf',
    age: 12,
    sex: 1,
  };
  render() {
    const { sex } = this.state;
    return (
      <div className="user-info">
        <Children {...this.state} />
        <div className="sex">{sex}</div>
      </div>
    );
  }
}
```

上面这段代码会报语法错误，大致意思是**相邻的 JSX 元素必须被包装在一个封闭标记中**，如果我们需要返回一个片段就必须用一个标签给它包起来：

```javascript
function Children() {
  return (
    <div>
      <div className="name">{props.name}</div>
      <div className="age">{props.age}</div>
    </div>
  );
}
```

但是这样的话就出现了问题，比如我们的 user-info 这个盒子如果设置了 flex 属性，那么，Children 里返回的两个元素就无法继承 flex 布局导致显示不正确，那么怎么解决呢？

```javascript
function Children() {
  return (
    {/* react提供了一个叫作代码片段的标签：Fragment，它只会在渲染前将多个组件包裹起来，在渲染时它就消失了 */}
    <Fragment>
      <div className="name">{props.name}</div>
      <div className="age">{props.age}</div>
    </Fragment>
    // 如果不是必要，Fragment标签也可直接写成空标签"<></>"
  );
}
```

#### 避免使用内联样式

当使用内联 style 为元素添加样式时，内联 style 会被编译为 JavaScript 代码，通过 JavaScript 代码将样式规则映射到元素上去，浏览器会花费更多的资源执行脚本和渲染 UI，从而增加了组件渲染的时间：

```javascript
return (
  <div className="user-info" style={{ width: '800px' }}>
    <Children {...this.state} />
    <div className="sex">{sex}</div>
  </div>
);
```

上面的代码中，为 user-info 元素添加了内联样式，添加的内联样式为 JavaScript 对象，所以这个样式需要被转换成等效的 css 样式规则，然后应用到元素上，才能正常渲染出来。也就是说在浏览器合成渲染树之后，还需要经过 JavaScript 的计算才能重新渲染。这代表着原本浏览器只需要执行一遍的排版操作现在要执行两次，无疑是浪费了大量的时间和资源。

所以，最好的办法是将 css 文件导入成样式组件，然后直接在元素上标识出对应的样式名。能通过 css 直接做的事情就不要通过 JavaScript 去做，因为 JavaScript 操作会严重影响效率。

#### Error Boundaries 错误边界

我们都知道，JavaScript 是单线程的语言，一旦在运行中发现错误就会抛出错误导致整个执行过程中断。在 React 中，如果组件渲染错误也会导致整个应用程序中断造成页面无法正常渲染。我们在上面的生命周期课程中也学到了，React 提供了一个 getDerivedStateFromError 生命周期，可以创建一个错误边界组件来确保在特定组件中发生错误时程序不会中断：

```javascript
// ErrorBoundary
import { Component } from 'react';

export default class ErrorBoundary extends Component {
  state = { hasError: false };
  // 这是静态方法，需要在前面标记static
  // getDerivedStateFromError是在渲染前发起的
  // 我们没有办法在静态方法中改变状态，所以只能通过返回对象的方式来修改state中的内容
  static getDerivedStateFromError() {
    // 修改hasError状态为true, React会检测到状态发生变化从而开始新一轮渲染
    return { hasError: true };
  }

  // componentDidCatch是在渲染完成后发起的，我们可以在这里改变状态或调用方法
  componentDidCatch(error, errorInfo) {
    console.log(error, '组件渲染错误');
    // 你同样可以将错误日志上报给服务器
    // logErrorToMyService(error, errorInfo)
  }

  render() {
    // 通过hasError状态来判断显示哪个组件
    // this.props.children表示这个组件由父组件传入
    return this.state.hasError ? <h1>组件发生了错误</h1> : this.props.children;
  }
}

// index
import React from 'react';
import ReactDOM from 'react-dom';
import ErrorBoundaries from './ErrorBoundaries';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      employee: {
        name: '张三',
        age: 20,
      },
    };
  }
  render() {
    const { name, age } = this.state.employee;
    return (
      <div>
        {name}
        {age}
      </div>
    );
  }
  componentDidMount() {
    setTimeout(() => {
      // 修改状态，让程序找不到对应的属性达到组件报错的目的
      this.setState({
        employee: null,
      });
    }, 3000);
  }
}

ReactDOM.render(
  // 这里通过错误边界渲染子组件，就可以达到当真实组件渲染发生错误时渲染错误边界中的降级内容
  <ErrorBoundaries>
    <App />
  </ErrorBoundaries>,
  document.getElementById('root')
);
```
