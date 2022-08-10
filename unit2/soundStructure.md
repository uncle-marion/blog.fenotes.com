> 平安蜀黍的前端教程 > React 必学知识点 > react 源码结构

react 目前已经出到 18.0.0 版本了，但因为种种原因，我这边暂时还没时间去关注最新的代码，所以，我们的课程依然以 17.0.2 这个版本为准。当然，只要你能看明白了 17.0.2 这个版本的内容以后，相信无论哪个版本的源码你自己都能看懂了。

首先我们去 github 上下载 react 的源码：[https://github.com/facebook/react/tree/v17.0.2](https://github.com/facebook/react/tree/v17.0.2)

如果无法访问 github，可以访问码云：[https://gitee.com/mirrors/react/tree/v17.0.2/](https://gitee.com/mirrors/react/tree/v17.0.2/)或[点击这里,直接下载 react v17.0.2](https://github.com/facebook/react/archive/refs/tags/v17.0.2.zip)

### 源码结构

```bash
根目录
├── fixtures        # 包含一些给贡献者准备的小型 React 测试项目
├── packages        # 包含元数据（比如 package.json）和 React 仓库中所有 package 的源码（子目录 src）
├── scripts         # 各种工具链的脚本，比如git、jest、eslint等
```

### packages

这一段时间，我们主要学习的内容就在 packages 里。而 packages 目录下的文件非常多，我们暂时需要关注的则是下面几个目录：

```bash
packages
├── react             # 核心，包含所有全局API
├── scheduler         # 调度，任务的分配与调用
├── react-reconciler  # 协调，处理所有数据交互，而我们需要学习的大多数代码都来自于这个目录
├── shared            # 一些公用的方法与全局变量定义
├── react-art         # 渲染
├── react-dom         # 针对浏览器的一些
```

### react-reconciler

react-reconciler 这个目录很有意思。它内部大多数文件都存在两个版本 new.js 和 old.js，具体使用哪一个则是通过 ReactFeatureFlags 中的 enableNewReconciler 来控制的，默认是 false。也就是说，默认使用 old.js。出现这种情况是因为 react 团队在实现 Suspense 和 Concurrent 这两个依赖的时间过期模型时，发现它们只能分散在整个 reconciler 目录中，四处都是。所以很难通过几个 tag 标记来改动或者更新。而且他们还发现，这些代码其实并不会影响到整个项目的迭代。

在考虑过很多种方式后，最后 react 团队选择了 copy 一份 reconciler，然后保持 new 和 old 两份代码同时迭代。虽然这样的方式看起来不是很优雅，但为了向前兼容和向后代码的稳定性，他们决定在找到更好的解决方式之前，就这样维持着也不错。

这块呢，我曾经看到过 react 核心团队某一位成员对这块的一个解释，但时间有点长了，找不着这篇帖子了，那么，就这样吧。

```bash
src
├──
```
