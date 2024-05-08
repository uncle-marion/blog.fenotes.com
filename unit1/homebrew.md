### 一、安装 homebrew

##### 1. 先尝试执行下面的命令：

```javascript
/bin/zsh -c "$(curl -fsSL https://gitee.com/cunkai/HomebrewCN/raw/master/Homebrew.sh)"
```

##### 如果执行报错，就需要手动安装：

首先，需要确保系统中安装了 bash、git 和 curl，对于 OSX 用户需额外要求安装 Command Line Tools (CLT) for Xcode(电脑中必须安装有 Xcode)。在命令行输入

```javascript
xcode-select --install
```

然后需要在终端执行以下命令：

```javascript
export HOMEBREW_INSTALL_FROM_API=1
export HOMEBREW_API_DOMAIN="https://mirrors.tuna.tsinghua.edu.cn/homebrew-bottles/api"
export HOMEBREW_BOTTLE_DOMAIN="https://mirrors.tuna.tsinghua.edu.cn/homebrew-bottles"
export HOMEBREW_BREW_GIT_REMOTE="https://mirrors.tuna.tsinghua.edu.cn/git/homebrew/brew.git"
export HOMEBREW_CORE_GIT_REMOTE="https://mirrors.tuna.tsinghua.edu.cn/git/homebrew/homebrew-core.git"
```

全部执行完成后，再运行下面的命令：

```javascript
  // 更换homebrew的镜像源为国内
  git clone --depth=1 https://mirrors.tuna.tsinghua.edu.cn/git/homebrew/install.git brew-install /bin/bash brew-install/install.sh

  rm -rf brew-install
```

### 如果你还没有安装 git

```javascript
/bin/bash -c "$(curl -fsSL https://cdn.jsdelivr.net/gh/ineo6/homebrew-install/install.sh)"
```

```javascript
Error: Can't create update lock in /usr/local/var/homebrew/locks!
Fix permissions by running: sudo chown -R $(whoami) /usr/local/var/homebrew
Failed during: /usr/local/bin/brew update --force --quiet
```

如果遇到上面这种报错，可以在终端输入下面内容并执行

```javascript
sudo chown -R "$USER":admin /usr/local
```

### 二、安装 wget

```javascript
brew install wget
```

### 三、安装 yarn

```javascript
brew install yarn
```

### 四、安装 redis:

逐步执行下面的命令

```javascript
3.1、/usr/local/bin/wget http://download.redis.io/releases/redis-4.0.2.tar.gz
3.2、tar xzf redis-4.0.2.tar.gz
3.3、cd redis-4.0.2
3.4、make
```

配置

1. 在/usr/local 目录下创建三个文件夹，包括 bin，etc，db 三个目录

2. 进入/usr/local/etc/文件夹，创建 redis 文件夹，并创建 redis.conf 配置文件

3. 配置文件可直接复制笔记中的 redis.conf 文件，保存到桌面后复制到 redis 文件夹中

4. 输入 redis-server 后回车，可能需要 sudo
