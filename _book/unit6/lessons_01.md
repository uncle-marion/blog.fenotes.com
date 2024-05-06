> Marion 的 react 实战课程 > 第六部分 > ES6 常用方法

#### 什么是 ES6

> ES6, 全称 ECMAScript 6.0, 是 JavaScript 的一个版本标准, 真正的 ES6 仅指 ECMAScript2015, 但实际上在目前的大多的网络文章中, ES6 泛指自 ECMA2015 到最新的 ECMAScript2020 中的所有新增标准及这些标准提供的一些新方法实现。

#### 为什么要使用 ES6

> ES5 已经不能满足目前前端越来越复杂、庞大的现状, 甚至我们可以说它已经过时了。而 ES6 是对 ES5 的增强和升级, 增加了很多新标准和支持新标准的方法。当前主流的浏览器都已经全面支持 ES6 且行业内大多数前端框架都已经全面使用 ES6 标准来实现。一些非传统前端产品如微信小程序、uni-app 等都是基于 ES6 的语法。我们学习使用 ES6 是因为 ES6 提供了更多更方便更实用且更有效率的方法, 避免了每个人因为自己的习惯去开发不同的工具包。

### ES6 的关键特性

#### const & let

- const 常量声明

> 用于定义常量, 什么时候声明常量？声明该变量所在的**作用域**内永远不会被重新赋值的变量, 必须使用 const 定义。

- let 变量声明

> 用于定义变量, 什么时候声明变量？声明该变量所在的**作用域**内有重新为变量赋值的可能, 可以使用 let 定义。

- 什么是变量提升

> JavaScript 代码的执行分为两个阶段：  
>  第一个阶段会将当前文件预读一遍, 同时在当前执行环境中注册所有的变量声明和函数声明, 可以理解为都解析了一遍。但要注意的是, 这里注册的仅仅只是声明, 赋值操作仍在原有的位置上;  
>  第二个阶段会从上到下依次执行代码, 如果是赋值就给变量赋值, 如果是方法就执行方法, 方法中遇到了变量就回去内存中查找, 如果变量已赋值, 则返回值, 如果未赋值则返回 undefined;  
>  注意：虽然 const 与 let 也会被预处理, 但没有变量提升, 在哪定义就在哪里使用;  
>  变量声明会被提升到其当前作用域的最上面而不是整个程序的最上面;  
>  变量提升的优先级：变量声明 > 参数赋值 > 函数声明。 理解起来就是，当变量声明、参数赋值与函数声明同在一个方法中存在时，函数声明会覆盖参数赋值和变量声明，参数赋值会覆盖变量声明。

```javascript
var a = 1;
function test() {
  console.log(a, 'a1');
  var a = 2;
  console.log(a, 'a2');
  function test1(a) {
    console.log(a, 'a3');
    var a = 3;
    a = 4;
    console.log(a, 'a4');
  }
  setTimeout(function () {
    console.log(a, 'a5');
    test1(a);
  }, 500);
  var a = 5;
  test1(a);
  setTimeout(
    function (a) {
      console.log(a, 'a6');
    },
    0,
    6
  );
  var a = 7;
}
test();
```

- 什么是暂时性死区

> 暂时性死区这个概念仅存在于 let 与 const 命令。ES6 明确规定, 如果在当前作用域中存在以 let 或 const 命令声明的变量, 那么, 在声明它之前, 这个变量都是不可用的。  
> 暂时性死区概念主要是为了解决变量提升问题, 防止在变量声明前就使用这个变量, 从而导致意外的行为与操作。

```javascript
a = 2;
console.log(a);
let a;
```

#### 模板字符串

> 为什么要使用模板字符串而不是使用“+”运算符来拼接字符串？字符串拼接是所有程序设计语言都需要的操作。当拼接结果较长时, 如何保证效率就成为一个很重要的问题。早些年的时候在阅读《javascript 高级程序设计》中, 有一段关于字符串特点的描述记得很深刻。原文应该是这样说的：ECMAScript 中的字符串是不可变的, 也就是说, 字符串一旦创建, 他们的值就不能改变。要改变某个变量的保存的的字符串, 首先要销毁原来的字符串, 然后再用另外一个包含新值的字符串填充该变量。

```javascript
let lang = 'java';
lang = lang + 'Script';
```

