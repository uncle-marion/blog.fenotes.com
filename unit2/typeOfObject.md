> 平安蜀黍的前端教程 > 第二单元 TypeScript 基础学习 > TypeScript 的对象类型

除了原始类型，对象类型是 JavaScript 最基本的数据结构。在 TypeScript 中，对象类型用于描述对象的形状。它们指定对象属性的名称和类型，以及这些属性是必需的还是可选的。

## 对象类型的声明

对象类型的最简单声明方法，就是使用大括号表示对象，在大括号内部声明每个属性和方法的类型：

```typescript
// 大多数情况下，我们声明一个对象后，只需要改变对象内部的值而不会改变对象本身，所以，尽量使用const来声明它
const tony: {
  name: string;
  age: number;
} = { name: 'Tony', age: 22 };
```

如上面的例子所示，对象 tony 的类型就写在变量名的后面，直接使用大括号来描述它，然后在内部声明每个属性的名称和类型。

我们在上面简单声明的 tony 对象很容易，但是，在我们的代码中常会出现多个对象使用同一种类型，难道每一次都需要重新声明吗？不是的，除了简单声明，我们还可以使用下面的方式来声明对象以方便类型的复用：

### 类型别名 type

type 命令用于定义一个类型的别名，这样可以让类型的名字变得更有意义，也能增加代码的可读性，还可以使复杂类型用起来更方便，便于以后修改变量的类型。

```typescript
type Person = {
  name: string;
  gender: string;
  age: number;
};
const tony: Person = {
  name: 'Tony',
  gender: 'male',
  age: 22,
};
const lucy: Person = {
  name: 'Lucy',
  gender: 'female',
  age: 18,
};
```

如上例所示，我们可以使用 type 命令来定义一个对象的类型 Person，然后定义了两个变量，这两个变量的类型都是 Person 类型的。

```typescript
const tony: Person = {
  // 类型"{ name:string;gender:string }"中缺少属性"age"，但类型"Person"中需要该属性。
  name: 'Tony',
  gender: 'male',
};

const lucy: Person = {
  name: 'Lucy',
  gender: 'female',
  age: 18,
  work: 'student', // 对象字面量只能指定已知属性，并且"work"不在类型"Person"中。
};

const adam: Person = {
  name: 'Adam',
  gender: 1, // 不能将类型"number"分配给类型"string"。
  age: 24,
};
```

如上例所示，我们一旦声明了某个变量为 Person 类型后，这个变量的值就必须与 Person 类型完全一致，不能增加或缺少属性，也不能修改属性的类型。

```typescript
console.log(tony.work); // 类型"Person"上不存在属性"work";
tony.work = 'ranger'; // 类型"Person"上不存在属性"work";

delete tony.name; // delete运算符的操作数必须是可选的
tony.name = 'Lucy';
```

如上例所示，我们无法读写声明的类型中不存在的属性，也无法删除已声明的类型中包含的属性，但可以修改它们的值，当然，必须要符合已声明的属性类型才行。

### 可选属性

在 TypeScript 中，如果需要删除一个对象中包含的属性，那么就必须先声明这个属性是一个可选属性：

```typescript
type Person = {
  name: string;
  gender: string;
  work?: string;
  age: number;
};
```

如上例所示，属性 work 就是一个可选属性，我们只需要在属性名后面，冒号的前面加上一个“?”就表示这个属性可以被忽略，我们可以在初始化变量时给它赋值，也可以忽略以后在其它位置给它赋值，当然也可以随时删除它：

```typescript
type Person = {
  name: string;
  gender: string;
  age: number;
  work?: string;
};
// 初始化时可以忽略
const tony: Person = {
  name: 'Tony',
  gender: 'male',
  age: 22,
};

// 通过某些操作后获取到对应的值后再进行赋值
console.log(tony.work);
tony.work = 'ranger';
// 赋值后也可以直接删除它
delete tony.work;

tony.work.toLowerCase(); // tony.work可能为"undefined"
```

要注意的是，在读取一个可选属性时可能会返回"undefined"而导致后续的一些操作报错，所以，在读取可选属性之前，必须检查一下该属性是否为 undefined：

```typescript
if (tony.work !== undefined) {
  tony.work.toLowerCase();
}
// 也可以这样写
tony.work !== undefined ?? tony.work.toLowerCase();
// 不可以这样写
tony.work ?? tony.work.toLowerCase(); // 类型"never"上不存在属性"toLowerCase"
```

### 只读属性

与 JavaScript 中一样，TypeScript 中的对象也可以声明只读属性，只要在属性名前加上 readonly 即可表明这个属性不可修改：

```typescript
type Person = {
  readonly name: string;
  gender: string;
  age: number;
  work?: string;
};
const tony: Person = {
  name: 'Tony',
  gender: 'male',
  age: 22,
};
tony.name = 'Lucy'; // 无法为"name"赋值，因为它是只读属性。
```

