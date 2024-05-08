import{_ as s,c as i,o as a,a2 as t}from"./chunks/framework.CJYjXVh_.js";const c=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"unit1/homebrew.md","filePath":"unit1/homebrew.md","lastUpdated":1715123731000}'),h={name:"unit1/homebrew.md"},n=t(`<h3 id="一、安装-homebrew" tabindex="-1">一、安装 homebrew <a class="header-anchor" href="#一、安装-homebrew" aria-label="Permalink to &quot;一、安装 homebrew&quot;">​</a></h3><h5 id="_1-先尝试执行下面的命令" tabindex="-1">1. 先尝试执行下面的命令： <a class="header-anchor" href="#_1-先尝试执行下面的命令" aria-label="Permalink to &quot;1. 先尝试执行下面的命令：&quot;">​</a></h5><div class="language-javascript vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">javascript</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">/</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">bin</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">/</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">zsh </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">c </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;$(curl -fsSL https://gitee.com/cunkai/HomebrewCN/raw/master/Homebrew.sh)&quot;</span></span></code></pre></div><h5 id="如果执行报错-就需要手动安装" tabindex="-1">如果执行报错，就需要手动安装： <a class="header-anchor" href="#如果执行报错-就需要手动安装" aria-label="Permalink to &quot;如果执行报错，就需要手动安装：&quot;">​</a></h5><p>首先，需要确保系统中安装了 bash、git 和 curl，对于 OSX 用户需额外要求安装 Command Line Tools (CLT) for Xcode(电脑中必须安装有 Xcode)。在命令行输入</p><div class="language-javascript vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">javascript</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">xcode</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">select </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">--</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">install</span></span></code></pre></div><p>然后需要在终端执行以下命令：</p><div class="language-javascript vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">javascript</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">export</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> HOMEBREW_INSTALL_FROM_API</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">1</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">export</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> HOMEBREW_API_DOMAIN</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;https://mirrors.tuna.tsinghua.edu.cn/homebrew-bottles/api&quot;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">export</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> HOMEBREW_BOTTLE_DOMAIN</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;https://mirrors.tuna.tsinghua.edu.cn/homebrew-bottles&quot;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">export</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> HOMEBREW_BREW_GIT_REMOTE</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;https://mirrors.tuna.tsinghua.edu.cn/git/homebrew/brew.git&quot;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">export</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> HOMEBREW_CORE_GIT_REMOTE</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;https://mirrors.tuna.tsinghua.edu.cn/git/homebrew/homebrew-core.git&quot;</span></span></code></pre></div><p>全部执行完成后，再运行下面的命令：</p><div class="language-javascript vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">javascript</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">  // 更换homebrew的镜像源为国内</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  git clone </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">--</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">depth</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">1</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> https</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">//mirrors.tuna.tsinghua.edu.cn/git/homebrew/install.git brew-install /bin/bash brew-install/install.sh</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  rm </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">rf brew</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">install</span></span></code></pre></div><h3 id="如果你还没有安装-git" tabindex="-1">如果你还没有安装 git <a class="header-anchor" href="#如果你还没有安装-git" aria-label="Permalink to &quot;如果你还没有安装 git&quot;">​</a></h3><div class="language-javascript vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">javascript</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">/</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">bin</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">/</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">bash </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">c </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;$(curl -fsSL https://cdn.jsdelivr.net/gh/ineo6/homebrew-install/install.sh)&quot;</span></span></code></pre></div><div class="language-javascript vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">javascript</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">Error</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: Can</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;t create update lock in /usr/local/var/homebrew/locks</span><span style="--shiki-light:#B31D28;--shiki-dark:#FDAEB7;--shiki-light-font-style:italic;--shiki-dark-font-style:italic;">!</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">Fix permissions by </span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">running</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: sudo chown </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">R</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> $</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(whoami) </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">/</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">usr</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">/</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">local</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">/var</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">/homebrew</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">Failed </span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">during</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">/</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">usr</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">/</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">local</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">/</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">bin</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">/</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">brew update </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">--</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">force </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">--</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">quiet</span></span></code></pre></div><p>如果遇到上面这种报错，可以在终端输入下面内容并执行</p><div class="language-javascript vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">javascript</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">sudo chown </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">R</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;$USER&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:admin </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">/</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">usr</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">/</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">local</span></span></code></pre></div><h3 id="二、安装-wget" tabindex="-1">二、安装 wget <a class="header-anchor" href="#二、安装-wget" aria-label="Permalink to &quot;二、安装 wget&quot;">​</a></h3><div class="language-javascript vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">javascript</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">brew install wget</span></span></code></pre></div><h3 id="三、安装-yarn" tabindex="-1">三、安装 yarn <a class="header-anchor" href="#三、安装-yarn" aria-label="Permalink to &quot;三、安装 yarn&quot;">​</a></h3><div class="language-javascript vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">javascript</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">brew install yarn</span></span></code></pre></div><h3 id="四、安装-redis" tabindex="-1">四、安装 redis: <a class="header-anchor" href="#四、安装-redis" aria-label="Permalink to &quot;四、安装 redis:&quot;">​</a></h3><p>逐步执行下面的命令</p><div class="language-javascript vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">javascript</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">3.1</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">、</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">/</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">usr</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">/</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">local</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">/</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">bin</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">/</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">wget </span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">http</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">//download.redis.io/releases/redis-4.0.2.tar.gz</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">3.2</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">、tar xzf redis</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">4.0</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.2.tar.gz</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">3.3</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">、cd redis</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">4.0</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">2</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">3.4</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">、make</span></span></code></pre></div><p>配置</p><ol><li><p>在/usr/local 目录下创建三个文件夹，包括 bin，etc，db 三个目录</p></li><li><p>进入/usr/local/etc/文件夹，创建 redis 文件夹，并创建 redis.conf 配置文件</p></li><li><p>配置文件可直接复制笔记中的 redis.conf 文件，保存到桌面后复制到 redis 文件夹中</p></li><li><p>输入 redis-server 后回车，可能需要 sudo</p></li></ol>`,24),l=[n];function e(p,k,r,d,E,o){return a(),i("div",null,l)}const y=s(h,[["render",e]]);export{c as __pageData,y as default};
