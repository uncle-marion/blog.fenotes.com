> Marion 的 react 实战课程 > 第二单元 React 基础与关联知识 > 路由与嵌套路由

### 什么是 React Router

通俗地说：**路由，可以简单地看成是一个个的路标，告诉我们通过什么样的路径可以访问到对应的组件**。有了路由，我们才能通过在地址栏输入 url 地址访问我们想要访问的页面。

react-router 最主要的功能就是给我们提供的一些可以管理 URL 的组件，通过这些组件实现对 url 变化的监听，然后根据这些变化来实时切换我们在 Routes 中定义的相关子组件以达到实现页面路由的映射、参数的解析和传递。

#### React Router 提供的组件

##### BrowserRouter 或 HashRouter 组件

> Router 中包含了对路径改变的监听, 并且会将相应的路径传递给子组件  
> BrowserRouter 使用了 history 模式  
> HasRouter 使用了 hash 模式

##### Link 组件和 NavLink 组件

> 通常路径的跳转时是使用 Link, 最终会被渲染成 a 元素  
> NavLink 是在 Link 基础之上增加了一些样式属性  
> to 属性: link 组件中最重要的属性, 用于设置跳转到的路径

##### Route 组件 用于路径的匹配

> path 属性: 用户设置匹配到的路径  
> component 属性: 设置匹配到的路径后, 渲染的组件  
> exact 属性: 精准匹配, 只有精准匹配到完全一致的路径, 才会渲染对应的组件

##### 实例

```javascript
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

render(
  <Router>
    {/* Route是路由的最小组件, 一般来说Router里会包含多个Route, 在渲染时根据path来判断是否进行渲染。*/}
    {/* 如果当前location.pathname匹配props.path规则，就渲染props.component中的内容, 否则渲染null */}
    <Route path="/" component={App} />
  </Router>,
  // 获取容器组件
  document.getElementById('app')
);
```

react-router 向外提供两个接口组件用于管理浏览器路由，一个是 hashRouter，一个是 browserRouter；这两个 API，hashRouter 使用了 location 的 hash 特性，browserRouter 则使用了 h5 的 history 特性。下面我们先了解一下这两个特性的实现原理。

#### hashRouter

hashRouter 是通过监听地址栏 hash 的变化来更新 root 节点中显示的组件内容。

