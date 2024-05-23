> 平安蜀黍的前端教程 > 备选知识点 > 安装 Terminal 与 PowerShell

### 1 安装 Windows Terminal

这个非常简单，直接在 Microsoft Store 搜索下载就可以了

### 2 安装 Powershell Core

这个 Powershell Core 与系统自带的 Powershell 是完全不同的两个东西，除了功能相似和名字相同，两者内在已经天差地别。自带的 Powershell 错误提示冗长，颜值低，速度慢，总之就是特别不值得去用。

Powershell Core 下载地址：https://github.com/PowerShell/PowerShell/tags

软件安装没什么难度，按照提示一路点击就行。

### 3 安装 oh-my-posh

官网推荐使用 winget 下载，但是速度很慢，但现在这个包同样可以在 Microsoft Store 搜索下载，个人建议使用 Microsoft Store

```Shell
winget install JanDeDobbeleer.OhMyPosh -s winget
```

### 4 安装 Nerd 字体

[字体可以从我提供的网盘下载, 提取码为 z6xe](https://pan.baidu.com/s/1mLjR0juTLcT6RvxHg7-jbg)

### 5 配置 Windows Terminal

运行 windows Terminal，按 ctrl + ',', 或点击左上角的向下箭头，在弹出层中选择打开 JSON 文件。然后复制下面这个文件中所有的内容覆盖粘贴进去即可。

[terminal_config.json](./terminal_config.json)

注意：文件中有的地方需要将对应的路径改成你自己的 powershell 所在路径；同时，你还需要将前面的安装包中的字体文件装入到系统中，不然对应的符号会显示乱码。

### 6 配置启动文件

在 PowerShell 中输入

```Shell
notepad $PROFILE
```

然后在打开的文件中填入下面的代码后保存：

```Shell
oh-my-posh init pwsh --config "$env:POSH_THEMES_PATH\capr4n.omp.json" | Invoke-Expression
```

保存完成后输入下面的命令来让配置生效

```Shell
.$PROFILE
```

如果你对上面的主题觉得不满意，也可以在 PowerShell 中输入：

```Shell
Get - PoshThemes;
```

会跳出来一大堆各种各样的主题，你只要选择一个喜欢的，然后把上一步中 profile 中的主题链接换一下就可以了。

### 7 将新安装的 PowerShell 配置到 VSCode

#### .1 打开 VSCode 配置文件

在 VSCode 中，按下 Ctrl + ,键打开设置。在搜索框中输入 “terminal”，然后选择 “在 settings.json 中编辑” 选项。

#### .2 配置默认终端

在 settings.json 文件中，找到 “terminal.integrated.defaultProfile.windows” 配置项。如果没有该选项，请手动添加以下代码：

```Shell
"terminal.integrated.defaultProfile.windows": "PowerShell 7"
```

#### .3 指定 PowerShell 路径

在 settings.json 文件中，找到 “terminal.integrated.profiles.windows” 配置项。如果没有该选项，请手动添加以下代码：

```Shell
"terminal.integrated.profiles.windows": {
  "PowerShell 7": {
    "path": "D:\\powershell\\7\\pwsh.exe" # 这里改成你自己的 PowerShell 安装路径
  }
}
```

一定要确保将路径替换为你系统中 PowerShell 7 的实际安装路径。如果你不确定安装路径，可以在安装过程中或安装完成后在文件资源管理器中进行查找。

#### .4 验证配置是否成功

完成上面的三步后，你应该已经成功在 VSCode 中配置了 PowerShell 7。

要验证配置是否成功，请打开一个终端窗口（按下 Ctrl + Shift + `键）并尝试运行一些 PowerShell 命令。如果一切正常，你应该能够看到 PowerShell 7 的命令提示符并能够运行脚本。

注意：如果您在配置过程中遇到任何问题，请确保检查您的 VSCode 和 PowerShell 7 版本是否兼容，并查看 VSCode 和 PowerShell 的官方文档以获取更多帮助。

### Windows 控制台下几个常用命令

```Shell
mkdir <文件夹名称>             # 创建文件夹
rmdir <文件夹名称>             # 删除文件夹
rmdir <文件夹名称> -Force      # 如果文件夹中有隐藏文件删除时会报错，所以需要加上-Force命令
netstat -aon|findstr <端口号> # 查看指定端口占用
tasklist | findstr <进程ID>   # 检查进程ID对应的程序名称
taskkill /f /t /im <进程名称>  # 结束指定程序进程
```
