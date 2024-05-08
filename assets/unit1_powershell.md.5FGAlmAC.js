import{_ as s,c as i,o as a,a2 as h}from"./chunks/framework.DoPyCSkJ.js";const y=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"unit1/powershell.md","filePath":"unit1/powershell.md","lastUpdated":1715123731000}'),l={name:"unit1/powershell.md"},n=h(`<blockquote><p>平安蜀黍的前端教程 &gt; 备选知识点 &gt; 安装 Terminal 与 PowerShell</p></blockquote><h3 id="_1-安装-windows-terminal" tabindex="-1">1.安装 Windows Terminal <a class="header-anchor" href="#_1-安装-windows-terminal" aria-label="Permalink to &quot;1.安装 Windows Terminal&quot;">​</a></h3><p>这个非常简单，直接在 Microsoft Store 搜索下载就可以了</p><h3 id="_2-安装-powershell-core" tabindex="-1">2.安装 Powershell Core <a class="header-anchor" href="#_2-安装-powershell-core" aria-label="Permalink to &quot;2.安装 Powershell Core&quot;">​</a></h3><p>这个 Powershell Core 与系统自带的 Powershell 是完全不同的两个东西，除了功能相似和名字相同，两者内在已经天差地别。自带的 Powershell 错误提示冗长，颜值低，速度慢，总之就是特别不值得去用。</p><p>Powershell Core 下载地址：<a href="https://github.com/PowerShell/PowerShell/tags" target="_blank" rel="noreferrer">https://github.com/PowerShell/PowerShell/tags</a></p><p>软件安装没什么难度，按照提示一路点击就行。</p><h3 id="_3-安装-powershell-相关插件" tabindex="-1">3.安装 Powershell 相关插件 <a class="header-anchor" href="#_3-安装-powershell-相关插件" aria-label="Permalink to &quot;3.安装 Powershell 相关插件&quot;">​</a></h3><p>打开我们刚刚安装的 powershell，逐行输入以下命令 (可能你们在执行下面的命令会出现一些意外的报错，那么，就自己百度去解决吧)</p><div class="language-javascript vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">javascript</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"># </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">1.</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 安装 PSReadline 包，该插件可以让命令行变得好用，类似 zsh</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">Install</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">Module </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">Name PSReadLine </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">AllowPrerelease </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">Force</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"># </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">2.</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 安装 posh</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">git 包，让你的 git 更好用</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">Install</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">Module posh</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">git </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">Scope CurrentUser</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"># </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">3.</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 安装 oh</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">my</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">posh 包，让你的命令行更酷炫、优雅</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">Install</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">Module oh</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">my</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">posh </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">Scope CurrentUser</span></span></code></pre></div><p>后两个包的来源不受系统信任，不用管它，如果让你选择是否信任，直接输入 Y 即可。</p><h3 id="_4-配置-windows-terminal" tabindex="-1">4.配置 Windows Terminal <a class="header-anchor" href="#_4-配置-windows-terminal" aria-label="Permalink to &quot;4.配置 Windows Terminal&quot;">​</a></h3><p>运行 windows Terminal，按 ctrl + &#39;,&#39;, 或点击左上角的向下箭头，在弹出层中选择打开 JSON 文件。然后复制下面这个文件中所有的内容覆盖粘贴进去即可。</p><p><a href="../assets/configs/terminal_config.json">terminal_config.json</a></p><p>注意：在文件的 37、42、44 行，需要将对应的路径改成你自己的 powershell 所在路径；同时，你还需要将前面的安装包中的字体文件装入到系统中，不然对应的符号会显示乱码。</p><h3 id="_5-添加-powershell-启动参数" tabindex="-1">5.添加 Powershell 启动参数 <a class="header-anchor" href="#_5-添加-powershell-启动参数" aria-label="Permalink to &quot;5.添加 Powershell 启动参数&quot;">​</a></h3><p>在你的 powershell 中输入</p><div class="language-javascript vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">javascript</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">notepad.exe $Profile</span></span></code></pre></div><p>在弹出的编辑器中粘贴下面这些代码</p><div class="language-javascript vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">javascript</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">Import</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">Module posh</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">git</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">Import</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">Module oh</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">my</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">posh</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">Set</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">PoshPrompt aliens</span></span></code></pre></div><p>powershell 与 window terminal 配置完成，现在你的控制台可以展示更多内容了，而且支持各种高亮。</p><h3 id="windows-控制台下几个常用命令" tabindex="-1">Windows 控制台下几个常用命令 <a class="header-anchor" href="#windows-控制台下几个常用命令" aria-label="Permalink to &quot;Windows 控制台下几个常用命令&quot;">​</a></h3><div class="language-javascript vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">javascript</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">mkdir </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">文件夹名称</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">             // 创建文件夹</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">rmdir </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">文件夹名称</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">             // 删除文件夹</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">rmdir </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">文件夹名称</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> -</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">Force      </span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 如果文件夹中有隐藏文件删除时会报错，所以需要加上-Force命令</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">netstat </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">aon</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">|</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">findstr </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">端口号</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> // 查看指定端口占用</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">tasklist </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">|</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> findstr </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">进程ID</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">   // 检查进程ID对应的程序名称</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">taskkill </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">/</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">f </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">/</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">t </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">/</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">im </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">进程名称</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">  // 结束指定程序进程</span></span></code></pre></div>`,23),t=[n];function e(p,k,r,E,d,o){return a(),i("div",null,t)}const c=s(l,[["render",e]]);export{y as __pageData,c as default};
