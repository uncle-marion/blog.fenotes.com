> Marion 的 react 实战课程 > 第六部分 > ES 笔试题实现

## 防抖

```javascript
// 为什么要使用防抖?
// 在wepapp中，有很多的元素上有绑定change事件或click事件，很多时候会因为这些事件造成无
// 谓的网络请求或计算，一开始为了避免这种情况的发生，我们都是每个功能点上独立写上一个flag
// 来判断事件是否正在执行，为了项目的标准化与代码复用的原则，我们需要封装一个防抖功能以适
// 应各个节点的功能需要

// 面试解决方案
// 封装一个函数，通过一个计时器来注册事件的延时触发，当事件在未触发之前发生了新的事件则取消
// 前面注册的事件。

/**
 * 防抖功能
 * param {function} fun 事件方法
 * param {number} wait 事件的延时触发
 */
export function debounce(fun, wait = 50) {
  let timer;
  return function (...args) {
    // 有新的请求进来就干掉原来的计时器，重新开始计时
    if (timer) {
      clearTimeout(timer);
    }
    // 计时器完成，执行函数
    timer = setTimeout(() => {
      // 使用call或者apply的方式，执行当前闭包中缓存的事件函数，并将参数传出
      fun.call(this, ...args);
    }, wait);
  };
}

// 思考：当前的实现只能对change及click等同步事件进行简单的防控，对于异步请求等操作，仍然没太大
// 的帮助，是否有其它实现方式来兼容异步请求的防抖呢？
```

## 节流

```javascript
/**
 * 一个简单的节流函数
 * @param {function} fun 需要执行的函数
 * @param {number} time 指定的时间周期长度（毫秒）
 */
export function easyThrottle(fun, time = 500) {
  // 用于缓存当前时间，以判断上一次这个方法执行到现在已经用了多久
  let previous = 0;
  // 返回一个闭包函数
  return function (...args) {
    // 当前时间
    let now = Date.now();
    // 上次执行时间到当前时间是否已经允许再次执行
    if (now - previous > time) {
      // 执行函数
      fun.call(this, ...args);
      // 修改上次时间为当前时间，下一次进入时就跟当前时间比较
      previous = now;
    }
  };
}

/**
 * 1. 建立一个变量 previous，用于储存当次执行的时间，如果未执行过，则为0
 * 2. 当接受到函数的时候，获取一个当前系统时间，用这个时间与上面的变量作比较，当它们的差值超出设定的延时时间后，执行事件处理函数
 * 3. 修改变量 previous的值，让它等于当前的系统时间，用于标记在这个时间已经执行过事件处理函数
 */

/**
 * 然后再实现一个考虑比较周全的节流
 *
 * @param {function} func 需要执行的方法
 * @param {number} wait 时间周期
 * @param {object} options 配置项
 * @param {boolean} options.leading 第一次调用函数时是否需要执行
 * @param {boolean} options.trailing 最后一次调用函数时是否需要执行
 */
export function throttle(
  func,
  wait = 500,
  options = { leading: false, trailing: true }
) {
  // 如果第一次调用和最后一次调用都为false,可能会出现用户操作完全无响应的情况
  if (!options.leading && !options.trailing) {
    console.warn('options的leading属性和trailing属性，至少要有一个为true!');
    options.trailing = true;
  }
  // 缓存一个定时器，便于执行最后一次任务
  let timer;

  // 缓存上一次执行回调的时间
  let previous = 0;

  /**
   * 抛出的闭包函数，外部每次触发事件回调都会执行这个函数
   * @param  {...any} args 接受的参数，比如e.target.value
   */
  function throttled(...args) {
    // 记录当前时间
    let now = Date.now();
    let remaining;

    // 是否是第一次调用回调函数（previous只在首次调用时为0，其它时间应该都是上次执行时间）
    if (previous === 0) {
      previous = now;
      // 判断是否需要首次调用（这里与上面的第一次调用不是一个概念）
      // 不需要首次调用的，等待一个时间周期
      if (!options.leading) {
        remaining = wait;
      }
      // 首次调用的直接执行
      else {
        remaining = 0;
      }
    }
    // 不是第一次进入，直接拿上一次的时间与当前时间进行计算
    else {
      remaining = wait - (now - previous);
    }

    // 等待时间为0，表示需要立即调用函数
    if (remaining <= 0) {
      // 如果有定时器，表示有一个定时器在执行最后一次调用延时执行的方法，所以这里需要清除掉它
      if (timer) {
        // 停止计时器并手动清空防止内存泄漏
        clearTimeout(timer);
        timer = null;
      }

      // 设置 previous 为当前时间
      previous = now;
      // 执行 func 函数
      func.apply(this, args);
    }
    // 等待时间不为0的时候，我们需要先判断是否需要执行最后一次调用
    else if (options.trailing) {
      // 需要清除上一次的定时任务
      clearTimeout(timer);
      /**
       * 最后一次调用执行的方法（只有options.trailing为true时才有效）
       * @param {*} context 当前上下文，表示this
       * @param {*} args    当前调用时传入的参数，比如e.target.value
       */
      timer = setTimeout(() => {
        // 因为这是尾调用，表示下一次再来调用可能需要较长一段时间了，
        // 应该算是一个新的调用过程，所以设定 previous = 0
        previous = 0;
        // 停止计时器并手动清空防止内存泄漏
        clearTimeout(timer);
        timer = null;

        // 执行函数
        func.apply(this, args);
      }, remaining);
    }
    // 其它还在等待的状态则忽略
  }

  // 手动取消
  throttled.cancel = function () {
    clearTimeout(timer);
    timer = null;
    previous = 0;
  };
  return throttled;
}
```

