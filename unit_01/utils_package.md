> Marion 的 react 实战课程 > 第一部分 > 全站通用小工具封装

# 全站通用小工具封装

```javascript
const toString = Object.prototype.toString;

/**
 * 判断是否是函数对象
 *
 * @param {Object} val 待判断的对象
 * @returns {boolean} true || false
 */
export function isFunction(val) {
  return toString.call(val) === "[object Function]";
}

/**
 * 判断是否为数组
 *
 * @param {Object} val 待判断的对象
 * @returns {boolean} true || false
 */
export function isArray(val) {
  return toString.call(val) === "[object Array]";
}

/**
 * 判断是否为对象
 *
 * @param {Object} val 待判断的对象
 * @returns {boolean} true || false
 */
export function isObject(val) {
  return toString.call(val) === "[object Object]";
}

/**
 * 判断是否是字符串
 *
 * @param {Object} val 待判断的对象
 * @returns {boolean} true || false
 */
export function isString(val) {
  return typeof val === "string";
}

/**
 * 判断是否是数字
 *
 * @param {Object} val 待判断的对象
 * @returns {boolean} true || false
 */
export function isNumber(val) {
  return typeof val === "number";
}

/**
 * 判断是否是时间对象
 *
 * @param {Object} val 待判断的对象
 * @returns {boolean} true || false
 */
export function isDate(val) {
  return toString.call(val) === "[object Date]";
}

/**
 * 判断是否是文件对象
 *
 * @param {Object} val 待判断的对象
 * @returns {boolean} true || false
 */
export function isFile(val) {
  return toString.call(val) === "[object File]";
}

/**
 * 去除文字前后的空白
 *
 * @param {String} str 待处理文字
 * @returns {String} 处理完成后的文字
 */
export function trim(str) {
  return str.replace(/^\s*/, "").replace(/\s*$/, "");
}

/**
 * 时间格式化工具
 *
 * @param {Number | Date} time 正确的时间戳或时间对象
 * @param {String} type 时间格式，默认为YYYY-MM-DD hh:mm:ss
 * @returns {String} 格式化完成后的时间字符串
 */
export function formatDate(time, type = "YYYY-MM-DD hh:mm:ss") {
  if (!isNumber(time) && !isDate(time)) {
    throw new Error("请传入正确的时间戳或时间对象");
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
  return type.replace(/(Y+|M+|D+|h+|m+|s+)/g, function (str) {
    return ("0" + module[str.slice(-1)]).slice(-str.length);
  });
}

console.log(formatDate(Date.now(), "MM-DD hh:mm"));

// 使用replace替换LocaleDateString的斜杠，顺便把日期数字不足两位的补到两位
// newDate.toLocaleDateString().replace(/\/(\d+)/g, (all, count) => {
//   return (count > 9 ? '-' : '-0') + count
// }) +
// ' ' +
// newDate.toTimeString().slice(0, 8)
```

## 防抖

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

## 节流

```javascript
/**
 * 一个简单的节流函数
 * @param {function} fun 需要执行的函数
 * @param {number} time 指定的时间周期长度（毫秒）
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

/**
 * 1. 建立一个变量timer，用于储存当次执行的时间，如果未执行过，则为0
 * 2. 当接受到函数的时候，获取一个当前系统时间，用这个时间与上面的变量作比较，当它们的差值超出设定的延时时间后，执行事件处理函数
 * 3. 修改变量timer的值，让它等于当前的系统时间，用于标记在这个时间已经执行过事件处理函数
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
    console.warn("options的leading属性和trailing属性，至少要有一个为true!");
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
