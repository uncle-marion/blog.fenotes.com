> 平安蜀黍的前端教程 > 备选知识点 > 什么是模块化

### 模块化相关规范

前端工程化的主要概念就是使用模块化开发，将一个页面根据其规则拆分成多个模块，然后使用向外暴露接口的方式与外部其它模块进行通信。而当这种模块化开发的项目越来越多，代码量越来越多时，维护人员的工作量也在不断增加。JavaScript 模块化规范就是为了解决维护问题而推出的一些标准，让大家在想要实现某个功能时能方便地加载指定模块的一个标准。目前使用得比较多的模块化规范有 CommonJs 及 Es6 规范，早期在 Es6 规范还没完善的时候，社区爱好者们还编写过 AMD 规范和 CMD 规范，下面我们逐个地了解一下：

#### CommonJS

JavaScript 这门语言在早期的时候是没有模块化这个概念的。在 2009 年的时候，当时的 Mozilla 的工程师 Kevin Dangoor 呼吁 JavaScript 爱好者们编写了一个叫 ServerJS 的 JavaScript 的服务器端规范。后来没多久，这个规范又改名为 CommonJS。CommonJS 规范包括了模块（modules）、包（packages）、系统（system）、二进制（binary）、控制台（console）、编码（encodings）、文件系统（filesystems）、套接字（sockets）以及单元测试（unit testing）等部分。当下 CommonJS 规范最热门的实现是 NodeJS。

CommonJS 是通过 model.exports 来定义的，所以它在前端浏览器中是不支持的。CommonJS 的表现是每个文件就是一个**模块，有自己的作用域**。在一个**文件里面定义的变量、函数、类，都是私有的，对其他文件都是不可见的**。

CommonJS 定义的模块分别为：模块引用--require，模块定义--exports，模块标识--module

##### CommonJS 特性：

- 对于基本数据类型，属于复制。即会被模块缓存。同时，在另一个模块可以对该模块输出的变量重新赋值；
- 对于复杂数据类型，属于浅拷贝。由于两个模块引用的对象指向同一个内存空间，因此对该模块的值做修改时会影响另一个模块；
- 当使用 require 命令加载某个模块时，就会运行整个模块的代码；此时如果再次使用 require 命令加载同一个模块时，不会再执行该模块，而是取缓存之中的值。也就是说，CommonJS 模块无论加载多少次，都只会在第一次加载时运行一次，以后再加载，就返回第一次运行的结果，除非手动清除系统缓存；
- 循环加载时，属于加载时执行。即脚本代码在 require 的时候，就会全部执行。一旦出现某个模块被“循环加载”，就只输出已经执行的部分，还未执行的部分不会输出。

##### 示例：

```javascript
// a.js
exports.done = false
let b = require('./b.js')
console.log('a.js-1', b.done)
exports.done = true
console.log('a.js-2', '执行完毕')

// b.js
exports.done = false
let a = require('./a.js')
console.log('b.js-1', a.done)
exports.done = true
console.log('b.js-2', '执行完毕')

// c.js
let a = require('./a.js')
let b = require('./b.js')

console.log('c.js-1', '执行完毕', a.done, b.done)

// 运行node c.js
b.js-1 false
b.js-2 执行完毕
a.js-1 true
a.js-2 执行完毕
c.js-1 执行完毕 true true
```

阅读理解：

