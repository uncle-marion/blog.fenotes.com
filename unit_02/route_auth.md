> Marion 的 react 实战课程 > 第二部分 > 嵌套路由与权限管理

### 嵌套路由的实现

```javascript
<Route
  path="/"
  render={props => (
    <div>
      <Route path="/" render={() => <div>外层</div>} />
      <Route path="/in" render={() => <div>内层</div>} />
      <Route path="/others" render={() => <div>其他</div>} />
    </div>
  )}
/>
```

### 路由守卫

- React 的路由守卫有很多种写法，实现的原理无非是首先检查访问该组件是否需要权限，如果需要再判断用户是否已经拥有该权限，如果有权限则渲染对应的组件，如果没有权限则跳转到登陆页面

#### 小型站点常用方式

在一些小型企业或个人网站中，也会采用下面这种方式来进行路由筛选

```javascript
import React, {Component} from "react";
import { BrowserRouter, Switch } from "react-router-dom";

export default class Router extend Component {
  render() {
    const token = sessionStorage.getItem("token")
    return (
      <BrowserRouter>
        <Switch>
          <Route path="/login" component={Login} />
          <Route
            path="*"
            render={() => {
              if (token) {
                return (
                  <Switch>
                    <Route path="/" component={Home} />
                  </Switch>
                );
              } else {
                return <Redirect to="/login" />;
              }
            }}
          />
        </Switch>
      </BrowserRouter>
    );
  }
}
```

#### 大型项目中常见的方式

在企业中，大多采用下面这种通过一个路由筛选模式来将路由表中匹配的路由渲染出来

主文件 index.js

```javascript
import React from 'react';
import { BrowserRouter, Switch } from 'react-router-dom';
// 路由的筛选组件, 它会通过接收到的props来返回当前浏览器地址所对应的一组路由
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

路由守卫组件 routeGuard.js

```javascript
import React, { Component } from 'react';
import { Redirect, Route } from 'react-router-dom';

export default class RouteGuard extends Component {
  render() {
    const { Routes, location } = this.props;

    // 因为子模块index负责解析细分路由，所以这里只校验第一位，如果路由表管理所有路由，这行代码就不需要了
    let pathname = location.pathname.match(/\/(\w*)/)[0];
    // 因为首页pathname有可能是空，这里需要进行替换
    if (pathname === '/home') {
      pathname = '/';
    }

    // 首先从路由表中取出当前地址所对应的路由对象
    const targetRouter = Routes.find(router => {
      return router.path.replace(/\s*/g, '') === pathname;
    });

    // 未获取到路由对象的，判断这是一个非法路由，直接跳转到404页面
    if (!targetRouter) {
      // 这里为什么要使用redirect而不是return一个component?
      return <Redirect to="/error/404" />;
    }

    // 解构当前路由对象
    const { auth, component } = targetRouter;

    // 先从session中获取token来判断是否登陆
    const isLogin = sessionStorage.getItem('token');

    // 如果已登陆
    if (isLogin) {
      // 需要排除登陆和注册页, 如果已登陆, 这两个页面不允许访问
      if (pathname === '/login' || pathname === '/register') {
        // 跳转至首页
        return <Redirect to="/" />;
      }

      // 我们可以在这进行更多的条件判断，比如从用户信息中获取到用户等级来判断哪些路由该用户不可以访问(主要用于解决用户使用外部链接进入指定页面)

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
          state: {
            origin: pathname,
          },
        }}
      />
    );
  }
}
```

### 配合路由守卫实现权限管理
