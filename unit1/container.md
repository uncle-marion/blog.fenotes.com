> 平安蜀黍的前端教程 > 实战教学 > 创建全局框架

### 项目结构

今天的主课我们学习了 React 路由的一些知识，学习了路由后，我们就可以开始构建我们整个项目的结构了，首先，是对整个网站根据功能进行模块划分：

```bash
├─src
  ├─ assets
    ├─ less           全局公用样式文件
    ├─ images         图片文件
    ├─ fonts          字体文件
  ├─ components       用于放置公用组件
  ├─ configs          用于放置项目配置文件，包括craco及发布环境配置文件
  ├─ layouts          网站的主框架，包括菜单、banner、nav等
  ├─ models           数据模块，如果网站比较大需要使用redux或其它状态管理工具，放在这
  ├─ pages            用于放置页面组件
  ├─ routes           路由表及路由守卫等
  ├─ apis             接口配置文件
  ├─ utils            工具管理
  ├─ index.js         索引文件，package.json里的main属性应该指向这里
├─ .env               默认的环境配置文件，简单的项目可以不需要配置configs，直接在.env中配置即可
├─ .env.development   开发环境配置文件，开发环境中会覆盖.env中的同名属性
├─ .env.production    生产环境配置文件，生产环境中会覆盖.env中的同名属性
├─ .gitignore         git忽略配置
├─ .prettierrc.json   代码规范配置文件
├─ craco.config.js    craco配置文件，与下面的config-overrides.js二选一
├─ config-overrides.js
├─ jsconfig.json     项目运行环境配置文件
```

### 路由管理

配置好整个项目结构后，在 routes 下创建全局路由表：

```javascript
// react提供的懒加载组件，可以有效地解决因主文件过大首次加载时长过长造成的白屏问题
import { lazy, Suspense } from 'react';
import { BrowserRouter, Switch } from 'react-router-dom';

import { Spin } from 'antd';

import RouteGuard from './routeGuard';
// 状态声明
// 同一个接口文件可以在多处使用，这样就可以同时规范参数的传递与接收
import { Route } from '@/types/routes';
```

### 主框架
