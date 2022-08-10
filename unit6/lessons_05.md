> Marion 的 react 实战课程 > 第六部分 > Reflect/Proxy

## Reflect

Reflect，在英文中的意思是反映反射，一般会被翻译成映射，它是一个全局的普通对象。也就是说，我们可以直接使用 Reflect[方法名]的方式来执行其内部的方法。Reflect 是 ES6 为了操作对象而新增的 API，也就是说，它能执行几乎所有对象上的方法。

- 未来，W3C 会将 Object 对象的一些明显属于语言内部的方法(比如 Object.defineProperty)，放到 Reflect 对象上，那么以后我们就可以从 Reflect 对象上可以拿到语言内部的方法。

- 在使用对象的 Object.defineProperty(obj, name, {})时，如果出现异常的话，会抛出一个错误，需要使用 try catch 去捕获，但是使用 Reflect.defineProperty(obj, name, desc) 则会返回 false。

- 将所有的 Object 操作都变成了容易理解的函数行为而不是以前的使用运算符来判断左右侧的值的操作，比如 name in obj 或 delete obj[name]

```javascript
var aa = { cc: 456 };
try {
  Object.defineProperty(aa, 'bb', { value: 123 });
} catch (e) {
  // 失败
}

// 新写法
if (Reflect.defineProperty(aa, 'bb', { value: 123 })) {
  // 写入成功会返回true
} else {
  // 失败会返回false
}
// 以前判断对象是否有值
console.log(cc in aa);
// 现在
Reflect.has(aa, 'cc');
// 以前删除对象的属性
delete aa['cc'];
// 现在
Reflect.deleteProperty(aa, 'cc');
```

- 关于 Object.defineProperty()

```javascript
// 其实就是一个给对象添加属性或给对象的属性赋值的方法，只不过通过它添加的属性会增加一些控制属性
Object.defineProperty(对象名称, 属性名称, {
  value: 属性的值, // 赋值，注意这个值与get\set不能同时存在，否则会内存溢出
  get(){} // 读取器
  set(){} // 存储器
  writable: true // 是否可以改变，默认为不可改变
  configurable: true // 是否可以删除，默认为不可删除
  enumerable: true // 是否可以被for in遍历或通过Object.keys获取，默认不可遍历
})
// 注意，get与set方法不能与value和writable同时存在，否则会报错！！
```

Reflect 一共提供了 13 个方法，我们只要学习常用的一些方法即可，对它比较感兴趣的同学可以去菜鸟等网站自己行学习其它方法。

- Reflect.get(target, name, receiver);

```javascript
/**
 * 读取对象的属性
 * target 需要读取的对象
 * name   属性名
 * receiver 上下文对象(记得之前讲过的fn.call(this)吗)
 */

var tom = {
  name: 'Tom',
  age: 3,
  // desc的属性是通过计算后得到的
  get desc() {
    console.log(`我叫${this.name},我今年${this.age}岁了`);
  },
};

Reflect.get(tom, 'name');
Reflect.get(tom, 'desc');
// 上下文，相当于是call(obj)
var jerry = {
  name: 'Jerry',
  age: 2,
};
Reflect.defineProperty(jerry, 'desc', {
  get() {
    console.log('这个方法打印的东西不一样了', this.name, this.age);
  },
});
// 三个参数
// 参数一，当前对象，
// 参数二，属性的名称
// 参数三，被操作的上下文对象
// 使用当前对象里的方法去计算第三个参数中的属性
Reflect.get(tom, 'desc', jerry);
Reflect.get(jerry, 'desc', tom);
```

- Reflect.set(target, name, value, receiver);

```javascript
/**
 * 增加或修改对象的属性
 * target 需要操作的对象
 * name   属性名
 * value  属性的值
 * receiver 上下文对象
 */
var jerry = {
  set desc(params) {
    console.log(parmas, '######');
  },
};
Reflect.set(jerry, 'name', 'Jerry');
Reflect.set(jerry, 'age', 2);

var obj = {
  set aa(value) {
    this.cc = this.bb() + value;
  },
  bb: function () {
    return 44;
  },
};
var obj1 = {
  bb: function () {
    return 33;
  },
};
// 使用obj对象的aa方法计算后将值写入obj1里
Reflect.set(obj, 'aa', 'aa', obj1);
```

- Reflect.apply(function, target, args)

```javascript
// 比如
function fun() {
  console.log(this.name);
}
fun.apply({ name: 'tom' });

// 可是如果有人改写了fun的apply方法呢？
fun.apply = params => console.log(params);
// 所以，我们只能使用Function方法来写比较安全一点
Function.prototype.apply.call(fun, { name: 'tom' });
// 但这样写，代码也未免太长了些，而Reflect正好帮我们提供了这个方法
Reflect.apply(fun, { name: 'tom' }, []);
// 注意，apply的第三个参数必须要传，否则会报错
```

- Reflect.construct(target, args, newTarget);

```javascript
/**
 * 实例化一个构造函数
 * target 实例化的构造函数
 * args   实例化构造函数需要的参数
 * newTarget 表示实例化生成的实例对象是谁的实例
 */
Reflect.construct(target, args, newTarget);
```

- Reflect.defineProperty(target, name, desc);

```javascript
/**
 * 添加或修改对象的属性
 * target 需要读取的对象
 * name   属性名
 * desc   描述
 */
Reflect.defineProperty(target, name, desc);
```

