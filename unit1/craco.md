> 平安蜀黍的前端教程 > 备选知识点 > Craco 配置文件

Craco 是与 Customize-cra 类似的一个 React 项目管理工具。

```javascript
//
const { whenDev, whenProd } = require('@craco/craco');
const webpack = require('webpack');
const CracoLessPlugin = require('craco-less');
const WebpackBar = require('webpackbar');
const TerserPlugin = require('terser-webpack-plugin');
const CircularDependencyPlugin = require('circular-dependency-plugin');
const AntdDayjsWebpackPlugin = require('antd-dayjs-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const DashboardPlugin = require('webpack-dashboard/plugin');
const SimpleProgressWebpackPlugin = require('simple-progress-webpack-plugin');

const path = require('path');

const pathResolve = pathUrl => path.join(__dirname, pathUrl);

module.exports = {
  webpack: {
    // 别名配置
    alias: {
      '@': pathResolve('src'),
    },
    plugins: [
      // webpack构建进度条
      new WebpackBar({
        profile: true,
      }),
      // 查看打包的进度
      new SimpleProgressWebpackPlugin(),
      // 时间转换工具采取day替换moment
      new AntdDayjsWebpackPlugin(),
      // 开发环境
      ...whenDev(
        () => [
          // 模块循环依赖检测插件
          new CircularDependencyPlugin({
            // 排除node_modules
            exclude: /node_modules/,
            // 包含src
            include: /src/,
            failOnError: true,
            allowAsyncCycles: false,
            cwd: process.cwd(),
          }),
          // 用于观察webpack的打包进程
          new DashboardPlugin(),
          // 热更新
          new webpack.HotModuleReplacementPlugin(),
        ],
        []
      ),
      // 生产环境
      ...whenProd(
        () => [
          new TerserPlugin({
            // sourceMap: true, // Must be set to true if using source-maps in production
            terserOptions: {
              ecma: undefined,
              parse: {},
              compress: {
                warnings: false,
                drop_console: true, // 生产环境下移除控制台所有的内容
                drop_debugger: true, // 移除断点
                pure_funcs: ['console.log'], // 生产环境下移除console
              },
            },
          }),
          // html 文件方式输出编译分析
          new BundleAnalyzerPlugin({
            analyzerMode: 'static',
            openAnalyzer: false,
            reportFilename: path.resolve(__dirname, `analyzer/index.html`),
          }),
          // 打压缩包
          new CompressionWebpackPlugin({
            algorithm: 'gzip',
            test: new RegExp('\\.(' + ['js', 'css'].join('|') + ')$'),
            threshold: 1024,
            minRatio: 0.8,
          }),
        ],
        []
      ),
    ],
    //抽离公用模块
    optimization: {
      splitChunks: {
        cacheGroups: {
          commons: {
            chunks: 'initial',
            minChunks: 2,
            maxInitialRequests: 5,
            minSize: 0,
          },
          vendor: {
            test: /node_modules/,
            chunks: 'initial',
            name: 'vendor',
            priority: 10,
            enforce: true,
          },
        },
      },
    },
    /**
     * 重写 webpack 任意配置
     *  - configure 能够重写 webpack 相关的所有配置，但是，仍然推荐你优先阅读 craco 提供的快捷配置，把解决不了的配置放到 configure 里解决；
     *  - 这里选择配置为函数，与直接定义 configure 对象方式互斥；
     */
    configure: (webpackConfig, { env, paths }) => {
      // paths.appPath='public'
      paths.appBuild = 'dist'; // 配合输出打包修改文件目录
      // webpackConfig中可以解构出你想要的参数比如mode、devtool、entry等等，更多信息请查看webpackConfig.json文件
      /**
       * 修改 output
       */
      webpackConfig.output = {
        ...webpackConfig.output,
        ...{
          filename: whenDev(() => 'static/js/bundle.js', 'static/js/[name].js'),
          chunkFilename: 'static/js/[name].js',
        },
        path: path.resolve(__dirname, 'dist'), // 修改输出文件目录
        publicPath: '/',
      };
      /**
       * webpack split chunks
       */
      // webpackConfig.optimization.splitChunks = {
      //   ...webpackConfig.optimization.splitChunks,
      //   ...{
      //     chunks: 'all',
      //     name: true
      //   }
      // }
      // 返回重写后的新配置
      return webpackConfig;
    },
  },
  babel: {
    presets: [],
    plugins: [
      // AntDesign 按需加载
      [
        'import',
        {
          libraryName: 'antd',
          libraryDirectory: 'es',
          style: true,
        },
        'antd',
      ],
      // 装饰器
      [
        '@babel/plugin-proposal-decorators',
        {
          legacy: true,
        },
      ],
    ],
    loaderOptions: (babelLoaderOptions, { env, paths }) => {
      return babelLoaderOptions;
    },
  },
  /**
   * 新增 craco 提供的 plugin
   */
  plugins: [
    // 配置Antd主题less
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: { '@primary-color': '#1DA57A' },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
  // 开发服务器
  devServer: {
    // 端口配置
    port: 8080,
    // 代理配置
    proxy: {
      '/api': {
        // 指定代理服务器
        target: 'http://shop.fenotes.com/',
        // 是否修改源
        changeOrigin: true,
        // 是否需要重写路径
        pathRewrite: { '^/api': '' },
      },
    },
  },
};
```
