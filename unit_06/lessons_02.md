> 企业框架实战\_第一部分\_TypeScript 入门

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
