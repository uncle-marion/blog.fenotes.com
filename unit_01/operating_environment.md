> Marion 前端教程 > 前端开发应知应会 > 第一部分 > 项目的基本运行环境

在开始一切操作之前, 请伪装一下你的专业性，**工作路径中的目录名应该都是由英文单词构成且符合项目语义**！！然后，将你的工作文件夹定在硬盘根目录 c 盘或 d 盘，并将其命名为 Example 或 Workspace。以尽量避免我们在开发的过程中会遇上一些**因为中文路径导致的奇怪且棘手的问题**。

### 设定 vscode 为管理员权限

这个是必须的，要设置为管理员权限启动来**避免**很多因为**权限不足**而造成的问题

### 配置一个养眼的代码环境

这块不强制安装，以后有时间可以自己研究[附件：windows 下安装 iterm](../enclusore/install-iterm.md)

### node 版本管理工具 nvm

**记住一点，公司电脑到手以后第一件事决不能是安装 node!!! 先安装 nvm!!!**

nvm 是用于管理 nodejs 版本的，我们之中有很多人，都是直接上 nodejs 官网上下载 node 安装包进行安装。但在实际业务中这样是行不通的，因为我们无法保证自己接手维护的项目是最新的项目，极有可能这个项目已经开发完成很久了，比如一个 16 年建的项目，它可能还在正常运行，也没什么大毛病，但当你需要维护它的时候你就会发现：它无法**兼容**于现有的 node 版本。所以这时候我们就需要一个工具，可以对开发环境的 **node 版本**作一个快速的切换。**nvm 就是用于管理 nodejs 版本的管理工具**。

nvm 链接地址：https://github.com/coreybutler/nvm-windows/releases

windows 环境推荐下载第三个，nvm-setup.zip

下载完成后，双击安装文件运行，一路点击下一步就行，什么都不用改。安装完成后，在你的桌面上空白处右键选择 open in window terminal as administrator，打开你的 powershell 界面，如果没有 terminal，**可以使用 cmd 或 vscode 都行，检查一下 nvm 的版本号**：

```javascript
nvm version
```

应该可以看到关于 npm 等软件的版本号，这就证明你的 nvm 安装成功了。

#### nvm 常用命令

| 指令                         | 功能                                   |
| :--------------------------- | :------------------------------------- |
| nvm list                     | 查看本地已安装的 node 版本             |
| nvm list available           | 查看远程可安装的 node 版本             |
| nvm install <node version>   | 安装指定版本的 nodejs                  |
| nvm uninstall <node version> | 卸载指定版本的 nodejs                  |
| nvm use <node version>       | 使用指定的 nodejs 版本为当前 node 环境 |

**注意，上面的 "node version"表示的是 node 版本号，比如：**

```javascript
nvm install 14.16.1 // 表示安装14.16.1版本的nodejs到你的系统
nvm use 14.16.1 // 表示我们切换node环境到14.16.1版本
```

### 使用 nvm 安装和切换 node 环境

nvm 与 npm 或 yarn 一样，需要配置指定的库，如果没有配置，则可能会出现一些比如 **timeout** 等问题，所以我们需要配置安装路径到 taobao 的**镜像库**。
找到你的 nvm 安装文件夹，打开 settings 文件夹，在文件最后输入：

```javascript
node_mirror: https://npm.taobao.org/mirrors/node/
npm_mirror: https://npm.taobao.org/mirrors/npm/
```

然后执行上面学到的 nvm list available 命令，检索远端服务器可安装的 node 版本。因为我们是学习，所以，就直接安装 nodejs 的最新稳定版。

```javascript
nvm install 14.16.1
```

安装完成之后，使用 use 命令进行切换：

```javascript
nvm use 14.16.1
```

然后在你的 powershell 或 cmd 中输入：

```javascript
node - v;
npm - v;
```

如果都能正常显示版本号，证明你的 node 也安装完成了。如果不能正常显示版本号，那么可能是你的 node 配置未能自动生效，可能就需要进行一些比较麻烦的排错处理。

**排错**

1. 检查.npmrm 文件，是否有内容指向 c 盘 program 目录，如果有则删除
2. 检查环境变量，node 和 npm 的 path 是否正确

---

### 使用 nrm 管理 npm 镜像库

nrm 是一个 npm 镜像管理工具，使用它可以快速切换 npm 镜像。

