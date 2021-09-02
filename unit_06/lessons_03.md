> Marion 的 react 实战课程 > 第六部分 > promise 与 async/await

## promises

> 我们都知道, JavaScript 是一种异步编程语言, 在实际业务使用中, 对于一些不习惯使用回调函数来处理事件或数据的程序员来说, 回调地狱是一件很恐怖的事情。而 Promise 正是用于解除 JavaScript 回调地狱这种情况发生而新增的特性。从语法上说，Promise 是一个构造函数，我们在传入依赖的参数后，通过对它的实例对象的 then 方法和 catch 方法的监听而获取异步操作的消息。

- 单个的 promise

```javascript
// promise 意思是承诺, 表示以后会去完成某件事情
// promise方法必须使用new关键字和它的构造函数Promise方法来创建
// 它的构造函数接受一个回调函数作为参数, 这个回调函数提供两个方法做为参数resolved(已定型), rejected(已失败)
const promise = new Promise((resolved, rejected) => {
  // promise方法有三个状态：pending, fulfilled, rejected
  // 从新建起就是pending状态, 然后通过异步操作去改变它内部的状态, 而它内部的状态一旦被改变就无法再改变了, 这种情况被称之为resolved(已定型)
  if (success) {
    resolved(value); // fulfilled
  } else {
    rejected(error); // rejected
  }
});
// promise方法一旦新建就立即执行且无法取消, 如果不设置回调函数Promise内部抛出的错误,不会反应到外部。
```

- 多个 promise

```javascript
let p1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("第一个请求成功");
  }, 2000);
});

let p2 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("第二个请求成功");
  });
});

let p3 = new Promise((resolve, reject) => {
  setTimeout(() => {
    reject("第三个请求失败");
  }, 5000);
});
// all 接受一个promise数组, 当所有promise返回后它才返回
Promise.all([p1, p2])
  .then((result) => {
    console.log(result);
  })
  .catch((error) => {
    console.log(error);
  });

Promise.all([p1, p3, p2])
  .then((result) => {
    console.log(result);
  })
  .catch((error) => {
    console.log(error);
  });
```

- race

```javascript
let p1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("success");
  }, 1000);
});

let p2 = new Promise((resolve, reject) => {
  setTimeout(() => {
    reject("failed");
  }, 500);
});

// race接受一个promise数组, 这些数组哪个执行完毕就返回哪个结果, 后续完成的就直接抛弃了
Promise.race([p1, p2])
  .then((result) => {
    console.log(result);
  })
  .catch((error) => {
    console.log(error);
  });
```

- then

```javascript
const p = new Promise(function (resolve, reject) {
  resolve(1);
})
  .then(function (value) {
    // 第一个then // 1
    console.log(value);
    return value * 2;
  })
  .then(function (value) {
    // 第二个then // 2
    console.log(value);
  })
  .then(function (value) {
    // 第三个then // undefined
    console.log(value);
    return Promise.resolve("resolve");
  })
  .then(function (value) {
    // 第四个then // resolve
    console.log(value);
    return Promise.reject("reject");
  })
  .then(
    function (value) {
      // 第五个then //reject:reject
      console.log("resolve:" + value);
    },
    function (err) {
      console.log("reject:" + err);
    }
  );
```

#### Promise 小结

> 对象的状态不受外界影响。Promise 对象代表一个异步操作，有三种状态：  
> pending（进行中)  
> fulfilled（已成功）  
> rejected（已失败）  
> 只有异步操作的结果，可以决定当前是哪一种状态，任何其他操作都无法改变这个状态。这也是 Promise 这个名字的由来，它的英语意思就是“承诺”，表示其他手段无法改变。  
> 一旦状态改变，就不会再变，任何时候都可以得到这个结果。  
> Promise 对象的状态改变，只有两种可能：从 pending 变为 fulfilled 和从 pending 变为 rejected。只要这两种情况发生，状态就凝固了，不会再变了，会一直保持这个结果，这时就称为 resolved（已定型）。  
> 如果改变已经发生了，你再对 Promise 对象添加回调函数，也会立即得到这个结果。这与事件（Event）完全不同，事件的特点是，如果你错过了它，再去监听，是得不到结果的。

## genertor（稍作了解，为以后学习 redux-saga 做准备）

