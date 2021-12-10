> Marion 前端教程 > 前端开发应知应会 > 第一部分 > 项目的建立

### 一、准备开发环境

### 使用 react 脚手架创建项目

到这里，我们最基本的环境大致是 ok 了，有了前端的运行环境 nodejs，有了包管理工具 npm 和 yarn，可以正式开始创建 react 项目了。

#### 1. 使用 create-react-app 脚手架创建项目

```javascript
// 全局安装一个create-react-app的脚手架工具
npm install -g create-react-app

// 使用脚手架创建你的项目
create-react-app 你的项目名

// 也可以这样创建，注意这里用的是npx而不是npm
npx create-react-app 你的项目名
```

#### 三、学习 npm

npm 是我们平常开发时用来管理项目依赖的一个工具，它有很多的命令，我们在这里需要记下一些**常用命令**：

- npm 常用命令与参数

```javascript

```

- npm 因为国内的网络问题，可能需要切换镜像地址

```javascript
npm get registry                                         // 获取代码仓库的镜像地址
npm config set registry                                  // 切换代码仓库的镜像地址
npm config set registry https://registry.npm.taobao.org  // 切换仓库到 taobao
npm config set registry https://registry.npmjs.org       // 切换仓库到 npm
```

- 推荐使用 nrm 来进行仓库管理

```javascript
// 全局安装nrm工具
npm i -g nrm
```

安装完成后可以使用下面这些命令来管理镜像库

```javascript

```

- 我们也可以使用 Yarn 管理工具，它是为了弥补 npm 的一些缺陷而开发出来的新的 js 包管理工具，它使用了并行安装的方式所以比 npm 更快；它有离线下载模式，也就是说当某个依赖曾经被安装过，再次安装时会从本地缓存库中下载等很多的优点。

```javascript
npm i -g yarn
yarn add <依赖名>           // 安装依赖到生产环境
yarn add <依赖名> -D        // 安装依赖到开发环境

yarn remove <依赖名>        // 卸载依赖
yarn cache clean           // 清除缓存
```

#### 四、常用依赖安装

- 每一次新建项目, 第一件事不是 Start, 而是 Install。所以不要急着运行你的项目, 你需要做的第一件事是安装一些必要的依赖

什么是依赖？依赖就是我们平时编写项目时所用到的那些模块或者说插件，比如 React。Webpack 只是一个模块管理工具，它本身并不提供项目运行的依赖，只管理模块的依赖关系，并产生可以替代这些模块的依赖代码。

##### 1、生产环境依赖

表示在我们的项目运行需要依赖的模块，生产依赖在 package.json 中都保存在

```javascript
// react-router-dom是react-router的扩展版，增加了一些对于dom操作的扩展
npm i -S react-router-dom
// redux 看你项目的情况决定是否要安装, 这里我们先安装, 因为它是我们专高6课程的核心部分
npm i -S redux react-redux redux-promise redux-thunk redux-persist
// decorators 因为我们的项目需要使用装饰器，所以这个必须安装
npm i -S @babel/plugin-proposal-decorators
// axios 目前比较流行的http库, 基于promise, 可以同时运行在node和浏览器中, 有极其丰富的配置项
npm i -S axios
// 看你项目的情况, 安装antd或者antd-mobile, 专高6的核心是antd, 所以这里我们安装antd
npm i -S antd
// antd-mobile与它的依赖
// npm i -S antd-mobile postcss-px2rem-exclude rc-form
// 上面这些可以一次性安装，比如：
// npm i -S react-router-dom redux react-redux redux-promise redux-thunk redux-persist  antd axios
// 或者使用yarn
// yarn add react-router-dom redux react-redux redux-promise redux-thunk redux-persist  antd axios
```

##### 2、开发环境依赖

表示我们仅在项目开发或打包时需要的依赖，当项目发布上线后就不再依赖的模块

```javascript
// 以下的内容只在开发环境依赖, 所以我们通过-D指令将它们安装在devDependencies里面
// 所谓的开发环境依赖，表示这个代码仅在开发或打包时需要，项目打包完成后就不再需要了

// antd的按需加载, 无论你是使用antd还是antd-mobile, 都需要安装
npm i -D babel-plugin-import
// 安装对于less的支持
npm i -D less less-loader
// 我们还需要很多依赖, 其它的依赖会在后续的课程中根据需要来安装
```

