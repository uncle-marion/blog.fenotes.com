> 企业项目实战 > 第二部分 > React 基础回顾

### React Router 与路由守卫

#### 什么是 React Router

- ReactRouter 是一款应用于 ReactJS 的路由组件，在这里，我们要记住的是，它只是一个组件！  
  它使用了一个 history 的库来监听不同的路由变化，然后根据这些变化来实现切换我们在 Routes 中定义的相关子组件来实现页面路由的映射、参数的解析和传递；  
  React-Router 是由 FaceBook 官方维护的，而且是我们学习使用 React 时唯一可使用的路由库！

```javascript
// 安装命令
npm i -S react-router-dom
```

```javascript
// 有的人会这样写，BrowserRouter as Router 这一句表示的是给BrowserRouter组件添加了一个别名叫Router
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

render(
  // 这里的Router === BrowserRouter, 是一个组件
  <Router>
    // 路由的最小组件, 一个或多个Route组件, 如果当前
    location.pathname匹配props.path规则， // 就渲染props.component中的内容,
    否则渲染null
    <Route path="/" component={App} />
  </Router>,
  // 获取容器组件
  document.getElementById('app')
);
```

React Router 这一块的面试考点不多，如果你在前面的与 React 有关的问题中过关了，可能只会在这边提一嘴，比如 ReactRouter 有哪些路由模式(hash, history)，有哪些路由配置（动态路由, 懒加载），如果你回答的好，面试官可能还会问你，它的底层实现原理与它的一些优缺点。

#### react-router 与 react-router-dom 的区别

> react-router: 实现了路由的核心功能  
> react-router-dom: 是一个基于 react-router 开发的扩展插件，加入了我们在浏览器运行环境下可以使用的一些功能。比如：可以渲染一个 a 标签的 Link 组件，基于 H5 的 history API 实现的 BrowserRouter 组件，基于 location.hash 实现的 HashRouter;  
> react-router-native: 基于 react-router 的扩展插件，加入了在 native 运行环境下的一些功能。

- 因为 react-router-dom 会自己安装 react-router 依赖，所以，我们在正常的 web app 开发中，只需要安装 react-router-dom 就行了,在开发 react-native 时也只需要安装 react-router-native.

#### BrowserRouter 的 API

```javascript
import { BrowserRouter } from 'react-router-dom';
<BrowserRouter
  basename={string} // 根路径
  forceRefresh={bool} // 是否每次渲染都刷新整个页面，默认false，不要改
  getUserConfirmation={func} // 切换路径是否需要确认，默认不动
  keyLength={number} // location.key的长度，key的作用是当我们点击同一个链接时是否每次都刷新页面，
>
  <Route />
</BrowserRouter>;
```

- 这四个 api 我们常用到的只有 basename, 这个嵌套路由，相当于是在我们所写的 route.path 的前面加上了一个前缀，如下所示

```javascript
// 关于根路径的示例
<BrowserRouter basename="/admin">
  <Route path={'/login'} component={Login} />
</BrowserRouter>

// 这个路由最终匹配的地址是：/admin/login
```

#### 路由匹配

路由匹配是通过将当前的 location 的 pathname 与路由表中 Route 组件的 path 属性进行比较，如果这个组件的 path 与当前的 pathname 一致，则这个组件的 component 属性所指向的组件将会被渲染到页面，如果不匹配，则渲染 null，在没有使用 Switch 的情况下，会遍历整个路由表。要注意的是，当某个 Route 没有 path 时，它所对应的 component 将会一直被渲染。

```javascript
// 当location = {pathname: '/a'}
<BrowserRouter basename="/admin">
  <Route path={'/a'} component={A} /> // 匹配成功，渲染A组件
  <Route path={'/b'} component={B} /> // 匹配失败，渲染null
  <Route component={C} /> // 没有path,该组件在任何时候都会被渲染
</BrowserRouter>
```

#### React Router 中的 switch 关键字有什么用处

switch，字面意思就是一个开关或者替换转换等，它的工作就是当 Router 在我们的 route 中匹配到第一个适用的组件后就结束匹配，避免同一个页面显示多个组件的内容

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

#### React Router 的动态路由

#### React Router 实现的一个简单描述