只读属性只能在对象初始化时赋值，以后就不能再修改这个属性。但是当这个属性的值是一个对象时，我们可以修改对象中属性的值，但无法修改对象本身：

```typescript
type Person = {
  readonly name: string;
  gender: string;
  age: number;
  readonly family: {
    father: string;
    mather: string;
  };
  work?: string;
};
const tony: Person = {
  name: 'Tony',
  gender: 'male',
  age: 22,
  family: {
    father: 'Tom',
    mather: 'Asia',
  },
};
tony.family.father = 'Jerry'; // 正确
tony.family = {
  // 无法为tony.family赋值，因为它是只读属性
  father: 'Tom',
  mather: 'Asia',
};
```

需要注意的是，当两个变量指向同一个对象，其中一个变量是只读，但另一个变量是可写的，那么通过修改可写属性一样可以改变只读变量：

```typescript
type Person = {
  readonly name: string;
  readonly age: number;
};

const tony: {
  name: string;
  age: number;
} = {
  name: 'Tony',
  age: 22,
};

const adam: Person = tony; // 将只读类型对象指向可写类型对象
adam.name = 'Adam'; // 错误，adam的属性为只读属性
tony.name = 'Adam'; // 正确，tony的属性是可写属性
console.log(tony.name); // Adam
```

所以，当我们在代码中遇到某个只读属性发生变化时，可以尝试着找一找是否有可写对象指向了同一个内存地址而欺骗了 TypeScript 的规则检查。

### 索引类型

当我们从后台获取到一些对象时，声明它们会变得有些麻烦，因为这些对象属性特别多，而且有很多的属性是我们用不上的，这时我们可以使用表达式的方式来为属性名描述类型，TypeScript 中称这种属性描述为**索引类型**：

```typescript
type Obj = {
  [attrname: string]: string;
};
const obj: Obj = {
  x: 'xx',
  y: 'yy',
  z: 'zz',
};
```

如上面的示例，类型 Obj 的属性名使用了表达式方式，写在方括号里面：[attrname: string]，attrname 表示的是属性值，这个名字你可以随意，它只是代表着这个对象未来的属性的名称。attrname 的类型为 string。这个表达式的意思是，这个对象可以接受 0 个到 n 个字符串类型命名的属性。

```typescript
type Arr = {
  [index: number]: string;
};
const arr: Arr = ['x', 'y', 'z'];

arr.length; // 类型"Arr"上不存在属性"length"
```

如上例所示，当索引类型为数字时，我们也可以用它来定义一个伪数组，但这个数组其实本质上还是一个对象，它并没有继承 Array 原型上的 length 等数组所特有的属性。

## 数组 Array

正确的数组声明方法有两种，一种写法是在数组成员的类型后面加上一对方括号：

```typescript
const x: number[]; // type[]方式

x = [1, 2, 3]; // 正确
```

上面的例子中，数组 x 的类型是 number[]，其中 number 表示这个数组的成员类型都是 number，后面的中括号则用来表示这是一个数组。

```typescript
const x: (number | string)[]; // 使用联合类型的方式声明多类型数组

x = ['x', 1]; // 正确
```

参考上面的例子，如果数组中有多种类型的成员，可以使用联合类型来声明，使用联合类型的时候我们需要用一对小括号将联合类型包裹起来。

另一种声明数组的方式为泛型方式，使用这种方式来声明联合类型其可读性相对来说要好一些：

```typescript
const x: Array<string>; // 泛型方式

x = ['a', 'b', 'c'];

const y: Array<string | number>; // 使用联合类型声明复杂成员数组

y = ['a', 1]; // 正确
```

### 数组的类型推断

如果数组在初始化时没有声明类型，TypeScript 就会自行推断数组成员的类型，推断行为会因为值的不同而发生变化：

```typescript
const arr = []; // 未声明类型，推断arr的类型为any[]
arr.push(1); // 类型推断会自动调整arr的类型为number[]
arr.push('x'); // 类型推断会自动调整arr的类型为(number|string)[]
```

需要注意的是，类型推断只会在初始化为空的数组上进行，如果初始值不为空，类型推断不会自动更新：

```typescript
const arr = [1]; // 未声明类型，推断arr的类型为number[]
arr.push(2); // 同为number类型，可以添加到数组当中
arr.push('x'); // 类型推断不会自动更新，提示错误
```

### 只读数组

ECMAScript 中数组的值是可变的，即便我们使用 const 来声明它。在 TypeScript 中也是如此，那么，当我们需要声明一组不可变的数组时应该怎么办呢？

```typescript
const x: readonly string[] = ['a', 'b'];
const y: ReadonlyArray<string | number> = ['a', 1];

x[0] = 'c'; // 类型“readonly string[]”中的索引签名仅允许读取
y.push('b'); // 类型“readonly string[]”上不存在属性“push”
```

上面的示例中，x 和 y 分别是 type[]方式和泛型方式声明的只读数组，在它们初始化完成后就再也无法改变它们，无论是增加或删除成员还是改写成员的值，都会报错。

