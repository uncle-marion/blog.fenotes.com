> Marion 的 react 实战课程 > 第二部分 > 高阶组件

# 高阶组件

官方说：高阶组件（HOC）是 React 中用于复用组件逻辑的一种高级技巧。HOC 自身不是 React API 的一部分，它是一种基于 React 的组合特性而形成的设计模式。
官方又说：高阶组件是参数为组件，返回值为新组件的函数。

## 理解高阶组件之前，我们需要先理解什么是高阶函数

什么是高阶组件？这个其实是复用了函数式编程中的高阶函数的概念，高阶函数是对其他函数进行操作的函数，操作可以是将它们作为参数，或者是返回它们。简单来说，高阶函数是一个接收函数作为参数或将函数作为输出返回的函数。其实我们很早就接触到了高阶函数，但是并没有人告诉我们这就是一个高阶函数，比如 map、filter、reduce 等等；

#### 示例 1：

假设我们有一个数字数组，我们想要创建一个新数组，其中包含第一个数组中每个值的两倍。 让我们看看如何使用和不使用高阶函数来解决问题。

```javascript
const arr1 = [1, 2, 3];
const arr2 = [];
for (let i = 0, l = arr1.length; i < l; i++) {
  arr2.push(arr1[i] * arr1[i]);
}
```

上面这个例子，我们需要先定义一个新数组，然后再创建一个 for 循环来遍历数组 1 并进行运算。而我们如果使用 Es6 中的新方法 map 就可以很容易做到：

```javascript
const arr1 = [1, 2, 3];
const arr2 = arr1.map((item) => item * 2);
```

这个例子中的 map 方法，它接受了一个对传入参数进行简单运算的函数作为参数，然后返回这个函数运算后的值。我们将它简单拆解一下看看：

```javascript
const arr1 = [1, 2, 3];
const mapMethod = function (item, index, all) {
  return item * 2;
};
// 它只是接受一个函数作为参数而已
const arr2 = arr1.map(mapMethod);
```

```javascript
const arr1 = [1, 2, 3];
// 这个方法只是让我们理解，没有任何兼容性
Array.prototype.myMap = function (fun) {
  const arr = [];
  for (let i = 0, l = this.length; i < l; i++) {
    arr.push(fun(this[i]));
  }
  return arr;
};
const arr2 = arr1.myMap((item) => item * 2);
```

#### 示例 2：

又或者，我们需要将某个特定数组转换成一棵对象树，如果不使用高阶函数，可能是这样实现的

```javascript
const arr1 = [
  ["tom", 3],
  ["jerry", 2],
  ["kitty", 2],
];
const obj1 = {};
for (let i = 0, l = arr1.length; i < l; i++) {
  const item = arr1[i];
  obj1[item[0]] = item[1];
}
```

上面同样是使用了遍历的方法，但我们使用 ES6 内置的 reduce 方法可以更容易地做到

```javascript
const arr1 = [
  ["tom", 3],
  ["jerry", 2],
  ["kitty", 2],
];
const obj1 = arr1.reduce((old, item) => {
  old[item[0]] = item[1];
  return old;
}, {});
```

关于 reduce，我们后续会有更深入的研究，它可以做很多的事情，比如累加，比如将二维数组转换成一维，比如计算数组中每个元素出现的次数，等等，学习使用它的方法，我们可能要花一整天的时间，所以，在这里不再进行描述。

## 为什么使用高阶组件

React 官方说，要使用 HOC 来解决横切关注点的问题

