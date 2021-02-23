> 企业框架实战\_第一部分\_TypeScript 入门

- ## TypeScript 是什么？

TypeScript 是一种由微软开发的<font color=red>开源、跨平台的编程语言</font>。它是 **<font color=red>JavaScript 的<u>类型的超集</u></font>**，主要提供了对**<font color=red>强类型系统</font>**的支持，它最终会被编译工具<font color=red>编译成指定版本的 JavaScript 代码</font>，经过编译出来的 JavaScript 代码可以<font color=red>运行在任何浏览器</font>上。同样的，TypeScript 编译工具 tsc 也可以运行在任何服务器和任何系统上。

TypeScript 当前的最新版本号为 4.0，我们这期的教材也基本都是根据 TypeScript 官网所提供的文档收集整理，如果以后你们的工作中有使用 TypeScript 语言开发项目的，请注意是否有新的更方便易用的特性被加入进来，以便于更好地使用这门语言来开发项目。

- ## 为什么要学习 TypeScript?

说到为什么要学习 TypeScript，我们从前端的现状看，从 JavaScript 目前的发展和应用趋势来看，它的发展实在是太快了，你可以用它进行<font color=red> web 开发、wap 开发、桌面应用开发以及后端开发，甚至目前已经渐成趋势的 VR、WebGL 及物联网的应用开发</font>等等，它的标准从 2015 年开始每年都会更新，目前已经更新到 2020 版本。

那么，大家思考一下，这么频繁地更新版本，会对项目开发有什么影响吗？

提示：有人喜欢 es5,有人喜欢 es6,有人想尝鲜 es2019 等，这么多不同版本的语法在同一个程序中运行，会造成什么样的问题？

即便是以每年一次更新的这种速度，JavaScript 仍然与 java 、C# 这些成熟的高级语言有一些距离，比如类型系统。

我们都知道，<font color=red>JavaScript 是一个弱类型、动态类型的脚本语言</font>，再加上其版本迭代太快的原因，团队成员在使用 JavaScript 开发项目时很容易随意发挥，而<font color=red>不受规范约束</font>。比如很多人在对两个变量做比较时，仍然喜欢用“==”而不是约束更强大的“===”；仍然喜欢用“!0”或“!1”这种方式来表示布尔值；仍然喜欢“1 + ‘’” 或 “'1' \* 1”用这些非显式方法来对变量做类型转换。这些做法在 JavaScript 中是允许的，但包藏着极大的风险，谁也不知道哪一天会不会有其它人传过来的参数类型不正确，而导致他的程序抛出错误的结果甚至无法正常运行。而 TypeScript 的静态类型检查，就可以帮我们强制要求调用者传给我们的参数类型是绝对正确的，以避免不确定的类型转换所带来的风险。

当然，有的团队可以针对这些版本的 JavaScript 做出使用规范，引入一些代码质量检测插件，比如<font color=red>eslint</font>。但整理这些内容，需要花费不少的时间，然后在团队推广和使用制定的规范时又要花一段时间。

俗话说，铁打的营盘流水的兵。当前的企业人才高速流动，我们不能每次增加新成员的时候就让他去学习本企业的开发规范，这浪费时间也影响效率。

我们在上面提到了，TypeScript 提供了对强类型系统的支持。所以，与其花这些时间进行整理，还不如在 TypeScript 的基础上，结合 TypeScript 的特点做一套标准即可用来应对 JavaScript 版本不断的更新迭代以及动态类型的随意转换。

### <font color=red>1. 静态类型</font>

- ##### JavaScript 当前存在的弱点
  刚才我们说到了，JavaScript 是一个弱类型、动态类型的脚本语言，那么，TypeScript 的第一个也是最主要的一个特点就是强类型加静态类型检查。

关于强类型、弱类型、动态类型、静态类型，这些都不是必须了解的内容，为了不影响大家的学习时间，这里我们就不多说了，你们可以在下课后去百度了解一下。

为什么要说最主要的一个特点是静态类型呢？这就要说到 JavaScript 了，做为一种弱类型的解释型脚本语言，其简单紧凑的的设计已经不太适合当前日渐复杂的开发工作了，我们急需一种语言来解决团队合作中的由于**<font color=red>不正确类型导致错误而产生的风险</font>**，以及**<font color=red>各种 JavaScript 版本混杂造成错误的风险</font>**。

试想一下，你花了大半天甚至一整天的时间，搞出来一个自认为完美的函数或是功能插件。 快下班时，一个同事拿去调用了一下，程序崩溃了。 你查了一下原因：啊，原来是参数的类型传错了，赶紧补文档补注释说明一下。过一会，另一个同事拿去调用了一下，程序还是崩溃了。你查了一下原因：啊，参数类型没错，但是参数对象里面的值的类型传错了，你崩溃了。于是你只能放弃准点下班的想法，写上一堆判断和转换，以求让自己的程序更“健壮”。 这个例子可能有些极端，但不可否认的是，这种情况在早些年的时候我们经常会遇到。然后，我们再来举个不极端的例子：

