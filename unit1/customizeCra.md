> 平安蜀黍的前端教程 > 第一单元 开发环境与工具封装 > 使用 customize 来管理 react 项目

### 一、什么是 CRA

上一课我们学习了使用 webpack 从零开始创建一个项目，不得不说，非常繁琐。所以，为了让开发人员更好地关注业务实现而不是一点点去配置生成项目，React 官方推出了一个叫 Create React App 的，**用于构建 React 单页面应用的脚手架**工具。它本身**集成了 Webpack**，并配置了一系列**内置的 loader**和**默认的 npm**脚本，可以很轻松的实现**零配置**开发 React 的应用。而 Create React App 的首字母缩写就是 CRA 了。

#### 使用 create-react-app 来创建一个 react 项目

```javascript
// 全局安装一个create-react-app的脚手架工具
npm install -g create-react-app

// 使用脚手架创建你的项目
create-react-app 你的项目名

// 也可以这样创建，注意这里用的是npx而不是npm
npx create-react-app 你的项目名
```

官方推荐使用 **npx** create-react-app 来创建项目。因为它**不会在本地保留 create-react-app 的副本**，而是在使用完成后立刻删除。要注意的是，前面三个字母是 **npx** 而不是 npm；

npx 是 npm 的一个新工具，它可以将远程 Node 项目拉回到本地临时文件里运行，完成后再删除掉这个临时文件。它最大的好处是减少了我们全局安装某些脚手架的操作，实例如下：

```javascript
// 创建项目, 注意你的项目名，必须是英文字母开头可以包含数字和下划线，不允许出现其它字符
npx create-react-app 你的项目名

// 如果你要建的是一个ts项目, 在后面加上--template typescript 后缀
npx create-react-app 你的项目名 --template typescript

// 项目创建完成后, 通过终端进入你的项目文件夹
cd 你的项目名

// 或者将你的命令用&&号连接起来也行
npx create-react-app 你的项目名 && cd 你的项目名
```

---

### 二、使用 CRA 创建的项目怎样配置 webpack?

像我们实现一个抽象类一样，使用 CRA 脚手架工具只是用于配置一个相对简单的运行环境，它里面并没有太多项目优化的东西。假如我们需要使用 less 或配置按需加载等操作时，它就无法做到了。那么，怎样在项目中配置这些 webpack 的插件呢？

一种是在终端**运行 npm run eject **，执行这个命令**即可调用 react-scripts 将 CRA 创建的项目中的 webpack 配置释放**出来，不过，react-scripts 中的配置文件使用了一些设计模式，对于初学的我们来说比较晦涩难懂，配置起来比较麻烦。所以，我们一般不会进行这种操作。

