> 企业项目实战 > 第二部分 > 开发环境配置与 React 基础回顾

# 必须养成的 coding 习惯

## React 编码规则

这份规则也是来自 Airbnb, 也是当下国内中大型企业所推崇的一个规范。

### 基本规则

- 每个文件只包含一个 React 组件, 但可以包含多个 Stateless 或 Pure 组件;
- 使用 JSX 语法;
- 除非是从一个非 JSX 文件中初始化 app, 否则不要使用 React.createElement;
- 如果需要管理内部状态或 refs, 优先使用 class extends React.Component;
- 如果不需要管理内部状态或 refs, 优先使用普通函数;

### 命名规则

- **扩展名**: 使用 jsx 作为 React 组件的扩展名;
- **文件名**: 文件命名采用帕斯卡命名法, 如: ReservationCard.jsx;
- **引用名**: 组件引用采用帕斯卡命名法, 其实例采用驼峰式命名法;

```javascript
// bad
import reservationCard from './ReservationCard';

// good
import ReservationCard from './ReservationCard';

// bad
const ReservationItem = <ReservationCard />;

// good
const reservationItem = <ReservationCard />;
```

- **组件名**: 使用文件名作为组件名。例如：ReservationCard.jsx 组件的引用名应该是 ReservationCard。然而，对于一个目录的根组件，应该使用 index.jsx 作为文件名，使用目录名作为组件名;

```javascript
// bad
import Footer from './Footer/Footer.jsx';

// bad
import Footer from './Footer/index.jsx';

// good
import Footer from './Footer';
```

### 对齐、空白、引号，与 ES6 规范一致

### 属性

- 属性名采用驼峰式命名法

```javascript
// bad
<Foo
  UserName="hello"
  phone_number={12345678}
/>

// good
<Foo
  userName="hello"
  phoneNumber={12345678}
/>
```

- 属性值为 true，可以忽略赋值

```javascript
// bad
<Foo
  hidden={true}
/>

// good
<Foo
  hidden
/>

// very good
<Foo hidden />
```

- 避免使用数组的 index 来作为属性 key 的值，推荐使用唯一 ID

```javascript
{
  todos.map((todo, index) => <Todo {...todo} key={index} />);
}

// good
{
  todos.map(todo => <Todo {...todo} key={todo.id} />);
}
```

- 对于组件所有的非必要属性需在 defaultProps 中定义
  > 为什么？propTypes 也是一种文档形式，提供 defaultProps 定义更有利于其他人阅读你的代码，并且能省略一些类型检查

```javascript
// bad
function SFC({ foo, bar, children }) {
  return (
    <div>
      {foo}
      {bar}
      {children}
    </div>
  );
}
SFC.propTypes = {
  foo: PropTypes.number.isRequired,
  bar: PropTypes.string,
  children: PropTypes.node,
};

// good
function SFC({ foo, bar, children }) {
  return (
    <div>
      {foo}
      {bar}
      {children}
    </div>
  );
}
SFC.propTypes = {
  foo: PropTypes.number.isRequired,
  bar: PropTypes.string,
  children: PropTypes.node,
};
SFC.defaultProps = {
  bar: '',
  children: null,
};
```

### 方法

- 如非必要, 在 render 方法对使用的事件处理函数绑定 this 时不要使用 bind, 而是使用箭头函数来获取本地 this, 如必须使用 bind, 在构造函数中绑定;
  > 为什么？在组件每次 render 时, 因为每次 bind 调用都会创建新的函数

```javascript
// bad
class extends React.Component {
  onClickDiv() {
    // do stuff
  }

  render() {
    return <div onClick={this.onClickDiv.bind(this)} />;
  }
}

// good
class extends React.Component {
  constructor(props) {
    super(props);

    this.onClickDiv = this.onClickDiv.bind(this);
  }

  onClickDiv() {
    // do stuff
  }

  render() {
    return <div onClick={this.onClickDiv} />;
  }
}

// very good
class extends React.Component {
  onClickDiv = () => {
    // do stuff
  }

  render() {
    return <div onClick={this.onClickDiv} />;
  }
}
```