#### 五、添加配置文件

在添加配置文件之前我们需要先了解一下 react-app-rewired 与 customize-cra 这两个插件。

> react-app-rewired，rewired 重装，重构的意思，功能用于拦截 webpack 启动配置，拥有修改 create-react-app 的配置权限

> customize-cra 一款比较成熟的 react 项目实用工具集，结合 react-app-rewired 使用，我们可以方便地对 create-react-app 脚手架创建的项目进行深度定制。

我们刚刚安装了"react-app-rewired"与"customize-cra"这两个依赖, 也说到了, customize-cra 是能通过一个叫 config-overrides.js 的文件来修改你的 webpack 的配置而不再需要运行 npm run eject 来暴露 webpack 配置文件。

所以, 现在我们要在你的根目录增加 config-overrides.js 文件, 增加装饰器、less、antd 与路径别名的相关配置。

```javascript
const path = require('path');

const {
  override,
  addWebpackAlias, // 用于配置别名的
  addLessLoader, // 用于加载less文件
  addDecoratorsLegacy, // 用于使用ES的装饰器
  fixBabelImports, // antd 按需加载
  overrideDevServer, // 开发服务器
} = require('customize-cra');

/**
 * 代理配置
 * add proxy 本置代理
 * 返回一个回调函数，customize-cra在执行这个回调的时候，会将当前的开发服务器的配置项以参数的形式传给我们
 * 我们对这个config进行一个简单的处理后返回给customize-cra
 */
const addProxy = () => config => {
  // 返回配置好的config
  return {
    ...config,
    // 代理
    proxy: {
      // 拦截器（拦截所有以"/api"开头的http请求）
      '/api': {
        // 配置一个base url
        target: 'https://www.sina.com.cn',
        // 是否修改源，
        changeOrigin: true,
        // 是否重写我们的拦截关键字
        pathRewrite: {
          '^/api': '/api',
        },
      },
    },
  };
};

module.exports = {
  webpack: override(
    // 使用修饰器
    addDecoratorsLegacy(),
    // 加载less文件
    addLessLoader({
      lessOptions: {
        javascriptEnabled: true,
      },
      sourceMap: true,
    }),
    // antd按需加载工具, 具体用法参考以下链接
    // https://github.com/ant-design/babel-plugin-import
    fixBabelImports('import', {
      libraryName: 'antd-mobile',
      style: 'css',
    }),
    // 路径别名
    addWebpackAlias({
      '@': path.resolve(__dirname, 'src'),
    })
  ),
  // 开发环境服务器代理, 一般情况下不需要我们自己配
  devServer: overrideDevServer(addProxy()),
};
```

#### 六、修改 package.json 文件

- 因为使用了"react-app-rewired", 所以, 我们需要修改 package.json 中的 scripts 属性中的值, scripts 在 package.json 中，表示是使用这个目录中的配置文件来启动或打包项目；我们将其中的"react-scripts"统一修改成"react-app-rewired"，这样就可以实现**对 react-scripts 运行脚本的代理**操作。就可以把我们在上面配置的 config 注入到 react-scripts 中去。

#### 七、运行项目

- 运行项目, 确认以上的修改正确无误。

以后我们在业务中修改/增加依赖的时候也要记得, 一次只修改几个相关的依赖, 不要把所有的依赖一次性改完, 出现错误的时候都不知道从哪里查起

#### 八、修正因为别名造成的自动完成路径功能丢失

- 在项目的根目录, 新建一个 jsconfig.json 文件, 内容如下

```javascript
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "baseUrl": "./",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "exclude": ["node_modules", "dist"]
}
```

#### 九、配置代码格式

在项目根目录下新建一个.prettierrc.json 文件，这个文件是配给 prettierrc 插件使用的, 主要是对于一些其它同事 coding 时未遵循规范, 代码可读性较差时, 可以顺手帮忙右键格式一下。内容如下：