ps: 横切关注点，指的是指的是一些具有横越多个组件的行为，使用传统的软件开发方法 不能够达到有效的模块化的一类特殊关注点
推荐阅读：[https://zhuanlan.zhihu.com/p/76618283](https://zhuanlan.zhihu.com/p/76618283)

ps: 有时候，我们会发现学会了一个知识点后反而不懂的更多了。。没关系，太深入的我们可以先不管它，先专注做好眼前的事情，有时间再慢慢深入研究。所以，这个横切关注点，我们先不用管它。

因为组件是 react 中代码的最小复用单元。但我们会发现在很多时候，有些组件明明看起来很容易被复用，但往往在复用时又发现缺少了些什么。这个时候我们就可以使用高阶组件来对已定义的组件进行一些补充和完善。

#### 高阶组件的写法

```javascript
function withExamp(WrapComponent) {
  return class PP extends React.Component {
    render() {
      return <WrapComponent {...this.props} />;
    }
  };
}
```

#### 通过一个简单的高阶组件来理解高阶组件

比如，我们定义了一个组件，它会在页面中渲染一个 name 的状态

```javascript
export default class Index extend Component{
  render() {
    const {name} = this.props
    return <div>Welcome To React World, { name }</div>
  }
}
```

这个组件在我们多个页面中被调用，工作得很正常。但突然有一天产品设计了一个页面，在这个页面中我们因为种种原因，没办法往下传递这个 name 属性，那现在怎么办呢？修改 Index 组件肯定是不可能的，那可能会导致之前使用了这个组件的其它页面都要修改。

这个时候我们就可以使用高阶组件来实现

```javascript
function withName(WrapComponent){
  return <WrapComponent { ...this.props } name={'Tom'} />
}

export
@withName
class Index extend Component{
  render() {
    const {name} = this.props
    return <div>Welcome To React World, { name }</div>
  }
}

export default Index
```

或者再举一个例子

```javascript
export default class Index extend Component{
  render() {
    return<div>这里是一段文本</div>
  }
}
```

但某天产品又提出了一个新需求，要求我们给这段文本加一个标题，怎么办呢？

```javascript
function withTitle(WrapComponent) {
  return class InjectTitle extends Component {
    render() {
      return (
        <div>
          <div>
            这是一段标题
          </div>
          <WrapComponent {...this.props} />
        </div>
      )
    }
  }
}
export
@withTitle
class Index extend Component{
  render() {
    return<div>这里是一段文本</div>
  }
}
```

上面这两个例子是我们比较常见的一种高阶组件的使用方式，用来描述我们怎样强化某个通用组件的 props，还有一种被称之为反向继承的方法，我们可以让高阶组件继承被包裹的组件：

```javascript
export default function (WrappedComponent) {
  return class Inheritance extends WrappedComponent {
    componentDidMount() {
      // 可以方便地得到state，做一些更深入的修改。
      console.log(this.state);
    }
    render() {
      return super.render();
    }
  };
}
```

##### 推荐使用的高阶组件

React 拖动库[https://github.com/clauderic/react-sortable-hoc](https://github.com/clauderic/react-sortable-hoc)

> 通过使用此库提供的高阶组件，可以方便地让列表元素可拖动。

recompact[https://github.com/gregberge/recompact](https://github.com/gregberge/recompact)

> recompact 提供了一系列使用的高阶组件，可以增强组件的行为，我们可以利用这个库学习高阶组件的写法。

```javascript
import React from "react";
import {
  setDisplayName,
  compose,
  pure,
  withState,
  renameProp,
  withHandlers,
} from "../src";

export default compose(
  setDisplayName("RecompactCounter"),
  pure,
  withState("value", "onChange", 1),
  renameProp("value", "count"),
  withHandlers({
    onIncrement:
      ({ count, onChange }) =>
      () =>
        onChange(count + 1),
  })
)(({ onIncrement, count }) => (
  <button type="button" onClick={onIncrement}>
    {count}
  </button>
));
```

## 高阶组件的实例

##### 实现一个 loading 组件

实现 Loading 组件时，发现需要去拦截它的渲染过程，故使用了反向继承的方式来完成。

在通过装饰器调用时，需要传入一个函数作为入参，函数可以获取到 props，随后返回一个 Boolean 对象，来决定组件是否需要显示 Loading 状态

```javascript
import React, { Component } from "react";
import { Spin } from "antd";
export default function (loadingCheck) {
  return function (WrappedComponent) {
    return class extends WrappedComponent {
      componentWillUpdate(nextProps, nextState) {
        console.log("withLoading将会更新");
      }
      render() {
        if (loadingCheck(this.props)) {
          return (
            <Spin tip="加载中" size="large">
              {super.render()}
            </Spin>
          );
        } else {
          return super.render();
        }
      }
    };
  };
}

//
import React from 'react'
import { Spin } from 'antd'
export default function AA(WrapComponent) {
  // 返回一个匿名类，这个类继承了我们导入的wrapComponent
  return class PP extends WrapComponent {
    componentWillUpdate(nextProps, nextState) {
      console.log('withLoading将会更新')
    }
    render() {
      return (
        // 直接从当前的state中获取到被封装的组件中的state或props或方法
        <Spin tip="加载中" size="large" spinning={this.state.showLoading}>
          {super.render()}
        </Spin>
      )
    }
  }
}
```

##### 实现一个 copy 组件

实现 copy 组件的时候，我们发现不需要去改变组件内部的展示方式，只是为其在外围增加一个功能，并不会侵入被传入的组件，所以使用了属性代理的方式。

```javascript
import gotem from "gotem";
import React, { Component } from "react";
import ReactDom from "react-dom";
import { message } from "antd";
export default copy = (targetName) => {
  return (WrappedComponent) => {
    return class extends Component {
      componentDidMount() {
        const ctx = this;
        const dom = ReactDom.findDOMNode(ctx);
        const nodes = {
          trigger: dom,
          // targetName为DOM选择器，复制组件将会复制它的值
          target: dom.querySelector(targetName),
        };
        gotem(nodes.trigger, nodes.target, {
          success: function () {
            message.success("复制成功");
          },
          error: function () {
            message.error("复制失败，请手动输入");
          },
        });
      }
      render() {
        return <WrappedComponent {...this.props} />;
      }
    };
  };
};
// 使用
// 传入 h3 ，让复制组件去获取它的值
@copy("h3")
class Info extends Component {
  render() {
    return (
      <div>
        <h3>阿里云,点击复制这段文字</h3>
      </div>
    );
  }
}
```

#### 组合多个高阶组件

上面的高阶组件为 React 组件增强了一个功能，如果需要同时增加多个功能需要怎么做？这种场景非常常见，例如我既需要增加一个组件标题，又需要在此组件未加载完成时显示 Loading。

```javascript
@withHeader
@withLoading
class Demo extends Component {}
```

使用 compose 可以简化上面的过程，看起来也更符合函数式编程的思想

```javascript
const enhance = compose(withHeader, withLoading);
@enhance
class Demo extends Component {}
```

> - 组合 Compose

> compose 可以帮助我们组合任意个（包括 0 个）高阶函数，例如 compose(a,b,c)返回一个新的函数 d，函数 d 依然接受一个函数作为入参，只不过在内部会依次调用 c,b,a，从表现层对使用者保持透明。

> 基于这个特性，我们便可以非常便捷地为某个组件增强或减弱其特征，只需要去变更 compose 函数里的参数个数便可。

> compose 函数实现方式有很多种，这里推荐其中一个 recompact.compose，详情见下方参考类库。

## 小结

什么是高阶组件：高阶组件通过包裹（wrapped）被传入的 React 组件，经过一系列处理，最终返回一个相对增强（enhanced）的 React 组件，供其他组件调用。它可以抽离公共逻辑，像洋葱一样层层叠加给组件，每一层职能分明，可以方便地抽离与增添。在优化代码或解耦组件时，可以考虑使用高阶组件模式。