```javascript
let cat = 'merlin';
let age = 3;
function increaseAge(age) {
  return age + 1;
}
increaseAge(cat); // 'merlin1'
```

上面这段代码，在 JavaScript 中是可以正常执行并返回结果的，但是，这个结果根本就不是我们所期望的结果不是吗？

- ##### TypeScript 的解决方案
  TypeScript 把高级语言的**<font color=red>强类型</font>**这个最主要的特征引入 JavaScript，避免了我们在编写 JavaScript 代码时因为**<font color=red>数据类型的动态转换</font>**而造成的意想不到的错误，减少了我们排查问题的困难性。它为 JavaScript 上了一把高级语言<font color=red>强类型</font>的锁，来避免这类问题的产生。

##### 简单修改上面的示例：

```javascript
let cat: string = 'merlin';
let age: number = 3;
function increaseAge(age: number) {
  return age + 1;
}
increaseAge(cat);
// 类型“number”的参数不能赋给类型为“string”的属性。
```

(
windows 下使用 vscode 的终端运行 tsc 可能会遇到问题：

1. 以管理员身份运行 vscode;
2. 执行：get-ExecutionPolicy，显示 Restricted，表示状态是禁止的;
3. 执行：set-ExecutionPolicy RemoteSigned;
   )
   也许你觉得这段代码跟 JavaScript 的内容差不多，但在你尝试编译代码时，TypeScript 会抛出一个错误，提示你 increaseAge 函数的参数必须是数字类型。这就大大降低了我们开发过程中因为**<font color=red>动态类型转换而产生的潜在的风险</font>**与排查错误的困难性。

这就是 TypeScript 的魅力所在，可以提前帮我们发现代码出现错误的风险。  
这个时候我们再回到之前的场景：

你花了一整天的时间，搞出来一个自认为完美的函数或是功能插件。快下班时，一个同事拿去调用了一下，编辑代码时 vscode 报错了，这时他一看，哦，参数类型传错了，顺手改一下，重新编译就行。你发现你根本不需要维护大量的注释和文档。于是乎你接下来的工作无非就是等着到下班点，hoho..下班了..收拾东西，回家。

### <font color=red>2. 方便阅读</font>

TypeScript 的类型系统实际上也是一个非常实用的文档，大部分的函数通过查看类型的定义就可以知道如何使用，并且在 vscode 里面去编写 TypeScript 时，vscode 会根据你当前的上下文，把你能用的类、变量、方法和关键字都提示出来，一目了然。不仅如此，TypeScript 的特性还增强了 vscode 的功能，包括代码补全、接口提示和点击跳转等等

如下图，我们可以很清晰的通过 index.d.ts 这个文件了解到 cors 这个函数的参数类型：
<img src="../static/images/interface_documents.png" />

以及 TypeScript 的代码提示
<img src="../static/images/function_tips.png" />

### <font color=red>3. 按需输出</font>

前面提及到 JavaScript 发展迅速，这一点，估计 JavaScript 的创始人 Brendan Eich 也没有想到 JavaScript 能发展到今天的地步，JavaScript 的版本现在几乎每年都会有更新，如果要写出兼容性的脚本，对于每位开发者是一个相当大的挑战。而 TypeScript 却很好的解决了这个问题，你可以**<font color=red>按需输出</font>**你所需要的脚本，比如 ECMAScript 3、ECMAScript 5、ECMAScript 6。

### <font color=red>4. 新版 JS 的支持</font>

另外，除了主流前端框架集成的问题，还有一个重要的原因，也是跟 JavaScript 更新太快有关，因为它的更新太快，导致浏览器没办法紧跟它的脚步，往往要拖上大半年甚至多年才能支持最新的特性，但这个时候又有新的特性被布了。而 TypeScript 紧跟 JavaScript 的发展，比如 ES7 、ES8、ES9，以及最新的 ES2020 相关语言的新特性都支持，比浏览器支持的速度更快。这就意味着你能用最新的语言特性，编写出质量更高的 JavaScript 程序。

### <font color=red>5. 社区活跃</font>

Angular 2.0 版本就开始集成 TypeScript，用于解决版本兼容性和弱语言的特点，从而与 TypeScript 互相推动了各自的发展。继 Angular 之后，React 、Vue 也相继加入了 TypeScript 的阵营，而在去年，也就是 2019 年，大量的第三方插件都开始提供 TypeScript 类型定义文件。这也就意味着，TypeScript 的生态环境正在蓬勃发展，迅速完善。

### 缺陷

虽然上面说了很多好处，但是 TypeScript 也会有一些缺陷，比如初期代码编辑时增加了较多的工作量，另外，可能还是会有一些冷门的插件或框架不支持 TypeScript。所以，<font color=red>在用一些冷门框架或者做一些小项目的时候，还是谨慎点，别使用 TypeScript 了，因为 TypeScript 没有问题，框架本身也没有问题，可是，框架+TypeScript 会有很多问题！</font>

