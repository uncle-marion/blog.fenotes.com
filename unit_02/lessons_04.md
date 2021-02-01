> 企业项目实战 > 第二部分 > React 基础回顾

### JSX 与虚拟 DOM

#### 什么是 JSX

> JSX 即 JavaScript XML —— 一种在 React 组件内部构建标签的类似于 XML 的语法, 其格式比较像是模版语言, 但事实上完全是在 JavaScript 内部实现的。所以它也被称之为一个 JavaScript 的语法糖, JSX 主要应用于 React 架构中, 它能让我们在 JS 中编写 XML 标记语言。这样使用 JavaScript 来构建组件以及组件之间关系的应用, 在代码层面显得更清晰。

```javascript
return <div>这就是一段JSX代码</div>;
```

#### JSX 的渲染流程

> 如同上面所说的, JSX 其实是一个对象, 它在被编译后, 就成为了一个函数调用, 其返回值为一个 JS 对象, 这个 JS 对象是一个抽象的 DOM 对象, 也就是我们常说的虚拟 DOM。这样说, 你们可能不是那么容易理解, 那么现在, 我们去 babel 看看 JSX 编译后的对象长啥样子的：

[我们去 babel 看看编译后的 JSX](https://babeljs.io/repl#?browsers=&build=&builtIns=false&spec=false&loose=false&code_lz=G4QwTgBApgzgxiCBeCAKAUBCAeAJgS2AgHsA7AYQBt84BrJAbwBcALfGAOjKptoF8IAPkxYcMAA4hSEOJRAwYAORABbKEgBECJhuGjRAFQDyAWRFZsAeglS9OSwWCCAlOiA&debug=false&forceAllTransforms=false&shippedProposals=false&circleciRepo=&evaluate=true&fileSize=false&timeTravel=true&sourceType=module&lineWrap=true&presets=react&prettier=false&targets=&version=7.12.3&externalPlugins=)

从上面的例子中, 我们可以看到, JSX 对象中使用了 React.createElement 这个方法, 那么, 我们再去官网看看官方是怎么解释这个方法的吧：

[React.createElement 方法的官方解释](https://reactjs.bootcss.com/docs/react-api.html#createelement)

#### 什么是虚拟 DOM

> 参考上面 JSX 渲染流程中提到的, 虚拟 DOM 是相对于浏览器所渲染出来的真实 DOM 的, 在 React, Vue 等技术出现之前, 我们想要改变页面展示的内容只能通过遍历查询 DOM 树的方式来找到需要修改的 DOM, 然后修改其样式行为或者结构, 以达到更新视觉图层的目的。

#### 什么是 DOM

> DOM 是文档对象模型, 是为了操作文档而出现的 API, 它将整个页面规划成由节点层级构成的文档, 用于描述处理网页内容的方法和接口。  
> 在前端领域提到了 DOM 就不得不说到 JavaScript 的另一个对象模型：BOM, BOM 是浏览器对象模型, 是为了操作浏览器而出现的 API, 确切地说, BOM 是对浏览器本身进行操作, 而 DOM 是对浏览器内的内容进行操作。JavaScript 的实现就是使用 ECMAScript 脚本来操控这两个 API 实现对用户界面的修改。

#### 为什么要使用虚拟 DOM

> 真实 DOM 操作其资源消耗相对来说是比较大的, 因为每次查询几乎都需要遍历整个 DOM 树, 如果建立一个与 DOM 对应的虚拟 DOM 对象, 以对象嵌套的方式来表示 DOM 树, 那么每次对 DOM 的修改就变成了对 JavaScript 对象的属性的修改, 这样一来就能通过查找/修改 JavaScript 对象的属性变化来操作整个 DOM 树和它其中的节点, 其消耗无疑是要小很多的。

#### 为什么真实 DOM 操作的资源消耗大

> 真要说起来, 其实并不是查询 DOM 树性能开销大, 虽然说对每一个 DOM 节点的操作几乎都要遍历整棵 DOM 树, 但其根本原因还是因为 DOM 的实现模块和 JavaScript 模块是分开的, 因为我们都知道, JavaScript 是由 ECMAScript 加上 DOM 对象模型和 BOM 对象模型组合而来的。我们每一次对节点的操作都需要在两个甚至三个模块之间通讯来完成, 而正是这些跨模块的通讯消耗了较多的资源；
> 然后, 在我们每一次修改或添加新的 DOM 节点时都会重新生成整棵 DOM 树和 CSSOM 树(CSS 规则树), 然后合并 DOM 树与 CSSOM 树, 重新计算在页面如何绘制和渲染, 也就是我们常说的回流与重绘。这样就不可避免地造成了大量的 GPU 资源的消耗。

#### React 的 Diff 算法机制

> React 的 Diff 算法, 又被称之为 reconciliation(协调)。因为涉及到一些算法复杂度的问题, 比较深, 我们只能描述一些比较浅显的内容：对比虚拟 DOM 与真实 DOM 时, React 会比较两棵树的根节点, 当根节点为不同类型的元素时, React 会销毁掉原有的树并且建立起新的树, 组件实例将执行 componentWillUnmount 方法, 然后销毁与之前树有关的 state 并执行 componentDidMount 方法。如果根节点为相同类型的元素时, 则保留 DOM 节点, 仅比对及更新有改变的属性。然后重复这个步骤, 遍历并调整整棵树的结构。

#### React16 与 React15 Diff 的区别(当前不重要, 了解即可, 后续可自己研究)

> React16 以前的的 Reconciliation(官方称之为协调) 是 stack-reconciler(整齐调整)。采用递归形式工作的, 是同步的, 在生成虚拟 DOM 树与 diff 过程中是无法中断的。这样在组件层级过深时, 会造成 JavaScript 执行时间过长, 浏览器无法布局和绘制, 造成丢帧。  
> React16 以后的 Reconciliation 是 fiber-reconciler。采用的异步可中断更新代替了 React15 的同步更新, React16 的 scheduler 调度器会告诉 Reconciliation, 浏览器是否有空闲时间执行 JavaScript 脚本。这样就不会影响浏览器的绘制和布局工作。不会丢帧。  
> 所以 React16 以后的虚拟 DOM 节点对应变为 Fiber 节点, 虚拟 DOM 树对应变为了 Fiber 树。

推荐阅读：https://zhuanlan.zhihu.com/p/266564150?utm_source=wechat_timeline

#### react 的列表渲染使用 index 来作为 key 可以吗？

- 可以, 但是会有一定的风险, 如果需要对列表进行重新排序或增加/删除操作时, 因为 React 会使用 key 来识别列表元素是否更新或复用, 如果 key 是一个下标, 那么修改顺序时会修改当前的 key, 导致非受控组件的 state (比如输入框)可能被就地复用而导致无法达成我们预期的变动。

[参考官网](https://reactjs.bootcss.com/docs/reconciliation.html#recursing-on-children)

#### 简单的模板实现

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

name=小白&age=18&sex=男

#### 变量绑定

JSX 中的变量绑定, 之前我们说到过, JSX 归根倒底还是一个 JS 内部的语法实现, 这一对大括号里可以放置一些复杂表达式, 虽然我们不能在里面写一堆的 JS 代码, 但是写一些表达式已经足够了。

```javascript
<div>{this.state.name}</div>
```

#### 条件渲染

条件渲染, 如同我们的变量绑定一样, 只要用一对大括号包起来, 它的内部就可以实现一些简单的 JavaScript 与或甚至三元这种表达式, 都是 OK 的, 但是不能用 ifelse 这种复杂语句。

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
  {
    // 这里如果使用了html标签, 会导致返回的html格式失效, 所以我们需要一个用来定义片段的元素, 不生成 tag但又能符合 React JSX的规范
  }
  <React.Fragment>
    <td>开始下载</td>
    <td>下载完成</td>
    <td>下载中</td>
  </React.Fragment>
</tr>

// 也可以使用Fragment的简版：<></>; 它们在语义和实现上是完全一致的, 所以, 我们更推荐使用空标签;
// 不过, 还有一种情况, 就是当我们循环中的标签需要用到key的时候, 就必须使用 React.Fragment 了
```

#### 小节结束

本小节中需要死记的内容较多, 关于 JSX/DOM/虚拟 DOM 这些都是面试时问得比较多的问题, 然后关于其它的, 你们已经用了一个月了, 再多用 2 个月, 相信怎么都了解透彻了
