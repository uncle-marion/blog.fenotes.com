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
