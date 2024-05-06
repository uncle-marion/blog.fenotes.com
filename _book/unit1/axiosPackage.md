> 平安蜀黍的前端教程 > 第一单元 开发环境与工具封装 > axios 封装

### 什么是封装？为什么要封装？

上节课中我们封装了一些小工具，包括对象判断及字符串等。这里用到了**封装**这个概念，那么究竟什么是封装呢？

在软件编程中，封装这个概念的意思就是**将一些复杂的计算数据的方法组合起来，实现细节隐藏，然后向外暴露出一个或多个调用接口**。让使用者只需要关心这个模块或系统怎么使用，而不用关心这个模块或系统是怎么实现的。

比如说，我们上节课封装的时间格式化工具：

```javascript
// 约束参数类型
type ITime = number | Date
interface Module {
  [key: string]: number;
}
// 封装方法
export default function dateFormat(time: ITime = new Date()) {
  if (typeof time === 'number') {
    time = new Date(time);
  }
  // 将当前时间中需要用到的内容都取出来，存成一个对象
  const module: Module = {
    Y: time.getFullYear(),
    M: time.getMonth() + 1,
    D: time.getDate(),
    h: time.getHours(),
    m: time.getMinutes(),
    s: time.getSeconds(),
  };
  // 抛出一个对象或者直接抛出方法都可以
  // 也可以省略这个接口，直接抛出方法内的表达式，但这样的话就需要在dateFormat这个函数里添加一个type参数
  return {
    // 指定接口名字
    format(type = 'YYYY-MM-DD') {
      // 使用replace方法，将type字符串中的字符替换成获取到的数字
      return type.replace(/(Y+|M+|D+|h+|m+|s+)/g, str => ('0' + module[str.slice(-1)]).slice(-str.length));
    };
  }
}

```

如上面的代码所示，dateFormat 这个方法封装后，我们需要格式化时间时只需要调用这个方法，具体怎么实现的我们完全不用关心，比如：

```javascript
// 使用时我们不再需要对时间进行计算，也不需要关心具体的实现，只要调用方法并传参，就能获取到我们想要的数据
dateFormat(Date.now()).format('YYYY-MM-DD');
// 输出你系统当前日期，比如：2021-08-15

// 后台数据返回的是时间戳
const result = {
  timeStamp: '1631712637',
};
dateFormat(result.timeStamp * 1000).format('YYYY-MM-DD hh:mm:ss');
// 输出 2021-08-15 21:30:37
```

### 了解 ajax

很多人以为 ajax 技术是来自于 jQuery 的，但实际上不是，jQuery 只是对原生的 XMLHttpRequest 进行了一个比较完善的封装并提供了较多的 API（接口）：

```javascript
const $ = {};
/**
 * 简单地模拟一下jQuery的ajax封装
 */
// 将对象转换成url字符串的操作
const util = obj => {
  var str = '';
  for (key in obj) {
    str += key + '=' + obj[key] + '&';
  }
  return str.substring(0, str.length - 1);
};

$.ajax = options => {
  var xhr;
  // 如果有XMLHttpRequest对象
  if (window.XMLHttpRequest) {
    xhr = new XMLHttpRequest();
  }
  // 解决IE下没有XMLHttpRequest的问题
  else if (window.ActiveXObject) {
    try {
      xhr = new ActiveXObject('Msxml2.XMLHTTP');
    } catch (e) {
      try {
        xhr = new ActiveXObject('Microsoft.XMLHTTP');
      } catch (e) {}
    }
  }
  // 如果未能成功定义xhr对象，退出请求
  if (!xhr) {
    console.error('代码执行环境不支持xhr请求，请检查执行环境');
    return;
  }
  // 监听xhr的每一次状态改变
  xhr.onreadystatechange = () => {
    // readyState
    // 0: UNSENT => 代理被创建，但尚未调用 open() 方法。
    // 1: OPENED => open() 方法已经被调用
    // 2: HEADERS_RECEIVED => send() 方法已经被调用，并且头部和状态已经可获得。
    // 3: LOADING => 下载中；responseText 属性已经包含部分数据。
    // 4: DONE => 下载操作已完成。
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        // 调用时传入的成功方法
        options.success(xhr.responseText);
      } else {
        // 调用时传入的失败方法
        options.error('请求失败。。各种状态检查。。详情看axios的配置');
      }
    } else {
      console.log('各种读取中。。。');
    }
  };
  // 调用open方法来配置请求参数
  xhr.open(options.method, options.url, true);
  // 设置 Content-Type 为 application/x-www-form-urlencoded
  // 表示以表单的形式传递数据
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  // 调用send方法发送请求数据
  xhr.send(util(options.data));
};
```

