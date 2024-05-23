> 平安蜀黍的前端教程 > 第一单元 开发环境与工具封装 > 构建一个全新的 React 项目

上一课我们学习了使用 webpack 从零开始创建一个项目，不得不说，非常繁琐，我们需要配置很多的 loader 和其它扩展才能让项目运行起来。

所以，为了让我们的开发人员更好地关注业务实现而不是一点点去配置生成项目，React 官方推出了一个叫 Create React App 的**用于构建 React 单页面应用的脚手架**工具。它本身**集成了 Webpack**，并配置了一系列**内置的 loader**和**默认的 npm**脚本，可以很轻松的实现**零配置**开发 React 的应用。因为 Create React App 比较长，所以我们一般采用首字母缩写来表示它： CRA。

## 一、使用 CRA 来创建一个 React 项目

```shell
# 全局安装一个create-react-app的脚手架工具
npm install -g create-react-app

# 使用脚手架创建你的项目
create-react-app 你的项目名

# 也可以通过添加--template typescript来创建一个TS项目
create-react-app 你的项目名 --template typescript

# 也可以这样创建，注意这里用的是npx而不是npm
npx create-react-app 你的项目名
```

官方推荐使用 **npx** create-react-app 来创建项目。因为它**不会在本地保留 Create-React-App 的副本**，而是在使用完成后立刻删除。要注意的是，前面三个字母是 **npx** 而不是 npm；

npx 是 npm 的一个新工具，它可以将远程 Node 项目拉回到本地临时文件里运行，完成后再删除掉这个临时文件。它最大的好处是减少了我们全局安装某些脚手架的操作，实例如下：

```shell
# 创建项目, 注意你的项目名，必须是英文字母开头可以包含数字和下划线，不允许出现其它字符
npx create-react-app 你的项目名

# 如果你要建的是一个ts项目, 在后面加上--template typescript 后缀
npx create-react-app 你的项目名 --template typescript

# 项目创建完成后, 通过终端进入你的项目文件夹
cd 你的项目名

# 或者将你的命令用&&号连接起来也行
npx create-react-app 你的项目名 && cd 你的项目名
```

进入项目后，执行 yarn 或 npm i 命令安装所有依赖即可运行。

## 二、保持代码规范

### 1. 集成 ESLint

#### 配置最基本的 ESLint 环境

这里可以参考之前讲过的[关于 ESLint](/unit1/eslint.md)

#### 安装更多依赖

根据不同的项目，ESLint 需要依赖不同的插件和解析器，这里以我们将来接触最多的 TypeScript + React 为例，首先需要先安装依赖到开发环境：

```shell
# 安装 eslint-plugin-react 配置包扩展支持 React 语法
# 安装 @typescript-eslint/parser，替代掉默认的 Espree 解析器
# 安装 @typescript-eslint/eslint-plugin 提供额外的 ts 语法的规则
yarn add -D eslint-plugin-react @typescript-eslint/parser @typescript-eslint/eslint-plugin
```

上面这些依赖项都是我们开发时需要，部署到线上环境时并不依赖，所以需要保存到 Package.js 的 devDependencies 里面，安装时就必须使用-D

#### 增加配置项

修改刚刚新建的 .eslintrc.js 文件：

```javascript
module.exports = {
  // 指定运行环境
  env: {
    // 浏览器环境
    browser: true,
    // ES2021环境
    es2021: true,
    // Node环境
    node: true,
  },
  root: true,
  // 继承如下规则
  extends: [
    'eslint:recommended', // eslint 推荐配置
    'plugin:react/recommended', // React 推荐配置
    'plugin:prettier/recommended', // 解析器推荐配置
    'plugin:@typescript-eslint/recommended', // typescript 推荐配置
  ],
  overrides: [],
  // 指定解析器
  parser: '@typescript-eslint/parser',

  parserOptions: {
    // 指定 ECMA 版本为最后一次发布
    ecmaVersion: 'latest',
    // 指定代码为ECMA模块
    sourceType: 'module',
    // 批量ECMA 语法特性为JSX
    ecmaFeatures: {
      jsx: true,
    },
  },
  // 依赖插件
  plugins: ['react', '@typescript-eslint'],
  rules: {
    // 随便定义了一些规则，实际运用中你们需要自己去之前的ESLint文档中找
  },
};
```

#### 增加 Airbnb 规则

上面的配置可以让我们使用 ESLint 和 TypeScript 推荐的代码风格，但目前国内大多数企业所用的代码风格是 Airbnb 风格，所以我们还需要安装 Airbnb 的风格依赖：

```shell
yarn add -D airbnb eslint-config-airbnb eslint-config-airbnb-typescript
```

