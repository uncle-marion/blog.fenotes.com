> 平安蜀黍的前端教程 > 第一单元 开发环境与工具封装 > 通用小工具封装

### 判断对象类型

使用 javascript 进行编码时，我们经常需要判断调用者传入的参数是否是指定类型的参数，对于新人来说在 js 中判断类型是一件比较麻烦的事，typeof 只能判断基本类型与对象类型，当参数为对象类型时可能还需要 instanceof 来比较原型，所以，我们可以使用 Object.toString 来解决这个问题：

```javascript
const toString = Object.prototype.toString;

/**
 * 判断是否是函数对象
 *
 * @param {Object} val 待判断的对象
 * @returns {boolean} true || false
 */
export function isFunction(val) {
  return toString.call(val) === '[object Function]';
}

/**
 * 判断是否为数组
 *
 * @param {Object} val 待判断的对象
 * @returns {boolean} true || false
 */
export function isArray(val) {
  return toString.call(val) === '[object Array]';
}

/**
 * 判断是否为对象
 *
 * @param {Object} val 待判断的对象
 * @returns {boolean} true || false
 */
export function isObject(val) {
  return toString.call(val) === '[object Object]';
}

/**
 * 判断是否是字符串
 *
 * @param {Object} val 待判断的对象
 * @returns {boolean} true || false
 */
export function isString(val) {
  return typeof val === 'string';
}

/**
 * 判断是否是数字
 *
 * @param {Object} val 待判断的对象
 * @returns {boolean} true || false
 */
export function isNumber(val) {
  return typeof val === 'number' || isNaN(val);
}

/**
 * 判断是否是时间对象
 *
 * @param {Object} val 待判断的对象
 * @returns {boolean} true || false
 */
export function isDate(val) {
  return toString.call(val) === '[object Date]';
}

/**
 * 判断是否是文件对象
 *
 * @param {Object} val 待判断的对象
 * @returns {boolean} true || false
 */
export function isFile(val) {
  return toString.call(val) === '[object File]';
}
```

### 字符串方法

对字符串进行操作的一些方法

