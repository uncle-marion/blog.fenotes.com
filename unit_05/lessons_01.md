> 企业项目实战 > React 函数式编程 > 什么是函数式编程

## 什么是函数式编程？

很多人都以为所谓的函数式编程就是我们平时写的那些 function。但需要注意的是，这个所谓的函数式编程与我们理解的代码中的函数是不一样的，函数式编程指的一种编程范式，一种被称之为声明式的编程范式，函数式编程在有的语言中也被称之为功能编程。什么是范式呢？范式可以理解为一个例子或者一个模板甚至你可以理解为一个套路它并不是很高大上的东西。我们平时接触的一般都是命令式(imperative)编程（面向过程，面向对象都是）：

- 面向过程，就是我们平常用的最多的声明变量、输出、计算这些，统统都是所谓的面向过程的范式：

```javascript
const greeting = 'hello';
console.log(greeting + ', ' + 'world');
```

- 面向对象，将我们需要处理的多个对象抽象成一个类，然后在类中定义各种方法，再将其实例化成一个新的对象来继承类中的属性和方法，最后调用：

```javascript
// 定义了一个类
const Program = function () {
  this.greeting = args => console.log('hello' + ', ' + args);
};
// 用上面定义的类实例化了一个对象
const program = new Program();
// 调用这个对象里的方法
program.greeting('world');
```

- 面向函数，我们不关心需要处理的对象

```javascript
const program = greeting => name => log => log([greeting, name].join(', '));
// 没有定义变量，没有指令，就是一级级地把参数传入进去
program('hello')('world')(console.log);
```

- 函数式编程是一种声明式(declarative)编程范式，它不同于命令式编程，在函数式编程中没有 ifelse 或变量的概念，在函数式编程中，所有的变量只能被赋值一次，函数式编程没有循环这个概念它们只有递归，函数的运行只依靠参数。

```javascript
// 命令式编程范式
const doubleMap = nums => {
  const doubled = [];
  for (let i = 0, l = nums.length; i < l; i++) {
    doubled.push(nums[i] * 2);
  }
  return doubled;
};
// 声明式编程范式
const doubleMap = nums => nums.map(n => n * 2);

// 命令式编程
let a = 1;
let b = 2;
a +
  b(
    // 声明式编程
    (a, b) => a + b
  )(1, 2);

// 命令式编程
let sum = 0;
for (let i = 0; i < 100; i++) {
  sum += i;
}
// 声明式编程
const f = n => (n < 0 ? 0 : n + f(n - 1));
f(100);
```

### 函数式编程的优点

首先，我们需要确认的一件事情，我们是初中级前端，在未来我们可能接触到的大多是业务场景，所以，函数式编程的一些优点对于我们近期的工作可能体现不出太多的优势，但在我们的 level 上升到一定层次以后，当我们需要做一些框架或中间层时，函数式编程就比较有优势了。

组合性(composibility)： 函数式编程提倡的是一个函数只有一个功能，多个函数组合起来就有很强大的功能；
数据不可变(immutability)：函数式编程提倡数据不能改变，这个是目前来说最有用的一点，很多时候我们写的程序经常会出现各种问题，查到最后就发现原来是某个一位置有某个方法把我们的初始数据给改变了。函数式编程中数据都是不可变的，所以整个操作历史都是有迹可寻的；
纯函数(pure function)：函数的输出由输入的参数决定，这样程序的结果本身是可预期的，比较容易单元测试，也能避免一些 BUG。

### 怎样学习函数式编程

javascript 本身是可以进行纯粹的函数式编程的，但是因为我们的很多场景决定了，我们在大多数的时候不能使用函数式编程。最关键的是，作为一个写了十几年代码的老码农，说实话，函数式编程有很多内容并不是那么易读。但话又说回来，吸收一些函数式编程思想是好的，这可以让我们有更多的解决问题的思路，同时让我们的代码更容易被理解。要学习函数式编程，我们需要知道一些基础概念如下：

#### 纯函数

它**接受一个参数，返回一个值， 在这个过程中它不会引用外部状态或改变外部状态或改变传入的参数，如果传入的参数不变，则它返回的值也不变**，这一段我们在上个月学习纯函数的时候已经描述过了。纯函数是透明的，只要是相同的输入返回的值也是相同的，这种性质被称之为**引用透明性**。纯函数的输出**只依赖于输入的参数**。因为这种特性，我们给它总结了两个优点：

- 并发代码：因为它不改变外部状态也不会被外部状态影响，所以我们可以多线程运行这种代码，不用担心它会因为外部环境的变化而返回不同的结果
- 可缓存：纯函数总是为给定输入返回相同的输出，那么我们就可以缓存这个函数将它当成参数传给另一个函数

