> Marion 的 react 实战课程 > 第二单元 React 基础与关联知识 > JSX 与虚拟 DOM

### 什么是 DOM

DOM 这个名词我们听到过很多次了，我不知道你们有没有谁去关注过它究竟是什么。DOM 是 Document Object Model 的缩写，翻译成中文就是文档对象模型。它是 XML 和 HTML 文档的编程接口(我们主要关注 HTML，后面的内容将忽略 XML)，它将整个页面规划成由节点层级构成的文档并提供描述处理网页内容的方法和接口。

有了 DOM 我们才能通过程序去控制 HTML 文件中内容变化, 没有 DOM 我们就无法使用任何程序语言去控制 HTML。换个说法就是：DOM 是一个用于查找、添加、修改或删除 HTML 元素的工具。

对于我们来说，需要了解 DOM 以下接口模块：

- 核心模块： 定义了基于 XML 的文档结构标准(DOM1)
- HTML 模块： 在核心模块上加以扩展，添加了针对 HTML 的对象和方法(DOM1)
- 视图模块： 定义了跟踪不同文档视图的接口(DOM2)
- 事件模块： 定义了事件和事件处理的接口(DOM2)
- 遍历和范围模块：定义了遍历和操作文档树的接口(DOM2)
- 样式模块： 定义了基于 CSS 为元素应用样式的接口(DOM2)
- 加载和保存模块： 统一加载和保存文档的方法(DOM3)
- 验证模块： 定义了验证文档的方法(DOM3)

