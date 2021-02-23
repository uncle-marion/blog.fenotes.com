> 企业框架实战\_第二部分\_TypeScript 入门

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