### 1. 安装 TypeScript

有两种主要的方式来获取 TypeScript 工具：

- 使用 Visual Studio*（正常来说，前端开发人员很少会使用类似于 Visual Studio 这种大型的 IDE，所以，这里就暂时不说了）*
- 做为前端开发人员，我比较推荐大家使用 vscode 这款编辑器。通过 npm（Node.js 包管理器安装）

```javascript
npm install -g typescript
```

### 2. 配置 typescript.json 文件

### 3. 编写第一个 TypeScript 程序

在你的编辑器，将下面的代码输入到 sayHello.ts 文件里：

```javascript
function sayHello(person) {
  return 'Hello, ' + person;
}

let user = 'Menlin';

console.log(sayHello(user));
```

刚才的例子中我们使用了.ts 扩展名，但是这段代码仅仅是 JavaScript 而已。 你可以直接从现有的 JavaScript 应用里复制或粘贴一段已有的代码，相信这可以很好的诠释 TypeScript 的兼容性。

### 4. 编译代码

接下来，我们在命令行上，运行 TypeScript 编译器：

```
tsc sayHello.ts
```

这时候会生成一个编译好的文件 sayHello.js，它包含了和我们刚才输入的 JavsScript 代码。

### 4. 类型注释

**<font color=red>TypeScript 中的类型注释是记录功能或变量的预期约定的方法。</font>**

现在我们将这段代码改写成一段真正的 TypeScript 代码，很简单，加上类型注释就好。例如，在这里我们打算使用单个字符串参数来调用 sayHello 函数。

```javascript
function sayHello(person: string) {
  return 'Hello, ' + person;
}

let user = 'Menlin';

console.log(sayHello(user));
```

然后，运行 TypeScript 编译器重新编译：

```
tsc sayHello.ts
```

可以看到，经过编译后的 js 代码与之前几乎一致，并没有象我们想象中的那样，有什么检查的代码被插入进来，因为 **<font color=red>TypeScript 只会进行静态检查，如果发现有错误，在编译的时候就会报错。</font>** 你们现在可以尝试来将一个数组作为参数传给 sayHello 试试：

```javascript
function sayHello(person: string) {
  return 'Hello, ' + person;
}

let user = 'Menlin';
let arr = [1, 2, 3];

console.log(sayHello(arr));
// Argument of type 'number[]' is not assignable to parameter of type 'string'.
```

重新编译时，TypeScript 就会提示你错误：

```
error TS2345: Argument of type 'number[]' is not assignable to parameter of type 'string'.
```

但是，TypeScript 仍然会生成一个 js 文件；  
同样的，我们尝试删除 sayHello 调用的所有参数。TypeScript 也会告诉你使用了意外数量的参数调用了此函数。  
在这两种情况下，TypeScript 都可以**<font color=red>基于代码的结构和所提供的类型注释提供静态分析</font>**。

所以，我们知道了，**<font color=red>TypeScript 编译的时候即使报错了，还是会生成编译结果</font>**，我们仍然可以使用这个编译之后的文件。  
但是在这种情况下，<font color=red>TypeScript 将会警告你代码可能不会按预期运行</font>。

好了，现在一切准备就绪，我们可以开始学习一些 TypeScript 的基础知识了！

## TypeScript 变量定义及数据类型

变量的定义:变量名:类型声明 = 值

一般来说，TypeScript 中的类型分为两种：原始类型（Bisic types）和对象类型（Object types）。分别与 JavaScript 中的原始类型与引用类型相对应。
另外一种类型分类则是顶部类型、底部类型与中间类型，这种分类法通过父子类型的方式来分类，比较少用到，大家稍作了解即可，感兴趣的也可以下课后搜索相关文档来更深入地了解。

### TypeScript 原始类型

本节课主要介绍 TypeScript 中的原始数据类型。其中包含了 ES5 中一直在使用的类型：布尔值、数值、字符串值、null、undefined 以及 ES6 的新增类型 Symbol 与 ES2020 中的新增类型 BigInt，另外还有 TypeScript 新增的类型 void。
这其中，null 与 undefined 本身的用途不是很大，但它们却是所有类型的子类型，包括我们下一课将要讲到的 object 类型、any 类型与 unknown 类型。除 never 外，TypeScript 中所有的类型都可以被赋值为 null 与 undefined;

#### 布尔型 <font color=red>boolean</font>

最基本的数据类型是简单的 true / false 值，TypeScript 使用 <font color=red>boolean</font> 来定义布尔值的类型。

```javascript
let isBoolean: boolean = false;
let isDone: boolean = Boolean(false);
```

- 要注意，使用 new 关键字调用构造函数 Boolean 创造的对象不是布尔值：在 TypeScript 中，<font color=red>boolean</font> 是<font color=red>原始类型</font>，而 <font color=red>Boolean</font> 是 JavaScript 中的<font color=red>构造函数</font>，使用 new 关键字返回的是一个 Boolean 对象。其他原始类型也一样（除了 null 和 undefined），这里就不再赘述了。大家可以试试使用 new 关键字来创建一些对象看是否报错。