> 虽然它的写法是在 function 前加了一个\*号，但它其实不是一个方法，它是一种数据类型。在 paython 中，它被称之为列表生成器。它主要的功能是用于生成一个未知长度的列表。genertor 很简单，但如果你不能理解它就会觉得很难，它其实就是一个可以多次返回的函数。如下所示：

我们先拿一个普通函数举个例子：

```javascript
function foo(x) {
  return x + x;
}
var r = foo(1);
```

如果在执行过程中，没有遇到 return，就返回一个 undefined 给调用者 r，如果有 return 则将 return 返回的内容给调用者 r，同时结束整个方法。

而 genertor 在函数中添加了一个新的返回命令（关键字）yield，它的功能是在每一次调用时都能返回一个值给调用者，直到遇见 return 或整个方法执行完毕。

```javascript
function* foo(x) {
  yield x + 1;
  yield x + 2;
  yield x + 3;
  return x + 4;
}
var r = foo(1); // 此时函数并没有执行，返回的只是一个指向其内部状态的指针对象，我们必须通过next方法来使指针移向下一个状态
r.next(); // {value: 2, done: false}
r.next(); // {value: 3, done: false}
r.next(); // {value: 4, done: false}
r.next(); // {value: 5, done: true}
```

是不是感觉这就像是一个个的闭包？只不过闭包是每次返回一个新的函数，而 genertor 每次返回的是一个对象，对象里有我们计算的值和当前的 genertor 的状态。

比如，我们需要实现一个斐波那契数列的函数，可以这样写：

```javascript
function fib(max) {
  let a = 0;
  let b = 1;
  let arr = [a, b];
  while (arr.length < max) {
    [a, b] = [b, a + b];
    arr.push(b);
  }
  return arr;
}
fib(5);
fib(10);
```

上面的函数因为函数方法只能返回一个值，所以我们最终获得的是一个数组，假如需要取出某一个阶段的值，只能使用遍历。而 generator 的特性则决定了它在程序中返回指定内容，我们可以获取指定的数据：

```javascript
function* fib(max) {
  let a = 0;
  let b = 1;
  let l = 0;
  while (l < max) {
    yield a;
    [a, b] = [b, a + b];
    n++;
  }
  return;
}
fib(5);
```

#### async/await

> async 和 swait, 作为 Genertor 函数的语法糖, 就是为了让我们更加方便地使用同步任务。Genertor 将异步的流程标记得非常简捷，可是在实际使用过程中却非常地不方便, 为了更进一步地解决异步操作带来的问题，所以在 ES7 版本里又推出了 async 与 await 这一对组合

```javascript
function getRandom() {
  return new Promise((resolve, reject) => {
    let sino = parseInt(Math.random() * 6 + 1);
    setTimeout(() => {
      resolve(sino);
    }, 1000);
  });
}
async function test() {
  let n = await getRandom();
  console.log(n);
}
test();
```

上面的函数中使用了 async 方法 test，在方法中定义了一个变量 n，而这个变量使用了 await 关键字，所以程序执行到这里的时候除非 getRandom 执行完毕，resolve 方法被调用，否则就会在这里一直等待。

```javascript
function getRandom(estimate) {
  return new Promise((resolve, reject) => {
    let sino = parseInt(Math.random() * 6 + 1);
    setTimeout(() => {
      if ((sino > 3 && estimate) || (sino <= 3 && !estimate)) {
        resolve(sino);
      } else {
        reject(sino);
      }
    }, 1000);
  });
}
async function test(estimate) {
  try {
    let n = await getRandom(estimate);
    console.log("估算正确" + n);
  } catch (error) {
    console.log("估算错误" + error);
  }
}
// 猜个大小
test();
```

#### async/await 小结

> async 函数本身返回一个 promise 对象，可以使用 then 方法添加回调函数。函数中的代码在执行过程中，如果遇到 await 关键字就会暂停，等待 await 关键字后的方法执行完成后再继续执行。

async 与 generator 的区别：

> 内置执行器。Generator 函数的执行必须依靠执行器，而 Aysnc 函数自带执行器，调用方式跟普通函数的调用一样

> 更好的语义。async 和 await 相较于 \* 和 yield 更加语义化

> 更广的适用性。yield 命令后面只能是 Thunk 函数或 Promise 对象，async 函数的 await 后面可以是 Promise 也可以是原始类型的值

> 返回值是 Promise。async 函数返回的是 Promise 对象，比 Generator 函数返回的 Iterator 对象方便，可以直接使用 then() 方法进行调用
