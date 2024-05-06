> Marion 的 react 实战课程 > 第九部分 > TypeScript 必会知识

#### 函数 <font color=red>Function</font>

在 JavaScript 中，有两种常见的定义函数的方式——函数声明（Function Declaration）和函数表达式（Function Expression）:

```javascript
// 函数声明
function calcSum(x, y) {
  return x + y;
}

// 函数表达式
let calcSum = function (x, y) {
  return x + y;
};
```

#### 函数声明

正常情况下，一个函数有输入和输出，要在 TypeScript 中对其进行约束，需要把输入和输出都考虑到。

其中函数声明的类型约束比较简单。如下所示：

```javascript
function calcSum(x: number, y: number): number {
  return x + y;
}
```

但需要注意的是，在函数中规定了入参的类型和个数后，调用时就必须按照函数的要求来传参，否则都会导致错误：

```javascript
function calcSum(x: number, y: number): number {
  return x + y;
}
calcSum(2, 3); // 5
calcSum('2', '3'); // 类型“string”的参数不能赋给类型“number”的参数
calcSum(3); // 应有 2 个参数，但获得 1 个
calcSum(3, 4, 5); // 应有 2 个参数，但获得 3 个
```

#### 函数表达式

学会了函数声明的类型约束后，如果要你们现在写一个对函数表达式的定义，可能会写成这样：

```javascript
let calcSum = function (x: number, y: number): number {
  return x + y;
};
```

这样也没错，是可以通过编译的，不过事实上，这个代码只对等号右侧的匿名函数进行了类型定义，而等号左边的 clacSum，是通过赋值操作进行类型推论而推断出来的。如果需要我们手动给 calcSum 添加类型，则应该是这样:

```javascript
let calcSum: (x: number, y: number) => number = function (x, y) {
  return x + y;
};
```

#### 用接口来声明一个函数

采用函数表达式|接口定义函数的方式时，对等号左侧进行类型限制，可以保证以后对函数名赋值时保证参数个数、参数类型、返回值类型不变。

```javascript
interface CalcSum {
  (x: number, y: number): number;
}

let calcSum: CalcSum = function (x, y) {
  return x === y;
};
// 不能将类型“(x: number, y: number) => boolean”分配给类型“CalcSum”。
// 不能将类型“boolean”分配给类型“number”;

let calc: CalcSum = function (x, y) {
  return x + y;
};
```

#### 可选参数

前面提到了，输入多余（或少于要求的）参数，是不允许的。那么如何定义可选参数呢？与接口中的可选属性类似，我们用 ? 表示可选的参数。

但需要注意的是，可选参数必须接在必填参数的后面。换句话说，可选参数后面不允许再出现必填参数了：

#### 剩余参数

与可选参数一样，args 参数也只能是最后一个参数。

#### 函数重载

函数重载（overload）在传统的静态类型语言中是很常见的。JavaScript 作为动态语言， 是没有重载这一说的。一是它的参数没有类型的区分，二是对参数个数也没有检查。虽然语言层面无法自动进行重载，但借助其动态的特性，我们可以在代码中手动检查入参的类型，或者通过 arguments 获取到参数个数，从而实现根据不同的入参做不同的操作。

比如，我们需要实现一个函数 reverse，输入数字 12345 的时候，输出反转的数字 54321，输入字符串 'hello' 的时候，输出反转的字符串 'olleh'。

利用联合类型，我们可以这么实现：

```javascript
function reverse(x: number | string): number | string {
  if (typeof x === 'number') {
    return Number(x.toString().split('').reverse().join(''));
  } else if (typeof x === 'string') {
    return x.split('').reverse().join('');
  }
}
```

然而这样有一个缺点，就是不能够精确的表达，输入为数字的时候，输出也应该为数字，输入为字符串的时候，输出也应该为字符串。
怎么说呢？这样做一是类型书写上比较丑陋，二是没有发挥出 TypeScript 类型检查的优势。这里我们是可以根据入参的类型明确知道返回的类型的，输入为数字的时候，输出也应该为数字，输入为字符串的时候，输出也应该为字符串。而现调用方法后得到的类型太过宽泛，这跟使用 any 做为返回没有太大区别。最关键的是，我们无法对返回结果直接操作，必须进行类型转换后才能继续：