```javascript
let isBoolean: boolean = new Boolean(1);
// 不能将类型“Boolean”分配给类型“boolean”。
// “boolean”表示为原始类型，但“Boolean”表示内置对象。“boolean” 不等于 “Boolean”。
```

#### 数字型 <font color=red>number</font>

与 JavaScript 中一样，TypeScript 中的所有数字都是浮点值。这些浮点数获取类型 number。

```javascript
let decimalNumber: number = 6; // 10进制
let hexNumber: number = 0xf00d; // 16进制
let binaryNumber: number = 0b1010; // 2进制 JavaScript5 中引入
let octalNumber: number = 0o744; // 8进制 JavaScript5 中引入
let notANumber: number = NaN; // 无效数字
let infinityNumber: number = Infinity; // 无穷大的数字
// 注意：2进制和8进制的数字会被编译成为十进制数字。
```

#### 字符串型 <font color=red>string</font>

使用 JavaScript 为网页和服务器创建程序的另一个基本部分是使用文本数据。与其他语言一样，我们使用类型 string 来引用这些文本数据类型。与 JavaScript 一样，TypeScript 也使用双引号（"）或单引号（'）包围字符串数据。

```javascript
let cat: string = 'merlin';
cat = 'trump';
```

还可以使用模板字符串，该模板字符串可以跨越多行并具有嵌入式表达式。这些字符串由反引号/反引号（`）字符包围，并且嵌入式表达式的形式为${ expr }。

```javascript
let fullName: string = `merlin`;
let age: number = 3;
let sentence: string = `Hello, my name is ${fullName}.

I'll be ${age + 1} years old next month.`;
```

这等同于下面这段代码：

```javascript
let sentence: string =
  'Hello, my name is ' +
  fullName +
  '.\n\n' +
  "I'll be " +
  (age + 1) +
  ' years old next month.';
```

#### <font color=red>null</font> 与 <font color=red>undefined</font>

TypeScript 里，undefined 和 null 两者各自有自己的类型分别叫做 undefined 和 null。 和 void 相似，它们的本身的类型用处不是很大：

```javascript
// 它们只能赋值自己本身，不接受其它
let u: undefined = undefined;
let n: null = null;
```

与 void 的区别是，undefined 和 null 是所有类型的子类型。举个例子： undefined 类型的变量，可以赋值给 number 类型的变量：

```javascript
let num: number = undefined; // 这样不会报错

// 这样也OK
let u: undefined;
let num: number = u;

// 不OK
let u: void;
let num: number = u;
```

#### 任意大的整数 <font color=red>bigint</font>

表示大于 2^53-1 的整数，可以写为 Number.MAX_SAFE_INTEGER。这原本是 Javascript 中可以用 Number 表示的最大数字。为了可以如果超过了这个界限，需要用 bigint 来表示，bigint 可以表示任意大的整数。

```javascript
let theBiggestInt: bigint = 9007199254740991n;
let alsoHuge = BigInt(9007199254740991);
let hugeString = BigInt('9007199254740991');
// 上面三个表达式，使用的是同一个数字“9007199254740991”，方式不同但含义相同，所以它们的结果是完全一致的，你可以使用任一方式来表达
```

由于在 Number 与 BigInt 之间进行转换会损失精度，因而建议仅在值可能大于 2^53-1 时使用 BigInt 类型，并且不在两种类型之间进行相互转换。

#### 唯一 <font color=red>symbol</font>

Symbol 是一种在 ES6 中新添加的数据类型，本质上是一种唯一标识符，可用作对象的唯一属性名，这样其他人就不会改写或覆盖你设置的属性值。symbol 类型的值是通过 Symbol 构造函数创建的。

- <font color=red>Symbols 是不可改变且唯一的</font>。

```javascript
let sym: symbol = Symbol('key');
let other: symbol = Symbol('key');
console.log(sym === other); // false，symbol是不可改变且唯一的

let obj = {
  [sym]: 'menlin',
  [other]: 3,
};
const keys = Object.keys(obj); // 获取当前对象的所有可枚举属性
const attrs = Object.getOwnPropertyNames(obj); // 获取当前对象的所有实例属性名，无论它是否可枚举
const objString = JSON.stringify(obj); // 将当前对象转换成字符串类型

console.log(keys, attrs, objString);
// [], [], {}, 什么都找不到，通过symbol值创建的属性脱离了原型链