封装完成后就可以用了，但这个时期的 ajax 因为缺少了 promise，所以会有回调地狱的问题，为了解决这个问题，出现了新的 fetch 请求技术

### 了解 fetch

fetch 首先解决了回调地狱的问题，他返回的结果是一个 Promise 对象。如果你对 Promise 不熟，可以看这篇[《Promise 详解》]()

#### fetch 的基本用法

```javascript
// 发起请求，默认get
fetch('http://example.com/movies.json', config)
  .then(function (response) {
    return response.json();
  })
  .then(function (myJson) {
    console.log(myJson);
  })
  .catch(function (error) {
    console.log(error.json());
  });
```

[fetch 原码解析](/fetch.md)

#### fetch 优势：

> 语法简洁，更加语义化

> 基于标准 Promise 实现，支持 async/await

> 同构方便，使用 isomorphic-fetch

> 更加底层，提供的 API 丰富（request, response）

> 脱离了 XHR，是 ES 规范里新的实现方式

#### fetch 问题

> fetch 是一个低层次的 API，你可以把它考虑成原生的 XHR，所以使用起来并不是那么舒服，还需要进行封装。

> fetch 只对网络请求报错，对 400，500 都当做成功的请求，服务器返回 400，500 错误码时并不会 reject，只有网络错误这些导致请求不能完成时，fetch 才会被 reject。

> fetch 默认不会带 cookie，需要添加配置项： fetch(url, {credentials: 'include'})

> fetch 不支持 abort，不支持超时控制，使用 setTimeout 及 Promise.reject 的实现的超时控制并不能阻止请求过程继续在后台运行，造成了流量的浪费

> fetch 没有办法原生监测请求的进度，而 XHR 可以

### 了解 axios

axios 是一款非常强大的 HTTP 客户端工具，在浏览器环境中，它是基于 Promise 封装的 XHR，所以我们不仅可以用它来实现远程数据请求，还能调用取消请求、超时处理及进程管理等一系列接口。同时，如果我们需要在服务器端调用，它也可以建立一个 httpy 请求。

#### axios 的基本用法

```javascript
axios({
  method: 'post',
  url: '/user/12345',
  data: {
    firstName: 'Fred',
    lastName: 'Flintstone',
  },
})
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  });
```

#### axios 特性

> 从浏览器中创建 XMLHttpRequest

> 支持 Promise API

> 客户端支持防止 CSRF

> 提供了一些并发请求的接口（重要，方便了很多的操作）

> 从 node.js 创建 http 请求

> 拦截请求和响应

> 转换请求和响应数据

> 取消请求

> 自动转换 JSON 数据

#### axios 的封装

##### 为什么要封装 axios?

一般来说，我们在使用 axios 请求 api 处理数据时，需要一些前期和后期工作，比如请求前需要修改 request 请求头，需要展示 loading 或其它提示信息，需要对参数进行合并和计算；比如请求后需要判断服务器是否正常，数据是否正确返回，统一的错误处理，脱离 axios 的状态信息等等。如果这些代码每个调用者都去写一遍，先不说代码规范和容易出现的 BUG 等，就从代码的冗余量来说也是不合适的。

##### 怎样封装 axios?

封装之前，我们需要先捋清楚自己的需求，在这里我们尝试简单地实现一个封装，也不提更多的需求了，暂时就按上面说的为什么要封装的来吧

- 修改 request 请求头
- 展示 loading 或其它提示信息
- 参数的合并与计算
- 服务器状态的判断与错误处理
- 接口返回的数据信息处理
- 数据脱壳

- 第一步：新建一个 axios 实例

在做所有事情之前，我们需要先创建一个 axios 实例，然后再通过这个实例提供的接口去访问它的方法：