```javascript
const result = reverse('hello');
console.log(result.length);

const result1 = reverse(12345);
console.log(result1 > 12345);
```

这时，我们可以使用重载定义多个 reverse 的函数类型：

```javascript
function reverse(x: number): number;
function reverse(x: string): string;
function reverse(x: number | string): number | string {
    if (typeof x === 'number') {
        return Number(x.toString().split('').reverse().join(''));
    } else if (typeof x === 'string') {
        return x.split('').reverse().join('');
    }
}
```

这样，我们在调用时可以很清楚地看到可能返回的结果，关键的是，我们可以直接对返回结果做进一步操作。

要注意的是，注意，TypeScript 会优先从最前面的函数定义开始匹配，所以多个函数定义如果有包含关系，需要优先把精确的定义写在前面。

// 反例类型错误，等待后续调通

比如有一个获取聊天消息的方法，根据传入的参数从数组中查找数据。如果入参为数字，则认为是 id，然后从数据源中找对应 id 的数据并返回，否则当成类型，返回这一类型的消息。

```javascript
function getMessage(query) {
  if (typeof query === 'nunber') {
    return data.find(message => message.id === query);
  } else {
    return data.filter(message => message.type === query);
  }
}
```

TypeScript 中，假如我们的消息数据为以下结构：

```javascript
const data = [
  {
    id: 0,
    type: 'string',
    content: 'hello',
  },
  {
    id: 1,
    type: 'image',
    content: 'url_for_iamge',
  },
  {
    id: 2,
    type: 'string',
    content: 'world',
  },
];
type MessageType = 'string' | 'image' | 'audio';
type Message = {
  id: number,
  type: MessageType,
  content: string,
};
```

这样的话，你可能以为结合前面学过的联合类型，像下面这样写就能用：

```javascript
function getMessage(
  query: number | MessageType
): Message[] | Message | undefined {
  if (typeof query === 'number') {
    return data.find(message => message.id === query);
  } else {
    return data.filter(message => message.type === query);
  }
}
```

```javascript
function getMessage(id: number): Message | undefined;
function getMessage(type: MessageType): Message[];
function getMessage(query: any): any {
  if (typeof query === "number") {
    return data.find(message => message.id === query);
  } else {
    return data.filter(message => message.type === query);
  }
}

console.log(getMessage(2));
console.log(getMessage('string'));
```

### 类

传统方法中，JavaScript 通过构造函数实现类的概念，通过原型链来实现继承，但它仍然缺少一些高级语言中类的方法，比如抽象，比如修饰符等等。

#### 类的访问修饰符

学习什么是类之前，我们需先熟悉类的修饰符，TypeScript 中类的修饰符有三种：
第一种是默认修饰符：public，意义指向是公用，用 public 声明的属性和方法在任何地方都可以被访问到。TypeScript 中默认的修饰符就是 public,无论你是否声明了它。

第二种是完全私有修饰符：private，它是一个完全私有的，用它声明的属性和方法只能在声明它的类的内部使用，其它地方都不可访问。

第三种是受保护的修饰符：protected，它介于 public 与 private 之间，仅在声明它的类和子类中允许访问。

```javascript

// 抽象类
abstract class Animal {
  // 受保护的属性：子类可见
  protected name: string;
  // 私用属性：只有类内部可见
  private age: number;
  constructor(name: string, age?: number) {
    this.name = name;
    if (age) {
      this.age = age;
    }
  }
  // 抽象方法
  abstract sayHello(msg: string): void
}
// Animal的子类
class Cat extends Animal {
  // 公用属性：所有的地方都可以访问
  public sayHello(msg: string): void {
    console.log(`Hello, ${this.name}! ${msg}`);
  }
}
// 实例化一个Cat类
let Tom = new Cat('Tom');
Tom.sayHello('have you eaten?');

```

#### 什么是类