const symbols = Object.getOwnPropertySymbols(obj); // 检索对象中的 Symbol 属性
```

注意，在使用 symbol 做为唯一属性名时，只能使用 Object.getOwnPropertySymbols()来获取当前对象的所有 symbol 属性，然后使用 for 循环来取出对应的属性值。
Object.getOwnPropertySymbols()可以返回对象自有的 Symbol 属性，原型链上的属性不会被获取。返回值是存储自有 Symbol 属性的数组。

#### 空值 <font color=red>void</font>

Java 或者 C# 等语言中，如果方法没有返回值，那么此方法的返回值类型就是 Void 类型。而 JavaScript 中没有空值（Void）的概念，为了更加趋近于经典面向对象语言，TypeScript 新增了 void 类型用来表示没有任何返回值的函数。

```javascript
function warnUser(): void {
  console.log('This is my warning message');
}
```

需要注意的是，void 类型的变量是有限制的，只能是 null 和 undefined，赋予其它任何值都会报错：

```javascript
let isVoid: void = null; // ok
let eventHandler: void = undefined; // ok
let handledUserInfo: void = false; // 不能将类型“boolean”分配给类型“void”
```

#### 类型推论

什么是类型推论：以下代码虽然没有指定类型，但是会在编译的时候报错：

```javascript
let catName = 'merlin';
catName = 7;
// 不能将类型“number”分配给类型“string”
```

TypeScript 会在没有明确的指定类型的时候推测出一个类型，这就是类型推论。所以，这个例子它事实上等价于：

```javascript
let catName: string = 'merlin';
catName = 7;
// 不能将类型“number”分配给类型“string”
```

需要注意的是：如果定义的时候没有赋值，不管之后有没有赋值，都会被推断成 any 类型而完全不被类型检查：

```javascript
let catName;
catName = 7;
catName = 'merlin';
```

事实上，它等价于：

```javascript
let catName: any;
catName = 7;
catName = 'merlin';
```

#### 联合类型

联合类型（Union Types）表示取值可以为多种类型中的一种：

```javascript
function getLength(str: string | number) {
  if (typeof str === 'string') {
    return str.length;
  }
}
```

当 TypeScript 不确定一个联合类型的变量到底是哪个类型的时候，我们只能访问此联合类型的所有类型里共有的属性或方法：

## TypeScript 中的其它常见类型

#### 任意值 <font color=red>any</font>

什么是任意值类型?
在为什么要学习 TypeScript 中我们知道了，**<font color=red>在 TypeScript 中，一个被声明了类型的变量，在使用过程中是不允许改变类型的</font>**：

```javascript
let catName: string = 'menlin';
catName = 6;
// 不能将类型“number”分配给类型“string”
```

但是，在实际的开发工作中，我们有的时候可能需要描述编辑应用程序时不知道的变量类型。这些值可能来自动态内容（比如，来自用户输入），或者从 API 中获取到的值。在这些情况下，我们希望能够提供一种类型，该类型告诉编译器和将来的维护人员，此变量可以是任何类型。于是就有了 any 类型，<font color=red>any 类型可以在使用过程中被赋值为任意类型</font>。

```javascript
let myFavoriteNumber: any = 'six';
myFavoriteNumber = 6;
// no problem
```

因为我们认为 any 这个类型是所有可用类型，于是，在任意值上访问任何属性都是允许的，甚至可以直接调用一些方法：

```javascript
let catName: any = 'Tom';
console.log(catName.myName);
console.log(catName.myName.firstName);
// 可以调用它的方法，编译器并不会报错。
catName.setName('Jerry');
// 甚至可以链式调用
catName.setName('Jerry').sayHello();
catName.setName.setFirstName('Cat');
```

**<font color=red>声明一个变量为任意值之后，对它的任何操作，返回的内容的类型都是任意值</font>**。
切记：any 类型是一个 TypeScript 中的逃生舱，所以它完全脱离了 TypeScript 的类型检查，回到了 JavaScript 的弱类型方式。当出现我们第一课时所描述的那种比较极端的情况时，又会出现一堆的错误。所以，\*\*<font color=red>any 类型要慎用</font>，在最初的尝试或者测试可以暂时定义成 any 类型，一旦可以确定时一定要赋予类型。

#### 未知 <font color=red>unknown</font>

因为 any 类型的被滥用，TypeScript 3.0 时引入了 unknown 类型，unknown 类型是 any 类型的安全版本。每当你想使用 any 时，应该先试着用 unknown。在 any 允许我们做任何事的地方，unknown 则会需要我们先做一些对于类型的操作，如执行 typeof 检查，比较检查或类型断言等更高级的类型防护措施，将其范围缩小到更具体的范围后才能使用：

```javascript
function getLength(catName: unknown) {
  if (typeof catName === 'string') {
    return `hello, ${catName}!`;
  }
  return catName.length;
}
getLength('Tom');
```

#### \* 注意：unkown 与 any 看起来似乎是一样的，但其它有很大不同，any 是匹配所有类型，而 unknow 是匹配指定类型。

#### never 永不

### 对象类型<font color=red>object type</font>

与 JavaScript 中定义的引用类型一样，TypeScript 中的所有非原始类型被统称为对象类型。TypeScript 中的对象类型包含了数组、元组、枚举、接口等。

#### 数组 <font color=red>Array</font>

在 TypeScript 中，数组类型有多种定义方式，比较灵活。

- ##### <font color=red>「类型 + 方括号」表示法</font>
  最简单的方法是使用「类型 + 方括号」来表示数组：

```javascript
let fibonacci: number[] = [1, 1, 2, 3, 5];
```

这种方式生成的数组中不允许出现其他的类型：

```javascript
let fibonacci: number[] = [1, '1', 2, 3, 5];
// 不能将类型“string”分配给类型“number”。
```

即便是数组的一些方法在调用时也会对参数进行类型限制：

```javascript
let fibonacci: number[] = [1, 1, 2, 3, 5];
fibonacci.push('8');
// 不能将类型“string”分配给类型“number”。
```

- #### <font color=red>数组泛型</font>
  我们也可以使用数组泛型（Array Generic） Array<elemType> 来表示数组：

```javascript
let fibonacci: Array<number> = [1, 1, 2, 3, 5];
```

- 关于泛型，这里只是简单地举个例子，大家知道有这样一个方式声明数组就行，稍后的课程会对泛型做一些比较详细的讲解。

* #### <font color=red>用接口</font>
  接口也可以用来描述数组：

```javascript
interface NumberArray {
  [index: number]: number;
}
let fibonacci: NumberArray = [1, 1, 2, 3, 5];
```

- 关于接口，这里也只是简单地举个例子，后面会有课程会对接口做一些比较详细的讲解。  
  NumberArray 表示：只要索引的类型是数字时，那么值的类型必须是数字。虽然接口也可以用来描述数组，但是我们一般不建议这么做，因为这种方式比前两种方式复杂多了。

#### 元组 <font color=red>Tuple</font>

元组可以看作是数组的拓展，一种更严格的数组类型，它表示已知元素数量和类型的数组。确切地说，是已知数组中每一个位置上的元素的类型，来看例子：元组类型允许您用固定数量的元素表示数组，这些元素的类型是已知的，但不必相同。例如，您可能希望将值表示为一对 a string 和 number：

```javascript
// Declare a tuple type
let tuple: [string, number];
tuple = ['hello', 10]; // OK
tuple = [10, 'hello']; // Error
```

当访问具有已知索引的元素时，将检索正确的类型：

```javascript
console.log(tuple[0].substring(1));
console.log(tuple[1].substring(1));
// Property 'substring' does not exist on type 'number'.
```

访问一组已知索引之外的元素失败，并显示以下错误：

```javascript
tuple[3] = 'world';
// Tuple type '[string, number]' of length '2' has no element at index '3'.