## deep equal

深度比较，这是我们进行深度拷贝和深度克隆的关键代码，怎样对一个对象或数组进行深层次的比较？一般来说，因为我们并不了解待比较参数的层级深度，所以，这里使用递归会比较简单。

```javascript
function isObject(obj) {
  return Object.prototype.toString.call(obj) === '[object Object]';
}
function isEqual(obj1, obj2) {
  // 当其中一个为值类型或null
  if (!isObject(obj1) || !isObject(obj2)) {
    return obj1 === obj2;
  }

  //判断是否两个参数是同一个变量
  if (obj1 === obj2) {
    return true;
  }

  //判断keys数是否相等
  const obj1Keys = Object.keys(obj1);
  const obj2Keys = Object.keys(obj2);
  if (obj1Keys.length !== obj2Keys.length) {
    return false;
  }

  //深度比较每一个key
  const allKeys = [...new Set([...obj1Keys, ...obj2Keys])];
  for (const key of allKeys) {
    return isEqual(obj1[key], obj2[key]);
  }

  return true;
}
```

## deep clone

参考我们昨天提出的需求，我们一步步地完成这个深度拷贝(合并)的工作

```javascript
/**
 * 判断是否为一个可迭代的对象
 * @param {*} val
 * @returns
 */
function isIterativeObject(val) {
  // 确认参数存在而且是一个非正则与日期的对象（确认是引用类型的数组或对象）
  return (
    // 参数存在且是一个对象
    val &&
    typeof val === 'object' &&
    // 非正则对象
    Object.prototype.toString.call(val) !== '[object RegExp]' &&
    // 非日期对象
    Object.prototype.toString.call(val) !== '[object Date]'
  );
}

/**
 * 获取对象的key的集合
 * @param {*} obj
 * @returns obj
 */
function getTargetKeys(obj) {
  return isIterativeObject(obj)
    ? // 对象是一个引用类型的对象
      { _target: obj, targetKeys: Object.keys(obj) }
    : // 不是一个引用类型的对象
      // 为什么要让target是一个空对象？
      // 如果target不是一个引用类型，我们不能直接使用source覆盖target，
      // 要避免source对象中的属性是引用类型的对象造成合并后的对象引用属性与原属性一致
      { _target: {}, targetKeys: [] };
}

/**
 * 数组的方法
 * @param {*} target
 * @param {*} source
 * @returns
 */
function arrayMerge(target, source) {
  return source.reduce(
    (destination, item, index) => {
      // 判断target数组中是否有对应的值(只有基本类型的属性可以判断出来，其它都会走下面的else)
      if (!target.includes(item)) {
        destination.push(item);
      } else {
        destination[index] = deepmerge(target[index], item);
      }
      return destination;
    },
    [...target]
  );
}

/**
 * 合并对象的方法
 * @param {*} target
 * @param {*} source
 * @returns
 */
function mergeObject(target, source) {
  // 如果source是正则/日期/null, 直接返回source
  if (!isIterativeObject(source)) {
    return source;
  }

  // 取出source中所有的key
  const sourceKeys = Object.keys(source);

  // 取出所有target中的keys
  const { _target, targetKeys } = getTargetKeys(target);

  // 合并去重
  const allKeys = [...new Set([...targetKeys, ...sourceKeys])];

  // 生成并返回一个新对象
  return allKeys.reduce((destination, key) => {
    // 这里继续进行深层合并
    destination[key] = deepmerge(_target[key], source[key]);
    return destination;
  }, {});
}

/**
 * 深度合并
 * @param {*} target
 * @param {*} source
 * @returns
 */
function deepmerge(target, source) {
  // source对象不是可迭代对象，直接覆盖
  // 无论前面的参数是什么，只要后面这个参数是一个基本类型的或者是function\正则\日期对象；
  // 直接覆盖前面的参数，不需要再进行更多的判断了
  if (!source && source === undefined) {
    return target;
  }
  if (!isIterativeObject(source)) {
    return source;
  }
  // 判断source对象是否是一个数组
  var array = Array.isArray(source);
  // 如果source对象是一个数组
  if (array) {
    // target对象不是数组，放弃target对象，使用source对象继续检查合并
    return arrayMerge(Array.isArray(target) ? target : [], source);
  } else {
    // source对象
    return mergeObject(target, source);
  }
}

// 参数一是什么都无所谓
// 参数二是基本类型，直接给参数一赋值
// 参数二是引用类型，进入递归式判断并赋值

/**
 * 多个对象进行合并的方法
 * @returns
 */
deepmerge.all = function deepmergeAll(...rest) {
  if (!rest || rest.length < 2) {
    throw Error('玩呢？你是要合并个寂寞啊');
  }
  // 使用reduce方法，逐个合并
  return rest.reduce(function (prev, next) {
    return deepmerge(prev, next);
  });
};

export default deepmerge;
```