另一种相对较容易的方案是使用社区提供的一些插件来进行 webpack 的设置，比如：[customize-cra](https://github.com/arackaf/customize-cra)或者[craco](https://github.com/gsoft-inc/craco)来对 webpack 进行配置，我们在这里主要讲一讲 customize-cra 的实现方式，因为 customize 的老项目还是比较多的。如果要学习 craco 的具体配置，可以看这篇文档[使用 craco 来管理 react 项目配置](craco.md)：

#### 第一步：安装依赖

在安装之前我们大致了解一下 react-app-rewired 与 customize-cra 这两个插件。

> react-app-rewired，rewired(**重装，重构的意思**)。功能用于拦截 webpack 启动配置，拥有修改 create-react-app 的配置权限

> customize-cra，customize(**定制的意思**)。一款相对比较成熟的 react 项目实用工具集，结合 react-app-rewired 使用，我们可以方便地对 create-react-app 脚手架创建的项目进行深度定制。

```javascript
// react-app-rewired是让你在不执行"npm run eject"指令也能改变内置的webpack中的配置的一个插件；
// customize-cra 是依赖于 react-app-rewired 的库, 通过 config-overrides.js 来修改底层的 webpack, babel配置
npm i -D react-app-rewired customize-cra
// 或者使用yarn
yarn add -D react-app-rewired customize-cra
```

我们刚刚安装了"react-app-rewired"与"customize-cra"这两个依赖, 也说到了, customize-cra 是能通过一个叫 config-overrides.js(**oweiruierde 重叠、覆盖的意思**) 的文件来修改你的 webpack 的配置而不再需要运行 npm run eject 来暴露 webpack 配置文件。

所以, 现在我们要在你的根目录增加 config-overrides.js 文件, 尝试着让我们的项目可以编译 less 文件。

#### 第二步：增加配置文件

```javascript
// config-overrides.js
const path = require('path');

const {
  override,
  addLessLoader, // 用于加载less文件
} = require('customize-cra');

module.exports = {
  webpack: override(
    // 加载less文件
    addLessLoader({
      lessOptions: {
        javascriptEnabled: true,
      },
      sourceMap: true,
    })
  ),
};
```

因为在 config 里增加了 less 的读取，所以我们需要安装 less 依赖。这里需要注意的是，因为 create-react-app 与 react-app-rewired 是基于 webpack4 来开发的，而 less-loader 的最新版本是基于 webpack5 来开发的，所以最新版的 less-loader 是不支持 react-app-rewired 的，所以这里需要指定 less 和 less-loader 版本号为较早的版本

```javascript
yarn add -D less@4.1.1 less-loader@7.3.0
// 或者
npm i -D less@4.1.1 less-loader@7.3.0
```

#### 第三步：修改 package.json

安装完成依赖后，我们需要改变一下 package 中的配置项来使用 react-app-rewired 来启动项目

```javascript
// 原来的npm脚本命令
"scripts": {
  "start": "react-scripts start", // start 使用编译并启动本地服务器进行调试
  "build": "react-scripts build", // build 编译并打包
  "test": "react-scripts test",   // test  编译并执行test脚本
  "eject": "react-scripts eject"  // eject 释放webpack配置文件
},
// 修改后
"scripts": {
  "start": "react-app-rewired start", // 使用react-app-rewired启动项目
  "build": "react-app-rewired build", // 使用react-app-rewired打包
},
```

#### 第四步：启动项目

```javascript
npm run start
// 也可以使用yarn
yarn run start

// start命令可以省略run，直接使用npm 执行
npm start
```

---

### 三、customize-cra 的更多配置

#### 配置代理服务器

正常来说，我们的开发环境如果没有配置 node 服务，那么在请求接口时必然是会发生[跨域](/)的，也就是说我们无法向远程服务器获取数据。那怎么解决呢？customize-cra 提供了在开发环境配置开发服务器的接口：overrideDevServer，我们可以在这里配置跨域代理

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

#### antd 与 antd 按需加载

react 项目中，antd 是一个常用的 UI 库，但有时我们可能只用到其中的一小部分组件，如果不使用按需加载功能的话，我们的包文件可能会比较庞大。所以，每次配置新项目时，一定要配置 antd 的按需加载：

**注：在 antd4 版本中这个已经不需要了，antd4 默认使用了 es6 的 import&exports 规范，只要我们在使用时是以解构的方式导入就只会导入我们需要的组件代码**

我们先安装 antd，antd 是运行时依赖，所以需要安装到生产环境，使用 yarn add 或 npm i -S

```javascript
yarn add antd babel-plugin-import // 按需加载工具需要用到这个依赖
// 或者
npm i -S antd babel-plugin-import
```

然后在 config-overrides.js 中添加相关配置，customize-cra 内部提供了按需加载的插件（依赖 babel-plugin-import），我们只需要导出即可

```javascript
// 导出插件
const {
  fixBabelImports, // antd的按需加载插件
} = require('customize-cra');
```

调用插件方法

```javascript
// antd按需加载工具, 具体用法参考以下链接
// https://github.com/ant-design/babel-plugin-import
fixBabelImports('import', {
  libraryName: 'antd', // ui库的名字 可选antd-mobile
  libraryDirectory: 'es',
  style: true, // 表示将import回来的代码以style方式写入到html的head里
});
```

在 index.js 中配置 antdUI 库

```javascript
// antd的生产者组件
import {ConfigProvider} from 'antd';
// antd中文化
import zhCN from 'antd/lib/locale/zh_CN';
// antd的样式文件
import 'antd/dist/antd.less';
```

#### px 自动转 rem

在之前的项目里，我们写移动端的时候，可能需要单独去加载一个 pxtorem 的工具插件，然后写样式文件时还需要对 css 进行计算后转换成 rem，webpack 社区提供了一些在编译时自动转 rem 的工具，比如 postcss-px2rem-exclude(**aikesiloude 应该是排除的意思，感觉跟这里的语义不一致**)，postcss-px2rem 等等，我们在这里学习一下如何使用 postcss-px2rem-exclude。首先仍然是安装依赖：

```javascript
// 使用postcss-px2rem-exclude还依赖lib-fiexible（faikesibo 灵活的）这个工具
// lib-fiexible用于在html标签上生成根字体的大小
yarn add -D postcss-px2rem-exclude lib-flexible
```

配置使用

```javascript
// index.js
import 'lib-flexible';

// config-overrides.js
// 顶部导入addPostcssPlugins，用于将postcss-px2rem-exclude导入到webpack的loader规则里
const {
  addPostcssPlugins, // 转换css文件的工具
} = require('customize-cra');

// remUnit设为75，12px的文字大小需要写成24px
// remUnit设为37.5，12px的文字大小就是12px
addPostcssPlugins([
  require('postcss-px2rem-exclude')({
    remUnit: 75,
    exclude: /node_modules/i, // 表示忽略node_modules下的所有文件，避免影响第三方的设置比如antd
  }),
]),
```

lib-flexible 的功能是在当前页面的根节点上添加一个 font-size, font-size 的大小基本上是当前屏幕宽度/10, 也就是说，1rem === 1/10 的屏幕宽度。如果设计稿是 750 (iphone6 手机的像素宽度: 1334\*750)的宽度，那么 1rem 差不多就是 75px。

在 postcss-px2rem-exclude 里，remUnit 需要参考设计图的原始尺寸。移动端的设计图一般来说都是参考 iphone6 这种 dpi 密度的手机，也就是说在相对于显示器同样大小的空间宽度里放入了 4 个像素点（不理解的同学可以去查询关于 dpi 的解释），所以，我们看到的设计图上写的大小可能会比较大，比如我们认为是 12px 的设计图上会写成 24px，不是设计师的问题，而是他们参考的点阵宽度不同。

##### css 中各种 size 的区别：

px: pixel，像素，绝对长度单位，显示器晶体管的大小，比如显示器分辨率 1920*1080，这个尺寸就是像素数量的描述;
pt: point，点，绝对长度单位，印刷行业常用的单位，1pt 约等于 1/72 英寸，这个单位主要用于打印，在不需要考虑打印样式时，我们可以忽略，如果需要，我们可以使用像素值*3/4 来进行换算，比如 16px \* 3/4 = 12pt;
em: 相对单位，父元素的字体大小，当父元素的 font-size 设定为 16px 时，子元素的 1em===16px;
rem: 相对单位，根元素的字体大小，当根元素的 font-size 设定为 16px 时，子元素的 1em===16px;

#### 自定义配置

customize-cra 提供了比较丰富的接口来让我们更好地完善 webpack，但这些仍然远远不够，有很多我们需要的功能它可能也无法提供，怎么办呢？customize-cra 提供了一个自定义的接口方法，只要我们在参数中传入一个回调函数，customize-cra 会自动调用它，并将当前的 webpack.config 传给我们，我们要做的就是将我们需要的一些配置添加到这个 config 中并返回给 customize-cra 即可生效

```javascript
override(config => {
  // 增加plugin
  config.plugins.push();
  // 增加loader
  config.module.rules[1].oneOf.push();
  // 返回修改过的config
  return config;
});
```

#### 较完整配置

```javascript
const path = require('path');

// 环境标识（后期可能会被挪到一个独立的全局变量声明文件中，以避免多处重复声明）
const DEV = 'development';
const PROD = 'production';
// 获取接口域名及端口等信息
const apiBaseUrl = process.env.REACT_APP_API;

const {
  override,
  addWebpackAlias, // 用于配置别名的
  addLessLoader, // 用于加载less文件
  addDecoratorsLegacy, // 用于使用ES的装饰器
  fixBabelImports, // antd 按需加载
  overrideDevServer, // 开发服务器
  addPostcssPlugins, // 转换css文件的工具
} = require('customize-cra');

// 雪碧图生成的插件
const SpritesmithPlugin = require('webpack-spritesmith');
/**
 * 代理配置
 * 这是一个闭包，返回一个回调函数，customize-cra在执行这个回调的时候，会将当前的开发服务器的配置项以参数的形式传给我们
 * 我们对这个config进行一个简单的处理后返回给customize-cra
 */
function addProxy() {
  return config => {
    // 将配置好的config返回给customize-cra
    return {
      ...config,
      // 代理
      proxy: {
        // 拦截器（拦截所有以"/api"开头的http请求）
        '/api': {
          // 配置一个base url
          target: apiBaseUrl,
          // 是否修改源，它决定我们是否跨域
          changeOrigin: true,
          // 是否重写我们的拦截关键字
          pathRewrite: {
            '^/api': '/api',
          },
        },
      },
    };
  };
}

module.exports = {
  webpack: override(
    // 使用装饰器
    addDecoratorsLegacy(),
    addLessLoader({
      lessOptions: {
        javascriptEnabled: true,
      },
      sourceMap: true,
    }),
    addPostcssPlugins([
      require('postcss-px2rem-exclude')({
        remUnit: 37.5,
        exclude: /node_modules/i,
      }),
    ]),
    // antd 4已经不需要这个功能了，但我们需要了解，以便维护antd 4以下版本的项目
    fixBabelImports('import', {
      libraryName: 'antd', // ui库的名字 可选antd-mobile
      libraryDirectory: 'es',
      style: true, // true表示将文件以style方式写入到html head中
    }),
    // 别名
    addWebpackAlias({
      '@': path.resolve(__dirname, 'src'),
    }),
    // 更多的配置
    config => {
      config.plugins.push(
        new SpritesmithPlugin({
          src: {
            cwd: path.resolve(__dirname, 'src/assets/icons'),
            glob: '*.png',
          },
          target: {
            image: path.resolve(__dirname, 'src/assets/sprite.png'),
            css: path.resolve(__dirname, 'src/assets/sprite.less'),
          },
          apiOptions: {
            cssImageRef: 'sprite.png',
          },
        })
      );

      return config;
    }
  ),
  // 开发环境服务器代理, 一般情况下不需要我们自己配
  devServer: overrideDevServer(addProxy()),
};
```

---

### craco 更简单的配置工具

customize 最后一次更新在 2020 年的 5 月，到目前为止，已经有 2 年多没有真正维护过了，所以它内部有很多问题需要我们回避，比如 less 的版本问题，比如 typescript 的问题。所以在很多时候我们用起来并不是那么方便。但因为种种原因，国内仍有很多小厂还在使用。我们仍然需要知道它的一些用法。

另一款用得比较多的工具是 craco，它的开发者比较努力，一直在维护中，所以，我们更推荐使用 craco，具体配置可以参考[craco 简单配置](craco.md)

### vite 比 webpack 更快的项目集成工具

资料整理中

### 课后问题

- 参考教程，使用 webpack 新建一个项目，要求正确配置并正常使用图片压缩、icon 合并等插件并展示

- 参考教程，使用 create-react-app 新建一个项目，要求配置代理服务，使用图片压缩，合并 icon
