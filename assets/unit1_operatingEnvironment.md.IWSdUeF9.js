import{_ as s,c as t,o as a,a2 as i}from"./chunks/framework.DoPyCSkJ.js";const e="/blog.fenotes.com/assets/nvm_list.DcToor8x.png",y=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"unit1/operatingEnvironment.md","filePath":"unit1/operatingEnvironment.md","lastUpdated":1715123731000}'),n={name:"unit1/operatingEnvironment.md"},l=i(`<blockquote><p>平安蜀黍的前端教程 &gt; 第一单元 开发环境与工具封装 &gt; 项目的基本运行环境</p></blockquote><h2 id="工欲善其事-必先利其器。" tabindex="-1">工欲善其事，必先利其器。 <a class="header-anchor" href="#工欲善其事-必先利其器。" aria-label="Permalink to &quot;工欲善其事，必先利其器。&quot;">​</a></h2><p>一个好的开发环境，可以让我们更容易对代码进行编辑或者是查找问题，所以，在开始撸码之前，我们需要先配置好工作环境。本节课内容是为了更好的进行日常开发工作，避免在我们的后续开发过程中会遇到一些问题。所以在开始一切操作之前，需要大家记住一个原则：</p><p><strong>工作路径中的目录名应该都是由英文单词构成而且符合项目语义！</strong></p><p>然后，如果你是 Windows 用户，<strong>请在 c 盘或 d 盘根路径下建立你的工作目录，并将其命名为 Example 或 WorkSpace；</strong></p><p>如果你是 OSX 用户，<strong>可以在桌面直接建立一个工作目录，并将其命名为 Example 或 Workspace。</strong></p><p>固定且统一的目录名称可以让我们在需要浏览文件目录时尽快地找到，纯英文目录名可以避免我们在开发的过程中遇上的一些因为路径名而导致的奇怪且棘手的问题。不要花时间去学习解决这种没有普适性的问题，人的精力是有限的，没必要浪费在这些无聊的地方。</p><h2 id="一、代码编写工具-vscode" tabindex="-1">一、代码编写工具 VSCode <a class="header-anchor" href="#一、代码编写工具-vscode" aria-label="Permalink to &quot;一、代码编写工具 VSCode&quot;">​</a></h2><p>VSCode，全称 Visual Studio Code，基于 Electron 与 JavaScript 开发的代码编辑器，目前是前端使用最多的一款代码编辑器：</p><p><a href="https://code.visualstudio.com/Download" target="_blank" rel="noreferrer">下载地址：https://code.visualstudio.com/Download</a></p><p>注意：Windows 用户一定要使用管理员权限开启 VSCode，因为在 Windows 下因为很多操作都需要管理员权限，所以将 VSCode 设置为管理员权限启动可以<strong>避免很多因为权限不足</strong>而造成的问题。</p><p>另外，VSCode 下的终端也是需要权限的。一般来说，VSCode 会将你系统中所有的命令行工具读进来，这里我建议你们使用 PowerShell，<a href="https://zhuanlan.zhihu.com/p/366637644" target="_blank" rel="noreferrer">PowerShell</a> 是微软开发的一款用于编辑复杂脚本的命令行工具。如果嫌麻烦，系统自带的 1.x 版本基本能用，但为了更方便读写代码及分辨当前环境，建议大家自行参考我在下面给出的 PowerShell 7 的安装和配置方式，在课后自己进行安装和配置。</p><h3 id="通过修改-powershell-的执行策略来获取管理员权限" tabindex="-1">通过修改 PowerShell 的执行策略来获取管理员权限 <a class="header-anchor" href="#通过修改-powershell-的执行策略来获取管理员权限" aria-label="Permalink to &quot;通过修改 PowerShell 的执行策略来获取管理员权限&quot;">​</a></h3><table><thead><tr><th style="text-align:left;">描述</th><th style="text-align:left;">功能</th></tr></thead><tbody><tr><td style="text-align:left;">Restricted</td><td style="text-align:left;">默认设置，不允许任何脚本运行</td></tr><tr><td style="text-align:left;">AllSigned</td><td style="text-align:left;">只能运行经过数字证书签名的脚本</td></tr><tr><td style="text-align:left;">RemoteSigned</td><td style="text-align:left;">运行本地脚本不需要数字签名，但是运行从网络上下载的脚本必须要有数字签名</td></tr><tr><td style="text-align:left;">Unrestricted</td><td style="text-align:left;">允许所有的脚本运行, 但是在运行前会提示是否进行操作</td></tr><tr><td style="text-align:left;">Bypass</td><td style="text-align:left;">允许所有的脚本运行, 没有任何的提示和警告</td></tr></tbody></table><h4 id="执行命令" tabindex="-1">执行命令 <a class="header-anchor" href="#执行命令" aria-label="Permalink to &quot;执行命令&quot;">​</a></h4><div class="language-Shell vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">Shell</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 获取当前执行策略</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">Get-ExecutionPolicy</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 修改当前执行策略(PowerShell 必须是管理员权限，否则修改失败)</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">Set-ExecutionPolicy</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> unrestricted</span></span></code></pre></div><h3 id="配置一个养眼的代码环境" tabindex="-1">配置一个养眼的代码环境 <a class="header-anchor" href="#配置一个养眼的代码环境" aria-label="Permalink to &quot;配置一个养眼的代码环境&quot;">​</a></h3><p>这块不强制安装，下课后有时间可以自己安装，如果遇到问题可以百度，百度解决不了的我们自习课再研究:</p><blockquote><p>Windows 用户看这里：<a href="./powershell.html">Windows 下安装 PownShell 7 与 Oh-My-Posh</a></p></blockquote><blockquote><p>OSX 用户看这里：<a href="./iterm.html">mac 系统下安装 iterm</a></p></blockquote><p>注：因为已经有 4~5 年没有使用 MacBook 了，所以这篇关于 Iterm 安装文档是我多年以前记录的文档，如果你们在安装途中出现问题，可以自行百度解决，实在无法解决的，我们再一起研究。</p><h3 id="vscode-常用插件" tabindex="-1">VSCode 常用插件 <a class="header-anchor" href="#vscode-常用插件" aria-label="Permalink to &quot;VSCode 常用插件&quot;">​</a></h3><p>VSCode 只提供了一个基础的代码编辑环境，为了更方便撸码，我们还需要安装一些插件：<a href="./vscode.html">VSCode 常用插件与使用</a></p><h2 id="二、代码运行环境-node" tabindex="-1">二、代码运行环境 Node <a class="header-anchor" href="#二、代码运行环境-node" aria-label="Permalink to &quot;二、代码运行环境 Node&quot;">​</a></h2><p>Node.js 是一个开源和跨平台的 JavaScript 运行时环境，NodeJs 可以在浏览器之外运行 V8 JavaScript 引擎（Google Chrome 的内核）。简单来说，就是 NodeJS 可以让我们用 JavaScript 来搭建一个可独立运行的项目。目前来看，我们前端在开发时的代码运行环境暂时以 NodeJs 为主，如果需要使用其它后端语言则需要安装更庞大的 Ide 与服务器体系，比如 java + Idea 或 php + eclipse。</p><p>注：IDE：Integrated Development Environment 集成开发环境，比如 IDEA，当下最流行的 java 开发环境；eclipse，老牌的集成开发环境。</p><p>因为 NodeJS 的相关知识量比较庞大，为了节约时间，我在这里就不详细讲解了，下面给出了 NodeJs 官方文档的地址，希望大家在有时间的时候都去看一下，这对于我们未来的职业规划和发展来说，是属于非常重要的一部分。进，可以成为全栈；退，也能增加在日常工作中对后端同事代码的理解能力。</p><p><a href="http://nodejs.cn/learn" target="_blank" rel="noreferrer">NodeJs 入门教程</a></p><h3 id="node-版本管理工具-nvm-的安装与使用" tabindex="-1">Node 版本管理工具 nvm 的安装与使用 <a class="header-anchor" href="#node-版本管理工具-nvm-的安装与使用" aria-label="Permalink to &quot;Node 版本管理工具 nvm 的安装与使用&quot;">​</a></h3><p><strong>记住，公司配给你的电脑到手以后第一件事绝不是使用 NodeJS 官网下载的安装包来安装 Node!!! 一定要先安装 nvm，然后使用 nvm 来安装 Node!!!</strong></p><p>nvm 全名 Node.js Version Manager，是用来管理 NodeJS 版本的管理工具，我们之中有很多人，都是直接上 NodeJS 官网上下载 Node 安装包进行安装。但是在实际业务中这样可能会遇到些问题，比如：</p><p>在正常工作中我们经常需要维护几年以前的老项目，它们可能还在正常运行，也没什么大毛病，但当我们需要运行这个项目的时候发现它无法<strong>兼容</strong>于现有的 Node 版本，运行起来各种报错。所以，这时候我们就需要一个工具，可以对开发环境的 <strong>Node 版本</strong>作一个快速的切换。<strong>nvm</strong> 就是用于<strong>管理 NodeJS 版本</strong>的管理工具。</p><h4 id="osx-用户看这里-https-github-com-nvm-sh-nvm-tab-readme-ov-file-install-update-script" tabindex="-1">OSX 用户看这里：<a href="https://github.com/nvm-sh/nvm?tab=readme-ov-file#install--update-script" target="_blank" rel="noreferrer">https://github.com/nvm-sh/nvm?tab=readme-ov-file#install--update-script</a> <a class="header-anchor" href="#osx-用户看这里-https-github-com-nvm-sh-nvm-tab-readme-ov-file-install-update-script" aria-label="Permalink to &quot;OSX 用户看这里：https://github.com/nvm-sh/nvm?tab=readme-ov-file#install--update-script&quot;">​</a></h4><p>苹果用户安装 nvm 非常简单，找到下面这行代码复制到终端并执行就行了</p><p>如果安装中出现问题，暂时照着<a href="./homebrew.html">这篇文档</a>走，后续我再整理安装文档。</p><div class="language-Shell vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">Shell</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">curl</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -o-</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> |</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> bash</span></span></code></pre></div><h4 id="windows-用户到这里-https-github-com-coreybutler-nvm-windows-releases" tabindex="-1">Windows 用户到这里：<a href="https://github.com/coreybutler/nvm-windows/releases" target="_blank" rel="noreferrer">https://github.com/coreybutler/nvm-windows/releases</a> <a class="header-anchor" href="#windows-用户到这里-https-github-com-coreybutler-nvm-windows-releases" aria-label="Permalink to &quot;Windows 用户到这里：https://github.com/coreybutler/nvm-windows/releases&quot;">​</a></h4><p>找到 nvm-setup.exe，将它下载回来，如果无法访问 github，可以到我的网盘下载一个：<a href="https://pan.baidu.com/s/1mLjR0juTLcT6RvxHg7-jbg" target="_blank" rel="noreferrer">相关应用下载</a></p><p><a href="https://pan.baidu.com/s/1mLjR0juTLcT6RvxHg7-jbg" target="_blank" rel="noreferrer">本教程中相关应用下载：提取码：z6xe</a></p><p>Windows 用户首先需要检查电脑中是否已经有了 NodeJS，如果有需要卸载掉原有的 NodeJS 并重启。未安装过的同学可以跳过下面这一段直接开始安装！</p><blockquote><ol><li>使用系统管理工具卸载 NodeJS</li></ol></blockquote><blockquote><ol start="2"><li>检查 c 盘根目录下是否有残留 Node 相关文件目录</li></ol></blockquote><blockquote><ol start="3"><li>检查系统环境变量中是否残留 Node 相关配置</li></ol></blockquote><blockquote><ol start="4"><li>重启系统</li></ol></blockquote><blockquote><p>附：环境变量的修改方法（win10）：左下角放大镜 =&gt; 输入&quot;编辑账户的环境变量&quot;</p></blockquote><p>一切就绪后，双击下载完成的 nvm 安装文件运行，要注意的是，nvm 默认安装在 c 盘 program files 目录下，但它自己又无法识别带有空格的文件路径，所以，我们需要将 nvm 安装在根目录或指定不包含中文和空格的文件夹下。</p><p>安装完成后，在你的桌面上空白处右键选择 open in window terminal as administrator，打开你的 powershell 界面，如果没有 terminal，<strong>可以使用 cmd 或 vscode 都行，检查一下 nvm 的版本号</strong>：</p><div class="language-Shell vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">Shell</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">nvm</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> version</span></span></code></pre></div><p>应该可以看到关于 npm 等软件的版本号，这就证明你的 nvm 安装成功了。</p><h4 id="使用-nvm-安装和切换-node-环境" tabindex="-1">使用 nvm 安装和切换 Node 环境 <a class="header-anchor" href="#使用-nvm-安装和切换-node-环境" aria-label="Permalink to &quot;使用 nvm 安装和切换 Node 环境&quot;">​</a></h4><p>nvm 与 npm 或 yarn 一样，需要配置指定的库，如果没有配置，则可能会出现一些比如 <strong>timeout</strong> 等问题，所以我们需要配置安装路径到 taobao 的<strong>镜像库</strong>。 找到你的 nvm 安装文件夹，打开 settings 文件，在文件最后输入：</p><div class="language-Shell vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">Shell</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">node_mirror:</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> https://npm.taobao.org/mirrors/node/</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">npm_mirror:</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> https://npm.taobao.org/mirrors/npm/</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 上面两行代码的意思是将node的镜像和npm的镜像都指向淘宝，mirror的意思是镜像的意思，在这里指获取应用的仓库</span></span></code></pre></div><p>然后执行 nvm list available 命令查找一下当前可用的 Node 版本。建议安装 LTS 版本。</p><h4 id="查看远程可安装版本" tabindex="-1">查看远程可安装版本 <a class="header-anchor" href="#查看远程可安装版本" aria-label="Permalink to &quot;查看远程可安装版本&quot;">​</a></h4><img src="`+e+`"><div class="language-Shell vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">Shell</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">nvm</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> install</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 14.16.1</span></span></code></pre></div><p>windows 系统同学在安装时需要注意观察控制台输出的内容，Node 与 npm 两个是分开安装的，可能会因为各种原因存在安装失败的提示，如果有任意一个应用安装失败，就必须使用 uninstall 命令卸载当前版本后重新安装。</p><p>安装完成之后，使用 use 命令应用/切换：</p><div class="language-Shell vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">Shell</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">nvm</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> use</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 14.16.1</span></span></code></pre></div><p>然后在你的 PowerShell 或 cmd 中输入：</p><div class="language-Shell vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">Shell</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">node</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> -</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> v</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">npm</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> -</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> v</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span></code></pre></div><p>如果都能正常显示版本号，证明你的 Node 也安装完成了。如果不能正常显示版本号，那么可能是你的 Node 配置未能自动生效，可能就需要进行一些比较麻烦的排错处理。</p><p><strong>排错</strong></p><ol><li>检查.npmrm 文件，是否有内容指向非 Node 安装目录，如果有则删除</li><li>检查环境变量，node 和 npm 的 path 指向是否正确</li><li>检查 settings 文件，path 指向是否正确</li></ol><h4 id="nvm-常用命令" tabindex="-1">nvm 常用命令 <a class="header-anchor" href="#nvm-常用命令" aria-label="Permalink to &quot;nvm 常用命令&quot;">​</a></h4><table><thead><tr><th style="text-align:left;">描述</th><th style="text-align:left;">功能</th></tr></thead><tbody><tr><td style="text-align:left;">nvm list</td><td style="text-align:left;">查看本地已安装的 Node 版本</td></tr><tr><td style="text-align:left;">nvm list available</td><td style="text-align:left;">查看远程可安装的 Node 版本</td></tr><tr><td style="text-align:left;">nvm install 版本号</td><td style="text-align:left;">安装指定版本的 NodeJS</td></tr><tr><td style="text-align:left;">nvm uninstall 版本号</td><td style="text-align:left;">卸载指定版本的 NodeJS</td></tr><tr><td style="text-align:left;">nvm use 版本号</td><td style="text-align:left;">使用指定的 NodeJS 版本为当前 Node 环境</td></tr></tbody></table><div class="language-Shell vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">Shell</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">nvm</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> install</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 16.14.2</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> # 表示安装16.14.2版本的nodejs到你的系统</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">nvm</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> use</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 16.14.2</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> # 表示我们切换node环境到16.14.2版本</span></span></code></pre></div><p>注意，如非必要，请尽量安装的 LTS 版本，LTS 表示经过比较多的测试确认没明显 BUG，可以推荐给大多数用户使用；而 CURRENT 版本表示仅小范围测试通过，可能还会存在一些问题！</p><h2 id="三、管理-npm-镜像库工具-nrm-的安装与使用" tabindex="-1">三、管理 npm 镜像库工具 nrm 的安装与使用 <a class="header-anchor" href="#三、管理-npm-镜像库工具-nrm-的安装与使用" aria-label="Permalink to &quot;三、管理 npm 镜像库工具 nrm 的安装与使用&quot;">​</a></h2><p>nrm 是一个 npm 镜像管理工具，使用它可以快速切换 npm 镜像。当然，不使用 nrm 也可以切换镜像库地址：</p><ul><li>检查你的 npm 的镜像地址</li></ul><div class="language-Shell vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">Shell</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">npm</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> config</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> get</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> registry</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 这行代码的意思是从 npm 的 config（配置文件）中获取 registry 属性所对应的值</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 如果显示 http://registry.npmjs.org/ 这是npm默认的安装包存储地址</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 执行 npm config set registry https://registry.npm.taobao.org 即可将镜像库地址切换到 taobao</span></span></code></pre></div><p>因为国内的网络环境访问境外资源时网速真的是很让人难受。所以，我们需要一个工具能像 nvm 那样，可以方便地对 npm 的镜像库进行管理。比如 nrm：首先全局安装一个 nrm</p><div class="language-Shell vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">Shell</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 全局安装nrm</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">npm</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> i</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -g</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> nrm</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 如果是mac系统可能需要使用sudo来启动超级管理员身份</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">sudo</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> npm</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> i</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -g</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> nrm</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 使用sudo命令时需要输入密码，要注意的是，osx的终端下输入密码是不可见且不可修改的，所以一定要保证你的输入法是英文</span></span></code></pre></div><p><strong>常用 nrm 指令</strong></p><table><thead><tr><th>指令</th><th>功能</th></tr></thead><tbody><tr><td>nrm -V</td><td>检查版本号</td></tr><tr><td>nrm ls</td><td>获取代码仓库的镜像</td></tr><tr><td>nrm test</td><td>测试代码仓库的响应时间</td></tr><tr><td>nrm use npm</td><td>切换仓库到 npm</td></tr><tr><td>nrm use taobao</td><td>切换仓库到 taobao</td></tr></tbody></table><p>nrm 相对来说比较好装，install 命令执行完成后就可以使用了，安装完成后我们先看看有哪些镜像库可以使用</p><div class="language-Shell vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">Shell</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 打印当前可用npm镜像列表</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">nrm</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> ls</span></span></code></pre></div><p>然后使用这个命令切换镜像库</p><div class="language-Shell vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">Shell</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 切换npm镜像地址到淘宝</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">nrm</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> use</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> taobao</span></span></code></pre></div><h2 id="四、另一个包管理工具-yarn" tabindex="-1">四、另一个包管理工具 yarn <a class="header-anchor" href="#四、另一个包管理工具-yarn" aria-label="Permalink to &quot;四、另一个包管理工具 yarn&quot;">​</a></h2><p>yarn 是 facebook 发布的想要取代 npm 的一款新的包管理软件，它内部采用了并发式请求，同时会在本地将所有安装过的依赖都缓存起来，所以在安装依赖时要比 npm 快许多。要注意的是，同时使用 npm 和 yarn 可能会引起冲突。yarn 的安装方式：</p><div class="language-Shell vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">Shell</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">npm</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> i</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -g</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> yarn</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># mac用户需要注意，所有往全局安装应用的操作都需要使用sudo命令，后面就不再重复说这个问题了</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">sudo</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> npm</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> i</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -g</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> yarn</span></span></code></pre></div><table><thead><tr><th>指令</th><th>功能</th></tr></thead><tbody><tr><td>yarn -v</td><td>查看 yarn 版本号</td></tr><tr><td>yarn config list</td><td>查看 yarn 所有配置</td></tr><tr><td>yarn config get &lt;配置项名称&gt;</td><td>显示指定配置项</td></tr><tr><td>yarn config set &lt;配置项名称&gt; &lt;对应的值&gt;[-g|--global]</td><td>设置配置项</td></tr><tr><td>yarn config delete &lt;配置项名称&gt;</td><td>删除某配置项</td></tr><tr><td>yarn init</td><td>在当前目录下创建一个 package.json 文件</td></tr><tr><td>yarn install</td><td>安装 package.json 里所有包，并将包及它的所有依赖项保存进 yarn.lock</td></tr><tr><td>yarn install --force</td><td>强制重新下载所有包</td></tr><tr><td>yarn install --production</td><td>只安装 dependencies 里的包</td></tr><tr><td>yarn add &lt;依赖名&gt;[@版本号]</td><td>安装指定版本号的依赖，注意，这种方式会安装当前大版本的最高版本</td></tr><tr><td>yarn add &lt;依赖名&gt;</td><td>安装依赖到项目生产环境(dependencies)</td></tr><tr><td>yarn add &lt;依赖名&gt; -D</td><td>安装依赖到项目开发环境(devDependencies)</td></tr><tr><td>yarn add &lt;依赖名&gt; global</td><td>安装依赖到全局环境</td></tr><tr><td>yarn remove &lt;依赖名&gt;</td><td>卸载依赖</td></tr><tr><td>yarn cache clean</td><td>清除所有项目依赖缓存</td></tr></tbody></table><h3 id="使用-yrm-管理-yarn-镜像库" tabindex="-1">使用 yrm 管理 yarn 镜像库 <a class="header-anchor" href="#使用-yrm-管理-yarn-镜像库" aria-label="Permalink to &quot;使用 yrm 管理 yarn 镜像库&quot;">​</a></h3><p>yrm 的用法与 nrm 完全一致，唯一的区别大概就是名字和管理的对象不同</p><div class="language-Shell vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">Shell</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">yarn</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> add</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> global</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> yrm</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 或者</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">npm</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> i</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -g</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> yrm</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">yrm</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> ls</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">yrm</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> use</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> taobao</span></span></code></pre></div><h2 id="课后问题" tabindex="-1">课后问题 <a class="header-anchor" href="#课后问题" aria-label="Permalink to &quot;课后问题&quot;">​</a></h2><ul><li>nvm 管理工具在安装时需要注意哪些事项？你在安装中遇到了哪些问题？怎样解决的？</li><li>nvm 有哪些常用命令？请分别描述。</li><li>npm 怎样配置镜像库？</li><li>npm 有哪些常用命令？</li><li>yarn 与 npm 的区别在哪里？为什么 facebook 推荐我们使用 yarn?</li><li>yarn 有哪些常用命令？</li></ul>`,89),p=[l];function h(r,d,o,k,c,g){return a(),t("div",null,p)}const u=s(n,[["render",h]]);export{y as __pageData,u as default};