console.log(tuple[5].toString());
// Object is possibly 'undefined'.
// Tuple type '[string, number]' of length '2' has no element at index '5'.
```

在 2.6 及之前版本中，这种超出规定个数的元素称作越界元素，越界元素的类型只要是定义的类型中的一种即可。比如我们定义的类型有两种：string 和 number，越界的元素是 string 类型，属于联合类型，所以没问题。在 2.6 之后的版本，去掉了这个越界元素是联合类型的子类型即可的条件，要求元组赋值必须类型和个数都对应。

## 对象类型(续) <font color=red>object type</font>

### 枚举 <font color=red>Enum</font>

枚举类型是 TypeScript 对 JavaScript 标准数据类型的一个**补充**。像 C# 等其它语言一样，使用枚举类型可以**为一组无意义的数值赋予友好的名字**。

举个例子，15 年，神州专车，派单模块。代码中大量的无意义状态码导致无法正常阅读理解。

枚举的实现格式比较简单，通过 enum 关键字调用 TypeScript Enum 构造函数来生成一个指定名称的新枚举，如下所示：

```javascript
enum 枚举名称 { 枚举成员 = 成员的值, }
```

TypeScript 中枚举的每个成员都属于它们所在枚举集合的一个对象，也就是说它们的数据类型名称就是枚举集合的名称，使用枚举也很简单：通过枚举的名字访问它的类型和通过枚举的属性来访问它的成员
。例如下面这段代码：

```javascript
enum Direction {
  Up = 1,
  Right,
  Down,
  Left
}
function getDirectionName(code: Direction): string {
  return Direction[code];
}
getDirectionName(1); // 'Up'
getDirectionName(Direction.Down); // 'Down'
```

通过代码我们可以知道，我们可以采用枚举名.成员名的方式来获取成员的值，也可以通过反向映射，用成员的值来获取成员的名称(仅数字型枚举  成员可以生成反向映射，这个我们稍后就会讲到)。
而枚举的名字本身也可以做为变量或参数的类型使用。需要注意的是，当它做为类型名使用时，代表着这个变量或者参数只能是该枚举中的成员；

#### 枚举的分类

按照枚举成员的类型，枚举可分为两个大类：数字型枚举与字符串枚举；

但也有例外的时候，当枚举中既有数字又有字符串时，我们将这种枚举称之为异构枚举。一般来说，除了表示你知道异构枚举这个概念，正常的项目开发中，我们不建议你使用异构枚举。

在实际的开发工作中，我们最常使用的就是数字型枚举，用这种方式为一串无意义的无序的状态 ID 赋予一个有一定语义的名称：所以，接下来，我们主要详细说一说数字枚举这个概念：

#### 数字型枚举

刚才有说到，当定义的枚举成员是数字时，这个枚举就被称之为数字型枚举。如下所示：

```javascript
enum Direction {
  Up,
  Down,
  Left,
  Right,
}
let down: Direction = Direction.Down; // 1
```

而数字型枚举仍然可以分为两类：带有初始化表达式与不带初始化表达式，刚才的这个例子是不带初始化表达式的。
枚举的构造函数在没有检测到初始化表达式后，默认以数字 0 开始为元素编号，其后的成员会从 0 开始自动增加。详细来说，Up 的值为 0，Down 为 1，Left 为 2，Right 为 3；但你也可以手动的指定成员的数值。例如，我们将上面的例子改成从 1 开始编号：

```javascript
enum Direction {
  Up = 1,
  Down,
  Left,
  Right,
}
let down: Direction = Direction.Down; // 2
```

这个例子中的 Up = 1 就是枚举中的初始化表达式。
一般来说，我们不在乎成员的值的时候，这种自增长的行为是很好用的，可以省略很多事情。但如果项目要求所有的成员需要与文档或 API 中返回数据一致的时候，也可以全部都采用手动赋值：

```javascript
enum Color {
  Up = 1,
  Down = 3,
  Left = 4,
  Right = 2,
}
let down: Direction = Direction.Down; // 3
```

但要注意的是，初始化表达式仅支持数字，如果是字符串则会因为无法进行自增而导致编译时报错：

```javascript
enum Direction {
  Up = '1',
  Down,
  Left,
  Right,
}
// 枚举成员必须具有初始化表达式
```

或者使用其它常量作为成员的初始化表达式都是不允许的：

```javascript
const direction = 1;
enum Direction {
  Up = direction,
  Down,
  Left,
  Right,
}
// 枚举成员必须具有初始化表达式
```

#### 反向映射

数字型枚举在经过编译后会生成反向映射表(lookup table)，即除了生成对应的键值对集合外，还会生成值键对的集合。

```javascript
var Direction;
(function (Direction) {
  Direction[(Direction['Up'] = 1)] = 'Up';
  Direction[(Direction['Down'] = 2)] = 'Down';
  Direction[(Direction['Left'] = 3)] = 'Left';
  Direction[(Direction['Right'] = 4)] = 'Right';
})(Direction || (Direction = {}));

