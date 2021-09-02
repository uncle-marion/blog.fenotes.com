> Marion 的 react 实战课程 > 第五部分 > webpack 入门

## webpack 的特点

> 可以解析 JSX 语法  
> 可以解析 ES6 语法新特性  
> 支持 LESS、SCSS 预处理器  
> 编译完成自动打开浏览器  
> 单独分离 CSS 样式文件  
> 支持文件 MD5 戳，解决文件缓存问题  
> 支持图片、图标字体等资源的编译  
> 支持浏览器源码调试  
> 实现组件级热更新  
> 实现代码的热替换，浏览器实时刷新查看效果  
> 区分开发环境和生产环境  
> 分离业务功能代码和公共依赖代码

Webpack 是当下最热门的前端资源模块化管理和打包工具。它可以将许多松散的模块按照依赖和规则打包成符合生产环境部署的前端资源。还可以将按需加载的模块进行代码分隔，等到实际需要的时候再异步加载。通过 loader 的转换，任何形式的资源都可以视作模块，比如 CommonJs 模块、AMD 模块、ES6 模块、CSS、图片、JSON、LESS 等

> Webpack 的工作方式是：把你的项目当做一个整体，通过一个给定的主文件（如：index.js），Webpack 将从这个文件开始找到你的项目的所有依赖文件，使用 loaders 处理它们，最后打包为一个浏览器可识别的 JavaScript 文件。

<img src="../assets/images/unit_05/webpack_banner.png">

## 仍然是从零开始

创建一个项目

```javascript
mkdir react_mobile
cd react_mobile
npm init -y
```

安装最小依赖

```javascript
npm i -S react react-dom
npm i -D webpack
```

创建目录结构

```javascript
mkdir src
mkdir webpack
mkdir public
```

然后在 public 下生成一个 index.html 文件

```javascript
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>超级小的react项目</title>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
```

同时在 src 下生成一个 index.js 文件

```javascript
import React from "react";
import { render } from "react-dom";

// 将组件渲染到指定的位置
render(<div>超级小的react项目</div>, document.getElementById("root"));
```

为了让我们的项目跑起来，还需要让我们的 webpack 运行起来，在 webpack 下生成一个 webpack.config.js 文件

```javascript
const path = require("path");
// 这个插件的作用是将我们打好包的文件写入到html中
const HtmlWebpackPlugin = require("html-webpack-plugin");
module.exports = {
  //指定入口文件，程序从这里开始编译,__dirname当前所在目录, ../表示上一级目录, ./同级目录
  entry: path.resolve(__dirname, "../src/index.js"),
  // 输出的配置
  output: {
    // 输出的路径
    path: path.resolve(__dirname, "../dist"),
    // 输出的文件名
    filename: "bundle.js",
  },
  // 需要配置的模块，这是webpack的核心
  module: {
    // 规则集合
    rules: [
      {
        // 对所有后缀为js或jsx的文件使用的规则 test在这里应该是匹配的意思
        test: /\.(js|jsx)$/,
        use: {
          // babel-loader 用于编译jsx的转换器 webpack loader用于将一些奇奇怪怪类型的文件转换成浏览器能识别的文件
          loader: "babel-loader",
          // 设定
          options: {
            // 将所有的es6和jsx相关代码转换成浏览器能识别的es5
            presets: ["es2015", "react"],
          },
        },
        // 不需要编译的位置
        exclude: /node_modules/,
      },
    ],
  },
  // 需要配置的插件
  plugins: [
    // 找到public下的index.html文件，将打包好的js文件写进去，然后在我们的dist文件夹下生成一个index.html文件
    new HtmlWebpackPlugin({ template: "./public/index.html" }),
  ],
  // 声明当前为开发环境
  mode: "development",
};
```

上面的 webpack 配置中使用了一些 babel 的插件，那么我们也需要安装一下对应的依赖：

```bash
npm i -D @babel/plugin-proposal-class-properties @babel/plugin-transform-runtime @babel/preset-react @babel/preset-env
```

为了让我们写的文件被 node 和 webpack 识别，我们还需要在根目录下创建一个.babelrc 的文件

```json
{
  "presets": ["@babel/preset-env", "@babel/preset-react"],
  "plugins": [
    "@babel/plugin-transform-runtime",
    "@babel/plugin-proposal-class-properties"
  ]
}
```

ok，到这里，我们的全手写最小化的 react 就可以运行了，在你的根目录执行下面这个命令：

```bash
webpack --config webpack/webpack.config.js
```

很复杂是不是？比起 npx create-react-app 麻烦太多太多了，但是在企业里有很多独特的需求必须要使用 webpack 来配置项目，所以，webpack 的相关配置是我们必须要学会且熟记的，这也是我们将来获取高薪的一个必备技能点！

## 课程小结

使用 webpack 创建 react 项目，需要创建 webpack/webpack.config.js 文件以及在根目录创建.babelrc 文件。其中 babelrc 文件的配置是为了让我们的 node 和 webpack 能读取 react 的 jsx 格式；而 webpack.config.js 文件是我们项目启动的核心：

> entry: 入口文件，指定该文件可以让 webpack 从这个导入这个文件开始，将所有有关联的文件一网打尽  
> output: 出口配置，在这个对象里配置我们需要输出的文件名和文件路径  
> module: 模块配置，webpack 会读取这里面的 loader 模块，然后使用它们将我们需要的文件进行编译，方便浏览器解析  
> plugins: 插件配置，可以让 webpack 变得更聪明一点

好了，这里就是最基本的 webpack 用法，下一课我们将要学习更多的 loader 和 plugins 的使用方式，同时还要学习如何使用它们来优化我们的项目以获得更好的用户体验。