```javascript
/**
 * 去除文字前后的空白
 * 使用场景：用户在往输入框里输入内容时可能会在前后误输入空格
 * @param {String} str 待处理文字
 * @returns {String} 处理完成后的文字
 */
export function trim(str) {
  return str.replace(/^\s*/, '').replace(/\s*$/, '');
}

/**
 * 获取一段随机字符串
 *
 * @param {number} length 需要的字符串长度(不超过10位)
 * @param {boolean} CUL 是否需要包含大写字母(contains uppercase letters)
 * @returns {string} 生成的随机字符串
 */
export function getRandomString(length, CUL) {
  // 取随机数并转换成36位字符串
  const str = Math.random()
    .toString(36)
    .slice(2, length + 2);
  // 如果需要大写字母时需要继续进行转换
  return !CUL
    ? str
    : str.replace(/\w/g, curr => {
        return Math.random() > 0.5 ? curr.toLocaleUpperCase() : curr;
      });
}

/**
 * 从url中获取参数
 * 使用场景：url中包含了search属性，我们需要手动获取其中的值或完整的参数对象
 * @param {String} url 需要处理的url
 * @param {String} key 需要获取的属性名
 * @returns {null | any | object} 如果key不存在，返回整个url中的属性对象；如果key存在且url存在对应属性，返回对应的属性值；否则返回null；
 */
// ex开头表是这是一个正则的常量
export const EX_PARAMS_URL = /[?&]?([^=]+)=([^&]*)/g;
export function getQueryParams(urlStr = window.location.href, key) {
  // 判断url中是否包含参数
  const hasParams = EX_PARAMS_URL.test(urlStr);
  if (!hasParams) {
    return null;
  }

  // 格式化url字符串
  const params = urlStr
    // 使用split将字符串在?号位置拆分成数组后取后半段内容
    .split('?')[1]
    // 将取到的内容用&号拆分成数组
    .split('&')
    // 使用reduce将数组转换成对象
    .reduce((prev, curr) => {
      // split拆分的数据是一个二位的数组，我们可以用解构的方式取值
      const [key, value] = curr.split('=');
      // 当一个值被多处使用时，可以先定义成变量后再使用，避免多次计算及代码冗余
      const deValue = decodeURIComponent(value);
      // 较早的代码中可能存在数组传参的情况
      if (prev[key]) {
        // 如果不是数组就转成数组
        if (!isArray(prev[key])) {
          prev[key] = [prev[key]];
        }
        prev[key].push(deValue);
      } else {
        prev[key] = deValue;
      }
      return prev;
    }, {});

  // 根据第二个参数的情况返回对应的属性或完整的参数对象
  return key ? params[key] || null : params;
}

/**
 * 获取包含双字节字符的字符串长度
 * 使用场景：在某些需求里可能会要求判断文本的字节长度
 * @param {string}
 * @returns {number}
 */
// 双字节字符正则
// 注意，这个地方如果使用\x00会因为从\x00~\x1f都是控制字符，eslint会提示警告
export const EX_DOUBLE_BYTE = /[^\x20-\xff]/gi;
export function getStringLengthByByte(str) {
  // 传入类型不正确的参数时要有兼容性处理
  if (!isString(str)) {
    return null;
  }
  const doubleByteStr = str.match(EX_DOUBLE_BYTE);
  // 先获取字符串的真实长度，然后将所有双字节字符取出后重复计算一次长度
  return str.length + (doubleByteStr ? doubleByteStr.length : 0);
}

/**
 * 截取双字节字符串
 * 使用场景：后台返回的数据是比较长的字符串，完整地渲染出来会破坏表格布局
 * @param {string} 字符串
 * @param {number} 需要截取的长度值
 * @returns {string} 截取完成的字符串
 */
export function truncateStringByByte(str, length) {
  // 传入类型不正确的参数时要有兼容性处理
  if (!isString(str) || !length) {
    return null;
  }
  // 先假定当前字符串长度一定大于指定长度
  let tempStr = str.slice(0, length);
  // 获取字符串的字节长度，
  let byteLength = getStringLengthByByte(tempStr);
  // 如果字节长度表示不需要截取，直接返回
  if (getStringLengthByByte(tempStr) <= length) {
    return tempStr;
  }

  // 假定当前字符串内容均为双字节字符
  // 向下取整，保证截取的字符串长度一定小于或等于指定长度
  let halfLength = Math.floor(length / 2);
  // 再次截取
  tempStr = str.slice(0, halfLength);
  // 重新计算字节长度
  byteLength = getStringLengthByByte(tempStr);

  // 注意这里，字节长度小于指定长度时才开始计算
  while (byteLength < length) {
    // 取出当前字符，判断是否双字节
    if (str.charCodeAt(halfLength) > 255) {
      byteLength += 2;
    } else {
      byteLength += 1;
    }
    // 字节长度超出了指定长度，直接跳出
    if (byteLength > length) {
      break;
    }
    tempStr += str.charAt(halfLength);
    halfLength += 1;
  }
  return tempStr;
}

/**
 * 连字号字符串转驼峰
 */
export function transformToHump(str) {
  return str.replace(/\-(\w)/g, (match, letter) => letter.toUpperCase());
}

/**
 * 驼峰转连字号
 */
export function transformToHyphen(str) {
  return str.replace(/[A-Z]/g, letter => `-${letter.toLocaleLowerCase()}`);
}
```

### 时间管理

时间类型的方法也是比较多的

