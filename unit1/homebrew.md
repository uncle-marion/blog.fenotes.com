一、安装 homebrew

1. 执行下面这句命令，更换为中科院的镜像：
   git clone git://mirrors.ustc.edu.cn/homebrew-core.git/
   /usr/local/Homebrew/Library/Taps/homebrew/homebrew-core --depth=1
2. 把 homebrew-core 的镜像地址也设为中科院的国内镜像
   cd "$(brew --repo)"
    git remote set-url origin https://mirrors.ustc.edu.cn/brew.git
    cd "$(brew --repo)/Library/Taps/homebrew/homebrew-core"
   git remote set-url origin https://mirrors.ustc.edu.cn/homebrew-core.git
3. 更新
   brew update

如果没有 git

/bin/bash -c "$(curl -fsSL https://cdn.jsdelivr.net/gh/ineo6/homebrew-install/install.sh)"
试试这个源 so快
Error: Can't create update lock in /usr/local/var/homebrew/locks!
Fix permissions by running:
  sudo chown -R $(whoami) /usr/local/var/homebrew
Failed during: /usr/local/bin/brew update --force --quiet
如果遇到上述报错 
命令输入一下内容就可
sudo chown -R "$USER":admin /usr/local

二、安装 wget
brew install wget
三、安装 yarn
brew install yarn
3、安装 redis:
3.1、/usr/local/bin/wget http://download.redis.io/releases/redis-4.0.2.tar.gz
3.2、tar xzf redis-4.0.2.tar.gz
3.3、cd redis-4.0.2
3.4、make
3.5、配置 redis:
3.5.1、在/usr/local 目录下创建三个文件夹，包括 bin，etc，db 三个目录
3.5.2、进入/usr/local/etc/文件夹，创建 redis 文件夹，并创建 redis.conf 配置文件
3.5.3、配置文件可直接复制笔记中的 redis.conf 文件，保存到桌面后复制到 redis 文件夹中
3.5.4、输入 redis-server 后回车，可能需要 sudo
