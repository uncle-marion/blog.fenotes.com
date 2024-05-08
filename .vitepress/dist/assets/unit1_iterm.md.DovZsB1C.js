import{_ as t,c as s,o as a,a2 as e}from"./chunks/framework.DoPyCSkJ.js";const i="/blog.fenotes.com/assets/iterm_01.CuSX9bcB.png",l="/blog.fenotes.com/assets/iterm_11.CQ-2Vz3J.png",n="/blog.fenotes.com/assets/iterm_02.BJUatw4l.png",r="/blog.fenotes.com/assets/iterm_03.DRFPQ3SD.png",p="/blog.fenotes.com/assets/iterm_04.BDsyL2k8.png",h="/blog.fenotes.com/assets/iterm_05.C2a2By6y.png",o="/blog.fenotes.com/assets/iterm_06.Cih3ljNP.png",d="/blog.fenotes.com/assets/iterm_07.mG6fVHvG.png",c="/blog.fenotes.com/assets/iterm_08.CjrefbVP.png",g="/blog.fenotes.com/assets/iterm_10.B35k6qWk.png",k="/blog.fenotes.com/assets/iterm_09.DpSDe9pl.png",z=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"unit1/iterm.md","filePath":"unit1/iterm.md","lastUpdated":1660123365000}'),m={name:"unit1/iterm.md"},u=e('<blockquote><p>平安蜀黍的前端教程 &gt; 备选知识点 &gt; 安装 iterm 2</p></blockquote><p>之前一直使用 Mac OS 自带的终端，用起来虽然有些不太方便，但总体来说还是可以接受的。后来在 b 站学习的时候，看到同行们用的都不是终端，查了下是 iTerm2，发现真的很强大，也非常的好用，于是上网搜索了主题配置什么的，踩了些坑，在这里记录下来，方便后面再装的时候又需要去搜索。</p><h4 id="安装-iterm2" tabindex="-1">安装 iTerm2 <a class="header-anchor" href="#安装-iterm2" aria-label="Permalink to &quot;安装 iTerm2&quot;">​</a></h4><p>应用下载地址：<a href="https://www.iterm2.com/downloads.html" target="_blank" rel="noreferrer">https://www.iterm2.com/downloads.html</a></p><p>下载的是压缩文件，解压后是执行程序文件，你可以直接双击，或者直接将它拖到 Applications 目录下。</p><p>也可以直接使用 Homebrew 进行安装：</p><div class="language-javascript vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">javascript</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">$ brew cask install iterm2</span></span></code></pre></div><h4 id="配置-iterm2-主题" tabindex="-1">配置 iTerm2 主题 <a class="header-anchor" href="#配置-iterm2-主题" aria-label="Permalink to &quot;配置 iTerm2 主题&quot;">​</a></h4><p>iTerm2 最常用的主题是 Solarized Dark theme，下载地址：<a href="http://ethanschoonover.com/solarized" target="_blank" rel="noreferrer">http://ethanschoonover.com/solarized</a></p><p>下载的是压缩文件，你先解压一下，然后打开 iTerm2，按 Command + ,键，打开 Preferences 配置界面，然后 Profiles -&gt; Colors -&gt; Color Presets -&gt; Import，选择刚才解压的 solarized-&gt;iterm2-colors-solarized-&gt;Solarized Dark.itermcolors 文件，导入成功，最后选择 Solarized Dark 主题，就可以了。</p><img src="'+i+'"><h4 id="配置-oh-my-zsh" tabindex="-1">配置 Oh My Zsh <a class="header-anchor" href="#配置-oh-my-zsh" aria-label="Permalink to &quot;配置 Oh My Zsh&quot;">​</a></h4><p>Oh My Zsh 是对主题的进一步扩展，地址：<a href="https://github.com/robbyrussell/oh-my-zsh" target="_blank" rel="noreferrer">https://github.com/robbyrussell/oh-my-zsh</a></p><h5 id="一键安装" tabindex="-1">一键安装： <a class="header-anchor" href="#一键安装" aria-label="Permalink to &quot;一键安装：&quot;">​</a></h5><div class="language-javascript vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">javascript</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">$ sh </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">c </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;$(curl -fsSL https://raw.github.com/robbyrussell/oh-my-zsh/master/tools/install.sh)&quot;</span></span></code></pre></div><p>安装好之后，需要把 Zsh 设置为当前用户的默认 Shell（这样新建标签的时候才会使用 Zsh）：</p><div class="language-javascript vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">javascript</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">$ chsh </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">s </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">/</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">bin</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">/</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">zsh</span></span></code></pre></div><p>然后，我们编辑 vim ~/.zshrc 文件，将主题配置修改为</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span>ZSH_THEME=&quot;agnoster&quot;。</span></span></code></pre></div><img src="'+l+'"><p>agnoster 是比较常用的 zsh 主题之一，当然你可以挑选你喜欢的主题，zsh 主题列表：<a href="https://github.com/robbyrussell/oh-my-zsh/wiki/themes" target="_blank" rel="noreferrer">https://github.com/robbyrussell/oh-my-zsh/wiki/themes</a></p><p>效果如下（配置了声明高亮）：</p><img src="'+n+'"><h4 id="配置-meslo-字体" tabindex="-1">配置 Meslo 字体 <a class="header-anchor" href="#配置-meslo-字体" aria-label="Permalink to &quot;配置 Meslo 字体&quot;">​</a></h4><p>使用上面的主题，需要 Meslo 字体支持，要不然会出现乱码的情况，字体下载地址：Meslo LG M Regular for Powerline.ttf。下载好之后，直接在 Mac OS 中安装即可。然后打开 iTerm2，按 Command + ,键，打开 Preferences 配置界面，然后 Profiles -&gt; Text -&gt; Font -&gt; Chanage Font，选择 Meslo LG M Regular for Powerline 字体。</p><img src="'+r+'"><p>当然，如果你觉得默认的 12px 字体大小不合适，可以自己进行修改。</p><p>另外，VS Code 的终端字体，也需要进行配置，打开 VS Code，按 Command + ,键，打开用户配置，搜索 fontFamily，然后将右边的配置增加</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span>&quot;terminal.integrated.fontFamily&quot;: &quot;Meslo LG M for Powerline&quot;</span></span></code></pre></div><img src="'+p+'"><h4 id="声明高亮" tabindex="-1">声明高亮 <a class="header-anchor" href="#声明高亮" aria-label="Permalink to &quot;声明高亮&quot;">​</a></h4><p>效果就是上面截图的那样，特殊命令和错误命令，会有高亮显示。 使用 Homebrew 安装：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span>$ brew install zsh-syntax-highlighting</span></span></code></pre></div><p>安装成功之后，编辑 vim ~/.zshrc 文件，在最后一行增加下面配置：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span>source /usr/local/share/zsh-syntax-highlighting/zsh-syntax-highlighting.zsh</span></span></code></pre></div><img src="'+h+'"><h4 id="自动建议填充" tabindex="-1">自动建议填充 <a class="header-anchor" href="#自动建议填充" aria-label="Permalink to &quot;自动建议填充&quot;">​</a></h4><p>这个功能是非常实用的，可以方便我们快速的敲命令。 配置步骤，先克隆 zsh-autosuggestions 项目，到指定目录：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span>$ git clone https://github.com/zsh-users/zsh-autosuggestions ~/.oh-my-zsh/custom/plugins/zsh-autosuggestions</span></span></code></pre></div><p>然后编辑 vim ~/.zshrc 文件，找到 plugins 配置，增加 zsh-autosuggestions 插件。</p><img src="'+o+'"><p>注：上面声明高亮，如果配置不生效的话，在 plugins 配置，再增加 zsh-syntax-highlighting 插件试试。 有时候因为自动填充的颜色和背景颜色很相似，以至于自动填充没有效果，我们可以手动更改下自动填充的颜色配置，我修改的颜色值为：586e75，</p><img src="'+d+'"><h4 id="左右键跳转" tabindex="-1">左右键跳转 <a class="header-anchor" href="#左右键跳转" aria-label="Permalink to &quot;左右键跳转&quot;">​</a></h4><p>主要是按住 option + → or ← 键，在命令的开始和结尾跳转切换，原本是不生效的，需要手动开启下。 打开 iTerm2，按 Command + ,键，打开 Preferences 配置界面，然后 Profiles → Keys → Load Preset... → Natural Text Editing，就可以了。</p><h4 id="iterm2-快速隐藏和显示" tabindex="-1">iTerm2 快速隐藏和显示 <a class="header-anchor" href="#iterm2-快速隐藏和显示" aria-label="Permalink to &quot;iTerm2 快速隐藏和显示&quot;">​</a></h4><p>这个功能也非常使用，就是通过快捷键，可以快速的隐藏和打开 iTerm2，示例配置（Commond + .）</p><img src="'+c+'"><h4 id="iterm2-隐藏用户名和主机名" tabindex="-1">iTerm2 隐藏用户名和主机名 <a class="header-anchor" href="#iterm2-隐藏用户名和主机名" aria-label="Permalink to &quot;iTerm2 隐藏用户名和主机名&quot;">​</a></h4><p>有时候我们的用户名和主机名太长，比如我的 xishuai@xishuaideMacBook-Pro，终端显示的时候会很不好看（上面图片中可以看到），我们可以手动去除。 编辑 vim ~/.zshrc 文件，增加 DEFAULT_USER=&quot;xishuai&quot;配置，示例： <img src="'+g+'"></p><p>我们可以通过 whoami 命令，查看当前用户，效果（另外分屏的效果）：</p><img src="'+k+`"><h4 id="iterm2-配置代理" tabindex="-1">iTerm2 配置代理 <a class="header-anchor" href="#iterm2-配置代理" aria-label="Permalink to &quot;iTerm2 配置代理&quot;">​</a></h4><pre><code>编辑~ vim ~/.zshrc，增加下面配置（使用的 shadowsocks）：
</code></pre><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span># proxy list</span></span>
<span class="line"><span></span></span>
<span class="line"><span>alias proxy=&#39;export all_proxy=socks5://127.0.0.1:1086&#39;</span></span>
<span class="line"><span>alias unproxy=&#39;unset all_proxy&#39;</span></span></code></pre></div><p>iTerm2 需要新建标签页，才有效果：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span>$ proxy</span></span>
<span class="line"><span>$ curl ip.cn</span></span>
<span class="line"><span># 当前 IP：185.225.14.5 来自：美国</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span>$ unproxy</span></span>
<span class="line"><span>$ curl ip.cn</span></span>
<span class="line"><span># 当前 IP：115.236.186.130 来自：浙江省杭州市 电信</span></span></code></pre></div><p>我们可以测试下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span>$ curl https://packages.cloud.google.com/yum/repos/kubernetes-el7-x86_64</span></span></code></pre></div><div class="language-html vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">html</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">html</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  &lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">head</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    &lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">title</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;Directory listing for /yum/repos/kubernetes-el7-x86_64/&lt;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">title</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  &lt;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">head</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  &lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">body</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    &lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">h2</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;Index of /yum/repos/kubernetes-el7-x86_64/&lt;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">h2</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    &lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">p</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;&lt;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">p</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    &lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">a</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> href</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;/yum/repos/kubernetes-el7-x86_64/repodata&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;repodata&lt;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">a</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;&lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">br</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> /&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  &lt;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">body</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">html</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span></code></pre></div><h4 id="iterm2-常用快捷键" tabindex="-1">iTerm2 常用快捷键 <a class="header-anchor" href="#iterm2-常用快捷键" aria-label="Permalink to &quot;iTerm2 常用快捷键&quot;">​</a></h4><table><thead><tr><th style="text-align:left;">快捷键</th><th style="text-align:left;">功能</th></tr></thead><tbody><tr><td style="text-align:left;">command + t</td><td style="text-align:left;">新建标签</td></tr><tr><td style="text-align:left;">command + w</td><td style="text-align:left;">关闭标签</td></tr><tr><td style="text-align:left;">command + 数字</td><td style="text-align:left;"></td></tr><tr><td style="text-align:left;">command + 左右方向键</td><td style="text-align:left;">切换标签</td></tr><tr><td style="text-align:left;">command + enter</td><td style="text-align:left;">切换全屏</td></tr><tr><td style="text-align:left;">command + f</td><td style="text-align:left;">查找</td></tr><tr><td style="text-align:left;">command + d</td><td style="text-align:left;">垂直分屏</td></tr><tr><td style="text-align:left;">command + shift+ d</td><td style="text-align:left;">水平分屏</td></tr><tr><td style="text-align:left;">command + option</td><td style="text-align:left;">+ 方向键 切换屏幕</td></tr><tr><td style="text-align:left;">command + [ 或 command + ]</td><td style="text-align:left;">代码缩进</td></tr><tr><td style="text-align:left;">command + ;</td><td style="text-align:left;">查看历史命令</td></tr><tr><td style="text-align:left;">command + shift+ h</td><td style="text-align:left;">查看剪贴板历史</td></tr><tr><td style="text-align:left;">ctrl + u</td><td style="text-align:left;">清除当前行</td></tr><tr><td style="text-align:left;">ctrl + l</td><td style="text-align:left;">清屏</td></tr><tr><td style="text-align:left;">ctrl + a</td><td style="text-align:left;">到行首</td></tr><tr><td style="text-align:left;">ctrl + e</td><td style="text-align:left;">到行尾</td></tr><tr><td style="text-align:left;">ctrl + f/b</td><td style="text-align:left;">前进后退</td></tr><tr><td style="text-align:left;">ctrl + p</td><td style="text-align:left;">上一条命令</td></tr><tr><td style="text-align:left;">ctrl + r</td><td style="text-align:left;">搜索命令历史</td></tr></tbody></table><h3 id="参考资料" tabindex="-1">参考资料： <a class="header-anchor" href="#参考资料" aria-label="Permalink to &quot;参考资料：&quot;">​</a></h3><p><a href="https://gist.github.com/kevin-smets/8568070" target="_blank" rel="noreferrer">iTerm2 + Oh My Zsh + Solarized color scheme + Meslo powerline font + [Powerlevel9k] - (macOS)</a>（推荐）</p><p><a href="https://www.jianshu.com/p/0ff3269bc261" target="_blank" rel="noreferrer">iTerm2 + oh my zsh + solarized + Meslo powerline font (OS X / macOS)</a></p><p><a href="http://zhuxin.tech/2017/09/21/zsh%E9%85%8D%E7%BD%AE/" target="_blank" rel="noreferrer">Mac 下终端配置（item2 + oh-my-zsh + solarized 配色方案）</a></p><p><a href="https://www.zybuluo.com/Sweetfish/note/636550" target="_blank" rel="noreferrer">MAC 下 iTerm 主题配置</a></p><p><a href="https://cnbin.github.io/blog/2015/06/20/iterm2-kuai-jie-jian-da-quan/" target="_blank" rel="noreferrer">iTerm2 快捷键大全</a></p>`,69),y=[u];function E(b,f,v,x,_,C){return a(),s("div",null,y)}const P=t(m,[["render",E]]);export{z as __pageData,P as default};
