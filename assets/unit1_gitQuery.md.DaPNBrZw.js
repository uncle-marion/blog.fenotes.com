import{_ as l,c,o as s,a2 as e,l as t,a as o}from"./chunks/framework.BHrRGQds.js";const m=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"unit1/gitQuery.md","filePath":"unit1/gitQuery.md","lastUpdated":1660123365000}'),p={name:"unit1/gitQuery.md"},r=e('<blockquote><p>平安蜀黍的前端教程 &gt; 备选知识点 &gt; git 版本管理之常见问题解决</p></blockquote><h3 id="常见的版本管理事件处理" tabindex="-1">常见的版本管理事件处理 <a class="header-anchor" href="#常见的版本管理事件处理" aria-label="Permalink to &quot;常见的版本管理事件处理&quot;">​</a></h3><h4 id="萌新怎样开展第一个任务" tabindex="-1">萌新怎样开展第一个任务 <a class="header-anchor" href="#萌新怎样开展第一个任务" aria-label="Permalink to &quot;萌新怎样开展第一个任务&quot;">​</a></h4><p>你刚进入公司，电脑环境可能刚刚装好一些常用软件，代码什么的都还没有，也许产品或你的 leader 会丢给你一个任务，要你去熟悉一下项目甚至解决某个问题：</p><blockquote><p><strong>step 1</strong>: cd workspace // 进入你的工作目录！很重要，你将来可能会经手上百个项目，一定要有一个工作目录来管理而不是将代码四处乱放</p></blockquote><blockquote><p><strong>step 2:</strong> git clone &lt;项目地址&gt; // 这个项目地址可能是需要你自己去找的，组长会告诉你公司的 gitlab 库的地址，然后你要去找到对应的项目</p></blockquote><blockquote><p><strong>step 3:</strong> cd &lt;项目目录&gt; // clone 完成后，会在当前目录下生成一个新的目录，这个目录与你的项目同名，你需要进入这个项目才能操作</p></blockquote><blockquote><p><strong>step 4:</strong> 将当前项目加入到你的 vscode 中，如果你的项目都在同一个工作目录，你可以将这个工作目录加入到 vscode，这样每次添加项目都会直接在工作目录中展示出来</p></blockquote><blockquote><p><strong>step 5:</strong> 打开 package.json，仔细查阅 dependencies 和 devDependencies 这两项，看看是否有公司内部的依赖，如果有，找你的组长，要一下公司 npm 仓库镜像地址</p></blockquote><blockquote><p><strong>step 6:</strong> 切换你的 npm 镜像地址到公司地址：npm config set registry &lt;你的组长给你的地址&gt; 或 yarn config set registry &lt;你的组长给你的地址&gt;</p></blockquote><blockquote><p><strong>step 7:</strong> yarn 或 npm i // 安装项目依赖</p></blockquote><blockquote><p><strong>step 8:</strong> 安装项目依赖可能需要等待一些时间，那么你可以利用这个时间看看项目中的一些文件</p><ul><li><p>8.1 package.json 中的 scripts 部分，了解项目的运行方式有哪些</p></li><li><p>8.2 检查 router 与 store，了解项目的基本文件构成与相关的状态管理工具</p></li><li><p>8.3 检查项目根目录下的其它文件，很多项目独有的配置都在这里，记一下有好处</p></li><li><p>8.4 浏览 pages 或 components 中的文件，了解其他同事的编程规范和代码性格</p></li></ul></blockquote><blockquote><p><strong>step 9:</strong> git checkout -b &lt;分支名称&gt; &lt;主支名称&gt; 或 git checkout &lt;分支名称&gt; // 基本没有问题后，基于主支新建或切换到你组长给你开的分支开始编辑或修改代码</p></blockquote><blockquote><p><strong>step 10:</strong> git status // 代码修改完成后，执行这个命令检查修改了哪些文件</p></blockquote><blockquote><p><strong>step 11:</strong> git diff // 比较开发区与暂存区的代码差异，确认修改无误，如果有问题先解决问题</p></blockquote><blockquote><p><strong>step 12:</strong> git add . 或 git add &lt;文件路径/文件名&gt; // 确认修改无误后，将开发区所有修改或指定修改添加到暂存库</p></blockquote><blockquote><p><strong>step 13:</strong> git pull // 将远端的代码拉回到开发区，解决可能存在的冲突，解决后重新提交代码到暂存库</p></blockquote><blockquote><p><strong>step 14:</strong> git commit -m &#39;你的修改内容描述&#39; // 将暂存库中的内容提交到本地库，注意，这里的描述可能会有相关的规范，可以询问你的同事或组长</p></blockquote><blockquote><p><strong>step 15:</strong> git push // 提交你的代码到远程库，整个代码修改流程到此结束，你可以跟你的 leader 说一下。</p></blockquote><h4 id="正在开发中-无法提交暂存区-但线上出-bug-了-需要临时切换分支-怎么办" tabindex="-1">正在开发中，无法提交暂存区，但线上出 BUG 了，需要临时切换分支，怎么办？ <a class="header-anchor" href="#正在开发中-无法提交暂存区-但线上出-bug-了-需要临时切换分支-怎么办" aria-label="Permalink to &quot;正在开发中，无法提交暂存区，但线上出 BUG 了，需要临时切换分支，怎么办？&quot;">​</a></h4><blockquote><p>git stash // 保存当前代码到暂存区的临时区</p></blockquote><blockquote><p>git checkout &lt;分支名称&gt; // 切换当前分支到指定分支</p></blockquote><blockquote><p>... 其它分支工作完成，需要切回刚才的分支了</p></blockquote><blockquote><p>git checkout &lt;分支名称&gt; // 切换回当前分支</p></blockquote><blockquote><p>git stash apply // 将刚刚保存到暂存区的代码取回并应用到开发区</p></blockquote><h4 id="git-遇上太多冲突无法正常处理时的解决办法" tabindex="-1">GIT 遇上太多冲突无法正常处理时的解决办法 <a class="header-anchor" href="#git-遇上太多冲突无法正常处理时的解决办法" aria-label="Permalink to &quot;GIT 遇上太多冲突无法正常处理时的解决办法&quot;">​</a></h4><blockquote><ul><li>第一种方案：放弃本地更改，覆盖更新<br> git fetch --all<br> git reset --hard origin/&lt;分支名称&gt;</li></ul><p>git fetch 只是下载远程库中的内容，不会做任何的合并工作，所以我们需要使用 git reset 命令将 head 指向刚刚下载的最新的版本</p></blockquote>',27),a=t("blockquote",null,[t("ul",null,[t("li",{0:""},[o("第二种方案：保留本地修改且更新到最新内容"),t("br"),o(" git stash"),t("br"),o(" git pull"),t("br"),o(" git stash pop stash@")])]),t("p",null,"首先将本地更改缓存起来，然后获取远程库中最新的版本，最后合并本地缓存中的内容到刚刚下载的最新版本中，需要注意的是，必须要逐个解决提示 auto-merging 的文件中的冲突")],-1),u=e('<h4 id="项目上线出现问题-需要回滚-怎么处理" tabindex="-1">项目上线出现问题，需要回滚，怎么处理 <a class="header-anchor" href="#项目上线出现问题-需要回滚-怎么处理" aria-label="Permalink to &quot;项目上线出现问题，需要回滚，怎么处理&quot;">​</a></h4><blockquote><p>怎样回滚？</p></blockquote><blockquote><p>git reset --hard &lt;指定版本号&gt; // 回滚到指定版本</p></blockquote><blockquote><p>git reset --hard HEAD^ // 回滚到上次提交</p></blockquote><blockquote><p>怎样获取版本号呢？</p></blockquote><blockquote><p>git log // 打印日志，并复制你想要回滚到的版本号的前 8 位</p></blockquote><blockquote><p>回滚后的代码版本号低于远程库中的版本号，怎么提交？</p></blockquote><blockquote><p>git push origin HEAD --force // 因为开发区版本低于库中的版本，所以需要强制提交</p></blockquote>',8),i=[r,a,u];function g(n,b,k,q,d,h){return s(),c("div",null,i)}const f=l(p,[["render",g]]);export{m as __pageData,f as default};
