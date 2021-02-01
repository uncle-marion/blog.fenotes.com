> 企业项目实战 > 第三部分 > React进阶 > Redux => 数据驱动全世界

### Redux的流程与实现

#### 一个最简单的Redux实现

```javascript
// 从redux中引入一个createStore
import { createStore } from 'redux';

// 定义一个reduce方法
// reduce方法需要两个参数，一个当前状态对象state，一个用于描述将要对store做些什么的对象
function clickReduce(state = { text: '这是什么' }, action) {
  // 如果是指定的点击事件，新建一个对象，将原有的state与新的属性合并后返回
  if (action.type === 'BTN_CLICK') {
    // 这里我们不能直接改变state的内容，只需要返回一个我们修改完成的对象就行
    return Object.assign({}, state, action.payload);
  }
  // 如果不是，返回原有的state(无任何变动)
  return state;
}

// 新建一个状态仓库，Redux通过全局唯一的store对象管理项目中所有的状态
// createStore接受三个参数 (reducer, preloadedState, enhancer)
// 参数一, 必填 reducer 一个reduce或reduce的集合
// 参数二, 可选 preloadedState 一个state或state的集合
// 参数三, 可选 store增强器，一个柯里化工具
const store = createStore(clickReduce);
// 我们来看看store里面有些什么内容

// action对象
const clickAction = {
  // reduce里注册的事件type
  type: 'BTN_CLICK',        // action用于区别与其它action的标记
  // 需要传入的状态
  text: '这是redux返回的内容' // payload必须是同步的
}

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

#### 使用ReactRedux来简化我们的程序

```javascript
import { createStore } from 'redux';
import { connect } from 'react-redux';

// 定义一个reduce方法
// reduce方法需要两个参数，一个当前状态对象state，一个用于描述将要对store做些什么的对象
function clickReduce(state = { text: '这是什么' }, action) {
  // 如果是指定的点击事件，新建一个对象，将原有的state与新的属性合并后返回
  if (action.type === 'BTN_CLICK') {
    // 这里我们不能直接改变state的内容，只需要返回一个我们修改完成的对象就行
    return Object.assign({}, state, action.payload);
  }
  // 如果不是，返回原有的state(无任何变动)
  return state;
}

// 新建一个状态仓库，Redux通过全局唯一的store对象管理项目中所有的状态
// createStore接受三个参数 (reducer, preloadedState, enhancer)
// 参数一, 必填 reducer 一个reduce或reduce的集合
// 参数二, 可选 preloadedState 一个state或state的集合
// 参数三, 可选 store增强器，一个柯里化工具
const store = createStore(clickReduce);
// 我们来看看store里面有些什么内容

// action对象
const clickAction = {
  // reduce里注册的事件type
  type: 'BTN_CLICK',        // action用于区别与其它action的标记
  // 需要传入的状态
  text: '这是redux返回的内容' // payload必须是同步的
}

class MiniRedux extends PureComponent {
  constructor(props) {
    super(props);
    // 设定组件state为从store中获取
    this.state = store.getState();
  }

  componentDidMount() {
    // 我们可以理解为这是一个事件监听回调，类似于JQ中的on
    store.subscribe(() => {
      // 当store发生改变的时候，我们重新读取state
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
export default connect(MiniRedux);
```

### Decorator:@ 修饰符

装饰器是一种特殊类型的声明，它能够被附加到类声明，方法，访问符，属性或参数上。装饰器使用 @expression这种形式，expression求值后必须为一个函数，它会在运行时被调用，被装饰的声明信息做为参数传入。通俗的理解可以认为就是在原有代码外层包装了一层处理逻辑。

可能有些时候，我们会对传入参数的类型判断、对返回值的排序、过滤，对函数添加节流、防抖或其他的功能性代码，基于多个类的继承，各种各样的与函数逻辑本身无关的、重复性的代码。装饰器的实现让开发人员更加关注业务代码的开发，封装功能辅助性的代码。让开发人员把焦点放在业务上，实现焦点分离。所以，对于装饰器，可以简单地理解为是非侵入式的行为修改。

需要注意的是：到目前为止，装饰器仍然是一项实验性特性，在未来的版本中可能会发生改变！

```javascript

const logWrapper = targetClass =>{
    const orignRender = targetClass.prototype.render;
    targetClass.prototype.render = function(){
        console.log("wrap log begin")
        orignRender.apply(this);//防止this指向改变了
        console.log("wrap log end")
    }
    return targetClass;
}

@logWrapper
class App {
    get state(){
        return 666
    }
    render(){
        console.log("this is App's render func,state is "+ this.state);
    }
}
new App().render();

class App {
    get state(){
        return 666
    }
    render(){
        console.log("this is App's render func,state is "+ this.state);
    }
}
const wrapLogApp = logWrapper(App);
new wrapLogApp().render();

```