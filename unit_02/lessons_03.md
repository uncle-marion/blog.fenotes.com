> 企业项目实战 > 第二部分 > React 基础回顾

#### 小工具的封装

```javascript
const toString = Object.prototype.toString;

/**
 * 判断是否是函数对象
 *
 * @param {Object} val 待判断的对象
 * @returns {boolean} true || false
 */
function isFunction(val) {
  return toString.call(val) === '[object Function]';
}

/**
 * 判断是否为数组
 *
 * @param {Object} val 待判断的对象
 * @returns {boolean} true || false
 */
function isArray(val) {
  return toString.call(val) === '[object Array]';
}

/**
 * 判断是否为对象
 *
 * @param {Object} val 待判断的对象
 * @returns {boolean} true || false
 */
function isObject(val) {
  return toString.call(val) === '[object Object]';
}

/**
 * 判断是否是字符串
 *
 * @param {Object} val 待判断的对象
 * @returns {boolean} true || false
 */
function isString(val) {
  return typeof val === 'string';
}

/**
 * 判断是否是数字
 *
 * @param {Object} val 待判断的对象
 * @returns {boolean} true || false
 */
function isNumber(val) {
  return typeof val === 'number';
}

/**
 * 判断是否是时间对象
 *
 * @param {Object} val 待判断的对象
 * @returns {boolean} true || false
 */
function isDate(val) {
  return toString.call(val) === '[object Date]';
}

/**
 * 判断是否是文件对象
 *
 * @param {Object} val 待判断的对象
 * @returns {boolean} true || false
 */
function isFile(val) {
  return toString.call(val) === '[object File]';
}

/**
 * 去除文字前后的空白
 *
 * @param {String} str 待处理文字
 * @returns {String} 处理完成后的文字
 */
function trim(str) {
  return str.replace(/^\s*/, '').replace(/\s*$/, '');
}

/**
 * 时间格式化工具
 *
 * @param {Number | Date} time 正确的时间戳或时间对象
 * @param {String} type 时间格式，默认为YYYY-MM-DD hh:mm:ss
 * @returns {String} 格式化完成后的时间字符串
 */
function formatDate(time, type = 'YYYY-MM-DD hh:mm:ss') {
  if (!isNumber || !isDate(time)) {
    throw '请传入正确的时间戳或时间对象';
  }
  const date = new Date(time);
  const module = {
    Y: date.getFullYear(),
    M: date.getMonth() + 1,
    D: date.getDate(),
    h: date.getHours(),
    m: date.getMinutes(),
    s: date.getSeconds(),
  };
  return type.replace(/(Y+|M+|D+|h+|m+|s+)/g, function (str) {
    return ((str.length > 1 ? '0' : '') + module[str.slice(-1)]).slice(
      -str.length
    );
  });
}

// 使用replace替换LocaleDateString的斜杠，顺便把日期数字不足两位的补到两位
// newDate.toLocaleDateString().replace(/\/(\d+)/g, (all, count) => {
//   return (count > 9 ? '-' : '-0') + count
// }) +
// ' ' +
// newDate.toTimeString().slice(0, 8)

module.exports = {
  isFunction,
  isObject,
  isArray,
  isString,
  isNumber,
  isDate,
  isFile,
};
```

### axios 与请求封装

```javascript
import axios from 'axios';
import qs from 'qs';
import { isObject } from './utils';

/**
 * 创建一个axios实例
 */
const service = axios.create({
  // 超时设置, 超过这个时间请求将会被中断
  timeout: 10000,
  // 允许携带token
  withCredentials: true,
  responseType: 'json',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
});

/**
 * request => 请求拦截器
 */
service.interceptors.request.use(
  config => {
    // 检查本地是否有对应的token
    const token = sessionStorage.getItem('access_token');
    if (!token) {
      // 跳转到登陆页
    }
    Object.assign(config.headers, {
      'access-token': token,
      'Content-Type': 'application/x-www-form-urlencoded',
    });
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

/**
 * response => 响应拦截器
 */
service.interceptors.response.use(
  function (response) {
    // 确认成功响应，丢弃外层包裹返回接口数据
    if (response.status === 200 && response.statusText === 'OK') {
      sessionStorage.setItem('token', response.headers['access-token']);
      return response.data;
    }
  },
  function (error) {
    // 对响应错误做点什么
    return Promise.reject(error);
  }
);

/**
 * post 方法
 * @param {string} url  必填 接口路由
 * @param {object} data 必填 待上传数据
 */
export function post(url, data) {
  return new Promise((resolve, reject) => {
    service
      .post(url, isObject(data) ? qs.stringify(data) : data)
      .then(res => resolve(res))
      .catch(err => console.log(err));
  });
}

/**
 * get 方法
 * @param {string} url  接口路由
 * @param {object} data 待上传数据
 */
export function get(url, data = '') {
  return new Promise((resolve, reject) => {
    service
      .get(url, {
        params: qs.stringify(data),
      })
      .then(res => {
        // 判断接口是否正常，如果正常返回数据，否则抛出错误
        if (res.code === 200 && res.message.includes('success')) {
          resolve(res.data);
        }
        throw res;
      })
      .catch(err => console.log(err));
  });
}

export default service;
```