安装完成后我们需要重新调整.eslintrc.js 文件

```javascript
module.exports = {
  // 指定运行环境
  env: {
    // 浏览器环境
    browser: true,
    // ES2021环境
    es2021: true,
    // Node环境
    node: true,
  },
  root: true,
  // 继承如下规则
  extends: [
    'airbnb', // Airbnb基础规则
    'airbnb-typescript', // Airbnb TypeScript规则
    'airbnb/hooks', // Airbnb 的 React规则
    'plugin:@typescript-eslint/recommended', // typescript 推荐配置
  ],
  overrides: [],
  // 指定解析器
  parser: '@typescript-eslint/parser',
  parserOptions: {
    // 指定 ECMA 版本为最后一次发布
    ecmaVersion: 'latest',
    // 指定代码为ECMA模块
    sourceType: 'module',
    // 批量ECMA 语法特性为JSX
    ecmaFeatures: {
      jsx: true,
    },
    project: './tsconfig.json',
  },
  // 依赖插件
  plugins: ['react', '@typescript-eslint'],
  rules: {
    // 随便定义了一些规则，实际运用中你们需要自己去之前的ESLint文档中找
    'react/react-in-jsx-scope': 'off', // React17后不需要在jsx中主动引入react
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
```

#### 修改 package.json 文件

最后，我们打开根目录的 package.json 文件，在 scripts 项中增加下面的代码：

```javascript
"scripts": {
    ... // 原有的方法
    // 新添加的lint命令，意思是使用.eslintrc.js检测src文件夹下的后缀为.ts,.tsx,.js,.jsx的所有文件,并对可自动修复的eslint报错进行修复
    "lint": "eslint  --ext .ts,.tsx,.js,.jsx ./src --fix"
  },
```

到这里，我们已经可以正常使用 yarn lint 命令来检测我们的代码质量了。

### 2. 配置 Prettier

Prettier 是用于统一代码风格的，我们需要在项目的根目录下新建一个.prettierrc 文件，然后将下面的代码复制进去：

#### 配置文件

```bash
{
  useTabs: false,
  tabWidth: 2,
  semi: true,
  arrowParens: 'avoid',
  singleQuote: true,
  jsxBracketSameLine: true,
  trailingComma: 'es5',
  bracketSpacing: true,
  endOfLine: "lf",
};
```

关于详细的 prettier 属性，我们可以参考这里https://prettier.nodejs.cn/docs/en/options.html

#### 忽略文件

项目根目录添加.prettierignore，忽略一些不需要 prettier 格式化的文件

```bash
**/*.png
**/*.svg
package.json
dist
.DS_Store
node_modules
```

#### 解除 Prettier 与 ESLint 的冲突

要避免 Prettier 与 ESLint 冲突，我们需要再安装几个包：

```shell
yarn add -D prettier prettier-eslint eslint-config-prettier eslint-plugin-prettier
```

eslint-config-prettier 的作用是关闭 eslint 中所有不必要的或可能与 prettier 冲突的规则，让 eslint 检测代码时不会对这些规则报错或告警。比如 eslint 规定是双引号，而我们用 prettier 格式化代码时是用单引号，会存在冲突。我们在 eslint-config-prettier 代码可以看到，例如缩进、引号等格式规则都被关闭了。关闭后，我们可以完全自定义 prettier 来格式化我们的代码，而不受 eslint 影响。

eslint-plugin-prettier 是一个 ESLint 插件。上面我们说关闭了一些 eslint 的代码格式规则。假设我们约定 prettier 规则使用双引号，然而敲代码写成单引号，我还是希望能够按 prettier 的规则给我一些代码不规范的报错或警告提示。那么 eslint-config-prettier 是关闭了 eslint 中与 prettier 冲突的规则，eslint-plugin-prettier 就是开启了以 prettier 为准的规则，并将报告错误给 eslint。

安装完成后我们还需要在.eslintrc.js 文件中添加一行：

```javascript
{
  extends: [
    // ... 原来的代码
    'plugin:prettier/recommended'
  ]
}
```

### 3. 配置 EditorConfig

之前在讲 VSCode 扩展的时候有讲到，EditorConfig 是用来统一团队所有人的编辑器的代码风格的，所以，在我们的每一个新项目里必须要添加.editorconfig 文件以统一团队风格。

在项目的根目录添加.editorconfig 文件并复制下面的代码粘贴

```bash
# http://editorconfig.org
root = true #表示当前是最顶层的配置文件

[*] # 以下规则匹配所有文件
charset = utf-8 # 编码类型
indent_style = space # 缩进类型
indent_size = 2 # 缩进量
end_of_line = lf # 换行符
insert_final_newline = true # 是否需要让文件以一个空行结束
trim_trailing_whitespace = true # 是否需要删除换行符前的空格
max_line_length = 80 # 最大行宽
```