虽然 JavaScript 中有类的概念，但是可能大多数 JavaScript 程序员并不是非常熟悉类。类，可以简单地解释成，类就是对象的模板，所有的对象都可以通过对类的实例化来生成。

- 类（Class）：定义了一件事物的抽象特点，包含它的属性和方法
- 对象（Object）：类的实例，通过 new 生成
- 面向对象（OOP）的三大特性：封装、继承、多态
- 封装（Encapsulation）：将对数据的操作细节隐藏起来，只暴露对外的接口。外界调用端不需要（也不可能）知道细节，就能通过对外提供的接口来访问该对象，同时也保证了外界无法任意更改对象内部的数据
- 继承（Inheritance）：子类继承父类，子类除了拥有父类的所有特性外，还有一些更具体的特性
- 多态（Polymorphism）：由继承而产生了相关的不同的类，对同一个方法可以有不同的响应。比如 Cat 和 Dog 都继承自 Animal，但是分别实现了自己的 eat 方法。此时针对某一个实例，我们无需了解它是 Cat 还是 Dog，就可以直接调用 eat 方法，程序会自动判断出来应该如何执行 eat
- 存取器（getter & setter）：用以改变属性的读取和赋值行为
- 修饰符（Modifiers）：修饰符是一些关键字，用于限定成员或类型的性质。比如 public 表示公有属性或方法
- 抽象类（Abstract Class）：抽象类是供其他类继承的基类，抽象类不允许被实例化。抽象类中的抽象方法必须在子类中被实现
- 接口（Interfaces）：不同类之间公有的属性或方法，可以抽象成一个接口。接口可以被类实现（implements）。一个类只能继承自另一个类，但是可以实现多个接口

#### 什么是抽象类

抽象类，这是 TypeScript 中模仿其它高级语言增加的一个新概念，定义抽象类的意义在于：必须被子类继承，是半成品，用于衍生出子类，把子类中公共的部分提取出来，封装在顶部，易于维护或扩展。抽象类是提供给其他类继承的基类，抽象类本身不允许被实例化。抽象类中的抽象方法必须在子类中被实现。
抽象类的关键字是 abstract。

#### 类与对象的区别

类是对某一类事物的描述，是抽象的；而对象是一个实实在在的个体，是类的一个实例。比如：“动物”是一个类，而“猫”则是“动物”的一个实例。

类的属性与方法是共享的，一个实例能访问它所属类的公共方法和属性；而对象中的方法与属性属于单个对象，除共享了所在类中的方法与属性外，不同对象还会有不同的方法与属性。

#### 类的构造函数

构造函数作为类的核心内容，是每个类实例化对象时 new 指令直接调用的方法，实际上 TypeScript 与 ES6 在这方面并没有差别，如果了解 ES6 的话我们都知道 class 只是一个语法糖，它的底层实现还是 function，类中的构造函数就是 ES5 的方法主体，它最终被赋给该方法原型上的 constructor 属性，而类中实现的一系列的修饰符和特性最后都会被解析为类自身或者原型上的属性和方法，用来配合主体方法实现对象实例的构造。

#### 在类中定义属性与方法

#### 类的静态属性

关于静态属性与静态方法，这个是在 ES7 中被提出来的，TypeScript 实现了它们。我们可以使用 static 修饰符来声明它们，使得它们无须实例化就可以被调用，同时，实例化对象就再也无法访问到它们了：

为什么要定义静态属性或方法呢？其实就像 const 一样，静态属性与方法仅在声明类时进行赋值，而后再也没有谁可以改变它，保持了它的纯洁性。无论何时调用它，给你的值都是固定的。

#### 类的只读属性

在 TypeScript 中，还实现了类的只读属性，类的只读属性只允许在被实例化时进行赋值，

#### 类的继承

#### 类的类型声明

类的类型声明与接口类似，将类本身的名字做为类型声明即可，但要注意的是，实例化对象声明的类型其内部所对应的属性与方法只能是被声明的这个类中的属性与方法。

#### 泛型 <font color=red>Generics</font>

泛型（Generics）是指在定义函数、接口或类的时候，对它们的参数不预先指定具体的类型，而在使用的时候再指定类型的一种特性。