> 上面这段代码看起来很简单, 但实际上操作稍有些复杂, 解析器首先会创建一个新字符串, 然后在这个字符串中填充“Java”和“Script”, 然后销毁原来的字符串“Java”和“Script”, 因为这两个字符串已经没用了。  
> 所以, 在早期没有模板字符串以前, 我们进行一些较复杂字符串拼接都是使用的数组 push, 然后再使用 join 方法来进行拼接。这种方式的好处是因为数组本身是一个引用类型, 所有的成员都只占用其本身所占用的资源, 直到被 join 方法调用时, 才会一次展开后以指定的符号连接成一个新的字符串, 它们不存在多次建立和销毁这种情况。  
> 而模板字符串则是换了个方式, 它生成了一串完整的字符串, 在这个字符串中去查询所有以'${'开头, 以'}'结尾的代码片段, 匹配到后将内部的表达式进行运算取值后重新填充回原处。在字符串比较短时这种作法可能没有多大优势, 但在对长字符串做处理时就会大大优化处理速度与内存的占用率。

#### 对象和数组解构

参考代码规范的解构部分 ./lessons_01.md

#### 数组的遍历 for...of

在可以使用它来实现遍历的情况下, 我们建议不要使用 for 循环, 在小型的数据遍历场景中, 它的效率及资源占用相对于其它的遍历来说是最少的; 当然，对于超大型的遍历来说, 还是 for 循环比较好用。只是一般情况下，我们极少会接触到超大型的遍历，所以，为了保持代码的一致性，我们更希望使用 for...of。
**在已知数组长度的情况下, 不要使用 forEach, forEach 是用于处理未知长度的数组的, 它的效率及资源占用相对都是非常高的。**

#### ES6 的数组新增常用方法

1. map(callback) 映射数组:

> 通过遍历的方式, 将原数组中每一个元素通过传入的回调函数处理后返回的值创建并返回一个新数组, map 方法不会对空数组进行检测, map 方法不会改变原数组

> 使用场景： map 是我们最常用到的一个数组方法, 没有之一。无论是在页面中的列表渲染还是对数组中的元素做一些计算, 都要用到它;

```javascript
/**
 * mapCallback
 * map方法用于对每一个数组元素做处理的回调函数
 * @param {any} value 当前索引的元素
 * @param {number} index 当前索引
 * @param {Array} array 原数组
 * @return {any} 计算完成后的数组成员, 可以是任意内容
 * map方法不会对空数组进行检测, map方法不会改变原始数组
 **/
function mapCallback(value, index, array) {
  console.log('mapCallback方法的参数', value, index, array);
  return value * value;
}
var arr = [1, 2, 3];
// 简单的map
var newArr = arr.map(mapCallback);
//[2,4,6]
// 注：当方法内仅一行代码时, 可以省略掉花括号与return,
// map方法中内容仅一行代码且该代码是表达式时默认返回该表达式
// 什么是表达式？ 表达式就是ECMAScript里的一个短句, ECMAScript解释器可以将其计算出一个结果
```

2. filter(callback) 过滤数组: 通过遍历的方式, 将数组中的每一个元素通过回调函数进行筛选后返回的值创建并返回一个新数组, filter 方法不会改变原数组

使用场景：相比起 map 来说, filter 的适用场景少很多, 主要用来对页面中的商品等信息做筛选处理

```javascript
/**
 * filterCallback
 * filter方法用于对每一个数组元素做处理的回调函数
 * @param {any} value 当前索引的元素
 * @param {number} index 当前索引
 * @return {boolean} 如果返回值为true则将该元素加入到新数组中
 * filter方法不会改变原数组
 */
function filterCallback(value, index) {
  console.log('filterCallback方法的参数：', value, index);
  return value > 2;
}
var arr = [1, 2, 3];
// 简单的filter
var newArr = arr.filter(filterCallback);
// [3]
```

3. reduce(callback, initialValue) 累加器: 遍历数组的所有项, 将数组中从左至右的的每个元素与上一次经过回调函数处理后的值进行计算, 最终将其合并成一个值

reduce 是一个极常用到的方法, 我们不仅可以用它来对数字进行一元计算, 还可以用它实现比如数组去重、数组转对象等一系列复杂功能

