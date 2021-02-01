> 企业项目实战 > 第一部分 > ES6 代码规范与基础回顾

# 必须养成的 coding 习惯

https://blog.csdn.net/marion_lau/article/details/111935038

## 为什么要定义代码规范？

一般来说在开发中每个人的代码习惯都不太一样, 这样就会导致代码风格不一致。而当前在一些小型甚至中小型创业型团队中, 完全没有代码规范, 以致于维护和修改 bug 的时候看别人的代码成为一种很难受的事情...
这种情况尤其在前端开发中尤为明显。因为关于前端的开发规范到现在为止也没有行业权威标准, 基本上各大公司都有一套属于自己的标准, 而中小型公司则都是在开发中通过 **eslint** 进行约束。 但 eslint 终究无法规范一些方法与命名, 它只能简单地规范一些空格、换行或结束符号等，我们完全可以使用 **prettierrc.json** 来解决，但是各种命名规则与方法调用只能靠人力来检查。为了帮大家确认一套适应性较强的规范, 我在最近参考了一些大厂的规范, 经过比较, 发现 **Airbnb** 的标准貌似颇受推崇, 目前国内其它公司的标准基本都是参考这套标准整理而成。今天给大家稍微整理下, 期望大家在以后的开发工作中形成一个良好的代码习惯。

### 命名规则

- 无论何时, 不要使用单字母来声明变量或函数, 它们的命名应当有一定的描述性
- 使用驼峰式来命名对象、函数和实例, 使用帕斯卡式命名构造函数或类
- 不要再使用"\_"开头来定义私有属性, 因为这种约束没有意义, 另外, 也是因为在最新的 ECMA 中已经定义了私有属性修饰符：#

```javascript
// #代表的是私有属性, 目前在chrome 浏览器中已经实现
class User {
  // 声明私有属性并赋值
  #id = 'xyz';
  constructor(name) {
    this.name = name;
  }
  getUserId() {
    // 内部可以打印
    console.log(this.#id);
    return this.#id;
  }
}
const tom = new User('tom');
// 外部不行的
console.log(tom.getUserId());
```

- 如果在你的函数或回调中找不到 this 了, 不要使用 self/that 来保存 this, 而是使用箭头函数

```javascript
// bad
function foo() {
  const that = this;
  return function () {
    console.log(that);
  };
}

// good
function foo() {
  return () => {
    console.log(this);
  };
}
```

- 如果你的文件只导出一个类, 那么你的文件名应该与你的类名完全一致, 而在引用时也应该完全一致

```javascript
class CheckBox {
  // ...
}
export default CheckBox;
import CheckBox from './CheckBox';
```

- 总是使用模组 (import/export) 而不是其他非标准模块系统。如果你的环境不支持那就想办法让它支持
- 不要使用通配符"\*"来导出模块,

```javascript
// bad
const AirbnbStyleGuide = require('./AirbnbStyleGuide');
module.exports = AirbnbStyleGuide.es6;

// bad
import * as AirbnbStyleGuide from './AirbnbStyleGuide';

// ok
import AirbnbStyleGuide from './AirbnbStyleGuide';
export default AirbnbStyleGuide.es6;

// best
import { es6 } from './AirbnbStyleGuide';
export default es6;
```

### 变量定义

- 使用 Const 来定义常量, 使用 let 来定义变量, 如果不是必要, 请忽略还有 var 这个关键字
- 不要使用","来一次性定义大量的变量, 一是不方便阅读, 二是不方便修改
- 如果需要在程序最上方定义大量的变量时, 请给你的变量和常量分组

```javascript
// 什么是常量？可以理解为"不变化的量"大致的意思就是, 在你的程序运行时不会去改变它的值
const goSportsTeam = true;
const items = getItems();

// 什么是变量？
let dragonball;
let i;
let length;
```

- 请在需要的时候才声明你的变量而不是在每个函数的头部声明, 因为我们现在使用的只有 const 和 let, 它们不存在变量提升的问题了

```javascript
// 你声明了它, 可是你不一定会用到它
function(hasName) {
  const name = getName();

  if (!hasName) {
    return false;
  }

  this.setFirstName(name);

  return true;
}

// good
function(hasName) {
  if (!hasName) {
    return false;
  }

  const name = getName();
  this.setFirstName(name);

  return true;
}
```

### 字符串

- 在所有的 js 文件中, 只使用\'作为字符串的包围符号, \"仅用于 html 声明 attr 属性

```javascript
// 虽然这样也可以, 但我们在需要对一些包含\"的字符串做操作时, 转义符号可能会造成一些迷惑
// 关键是, 全世界都认为使用单引号比双引号好
const name = 'Capt. Janeway';

// good
const name = 'Capt. Janeway';
```

- 当我们需要拼接字符串与变量时, 请使用字符串模板

```javascript
// 字符串是不可变对象, 当用操作符+连接字符串的时候, 每执行一次+都会申请一块新的内存,
// 然后复制上一个+操作的结果和本次操作的右操作符到这块内存空间, 因此用+连接字符串的
// 时候会涉及好几次内存申请和复制
function sayHi(name) {
  return 'How are you, ' + name + '?';
}

// join在连接字符串的时候, 会先计算需要多大的内存存放结果, 然后一次性申请所需内存并
// 将字符串复制过去, 这是为什么join的性能优于+的原因, 但现在我们有了字符串模板, 比
// 起join的性能更好
function sayHi(name) {
  return ['How are you, ', name, '?'].join();
}

// good
function sayHi(name) {
  return `How are you, ${name}?`;
}
```