```javascript
{
  "bracketSpacing": true,  // 在对象中属性冒号的右侧添加空格
  "printWidth": 100,       // 超过最大值换行
  "useTabs": false,        // 缩进不使用tab, 使用空格
  "tabWidth": 2,           // 缩进字节数
  "semi": true,            // 句尾添加分号
  "singleQuote": true,     // 使用单引号代替双引号
  "arrowParens": "avoid",  // (x) => {} 箭头函数参数只有一个时是否要有小括号。avoid：省略括号
}
```

#### 十、调整你的项目文件夹

- 当上面的内容修改完成, 调整你的文档结构如下图所示

<img src="../assets/react_new_project.jpg" />

需要配置在根目录的文件基本配置完成，然后我们再来对 src 目录下的文件与目录做一些调整, 除了 index.js 文件外，其它文件全部删除。

然后新建五个文件夹:

1. assets, 用于放置你将来的公共 css 和图片等媒体文件;
2. components, 用来放置你所有的功能组件;
3. pages, 用来放置你所有的页面文件(业务组件);
4. reducer, 这个文件夹用于管理我们所有与 redux 有关的文件;
5. utils, 用来放置你的 axios 配置文件与其它的业务功能插件等。

这就是我们一个 react 项目初始化时需要的文件夹了, 后续会有更多的文件夹, 我们先不用着急, 到用的时候再一个个建立。

#### 十一、新建我们的首页

- 在 pages 文件夹中, 新建一个 HomePage 的文件夹, 文件夹名称以**帕斯卡形式（大驼峰）命名**, 在这个文件夹下, 新建 index.jsx, style.less 两个文件，为什么 style.less 不放在；

这里需要注意的是, 在我们的 **components 与 pages 两个文件夹下, 所有的子文件夹都需要以帕斯卡形式命名**, 而其内部至少有一个 index.jsx 与一个 style.less 的文件。

为什么要这样？因为我们要保证**文件名与导出的模块名一致**, 而我们的 pages 与 components 中每一个文件夹下的内容都是一个或多个独立的组件, 而组件名只能以帕斯卡方式命名：

```javascript
// Homepage/index.jsx
import React, { Component } from 'react';
import './style.less';
export default class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      msg: '这是我的首页',
    };
  }
  render() {
    const { msg } = this.state;
    return <div className="homepage">{msg}</div>;
  }
}

// router/index.js
import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
// 为什么要用index.jsx? index在Js, Html中, 代表了索引页, 也是当前目录的默认首页。所以, 在这里我们不需要指定文件名就能直接将目录中的index导入, 可以减少文件名称的输入以减少因为文件名输入错误造成的一些问题
import Homepage from '@pages/Homepage';

function Router() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={Homepage} />
        <Route exact path="/homepage" component={Homepage} />
      </Switch>
    </BrowserRouter>
  );
}

export default Router;
```

将上面两个文件保存后, 我们再来修改根目录的 index.jsx 文件

```javascript
// react项目的核心文件, 每一个文件都需要引入它
import React from 'react';
// 核心文件也包括ReactDOM, 但它不需要在其它文件中引用
import ReactDOM from 'react-dom';
// 路由配置, 我们刚刚写的
import Router from './router';

// 全局的样式文件
import '@/assets/style.less';

ReactDOM.render(
  // 对每一个模块都执行严格模式检查
  <React.StrictMode>
    <Router />
  </React.StrictMode>,
  document.getElementById('docwrap')
);
```

#### 运行你的项目

检查代码没有问题后就可以启动项目了，在你的终端执行 npm start 或 yarn start: 好了, 现在我们实现了一个最简易的网站, 那么我们就来总结一下，今天学习的内容：

---

### 课后问题

- 从零开始一个 React 项目的流程应该是怎样的？
- 不运行 npm run eject 的情况下，怎样定制我们的 webpack 插件？
- 一个完整的项目应该包含有哪些目录和文件？
- npm 常见的命令有哪些？怎么修改镜像地址？
- 一个完整的 React 项目应该安装哪些依赖？哪些是生产依赖？哪些是开发依赖？