**注意** 这里面的配置如果与.prettier 中的配置重复了，可以删除掉.prettierrc.js 中的重复配置；

**小提示** 如果你的同事使用的是 OSX 而你使用的是 Windows，你可能会遇到关于换行符的警告，它会让你非常难受，解决的办法：

> 1. VSCode 按 Ctrl + ","唤出设置窗口，在搜索框中输入 eol，点击选择"\n"。这样修改过以后，你以后编辑的文档也都以 lf 为换行符了。

> 2. 在终端中输入以下代码并回车

```shell
# 这行代码的意思是在git的全局配置里添加一项core.autocrlf的配置项，
# core.autocrlf配置项的功能是如果在提交代码时发现有crlf的换行符时，转换成lf
# 如果在clone代码时发现有lf时就转换成crlf
# 如果你已经修改了eol的值为"\n"，那么在这里可以写成input或false
git config --global core.autocrlf true
```

### 4. 安装 Lint-Staged

由于检查代码命令是对整个项目代码有效，有时候我们只想对自己改动的代码进行检查，而忽略项目其他代码。我们可以使用 lint-staged，它可以让我们执行检查命令只对 git 暂存区的文件有效。

```shell
yarn add -D lint-staged
```

安装完成后我们需要在 package.json 中添加代码

```json
{
  "scripts": {
    "lint-staged": "lint-staged"
  },
  "lint-staged": {
    "**/*.{js,jsx,ts,tsx}": "eslint --ext .js,.jsx,.ts,.tsx", // 使用eslint检查所有的.js,.jsx,.ts,.tsx文件代码
    "**/*.{js,jsx,tsx,ts,css,md,json}": "prettier --ignore-unknown --write" // 使用prettier格式化所有的js,jsx,tsx,ts,css,md,json文件
  }
}
```

现在，我们在每一次执行 git add .命令后，都需要执行 yarn lint-staged 命令来检查我们的代码是否符合公司的规范。
为了减少这种手动的操作或避免其它同事在提交代码后故意跳过代码检查，我们还需要安装 husky 来为每一次 add .命令绑定自动执行操作。

#### 安装 husky

```shell
yarn add -D husky
```

安装完成后在控制台执行命令

```shell
yarn husky install
```

执行完成后，husky 会在我们的项目根目录下生成一个文件.husky

最后再次在控制台执行命令

```shell
npx husky add .husky/pre-commit "yarn lint-staged"
# 这个命令的意思是在我们使用commit命令之前先执行yarn lint-staged命令
```

命令执行完成后，我们的项目就具有了在每次提交代码前自动检查，自动格式化的功能了。

## 三、使用 Craco 来扩展 WebPack

使用 CRA 创建的项目在开发中可能需要扩展 WebPack 中的配置，比如增加 Less 解析、配置服务器代理等。但因为 CRA 创建的项目中 WebPack 配置文件是隐藏的，如果直接修改需要执行 eject 命令来暴露隐藏的配置文件，而且配置文件一旦暴露后就不能再享受到 CRA 带来的便利和后续的升级。

如果想在不执行 eject 命令的前提下重写 WebPack 配置，我用过的有下面几种方式：

- 使用 React-App-Rewired + Customize-cra 组合来覆盖 CRA 配置

- 使用 Craco 来覆盖 CRA 配置

因为 Customize 到目前为止已经有接近 5 年没有更新了，所以我们主要还是以 Craco 配置为主，[Customize](/unit1/customizeCra.md)的相关配置我放在了附录里，你们可以在遇到了使用 Customize 配置的较老项目时看一看。

Craco 的全文是 Create React App Configuration Override，一个简单易懂的 create-react-app 配置层。通过在应用程序的根目录添加单个配置（例如）文件并自定义 ESLint、Babel、PostCSS 配置等等，无需使用“eject”即可获得创建 React App 和自定义的所有好处。

### 1. 安装 Craco 依赖

```shell
yarn add @craco/craco
```

### 2. 简单配置 Craco

安装完成后，需要在我们的项目根目录下创建 craco.config.js 文件并根据我们自身的需求来完善配置：

```javascript
module.exports = {
  // 指定React-scripts
  reactScriptsVersion: 'react-scripts',
  webpack: {
    configure(webpackConfig) {
      // 我们未来需要添加的扩展配置都在这写
      return webpackConfig;
    },
  },
};
```

