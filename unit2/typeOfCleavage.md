> 平安蜀黍的前端教程 > 第二单元 TypeScript 基础学习 > 类型声明与 TS 的原始类型

## 类型声明

TypeScript 与 ECMAScript 代码最大的区别就是，在 TypeScript 代码中为变量添加了类型声明。

### 类型注释(显式声明)

类型声明，意思就是在声明一个变量的同时约束它的类型，有的人也称之为类型注释，这是一种明确告诉阅读者变量类型的方式：

```typescript
let x: number;
```

如上面的例子，变量“x”后面使用了英文符号“:”，然后声明了它的类型为“number”。

类型声明的语法就是在标识符后面添加“冒号 + 类型名称”，在函数中也是这样来声明参数和返回值的类型：

```typescript
function greet(person: string, date: Date): string {
  return `Hello ${person}, today is ${date}`;
}

greet('TypeScript', new Date());
```

如上面的例子，greet 方法的参数 person 的类型就是 string，而它的返回值类型也是一个 string。

要注意的是，变量的值必须要与声明的类型一致，否则 TypeScript 会报错：

```typescript
let x: number;
x = 'Hello TypeScript'; // 不能将类型“string”分配给类型“number”
```

### 类型推断(隐式声明)

显式的类型声明在阅读时非常容易理解，有助于在开发过程中找到错误。但是在代码库较为简单的情况下，它需要更多的代码操作，并且看起来有些多余。所以，在 TypeScript 中显式的类型声明不是必须的，如果我们没有声明，TypeScript 会自己推断类型：

```typescript
let x = 12345;
x = 'Hello TypeScript'; // 不能将类型“string”分配给类型“number”
```

如上面的例子，我们没有为变量 x 声明类型，但在后面的赋值操作中 TypeScript 仍然给出了错误提示。

注意：虽然 TypeScript 允许不显式声明类型，而且隐式的类型推断有效地**减少了代码的冗长性**，使我们的代码更为简洁，但是，在一些较大的项目中，代码的可读性就变得复杂了起来。所以，我们要养成习惯，在代码中要尽量做到**显式声明每一个变量的类型**，以方便其它同事对代码进行维护。

了解了如何声明类型后，我们就可以开始学习 TypeScript 的类型系统了。

## TypeScript 类型系统

TypeScript 在 ECMAScript 类型基础之上定义了一套属于自己的类型系统，除了我们在 ECMAScript 中所熟知的 **字符串(string)**、**数字(number)**、**布尔(boolean)**、**对象(object)**、**空(null)**、**未定义(undefined)**，以及从 ES2015 版新增的 **唯一(symbol)**、ES2020 版新增的 **大整数(bigint)** 这 8 种 **基本类型** 之外，它还将 **数组(array)** 从 **对象(object)** 中独立了出来，同时新增了 **元组(tuple)**、**枚举(enum)**，以及 **任意类型(any)**、类似于 any 的用于缩小类型范围的 **unknown**、用于声明函数没有返回值的 **void**、永不存在的 **never** 等类型。

## 原始类型

我们先看看什么是原始类型：**原始数据类型是指不是对象并且没有任何与其关联的方法的类型**。在 TypeScript 中，所有的**原始类型都是不可变的，这意味着它们的值一旦分配就无法更改**。

### boolean

```typescript
let x: boolean = true;
let y: boolean = false;
// 或者使用类型推论
let x = true;
```

### string

```typescript
let x: string = 'Hello TypeScript';
let y: string = `Hello ${}`;
// 或者使用类型推论
let z = 'Hello World';
```

### number

```typescript
let x: number = 12345;
let y: number = 3.14;
// 或者使用类型推论
let z = 0xff;
```

### bigint

```typescript
let x: bigint = 123n;
// 或者使用类型推论
let y = 0xffn;
```

需要注意的是，bigint 与 number 是不兼容的：