使用场景：多用于计算订单金额以及在一些特殊场景将对象转换成数组或将数组转换成对象

```javascript
/**
 * reduceCallback
 * reduce方法用于处理遍历的函数
 * @param {any} previousValue 上一次调用回调返回的值, 初始化时是reduce接收到的第二个参数initialValue
 * @param {any} currentValue 数组中当前被处理的元素
 * @param {number} index 当前索引
 */
function reduceCallback(previousValue, currentValue, index) {
  console.log('reduceCallback方法的参数', previousValue, currentValue, index);
  return previousValue + currentValue;
}
var arr = [1, 2, 3];
/**
 * reduce方法
 * @param {function} callback 回调函数, 该函数中返回的内容会被当成下一次遍历时的第一个参数
 * @param {any} initialValue 初始值, 该参数是一个可选参数, 会被当成首次遍历时的回调函数的第一个参数
 */
var accumulated = arr.reduce(reduceCallback, 0);
// 6
```

reduce 是一个很有思想的方法, 它的回调函数第一个参数并不是固定的, 当我们调用 reduce 方法时传入初始化值的时候, 它是这个传入的参数, 如果没有传入初始化参数, 它就是数组的第一个元素, 而当回调被执行过一遍以后, 它又成了上次执行回调函数时返回的值。根据它的这个特点, 我们可以实现一些复杂的功能

```javascript
var str = '4687231567182461978234';
/**
 * 将上面的字符串去重后排序
 */
var newStr = str
  .split('')
  .reduce((prev, next) => {
    return prev.includes(next) ? prev : prev.concat(next);
  }, [])
  .sort()
  .join('');
// '123456789'
/**
 * 将指定的数组转换成对象
 */
var newObj = newStr.split('').reduce((prev, next, index) => {
  prev[next] = index;
  return prev;
}, {});
// {1: 0, 2: 1, 3: 2, 4: 3, 5: 4, 6: 5, 7: 6, 8: 7, 9: 8}
```

4. includes() 判断数中是否包含给定的值

```javascript
var arr = [1, 2, 3];
arr.includes(2);
arr.includes(6);
```

5. find() 找到第一个符合条件的数组成员

```javascript
var arr = [1, 2, 3];
arr.find(2);
```

find 方法也接受一个回调函数作为参数, 以实现对复杂数 c 组成员的检索

```javascript
var arr = [
  { a: 1, b: 2 },
  { a: 3, b: 5 },
];
/**
 * findCallback
 * find方法用于对每一个数组元素做处理的回调函数
 * @param {any} value 当前索引的元素
 * @param {number} index 当前索引
 * @param {Array} array 原数组
 * find方法不会改变原数组
 **/
function findCallback(item, index, array) {
  return item.a === 3;
}
arr.find(findCallback);
```

6. findIndex() 找到的第一个符合条件的数组成员的索引值, 其用法与 find 一致

7. fill() 以指定的值填充数组, 不怎么用, 确切地说是一直没用过

```javascript
var arr = new Array(5);
arr.fill(5);
```

8. arr.every(callback) 依据判断条件, 数组的元素是否全满足, 若满足则返回 ture

```javascript
var arr = [1, 2, 3];
/**
 * everyCallback
 * @param {any} value 当前索引的元素
 * @param {number} index 当前索引
 * @return {boolean} 如果返回值为true跳过, 如果返回值为false则结束遍历
 */
function everyCallback(value, index) {
  return value > 3;
}

var greater = arr.every(everyCallback);
```

9. arr.some() 依据判断条件, 数组的元素是否有一个满足, 若有一个满足则返回 ture

```javascript
var arr = [1, 2, 3];
/**
 * someCallback
 * @param {any} value 当前索引的元素
 * @param {number} index 当前索引
 * @return {boolean} 如果返回值为false跳过, 如果返回值为true则结束遍历
 */
function someCallback(value, index) {
  return value > 3;
}
var greater = arr.some(someCallback);
```

#### ES6 的对象新增常用方法

1. Object.is 比较对象

> 我们在需要对两个对象进行比较时，一般都会使用“===”，偶尔偷懒的时候或者会使用“==”，但在一些特殊情况下，我们从这两个操作符中并不能获得满意的结果

```javascript
+0 === -0;
NaN === NaN;

// 使用Object.is
Object.is(+0, -0);
Object.is(NaN, NaN);
```