在 TypeScript 中，泛型的实现使我们能够创建可重用的组件，一个组件可以支持多种类型的数据，为代码添加额外的抽象层和可重用性。这种组件不只能被一种类型使用，而是能被多种类型复用。类似于参数的作用，泛型是一种用以增强类（classes）、类型（types）和接口（interfaces）能力的非常可靠的手段。这样，我们开发者，就可以轻松地将那些可复用的代码组件，适用于各种输入。这里，大家可能以为用 any 也能达到这个需求，但我们之前说过，TypeScript 中不建议使用 any 类型，原因比较多，类型的丢失导致静态检查失效是主要原因。但其中还有一个原因，就是调试时缺乏完整的信息。而我们选择 VS Code 作为开发工具的一个最大的理由，就是它带来的基于这些信息的类型侦测。

#### 泛型的实现

假如我们需要一个函数，他的作用是我们传给它什么，它就返回给我们什么。先不讨论这个函数有什么用处，我们只考虑实现：

```javascript
function identity(arg: number): number {
  return arg;
}
```

如上所示，我们实现给一个 number 返回 number 的方法，但我们还要写更多的同样代码来实现 string,boolean 等等，这就造成了代码大量的冗余，也不好看，体现不出我们的逼格。

那么，我们是不是可以使用 any 呢？像下面的例子一样，我们可实现给什么就返回什么。

```javascript
function identity(arg: any): any {
  return arg;
}

console.log(identity(4).length);
```

这时候问题就来了，any 逃避了类型检查，调用者在调用这个函数的时候傻傻地传了一个数字类型的参数，然后又去调用这个返回的值的 length 属性，会出现什么情况呢？

官网文档中给出了一个解决方案<T>；我们先简单地认为这个'<' + T + '>'，就代表我们今天要理解的泛型，<T>帮助我们捕获调用者传入的类型（比如：number），之后我们就可以使用这个类型。然后我们再次使用了 <T> 当做返回值类型。现在我们可以知道参数类型与返回值类型是相同的了。这允许我们跟踪函数里使用的类型的信息。

```javascript
// 这个泛型的定义是，我传给你什么你就返回给我什么
function identity<T>(arg: T): T {
  return arg;
}
```

#### 为什么要用泛型

假如，我们需要实现一个采集类，这个采集类里存储着一个集合。有方法向该集合里添加东西，也有方法通过索引获取集合里的东西。像这样:

```javascript
class Collection {
  private objs: string[];
  constructor() {
    this.objs = [];
  }
  add(someObj: string) {
    this.objs.push(someObj);
  }
  get(index: number): string {
    return this.objs[index];
  }
}
let collection = new Collection();
collection.add("hello");
collection.add("world");
console.log(collection.get(0).length);
```

我们可以很容易地看明白，这个数组是一个什么样的数组啊？对，它被显式定义为一个 string 类型的集合，很明显，我们是不能在其中使用 number 的。如果想要处理 number 的话，可以创建一个接受 number 而不是 string 的集合？也许这是一个不错的选择，但有一个很大的缺点——代码重复。代码重复，最终会导致编写和调试代码的时间增多，并且降低内存的使用效率。

另一个选择，是使用 any 类型代替 string 类型定义刚才的类，像下面这样：

```javascript
class Collection {
  private objs: any[];
  constructor() {
    this.objs = [];
  }
  add(someObj: any) {
    this.objs.push(someObj);
  }
  get(index: number): any {
    return this.objs[index];
  }
}
let collection = new Collection();
collection.add("hello");
collection.add("world");
console.log(collection.get(0).length);
```

字符串"hello"有五个字符，运行 TypeScript 代码，你可以在调试模式下看到它。

注意看，当我们的鼠标悬停在 length 属性上时，VS Code 的类型侦测没有提供任何信息，因为它不知道你选择使用的确切类型。当你像下面这样，把其中一个添加的元素修改为其他类型时，比如 number，这种不能被类型侦测到的情况会体现得更加明显：