```typescript
let x: bigint = 123; // 不能将类型“number”分配给“bigint”
let y: number = 123n; // 不能将类型“bigint”分配给“number”
```

另外，因为 bigint 是 ES2020 之后才有，所以当我们的 tsconfig.json 中 target 属性低于 2020 时，也是不能使用 bigint 的

```typescript
let x: bigint = 123n; // 目标低于ES2020时，BigInt字面量不可用。
```

### symbol

Symbol 这个类型，它是在 ES2015 中新引入的，说实话我们的日常编程工作中用得不多，所以我们暂时不需要对它了解太多

```typescript
let x: symbol = Symbol('x'); // 创建一个symbol实例给变量x赋值
let y: symbol = Symbol('y');
let z: symbol = Symbol('x'); // 所有的symbol类型的值必须是一个symbol的实例

console.log(y === z); // false，每一个symbol都是独一无二的
```

## 特殊类型 null 与 undefined

在 TypeScript 中这是两种比较特殊的类型：

```typescript
let x = undefined; // undefined 表示这个值存在但还未来得及定义它
let y = null; // null 表示这个值为空或不存在
// 上面使用的是类型推论的方式来声明x和y的值的类型，我们也可以显示声明
let x: undefined = undefined;
let y: null = null;
```

从上面的例子中我们可以看到，它们既可以放在赋值语句的左边作为一个类型来使用，也可以放在赋值语名的右边作为一个值来使用。我们再来看另一个例子：

```typescript
let x: number;
x = 22; // 正确
x = null; // 报错 不能将类型“null”分配给类型“number”
x = undefined; // 报错 不能将类型“undefined”分配给类型“number”
```

### 严格空检查

在我们以往的编程习惯中，x 这个变量应该是可以重新赋值为“null”和“undefined”的，但为什么在 TypeScript 中不可以了呢？

这是因为在很多时候，如果我们允许将 null 或 undefined 赋值给类似于 x 这种已经声明了类型的变量，那么在后续的操作中可能会因为执行错误而导致程序崩溃：

```typescript
let x: number = 22;
x = null;
x.toFixed(2);
```

为了避免出现上面这种问题，tsconfig.json 中提供了 strictNullChecks 这个属性，当它的值为 true 的时候(默认值)，TSC 会对值是否为 null 或 undefined 进行强制性的严格检查，启用这个选项后，只有在变量和参数显式声明了为“null|undefined”时才可以赋值为 null 或 undefined。所以我们在没有对 strictNullChecks 进行配置的情况下是无法对已经声明为其它类型的变量赋值为 null 或 undefined 的。

## 包装对象类型

包装对象的概念来自于 ECMAScript，指的是 string、number 与 boolean 这三种原始类型的值在一定的条件下会自动转换为对象，这种我们就称之为原始类型的**包装对象(wrapper object)**。

```typescript
let x: string = 'hello';
x.charAt(1); // 正确
```

上面的示例中，变量 a 是一个字符串，我们直接调用了它的 charAt 方法。但是，在 ECMAScript 中，只有对象才有方法，原始类型的值本身是没有方法的。这行代码之所以能运行，就是因为在调用方法时，字符串会自动转换成一个包装对象，charAt()方法其实是定义在它的包装对象上。

```typescript
let x = new String('hello');
typeof x; // object
x.charAt(2);
```

上面的示例中，x 就是 hello 的包装对象，typeof 运算符返回的是 object 而不是 string，但它的本质上还是字符串，所以可以使用所有的字符串方法。

要注意的是，String()只有当作构造函数使用时(前面带有 new 命令)，才会返回包装对象，否则返回普通字符串：

```typescript
typeof new String('hello'); // object
typeof String('hello'); // string
```

### 包装对象类型与字面量类型

由于包装对象的存在，导致每一个原始类型的值都有包装对象和字面量两种情况。为了区分这两种情况，TypeScript 对五种原始类型分别提供了大写和小写两种类型：