[Craco 官方文档](https://craco.js.org/docs/)

在创建完 craco.config.js 文件后，我们还需要修改项目的 package.json 文件

```json
"scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject",
    "lint": "eslint  --ext .ts,.tsx,.js,.jsx ./src --fix"
  },
```

将原有的 scripts 属性中的 start、build、test 都改成使用 craco 来启动，删除掉原有的 eject 项以避免后期有其它同事错误执行。

```json
"scripts": {
    "start": "craco start",
    "build": "craco build",
    "test": "craco test",
    "lint": "eslint  --ext .ts,.tsx,.js,.jsx ./src --fix"
  },
```

现在，我们可以执行 yarn start 来启动项目了。

### 3. 配置 less

CRA 创建的项目默认是不支持 less 文件的，所以我们需要安装扩展并在 craco.config.js 中增加配置项

#### 安装依赖包

```shell
npm i craco-less
# 或
yarn add craco-less
```

#### 增加配置项

```javascript
// 页首导入less解析文件
const CracoLessPlugin = require('craco-less')
// 在 module.exports 中新增 plugins 属性
plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: { // 配置可以参照webpack的less-loader具体配置
          lessOptions: {
            javascriptEnabled: true // 允许less文件中使用js表达式
          }
        }
      }
    }
  ],
```

### 4. 配置移动端自适应

首先安装插件：

```shell
yarn add lib-flexible
# 这个插件需要在浏览器运行时往body标签上写入属性，所以不能安装在devDependencies里
yarn add -D postcss-pxtorem
# pxtorem会在打包时将px转化成rem，在浏览器运行时没有任何工作，所以它需要安装在devDependencies里
```

#### 增加配置项

```javascript
// 页首导入postcss-pxtorem
const PostcssPx2Rem = require('postcss-pxtorem');
// 在 module.exports 中新增 style 属性
style: {
  postcss: {
    mode: 'extends',
    loaderOptions: () => {
      return {
        postcssOptions: {
          ident: 'postcss',
          config: false,
          plugins: [
            PostcssPx2Rem({
              rootValue: 37.5, // 设计稿尺寸/10
              propList: ['*'], // 需要转换的样式属性，默认为 ['*']，即匹配所有属性
              exclude: /node_modules/i // 排除掉node_modules中转换
            })
          ]
        },
        sourceMap: false
      }
    }
  }
}
```

#### 入口文件绑定

在 src 目录下找到 index.tsx 文件，在文件的上部导入 lib-flexible 文件

```javascript
import 'lib-flexible';
```

### 5. 配置开发服务器

CRA 创建的 React 项目已经默认安装了 devServer，只是我们在开发过程中往往都需要配置代理以访问后端接口，所以，需要在 craco.config 中显式地指定

```javascript
module.exports = {
  //...
  devServer: {
    hot: true, // 允许webpack的热更新
    port: 2926, // 服务器端口号，也可以在package.json中指定，但显式地写在这里显然更方便
    // 服务器代理，解决跨域问题，在开发时可以让我们更简单地访问接口服务器
    // 具体文档可以查询WebPack的DevServer文档：https://webpack.js.org/configuration/dev-server/
    proxy: [
      {
        context: ['/api'], // 需要拦截的路径，可以有多个，也可以是个方法
        target: 'http://data.fenotes.com', // 需要拦截的域名，当我们通过浏览器访问这个域名时就会被拦截到
        pathRewrite: { '^/api': '' }, // 是否需要重写路径
      },
    ],
  },
};
```

### 6. 配置别名

在开发过程中，我们经常需要在当前文件中访问其它文件，如果是兄弟文件还好，但实际工作中往往都是跨文件夹的访问，比如 css 中导入图片，JSX 中导入其它组件等等，每次导入时手写文件路径是很麻烦的一件事情，有时因为不小心可能还会因为一些低级错误导致无法正常读取，耽误很多时间。webpack 提供了别名服务，我们可以将一些文件路径指定一个简写或快捷方式：

```javascript
module.exports = {
  // ...
  webpack: {
    // 配置别名
    alias: {
      // 约定：使用 @ 表示 src 文件所在路径
      '@': path.resolve(__dirname, 'src')
    },
   // ...
}
```

### 7. 开启装饰器语法

```shell
yarn add @babel/plugin-proposal-decorators @babel/plugin-proposal-class-properties
```

安装完成后在 craco.config.js 中添加

```javascript
module.exports = {
  //...
  babel: {
    // 用来支持装饰器语法
    plugins: [
      ['@babel/plugin-proposal-decorators', { legacy: true }],
      ['@babel/plugin-proposal-class-properties', { loose: true }],
    ],
  },
  //...
};
```

### 8. 打包分析

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