TypeScript 将 readonly type[] 与 type[]视为两种不一样的类型，type[]是 readonly type[]的子类型。这是因为只读数组没有 pop()与 push()等可以改变原数组的方法，所以数组的方法数量要多于只读数组。而参照我们之前讲的，子类型继承了父类型的所有特征，然后加上了自己的特征，所以，子类型可以用于所有使用父类型的场合，反过来就不行。

```typescript
let x: number[] = [1, 2, 3];
let y: readonly number[] = x; // 正确，可以将数组的值赋给只读数组

x = y; // 错误，不能将只读数组的值赋给数组，因为它比起数组少了一些属性特征无法满足数组类型的规则
```

## 元组 Tuple

上面定义的数组很简单，但我们会发现一个问题，就是偶尔我们会有一些并非统一类型的值的数组，尤其是一些服务器返回的数据，可能会有字符串+数字+布尔值三种同时存在的情况，比如我们会收到一些数据用于记录一些人名、性别与年龄等，这种怎么处理呢：

```typescript
let person = ['Alux', 'male', 22];
```

可以发现，我们使用类型推论的方式进行隐式定义也是可以声明这个变量的，但无疑，这种方式极不方便，特别是当我们接收到的数据是来自于服务器时，所以，TypeScript 中定义了一个全新的类型：**元组**

```typescript
// 声明一个元组
let person: [string, string, number];
person = ['Alux', 'male', 22];
```

需要注意的是，使用元组时，必须要给出类型声明，否则类型推断会将它的类型推断为数组：

```typescript
let arr = ['a', 1]; // 类型推断为(string|number)[]
arr[2] = 'b'; // 正确，数组不会检查边界
```

### 元组的一些特性

元组在 TypeScript 中是用于约束一个已知成员数量与类型的特殊数组，它与数组的最大区别是元组在初始化时必须包含所有已指定类型的值且不能越界，而数组在初始化时可以为空且不限制边界；

```typescript
type Tup = [number, string]; // 元组的成员类型包含在中括号里面
type Arr = (number | string)[]; // 数组的成员类型必须在中括号之前

// 元组在初始化时必须包含所有被声明的成员且位置一致
let tup: Tup = [1, 'a']; // 正确，成员数量与位置一致
tup = []; // 不能将类型"[]"分配给类型"Tup"，源具有0个元素而目标需要2个
tup = ['b', 2]; // 不能将类型"string"分配给类型"number"
tup = [1, 2]; // 不能将类型"number"分配给类型"string"
tup = [3, 'c', 'd']; // 不能将类型"[number, string, string]"类型分配给类型"Tup"，源具有3个元素但目标仅允许2个
tup.push('d'); // 正确，元组继承了数组的所有方法，但通过这种方式写入的属性无法被正常读取
console.log(tup[2]); // 长度为"2"的元组类型"Tup"在索引"2"处没有元素
tup[2] = 'd'; // 不能将类型"d"分配给类型"undefined"

let arr: Arr = []; // 正确，数组可以为空
arr = [1, 2, 3, 4, 5]; // 正确，TypeScript不会对数组边界进行检查
```

### 非严格型元组

上面我们说到了元组是一组指定了类型，指定了位置和长度的特殊数组，但在一些特殊情况下，元组也支持可选成员：

```typescript
type Tup = [number, string, number?, boolean?];

let tup: Tup = [1, 'a']; // 正确，可选属性可以被忽略
tup = [1, 'a', 2, true, 'c']; // 错误，长度越界
```

上面示例中，Tup 的最后两个成员是可选的。也就是说，它的成员数量最少 2 个最多可以有 4 个。需要注意的是，可选成员的位置必须是位于元组的最后，也就是说，可选成员不能放在必选成员之前。

```typescript
type Tup = [string, ...number[]]; // 声明一个元组，元组的第二个成员是一个数字类型的数组解构后的成员

const tup_x: Tup = ['X', 1, 2, 3]; // 正确，元组的第二个成员不确定长度，只确定了类型为number
const tup_y: Tup = ['Y', 1, 2]; // 同上
```

上面示例中，Tup 的第二个成员是一个数字类型的数组，我们将它解构后加入到 Tup 类型中去，这样就实现了不固定长度的元组。

```typescript
type t1 = [string, number, ...boolean[]];
type t2 = [string, ...boolean[], number];
type t3 = [...boolean[], string, number];
```

在元组中，使用解构的数组作为它的成员类型时，并不会像可选成员那样规定它的位置，而是可以放在任意你想要放置的位置。

另外，需要注意的是，一旦我们将解构的数组作为元组的成员类型时，这个元组就会被 TypeScript 内部默认为一个数组。因为元组作为数组的子类型，它最大的区别就是有了边界检查，所以，我们尽量不要使用非严格型方式来声明元组。

## 枚举 Enum

Enum 是 TypeScript 中新增的一种数据结构和类型，我们一般称之为枚举。