- Boolean 与 boolean
- String 与 string
- Number 与 number
- Bigint 与 bigint
- Symbol 与 symbol

```typescript
let x: String = 'hello'; // 正确
let y: String = new String('hello'); // 正确

let a: string = 'hello'; // 正确
let b: string = new String('hello'); // 不能将类型"String"分配给类型"string"，"string"是基元，而"String"是包装对象。
```

上面的示例中，String 类型可以赋值为字符串的字面量，也可以赋值为包装对象。但是，string 类型只能赋值字面量而不能赋值包装对象。所以，我们在正常的开发过程当中，我们要使用小写的字面量类型，不使用大写的包装对象类型，以避免出现一些意外的错误。

## 值类型

在 TypeScript 中还有一种特殊类型，它规定，单个值也可以是一个类型，我们称之为“值类型”：

```typescript
let x: 'hello';
x = 'hello'; // 正确
x = 'world'; // 不能将类型"world"分配给类型"hello"
```

上面示例中，变量 x 的类型是字符串值"hello"，导致它只能赋值为这个字符串，赋给它任意其它字符串都会报错。

## 联合类型 union types

联合类型指的是多个类型组成的一个新类型，使用符号|来表示：

```typescript
let x: string | number;

x = 123; // 正确
x = 'hello'; // 正确
x = true; // 不能将类型"boolean"分配给类型"string | number"
```

上面的示例中，变量 x 就是联合类型 string|number，表示它的值既可以是字符串也可以是数字，但也仅限于这两种类型，如果我们给它赋予其它类型的值也是会报错的，比如 x = true

联合类型最常用于与值类型相结合，表示一个变量的值有若干种可能性

```typescript
let gender: 'male' | 'female';
let rainbowColor: '赤' | '橙' | '黄' | '绿' | '青' | '蓝' | '紫';
```

前面在讲 strictNullChecks 时有提到，当我们开启严格空检查后，其它类型的变量就不能被赋值为 null 或 undefined 了，这时，如果我们确认某个变量里是存在空值的，就可以使用联合类型的方式来声明：

```typescript
let gender: string | undefined;

gender = 'male';
gender = undefined;
```

### 父子类型

TypeScript 中的类型存在着兼容关系，某些类型可以兼容其它类型：

```typescript
type T = number | string;

let x: number = 123;
let y: T = x;
```

上面的示例中，变量 x 和 y 的类型是不一样的，但是变量 x 赋值给变量 y 并不会报错。这时，我们就可以认为，y 的类型兼容 x 的类型。

在 TypeScript 中为这种情况定义了一个专门的术语，如果类型 A 的值可以赋值给类型 B，那么类型 A 就被称为类型 B 的子类型(subtype)。从上面的例子中可以看出，类型 number 就是类型 number|string 的子类型。

要注意的是，在 TypeScript 中，凡时可以使用父类型的地方都可以使用子类型，但反过来是不行的：

```typescript
let x: 'hello' = 'hello';
let y: string = 'hello';

y = x; // 正确，因为值类型'hello'是string类型的子类型
a = b; // 不能将类型"string"分配给类型"hello"。
```

如上例所示，子类型的值可以赋给父类型的变量，而将父类型的值赋给子类型的变量时就会报错。之所以会这样，是因为子类型继承了父类型的所有特征，所以可以正确地应用于父类型的场合。但是子类型可能还会有一些父类型所没有的特征，所以，父类型不能用在子类型的场合。

## 交叉类型 intersection types

交叉类型指的是多个类型组成的一个新类型，使用符号"&"表示。

交叉类型 A&B 表示，给这个变量赋的值必须同时属于 A 和 B，同时满足 A 和 B 的特征才可以正确赋值。

```typescript
let obj: { foo: string } & { bar: string };

obj = {
  foo: 'hello',
  bar: 'world',
};
```

如上例所示，变量 obj 同时具有属性 foo 和属性 bar。