2. Object.assign 合并对象

> 这是一个常用方法，主要用于对象的合并，将源对象的所有可枚举属性复制到目标对象上。

```javascript
var obj = { a: 1 };
var obj1 = { b: 2 };
var obj2 = { c: 3 };
Object.assign(obj, obj1, obj2);
```

> Object.assign 拷贝的属性是有限制的，只拷贝源对象的自身属性（不拷贝继承属性），也不拷贝不可枚举的属性（[[enumerable]]: false）。  
> **注意点：**  
> （1）Object.assign 方法实行的是浅拷贝，而不是深拷贝。也就是说，如果源对象某个属性的值是对象，那么目标对象拷贝得到的是这个对象的引用。  
> （2）Object.assign 可以用来处理数组，但是会把数组视为对象。  
> （3）Object.assign 只能进行值的复制，如果要复制的值是一个取值函数，那么将求值后再复制。

可枚举属性和不可枚举属性
Object.assign 处理数组但会把数组视为对象
**常见用途**

> 为对象添加属性或方法  
> 克隆对象  
> 合并多个对象

- Object.keys()与 Object.values()

> Object.keys 返回一个数组，包括对象自身的（不含继承的）所有可枚举属性（不含 Symbol 属性）的键名; Object.values 则返回属性的值。

- Object.entries()与 Object.fromEntries()

```javascript
var obj = {
  a: 1,
  b: 2,
  c: 3,
};
var arr = Object.entries(obj);
var obj1 = Object.fromEntries(arr);
```

- get 与 set

> get 与 set 主要用于解决一些我们在定义某些对象中的属性时，该属性的来源数据仍未确定，需要等待数据确定后才能获取，如下：

```javascript
var obj = {
  a: 1,
  get c() {
    return this.a + this.b;
  },
};
obj.b = 2;
console.log(obj.c);
```

> 如同上面的代码，我们在最初定义对象的时候，obj.c 所依赖的属性 obj.b 尚未定义，这个时候无论是将 c 定义成一个方法还是定义成一个赋值函数都不太合适，get 方法相对来说就比较合适了，我们在这里定义，但并未真正地调用，所以，内部的 this.b 并不会引起报错。直到 obj.b 被定义后的未来，我们需要使用 obj.c 属性时，可以使用直接获取的方式来调用 get 方法

#### Spread / Rest 操作符

> 展开/剩余, 这两个操作符, 其实是同一个写法 > ..., 区别只是用在哪里, 展开操作符一般用于属性的批量赋值或者参数的传递, 而剩余操作符一般用于参数的接收

```javascript
// 展开操作符的用法
// 复制/合并数组
var arr1 = [1, 2, 3];
var arr2 = [...arr1];
var arr3 = [3, 4, 5];
var arr4 = [...arr1, ...arr2, ...arr3];
// 复制/合并对象
var obj1 = { a: 1, b: 2 };
var obj2 = { ...obj1 };
var obj3 = { c: 3, d: 4 };
var obj4 = { ...obj2, ...obj3, ...{ a: 5 } };
// 使用展开操作符合并对象时, 如果已经存在某个key, 则将其覆盖为后续的具有相同key的值, 可以视为assign方法的快捷版
// 传递参数
function fn1(a, b, c) {
  console.log(a, b, c);
}
var arr5 = [1, 2, 3];
fn1(...arr5);
// 解构赋值
var arr6 = [4, 5, 6];
var [aa, ...other] = arr6;

var obj6 = { a: 1, b: 2, c: 3 };
var { c, ...other } = obj6;

// 剩余参数的用法
function fn2({ a, ...other }) {
  console.log(a, other);
}
fn2({ a: 1, b: 2, c: 3 });
```

#### 类

> JavaScript 是一个面向对象的语言, 面向对象语言的特点就是可以将某些对象的属性与方法抽象后共享给新的对象, 而类就是这个抽象方法的具体实现。