### 数组

- 使用数组字面量来创建数组
- 如果要给数组增加新的元素, 使用 push
- 如果要复制数组, 使用拓展运算符“...”

### 对象

- 使用对象字面量来创建对象

```javascript
// {}是javascript对象字面量创建的形式, 其本质和new Object()并无区别, 默认都是继承了
// Object对象上的prototype, 那么为什么一定要用字面量来创建对象呢？因为{}是字面量, 可
// 以立即求值, 而new Object()本质上是方法（只不过这个方法是内置的）调用, 既然是方法调
// 用, 就涉及到在proto链中遍历该方法, 当找到该方法后, 又会生产方法调用必须的堆栈信息,
// 方法调用结束后, 还要释放该堆栈
const item = {};
```

- 无论何时, 不要使用 js 保留字作为 key 的名字, 如果必须要用, 可以使用同义词替换；

```javascript
// class是js的保留字, 这样使用在有些浏览器中可能无法取出class对应的属性
const superman = {
  class: 'alien',
  print() {
    console.log(this.class);
  },
};

// good
const superman = {
  type: 'alien',
  print() {
    console.log(this.class);
  },
};
```

- 正常情况下, 在同一个位置声明你所有的属性, 哪怕是动态的属性名称

```javascript
function createKey(k) {
  return `keyNamed${k.slice(0, 1).toUpperCase() + k.slice(1)}`;
}

// 在外部声明, 一眼看上去与上面的对象声明没有任何关系
const obj = {
  id: 5,
  name: 'San Francisco',
};
obj[createKey('enabled')] = true;

// good
const obj = {
  id: 5,
  name: 'San Francisco',
  [createKey('enabled')]: true,
};
```

- 对象中如果有方法, 要使用简写

```javascript
// bad
const atom = {
  value: 1,
  addValue: function (value) {
    return atom.value + value;
  },
};

// good
const atom = {
  value: 1,
  addValue(value) {
    return atom.value + value;
  },
};
```

- 声明对象属性时, 如果有外部已赋值的属性时, 请使用简写, 并为其分组

```javascript
const anakinSkywalker = "Anakin Skywalker";
function lukeSkywalker() {
  console.log(this);
};
// 不好的例子, 明显的代码冗余了
const obj = {
  episodeOne: 1,
  twoJedisWalkIntoACantina: 2,
  lukeSkywalker = lukeSkywalker,
  episodeThree: 3,
  mayTheFourth: 4,
  anakinSkywalker = anakinSkywalker,
};

// 好的例子, 但没有分组, 我们不能一眼看出来哪些属性是简写
const obj = {
  episodeOne: 1,
  twoJedisWalkIntoACantina: 2,
  lukeSkywalker,
  episodeThree: 3,
  mayTheFourth: 4,
  anakinSkywalker,
};

// 最好的写法, 属性名简写, 同时还对简写属性进行了分组, 可以很清晰地看出来哪些属性是简写的
const obj = {
  lukeSkywalker,
  anakinSkywalker,
  episodeOne: 1,
  twoJedisWalkIntoACantina: 2,
  episodeThree: 3,
  mayTheFourth: 4,
};
```

### 函数

- 如非必要, 请使用函数声明来声明函数

```javascript
// 因为函数声明是可命名的, 所以他们在调用栈中更容易被识别。此外,
// 函数声明会把整个函数提升（hoisted）, 而函数表达式只会把函数的
// 引用变量名提升。这条规则使得箭头函数可以取代函数表达式
function foo() {}
```

- 如果需要判断参数是否存在, 要给它加一个默认值而不是尝试去改变它

```javascript
function handleThings(opts) {
  // 很糟糕: 如果参数 opts 是 false 的话, 它就会被设定为一个对象。
  opts = opts || {};
  // ...
}

// good
function handleThings(opts = {}) {
  // ...
}
```

- 当你必须使用函数表达式（或传递一个匿名函数）时, 请使用箭头函数
- 如果一个函数只有一行且只有一个参数, 可以把所有的括号抛掉

```javascript
// 相对于普通函数表达式来说, 箭头函数创造了一个新的 this 执行环境,
// 通常情况下都能满足你的需求, 而且这样的写法更为简洁。
[1, 2, 3].map(x => {
  return x * x;
});
[1, 2, 3].map(x => x * x);
```

### 解构

- 无论是什么环境, 当你想要获取一个对象内的属性时, 请一定要使用解构, 因为解构可以减少临时引用属性

```javascript
// 代码冗余, 关键是临时引用
function getFullName(user) {
  const firstName = user.firstName;
  const lastName = user.lastName;

  return `${firstName} ${lastName}`;
}

// good
function getFullName(obj) {
  const { firstName, lastName } = obj;
  return `${firstName} ${lastName}`;
}

// best
function getFullName({ firstName, lastName }) {
  return `${firstName} ${lastName}`;
}
```

- 数组也可以使用解构

```javascript
const arr = [1, 2, 3, 4];

// bad
const first = arr[0];
const second = arr[1];

// good
const [first, second] = arr;
```

- 需要回传多个值时, 请使用对象而不是数组, 因为数组可能会被改变排序

```javascript
// bad
function processInput(input) {
  // then a miracle occurs
  return [left, right, top, bottom];
}

// 调用时需要考虑回调数据的顺序。
const [left, __, top] = processInput(input);

// good
function processInput(input) {
  // then a miracle occurs
  return { left, right, top, bottom };
}

// 调用时只选择需要的数据
const { left, right } = processInput(input);
```
