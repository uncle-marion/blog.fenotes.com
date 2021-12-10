> Marion 的 react 实战课程 > 第一部分 > axios 封装

### 什么是封装？为什么要封装？

在开始今天的课程之前，我们先来看一段代码：

```javascript
function onClick() {
  window.location.href = 'http://localhost:4000/unit_01/axios_package.html';
}

function onChange() {
  window.location.href = 'http://localhost:4000/unit_01/axios_package.html';
}

function onBlur() {
  window.location.href = 'http://localhost:4000/unit_01/axios_package.html';
}
```

当我们使用压缩工具对它进行压缩后它长成这样子：

<img src="../assets/images/unit_01/ugjs_01.png">

从上面这段代码中我们可以看到，当我们引用一个嵌套较深的对象属性或方法时，因为它的名字不可省略不可重构，导致在对文件进行压缩后其体积并没有太大的变化。那么我们应该怎样解决这个问题呢？看下面的代码：

```javascript
function linkTo(link) {
  window.location.href = link;
}
function onClick() {
  linkTo('http://localhost:4000/unit_01/axios_package.html');
}

function onChange() {
  linkTo('http://localhost:4000/unit_01/axios_package.html');
}

function onBlur() {
  linkTo('http://localhost:4000/unit_01/axios_package.html');
}
```

然后我们再对它执行压缩：

<img src="../assets/images/unit_01/ugjs_02.png">

这一次我们可以看到，它的长度短了很多，因为函数名可以被代码工具定义一个别名，这样我们的函数名和调用都变短了，但还有一些可以优化的空间，比如 baseUrl

```javascript
var baseUrl = 'http://localhost:4000';
function linkTo(link) {
  window.location.href = baseUrl + link;
}
function onClick() {
  linkTo('/unit_01/axios_package.html');
}

function onChange() {
  linkTo('/unit_01/axios_package.html');
}

function onBlur() {
  linkTo('/unit_01/axios_package.html');
}
```

这次压缩后代码体积就更小了：

<img src="../assets/images/unit_01/ugjs_03.png">

通过上面的一些封装操作，我们将一段 280 个字节的代码成功压缩到了 220 个字节，而这仅仅只是极小的一个代码片段，由此可见，当我们对整个项目中用到的方法进行规范化的封装以后能节约多少资源。

再来解释一下什么是封装，在软件编程中，封装这个概念的意思就是**将一些相关的数据和方法组合起来，将它们合并成一个对象**，实现细节隐藏，然后向外暴露出一个或多个接口，让使用者只需要关心这个模块或系统怎么使用，而不用关心这个模块或系统是怎么实现的。

像我们上面这种，将大量重复性的操作封装成一个函数，然后对这个函数进行调用以尽量减少冗余代码和无效逻辑；也可以将更多的方法和属性封装成一个构造函数或者类，然后通过实例化的方式来继承它的属性和方法。

### axios 的封装

##### 为什么要封装 axios?

一般来说，我们在使用 axios 请求 api 处理数据时，需要经过很多的前期和后期工作，比如请求前需要修改 request 请求头，需要展示 loading 或其它提示信息，需要对参数进行合并和计算；比如请求后需要判断服务器是否正常，数据是否正确返回，统一的错误处理，脱离 axios 或 fetch 请求的状态信息等等。如果这些代码每个调用者都去写一遍，先不说代码规范和容易出现的 BUG 等，就从代码的冗余量来说也是不合适的。

##### 怎样封装 axios?

封装之前，我们需要先捋清楚自己的需求，也不提更多的需求了，暂时就按上面的来吧

- 修改 request 请求头
- 展示 loading 或其它提示信息
- 参数的合并与计算
- 服务器状态的判断与错误处理
- 接口返回的数据信息处理
- 数据脱壳

- 第一步：新建一个 axios 实例

在做所有事情之前，我们必须先创建一个 axios 实例，然后再通过这个实例提供的

react 的大致渲染流程，setState 更新状态, render 更新虚拟 DOM, 通过 diff 算法比较与真实 DOM 的区别，最后更新真实 DOM 并对页面进行重绘

`javascript`

```javascript
import axios from 'axios';
import qs from 'qs';

import { message } from 'antd';
import { isObject } from '@/utils';

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
  _400: '未能获取有效服务, 请稍后重试',
  _401: '身份信息异常, 请尝试重新登陆',
  _404: '请求的服务异常, 请稍后重试或联系管理员',
  _500: '内部服务器异常, 请刷新或稍后重试',
  _502: '返回数据无效, 请稍后重试或联系管理员',
  _503: '服务器响应超时, 请稍后重试',
  _504: '网络超时, 请检查网络或稍后重试',
  _999: '服务异常，请联系管理员或稍后重试',
};

/**
 * 显示loading层
 * @param {*} delay
 * 问题：这里为什么要进行一个简单的封装？
 */
function showLoading(delay = 0) {
  message.loading({
    content: '数据加载中，请稍候...',
    // key,用于区分这个message是用来干什么的
    key: 'ajaxMessage',
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
  location.href = '/login?origin=' + location.pathname;
}

/**
 * 错误信息处理方法
 * @param {*} error
 * @returns
 */
function checkErrorMessage(error) {
  const message = error.message || error.Message;
  // 错误信息里未包含message, 自定义一个错误信息
  if (!message || typeof message !== 'string') {
    return errorStatusDesc['_999'];
  }
  // 尝试获取errorCode
  const errorCode = message.match(/\d{3}/g)[0];
  if (!errorCode || errorCode > 503) {
    return errorStatusDesc['_999'];
  }
  // 尝试获取errorCode匹配的错误信息
  const errorMessage = errorStatusDesc['_' + errorCode];
  return errorMessage || errorStatusDesc['_999'];
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
  if (result.status.code !== 0 || result.status.msg !== 'success') {
    // 用户未传入token或token无效
    // if (result.status === 501) {
    //   return redirectToLogin()
    // }
    showError(result.message);
    return rej(new Error(result.message));
  }

  // 成功提示，2秒后关闭
  message.success({ content: '数据加载完成', duration: 2 });
  res(result.data);
}

/**
 * 请求拦截器
 * 我们可以在请求发起之前做一些统一的处理
 * 比如说加token或者展示loading等等
 */
Service.interceptors.request.use(config => {
  // 所有请求，默认展示loading
  showLoading();
  // 尝试获取token
  const token = sessionStorage.getItem('access_token');
  // 如果没有token，表示用户未登陆或登陆信息已过期
  if (!token && !location.pathname.includes('login')) {
    // 跳转到登陆页
    return redirectToLogin();
  }
  // 注意，这里是合并，必须保证axios原有的config不会被覆盖
  Object.assign(config.headers, {
    'access-token': token,
    'Content-Type': 'application/x-www-form-urlencoded',
  });
  return config;
});

/**
 * 响应拦截器
 * 我们可以在这里拦截错误，同时将axios的request外壳去掉
 */
Service.interceptors.response.use(
  // 成功响应
  response => {
    // 通过修改延时时长，关闭loading提示
    showLoading(0.5);
    // 返回去掉了axios状态壳的数据(api返回的内容)
    return Promise.resolve(response.data);
  },
  // 失败响应
  error => {
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
      .then(res => {
        checkApiError(resolve, reject, res);
      })
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
    Service.get(url, {
      params: qs.stringify(data),
    })
      .then(res => {
        checkApiError(resolve, reject, res.result);
      })
      .catch(err => console.log(err));
  });
}
```