```javascript
// 定义了一个名字为Person的类
// class 的本质仍然是一个构造函数, 只是ES5中构造函数的一个语法糖
// 让我们在编写对象原型时写法更清晰, 看起来与其它传统面向对象语言更相似
class Person {
  // constructor是一个构造方法, 用来接收参数
  // constructor是类的默认方法, 创建类的实例化对象时被调用
  // constructor如果没有显式定义, 会隐式生成一个constructor方法。所以即使你没有添加构造函数, 构造函数也是存在的
  constructor(name, age) {
    // this代表的是实例对象
    // 这里被定义的属性被称之为实例属性
    this.name = name;
    this.age = age;
  }
  // 这是实例方法的写法, 不需要加上function
  say() {
    return '我的名字叫' + this.name + '今年' + this.age + '岁了';
  }
  // 静态属性的声明
  static nickName = '你猜';
  // 静态方法的声明
  static printNickName() {
    console.log(Person.nickName);
  }
}
var obj = new Person('laotie', 88);
console.log(obj.say()); //我的名字叫laotie今年88岁了
```

#### 函数声明与箭头函数

函数是我们需要学习的一个重点, 70%的面试官会问到与函数相关的问题, 95%的笔试题中会有与函数相关的问题。或者现在这个数据不是很准确了, 但仍然可以看出来这个方法的重要性。

- 关于函数的 this

> 调用位置：调用位置就是函数在代码中被调用的位置(不是声明位置)

```javascript
function fn() {
  console.log(this, 'fn');
}
fn();
```

> 某些时候, 我们可能无法一眼看出来函数的真正调用位置, 这里就需要分析 **调用栈** 了, 所谓的调用栈, 就是为了达到当前执行位置所调用的所有函数。也被称之为环境栈。

```javascript
function fn() {
  console.log(this, 'fn');
  fn1();
}
function fn1() {
  console.log(this, 'fn1');
  fn2();
}
function fn2() {
  console.log(this, 'fn2');
}
fn();
```

> 默认绑定：默认绑定即独立的函数调用, 当其他规则无法应用时的默认规则, 如

```javascript
function fn() {
  console.log(this.str, 'fn');
}
var str = 'abc';
fn();
```

> 隐式绑定：当函数有上下文对象时, 隐式绑定会将函数中的 this 指向到这个上下文对象。

```javascript
function fn() {
  console.log(this.str, 'fn');
}
var str = 'abc';
var obj = {
  str: 'xyz',
  fn: fn,
};
obj.fn();
```

> 对象的属性引用链只有上一层或者说最后一层会在调用位置起作用, 因为作用域链对于 this 的寻找只会到当前的活动对象或变量对象中, 不会到更上一层

```javascript
function fn() {
  console.log(this.str, 'fn');
}
var str = 'abc';
var obj = {
  str: 'xyz',
  fn: fn,
};
var obj1 = {
  str: '123',
  obj: obj,
};
obj1.obj.fn();
```

> 显式绑定：能一眼看出来它的 this 指向的, 比如 call 或 apply

```javascript
function fn() {
  console.log(this.str, 'fn');
}
var obj = {
  str: 'abc',
};
function fn1() {
  fn.call(obj);
}
fn1();
fn1.call(window);
```

> 由于显式绑定是一种非常常用的方式, 所以 es5 中还有一种硬绑定的方式 bind

```javascript
function fn() {
  console.log(this.str, 'fn');
}
var obj = {
  str: 'abc',
};
var fn1 = fn.bind(obj);
fn1();
```

> 通过 new 方式来绑定 this

```javascript
function fn(str) {
  this.str = str;
}
var obj = new fn('abc');
obj.str;
{
  var obj = new Object();
  obj.__proto__ = fn.prototype;
  var result = fn.call(obj, 'abc');
  return result === 'object' ? result : obj;
}
```

> this 绑定的优先级：

```javascript
// 显式与隐式的比较
function fn() {
  console.log(this.str);
}
var obj = {
  str: 'abc',
  fn: fn,
};
var obj1 = {
  str: 'xyz',
  fn: fn,
};
obj.fn();
obj1.fn();
obj.fn.call(obj1);
obj1.fn.call(obj);
```

```javascript
// new操作符的比较
function fn(str) {
  this.str = str;
  this.fn = str => {
    console.log(this.str, str);
  };
}
var obj = {
  fn: fn,
};
var obj1 = new obj.fn('123');
var obj2 = {};
obj1.fn.call(obj2, 'xyz');
obj.fn('abc');
console.log(obj.str, 'obj');
console.log(obj1.str, 'obj1');
console.log(obj2.str, 'obj2');
```