```javascript
/**
 * 时间格式化工具
 *
 * @param {Number | Date} time 正确的时间戳或时间对象
 * @returns {String} 格式化完成后的时间字符串
 */
export function formatDate(time = Date.now()) {
  if (!isNumber(time) && !isDate(time)) {
    throw new Error('请传入正确的时间戳或时间对象');
  }
  const date = new Date(time);
  // 将当前时间中需要用到的内容都取出来
  const module = {
    Y: date.getFullYear(),
    M: date.getMonth() + 1,
    D: date.getDate(),
    h: date.getHours(),
    m: date.getMinutes(),
    s: date.getSeconds(),
  };
  // 向外暴露一个对象，这样我们可以在未来创建更多更复杂的方法而不用影响基础的计算
  return {
    /**
     * 格式化成指定样式的时间表达方式
     * @param {String} type 时间格式，默认为YYYY-MM-DD hh:mm:ss
     */
    format: function (type = 'YYYY-MM-DD hh:mm:ss') {
      return type.replace(/(Y+|M+|D+|h+|m+|s+)/g, function (str) {
        return ('0' + module[str.slice(-1)]).slice(-str.length);
      });
    },
  };
}

/**
 * 另一种时间格式化工具，具体的配置与逻辑请参考下面链接：
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat
 */
export function formatDate(time) {
  return new Intl.DateTimeFormat('en-CA', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: false,
  }).format(newDate);
}

/**
 * 获取指定时间到当前时间的差值描述
 * xx秒前，xx分钟前，xx小时前，xx天 || xx天前，xx月 || xx月前，xx年前
 */
const timeUnit = {
  minute: 60,
  hour: 60 * 60,
  day: 60 * 60 * 24,
  week: 60 * 60 * 24 * 7,
  month: 60 * 60 * 24 * 30, // 不考虑大小月和二月
  year: 60 * 60 * 24 * 365, // 不考虑闰年与平年
};
function calcDiff(diff, unit) {
  return Math.floor(diff / unit);
}
export function getTimeDiffDesc(time) {
  // 将时间戳转换成秒数
  const start = Date.parse(new Date(time)) / 1000;
  const end = Date.parse(new Date()) / 1000;
  const diff = end - start;

  if (diff < timeUnit.minute) {
    return `${diff}秒前`;
  }

  if (diff < timeUnit.hour) {
    return `${calcDiff(diff, timeUnit.minute)}分钟前`;
  }

  if (diff < timeUnit.day) {
    return `${calcDiff(diff / timeUnit.hour)}小时前`;
  }

  if (diff < timeUnit.week) {
    return `${calcDiff(diff / timeUnit.day)}天前`;
  }

  if (diff < timeUnit.month) {
    return `${calcDiff(diff / timeUnit.week)}周前`;
  }

  if (diff < timeUnit.year) {
    return `${calcDiff(diff / timeUnit.month)}月前`;
  }

  return `${calcDiff(diff / timeUnit.year)}年前`;
}
```

### 防抖

```javascript
/**
 * 防抖
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
      fun.apply(this, args);
    }, wait);
  };
}
```

### 节流

```javascript
/**
 * 一个简单的节流函数
 * @param {function} fun 需要执行的函数
 * @param {number} time 指定的时间周期长度（毫秒）
 *
 * 1. 建立一个变量timer，用于储存当次执行的时间，如果未执行过，则为0
 * 2. 当接受到函数的时候，获取一个当前系统时间，用这个时间与上面的变量作比较，当它们的差值超出设定的延时时间后，执行事件处理函数
 * 3. 修改变量timer的值，让它等于当前的系统时间，用于标记在这个时间已经执行过事件处理函数
 */
export function easyThrottle(fun, time = 500) {
  console.log(fun, time);
  // 用于缓存当前时间，以判断上一次这个方法执行到现在已经用了多久
  let previous = 0;
  // 返回一个闭包函数
  return function (...args) {
    // 当前时间
    let now = Date.now();
    // 上次执行时间到当前时间是否已经允许再次执行
    if (now - previous > time) {
      // 执行函数
      fun.apply(this, args);
      // 修改上次时间为当前时间，下一次进入时就跟当前时间比较
      previous = now;
    }
  };
}
```

### 比较完善的节流方法

```javascript
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
