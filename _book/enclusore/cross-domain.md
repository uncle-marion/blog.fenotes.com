> Marion 前端教程 > 前端开发应知应会 > 附件 > 跨域

### 什么是跨域

要理解跨域，就必须了解浏览器的同源策略：同源策略/SOP（Same origin policy）是一种约定，它是浏览器最核心也是最基本的安全功能，同源策略会阻止来自其它域的
JavaScript 交互请求。所谓同源指的是两个页面必须使用相同协议、主机和端口号。如果缺少了同源策略，浏览器很容易受到 XSS、CSFR 等攻击，黑客可以通过虚假的网页来获取用户信息然后通过非法请求来操作用户账号。

#### 总结一下同源策略带来的问题：

1. Cookie、LocalStorage 和 IndexDB 无法读取

2. DOM 和 JS 对象无法获取

3. Ajax 请求发送不出去

---

### 怎么解决跨域的问题

#### 配置代理

1. 在 package.json 中配置 proxy 属性，并将该属性的值定义为需要访问的服务器地址

2. 在 webpack 的 devServer 服务中配置代理服务，这里我们使用 customize-cra 来进行配置

```javascript
const {
  override,
  overrideDevServer, // 开发服务器
} = require('customize-cra');

// 配置跨域服务
/**
 * 代理配置
 * 这是一个闭包，返回一个回调函数，customize-cra在执行这个回调的时候，会将当前的开发服务器的配置项以参数的形式传给我们
 * 我们对这个config进行一个简单的处理后返回给customize-cra
 */
function addProxy() {
  return config => {
    // 将配置好的config返回给customize-cra
    return {
      // 保证原有的config不受影响
      ...config,
      // 配置代理
      proxy: {
        // 拦截器（拦截所有以"/api"开头的http请求）
        '/api': {
          // 配置一个base url
          target: 'http://data.fenotes.com',
          // 是否修改源，它决定我们是否跨域
          changeOrigin: true,
          // 是否重写我们的拦截关键字
          // 以下面这行为例，表示将请求url中的/api替换成空字符串
          pathRewrite: {
            '^/api': '',
          },
        },
      },
    };
  };
}

// 将配置的代理插入到服务器配置
module.exports = {
  // 配置devServer属性
  devServer: overrideDevServer(addProxy()),
};
```

#### 使用 JSONP

JSONP 是一种非常成熟且非常简便的跨域方式，因为**在 html 页面中通过相应的标签从不同域名下加载静态资源文件是被浏览器允许的**，我们通过在当前文件中定义一个方法，然后在当前页面动态生成一个 script 标签，通过配置 js 文件的下载地址来传入参数以实现 get 请求的实现：

```javascript
// 定义一个方法
function callback(res) {
  console.log(res);
}

// 动态生成标签
let script = document.createElement('script');
script.src =
  'http://www.xxx.com/xxx.js?callback=callback&params1=123&params2=456';
// 将标签插入Dom
document.body.appendChild(script);
```

服务器在返回的 js 文件中会将我们需要的参数通过调用 callback 方法的方式传给我们

```javascript
callback({
  status: 200,
  msg: 'xxxx',
  data: {...}
})
```

#### 使用 Iframe（domain）

##### 此方案仅限于主域相同子域跨域的场景

父窗口定义

```javascript
<iframe id="iframe" src="http://子域.domain.com/b.html">
<script>
  document.domain = 'domain.com';
  var user = '往子域中传的值'
</script>
```

子窗口读取

```javascript
<script>document.domain = 'domain.com'; var user = window.parent.user</script>
```

#### 使用 Html5 的跨文档通信 Api:postMessage

父窗口发送

```javascript
var openWindow = window.open('http://需要访问的域名', 'title');

openWindow.postMessage('要发送的消息', 'http://需要访问的域名');
```

子窗口接收

```javascript
window.addEventListener('message', e => {
  console.log(e.source); // 发送消息的窗口信息
  console.log(e.origin); // 发送消息的来源信息
  console.log(e.data); // 具体的消息类型
});
```

#### 跨域资源共享（CORS）

通过修改 Access-Control-Allow-Origin 的值实现开发指定服务器的访问请求，这个需要服务器进行配置，我们了解即可

---

### XSS 攻击

英文名 cross-site scripting，意思是跨域脚本攻击：它的原理是往 web 页面里插入恶意的 script 代码。一般来说可以通过对 html 字符转义和对 url 进行编码来解决。

### CSRF 攻击

英文名 cross-site request forgery, 意思是跨域请求伪造，它的攻击实现如下：

用户打开浏览器，访问受信网站 A，输入用户名和密码后获取到网站 A 的 cookie 信息表示登陆成功；

用户在未退出网站 A 的情况下，通过打开一个浏览器标签访问非受信网站 B，网站 B 在收到用户请求后，可以返回一些攻击性代码并发出一个请求要求访问第三方站点 A；

浏览器在接收到攻击性代码后，在用户完全不知情的情况下，浏览器会根据网站 B 的要求携带网站 A 的 Cookie 信息向网站 A 发出请求。此时网站 A 在验证 Cookie 有效的情况下会认为用户的访问是真实有效的，所以会导致网站 B 的恶意代码被执行。

CSRF 攻击的防御措施可以通过 Token 验证、Referer 验证和隐藏令牌验证等方式解决。