使用 Object.create 方式来 copy

```javascript
/**
 * 看起来简单一些的深拷贝
 */
function deepClone(target) {
  function isObject(val) {
    return val && (typeof val === 'object' || typeof val === 'function');
  }

  function clone(data) {
    // 只要类型为对象且不是null就能走下面这两个方法了
    if (!isObject) {
      return data;
    }
    // 这两个方法很不错，但是有点绕，看你们自己喜欢了
    // 如果对象的构造函数是日期格式或正则格式
    if ([Date, RegExp].includes(data.constructor)) {
      // 使用对应的构造方法重新实例化一个对象
      return new data.constructor(data);
    }
    if (typeof data === 'function') {
      // 使用函数的构造方法重新生成一个函数
      return new Function('return ' + data.toString())();
    }

    // 走完上面的一堆类型检查，现在是真正的对象和数组了
    const keys = Reflect.ownKeys(data);
    // 获取对象的所有属性描述
    const allDesc = Object.getOwnPropertyDescriptors(data);
    // Object.getPrototypeOf(obj) 获取obj的原型对象
    // 根据对象的原型对象和属性描述，生成一个全新的对象
    const result = Object.create(Object.getPrototypeOf(data), allDesc);

    // 上面的这一步操作其实就是我们常用的{...obj}或Object.assign(obj)
    // 区别在于，我们使用解构或assign这种方式进行的浅拷贝会丢失掉对象的原型, 而这种方式不会

    keys.forEach(key => {
      const val = data[key];
      // 如果这个属性是引用类型的
      if (isObject(val)) {
        // 解决浅拷贝中的引用类型指针到一个新的堆地址的问题
        result[key] = clone(val);
      }
    });
    return result;
  }

  return clone(target);
}
```

## instanceOf

instanceOf 是怎样实现的？找到对象的原型，与待比较原型进行比较，如果比较失败就继续往上找

实现思路：

- 先取得当前类的原型，当前实例对象的原型链
- 一直循环（模仿原型链的查找机制）

> 取得当前实例对象原型链的原型链（proto = proto.**proto**，沿着原型链一直向上查找）

> 如果 当前实例的原型链**proto**上找到了当前类的原型 prototype，则返回 true

> 如果 一直找到 Object.prototype.**proto** == null，Object 的基类(null)上面都没找到，则返回 false

```javascript
function myInstanceOf(left, right) {
  var proto = Reflect.getPrototypeOf(left);
  var result = false;
  while (!result) {
    if (!proto) {
      return false;
    }
    result = proto === right.prototype;
    proto = Reflect.getPrototypeOf(proto);
  }
  return result;
}

class A {}
class B extends A {}
class C {}

const b = new B();
// 输出 true
console.log(myInstanceOf(b, B));
// 输出 true
console.log(myInstanceOf(b, A));
// 输出 false
console.log(myInstanceOf(b, C));
```

## new

new 操作符做了哪些操作？

- 创建一个全新的对象
- 这个对象的**proto**要指向构造函数的原型 prototype
- 执行构造函数，使用 call/apply 改变 this 的指向
- 返回值为 object 类型则作为 new 方法的返回值返回，否则返回上述全新对象

