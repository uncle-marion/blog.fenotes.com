> 平安蜀黍的前端教程 > 备选知识点 > 安装 Terminal 与 PowerShell

### 1.安装 Windows Terminal

这个非常简单，直接在 Microsoft Store 搜索下载就可以了

### 2.安装 Powershell Core

这个 Powershell Core 与系统自带的 Powershell 是完全不同的两个东西，除了功能相似和名字相同，两者内在已经天差地别。自带的 Powershell 错误提示冗长，颜值低，速度慢，总之就是特别不值得去用。

Powershell Core 下载地址：https://github.com/PowerShell/PowerShell/releases/tag/v7.0.1

软件安装没什么难度，按照提示一路点击就行。

### 3.安装 Powershell 相关插件

打开我们刚刚安装的 powershell，逐行输入以下命令
(可能你们在执行下面的命令会出现一些意外的报错，那么，就自己百度去解决吧)

```javascript
# 1. 安装 PSReadline 包，该插件可以让命令行变得好用，类似 zsh
Install-Module -Name PSReadLine -AllowPrerelease -Force

# 2. 安装 posh-git 包，让你的 git 更好用
Install-Module posh-git -Scope CurrentUser

# 3. 安装 oh-my-posh 包，让你的命令行更酷炫、优雅
Install-Module oh-my-posh -Scope CurrentUser
```

后两个包的来源不受系统信任，不用管它，如果让你选择是否信任，直接输入 Y 即可。

### 4.配置 Windows Terminal

运行 windows Terminal，按 ctrl + ',', 或点击左上角的向下箭头，在弹出层中选择打开 JSON 文件。然后复制下面这个文件中所有的内容覆盖粘贴进去即可。

[terminal_config.json](../assets/configs/terminal_config.json)

注意：在文件的 37、42、44 行，需要将对应的路径改成你自己的 powershell 所在路径；同时，你还需要将前面的安装包中的字体文件装入到系统中，不然对应的符号会显示乱码。

### 5.添加 Powershell 启动参数

在你的 powershell 中输入

```javascript
notepad.exe $Profile
```

在弹出的编辑器中粘贴下面这些代码

```javascript
Import-Module posh-git
Import-Module oh-my-posh
Set-PoshPrompt aliens
```

powershell 与 window terminal 配置完成，现在你的控制台可以展示更多内容了，而且支持各种高亮。

### 几个常用命令

```javascript
mkdir <文件夹名称>             // 创建文件夹
rmdir <文件夹名称>             // 删除文件夹
rmdir <文件夹名称> -Force      // 如果文件夹中有隐藏文件删除时会报错，所以需要加上-Force命令
netstat -aon|findstr <端口号> // 查看指定端口占用
tasklist | findstr <进程ID>   // 检查进程ID对应的程序名称
taskkill /f /t /im <进程名称>  // 结束指定程序进程
```
