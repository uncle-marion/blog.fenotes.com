> 平安蜀黍的前端教程 > 备选知识点 > 使用 npm 管理项目依赖

## npm 部分常用命令

| 指令                           | 功能                                                                     |
| ------------------------------ | ------------------------------------------------------------------------ |
| npm -v                         | 查看 npm 版本号                                                          |
| npm config list                | 查看 npm 所有配置                                                        |
| npm init                       | 在当前目录下创建一个 package.json 文件                                   |
| npm install <依赖名>           | 安装依赖，以下都以别名 i 为准                                            |
| npm i                          | npm install 的别名                                                       |
| npm list                       | 查看当前项目的所有依赖版本                                               |
| npm list -g                    | 查看当前运行环境下所有全局依赖的版本                                     |
| npm list --depth=0             | 查看当前项目的所有顶级依赖版本                                           |
| npm list <依赖名>              | 查看指定依赖的版本                                                       |
| npm view <依赖名>              | 查找远程镜像库中指定依赖可用的最新版本                                   |
| npm view <依赖名> versions     | 查找远程镜像库中指定依赖所有的版本                                       |
| npm i -S <依赖名>              | 安装依赖的最新版本到项目的运行环境中                                     |
| npm i -D <依赖名>              | 安装依赖的最新版本到项目的开发环境中                                     |
| npm i -S <依赖名>@<依赖版本号> | 安装依赖的指定版本到项目中，关于依赖的版本，可以关注后面的更多规则部分   |
| npm uninstall <依赖名>         | 从当前项目依赖中删除指定的依赖包                                         |
| npm uninstall <依赖名> -S      | 从当前项目依赖中删除指定的依赖包同时从 package 的 dependencies 中删除    |
| npm uninstall <依赖名> -D      | 从当前项目依赖中删除指定的依赖包同时从 package 的 devDependencies 中删除 |

## package 依赖更新规则

在 package.json 中，我们可以使用 semver 表示法设置要升级到的版本（补丁版本或小版本），例如：

如果写入的是 〜0.13.0，表示我们只允许更新补丁版本：即 0.13.1 可以，但 0.14.0 不可以。

如果写入的是 ^0.13.0，表示允许更新补丁版本和小版本：即 0.13.1、0.14.0、依此类推。

如果写入的是 0.13.0，表示只允许使用当前版本，不允许更新。

**更多规则**

> ^: 允许小版本更新

> ~: 允许补丁包更新。

> \> : 接受高于指定版本的任何版本。

> \>=: 接受等于或高于指定版本的任何版本。

> <=: 接受等于或低于指定版本的任何版本。

> <: 接受低于指定版本的任何版本。

> =: 接受确切的版本。

> -: 接受一定范围的版本。例如：2.1.0 - 2.6.2。

> ||: 组合集合。例如 <2.1 || 2.6>。