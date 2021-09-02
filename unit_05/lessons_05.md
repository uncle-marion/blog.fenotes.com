> Marion 的 react 实战课程 > 第五部分 > webpack 与 env 的配置

# webpack 与 env 配置

## 项目打包与发布

项目发布时我们需要考虑很多种情况：
首先，是我们需要知道发布环境是否有服务器支持：
一般来说，在中大型公司，前端是会有自己的服务器架构的，那么我们只需要考虑整体的业务开发就行，项目规划这些我们都不用管，都由你们未来的 leader 来搞定。

### 一般发布(有后台支持的纯静态文件上传)

> 纯静态文件上传，这种我们什么都用不着管，直接将文件上传到指定位置。甚至就连上传的事情也不用我们操作，我们只需要将需要上线发布的版本号交给负责发布的同事就好，然后包括打包和上传的事情都会有专人负责。

### 无服务器发布

> 但在有些时候，我们的服务可能比较简单，或者不需要服务器支持。这种情况也是纯静态的文件上传，但需要我们自己执行 npm run build 命令，然后使用 ftp 工具将文件上传到服务器指定位置；需要注意的是，因为没有服务器支持，我们需要将路由文件中的 BorwerRouter 替换成 HashRouter，这样才能通过 react 来访问我们的文件路由

### 自带前端服务器发布

> 最后的一种，也是相对复杂的一种，我们需要自己构建服务并且发布相对应的版本，这涉及到大量的环境配置

#### 环境变量配置

在没有后端服务器支撑的情况下，我们需要建立自己的服务器环境，又因为每个公司的服务器配置流程并不一样，且我自己手上并没有一台可用的空服务器，所以，在这里我只能告诉你们大概需要哪些依赖，有哪些配置以及相关工具，没办法完整地将整个流程展示给你们：

正常来说，我们在建立项目时就已经知道，当前这个项目是需要后台配置环境还是前端配置环境，所以，在项目建立之初，我们需要在根目录设置两到三个配置文件：
一是本地开发环境，一是给测试同事使用的测试环境，还有一个生产环境。每一个环境所对应的变量都是不一样的，比如开发环境和测试环境可能使用同一台测试服务器提供的 api 来进行开发和测试，但生产环境的数据绝对是不可用于开发和测试的，这会造成数据的混乱。所以，我们要做的第一件事是配置环境变量：

##### config 配置

> - .env 环境变量配置文件
>   .env 文件主要是用于存储各个环境的变量配置，一般来说我们需要在项目的根目录下建立三个文件：
>   .env 这是默认文件，用于开发环境配置和所有环境的公共设定；
>   .env.test，这是测试环境文件，如果是小公司的话，估计与.env 文件是一致的，但也不排除有其它可能，所以我们依然需要建立；
>   .env.production，这个是生产环境的变量配置，它会覆盖我们在.env 中同名的配置。

##### webpack 配置

react 项目

#### 服务器相关工具的知识

> nginx
> pm2
> ssh

#### 编辑脚本文件

startup.sh

```c#
#!/bin/bash -e
# root
## 这里是我们的环境变量名称，$1对应的是product或test等等
env=$1
## 修改服务器环境变量
export PATH=$PATH:/usr/local/nodejs/bin:/usr/sbin:/usr/local/git/bin

## echo是打印的意思，我们通过这个命令在控制台打印日志，以检查可能出现的问题
echo "[startup step 1] <项目名称> start startup.sh"
## 检查node版本号
echo "[node -v] "`node -v`
## 检查npm版本号
echo "[npm -v] "`npm -v`
## 检查用户名（这里很重要，注意，很多企业这里是有特定用户名的，需要向运维同事询问，如果用户名权限不对就会出问题的）
echo "[current user] "`whoami`

## 定义node的安装环境（一般都需要运维同事会告诉你）
NODE_ROOT=/usr/local/node
## 定义项目名称，替换时需要将<>一起换掉
PROJECT_NAME=<项目名称>
## 定义安装路径（这两个变量就是我们上面定义的变量）
PROJECT_ROOT=$NODE_ROOT/$PROJECT_NAME
## 定义日志存储路径
LOG_ROOT=$NODE_ROOT/logs/$PROJECT_NAME

## 打印日志，检查可能出现的问题
echo "[startup step 2] echo something..."
echo "NODE_ROOT: ${NODE_ROOT}"
echo "PROJECT_NAME: ${PROJECT_NAME}"
echo "PROJECT_ROOT: ${PROJECT_ROOT}"
echo "LOG_ROOT: ${LOG_ROOT}"
echo "Run env: ${env}"
echo "user: "`whoami`
echo "npm -v:"`npm -v`
echo "node -v:"`node -v`

## 参考第一行，如果没有拿到环境变量名称，到这就不再运行了，需要请运维同事帮忙检查服务器是否正常
if [ "$env" = "" ];
  then
    echo "[Error] the start.sh need a environment argument"
    echo "[Maybe] the argument must be one of them [ local / test / test2 / pre / prod ]"
    exit 1
fi

echo "[startup step 3] export NODE_ENV=${env} EGG_SERVER_ENV=${env}"

## 输出配置变量，我们的package.json文件需要用它来知道应该执行对应的config文件
export NODE_ENV=${env} EGG_SERVER_ENV=${env}

## 进入运行环境对应的文件夹
cd $PROJECT_ROOT

echo "[startup step 4] mkdir -p logs dir"
## 创建日志存储文件夹
mkdir -p $LOG_ROOT

echo "[startup step 5] npm cache clean --force"
## 强制清除所有的npm缓存
npm cache clean --force

echo "[startup step 6] npm install --production --registry=https://registry.npm.taobao.org"
## 安装依赖（默认的npm库是npmjs的，所以我们要在这里修改指向到taobao）
npm install --production --registry=https://registry.npm.taobao.org

echo "[startup step 7] npm run stop"
## 停止所有服务
npm run stop

echo "[startup step 8] npm run build"
## 执行打包命令
npm run build

echo "[startup step 9] npm run start"
## 启动服务
npm run start
## 在控制台日志里打印服务启动完成，在运维日志看到这行表示我们的项目部署成功了，如果不能访问或其它问题，基本上都需要找运维同事解决
echo "[Success] Server is running..."

```

#### 项目发布

在我们配置好环境变量且安装好相关工具后，就要开始部署我们的项目了

> 1. 将 git 服务器上指定版本的 tag clone 至发布环境

> 2. 如同本地开发环境一样，直接安装所有依赖

> 3. 执行我们上面写好的脚本。。