#### 内部函数

这个很好理解，字面意思就是被放在一个函数中的函数

```javascript
function outerFunc() {
  // 它就是一个内部函数
  // 内部函数有3个可访问的作用域
  // 全局的
  // 它自身的
  // 它外部函数的
  function innerFunc() {}
}
```

#### 闭包

对于有一点点面试经验的前端来说，这个问题已经烂大街了，因为所有的面试官都会问到这个问题，但你确认你理解了闭包的意义了吗？
表面上，我们理解的闭包就是从一个函数中返回的一个它的内部函数。这没有错，但闭包最强大的地方在于我们在上面列出的第三个作用域，它会记住它外部函数中的变量和属性，也就是我们常说的上下文：

```javascript
function fn(args) {
  const param = 'abc';
  return () => {
    console.log(args, param);
  };
}
// fn函数被调用时，返回它内部的一个匿名函数，当这个匿名函数被返回时，js执行引擎会将它的上下文也就是fn函数中的内部属性和变量保存起来，等待被调用
const fn1 = fn('xyz');
fn1();
```

闭包是函数式编程的基础，函数式编程中有大部分内容都是在制作一个又一个的闭包来缓存一些数据或方法

#### 高阶函数

我们知道，JavaScript 中函数也是一种数据类型，它可以赋值给一个变量，也可以被当成一个参数传递给另一个函数，还可以被其它函数返回；所以，它被称之为“一等公民”。而对于可以接受一个函数做为参数的函数，我们将它称之为高阶函数（英文名：Higher-order function，简写成 HOC）：

```javascript
// add就是一个高阶函数，它接受了Math.abs做为参数
function add(x, y, func) {
  return func(x) + func(y);
}
add(-5, 6, Math.abs);
```

我们之前学 ES 基础的时候也学过很多高阶函数的用法，比如： map、reduce、filter、reject 等等，它们都接受一个回调函数做为参数。

```javascript
// 简单的map
function mapCallback(value, index, array) {
  console.log('mapCallback方法的参数', value, index, array);
  return value * value;
}
// 调用map函数
const newArr = [1, 2, 3].map(mapCallback);

// 简单的filter
function filterCallback(value, index) {
  console.log('filterCallback方法的参数：', value, index);
  return value > 2;
}
// 调用filter函数
const newArr = [1, 2, 3].filter(filterCallback); // [3]
```

#### 抽象

抽象是一个概念，我们在学习面向对象编程时就已经接触过抽象这个概念了：抽象的意义是从一些具有共同性的对象或方法中抽取出共同的、本质性的特征，而将个别的非本质性的属性舍弃的一个过程。

```javascript
const arr = [1, 2, 3];
for (let i = 0, l = arr.length; i < l; i++) {
  console.log(arr[i]);
}
// 比如我们来实现一个forEach方法
function forEach(array, func) {
  for (let i = 0, l = array.length; i < l; i++) {
    func(array[i]);
  }
}
forEach([1, 2, 3], item => {
  // 我们将item作为参数从forEach函数传递到当前函数
  console.log(item);
});
```

#### 函数柯里化

理解完了纯函数与闭包概念以后，我们要来学习一个新的知识：柯里化，这是一种把多元函数转换成一系列一元函数并进行调用的过程描述；柯里化函数的意义在于我们把函数与传递给这个函数的参数相结合然后产生出一个新的函数：

```javascript
// 普通函数
function add(x, y) {
  return x + y;
}
add(1, 2); // 3
// 柯里化函数
function curryAdd(x) {
  return function (y) {
    return x + y;
  };
}
curryAdd(1)(2); // 3
```

从上面的代码中可以看到，我们把一个原本接受两个参数的函数 add 转变成了两个接受一个参数的函数 curryAdd 和它的返回函数，这个过程就是柯里化的过程，这个函数也被称之为柯里化函数。

那么，这样做有什么好处呢？或者说，我们为什么要这样做呢？所谓柯里化不就是返回了一个闭包函数吗？柯里化，是函数式编程的一个极其重要的概念，它既能减少代码冗余，也能增加代码的可读性。最关键的是，它可以提升我们的逼格。

假如我们有这样一个函数

```javascript
function add(x, y, z) {
  return x + y + z;
}
add(1, 2, 3);
```

从代码中可以看出来，add 是一个累加函数，它接受 3 个参数然后输出累加的结果。但假如有这样的一个需求，我们已知它的前两个参数是固定不变的，而第三个参数是每次调用时会改变的，那么，我们是不是可以在函数内把前两个参数相加的过程缓存起来？因为参数始终都是相同的，没必要每次调用都做计算：

