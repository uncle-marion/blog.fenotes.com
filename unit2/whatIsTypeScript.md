> 平安蜀黍的前端教程 > 第二单元 TypeScript 基础学习 > 什么是 TypeScript

## 什么是 TypeScript

TypeScript 是一种基于 ECMAScript 构建的强类型编程语言。使用 TypeScript 语言编辑的代码最终会被编译成 JavaScript 代码，可以在任何 JavaScript 引擎(例如浏览器或者 Node 服务器)中运行。

TypeScript 是用于解决我们在大型编码工作中所遇到的类型错误问题的，是 ECMAScript 程序的静态类型检查器，它在现有的 ECMAScript 的语法之上加入了一层叫做类型检查的机制，让我们可以在代码发布之前发现各种类型错误、语法错误等等低级问题。作为一个在 ECMAScript 代码运行之前运行的工具，我们也可以称之为静态编译工具。

## 为什么要用 TypeScript

### ECMAScript 的缺陷

在 ECMAScript 中每个值都有一组不同的行为，我们可以通过运行不同的操作来观察它们，比如：

```javascript
// 在"message"上访问属性"toLowerCase"并调用它
message.toLowerCase();
// 调用"message"
message();
```

我们假设有 message 这样一个变量，而我们即将对 message 进行操作，但我们并不知道 message 具体是一个什么样的变量，它是一个值还是一个方法？它有 toLowerCase 这样一个属性吗？toLowerCase 是一个值还是一个方法？如果这两个方法可以访问那它们的返回值是什么呢？

```javascript
const message = 'Hello World';

// ...
message.toLowerCase();
// > hello world
message();
// > TypeError: message is not a function
```

如上面的代码，在我们调用之前，在某个地方，有人定义了 message 是一个字符串"Hello World"，那么，当我们调用 message.toLowerCase()时无疑可以获得这个字符串的小写，但下面的直接将这个字符串作为一个方法来调用就明显出错了。

我们再来看一个例子：

```javascript
function fn(x) {
  return x.flip();
}
```

比如上面定义的这个函数，我们现在知道这个函数正确执行是有条件的，它必须能接受到一个参数，而且这个参数必须包含一个名为 flip 方法的属性，否则就会报错：

```javascript
fn();
// TypeError: Cannot read properties of undefined (reading 'flip')
```

很明显，我们在运行这些代码之前，不能确定这些调用究竟是返回一个正确的值还是导致程序崩溃，怎么解决呢？TypeScript 就是这样一个工具，它提供了一个静态类型检查系统。

### 静态类型检查

### 非异常故障