```javascript
import axios from 'axios';

// 首先创建一个默认配置项，我们可以在这里配置一些初始参数
const defalutConfig = {
  // 响应超时时长，当接口响应时间超过这个时间时，axiox会放弃请求并返回接口超时的错误
  timeout: 30000,
};

// 调用axios的create方法，创建一个axios实例
const instance = axios.create(defalutConfig);

// 创建请求拦截器
instance.interceptors.request.use(
  config => {
    // 请求拦截，我们可以在这里拦截到请求并对config进行配置，比如header
    console.log('这是请求发起之前', config);
  },
  error => {
    // 请求出错了，可以在这里打印error看看是什么问题
    console.log('发起请求时报错了', error);
  }
);
// 创建响应拦截器
instance.interceptors.response.use(
  response => {
    // 响应拦截，我们可以在这里拦截到服务器响应
    console.log('服务器正确响应了', response);
  },
  error => {
    // 服务器返回错误，可以在这打印错误是什么
    console.log('服务器返回错误了', error);
  }
);

// 创建请求转换器
instance.defaults.transformRequest = function (data) {
  console.log(data);
};
// 创建响应转换器
instance.defaults.transformResponse = function (data) {
  console.log(data);
};
```

注：转换器和拦截器都可以实现转换请求和响应数据的需求，请求时，拦截器主要负责修改 config 配置项，而转换器更多用来转换请求体，比如转换对象为字符串。在请求响应后，拦截器可以拿到 response，转换器主要负责处理响应体，比如转换字符串为对象。

请求转换器（transformRequest）主要用来根据 data 格式，设置 http 请求头；响应转换器（transformResponse）可以根据实际业务中服务端返回的数据格式，统一设置转换方法。而拦截器是被包装成了 Promise，显然主要是用它来处理异步的。

转换器是处理数据和请求头(config.headers)的，不能处理异步，不会阻断请求和响应流程；而拦截器可以处理异步需求，可以使用拦截器阻断请求或响应流程。

##### 请求拦截常见配置

```javascript
function getToken() {
  // 从redux或storage或cookie里获取token
  return 'xxxxxxxxx';
}
// 请求拦截
instance.interceptors.request.use(
  config => {
    // 请求拦截，我们可以在这里拦截到请求并对config进行配置，比如header
    console.log('这是请求发起之前', config);

    // 判断是否有全局的loading设置
    if (config.showLoading) {
      // 调用antd的loading
    }

    // 返回设定的一些配置
    return {
      // 保持原来的配置不受影响
      ...config,
      ...{
        headers: {
          // token,一般用来发送给接口判断用户是否已获取相关权限
          // 广义来说，webapp有两种用户，一种为游客，一种为注册用户
          // 注册用户会再根据他的权限细分为拥有各种权限的用户组
          'access-token': getToken(),
          // content-type 一般用于告知接口，我们需要用什么样的方式来获取数据，如果这个属性不正确可能会出现一些意想不到的结果
          // 比如明明是获取一段数据，接口可能会返回一个文件地址让你下载
          // 如果是下载文件，这里我们需要改成：application/octet-stream
          // 如果是上传文件，这里我们需要改成：multipart/form-data
          // 更多配置类型可以参考 https://www.runoob.com/http/http-content-type.html
          // 默认格式：以key:value格式发送数据到服务器（也是表单的默认提交格式）
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    };
  },
  error => {
    // 请求出错了，可以在这里打印error看看是什么问题
    console.log('发起请求时报错了', error);
    // 返回错误信息给调用者
    return Promise.reject(error);
  }
);
```

##### 响应拦截常见配置

相对于请求拦截，响应拦截就要复杂很多了，我们需要通过 reponse 中的 code 来判断服务器是否正确返回，如果正确返回还可以对接口的一些常见错误进行统一处理

