> 平安蜀黍的前端教程 > 备选知识点 > 使用 webpack 优化项目

### 项目优化

所有文件加载完成后，还需要输出到我们指定的文件目录，而在这个输出的过程中，我们就需要考虑怎样对项目进行优化了。项目优化的主要目的就是减少 http 请求与减少文件下载量，另外还需要考虑到在一个较短的时间段内能否将文件顺利下载完成，是否会因为文件下载过慢造成白屏和闪烁问题，而 webpack 为了实现这个目的提供了非常多的插件(plugins)。

#### 为什么要减少 http 请求？

1、因为 http 请求建立和释放需要时间和资源：客户端连接到 Web 服务器->发送 http 请求->服务器接受请求并返回 HTTP 响应->释放连接 TCP 链接，如果 http 请求很多，不减少 http 请求就会耗费大量时间和资源在建立连接和释放连接上面。[深入了解 http 请求]()

2、浏览器对同一个域名的并发数量有限制：如果页面的并发资源非常多，那后续的资源请求只能等到前面的资源下载完后才开始。

#### 输出文件指纹

上面讲到了文件指纹，那我们就先把所有的文件都加上指纹再输出吧，文件指纹主要用来解决项目更新后一些文件的内容发生了变化但文件名未发生变化，导致 cdn 缓存或浏览器缓存因为无法识别出文件变化以致于仍然会使用缓存中图片的问题。

```javascript
module.exports = {
  output: {
    // 加指纹
    filename: '[name].bundle.[hash:8].js',
    // 输出路径，默认就是dist
    path: path.resolve(__dirname, 'dist'),
  },
};
```

#### 清除打包文件中的内容：clean-webpack-plugin

在每次打包之前，清除掉打包目录中的旧文件

```javascript
npm i -D clean-webpack-plugin

// 导入
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

// 使用
plugins: [
  // 输出文件之前，先清除目标目录中所有的文件
  new CleanWebpackPlugin()
]
```

#### 生成雪碧图：webpack-spritesmith

雪碧图的功能主要是减少 http 请求，将多个小型图标合成一个较大的图片文件，以前我们需要手动合成，现在使用 webpack 就可以通过 webpack-spritesmit 这个 plugin 来合成，同时它会自动生成 less 文件，我们只需要简单地引用即可。

```javascript
// 安装依赖
npm i -D webpack-spritesmith

// 导入
const SpritesmithPlugin = require('webpack-spritesmith');

// 使用
new SpritesmithPlugin({
  // 用于构建源图像的列表
  src: {
    // 指定需要转换的icon文件路径
    cwd: path.resolve(__dirname, 'src/assets/icons'),
    // 需要转换的文件后缀
    glob: '*.png',
  },
  // 文件生成到哪
  target: {
    image: path.resolve(__dirname, 'src/assets/sprite/sprite.png'),
    css: path.resolve(__dirname, 'src/assets/sprite/sprite.less'),
  },
  // 生成css引用图片的地址
  apiOptions: {
    cssImageRef: 'sprite.png',
  },
})
```

#### 图片压缩

在实现页面布局时，我们总是或多或少地会使用一些图片，这些图片有的可能是一些高精度的图片，但我们在 web app 中可能用不上这么高精度的图片，这样我们就可以通过一些图片压缩的 plugin 来对图片进行压缩处理以减少图像的 size 以获得更快的下载速度。

```javascript
// 安装
npm i -D imagemin-webpack-plugin
// npm 可能有点慢，可以试试yarn
yarn add -D imagemin-webpack-plugin

// 导入
const ImageminPlugin = require('imagemin-webpack-plugin').default

// 使用
new ImageminPlugin({
  // 图片压缩比较费时，所以我们在这里加多一个判断，只有在生产环境才会压缩
  disable: process.env.NODE_ENV !== 'production',
  pngquant: {
    // 调节图片输出质量
    quality: '60-80',
  },
})
```

#### 代码分割

当我们的工程越来越完善的时候，也就表示着代码量越来越庞大。我们可以通过 webpack 的 splitChunk 来将公共代码抽取出来，以避免重复。这种方式有几个好处：

1. 公用文件抽取出来后，减少了主文件包的大小，加快主文件包的下载速度，减少了首页渲染白屏时间；

2. 项目更新后，因为公共文件内的代码不会发生变化，所以，下次用户访问时请求的文件就可以直接访问缓存中的文件，直接省掉了一个文件的下载；

3. 公用文件可以被多个项目复用，我们在执行完成 build 命令后，可以通过脚本文件修改生成的 html 页面中公共文件的地址，达到缓存代码的目的。

```javascript
optimization: {
  minimizer: [
    new UglifyJsPlugin({
      exclude: /\.min\.js$/, // 过滤掉以".min.js"结尾的文件，这个后缀本身就是已经压缩好的代码，没必要进行二次压缩
      cache: true,
      parallel: true,
      sourceMap: true,
      extractComments: false,
      uglifyOptions: {
        output: {
          // 移除注释
          comments: false,
        },
      },
    }),
    new OptimizeCSSAssetsPlugin({
      assetNameRegExp: /\.css$/g,
      cssProcessorOptions: {
        parser: safeParser,
        autoprefixer: {
          disable: true,
        },
        discardComments: {
          removeAll: true, // 移除注释
        },
      },
      canPrint: true,
    }),
  ],
  splitChunks: {
    minChunks: 3,
    cacheGroups: {
      commons: {
        test: /[\\/]node_modules[\\/]/,
        name: 'vendor',
        chunks: 'all',
      },
    },
  },
  // 可取'single', 'multiple', default 为false
  // 此处等于 runtime的chunkname 即为'runtime'
  runtimeChunk: 'single',
}
```