```javascript
class Collection {
  private objs: any[];
  constructor() {
    this.objs = [];
  }
  add(someObj: any) {
    this.objs.push(someObj);
  }
  get(index: number): any {
    return this.objs[index];
  }
}
let collections_a = new Collection();
let collections_b = new Collection();
collections_b.add("world");
console.log(collections_b.get(0).length);
collections_a.add(1);
console.log(collections_a.get(0).length);
```

运行调试工具，我们只打印出了一个 undefined 的结果，但为什么是 undefined，我们不是很清楚是不是？这个时候，我们就可以用泛型来解决这个问题：

```javascript
class Collection<T> {
  private objs: T[];
  constructor() {
    this.objs = [];
  }
  add(someObj: T) {
    this.objs.push(someObj);
  }
  get(index: number): T {
    return this.objs[index];
  }
}
// 要求调用我们这个类的时候必须传入一个类型声明
let collections_a = new Collection<string>();
let collections_b = new Collection<number>();
collections_a.add("world");
console.log(collections_a.get(0).length);
console.log(collections_a.get(0).toFixed(2));
// 属性“toFixed”在类型“string”上不存在。你是否指的是“fixed”?ts(2551)
// lib.es2015.core.d.ts(472, 5): 在此处声明了 "fixed"。
collections_b.add(1);
console.log(collections_b.get(0).length);
// 类型“number”上不存在属性“length”。ts(2339)
console.log(collections_b.get(0).toFixed(2));
```

一使用这个泛型，我们就发现，数字型元素在获取其返回值的长度属性的时候就正常报错了。

#### 泛型变量（跳过不讲）

使用泛型创建像 identity 这样的泛型函数时，编译器要求你在函数体必须正确的使用这个通用的类型。 换句话说，你必须把这些参数当做是任意或所有类型。

那我们仍然用代码来说话，还是刚才官网的那个例子：

```javascript
function identity<T>(arg: T): T {
  return arg;
}
```

如果我们想在 identity 这个泛型函数中同时打印出 arg 的长度时，怎么办？你也许会想这样：

```javascript
function loggingIdentity<T>(arg: T): T {
  console.log(arg.length);
  return arg;
}
```

但你发现它会报错，因为这个一个任意类型的变量，tsc 不确认它是否有 length 这个属性。官网在这个时候好像也没办法圆过去了，索性直接让我们将这个函数从接受一个任意类型的变量变成了只接受一个数组类型的变量，试图让我们理解，<T>就是所谓的泛型变量。

```javascript
function loggingIdentity<T>(arg: Array<T>): Array<T> {
  console.log(arg.length);
  return arg;
}
```

#### 泛型函数的类型声明

泛型函数的类型与非泛型函数的类型没什么不同，只是有一个类型参数在最前面，像函数声明一样：

```javascript
function identity<T>(arg: T): T {
  return arg;
}
let myIdentity: <T>(arg: T) => T = identity;
// 我们也可以使用不同的泛型参数名，只要在数量上和使用方式上能对应上就可以。
let youIdentity: <U>(arg: U) => U = identity;
```

#### 泛型接口

我们也可以通过接口来声明一个泛型函数的模样

```javascript
interface IdentityMethod {
  <T>(arg: T): T;
}

let myIdentity: IdentityMethod = function identity(arg) {
  return arg;
};

let IdCode = myIdentity(345);
let name = myIdentity('Tom');

console.log(name.toString());
console.log(IdCode.toFixed(2));
```

#### 泛型类

泛型类在刚才讲解为什么要学习泛型时已经完整地捋过一遍了，我们这里就不再赘述了，如果还有哪位同学觉得我这边没太讲明白，可以在自习的时候单独找我。

```javascript
class Collection<T> {
  private objs: T[];
  constructor() {
    this.objs = [];
  }
  add(someObj: T) {
    this.objs.push(someObj);
  }
  get(index: number): T {
    return this.objs[index];
  }
}
// 要求调用我们这个类的时候必须传入一个类型声明
let collections_a = new Collection<string>();
let collections_b = new Collection<number>();
collections_a.add("world");
console.log(collections_a.get(0).length);
console.log(collections_a.get(0).toFixed(2));
// 属性“toFixed”在类型“string”上不存在。你是否指的是“fixed”?ts(2551)
// lib.es2015.core.d.ts(472, 5): 在此处声明了 "fixed"。
collections_b.add(1);
console.log(collections_b.get(0).length);
// 类型“number”上不存在属性“length”。ts(2339)
console.log(collections_b.get(0).toFixed(2));
```

