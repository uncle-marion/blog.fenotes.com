> 平安蜀黍的前端教程 > 备选知识点 > Axios 源码解析

相对于 fetch 来说，axios 的源码看起来要稍微复杂一点点了，因为它的功能相对较多，而且使用了模块化开发

### 目录结构

首先我们打开 axios 的源码地址：[https://github.com/axios/axios/tree/v2.x](https://github.com/axios/axios/tree/v2.x)

省略一些我们暂时不需要关心的目录和文件，只关注主流程实现。它的源码主要在 lib 目录下：

```bash
├─ lib                                                         // 项目源码目录
│  ├─ adapters                                                 // 请求适配器
│  │  ├─ http.js                                                 // http适配器
│  │  └─ xhr.js                                                  // xhr适配器
│  ├─ cancel                                                   // 请求取消模块
│  ├─ core                                                     // 核心模块
│  │  ├─ Axios.js                                                // Axios对象
│  │  ├─ AxiosError.js                                           // 异常相关
│  │  ├─ InterceptorManager.js                                   // 拦截器类
│  │  ├─ buildFullPath.js                                        // url构建
│  │  ├─ dispatchRequest.js                                      // 请求封装
│  │  ├─ mergeConfig.js                                          // 配置合并工具
│  │  ├─ settle.js                                               // promise处理工具
│  │  └─ transformData.js                                        // 数据转换工具
|  ├─ helpers                                                  // 各种工具函数
|  ├─ platform                                                 // 运行环境处理
│  │  ├─ browser                                                 // 浏览器运行环境
│  │  └─ node                                                    // node运行环境
│  ├─ axios.js                                                 // axios的实例
│  └─ utils.js                                                 // 各种工具函数
```

### Axios 的基本工作流程

正常的基本工作流程如下：

- 初始化 axios 实例（包括配置处理、拦截器等）
- 执行请求拦截器
- 根据当前环境选择合适的网络适配器（xhr 对应浏览器， http request 对应 node）并执行（发送请求）
- 处理响应数据
- 执行响应拦截器
- 请求完成，调用者可获取响应数据

### 工具文件 utils

因为在源码中大量使用了工具包中的函数，所以我们需要先对工具函数做一个全面的了解

utils 文件中导入的另一个工具： bind，这个 bind 的功能与原生 bind 功能基本一致，都是为了实现将指定函数的上下文绑定到某个对象，源码如下：

```javascript
/**
 * @param {function} fn 需要绑定上下文的函数
 * @param {object} thisArg 函数执行的上下文
 * @returns {function} 返回一个可执行函数
 */
module.exports = function bind(fn, thisArg) {
  return function wrap() {
    return fn.apply(thisArg, arguments);
  };
};
```

utils.js

```javascript
// 导入bind方法
var bind = require('./helpers/bind');

// 因为代码中大量使用Object.prototype.toString，这里定义一个别名，可以在代码压缩后大大减少代码体积
var toString = Object.prototype.toString;

// 这个方法的功能是将toString方法获取到的类型描述存入到一个对象里
// 这种写法又被称之为闭包，可以将cache这个对象有效地保存在函数运行环境里而不会被外部变量污染或被垃圾回收机制清理
var kindOf = (function (cache) {
  // 下面这行代码的意思是告诉eslint，忽略下一行代码的function name规则
  // eslint-disable-next-line func-names
  return function (thing) {
    // 这行得到的结果是一个类似于这样的字符串[object Array]
    var str = toString.call(thing);
    // 如果cache对象中不存在则创建一个新属性，新属性的值是str的第八位到倒数第二位，也就是上面示例中的array
    return cache[str] || (cache[str] = str.slice(8, -1).toLowerCase());
  };
  // 创建一个空对象
  // 这里需要关注一下，这里创建出来的空对象是没有原型的，或者说它的原型就是null，所以它内部没有任何Object的方法和属性
})(Object.create(null));

// 这个方法可以说是上面方法的增强版，它的好处是可以将对应的类型描述先存起来，后续需要判断类型时直接传入需要比较的对象即可
// 比如 isArray = kindOfTest('array')
// 需要使用时就可以直接isArray([]) // true
function kindOfTest(type) {
  type = type.toLowerCase();
  return function isKindOf(thing) {
    return kindOf(thing) === type;
  };
}

/**
 * 判断数组类型
 * 是不是感觉这个方法没必要？其实这里是为了代码的一致性，在团队开发中一般都会规定一些类似这样的方法，
 * 可以有效地避免在类型检查时每个开发者使用不一样的方法导致代码混乱且代码可压缩性降低。
 */
function isArray(val) {
  return Array.isArray(val);
}

/**
 * 判断undefined类型
 */
function isUndefined(val) {
  return typeof val === 'undefined';
}

/**
 * 判断buffer类型
 */
function isBuffer(val) {
  return (
    // 有值
    val !== null &&
    // 不是undefined类型
    !isUndefined(val) &&
    // 有构造函数(表明它是一个js对象)
    val.constructor !== null &&
    // 它的构造函数也不能是一个undefined
    !isUndefined(val.constructor) &&
    // 它的构造函数里需要有一个叫isBuffer的属性，属性的类型必须为function
    typeof val.constructor.isBuffer === 'function' &&
    // 调用isBuffer方法来判断当前val是否是一个buffer对象
    val.constructor.isBuffer(val)
  );
}
var isArrayBuffer = kindOfTest('ArrayBuffer');

function isArrayBufferView(val) {
  var result;
  if (typeof ArrayBuffer !== 'undefined' && ArrayBuffer.isView) {
    result = ArrayBuffer.isView(val);
  } else {
    result = val && val.buffer && isArrayBuffer(val.buffer);
  }
  return result;
}

// 字符串与数字类型直接使用typeof即可，不需要那么麻烦
function isString(val) {
  return typeof val === 'string';
}
function isNumber(val) {
  return typeof val === 'number';
}
// object还需要判断是否是null
function isObject(val) {
  return val !== null && typeof val === 'object';
}

/**
 * 这个方法用于判断我们的对象是否是一个真的对象而不是数组等其它对象
 */
function isPlainObject(val) {
  if (kindOf(val) !== 'object') {
    return false;
  }

  // 查找并确认当前对象的原型
  var prototype = Object.getPrototypeOf(val);
  return prototype === null || prototype === Object.prototype;
}

/**
 * 日期类型
 */
var isDate = kindOfTest('Date');

/**
 * 文件类型
 */
var isFile = kindOfTest('File');

/**
 * Blob流
 */
var isBlob = kindOfTest('Blob');

/**
 * 文件列表
 */
var isFileList = kindOfTest('FileList');

/**
 * 函数类型
 */
function isFunction(val) {
  return toString.call(val) === '[object Function]';
}

/**
 * Stream 流类型(http://nodejs.cn/api/stream.html)
 */
function isStream(val) {
  return isObject(val) && isFunction(val.pipe);
}

/**
 * 表单数据
 */
function isFormData(thing) {
  var pattern = '[object FormData]';
  return (
    thing &&
    ((typeof FormData === 'function' && thing instanceof FormData) ||
      toString.call(thing) === pattern ||
      (isFunction(thing.toString) && thing.toString() === pattern))
  );
}

/**
 * url查询参数（https://developer.mozilla.org/zh-CN/docs/Web/API/URLSearchParams）
 */
var isURLSearchParams = kindOfTest('URLSearchParams');

/**
 * 去除字符串前后空格
 */
function trim(str) {
  return str.trim
    ? str.trim()
    : str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
}

/**
 * 判断当前运行环境是否是在浏览器中
 */
function isStandardBrowserEnv() {
  var product;
  if (
    typeof navigator !== 'undefined' &&
    // 注意这里的写法，js的运行规则是如果有赋值运算就先进行赋值然后再比较
    ((product = navigator.product) === 'ReactNative' ||
      product === 'NativeScript' ||
      product === 'NS')
  ) {
    return false;
  }

  return typeof window !== 'undefined' && typeof document !== 'undefined';
}

/**
 * 自定义的forEach方法，自己理解一下试试
 */
function forEach(obj, fn) {
  // Don't bother if no value provided
  if (obj === null || typeof obj === 'undefined') {
    return;
  }

  // Force an array if not already something iterable
  if (typeof obj !== 'object') {
    /*eslint no-param-reassign:0*/
    obj = [obj];
  }

  if (isArray(obj)) {
    // Iterate over array values
    for (var i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    // Iterate over object keys
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        fn.call(null, obj[key], key, obj);
      }
    }
  }
}

/**
 * 深度合并方法， 同样，自己理解
 */
function merge(/* obj1, obj2, obj3, ... */) {
  var result = {};
  function assignValue(val, key) {
    if (isPlainObject(result[key]) && isPlainObject(val)) {
      result[key] = merge(result[key], val);
    } else if (isPlainObject(val)) {
      result[key] = merge({}, val);
    } else if (isArray(val)) {
      result[key] = val.slice();
    } else {
      result[key] = val;
    }
  }

  for (var i = 0, l = arguments.length; i < l; i++) {
    forEach(arguments[i], assignValue);
  }
  return result;
}

/**
 * 继承的方法，让参数a 继承 参数b的全部属性和方法
 */
function extend(a, b, thisArg) {
  forEach(b, function assignValue(val, key) {
    if (thisArg && typeof val === 'function') {
      a[key] = bind(val, thisArg);
    } else {
      a[key] = val;
    }
  });
  return a;
}

/**
 * Remove byte order marker. This catches EF BB BF (the UTF-8 BOM)
 */
function stripBOM(content) {
  if (content.charCodeAt(0) === 0xfeff) {
    content = content.slice(1);
  }
  return content;
}

/**
 * Inherit the prototype methods from one constructor into another
 * @param {function} constructor
 * @param {function} superConstructor
 * @param {object} [props]
 * @param {object} [descriptors]
 *
 * @returns {void}
 */
function inherits(constructor, superConstructor, props, descriptors) {
  constructor.prototype = Object.create(
    superConstructor.prototype,
    descriptors
  );
  constructor.prototype.constructor = constructor;
  props && Object.assign(constructor.prototype, props);
}

/**
 * Resolve object with deep prototype chain to a flat object
 * @param {Object} sourceObj source object
 * @param {Object} [destObj]
 * @param {Function|Boolean} [filter]
 * @param {Function} [propFilter]
 *
 * @returns {Object}
 */
function toFlatObject(sourceObj, destObj, filter, propFilter) {
  var props;
  var i;
  var prop;
  var merged = {};

  destObj = destObj || {};
  // eslint-disable-next-line no-eq-null,eqeqeq
  if (sourceObj == null) return destObj;

  do {
    props = Object.getOwnPropertyNames(sourceObj);
    i = props.length;
    while (i-- > 0) {
      prop = props[i];
      if (
        (!propFilter || propFilter(prop, sourceObj, destObj)) &&
        !merged[prop]
      ) {
        destObj[prop] = sourceObj[prop];
        merged[prop] = true;
      }
    }
    sourceObj = filter !== false && Object.getPrototypeOf(sourceObj);
  } while (
    sourceObj &&
    (!filter || filter(sourceObj, destObj)) &&
    sourceObj !== Object.prototype
  );

  return destObj;
}

/**
 * Determines whether a string ends with the characters of a specified string
 *
 * @param {String} str
 * @param {String} searchString
 * @param {Number} [position= 0]
 *
 * @returns {boolean}
 */
function endsWith(str, searchString, position) {
  str = String(str);
  if (position === undefined || position > str.length) {
    position = str.length;
  }
  position -= searchString.length;
  var lastIndex = str.indexOf(searchString, position);
  return lastIndex !== -1 && lastIndex === position;
}

/**
 * Returns new array from array like object or null if failed
 *
 * @param {*} [thing]
 *
 * @returns {?Array}
 */
function toArray(thing) {
  if (!thing) return null;
  if (isArray(thing)) return thing;
  var i = thing.length;
  if (!isNumber(i)) return null;
  var arr = new Array(i);
  while (i-- > 0) {
    arr[i] = thing[i];
  }
  return arr;
}

/**
 * Checking if the Uint8Array exists and if it does, it returns a function that checks if the
 * thing passed in is an instance of Uint8Array
 *
 * @param {TypedArray}
 *
 * @returns {Array}
 */
// eslint-disable-next-line func-names
var isTypedArray = (function (TypedArray) {
  // eslint-disable-next-line func-names
  return function (thing) {
    return TypedArray && thing instanceof TypedArray;
  };
})(typeof Uint8Array !== 'undefined' && Object.getPrototypeOf(Uint8Array));

/**
 * For each entry in the object, call the function with the key and value.
 *
 * @param {Object<any, any>} obj - The object to iterate over.
 * @param {Function} fn - The function to call for each entry.
 *
 * @returns {void}
 */
function forEachEntry(obj, fn) {
  var generator = obj && obj[Symbol.iterator];

  var iterator = generator.call(obj);

  var result;

  while ((result = iterator.next()) && !result.done) {
    var pair = result.value;
    fn.call(obj, pair[0], pair[1]);
  }
}

/**
 * It takes a regular expression and a string, and returns an array of all the matches
 *
 * @param {string} regExp - The regular expression to match against.
 * @param {string} str - The string to search.
 *
 * @returns {Array<boolean>}
 */
function matchAll(regExp, str) {
  var matches;
  var arr = [];

  while ((matches = regExp.exec(str)) !== null) {
    arr.push(matches);
  }

  return arr;
}

/* Checking if the kindOfTest function returns true when passed an HTMLFormElement. */
var isHTMLForm = kindOfTest('HTMLFormElement');

/* Creating a function that will check if an object has a property. */
var hasOwnProperty = (function resolver(_hasOwnProperty) {
  return function (obj, prop) {
    return _hasOwnProperty.call(obj, prop);
  };
})(Object.prototype.hasOwnProperty);

module.exports = {
  isArray: isArray,
  isArrayBuffer: isArrayBuffer,
  isBuffer: isBuffer,
  isFormData: isFormData,
  isArrayBufferView: isArrayBufferView,
  isString: isString,
  isNumber: isNumber,
  isObject: isObject,
  isPlainObject: isPlainObject,
  isUndefined: isUndefined,
  isDate: isDate,
  isFile: isFile,
  isBlob: isBlob,
  isFunction: isFunction,
  isStream: isStream,
  isURLSearchParams: isURLSearchParams,
  isStandardBrowserEnv: isStandardBrowserEnv,
  forEach: forEach,
  merge: merge,
  extend: extend,
  trim: trim,
  stripBOM: stripBOM,
  inherits: inherits,
  toFlatObject: toFlatObject,
  kindOf: kindOf,
  kindOfTest: kindOfTest,
  endsWith: endsWith,
  toArray: toArray,
  isTypedArray: isTypedArray,
  isFileList: isFileList,
  forEachEntry: forEachEntry,
  matchAll: matchAll,
  isHTMLForm: isHTMLForm,
  hasOwnProperty: hasOwnProperty,
};
```

### 入口文件 Axios

```javascript
'use strict';

var utils = require('./utils');
var bind = require('./helpers/bind');
var Axios = require('./core/Axios');
var mergeConfig = require('./core/mergeConfig');
var defaults = require('./defaults');
var formDataToJSON = require('./helpers/formDataToJSON');
/**
 * 创建一个Axios的实例
 */
function createInstance(defaultConfig) {
  var context = new Axios(defaultConfig);
  var instance = bind(Axios.prototype.request, context);

  // 将axios.prototype复制到实例
  utils.extend(instance, Axios.prototype, context);

  // 将当前上下文件复制到实例
  utils.extend(instance, context);

  // 为当前实例添加一个生成实例的方法
  instance.create = function create(instanceConfig) {
    // 结合当前实例的参数与新参数，返回一个新实例
    return createInstance(mergeConfig(defaultConfig, instanceConfig));
  };

  return instance;
}

// 生成需要导出的默认实例（就是我们不做任何操作直接调用的axios）
var axios = createInstance(defaults);

// 暴露Axios类以允许类继承
axios.Axios = Axios;

// 暴露cancel等方法 这块的的具体用法可以参考我们前面封装的axios实例，你们可以自己去看看相关源码，后续上课时我们再细讲
axios.CanceledError = require('./cancel/CanceledError');
axios.CancelToken = require('./cancel/CancelToken');
axios.isCancel = require('./cancel/isCancel');
axios.VERSION = require('./env/data').version;
axios.toFormData = require('./helpers/toFormData');

axios.AxiosError = require('../lib/core/AxiosError');
axios.Cancel = axios.CanceledError;

// 同时发起多个请求
axios.all = function all(promises) {
  return Promise.all(promises);
};
/**
 * axios.spread
 * 源码如下：
 * module.exports = function spread(callback) {
 *   return function wrap(arr) {
 *     return callback.apply(null, arr);
 *   };
 * };
 * 这是一个语法糖，用于调用函数并扩展参数数组，一般与axios.all配合使用，示例如下
 * function getUserAccount() {
 *   return axios.get('/user/12345');
 * }
​ *
 * function getUserPermissions() {
 *   return axios.get('/user/12345/permissions');
 * }
​ *
 * axios.all([getUserAccount(), getUserPermissions()])
 *   .then(axios.spread(function (acct, perms) {
 *     // 两个请求现在都执行完成
 * }));
 */
axios.spread = require('./helpers/spread');

// Expose isAxiosError
axios.isAxiosError = require('./helpers/isAxiosError');

axios.formToJSON = function (thing) {
  return formDataToJSON(utils.isHTMLForm(thing) ? new FormData(thing) : thing);
};

module.exports = axios;

// 默认导出
module.exports.default = axios;
```
