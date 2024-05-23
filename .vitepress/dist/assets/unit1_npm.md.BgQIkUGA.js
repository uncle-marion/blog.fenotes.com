import{_ as t,c as d,o as e,a2 as p}from"./chunks/framework.DoPyCSkJ.js";const g=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"unit1/npm.md","filePath":"unit1/npm.md","lastUpdated":1660123365000}'),o={name:"unit1/npm.md"},n=p('<blockquote><p>平安蜀黍的前端教程 &gt; 备选知识点 &gt; 使用 npm 管理项目依赖</p></blockquote><h2 id="npm-部分常用命令" tabindex="-1">npm 部分常用命令 <a class="header-anchor" href="#npm-部分常用命令" aria-label="Permalink to &quot;npm 部分常用命令&quot;">​</a></h2><table><thead><tr><th>指令</th><th>功能</th></tr></thead><tbody><tr><td>npm -v</td><td>查看 npm 版本号</td></tr><tr><td>npm config list</td><td>查看 npm 所有配置</td></tr><tr><td>npm init</td><td>在当前目录下创建一个 package.json 文件</td></tr><tr><td>npm install &lt;依赖名&gt;</td><td>安装依赖，以下都以别名 i 为准</td></tr><tr><td>npm i</td><td>npm install 的别名</td></tr><tr><td>npm list</td><td>查看当前项目的所有依赖版本</td></tr><tr><td>npm list -g</td><td>查看当前运行环境下所有全局依赖的版本</td></tr><tr><td>npm list --depth=0</td><td>查看当前项目的所有顶级依赖版本</td></tr><tr><td>npm list &lt;依赖名&gt;</td><td>查看指定依赖的版本</td></tr><tr><td>npm view &lt;依赖名&gt;</td><td>查找远程镜像库中指定依赖可用的最新版本</td></tr><tr><td>npm view &lt;依赖名&gt; versions</td><td>查找远程镜像库中指定依赖所有的版本</td></tr><tr><td>npm i -S &lt;依赖名&gt;</td><td>安装依赖的最新版本到项目的运行环境中</td></tr><tr><td>npm i -D &lt;依赖名&gt;</td><td>安装依赖的最新版本到项目的开发环境中</td></tr><tr><td>npm i -S &lt;依赖名&gt;@&lt;依赖版本号&gt;</td><td>安装依赖的指定版本到项目中，关于依赖的版本，可以关注后面的更多规则部分</td></tr><tr><td>npm uninstall &lt;依赖名&gt;</td><td>从当前项目依赖中删除指定的依赖包</td></tr><tr><td>npm uninstall &lt;依赖名&gt; -S</td><td>从当前项目依赖中删除指定的依赖包同时从 package 的 dependencies 中删除</td></tr><tr><td>npm uninstall &lt;依赖名&gt; -D</td><td>从当前项目依赖中删除指定的依赖包同时从 package 的 devDependencies 中删除</td></tr></tbody></table><h2 id="package-依赖更新规则" tabindex="-1">package 依赖更新规则 <a class="header-anchor" href="#package-依赖更新规则" aria-label="Permalink to &quot;package 依赖更新规则&quot;">​</a></h2><p>在 package.json 中，我们可以使用 semver 表示法设置要升级到的版本（补丁版本或小版本），例如：</p><p>如果写入的是 〜0.13.0，表示我们只允许更新补丁版本：即 0.13.1 可以，但 0.14.0 不可以。</p><p>如果写入的是 ^0.13.0，表示允许更新补丁版本和小版本：即 0.13.1、0.14.0、依此类推。</p><p>如果写入的是 0.13.0，表示只允许使用当前版本，不允许更新。</p><p><strong>更多规则</strong></p><blockquote><p>^: 允许小版本更新</p></blockquote><blockquote><p>~: 允许补丁包更新。</p></blockquote><blockquote><p>&gt; : 接受高于指定版本的任何版本。</p></blockquote><blockquote><p>&gt;=: 接受等于或高于指定版本的任何版本。</p></blockquote><blockquote><p>&lt;=: 接受等于或低于指定版本的任何版本。</p></blockquote><blockquote><p>&lt;: 接受低于指定版本的任何版本。</p></blockquote><blockquote><p>=: 接受确切的版本。</p></blockquote><blockquote><p>-: 接受一定范围的版本。例如：2.1.0 - 2.6.2。</p></blockquote><blockquote><p>||: 组合集合。例如 &lt;2.1 || 2.6&gt;。</p></blockquote>',18),a=[n];function l(r,c,i,s,m,u){return e(),d("div",null,a)}const b=t(o,[["render",l]]);export{g as __pageData,b as default};