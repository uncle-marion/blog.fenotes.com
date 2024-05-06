> 平安蜀黍的前端教程 > 第一单元 开发环境与工具封装 > 代码规范

## 为什么要推行代码规范

在大力地提倡前端工程化的今天，在多人共同开发一个项目甚至是一个模块的现在，个性化的代码已经成为严重影响团队开发的问题了；比如语义化这块，有使用各种单字母作为变量或方法的名字，或使用拼音作为变量的方法或名字；导致我们在维护时不只要在各种逻辑之间跳来跳去，同时还要想办法去理解这些变量名所代表的意义，这无疑会给我们后续的项目维护造成极大的阻碍。

## 基本的规范

为了让大家养成一个良好的代码习惯，我将之前在瑞幸定制的一套规范拿出来给大家分享一下，这套规范主要参考了国外大厂[Airbnb(爱彼迎)](https://github.com/airbnb/javascript)的规范，目前国内各一线大厂的代码规范甚至包括 react 的默认 ESLint 规则都是参考这套规范，然后在这套基础上逐渐完善和调整出来的。我这边参考了原文中的部分和瑞幸特有的一些规则，同时去除了一些感觉不是很重要的规则(不会影响代码提交)，期望大家能在从今往后的开发工作中养成一个良好的代码习惯。

### 一、命名规则

- 无论何时, 不要使用单字母来声明变量或函数, 它们的命名应当有一定的描述性
- 使用驼峰式来命名对象、函数和实例, 使用帕斯卡式命名（大驼峰）构造函数或类
- 不要再使用"\_"开头来定义私有属性, 因为这种约束没有意义, 另外, 也是因为在最新的 ECMA 中已经定义了私有属性修饰符：#

```javascript
// #代表的是私有属性, 目前在chrome 浏览器中已经实现
class User {
  // 声明私有属性
  #name;
  #id;
  constructor(name, id = 123) {
    this.#name = name;
    this.#id = id;
  }
  getUserId(name, id) {
    // 内部可以打印
    console.log(this.#id, this.#name);
    return [this.#id === id, this.#name === name];
  }
}
const tom = new User('tom');
console.log(tom.getUserId('tom', 123));
console.log(tom.#name, tom.#id);
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
// bad
export default class CheckBox {
  // ...
}
// ...
import CheckBox from './checkBox';

// good
export default class CheckBox {
  // ...
}
// ...
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

### 二、变量定义

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

### 三、字符串的使用

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

### 四、数组方法

- 使用数组字面量来创建数组
- 如果要给数组增加新的元素, 使用 push
- 如果要复制数组, 使用拓展运算符“...”

### 五、对象方法

- 使用对象字面量来创建对象

```javascript
// {}是javascript对象字面量创建的形式, 其本质和new Object()并无区别, 默认都是继承了
// Object对象上的prototype, 那么为什么一定要用字面量来创建对象呢？因为{}是字面量, 可
// 以立即求值, 而new Object()本质上是方法（只不过这个方法是内置的）调用, 既然是方法调
// 用, 就涉及到在proto链中遍历该方法, 当找到该方法后, 又会生产方法调用必须的堆栈信息,
// 方法调用结束后, 还要释放该堆栈，一番折腾下来，它的资源占用要远远大于字面量声明
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

##### 注： Javascript 关键字与保留字

abstract,arguments,boolean,break,byte;
case,catch,char,class*,const;
continue,debugger,default,delete,do;
double,else,enum*,eval,export*;
extends*,false,final,finally,float;
for,function,goto,if,implements;
import*,in,instanceof,int,interface;
let,long,native,new,null;
package,private,protected,public,return;
short,static,super*,switch,synchronized;
this,throw,throws,transient,true;
try,typeof,var,void,volatile;
while,with,yield;

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

### 六、函数的使用

- 如非必要, 请使用函数声明来声明函数

```javascript
// 因为函数本身是可命名的, 所以他们在调用栈中更容易被识别。此外,
// 函数声明会把整个函数提升（hoisted）, 而函数表达式只会把函数的
// 引用变量名提升。这条规则使得箭头函数可以取代函数表达式
// bad
const foo = function () {};

// good
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

### 七、善用解构

- 无论是什么环境, 当你想要获取一个对象内的属性时, 请一定要使用解构, 因为解构可以减少临时引用属性

```javascript
// 代码冗余, 关键是会导致在栈中生成两个临时引用属性
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
// 直接在参数中解构，完全没有了临时引用属性
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

差不多就这些吧，还有的内容我们可以通过配置.prettierrc.json 在代码保存时自动处理。同时，我们也可以关注下 ESLint()

---

### 课后作业

- 为什么要推行代码规范？代码规范化有什么好处？
- 列举你之前公司里用到的代码规范，不少于 5 个
- 什么是变量提升？什么是函数声明提升？
- const 与 let 和 var 具体的区别是什么？
- 什么是暂时性死区？怎样解决？
- 什么是对象字面量？什么是数组字面量？使用它们有什么好处？