**推荐阅读：[DOM 文档对象模型](https://tsejx.github.io/javascript-guidebook/document-object-model)**

### 什么是 JSX

JSX 即 JavaScript XML —— 一种在 React 组件内部构建标签的类似于 XML 的语法, 其格式比较像是模版语言, 但事实上完全是在 JavaScript 内部实现的。所以它也被称之为一个 JavaScript 的语法糖, JSX 主要应用于 React 架构中, 当然，它也可以应用于其它框架比如 Vue。

JSX 能让我们在 JS 中编写 XML 标记语言。这样在使用 JavaScript 来构建组件以及组件之间关系的应用时, 在代码层面表现出来的结构会更清晰。

```javascript
return <div>这就是一段JSX代码</div>;
```

因为 JSX 出生得比较晚，所以浏览器完全不认识它们。因此，我们编写完成的 JSX 脚本还需要经过 babel 将它编译成一个叫做 React.createElement 的函数然后调用。虽然这个编译的过程在我们平时写代码时是不可见的，但我们平时执行 npm start 或 npm run build 命令时，webpack 会自动地将所有 JSX 文件转换成浏览器能识别的 js 文件，然后浏览器在我们访问对应的页面时由 React 来执行这个 createElement 方法，将内容输出到 html 根节点（#root）中。

### JSX 的渲染流程

如同上面所说的, JSX 在被编译后, 就成为了一个函数调用, 这个函数的返回值是一个 JS 对象，一个抽象的 DOM 对象, 也就是我们常说的虚拟 DOM。这样说, 你们可能不是那么容易理解, 那么现在, 我们去 babel 看看 JSX 编译后的对象长啥样子的：

[我们去 babel 看看编译后的 JSX](https://babeljs.io/repl#?browsers=&build=&builtIns=false&corejs=3.21&spec=false&loose=false&code_lz=MYewdgzgLgBApgGzgWzmWBeGAKAUDAmAHgBMBLANwD59CCiALARioAlEEQAaGAdxABOCEgEIiAemY069BgCYqASVhkIMAN5g4vGABEAhlDjYAlADooIADIhg-pABUyqAMpQBZMAHNTAXzMS8tKEEuTUtCYA3LhAA&debug=false&forceAllTransforms=false&shippedProposals=false&circleciRepo=&evaluate=true&fileSize=false&timeTravel=true&sourceType=module&lineWrap=true&presets=react&prettier=false&targets=&version=7.18.9&externalPlugins=&assumptions=%7B%7D)

无法打开页面的可以看下面这段代码：

```javascript
// JSX代码
const element = (
  <div>
    <h1>Hello, world!</h1>
    <h2>It is {new Date().toLocaleTimeString()}.</h2>
  </div>
);

// 编译后的函数
const element = /*#__PURE__*/ React.createElement(
  'div',
  null,
  /*#__PURE__*/ React.createElement('h1', null, 'Hello, world!'),
  /*#__PURE__*/ React.createElement(
    'h2',
    null,
    'It is ',
    new Date().toLocaleTimeString(),
    '.'
  )
);
```

从上面的例子中, 我们可以看到, JSX 对象中使用了 React.createElement 这个方法, 当 JSX 经过 babel 编译成 React.createElement 递归调用的表达式后，在 render 函数被调用的时候执行。也就是说，当 render 函数被调用的时候，会返回一个 ReactElement 对象（组成虚拟 DOM 树的节点）。

React 中有四种用于创建 element 类型的方法，分别为：

> 原生 DOM 调用：ReactDOMComponent

> 自定义类调用：ReactCompositeComponentWrapper

> 文本节点：ReactDOMTextComponent

> 空节点：ReactDOMEmptyComponent

上面列出的四种方法我们平时在代码里是接触不到的，所以在当前不必过份深入理解。但上面四个方法在最后都会调用我们常见的两个方法：

> 创建组件：mountComponent，这个方法会激活我们代码中以 mount 为后缀的生命周期方法

> 更新组件：updateComponent，这个方法会激活我们代码中以 update 为后缀的生命周期方法

### JSX 的基本用法

上面的例子代码中有一对大括号, 然后我们在大括号里写入了一个 JavaScript 表达式：new Date().toLocaleTimeString(), 这就是最简单的变量绑定，React 在执行 createElement 时，会检查代码里是否有“{}”这种标记，如果有且它的内部是一个 JavaScript 表达式就会执行它并返回执行的结果：

```javascript
import React from 'react';
import ReactDOM from 'react-dom';

const element = (
  <div>
    <h1>Hello, world!</h1>
    <h2>It is {new Date().toLocaleTimeString()}.</h2>
  </div>
);

ReactDOM.render(element, document.getElementById('root'));
```

#### 条件渲染

条件渲染, 如同我们的变量绑定一样, 只要用一对大括号包起来, 它的内部就可以实现一些简单的 JavaScript 与或表达式或者三元表达式, 都是 OK 的, 但是不能用 ifElse 这种复杂语句。

```javascript
// 普通的三元
(
  <div>
    {isdone ? (
      <span>下载完成</span>
    ) : (
      <span>下载中</span>
    )}
  </div>
)

// 下面这种与或运算符也是可行的
(
  <div>
    {isdone && (
      <span>下载完成</span>
    )}
    {isdone || (
      <span>下载中</span>
    )}
  </div>
)

// 如果代码量较多, 最好是使用函数调用表达式

handlerDownStatus(isDone) {
  if (isDone) {
    return (
      <span>下载完成</span>
    );
  }
  return (
    <span>下载中</span>
  );
}

(
  <div>
    { this.handlerDownStatus() }
  </div>
)

```

#### 列表渲染

```javascript
state = {
  list: [1, 2, 3],
}(
  <div>
    {this.state.list.map(item => (
      <span>{item}</span>
    ))}
  </div>
);
// 注意: map方法中, 一行能返回的, 不需要用大括号包起来, 只有一个参数的, 不需要小括号包起来
```

#### 无嵌套一次返回多个元素

在 JSX 语法中, 同一个作用域, 一次只能返回一个 React 元素, 但很多时候, 我们可能需要在同一个作用域里返回两个或多个平级的 React 元素, 但是又不想嵌套太深, 那么可以用下面的方法

```javascript
// <React.Fragment></React.Fragment>,  React.Fragment 是 react 推荐使用于下面这种状态的容器标签, 能有效返回而又不会在DOM中生成多余的标签。
<tr>
  {/* 这里如果使用了html标签, 会导致返回的html格式失效, 所以我们需要一个用来定义片段的元素, 不生成 tag但又能符合 React JSX的规范 */}
  <React.Fragment>
    <td>开始下载</td>
    <td>下载完成</td>
    <td>下载中</td>
  </React.Fragment>
</tr>

// 也可以使用Fragment的简版：<></>; 它们在语义和实现上是完全一致的, 所以, 我们更推荐使用空标签;
// 不过, 还有一种情况, 就是当我们循环中的标签需要用到key的时候, 就必须使用 React.Fragment 了
```

### 什么是虚拟 DOM? 为什么要使用虚拟 DOM

参考上面 JSX 渲染流程中提到的, 虚拟 DOM 是相对于浏览器所渲染出来的真实 DOM 的, 就是一种未渲染之前只存在于内存之中的类似于 DOM 节点的对象树。

因为互联网发展得太快，现在的网页应用中，充满了大量的功能和交互，而早期的文档对象模型并没有考虑到这种频繁的交互，所以，在 React, Vue 等技术出现之前, 我们想要改变页面展示的内容只能通过遍历查询 DOM 树的方式来找到需要修改的 DOM, 然后修改其样式行为或者结构, 以达到更新视觉图层的目的。但这样做的话每一次对象的捕获都需要耗费很多的计算资源，为了减少资源消耗，在 react、vue 出现之前，我们开始使用一种模板的方式来实现对 DOM 的创建和修改，像下面的代码：

```javascript
let template = '我是{name}，年龄{age}，性别{sex}';
let data = {
  name: '小白',
  age: 18,
  sex: '男',
};
function render(template, data) {
  // 通过正则查找对应的属性名，然后去data中取
  return template.replace(/(\{(\w+)\})/g, (all, current, key) => {
    return data[key];
  });
}
render(template, data);
```

可以这么说，其实 React/Vue 就是站在这种模板语法的基础上站起来的。但我们在使用这种模板语言后发现，虽然减少了捕获 DOM 节点带来的资源消耗，但在每一次改变某一个节点时，仍然需要消耗大量的资源来对模板进行遍历以进行变量的替代和置换。而且，这种模板语言无法将 XML 语句与 JavaScript 代码放在一起，导致我们在维护代码时也不是很方便。

于是 React/Vue 这两个所谓的前端框架就趁势而起，在前端工程化刚刚成熟起来的时候提出了关于虚拟 DOM 的这样一个概念，并以其高度优化的算法取代了市面上其它的模板语言。通过建立一个与 DOM 对应的虚拟 DOM 对象, 以对象嵌套的方式来表示 DOM 树, 让每次对 DOM 的修改变成了对 JavaScript 对象的属性的修改, 这样一来就能通过查找/修改 JavaScript 对象的属性变化来操作整个 DOM 树和它其中的节点, 同时将 templete 模板以 JSX 这种方式置入了 JavaScript 代码的内部，更加方便了我们的维护工作。

## 为什么真实 DOM 操作的资源消耗大

上面说到了，操作真实 DOM 消耗的资源比较大，其实这是较早期的一个误解。那时我们认为真实 DOM 操作的资源消耗大是因为每次查询几乎都需要遍历整个 DOM 树, 但其实真要说起来, 并不是查询 DOM 树性能开销大, 但这点资源本身对于我们的计算机来说并不是大到不可以接受的一种开销。DOM 操作浪费资源的根本原因还是因为 DOM 的实现模块和 JavaScript 模块是分开的, 我们每一次对 DOM 进行查询、修改等操作时，都需要在 DOM 与 EcmaScript 两个模块之间进行通讯，有时候甚至还需要加上 BOM 对象模型，而正是这些跨模块的通讯消耗了大量的 GPU 资源；

然后, 还要说起的，是浏览器的一个渲染机制，就是我们平时所说到的回流：在我们每一次修改或添加新的 DOM 节点时，浏览器都需要重新遍历整个 HTML 文档和 CSS 文档，生成整棵 DOM 树和 CSSOM 树(CSS 规则树), 然后合并 DOM 树与 CSSOM 树, 重新计算在页面如何绘制和渲染, 这也不可避免地浪费了大量的 GPU 资源。
