> Marion 的 react 实战课程 > 第一部分 > axios 封装

# axios 的封装

```javascript
import axios from "axios";
import qs from "qs";

import { message } from "antd";
import { isObject } from "@/utils";

// baseUrl 当我们在进行ajax请求时，如果url中未包含http或https协议头, axios默认会将这段作为前缀与我们的请求地址拼接起来
// 注意：如果我们前面在config-overrides.js中配置了代理，这块就不能拼接baseUrl，代理是无法拦截有完整域名的请求的
// const baseURL = 'https://www.sina.com.cn'
// 超时时间 当请求发送成功后指定的时间内未返回则返回错误
const timeout = 10000;

//使用create方法创建axios实例
export const Service = axios.create({
  timeout,
  // baseURL,
});
// 本地定义的变量名可以被转义和压缩，外部变量与字符串等不可被转义
const location = window.location;

// 定义错误信息
const errorStatusDesc = {
  _400: "未能获取有效服务, 请稍后重试",
  _401: "身份信息异常, 请尝试重新登陆",
  _404: "请求的服务异常, 请稍后重试或联系管理员",
  _500: "内部服务器异常, 请刷新或稍后重试",
  _502: "返回数据无效, 请稍后重试或联系管理员",
  _503: "服务器响应超时, 请稍后重试",
  _504: "网络超时, 请检查网络或稍后重试",
  _999: "服务异常，请联系管理员或稍后重试",
};

/**
 * 显示loading层
 * @param {*} delay
 * 问题：这里为什么要进行一个简单的封装？
 */
function showLoading(delay = 0) {
  message.loading({
    content: "数据加载中，请稍候...",
    // key,用于区分这个message是用来干什么的
    key: "ajaxMessage",
    duration: delay,
  });
}
/**
 * 展示错误信息
 * @param {*} content
 * @param {*} delay
 */
function showError(content, delay = 3) {
  message.error({ content, duration: delay });
}
/**
 * 跳转到login的方法，需要带上origin，方便用户登陆后返回当前页面
 */
function redirectToLogin() {
  location.href = "/login?origin=" + location.pathname;
}

/**
 * 错误信息处理方法
 * @param {*} error
 * @returns
 */
function checkErrorMessage(error) {
  const message = error.message || error.Message;
  // 错误信息里未包含message, 自定义一个错误信息
  if (!message || typeof message !== "string") {
    return errorStatusDesc["_999"];
  }
  // 尝试获取errorCode
  const errorCode = message.match(/\d{3}/g)[0];
  if (!errorCode || errorCode > 503) {
    return errorStatusDesc["_999"];
  }
  // 尝试获取errorCode匹配的错误信息
  const errorMessage = errorStatusDesc["_" + errorCode];
  return errorMessage || errorStatusDesc["_999"];
}
/**
 * 与响应拦截一样，我们需要在这里对api的状态再次进行过滤
 * 需要注意的是，这里的状态要根据你们将来的api返回状态进行调整
 * @param {*} res
 * @param {*} rej
 * @param {*} result
 * @returns
 */
function checkApiError(res, rej, result) {
  if (result.status.code !== 0 || result.status.msg !== "success") {
    // 用户未传入token或token无效
    // if (result.status === 501) {
    //   return redirectToLogin()
    // }
    showError(result.message);
    return rej(new Error(result.message));
  }

  // 成功提示，2秒后关闭
  message.success({ content: "数据加载完成", duration: 2 });
  res(result.data);
}

/**
 * 请求拦截器
 * 我们可以在请求发起之前做一些统一的处理
 * 比如说加token或者展示loading等等
 */
Service.interceptors.request.use((config) => {
  // 所有请求，默认展示loading
  showLoading();
  // 尝试获取token
  const token = sessionStorage.getItem("access_token");
  // 如果没有token，表示用户未登陆或登陆信息已过期
  if (!token && !location.pathname.includes("login")) {
    // 跳转到登陆页
    return redirectToLogin();
  }
  // 注意，这里是合并，必须保证axios原有的config不会被覆盖
  Object.assign(config.headers, {
    "access-token": token,
    "Content-Type": "application/x-www-form-urlencoded",
  });
  return config;
});

/**
 * 响应拦截器
 * 我们可以在这里拦截错误，同时将axios的request外壳去掉
 */
Service.interceptors.response.use(
  // 成功响应
  (response) => {
    // 通过修改延时时长，关闭loading提示
    showLoading(0.5);
    // 返回去掉了axios状态壳的数据(api返回的内容)
    return Promise.resolve(response.data);
  },
  // 失败响应
  (error) => {
    showLoading(0.5);
    // 失败提示
    showError(checkErrorMessage(error));
    // 返回完整的错误信息
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
    // 参数处理，注意这里与get的不同
    // axios的post方法
    Service.post(url, isObject(data) ? qs.stringify(data) : data)
      .then((res) => {
        checkApiError(resolve, reject, res);
      })
      .catch((err) => console.log(err));
  });
}

/**
 * get 方法
 * @param {string} url  接口路由
 * @param {object} data 待上传数据
 */
export function get(url, data = "") {
  return new Promise((resolve, reject) => {
    Service.get(url, {
      params: qs.stringify(data),
    })
      .then((res) => {
        checkApiError(resolve, reject, res.result);
      })
      .catch((err) => console.log(err));
  });
}
```