```javascript
function add(x, y) {
  const a = x + y;
  return function (z) {
    return a + z;
  };
}
// 直接调用
add(1, 2)(3);
add(1, 2)(5);
// 缓存结果后调用
const sum = add(1, 2);
sum(10);
```

#### 递归

递归在函数式编程中是一个很有用的方法，比如我们进行一个倒数的方法

```javascript
// 简单的递归调用
function countDownFrom(num) {
  console.log(num);
  if (num === 1) return;
  countDownFrom(num - 1);
}
countDownFrom(10);
```

- 使用递归处理一些从后端拿到的关系数据

```javascript
const categories = [
  { id: 'animals', parent: null },
  { id: 'mammals', parent: 'animals' },
  { id: 'cats', parent: 'mammals' },
  { id: 'dogs', parent: 'mammals' },
  { id: 'chihuahua', parent: 'dogs' },
  { id: 'labrador', parent: 'dogs' },
  { id: 'persian', parent: 'cats' },
  { id: 'siamese', parent: 'cats' },
];
```

如上，我们可能从接口获取到这样一段数据，需要将其处理为下面这种对象方式

```javascript
{
  animals: {
    mammals: {
      dogs: {
        chihuahua: {},
        labradow: {}
      }
      cats: {
        persian: {},
        siamese: {}
      }
    }
  }
}
```

方法的实现

```javascript
function makeTree(list) {
  const obj = {};
  list
    // 使用filter筛选出对应的元素
    .filter(item => item.parent === parent)
    // 把每一个元素的ID当成key赋给obj
    .forEach(item => (obj[item.id] = makeTree(list, item.id)));
  return obj;
}
console.log(JSON.stringify(makeTree(categories, null), null, 2));
```

#### promise

上面有说过，函数式编程的最重要一点就是让函数的可复用、可组合性提高（比如，为了实现链式调用，函数的返回值应该是一个可操作对象），但我们应该会发现，在编写程序的很多时候我们不得不使用回调函数，而回调函数本身决定了它是一个异步函数，它无法被操作。而 promise 就是这样一个用于解决这个问题的方法，比如我们在早先没有 promise 时需要 load 一些图片：

```javascript
// 早先的图片加载程序
function loadImageCallback(url, callback) {
  let image = new Image();
  // 必须预留出一个用于返回失败信息的参数位置
  image.onload = () => callback(null, image);
  image.onerror = () => callback('image load fail at ' + url);
  image.src = url;
}
// 渲染方法
function showImg(src) {
  let imgEl = document.createElement('img');
  imgEl.src = src;
  document.body.appendChild(imgEl);
}
// 业务处理（我们需要按顺序显示图片）
loadImageCallback('img1src', (err, img1) => {
  if (err) throw err;
  addImg(img1.src);
  loadImageCallback('img2src', (err, img2) => {
    if (err) throw err;
    addImg(img2.src);
    loadImageCallback('img3src', (err, img3) => {
      if (err) throw err;
      addImg(img3.src);
    });
  });
});
```

上面的代码是不是感觉很乱很麻烦？

```javascript
// promise的图片加载程序
function loadImagePromise() {
  return new Promise((res, rej) => {
    let image = new Image();
    image.onload = () => res(image);
    image.onerror = () => rej('image load fail at ' + url);
    image.src = url;
  });
}
// 渲染方法
function showImg(src) {
  let imgEl = document.createElement('img');
  imgEl.src = src;
  document.body.appendChild(imgEl);
}
// 通过promise来组合使用
Promise.all([
  loadImageCallback('img1src'),
  loadImageCallback('img2src'),
  loadImageCallback('img3src'),
])
  .then(images => {
    images.forEach(img => addImg(img.src));
  })
  .catch(err => console.log(err));
```

#### stream

stream，这是一种很早很早的技术了，我最早接触 stream 应该是在 13 年，那时候好像还没有 react、vue 这些框架，当时还在用着 jQuery，当时是为了更好的打包项目(代码合并、压缩加密等等)，学习了一些 requireJS 的使用方式，然后在学习的过程中接触了 stream，因为需要使用 stream 来对文件做一些操作。闲话少述，我们先来看看 stream 究竟是什么

```javascript
const stupidNumberStream = {
  each: callback => {
    setTimeout(() => callback(1), 1000);
    setTimeout(() => callback(2), 2000);
    setTimeout(() => callback(3), 3000);
  },
};
createStupidNumberStream.each(console.log);
```

上面这段代码是我能想到的最简单的 stream 的 demo 了，大家可以看下代码逻辑，理解一下这里究竟做了些什么事情
