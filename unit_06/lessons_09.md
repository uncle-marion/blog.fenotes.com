> 企业框架实战\_第一部分\_TypeScript 入门

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
