> Marion 的 react 实战课程 > 第五部分 > webpack 的配置与优化

上一小节我们学习了 webpack 最小化项目框架的搭建，这一小节我们将要学习如何通过配置 webpack 让它完成更多的工作，让我们的用户获得更好的体验。

## 配置服务器与热更新

上节讲的内容，每次对文件做修改后需要重新执行 webpack 来完成打包工作后才可以访问，很不方便，严重影响我们的工作效率，所以，我们这节第一课的内容就是学习如何配置服务器，让它学会热更新

首先我们需要安装一个服务器，同时为了启动这个服务器，我们还需要安装 webpack-cli

```bash
npm i -D webpack-dev-server webpack-cli
```

然后在我们的 webpack.config.js 文件中添加一个服务器

```javascript
devServer: {
  contentBase: path.join(__dirname, "dist"),
  compress: true,
  // 服务器的端口号
  port: 9000,
  // 是否启动热更新
  hot: true,
  // 我们也可以在这里配置代理
  proxy: {
    '/api': {
      target: 'http://www.baidu.com',
      changeOrigin: true,
      pathRewrite: {
        '^/api': ''
      }
    }
  }
},
```

最后在我们的 package.json 中添加对应的命令：

```json
// 这一行的意思是，使用开发环境和我们配置的config.js文件来启动一个webpack服务器
"start": "webpack serve --mode=development --config webpack/webpack.config.js",
```

好了，现在在终端执行下 npm start 试试

## 加载其它资源

我们刚才执行的 dev 中目前只能加载 js 和 jsx，对于 less 等内容可能就无能为力了。。那我们这一课就来学习如何配置 module 规则进行其它文件的加载

首先，我们需要安装一个插件,这个插件的功能是将所有的样式相关的代码提取到一个单独的 css 文件中并对其进行压缩处理。

```javascript
npm i -D mini-css-extract-plugin
```

然后修改我们的 webpack.config.js

```javascript
// 这个插件的功能是将我们所有的css\less\sass等从react中提取出来，建立一个新的css文件
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

...
// 这段代码放入到module中
{
  test: /\.less/,
  use: [MiniCssExtractPlugin.loader, "css-loader", "less-loader"],
},
{
  loader: "url-loader",
  test: /\.(bmp|gif|jpg|png)$/,
  options: {
    limit: 10000,
    name: "images/[name].[hash:8].[ext]",
  },
},
{
  loader: "url-loader",
  test: /\.(woff|svg|eot|ttf)\??.*$/,
  options: {
    limit: 1024,
    name: "fonts/[name].[ext]",
  },
},

// 这段代码放入到plugins中
new MiniCssExtractPlugin(),
```

然后安装相关依赖

```javascript
npm i -D url-loader file-loader
```

重启系统后我们就可以正常加载 less 等文件了

到这里，我们的开发环境就算是配置完成了。接下来配置生产环境

## 生产环境

## 资源压缩

发布到线上环境，代码都需要经过压缩与混淆操作，一是减少空格、空行等，二是把开发时的语义化代码转换成无意义字母，以减少字节量占用。

### css 压缩

css 压缩需要引入 OptimizeCssAssetsWebpackPlugin 插件

```javascript
npm i -D optimize-css-assets-webpack-plugin
```

安装完成后在 webpack.config.js 中引入并使用

```javascript
const OptimizeCssAssetsWebpackPlugin = require("optimize-css-assets-webpack-plugin");

...

plugins: [new OptimizeCssAssetsWebpackPlugin()];
```

还需要在我们的 package.json 中增加一小段代码

```json
"browserslist": {
  "development": [
    "last 1 chrome version",
    "last 1 firefox version",
    "last 1 safari version"
  ],
  "production": [
    ">0.2%",
    "not dead",
    "not op_mini all"
  ]
}
```

### js 压缩

js 压缩需要引入 TerserWebpackPlugin 插件

```javascript
npm i -D terser-webpack-plugin
```

安装完成后我们同样需要在 webpack.config.js 中去增加引用

```javascript
const TerserWebpackPlugin = require("terser-webpack-plugin");

...

// 注意，optimization是与entry等属性平级的！！！
optimization: {
  minimize: true,
  minimizer: [
    new TerserWebpackPlugin({
      // 这是默认的一些配置项，可以不配置
      terserOptions: {
        ecma: 5,
        warnings: false,
        parse: {},
        compress: {},
        mangle: true,
        module: false,
        output: null,
        toplevel: false,
        nameCache: null,
        ie8: false,
        keep_fnames: false,
        safari10: true,
      },
    }),
  ],
}
```

### 雪碧图生成

雪碧图的生成是为了减少 http 调用，很多时候我们会发现

```javascript
npm i -D webpack-spritesmith
```

```javascript
new SpritesmithPlugin({
  // 目标小图标，这里就是你要生成的图片的目录
  src: {
    cwd: path.resolve(__dirname, "./src/assets/images/icons"),
    glob: "*.png",
  },
  // 输出雪碧图文件及样式文件，这个是打包后，自动生成的雪碧图和样式，自己配置想生成去哪里就去哪里
  target: {
    image: path.resolve(__dirname, "./dist/sprites/sprite.png"),
    css: path.resolve(__dirname, "./dist/sprites/sprite.css"),
  },
  // 样式文件中调用雪碧图地址写法
  apiOptions: {
    cssImageRef: "../sprites/sprite.png",
  },
  spritesmithOptions: {
    algorithm: "top-down",
  },
});
```

### 图片压缩

代码压缩完成后，图片也是需要压缩的，图片压缩也是一样，需要引用插件

```javascript
npm i -D imagemin-webpack-plugin
```

## 分包

分包，这是一个很强大的工具，它可以将我们的 js 文件，按照引用次数，引用位置等，进行抽取，然后我们就可以控制首页的加载文件大小了。

```javascript
// webpack默认配置
splitChunks: {
  chunks: "async",
  minSize: 30000,
  minChunks: 1,
  maxAsyncRequests: 5,
  maxInitialRequests: 3,
  automaticNameDelimiter: "~",
  name: true,
  cacheGroups: {
    vendors: {
      test: /[\\/]node_modules[\\/]/,
      priority: -10,
    },
    default: {
      minChunks: 2,
      priority: -20,
      reuseExistingChunk: true,
    },
  },
},
```

### chunks 表示从哪些 chunks 里抽取代码：

> initial: 初始块 分开打包异步\非异步模块；
> async: 按需加载块 类似 initial，但是不会把同步引入的模块提取到 vendors 中；
> all: 全部块 无视异步\非异步，如果有异步，统一为异步，也就是提取成一个块，而不是放到入口文件打包内容中;

这里的内容暂时先记着吧，因为没有合适的环境和配置，我们只用最初始模式来分包就行

### 其它配置项

> minSize 代表最小块大小，如果超出那么则分包，该值为压缩前的。也就是先分包，再压缩

> minchunks 表示最小引用次数，默认为 1

> maxAsyncRequests: 按需加载时候最大的并行请求数，默认为 5

> maxInitialRequests: 一个入口最大的并行请求数，默认为 3

> automaticNameDelimiter 表示打包后人口文件名之间的连接符

> name 表示拆分出来块的名字

> cacheGroups：缓存组，除了上面所有属性外，还包括

> test：匹配条件，只有满足才会进行相应分包，支持函数 正则 字符串

> priority：执行优先级，默认为 0

> reuseExistingChunk：如果当前代码块包含的模块已经存在，那么不在生成重复的块