```javascript
// 响应拦截器
instance.interceptors.response.use(
  response => {
    // 响应拦截，我们可以在这里拦截到服务器响应
    console.log('服务器正确响应了', response);
    // 判断是否有全局的loading设置
    if (response.config.showLoading) {
      // 隐藏antd的loading
    }
    // 如果返回的状态码为200，说明接口请求成功，可以正常拿到数据，为了减少调用方的代码，
    // 我们在这里只返回reaponse中的data部分，也就是我们的api返回的内容
    // 甚至我们还可以通过传入一些配置参数，在这里对一些特定的api状态码进行统一处理，更进一步地减少调用方的代码
    if (response.status === 200) {
      return response.data;
      // return checkAPIMessage(response)
    }
    // 检查错误
    // return Promise.reject(checkErrorMessage(response))
  },
  // 服务器返回非2开头状态码的情况
  error => {
    // 服务器返回错误，可以在这打印错误是什么
    console.log('服务器返回错误了', error);
    //
  }
);
```

##### 封装一些固定的请求减少调用时代码量

```javascript
/**
 * 向外抛出的简易方法，可以有效减少固定格式的请求参数传递
 * @param {*} url
 * @param {*} data
 * @returns
 */
export function post(url, data) {
  // axios的返回本来就是一个Promise，这里为什么还要返回一个新的promise?
  return new Promise((resolve, reject) => {
    instance
      // 如果data是对象，将其转换为key=value字符串
      .post(url, isObject(data) ? qs.stringify(data) : data)
      .then(res => {
        resolve(res);
      });
  });
}
```

##### 最后的完整代码

因为时间有限，可试验服务器有限，这段代码中只处理了部分请求状态，其它的状态可能需要更多的运行环境来进行完善。

请求类主文件：request.ts

