> Marion 的 react 实战课程 > 第五部分 > 开发环境配置

# 从什么都没有开始

很多时候，我们进入公司时领到的电脑里除了最基本的操作系统，其它软件都是没有的，如果是 osx 操作系统，基本上没什么太多的问题，很多软件 osx 安装起来很容易。但一般来说，我们领到的电脑都是 win10 的操作系统，所以，如何配置一个适合我们的开发环境就成了一个必然要会的技能了。同时我也不希望咱们大家身为 IT 业的白骨精居然连配置一个简单的软件开发环境都不会。

一般来说，我们前端开发最基本的软件只需要安装 3 个就行，但是相关的环境配置与依赖却比较多，比如 nodejs 的版本快速切换，git 的控制台窗口分支查看，vscode 的插件管理等等：

- 环境软件：nodejs
- 版本管理：git
- 代码编辑：vscode

## 第一步 基本环境配置（非必要！！只是为了美观）

这一步是为了让我们的终端使用起来更方便，增加更多的操作命令，但是刚入公司时，因为时间比较紧，这一步可以省略，等到有时间时再来配置



## 第二步 软件安装

### 安装 nvm

**记住一点，公司电脑到手以后第一件事决不能是安装 node!!! 先安装 nvm!!!**

nvm 是用于管理 nodejs 版本的，我们之中有很多人，都是直接上 nodejs 官网上下载 node 安装包进行安装，但在实际业务中这样是行不通的，因为我们接手的业务可能存在已经很长时间了，它可能无法兼容于现有的 node 版本。所以这时候我们就需要一个工具，可以对开发环境的 node 版本作一个快速的切换。所以，我们需要在我们的电脑上安装 nvm 这样的一个工具，然后再通过 nvm 来进行 node 的版本安装和切换。

nvm 链接地址：https://github.com/coreybutler/nvm-windows/releases

windows 系统下推荐下载第三个，nvm-setup.zip

双击运行后一路点击下一步就行，安装完毕，在你的桌面上空白处右键选择 open in window terminal as administrator，打开你的 powershell 界面输入

```javascript
nvm version
```

应该可以看到关于 npm 等一系列软件的版本号，这就证明你的 nvm 安装成功了

Nvm 常用命令如下

> nvm list 查看本地已安装的 node 版本  
> nvm list available 查看远程可安装的 node 版本
> nvm install <node version> 安装指定版本的 nodejs  
> nvm uninstall <node version> 卸载指定版本的 nodejs  
> nvm use <node version> 使用指定的 nodejs 版本为当前 node 环境

注意，上面的 <node version>表示的是 node 版本号，比如：

```javascript
nvm install 14.16.1 // 表示安装14.16.1版本的nodejs到你的系统
nvm use 14.16.1 // 表示我们切换node环境到14.16.1版本
```

### 安装 node

nvm 与 npm 或 yarn 一样，需要配置指定的库，如果没有配置，则可能会出现一些比如 timeout 等问题，所以我们需要配置安装路径到 taobao 的镜像库。
找到你的 nvm 安装文件夹，打开 settings 文件夹，在文件最后输入：

```javascript
node_mirror: https://npm.taobao.org/mirrors/node/
npm_mirror: https://npm.taobao.org/mirrors/npm/
```

然后执行上面学到的 nvm list available 命令，检索远端服务器可安装的 node 版本。因为我们是学习，所以，就直接安装 nodejs 的最新稳定版。

```javascript
nvm install 14.16.1
```

安装完成之后，在你的 powershell 中输入

```javascript
node - v;
npm - v;
```

如果都能正常显示版本号，证明你的 node 也安装完成了。如果不能正常显示版本号，那么可能是你的 node 配置未能自动生效，解决起来也很简单，执行下面的命令就行

```javascript
nvm use 14.16.1
```

### vscode 安装

vscode 安装相对来说就比较简单了，我们都已经装过很多次了，这里不再复述。关键的是插件的安装，我个人建议安装的插件如下：

> 会了吧 这是一款用于翻译代码中看不懂的英语单词的插件，可以发音，当然发音不是很标准，但它有一个好处，可以督促我们学习英文单词

> Beautify 这款是 vscode 必备插件，它的功能是美化我们的代码（所有语言）

> Beautify css/sass/less 这是美化我们的 css 文件的

> chinese vscode 中文化插件

> editorConfig for vs code 美化代码插件，没有配置文件也能生效，但更好的做法是配置一些自己的规则

> prettier code formatter 美化代码插件，与 editorconfig 几乎一致，我个人比较建议用这个。。比 editorconfig 好用

> ES7 React/Redux/GraphQL/React-Native snippets 这个是用于代码模板的，它内置了许多 react 的代码片段，我们可以输入少量字母后按 tab 键即可生成一份完整的代码片段，具体的代码片段比较多，大家可以参考它的帮助文件。

### 少量常用 linux 命令

| 命令  | 功能                                               | 用法                      |
| :---- | :------------------------------------------------- | :------------------------ |
| ls    | 查看目录，展示当前目录下所有目录和文件名           |                           |
| ll    | 也是查看目录，使用长格式列表展示目录中所有文件信息 |                           |
| mkdir | 创建文件目录                                       | mkdir <目录名称>          |
| vi    | 创建或编辑文件，文件存在就打开，否则就创建后打开   | vi <文件名>               |
| mv    | 移动文件或目录                                     | mv <文件名> <路径\文件名> |
| cp    | 复制文件                                           | cp <文件名> <路径\文件名> |
| lsof  | 查看端口占用,比如查看端口 8000 的占用              | lsof -i:8000              |
| kill  | 终结占用端口的应用                                 | kill -9 id                |