- Reflect.has(target, name);

```javascript
// 判断对象是否有这个属性
Reflect.has(target, name);
```

- Reflect.getPrototypeOf(obj)

```javascript
var obj = {};
// 不允许在代码中直接读取__proto__
Object.getPrototypeOf(obj) === obj.__proto__;
Reflect.getPrototypeOf(obj) === obj.__proto__;
```

- Reflect.setPrototypeOf(obj)

## Proxy

Proxy 在英文中的意思是代理，在 Es6 中主要用于构建一个对目标对象操作进行拦截的代理器，通俗地讲，就是要写入或读取对象中某些属性的时候，会被 proxy 方法拦截并加以判断和处理。大道理先不说，我们先学着怎么用，用完了再说它的使用场景和方法吧

Proxy 的使用方式如下：

```javascript
var tom = {
  name: 'Tom',
  age: 3,
};
/**
 * 这个对象中包含一个用于监听什么时候获取了对象属性的方法
 */
var handler = {
  /**
   * 监听get方法
   * @param {*} target 被监听的对象，可以是类可以是对象也可以是方法
   * @param {*} key 对象的属性名
   * @param {*} proxy 代理对象
   */
  get(target, key, proxy) {
    console.log(
      `${new Date().toLocaleTimeString('zh')}使用proxy获取了${key}的值`
    );
    return Reflect.get(target, key, proxy);
  },
};

var proxy = new Proxy(tom, handler);
proxy.name;
```

在上面的代码中，我们首先定义一个对象 tom, 然后声明了一个代理对象 handler, 再然后使用 Proxy 创建了一个代理对象 proxy, 最终的结果就是，只要使用 proxy 读取 tom 对象中的任意一个值都会被 handler 里的处理方法先过一遍再返回结果。一般来说，我们使用 proxy 来代替设计模式中的代理模式：

- 拦截和监听外部对对象的访问
- 降低函数或类的复杂度
- 在复杂操作前对操作进行校验或对资源进行管理

### proxy vlidate

比如，我们需要对某个类的实例化操作进行数据校验

```javascript
// 写一堆的判断，如果参数比较多的话这里就没办法看下去了
class Cats {
  constructor(name, age) {
    if (typeof this.name !== 'string') {
      return throw Error('name只接受字符串参数');
    }
    if (typeof this.age !== 'number') {
      return throw Error('age只接受数字参数');
    }
    if (this.age > 15) {
      return throw Error('这只猫太老了');
    }
    this.name = name;
    this.age = age;
  }
}
// 使用代理
function constructorValidate(target, validate) {
  return new Proxy(target, {
    _validate: validate,
    set(target, key, value, proxy) {
      if (target.hasOwnProperty(key)) {
        var validate = this._validate[key];
        if (!!validate(value)) {
          return Reflect.set(target, key, value, proxy);
        } else {
          throw Error(`写入失败，${key}的参数类型与预设的参数不符`);
        }
      } else {
        throw Error(`你确定是${key}吗？我好像，貌似没有找到这么个属性啊`);
      }
    },
  });
}
var validate = {
  name(val) {
    return typeof val === 'string';
  },
  age(val) {
    return typeof age === 'number' && age < 15;
  },
};
class Cats {
  constructor(name, age) {
    this.name = name;
    this.age = age;
    return constructorValidate(this, validate);
  }
}
const tom = new Cats('Tom', 3);

tom.name = 123;
tom.age = 123;
tom.age = 'tom';

// 还可以校验函数的参数是否正确
var test = {
  fn1(a, b, c) {},
  fn2(a, b) {},
};
var argsType = {
  fn1: ['string', 'number', 'boolean'],
  fn2: ['number', 'string'],
};

function argCheck(name, args, types) {
  console.log(name, args, types);
  for (let i = 0, l = types.length; i < l; i++) {
    var item = args[i];
    var type = types[i];
    if (!item || typeof item !== type) {
      console.warn(`${name}第${i}位参数不匹配`);
    }
  }
}

test = new Proxy(test, {
  get(target, key, proxy) {
    console.log(target, key, proxy);
    var value = target[key];
    return function (...args) {
      var checkArgs = argCheck(key, args, argsType[key]);
      return Reflect.apply(value, target, args);
    };
  },
});

test.fn1();
```

### 私有属性

早先的时候我们讲了#和*来表示私有属性，后来发现#好像不是那么好及，而*属性却无法做到真正的私有化，那现在用 proxy 我们就可以真实地实现私有变量了

```javascript
// 我们不想让appKey被外部访问到，也不允许外部修改
var api = {
  _apiKey: '123456789',
  getUserInfo() {
    console.log(this._appKey);
  },
  getOrderList() {},
};
var handler = {
  get(target, key, proxy) {
    console.log(proxy);
    if (key[0] === '_') {
      throw Error(
        `${key}是一个私有变量，不允许直接获取，如需获取请使用xxx方法`
      );
    }
    return Reflect.get(target, key, proxy);
  },
  set(target, key, proxy) {
    if (key[0] === '_') {
      throw Error(
        `${key}是一个私有变量，不允许直接修改，如需修改请调用xxx方法`
      );
    }
    Reflect.set(target, key, proxy);
  },
};

var proxy = new Proxy(api, handler);

proxy._apiKey;
proxy._apiKey = 'asdffd';
```