```javascript
import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'
import { notification } from 'antd'
import { storageManage } from 'mkit-utils'
import Loading from '@/components/Loading'
import ErrorLog from '@/utils/errorLog'

import {
  InstanceRequestType,
  InstanceResponseType,
  optionsType,
} from './services'

import '@/mocks'

// 用于处理状态错误
enum rsponseStatusDesc {
  '服务器成功返回请求的数据。' = 200,
  '新建或修改数据成功。' = 201,
  '一个请求已经进入后台排队（异步任务）。' = 202,
  '删除数据成功。' = 204,
  '发出的请求有错误，服务器没有进行新建或修改数据的操作。' = 400,
  '用户没有权限（令牌、用户名、密码错误）。' = 401,
  '用户得到授权，但是访问是被禁止的。' = 403,
  '发出的请求针对的是不存在的记录，服务器没有进行操作。' = 404,
  '请求的格式不可得。' = 406,
  '请求的资源被永久删除，且不会再得到的。' = 410,
  '当创建一个对象时，发生一个验证错误。' = 422,
  '服务器发生错误，请检查服务器。' = 500,
  '网关错误。' = 502,
  '服务不可用，服务器暂时过载或维护。' = 503,
  '网关超时。' = 504,
}

interface responseType<P> extends AxiosResponse<P> {
  config: {
    method: string
    url: string
  }
}

/**
 * 创建request类
 * Q: 约束实例化request时传入参数类型
 * P: 声明服务器返回状态类型
 */
export default class Request<
  // 表示Q类型继承自InstanceRequestType，我们可以修改和增加
  Q extends InstanceRequestType = InstanceRequestType,
  // 表示P类型为可选类型，如果不传则默认以InstanceResponseType来约束
  P = InstanceResponseType
> {
  public instance: any
  // 用于管理请求队列
  public requestList = new Map()

  constructor({
    baseURL = '/',
    timeout = 3e4,
    useLoading = true,
    useErrHandler = true,
    retrySetting = { count: 3, delay: 3000 },
    ...options
  }: Q) {
    // 创建axios实例
    this.instance = axios.create({
      baseURL,
      timeout,
    })
    // 注意拦截器的执行顺序：请求拦截器是最后注入的最先执行，而响应拦截器则相反
    // 注入实例请求拦截
    if (options.requestInterceptor) {
      this.instance.interceptors.request.use(
        options.requestInterceptor,
        options.requestCatch
      )
    }
    // 定义全局请求拦截
    this.instance.interceptors.request.use(
      (config: Q) => {
        console.log(config)
        // 如果需要使用全局Loading；
        if (useLoading) {
          // 全局loading
          Loading.show()
        }
        // 因为每一个实例都可能会有不同的配置，所以这里的config还会被实例拦截器进行更多的调整
        return config
      },
      (err: AxiosError) => {
        return Promise.reject(err)
      }
    )
    // 定义全局响应拦截
    this.instance.interceptors.response.use(
      // 成功拦截器
      (res: responseType<P>) => {
        Loading.hide()
        const {
          config: { method, url },
        } = res
        // 如果成功，去除http的状态和请求信息，直接返回api的消息
        if (res.status === 200 && res.statusText === 'OK') {
          this.requestList.delete(method + url)
          return res.data
        }

        // 其它消息返回到错误的响应拦截里
        return Promise.reject(res)
      },
      // 失败拦截器
      (err: AxiosError) => {
        Loading.hide()

        // 取出错误消息中携带的请求配置信息
        // 这里err.toJSON方法返回的是一个空对象，我们需要用到的属性可能不存在，临时写了一个描述，后面
        // 可以在service.d.ts中对所需要用到的属性进行声明
        const { config } = err.toJSON() as { config: any }
        // 从列表中取出请求
        const requestKey = config.method + config.url
        // 这里的条件需要更多的实验，暂时只能这样判断
        if (config && this.requestList.has(requestKey)) {
          const currentRequest = this.requestList.get(requestKey)
          // 处理超时错误
          if (
            currentRequest &&
            err.message.includes('timeout') &&
            currentRequest.count < retrySetting.count
          ) {
            // 增加请求数量
            currentRequest.count += 1
            // 指定时间后重新发起请求
            return new Promise(resolve => {
              setTimeout(() => {
                // 直接请求当前axios实例方法
                resolve(this.instance.request(config))
              }, retrySetting.delay)
            })
          }
        }

        // 其它错误都放到错误处理程序中进行匹配后返回格式统一的错误信息由实例的错误拦截器决定怎么提示用户
        return Promise.reject(useErrHandler ? this.errorHandler(err) : err)
      }
    )
    // 注入实例响应拦截
    if (options.responseInterceptor) {
      this.instance.interceptors.response.use(
        options.responseInterceptor,
        options.responseCatch
      )
    }
  }

  errorHandler(err: AxiosError) {
    const { response, code } = err
    // 断网
    // if (response?.status === 0 || code === 'ERR_NETWORK') {
    // }

    // if (response?.status === 404 || code === 'ERR_BAD_REQUEST') {
    // }
    // if (response && response.status) {
    //   const errorText =
    //     rsponseStatusDesc[response.status] || response.statusText
    //   const { status, url } = response

    //   notification.error({
    //     message: `请求错误 ${status}: ${url}`,
    //     description: errorText,
    //   })
    // } else if (!response) {
    //   notification.error({
    //     description: '您的网络发生异常，无法连接服务器',
    //     message: '网络异常',
    //   })
    // }
    return response
  }

  request<D>(options: optionsType): D | Promise<D> {
    // 因为需要管理请求队列，所以这里需要使用promise封装出一个作用域
    return new Promise((resolve, reject) => {
      // 注意，因为执行优先级的关系，单一请求是没办法在实例拦截器之后运行的，所以只能将拦截器的配置注入到config中，由统一拦截器进行处理
      const { url, data, params, method, cancelToken } = options
      // 使用方法和url拼成一个key，用于管理请求队列
      const requestKey = method + url

      // 记录请求参数
      const requestParams =
        method === 'get' || method === 'delete'
          ? JSON.stringify(params)
          : JSON.stringify(data)

      // 检查队列中是否已经有相同请求，如果有则取消上一个请求
      if (this.requestList.has(requestKey)) {
        const currentRequest = this.requestList.get(requestKey)
        currentRequest.cancel.abort()
      }

      // 创建用于取消请求的实例
      const cancelInstaace = new AbortController()
      // 将取消请求的方法写入到options中
      options.signal = cancelInstaace.signal
      // 将当前请求写入队列
      this.requestList.set(requestKey, {
        requestParams,
        count: 0, // 这个次数是用于处理超时重连的次数
        cancel: cancelInstaace, // 用于取消请求的实例
      })

      // 开始调用请求
      this.instance.request(options).then(resolve).catch(reject)
      // .then((res: D) => {
      //   // 正确响应，请求结束，从队列中去除对应的请求
      //
      //   resolve(res)
      // })
      // .catch((err: AxiosError) => {
      //   // 错误响应，除超时外，其它所有错误直接从队列中删除本次请求
      //   this.requestList.delete(requestKey)
      //   reject(err)
      // })
    })
  }

  /**
   * post方法
   * 用于向服务器传递数据，可以更新数据也可以增加数据，一般来说我们需要增加
   * 新数据时使用这个方法，但有的公司所有的提交操作都使用post方法，也是可以
   * 的，只是不太符合规范
   * 请求发起时可以能过传入泛型<DT>(data type)来约束返回值与泛型<P>(params type)来声明传入参数
   * @param {string} url 需要访问的接口地址
   * @param {any} data 需要传递的参数
   * @param options 配置参数，可以参考axios文档
   * @returns
   */
  post<DT = unknown, PT = any>(
    url: string,
    data: PT,
    options?: AxiosRequestConfig
  ) {
    return this.request<DT>({
      ...options,
      method: 'post',
      url,
      data,
    })
  }

  /**
   * get方法
   * 通过向url添加参数来获取指定的远端资源，它的操作不会增加修改远端数据。
   * 无论重复多少次，参数一致的情况下其返回结果都是一样的。
   * 注意：get请求会被浏览器自动缓存，如果需要更新数据，最好是携带不同的参
   * 数（比如时间戳）来更新数据
   */
  get<DT = unknown, PT = any>(
    url: string,
    data: PT,
    options?: AxiosRequestConfig
  ) {
    return this.request<DT>({
      ...options,
      method: 'get',
      url,
      params: data,
    })
  }

  /**
   * put方法
   * 与get相反，通过向url添加参数来更新指定的远端资源，它的操作会更新指定
   * 数据但不会增加新的条目，无论多少次操作，参数一致的情况下操作其结果也是
   * 一致的。一般来说我们对已有数据进行编辑操作时使用put方法
   * @returns
   */
  put<DT = unknown, PT = any>(
    url: string,
    data: PT,
    options?: AxiosRequestConfig
  ) {
    return this.request<DT>({
      ...options,
      method: 'put',
      url,
      data,
    })
  }

  /**
   * delete方法，用于删除服务器中的数据
   * @returns
   */
  del<DT = unknown, PT = any>(
    url: string,
    data: PT,
    options?: AxiosRequestConfig
  ) {
    return this.request<DT>({
      ...options,
      method: 'delete',
      url,
      params: data,
    })
  }
}

```