console.log(Direction.Up, Direction[2]); // 1, ’Down’
```

要注意的是，除了数字型枚举，字符串型的枚举成员因为其值的不确定性，导致容易被覆盖，所以无法生成反向映射表。

#### 枚举的多次声明

一个枚举可以通过多次声明来进行成员补充。有很多时候，我们在定义枚举时可能得到的成员还不完善，比如从 API 中获取某些状态码，可能第一次声明时我们只能拿到最基本的状态码，经过一次状态提交后才能拿到当前状态下更多的子状态码，不断迭代，直到拿到最底层的状态码。但在这过程中间，我们不可避免地要使用当时已经拿到的状态码，这个时候，我们可以使用枚举的多次声明：

```javascript
enum dispatch {
  didNot = 0000,  // 未派单
  dispathcIng = 1000, // 派单中
  received = 2000, // 已接单
}
// ...
enum dispatch {
  depart = 2100, // 已出发
  arrive = 2200, // 已到达服务地点
  serverStart = 2300 // 已开始服务
}
```

要注意的，多次声明时，不允许重复声明同一个枚举成员。

#### 常量枚举

常量枚举其实就是在 enum 关键字之前使用 const 修饰符，它的最大特点就是在编译阶段就被从代码中移除。我们可以编译一段包含枚举的代码来看看：

```javascript
const enum Direction {
  Up,
  Down,
  Left,
  Right
}
console.log(Direction); // Error
// "const" 枚举仅可在属性、索引访问表达式、导入声明的右侧、导出分配或类型查询中使用。
console.log(Direction.Down); // 1
let direction = [Direction.Up, Direction.Down, Direction.Left, Direction.Right];
```

之所这样做，是因为常量枚举不允许包含计算成员，所以，常量枚举的成员在使用的地方会被内联进代码中。

常量枚举的用途也不是很多，但当我们不需要一个完整的对象而仅需要这个对象的值的时候，就可以使用常量枚举了，这样，就可以避免在编译时生成多余的代码和引用。
要注意的是：因为在编译时代码就已经被移除，所以，常量枚举是没有反向映射的。

#### 外部枚举

外部枚举（Ambient Enums）是使用 declare enum 定义的枚举类型

declare 这个关键字一般出现在声明文件中，用于向 ts 声明一个你确认存在的对象，但它可能在编译时找不到，只有运行时才能找到。例如：

```javascript
declare const global: object;
```

```javascript