注意，要理解上面的这段代码必须要知道的一个常识：js 代码是从上到下依次执行的！！这块涉及到 JS 调用栈的概念。对这块没有概念的同学可以看看这篇：[JS 事件循环](http://blog.fenotes.com/unit_06/lessons_09.html)

> 1. 在 node.js 中执行 c 文件，逐行执行，发现依赖了 a 文件，于是加载 a 文件

> 2. 执行 a 文件，逐行执行，发现依赖了 b 文件，于是加载 b 文件

> 3. 扫行 b 文件，逐行执行，发现再次依赖了 a 文件，参考我们上面描述的特性，反复依赖的只执行缓存中的执行结果，所以，我们这时的 a.js 只抛出了一个 done 的定义为 false

> 4. 缓存中的 a.js 执行完成，返回继续执行 b 文件，第三行，输出日志，上面已经说了，这里的 done 目前只有一个 false，所以这里打印的是“b.js-1 false”

> 5. 修改 b.done 的值为 true，并输出日志：“b.js-2 执行完毕”

> 6. b 文件执行完成，返回继续执行 a 文件，输出日志，因为 b 文件已经全部执行完成，所以这里输出“a.js-1 true”

> 7. 重定义 a.done 的值为 true，并输出日志：“a.js-2 执行完毕”

> 8. 返回 c 文件，逐行执行，发现再次依赖了 b 文件，仍然是反复依赖，所以只取返回结果

> 9. 输出日志“c.js-1 执行完毕 true true”

[课后浏览: CommonJS 规范](http://javascript.ruanyifeng.com/nodejs/module.html)

#### AMD

AMD 是 CommonJS 规范的客户端版本，英文名 Asynchronous Module Definition，意思就是“异步模块定义”。它使用了 define 这个函数，解决了 require 同步加载在客户端环境无法顺利加载的问题。

```javascript
define([module-name?], [array-of-dependencies?], [module-factory-or-object]);
// module-name: 模块标识，可以省略。
// array-of-dependencies: 所依赖的模块，可以省略。
// module-factory-or-object: 模块的实现，或者一个JavaScript对象。
```

思考问题：为什么在客户端环境无法同步加载？

##### AMD 特性

- 模块本身和模块之间的引用可以被异步的加载
- 它实现了解耦，模块在代码中也可通过识别号进行查找
- 先引入的模块，后使用的引用模块的方法，所以 AMD 模式被称之为依赖前置

##### AMD 用法示例：

```javascript
define(['./package/lib.js'], function (lib) {
  function say() {
    lib.log('this is fn');
  }
  return {
    say: say,
  };
});
```

阅读理解：

1. 第一个参数是一个数组，数组中每一个成员都是我们依赖的模块地址
2. 第二个参数是一个回调函数，这个回调函数的参数是导入我们第一个参数中数组成员后返回的可用模块
3. 开始使用

#### CMD

CMD 是由国内前端大牛“玉伯”结合 CommonJS 与 AMD 规范中的一些优点实现的，与 AMD 一样，也是为了解决客户端的异步加载模块而实现的技术方案，它的英文名是 Common Module Definition，意思是“通用模块定义”。他改变了 AMD 的模块必须在函数调用前进行声明的设定，而是使用了一种同步的概念：只在需要使用模块时才去引用，引用完成后即可实现模块中方法的调用。

##### CMD 特性

- 依赖就近原则，在哪里使用，在哪里引入，就是同步的概念，即用即返回

##### CMD 示例

```javascript
define(function (require, exports, module) {
  var $ = require('jquery');
  exports.sayHello = function () {
    $('#hello').toggle('slow');
  };
});
```

阅读理解：

1. 通过调用 define 方法来获取 require、exports 与 module 方法
2. 引入 jQuery 库
3. 导出 sayHello 方法，并在这个方法中调用 jQuery 库中的方法捕获 Dom 元素

确切地说，CMD 并不能被称之为一个规范，它只是将 CommonJS 规范和 AMD 规范综合了一下，然后将它们的好的特性体现了出来，所以这是一个极具争议的模块管理规范。

#### ES6

自从 2015 年推出了 Es6 规范后，CMD 与 AMD 就慢慢地淡出了，因为它们的实现的确是有些繁琐，而 Es6 则简洁了很多。

ES6 模块的设计思想是尽量的静态化，使得编译时就能确定模块的依赖关系，以及输入和输出的变量。而 CommonJS 和 AMD 模块，都只能在运行时确定这些东西。比如，CommonJS 模块就是对象，输入时必须查找对象属性。

```javascript
// CommonJS模块
let { stat, exists, readfile } = require('fs');

// 等同于
let _fs = require('fs');
let stat = _fs.stat;
let exists = _fs.exists;
let readfile = _fs.readfile;
```

上面代码的实质是整体加载 fs 模块（即加载 fs 的所有方法），生成一个对象（\_fs），然后再从这个对象上面读取 3 个方法。这种加载称为“运行时加载”，因为只有运行时才能得到这个对象，导致完全没办法在编译时做“静态优化”。

ES6 模块不是对象，而是通过 export 命令显式指定输出的代码，再通过 import 命令输入。

```javascript
// Es6模块
import { stat, exists, readFile } from 'fs';
```

上面代码的实质是从 fs 模块加载 3 个方法，其他方法不加载。这种加载称为“编译时加载”或者静态加载，即 ES6 可以在编译时就完成模块加载，效率要比 CommonJS 模块的加载方式高。当然，这也导致了没法引用 ES6 模块本身，因为它不是对象。

由于 ES6 模块是编译时加载，使得静态分析成为可能。有了它，就能进一步拓宽 JavaScript 的语法，比如引入宏（macro）和类型检验（type system）这些只能靠静态分析实现的功能。

除了静态加载带来的各种好处，ES6 模块还有以下好处。

- 不再需要 UMD 模块格式了，**将来**服务器和浏览器都会支持 ES6 模块格式。目前，通过各种工具库，其实已经做到了这一点。

- 将来浏览器的新 API 就能用模块格式提供，不再必须做成全局变量或者 navigator 对象的属性。

- 不再需要对象作为命名空间（比如 Math 对象），未来这些功能可以通过模块提供。