```javascript
function myNew(constructor, ...rest) {
  // 通过Object.create创建一个新对象，该对象的原型指向constructor的prototype属性，
  // 也就是这个构造函数的原型对象
  // Object.create还接受第二个参数，第二个参数将成为这个新对象的所有属性的描述，关于
  // 这个描述可以参考Object.getOwnPropertyDescriptors方法
  const obj = Object.create(constructor.prototype);
  const result = constructor.call(obj, ...rest);
  // 这里是为了避免constructor不是一个构造函数
  return typeof result === 'object' ? result : obj;
}

function Fun(name, age) {
  this.name = name;
  this.age = age;
}
Fun.prototype.getUserInfo = function () {
  return `我的姓名${this.name},我的年龄${this.age}`;
};

const fun = myNew(Fun, 'Tom', 3);

console.log(fun.getUserInfo());
```

## call/apply & bind

一般来说，面试时最多让我们写其中一个，我们以 call 来举例，先思考，call 做了些什么事情

- 将待执行函数设为当前对象的属性
- 指定 this 到函数并传入给定参数的执行函数
- 执行并返回这个函数

```javascript
function fun(a, b) {
  console.log(a + b);
  console.log(this.name);
}
fun.myCall = function (target, ...args) {
  // 隐式绑定，在target中创建一个属性，这个属性的值是当前的this，从方法的调用者上看就是fun方法
  Reflect.set(target, 'fn', this);
  // 创建一个变量用于缓存方法执行的结果
  const result = target.fn(...args);
  // 清除刚刚给对象创建的属性
  Reflect.deleteProperty(target, 'fn');
  // 返回执行的结果
  return result;
};
var obj = {
  name: 'Tom',
};
fun.myCall(obj, 1, 2);
```

apply 与 call 基本一致，这里就不说了，我们来说下 bind: bind 要比 call 和 apply 复杂那么一丢丢。

```javascript
Function.prototype.myBind = function (context, ...outerArgs) {
  // this->func context->obj outerArgs->[10,20]
  let self = this;

  // 返回一个函数
  return function F(...innerArgs) {
    //返回了一个函数，...innerArgs为实际调用时传入的参数
    // 考虑new的方式
    if (self instanceof F) {
      return new self(...outerArgs, ...innerArgs);
    }
    // 把func执行，并且改变this即可
    return self.apply(context, [...outerArgs, ...innerArgs]); //返回改变了this的函数，参数合并
  };
};
```

## 实现千位分隔符

```javascript
// 正则方法
function parseToMoney(num) {
  num = parseFloat(num.toFixed(3));
  let [integer, decimal] = String.prototype.split.call(num, '.');
  integer = integer.replace(/\d(?=(\d{3})+$)/g, '$&,');
  return integer + '.' + (decimal ? decimal : '');
}
```

## 连字号与驼峰的互转

```javascript
var f = function (s) {
  return s.replace(/-\w/g, function (x) {
    return x.slice(1).toUpperCase();
  });
};
```

## format urlParams

```javascript
function parseParam(url) {
  // 将 ? 后面的字符串取出来
  const paramsStr = /.+\?(.+)$/.exec(url)[1];
  // 将字符串以 & 分割后存到数组中
  const paramsArr = paramsStr.split('&');
  let paramsObj = {};
  // 将 params 存到对象中
  paramsArr.forEach(param => {
    // 只处理有 value 的参数
    if (/=/.test(param)) {
      // 分割 key 和 value
      let [key, val] = param.split('=');
      // 解码
      val = decodeURIComponent(val);
      // 判断是否需要转为数字
      val = /^\d+$/.test(val) ? parseFloat(val) : val;

      if (paramsObj.hasOwnProperty(key)) {
        // 如果对象有 key，则添加一个值
        paramsObj[key] = [].concat(paramsObj[key], val);
      } else {
        // 如果对象没有这个 key，创建 key 并设置值
        paramsObj[key] = val;
      }
    } else {
      // 处理没有 value 的参数
      paramsObj[param] = true;
    }
  });

  return paramsObj;
}
```

## window.navigator.userAgent

```javascript

```

## eventBus/eventEmmit

```javascript
class EventEmitter {
  constructor() {
    // 事件对象，存放订阅的名字和事件
    this.events = {};
  }
  // 订阅事件的方法
  on(eventName, callback) {
    if (!this.events[eventName]) {
      // 注意数据，一个名字可以订阅多个事件函数
      this.events[eventName] = [callback];
    } else {
      // 存在则push到指定数组的尾部保存
      this.events[eventName].push(callback);
    }
  }
  // 触发事件的方法
  emit(eventName) {
    // 遍历执行所有订阅的事件
    this.events[eventName] && this.events[eventName].forEach(cb => cb());
  }
}
```

## storageManage

storage 管理，我们的要求如下：

- 像 cookie 一样，可以写入一个有效期并根据有效期的设定时间自动失效
- 根据有效期来判断是写入到 localStorage 还是 sessionStorage
- 向外暴露方法监听内部属性变化

```javascript

```