- 总结：

  > 首先判断函数是否是在通过 new 操作符实例化对象中调用？如果是则指向这个实例化对象；  
  > 如果不是实例化对象则判断是否显式绑定，如果是则指向显式绑定的对象；  
  > 如果仍然不是，那么判断是否有上下文，如果有上下文则指向上下文对象；  
  > 上面的条件都不符合，使用默认绑定，指向 window。

- 箭头函数的 this
  > 箭头函数完全颠覆了函数声明的四种标准规则，而是在定义时函数时就保存了当前的作用域链，然后顺着当前的作用域链去寻找 this。也就是说，箭头函数的 this 在定义时就已经与对象绑定，而不是在调用时根据调用环境来决定 this 的指向。
  > 简单来说，箭头函数体内的 this 对象就是定义时所在的对象，而不是调用时所在的对象。

```javascript
// 隐式绑定
var fn = () => {
  console.log(this.str, 'fn');
};
var str = 'abc';
var obj = {
  str: 'xyz',
  fn: fn,
};
obj.fn();

// 显式绑定
function fun() {
  var fun1 = () => {
    console.log(this, 'fun1');
  };
  return {
    fun1,
    fun2: () => {
      console.log(this, 'fun2');
    },
  };
}
var str = 'abc';
var obj1 = {
  str: 'xyz',
};
var obj2 = {
  str: '123',
};
var fn3 = fun.call(obj1);
fn3.fun1.call(obj2);
fn3.fun2.call(obj2);
```

> 总结：  
> 箭头函数的 this 绑定看的是 this 所在的函数定义在哪个对象下，绑定到哪个对象则 this 就指向哪个对象  
> 函数声明在一般情况下 this 的绑定是默认绑定，如果有 new 绑定则 new 绑定优先级最高，其次是显式绑定，然后再是隐式绑定。如果有对象嵌套的情况，则 this 绑定到最近的一层对象上。

- 箭头函数的简捷性

> 如果只有一个参数, 可以省略圆括号, 如果没有参数或有多个参数则必须保留圆括号;  
> 如果只有一行代码, 可以省略花括号;  
> 如果返回的内容是一个表达式, 可以省略 return, 需要注意的是, 如果返回的是一个对象字面量表达式, 则需要以圆括号包围起来, 避免与函数体的{ ... }起冲突;

- 箭头函数比起传统的函数声明或函数表达式少了些什么？

> 没有绑定 this, 它的 this 是词法作用域, 所以在它的内部使用 this 关键字将指向上一层作用域;

```javascript
let obj = {
  msg: 'hello',
  fn1: function (name) {
    console.log(this.msg, 'fn1');
    // hello fn1
    function fn2() {
      console.log(this.msg, 'fn2');
      // undefined fn2
      return `${this.msg}, ${name}`;
    }
    // 调用时无上下文，指向默认对象window
    return fn2();
  },
};
// 根据上下文，this指向obj
obj.fn1('tom');
// 返回 undefined, tom

// 箭头函数的写法
let obj = {
  msg: 'hello',
  fn1: function (name) {
    console.log(this.msg, 'fn1'); // this指向obj
    fn2 = () => {
      console.log(this, 'fn2'); // this指向obj
      return `${this.msg}, ${name}`;
    };
    return fn2();
  },
};
obj.fn1('tom');
// 所以, 我们再也不需要使用that/self来保存当前this指向了
```

> 因为它无法对 this 进行绑定, 所以如果使用 call 或者 apply 方法调用时, 它们的第一个参数会被忽略;

```javascript
let obj = {
  msg: 'hello',
  fn1: function (name) {
    console.log(this.msg, 'fn1'); // this指向obj
    fn2 = () => {
      console.log(this, 'fn2'); // this指向obj
      return `${this.msg}, ${name}`;
    };
    return fn2.call({ msg: 'hallo' });
  },
};
obj.fn1('tom');
// hello, tom
// this指针没有偏移到新对象
```

> 没有绑定 arguments 对象, 所以我们只能使用剩余参数（Rest, ...）;  
> 没有自己的 super; 没有自己的 constructor; 也没有自己的 prototype, 所以它不能使用 new 关键字, 它只是更适合用于我们声明的函数表达式而不是函数声明;
