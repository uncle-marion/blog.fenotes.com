> Marion 的 react 实战课程 > 第一部分 > DIFF 与 FIBER

## Diff 算法的作用

计算出 Virtual DOM 中真正变化的部分，并只针对该部分进行原生 DOM 操作，而非重新渲染整个页面。

## React 15 的 DIFF 算法

在 React16 以前，React 采用的是一种传统的 DIFF 算法，被称之为"整齐协调"的方式（stack-reconciler）。

这种算法需要对 DOM 树进行多次循环递归来寻找发生变化的节点，它的算法复杂度虽然比起我们的模板语法优化了很多，但仍然达到了 O(n^3)(n=节点数)这样的一个量级。这样一个量级有多复杂呢？如果我们的页面中有 1000 个节点，那么需要执行上十亿次的比较才能找到我们想要改变的节点，对于前端渲染场景来说，这种指数型的性能消耗代价太高了。

另外一个原因是，它的计算方式是同步的，只要一个进程开始了，那么，在未结束之前就绝不停止。当 stack reconciler 处理大状态更新时，一方面需要进行前面说的复杂计算，另一方面还需要深度遍历组件树，这中间的工作可能不是一两秒能完成的。所以长期工作的 js 执行引擎就导致了后续的 render 方法被挂起，浏览器无法进行布局和绘制操作，这时页面就不可避免地出现了丢帧，形成了我们常说的卡顿感。

#### 题外：浏览器的 16.6 机制

> 对人眼来说，正常流畅的刷新率为 60hz，即 60 帧，即浏览器 16.6ms 刷新一次。

> 我们知道 js 可以操作 dom 元素，所以浏览器的 GUI 线程和 js 线程是互斥的。js 的执行和浏览器的绘制，布局不能同时进行。所以在每 16.6ms 内浏览器要执行如下操作：

> JS 脚本执行 => 浏览器样式布局 => 浏览器样式绘制

> 如果 js 脚本执行时间过长，超过 16.6ms，这次刷新中浏览器绘制和布局就无法执行，这就会造成人眼可识别的卡顿，发现操作时浏览器没有“实时”做出反应。如：对于用户在输入框输入内容这个行为来说，就体现为按下了键盘按键但是页面上不实时显示输入。

## React 16 的 DIFF 算法

综上，为了优化 stack-reconciler 算法需要多次循环递归来寻找到发生变化的节点，React 在第 16 个版本以后推出了新的 DIFF 算法：Fiber-reconciler。

#### 查找 DOM 节点的计算优化

首先，React 大胆地采用三大策略将 stack-reconciler O(n^3)的复杂度转化为了 O(n)复杂度

- 策略一（tree diff）：

> Web UI 中 DOM 节点跨层级的移动操作特别少，可以忽略不计。

- 策略二（component diff）：

> 拥有相同类型的两个组件 生成相似的树形结构，

> 拥有不同类型的两个组件 生成不同的树形结构。

- 策略三（element diff）：

> 对于同一层级的一组子节点，通过唯一 id 区分。

再来看一张图：

<img src="https://5b0988e595225.cdn.sohucs.com/images/20180629/47d27dc0d36448f7b4efa09c71d3c0e0.png" />

结合前面的这三个策略，React 在对比虚拟 DOM 与真实 DOM 时, 首先比较两棵树的根节点, 当根节点为不同类型的元素时, React 会销毁掉原有的树并且建立起新的树, 组件实例将执行 componentWillUnmount 方法, 然后销毁与之前树有关的 state 并执行 componentDidMount 方法。而如果根节点为相同类型的元素时, 则保留 DOM 节点, 仅比对及更新有改变的属性。然后寻找并比较下一级节点，重复上面的步骤, 直至遍历并调整整棵树的结构。

这样，只需遍历一次就完成了整棵 DOM 树的比较工作。

> 注：它的遍历也是有一些说法的，但不是怎么很统一，所以，在这里我选出了一个比较小众的文章，我认为瞎咧咧得很有道理

[https://zhuanlan.zhihu.com/p/56277866](https://zhuanlan.zhihu.com/p/56277866)

#### 改同步处理为异步处理，优化渲染

React 首先在 Stack-reconciler 架构层次上增加了一层任务调度的结构，如下所示：

- Stack-reconciler 的架构

> Reconciler（协调器）— 找出需要更新的组件，以及标识出如何更新

> Renderer（渲染器）— 负责将变化后的组件渲染到页面上

- Fiber-reconciler 的架构

> Scheduler（调度器）— 调度任务的优先级，高级优先级的优先进入 Reconciler 阶段

> Reconciler（协调器）— 找出需要更新的组件，以及标识出如何更新

> Renderer（渲染器）— 负责将变化后的组件渲染到页面上

这样，在每一次进行更新时，Scheduler 结构会尝试读取当前浏览器的进程，并将结果反馈回 reconciler，告诉 reconciler 浏览器是否有空闲时间执行脚本，这样就不会影响浏览器的布局和绘制工作，避免丢帧的问题发生。

推荐阅读：[https://reactjs.bootcss.com/docs/reconciliation.html](https://reactjs.bootcss.com/docs/reconciliation.html)

## react 的列表渲染使用 index 来作为 key 可以吗？

- 可以, 但是会有一定的风险, 如果需要对列表进行重新排序或增加/删除操作时, 因为 React 会使用 key 来识别列表元素是否更新或复用, 如果 key 是一个下标, 那么修改顺序时会修改当前的 key, 导致非受控组件的 state (比如输入框)可能被就地复用而导致无法达成我们预期的变动。

推荐阅读：[https://reactjs.bootcss.com/docs/reconciliation.html#recursing-on-children](https://reactjs.bootcss.com/docs/reconciliation.html#recursing-on-children)