这个文件目前只是将将够用，希望在后面的课程中你们能逐步完善它。
不同接口服务器的实例配置文件：admin.ts

```javascript
import { storageManage } from 'mkit-utils'
import Request from './request'
import { InstanceResponseType, InstanceRequestType } from './services'

// 实例化一个request对象
const Sapi = new Request<InstanceRequestType, InstanceResponseType>({
  baseURL: '/sapi',
  timeout: 3e4,
  useLoading: true,
  useErrHandler: true,
  retrySetting: {
    count: 3,
    delay: 1000,
  },
  requestInterceptor(config) {
    config.headers = {
      ...config.headers,
      'Authori-zation': `Bearer ${storageManage.get('token')}`,
    }
    return config
  },
  requestCatch(err) {
    console.log(err, '%%%%%%%%%')
    return Promise.reject(err.toJSON())
  },
  responseInterceptor(res) {
    // 注意，这里获取到的res是服务器返回的数据，已经没有了axios包裹的那层壳了
    // 因为在request文件里的全局拦截器封装里边是直接做了脱壳处理的
    if (res.status === 200) {
      if (res.token) {
        storageManage.set('token', res.token, res.expires_time)
      }
      return res
    }
    // if (!res.status) {
    //   ajaxError(['服务异常, 请联系管理员或稍后重试'])
    // }
    // if (res.status === 410000) {
    //   reLogged()
    // }
    console.log(res, '&&&&&&&&&&')
    return Promise.reject(res)
  },
  responseCatch(err) {
    return Promise.reject(err)
  },
})

export default Sapi

```

---

### 课后问题

- 我们为什么要封装 axios
- 你在封装 axios 时做了哪些事情
- 怎样配置全局拦截器
- axios 拦截器与转换器有什么不同
- 常见的服务器错误码有哪些