declare enum Directions {
    Up,
    Down,
    Left,
    Right
}

let directions = [Directions.Up, Directions.Down, Directions.Left, Directions.Right];
```

如上所述使用外部枚举时，表示当前环境中已经存在了该枚举对象，但这个对象可能存在于其它任意的地方，只是你能向 tx 确认它一定是已经声明的。

## 对象类型(续) <font color=red>object type</font>

### 接口 <font color=red>Interfaces</font>

#### 什么是接口

在 TypeScript 中，我们使用接口（Interfaces）来对对象内部的值做统一的类型声明。

在其它的面向对象语言中，接口（Interfaces）是一个很重要的概念，它是对行为的抽象，而具体如何行动需要由类（classes）去实现（implement）。而 TypeScript 中的接口是一个非常灵活的概念，除了可用于对类的一部分行为进行抽象以外，也常用于对「对象的形状（Shape）」进行描述。什么是对象的形状呢？简单举个例子：

```javascript
interface Person {
  name: string;
  age: number;
}

let tom: Person = {
  name: 'Tom',
  age: 25,
};
```

刚才的例子中，我们定义了一个接口 Person，接着定义了一个变量 tom，它的类型是 Person。这样，我们就约束了 tom 的形状必须和接口 Person 一致。

接口名一般首字母大写。

要注意的是，定义的变量比接口少了一些属性是不允许的，多余的属性也是不允许的。**赋值的时候，变量的形状必须与接口的形状一致！**

#### 可选属性

上面说到了，一旦给变量指定接口形状后，就必须与这个接口一致，我们将这些属性称之为必填属性。那有的时候我们的确需要一些可选属性，怎么解决呢？

大家应该都学过正则，还记得正则中有一个符号代表着可以包含零个或一个匹配内容的吗？

```javascript
interface Person {
  name: string;
  age?: number;
}

let tom: Person = {
  name: 'Tom',
  age: 25,
};
```

#### 其它属性

有了可选属性以后，我们还需要知道怎么定义一个任意属性。正常来说，调用者传入的属性会比我们函数中需要的属性多得多，如果，没有任意属性的话，我们就需要在接口中对调用者可能传入的所有属性进行类型声明，这无疑是一件非常痛苦的事情。所以，就有了任意属性的定义，如下所示：

```javascript
interface Person {
  name: string;
  age?: number;
  [propName: string]: string;
}

let tom: Person = {
  name: 'Tom',
  gender: 'male',
};
```

需要注意的是，一旦定义了任意属性，那么确定属性和可选属性的类型都必须是它的类型的子集：

```javascript
interface Person {
  name: string;
  age?: number;
  [propName: string]: string | number;
}

let tom: Person = {
  name: 'Tom',
  gender: 'male',
};
```

正常的情况下，我们对于其它属性都默认为 any 类型。

#### 只读属性

有时候我们希望对象中的一些字段只能在创建的时候被赋值，那么可以用 readonly 定义只读属性：

#### 接口的继承

#### 类型断言

类型断言（Type Assertion）可以用来手动指定一个值的类型。

在 tsx 语法（React 的 jsx 语法的 ts 版）中必须使用前者，即 值 as 类型。

形如 <Foo> 的语法在 tsx 中表示的是一个 ReactNode，在 ts 中除了表示类型断言之外，也可能是表示一个泛型。

故建议大家在使用类型断言时，统一使用 值 as 类型 这样的语法

类型断言主要用于缩小类型范围，之前学过的联合类型，unknown 等都可以使用类型断言。之前提到过，当 TypeScript 不确定一个联合类型的变量到底是哪个类型的时候，我们只能访问此联合类型的所有类型中共有的属性或方法：

```javascript
interface Cat {
  name: string;
  run(): void;
}
interface Fish {
  name: string;
  swim(): void;
}

function getName(animal: Cat | Fish) {
  return animal.name;
}
```

但很多时候，我们确实需要在还不确定类型的时候就访问其中一个类型特有的属性或方法，比如：

```javascript
interface Cat {
  name: string;
  run(): void;
}
interface Fish {
  name: string;
  swim(): void;
}

function isFish(animal: Cat | Fish) {
  if (typeof animal.swim === 'function') {
    return true;
  }
  return false;
}
// 类型“Cat | Fish”上不存在属性“swim”。
// 类型“Cat”上不存在属性“swim”
```

这个时候我们就可以使用类型断言，将 animal 断言成 fish:

```javascript
interface Cat {
    name: string;
    run(): void;
}
interface Fish {
    name: string;
    swim(): void;
}

function isFish(animal: Cat | Fish) {
    if (typeof (animal as Fish).swim === 'function') {
        return true;
    }
    return false;
}
```

需要注意的是，类型断言只能够「欺骗」TypeScript 编译器，无法避免运行时的错误，反而滥用类型断言可能会导致运行时错误。

联合类型可以被断言为其中一个类型
父类可以被断言为子类
任何类型都可以被断言为 any
any 可以被断言为任何类型