1. 引入并实例化 history
2. 在顶层 Router 组件（我们可以把它理解为一个事件处理函数）的 constructor 生命周期里监听 history，将一个 location 存到当前的 state 中
3. 使用我们之前学过的 Context(Provider)来包括内部的子组件,存入 history、location 与 match 等对象
4. 使用 Context(Consumer)来包裹我们传入的 route 列表, 以便于我们在后续的组件中可以使用 history 等 Provider 传入的对象
5. 调用一个名为 matchPath 的函数来判断我们的子组件中是否有匹配的 path, 如果有则渲染子组件

- 当 history 发生变化时，Router 组件调用 setState 方法将 location 逐级向下传递；使用遍历的方式将 route 列表中的 path 属性匹配 Context 中的 location 来决定是否显示；如果有 Switch 标签的话，匹配到第一个可渲染的组件后退出遍历

#### 路由懒加载

> - 什么是路由懒加载？  
>   路由懒加载，可以理解为延迟加载或按需加载。就是说要到用的时候才会去加载某些路由指向的组件
> - 为什么要使用路由懒加载？  
>   大家都应该知道，我们目前所使用的 vue 和 react 框架所生成的网站是一个单页面应用(single page app)，只是通过路由在主容器内加载不同的模块或组件来渲染到我们看到的窗口内。这样的话就造成了我们的项目在第一次打开时，浏览器需要将整站所有的代码文件下载到客户端然后由 react route 或 vue route 进行解析，最后由浏览器进行渲染。小的网站倒是无所谓，但我们的一些后台管理应用动辙几十个模块上千个页面，这样就造成了无论用户想要访问哪个模块都需要将整站代码下载回来才能真正执行。路以加快网站首屏代码的下载速度，避免用户在打开网站时因为首次下载代码量过大导致首屏等待时间过长。

#### 路由守卫

- React 的路由守卫有很多种写法，实现的原理无非是首先检查访问该组件是否需要权限，如果需要再判断用户是否已经拥有该权限，如果有权限则渲染对应的组件，如果没有权限则跳转到登陆页面

第一种实现方式：

通过一个路由筛选模式将路由表中匹配的路由渲染出来

主文件 index.js

```javascript
import React from 'react';
import { BrowserRouter, Switch } from 'react-router-dom';
// 路由守卫, 用于筛选匹配当前路径的模块并判断是否有足够权限
import RouteGuard from './routeGuard';
// 路由表
import RoutingTable from './routingTable';

function Router() {
  return (
    <BrowserRouter>
      <Switch>
        // 匹配路由
        <RouteGuard routingTable={RoutingTable} />
      </Switch>
    </BrowserRouter>
  );
}

export default Router;
```

路由表 routingTable.js

```javascript
import { Homepage, Login, Register } from '@pages/';

const routingTable = [
  // path:location.pathname; component:组件名; auth: 是否需要登陆授权
  { path: '/', component: Homepage, auth: true },
  { path: '/login', component: Login },
  { path: '/register', component: Register },
];

export default routingTable;
```

路由筛选组件 routeGuard.js

```javascript
import React, { Component } from 'react';
import { Redirect, Route } from 'react-router-dom';

class RouteGuard extends Component {
  render() {
    const { routingTable, location } = this.props;
    const { pathname } = location;

    // 首先判断该路由是否在路由表中存在
    const targetRouter = routingTable.find(router => {
      return router.path.replace(/\s*/g, '') === pathname;
    });

    // 对于非法路由直接跳转到404页面
    if (!targetRouter) {
      return <Redirect to="/404" />;
    }

    // 暂时先从session中获取token来判断是否登陆
    const isLogin = sessionStorage.getItem('token');
    // 解构当前路由配置
    const { auth, component } = targetRouter;

    // 如果已登陆
    if (isLogin) {
      // 需要排除登陆和注册页, 如果已登陆, 这两个页面不允许访问
      if (pathname === '/login' || pathname === '/register') {
        return <Redirect to="/" />;
      }
      // 其它路由直接返回指定组件进行渲染
      return <Route path={pathname} component={component} />;
    }

    // 不需要登陆授权的页面直接渲染
    if (!auth) {
      return <Route path={pathname} component={component} />;
    }

    // 需要登陆的带上当前路径跳转到登陆
    return (
      <Redirect
        to={{
          pathname: '/login',
          origin: pathname,
        }}
      />
    );
  }
}
export default RouteGuard;
```