#### 泛型约束

数组的约束
有时，我们可能希望对每个类型变量接受的类型或数量进行限制，这个时候，我们就需要用到泛型约束，比如，要在我们刚才一直在用的 identity 函数中先打印参数的长度。在不做约束的情况下，编译器会报一个错误：

```javascript
function identity<T>(arg: T): T {
  console.log(arg.length);
  return arg;
}
// 类型“T”上不存在属性“length”
```

因为在这种情况下，编译器确实不知道这个 T 类型是否有.length 属性，特别是在任何类型都可以分配给 T 的情况下，编译器会提取所有类型共有的属性和方法来当成是当前这个 T 类型的属性与方法。

这个时候我们就需要将类型变量扩展到一个包含所需要属性的接口。

```javascript
interface Length {
  length: number;
}

function identity<T extends Length>(arg: T): T {
  console.log(arg.length);
  return arg;
}
identity(3);
// 类型“number”的参数不能赋给类型“Length”的参数。
```

在尖括号内使用 extends 关键字加上我们要扩展的类型来约束这个 T。这段代码在本质上，是在告诉编译器，我们仅支持能获取 length 属性的类型。

当调用者使用不支持.length 类型的参数时，编译器会通知调用者，这个参数不能赋给类型 Length 的参数。

另外还有一种方式可以解决.length 的属性问题，那就是将泛型参数定义为一个显式的数组：

```javascript
function identity<T>(arg: T[]): T[] {
  console.log(arg.length);
  return arg;
}
//or
function identity<T>(arg: Array<T>): T {
  console.log(arg.length);
  return arg;
}
```

以上两种方法都可行，这样我们就可以让编译器知道函数的 arg 和返回类型都是数组类型。

对象的约束
了解了使用 length 对数组类型的泛型约束，我们再来学习一个对于对象的泛型约束： keyof，keyof 可以很方便地帮我们检查出传入的对象中是否有同时传入的属性名称：

```javascript
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

getProperty({a: 1, b: 2}, 'i');
// 类型“"i"”的参数不能赋给类型“"a" | "b"”的参数。x
```

第一个参数是我们获取值的对象，第二个参数是该值的属性。返回类型描述了与 T[K]的这种关系。这个泛型帮我们确认了某一个属性在对象中是否存在，这样运行时就会减少很多错误。

我们的泛型在这里所做的是确保对象的属性的存在，这样运行时就不会发生错误。这是一个类型安全的解决方案，而不是简单地调用 let value = obj[key];之类的东西。

判断两个对象是否有继承关系
我们还可以使用另一种方法来判断对象中是否存在指定的属性：

```javascript
function mergerObj<T extends U, U>(target: T, source: U): T {
  for (let key in source) {
    target[key] = (<T>source)[key];
  }
  return target;
}
let x = {a: 1, b: 2, c: 3, d: 4};
mergerObj(x, {a: 4, f: 2});
```

类的约束
我还可以约束泛型函数只接受一个由指定类构建的对象：

```javascript
class Programmer {
    // automatic constructor parameter assignment
    constructor(public fname: string,  public lname: string) {
    }
}

function logProgrammer<T extends Programmer>(prog: T): void {
    console.log(`${ prog.fname} ${prog.lname}` );
}
// 自动构造函数参数赋值，无需使用this.args = args就可以自动赋值。
const programmer = new Programmer("Ross", "Bulat");
logProgrammer(programmer); // > Ross Bulat
```

注意:这里的构造函数使用自动构造函数参数赋值，这是 TS 的一个特性，它直接从构造函数参数赋值类属性。

#### 在什么时候用泛型

可能在项目的早期，你没有一个保证使用泛型的组件。但是随着项目的增长，组件的功能经常会扩展。这种增加的可扩展性最终很可能遵循上述两个标准，在这种情况下，引入泛型将是比仅仅为了满足一系列数据类型而复制组件更干净的选择。

