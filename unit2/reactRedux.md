> Marion 的 react 实战课程 > 第三部分 > react-redux

## React-Redux

React-Redux 是 Redux 的作者为 React 封装的一个专用库，它将所有组件分成了两个大类: UI 组件和容器组件

#### UI 组件

> 只负责 UI 的呈现，不带有任何业务逻辑  
> 没有状态（即不使用 this.state 这个变量）  
> 所有数据都由参数（this.props）提供  
> 不使用任何 Redux 的 API

#### 容器组件

> 负责管理数据和业务逻辑，不负责 UI 的呈现
> 带有内部状态
> 使用 Redux 的 API

总之，只要记住一句话就可以了：UI 组件负责 UI 的呈现，容器组件负责管理数据和逻辑。

你可能会问，如果一个组件既有 UI 又有业务逻辑，那怎么办？回答是，将它拆分成下面的结构：外面是一个容器组件，里面包了一个 UI 组件。前者负责与外部的通信，将数据传给后者，由后者渲染出视图。

React-Redux 规定，所有的 UI 组件都由用户提供，容器组件则是由 React-Redux 自动生成。也就是说，用户负责视觉层，状态管理则是全部交给它。

## connect()

React-Redux 提供 connect 方法，用于从 UI 组件生成容器组件。connect 的意思，就是将这两种组件连起来。

#### 普通用法

```javascript
import { connect } from "react-redux";

function UIComponent(props) {
  return <div></div>;
}

const Container = connect()(UIComponent);

export default Container;
```

#### 使用装饰器的用法

```javascript
import { Component } from "react";
import { connect } from "react-redux";

// 注意：因为装饰器的特殊性，它并不支持函数组件，这个不能搞混。
export default
@connect()
class UIComponent extends Component {
  render() {
    return <div></div>;
  }
}
```

上面的 Container 就是一个容器组件，虽然它因为没有业务逻辑，毫无意义

我们可以将 connect 看成是一个柯里化函数，它首先接受两个参数 mapStateToProps 与 mapDispatchToProps，前者负责将 store 库中的内容映射到我们的组件 props 中，后者负责将 store.dispatch 方法映射到我们的 props 当中。当这个函数执行完成后将返回一个 react 高阶组件，这个组件接受我们的 UI 组件作为参数，返回上面的容器组件提供给父组件调用。

#### mapStateToProps

mapStateToProps 是一个回调函数，它的作用就是建立一个 state 到 props 的映射，当 connect 调用它的时候，会将当前 store 库中的所有数据以一个对象的方式提供给这个回调函数，我们在进行一些计算或按需取用后将结果返回给 connect，connect 就会将这个结果注入到后面的组件的 props 当中去

```javascript
const mapStateToProps = (state) => {
  // 将state中的config属性注入到当前组件的props中
  return {
    config: state.config,
  };
};
connect(mapStateToProps)(UIComponent);

function UIComponent(props) {
  // 这样我们就可以获取它的值了
  console.log(props.config);
  return <div></div>;
}
```

注意：mapStateToProps 函数是一个可选参数，如果不传，则表示我们的组件不依赖 store 中的数据，所以无论 store 中的数据怎么改变，都不会重新渲染。

#### mapDispatchToProps

mapDispatchToProps 可以是一个回调函数，也可以是一个对象，同时它也是一个可选参数

当它是一个回调函数的时候我们这样用它