- URL 的 hash 也就是锚点(#), 本质上是改变 window.location 的 href 属性。我们可以直接赋值 location.hash 改变 url, 但是页面不发生刷新。react-router 根据 hash 的这种特性，实现了 hashRouter。

```javascript
// 用于显示内容的主容器，可以理解为我们的public中index.html中的root
const routerView = document.querySelector('.router-view');
// 监听location的hashchange事件，根据匹配的参数切换显示的内容
window.addEventListener('hashchange', () => {
  switch (window.location.hash) {
    case '#/home':
      routerView.innerHTML = '首页';
      break;
    case '#/about':
      routerView.innerHTML = '关于页';
      break;
    default:
      routerView.innerHTML = '';
      break;
  }
});
```

#### BrowserRouter

与 HashRouter 不同，BrowserRouter 的实现是建立在 html5 的新 API history 上的，同样也是利用了 history 的改变 Url 却不刷新页面的方式。

- history 接口是 HTML5 新增的, 它有六种模式改变 URL 而不刷新页面

|          API | 作用               |
| -----------: | :----------------- |
| replaceState | 替换原来的路径     |
|    pushState | 使用新的路径       |
|     popState | 路径的回退         |
|           go | 向前或向后改变路径 |
|      forward | 向前改变路径       |
|         back | 向后改变路径       |

```javascript
const state = { page_id: 1, user_id: 5 };
const title = '';
const url = 'hello-world.html';

history.pushState(state, title, url);
```

#### hashRouter 与 BrowserRouter 的不同

##### 底层原理不一样：

BrowserRouter 使用的是 H5 的 history API，不兼容 IE9 及以下版本；

HashRouter 使用的是 URL 的哈希值，理论上，所有的浏览器都能支持。

##### path 表现不一样

BrowserRouter 的路径中没有#,例如：localhost:3000/demo/test

HashRouter 的路径包含#,例如：localhost:3000/#/demo/test

##### 生产实现不一样

因为 BrowserRouter 模式下请求的链接都是 ip 地址:端口/xxxx/xxxx，因此相当于每个 URL 都会访问一个不同的后端地址，如果后端没有覆盖到路由就会产生 404 错误。

**解决方案：**可以通过加入中间件解决，放在服务器端路由匹配的最后，如果前面的 API 接口都不匹配，则返回 index.html 页面。

HashRouter 相当于锚点定位，请求的链接都是 ip 地址:端口/#/xxxx，因此请求的资源路径永远为/，相当于 index.html。因此不论#后面的路径怎么变化，请求的都相当于是#之前的那个页面。可以很容易的进行前后端不分离的部署(也就是把前端打包后的文件放到服务器端的 public 或 static 里)。

**存在问题：**在使用第三方分享功能时，由于 hash 的状态可能会被第三方平台忽略，导致 hash 后的参数丢失，用户无法直接真实的分享页面。

##### 刷新后对路由 state 参数的影响

BrowserRouter 没有任何影响，因为 state 保存在 history 对象中。

HashRouter 刷新后会导致路由 state 参数的丢失！！！

#### BrowserRouter 的 API

BrowserRouter 中最重要的 API, 我们目前需要记住的就是 basename;
很多情况下，使用 react 框架创建项目时，运行 npm start 后，使用 http://localhost:3000/home 即可访问首页。但实际上，很多小公司是没有独立的前端服务器的，这时我们的项目就必须放到一个指定的项目中去，然后使用 nginx 来配置代理，比如：http://localhost:3000/project/home。这个时候我们会发现除了首页，其它页面都访问不了了，因为我们的路由全部指向的是"/", 但实际需要指向"/project"。

- 解决这个问题就需要使用 basename, 为每个路由添加和 nginx 配置的项目名一样的根目录。本例中即为/project

```javascript
import { BrowserRouter as Router } from 'react-router-dom';
<Router
  basename={'/project'} // 根路径，这个比较重要，
  forceRefresh={bool} // 是否每次渲染都刷新整个页面，默认false，我们不管它
  getUserConfirmation={func} // 切换路径是否需要确认，默认不需要，我们不管它
  keyLength={number} // location.key的长度，key的作用是当我们点击同一个链接时是否每次都刷新页面，一样，我们也不动它
>
  <Route />
</Router>;
```

### 路由匹配

路由匹配是通过将当前的 location 的 pathname 与路由表中 Route 组件的 path 属性进行比较，如果这个组件的 path 与当前的 pathname 一致，则这个组件的 component 属性所指向的组件将会被渲染到页面，如果不匹配，则渲染 null，在没有使用 Switch 的情况下，会遍历整个路由表。要注意的是，当某个 Route 没有 path 时，它所对应的 component 将会一直被渲染。

```javascript
// 当location = {pathname: '/a'}
<BrowserRouter basename="/admin">
  <Route path={'/a'} component={A} /> // 匹配成功，渲染A组件
  <Route path={'/b'} component={B} /> // 匹配失败，渲染null
  <Route component={C} /> // 没有path,该组件在任何时候都会被渲染
</BrowserRouter>
```

### React Router 中的 switch 关键字有什么用处

它的主要作用是一个开关的作用：只要有一个 path 匹配上了对应的组件, 后续就不会再进行匹配了;

```javascript
// 当location = {pathname: '/a'}
<BrowserRouter basename="/admin">
  <Switch>
    // 开关，表示只在以下的路由表中匹配一个结果
    <Route path={'/a'} component={A} /> // 匹配成功，渲染A组件
    <Route path={'/b'} component={B} /> // 匹配失败，渲染null
    <Route component={C} /> // 没有path,该组件在任何时候都会被渲染
  </Switch>
</BrowserRouter>
```

### 重定向

- Redirect 用于路由的重定向, 当这个组件出现后, 就会执行跳转对应的 to 路径中

```javascript
<Redirect to="/login" />
```

### 手动跳转 withRouter

react-router 默认情况下必须是经过路由匹配渲染的组件才存在 this.props，才拥有路由参数，才能使用编程式导航的写法，执行 this.props.history.push('/home')跳转到对应路由的页面；

然而不是所有组件都直接与路由相连（通过路由跳转到此组件）的，当这些组件需要路由参数时，我们可以使用 withRouter 就可以给此组件传入路由参数，此时就可以使用 this.props 来获取 history 对象

方式一: 如果该组件是 **通过路由直接跳转过来** 的, 可以直接从 props 属性中获取 history, location, match
方式二: App 组件中获取到 history 对象，需要使用 whitRouter**高阶组件**

> App 组件必须包裹在 BrowserRouter 或 HashRouter 组件之内  
> App 组件使用 withRouter 高阶组件包裹

```javascript
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

class WithRouterDemo extends Component {
  render() {
    console.log(this.props);
    return (
      <div>
        <b> withRouterDemo页面</b>
      </div>
    );
  }
}
export default withRouter(WithRouterDemo);
```

### 路由传参

react-router 中参数的传递有三种方式：

- search 传递参数；
- 动态路由的方式；
- Link 中 to 传入对象；

search 传递参数这个我们就不详细说了，而 Link 中的传参因为 state 的不稳定，我们也不建议使用。所以，主要介绍一下动态路由传参这块：

```javascript
<Switch>
  <Route exact={true} path="/home" component={Home} />
  <Route path="/book/" component={BookList} />
  <Route path="/book/add" component={Add} />
  {/* 常规的写法 */}
  <Route path="/book/detail/:id" component={Detail} />
  {/* 指定路由 */}
  <Route path="/book/:pageType(detail|edit)/:id?" component={Detail} />
  {/* 多参数写法 */}
  <Route path="/book/:pageType(detail|edit)/:id/:name" component={Detail} />
  {/* 非必须写法 */}
  <Route path="/book/:pageType(detail|edit)/:id/:name?" component={Detail} />
  {/* 指定参数规则 */}
  <Route
    path="/book/:pageType(detail|edit)/:id(\\\d+)/:name?"
    component={Detail}
  />
  <Route component={NotFound}></Route>
</Switch>
```

### 路由懒加载

> - 什么是路由懒加载？  
>   路由懒加载，可以理解为延迟加载或按需加载。就是说要到用的时候才会去加载某些路由指向的组件
> - 为什么要使用路由懒加载？  
>    大家都应该知道，我们目前所使用的 vue 和 react 框架所生成的网站是一个单页面应用(single page app)，只是通过路由在主容器内加载不同的模块或组件来渲染到我们看到的窗口内。这样的话就造成了我们的项目在第一次打开时，浏览器需要将整站所有的代码文件下载到客户端然后由 react route 或 vue route 进行解析，最后由浏览器进行渲染。小的网站倒是无所谓，但我们的一些后台管理应用动辙几十个模块上千个页面，这样就造成了无论用户想要访问哪个模块都需要将整站代码下载回来才能真正执行，这就造成了长时间的白屏和等待，甚至有时在网络不是很好情况下造成页面崩溃，严重影响了用户体验。  
>   路由懒加载可以加快网站首屏代码的下载速度，避免用户在打开网站时因为首次下载代码量过大导致首屏等待时间过长。

#### 使用 React 自带的路由懒加载工具：

```javascript
import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Switch } from 'react-router-dom';

import RouteGuard from '@/utils/routeGuard';

const Routes = [
  {
    path: '/',
    component: lazy(() => import('@/pages/home/')),
    auth: false,
  },
];

export default function Router() {
  return (
    // 注意这里，使用懒加载必须配置Suspense，否则路由无法正常访问
    <Suspense fallback={<div>loading...</div>}>
      <BrowserRouter>
        <Switch>
          <RouteGuard Routes={Routes} />
        </Switch>
      </BrowserRouter>
    </Suspense>
  );
}
```

#### 使用第三方插件实现的路由懒加载：

因为上面的 React 自带的路由懒加载工具只在 16.6 版本后才被支持，而我们在实际业务中可能会遇到更早版本的 react 版本，为了在这些版本的 react 中实现路由懒加载，我们可以使用第三方依赖：

```javascript
npm i -S react-loadable
```

懒加载管理：utils/loadable.js

```javascript
import React from 'react';
import Loadable from 'react-loadable';

//通用的过场组件
const loadingComponent = () => {
  return <div>loading...</div>;
};

//过场组件默认采用通用的，若传入了loading，则采用传入的过场组件
export default (loader, loading = loadingComponent) => {
  return Loadable({
    loader,
    loading,
  });
};
```

懒加载路由文件： router.js

```javascript
import React from 'react';
import { BrowserRouter, Switch } from 'react-router-dom';

import loadable from '@/utils/loadable';
import RouteGuard from '@/utils/routeGuard';

const Routes = [
  {
    path: '/',
    component: loadable(() => import('@/pages/home/')),
    auth: false,
  },
];

export default function Router() {
  return (
    <BrowserRouter>
      <Switch>
        <RouteGuard Routes={Routes} />
      </Switch>
    </BrowserRouter>
  );
}
```

### React Router 实现的一个简单描述

1. 引入并实例化 history
2. 在顶层 Router 组件（我们可以把它理解为一个事件处理函数）的 constructor 生命周期里监听 history，将一个 location 存到当前的 state 中
3. 使用我们之前学过的 Context(Provider)来包括内部的子组件,存入 history、location 与 match 等对象
4. 使用 Context(Consumer)来包裹我们传入的 route 列表, 以便于我们在后续的组件中可以使用 history 等 Provider 传入的对象
5. 调用一个名为 matchPath 的函数来判断我们的子组件中是否有匹配的 path, 如果有则渲染子组件

- 当 history 发生变化时，Router 组件调用 setState 方法将 location 逐级向下传递；使用遍历的方式将 route 列表中的 path 属性匹配 Context 中的 location 来决定是否显示；如果有 Switch 标签的话，匹配到第一个可渲染的组件后退出遍历

### react-router 与 react-router-dom 的区别

> react-router: 实现了路由的核心功能  
> react-router-dom: 是一个基于 react-router 开发的扩展插件，加入了我们在浏览器运行环境下可以使用的一些功能。比如：可以渲染一个 a 标签的 Link 组件，基于 H5 的 history API 实现的 BrowserRouter 组件，基于 location.hash 实现的 HashRouter;  
> react-router-native: 基于 react-router 的扩展插件，加入了在 native 运行环境下的一些功能。

- 因为 react-router-dom 会自己安装 react-router 依赖，所以，我们在正常的 web app 开发中，只需要安装 react-router-dom 就行了,在开发 react-native 时也只需要安装 react-router-native.