#### 什么是装饰器

装饰器是一种特殊类型的声明，它能够被附加到类声明，方法， 访问符，属性或参数上。 装饰器使用 @expression 这种形式，expression 求值后必须为一个函数，它会在运行时被调用，被装饰的声明信息做为参数传入。

通俗的理解可以认为就是在原有代码外层包装了一层处理逻辑。

装饰器在身边的例子随处可见，一个简单的例子

> 水龙头上边的起泡器就是一个装饰器，在装上以后就会把空气混入水流中，掺杂很多泡泡在水里。
> 但是起泡器安装与否对水龙头本身并没有什么影响，即使拆掉起泡器，也会照样工作，水龙头的作用在于对水流的控制，至于水中掺不掺杂气泡则不是水龙头需要关心的。

在 TypeScript 中装饰器还属于实验性语法，你必须在命令行或 tsconfig.json 里启用 experimentalDecorators 编译器选项。

#### 为什么要用装饰器

可能有些时候，我们会对传入参数的类型判断、对返回值的排序、过滤，对函数添加节流、防抖或其他的功能性代码，基于多个类的继承，各种各样的与函数逻辑本身无关的、重复性的代码。装饰器的实现让开发人员更加关注业务代码的开发，封装功能辅助性的代码。让开发人员把焦点放在业务上，实现焦点分离。

所以，对于装饰器，可以简单地理解为是非侵入式的行为修改。

需要注意的是：装饰器是一项实验性特性，在未来的版本中可能会发生改变！

#### 如何定义装饰器

装饰器本身其实就是一个函数，理论上忽略参数的话，任何函数都可以当做装饰器使用。

```javascript
function helloKitty(target: Function) {
  console.log('hello Tom!');
}

@helloKitty
class HelloKittyClass {}
```

#### 类装饰器

应用于类构造函数，其参数是类的构造函数。

```javascript
function addAge(args: number) {
  return function (target: Function) {
    target.prototype.age = args;
  };
}

@addAge(18)
class Hello {
  name: string;
  age: number;
  constructor() {
    this.name = 'yugo';
  }
}

let hello = new Hello();
console.log(hello.age);
```

#### 方法装饰器

它会被应用到方法的 属性描述符上，可以用来监视，修改或者替换方法定义。
方法装饰会在运行时传入下列 3 个参数：

1、对于静态成员来说是类的构造函数，对于实例成员是类的原型对象。
2、成员的名字。
3、成员的属性描述符{value: any, writable: boolean, enumerable: boolean, configurable: boolean}。

```javascript
function addAge(constructor: Function) {
  constructor.prototype.age = 18;
}
​
function method(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
   console.log(target);
   console.log("prop " + propertyKey);
   console.log("desc " + JSON.stringify(descriptor) + "\n\n");
};
​
@addAge
class Hello{
  name: string;
  age: number;
  constructor() {
    console.log('hello');
    this.name = 'yugo';
  }
​
  @method
  hello(){
    return 'instance method';
  }
​
  @method
  static shello(){
    return 'static method';
  }
}
```

#### 属性装饰器

```javascript
function log(target: any, propertyKey: string) {
    let value = target[propertyKey];
    // 用来替换的getter
    const getter = function () {
        console.log(`Getter for ${propertyKey} returned ${value}`);
        return value;
    }
    // 用来替换的setter
    const setter = function (newVal) {
        console.log(`Set ${propertyKey} to ${newVal}`);
        value = newVal;
    };
    // 替换属性，先删除原先的属性，再重新定义属性
    if (delete this[propertyKey]) {
        Object.defineProperty(target, propertyKey, {
            get: getter,
            set: setter,
            enumerable: true,
            configurable: true
        });
    }
}
class Calculator {
    @log
    public num: number;
    square() {
        return this.num * this.num;
    }
}
let cal = new Calculator();
cal.num = 2;
console.log(cal.square());
// Set num to 2
// Getter for num returned 2
// Getter for num returned 2
// 4
```