- 检查你的 npm 的镜像地址

```javascript
npm config list

// 如果显示 metrics-registry = "http://registry.npmjs.org/"
// 执行 npm config set registry https://registry.npm.taobao.org
```

正常情况下，终端中会显示出你的 npm config 文件中的内容，而第二行一般来说都是

```javascript
metrics-registry = "http://registry.npmjs.org/"
```

http://registry.npmjs.org/这个地址就是我们所说的镜像库地址。到这里不得不说一句，国内的网络环境访问外网资源时网速真的是很让人难受。所以，我们需要一个工具能像nvm那样，可以方便地对npm的镜像库进行管理。这里我们可以使用nrm：

首先全局安装一个 nrm

```javascript
// 全局安装nrm
npm i -g nrm
```

**常用 nrm 指令**

| 指令           | 功能                   |
| -------------- | ---------------------- |
| nrm -V         | 检查版本号             |
| nrm ls         | 获取代码仓库的镜像     |
| nrm test       | 测试代码仓库的响应时间 |
| nrm use npm    | 切换仓库到 npm         |
| nrm use taobao | 切换仓库到 taobao      |

nrm 相对来说比较好装，install 命令执行完成后就可以使用了，安装完成后我们先看看有哪些镜像库可以使用

```javascript
// 打印当前可用npm镜像列表
nrm ls
```

然后使用这个命令切换镜像库

```javascript
// 切换npm镜像地址到淘宝
nrm use taobao
```

### npm 常用命令

| 指令                    | 功能                                                           |
| ----------------------- | -------------------------------------------------------------- |
| npm -v                  | 查看 npm 版本号                                                |
| npm config list         | 查看 npm 配置                                                  |
| npm init                | 在当前目录下创建一个 package.json 文件                         |
| npm install <依赖名>    | 安装依赖，以下都以别名 i 为准                                  |
| npm i                   | npm install 的别名                                             |
| npm i <依赖名>[@版本号] | 安装指定版本号的依赖，注意，这种方式会安装当前大版本的最高版本 |
| npm i <依赖名> -S       | 安装依赖到项目生产环境                                         |
| npm i <依赖名> -D       | 安装依赖到项目开发环境                                         |
| npm i <依赖名> -g       | 安装依赖到本地代码库                                           |
| npm uninstall <依赖名>  | 卸载依赖                                                       |

### 另一个包管理工具 yarn

yarn 是 facebook 发布的想要取代 npm 的一款新的包管理软件，它内部采用了并发式请求，同时会在本地将所有安装过的依赖都缓存起来，所以在安装依赖时要比 npm 快许多。它的安装方式：

```javascript
npm i -g yarn
```

| 指令                       | 功能                                                           |
| -------------------------- | -------------------------------------------------------------- |
| yarn -v                    | 查看 yarn 版本号                                               |
| yarn config list           | 查看 yarn 配置                                                 |
| yarn init                  | 在当前目录下创建一个 package.json 文件                         |
| yarn add <依赖名>          | 安装依赖，以下都以别名 i 为准                                  |
| yarn add <依赖名>[@版本号] | 安装指定版本号的依赖，注意，这种方式会安装当前大版本的最高版本 |
| yarn add <依赖名>          | 安装依赖到项目生产环境                                         |
| yarn add <依赖名> -D       | 安装依赖到项目开发环境                                         |
| yarn add <依赖名> global   | 安装依赖到本地代码库                                           |
| yarn remove <依赖名>       | 卸载依赖                                                       |
| yarn cache clean           | 清除所有项目依赖缓存                                           |

### 使用 yrm 管理 yarn

yrm 的用法与 nrm 完全一致，唯一的区别大概就是名字和管理的对象不同 yr

```javascript
yarn add global yrm
// 或者
npm i -g yrm

yrm ls
yrm use taobao
```

---

### 课后问题

- 前端的运行环境是什么？我们应该使用什么工具来进行管理？
- nvm 管理工具在安装时需要注意哪些事项？你在安装中遇到了哪些问题？怎样解决的？
- nvm 有哪些常用命令？请分别描述。
- 什么是生产环境？什么是开发环境？
- npm 怎样配置镜像库？
- npm 有哪些常用命令？
- yarn 与 npm 的区别在哪里？为什么 facebook 推荐我们使用 yarn?
- yarn 有哪些常用命令？
