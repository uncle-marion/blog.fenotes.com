> 平安蜀黍的前端教程 > 备选知识点 > vscode 插件管理


VSCode 轻量、开源，对于后端开发说可能有点幼稚，但对于前端来说刚刚好，毕竟不需要搞什么 Docker、数据库等等，装俩 VSCode 插件，打开网页，就能开工了。
但我们在一台全新的电脑上初始化安装的 VSCode 可谓是身无长物、一穷二白，连个项目管理的功能都没有。这篇教程将从前端开发者的角度来介绍一些裸 VSCode 必备插件，打造一个相对于前端来说友好的开发 IDE。

### 代码规范(必装)

当大家在公司工作时，不可能永远是一个人维护一个项目，当多个人参与一个项目，极有可能每个人使用的编辑器不一样，而且每个人的代码风格也不一样，那么如何让使用不同编辑器的开发者能够轻松惬意的遵守公司约定的一些代码规范呢？

作为一名有多年工作经验的高级前端工程师来说，为了保持代码本身以及团队成员代码的一致性，ESLint,Prettier和EditorConfig这三款VSCode插件我们是必须要使用的，也必须要习惯地去遵循它们的规范，以避免在未来的工作中出现问题。

#### ESLint

ESLint 是目前最受欢迎的 JavaScript 代码检测工具。它会静态分析我们的代码，以帮助我们检测格式问题并查找代码不一致的地方。

##### 使用方法：

1. 安装完毕后，我们需要在项目根目录下创建一个.eslintrc配置文件。
2. 在配置文件中，我们可以定义自己的规则或者扩展现有的配置，例如eslint-config-airbnb。
3. 当我们开始编写代码时，ESLint会在编辑器中实时提示不符合规则的代码。
4. 我们可以通过快捷键或右键菜单来修复这些问题。

#### ESLint相关插件推荐

##### ESLint 解析器推荐

babel-eslint: 该依赖包允许你使用一些实验特性的时候，依然能够用上Eslint语法检查。反过来说，当你代码并没有用到Eslint不支持的实验特性的时候是不需要安装此依赖包的。

@typescript-eslint/parser: Typescript语法的解析器，类似于babel-eslint解析器一样。对应parserOptions的配置参考官方的README。

##### ESLint 扩展推荐

eslint-config-airbnb: 该包提供了所有的Airbnb的ESLint配置，作为一种扩展的共享配置，你是可以修改覆盖掉某些不需要的配置的，该工具包包含了react的相关Eslint规则(eslint-plugin-react与eslint-plugin-jsx-a11y)，所以安装此依赖包的时候还需要安装刚才提及的两个插件

eslint-config-airbnb-base: 与上一个包的区别是，此依赖包不包含react的规则，一般用于服务端检查。

eslint-config-jest-enzyme: jest和enzyme专用的校验规则，保证一些断言语法可以让Eslint识别而不会发出警告。

eslint-config-prettier: 将会禁用掉所有那些非必须或者和prettier冲突的规则。这让您可以使用您最喜欢的shareable配置，而不让它的风格选择在使用Prettier时碍事。请注意该配置只是将规则off掉,所以它只有在和别的配置一起使用的时候才有意义。

##### 其它插件推荐

eslint-plugin-babel: 和babel-eslint一起用的一款插件.babel-eslint在将eslint应用于Babel方面做得很好，但是它不能更改内置规则来支持实验性特性。eslint-plugin-babel重新实现了有问题的规则，因此就不会误报一些错误信息

eslint-plugin-import: 该插件想要支持对ES2015+ (ES6+) import/export语法的校验, 并防止一些文件路径拼错或者是导入名称错误的情况

eslint-plugin-jsx-a11y: 该依赖包专注于检查JSX元素的可访问性。

eslint-import-resolver-webpack: 可以借助webpack的配置来辅助eslint解析，最有用的就是alias，从而避免unresolved的错误

eslint-import-resolver-typescript：和eslint-import-resolver-webpack类似，主要是为了解决alias的问题

eslint-plugin-react: React专用的校验规则插件.

eslint-plugin-jest: Jest专用的Eslint规则校验插件.

eslint-plugin-prettier: 该插件辅助Eslint可以平滑地与Prettier一起协作，并将Prettier的解析作为Eslint的一部分，在最后的输出可以给出修改意见。这样当Prettier格式化代码的时候，依然能够遵循我们的Eslint规则。如果你禁用掉了所有和代码格式化相关的Eslint规则的话，该插件可以更好得工作。所以你可以使用eslint-config-prettier禁用掉所有的格式化相关的规则(如果其他有效的Eslint规则与prettier在代码如何格式化的问题上不一致的时候，报错是在所难免的了)

@typescript-eslint/eslint-plugin：Typescript辅助Eslint的插件。

eslint-plugin-promise：promise规范写法检查插件，附带了一些校验规则。

##### 辅助优化流程

husky: git命令hook专用配置.

lint-staged: 可以定制在特定的git阶段执行特定的命令。

##### ESLint 配置文件

env: 预定义那些环境需要用到的全局变量，可用的参数是：es6、broswer、node等。

es6会使能所有的ECMAScript6的特性除了模块(这个功能在设置ecmaVersion版本为6的时候会自动设置)

browser会添加所有的浏览器变量比如Windows

node会添加所有的全局变量比如global

更多环境配置参考[Specifying Environments](https://eslint.org/docs/latest/use/configure/#specifying-environments)

extends: 指定扩展的配置，配置支持递归扩展，支持规则的覆盖和聚合。

plugins: 配置那些我们想要Linting规则的插件。

parser: 默认ESlint使用Espree作为解析器，但是一旦我们使用babel的话，我们需要用babel-eslint。

parserOptions: 当我们将默认的解析器从Espree改为babel-eslint的时候，我们需要指定parseOptions，这个是必须的。

ecmaVersion: 默认值是5，可以设置为3、5、6、7、8、9、10，用来指定使用哪一个ECMAScript版本的语法。也可以设置基于年份的JS标准，比如2015(ECMA 6)

sourceType: 如果你的代码是ECMAScript 模块写的，该字段配置为module，否则为script(默认值)

ecmaFeatures：该对象指示你想使用的额外的语言特性

globalReturn：允许全局范围内的`return`语句 impliedStrict：使能全局`strict`模式 jsx：使能JSX

rules: 自定义规则，可以覆盖掉extends的配置。

settings：该字段定义的数据可以在所有的插件中共享。这样每条规则执行的时候都可以访问这里面定义的数据

更多配置选项参考官方文档[Eslint](https://eslint.org/docs/latest/use/configure/)

#### Prettier - Code formatter

Prettier 的 格式化 代码功能与 ESLint 很像，但它不检查你的代码质量。它只是作为一个代码格式化工具。对于它原生支持的 JavaScript 而言，它做的非常好。然而，同时它也支持 JSX、Flow、TypeScript、HTML、JSON、CSS 等其他众多语言。

##### 使用方法

与 ESLint 需要一个配置文件不同，Prettier 原则上不用配置，这是为了让开发团队专注于更重要的事情。当然，它也是支持在 .prettierrc.* 文件中自定义规则项的。

[我个人常用的Prettierrc文件](https://gitee.com/fenotes/configuration-files/blob/master/.prettierrc)


#### EditorConfig for VS Code

EditorConfig 则既不检测也不格式化我们的代码。它仅仅在开发者团队内部使用的所有 IDE 和编辑器之间定义一份标准的代码风格指南。比如，一个团队中同时有人在使用 Sublime Text 和 VSCode，那么EditorConfig 就能够使它们在单个文件内定义公共的缩进模式（空格或制表符）。

EditorConfig 是一款用来规范代码风格的插件，我们使用EditorConfig所配置的代码规范规则优先级高于编辑器默认的代码格式化规则。如果我们没有配置Editorconfig，执行的就是编辑器默认的代码格式化规则；如果我们已经配置了EditorConfig，则按照我们设置的规则来，从而忽略编辑器的设置。EditorConfig包含一个用于定义代码格式的文件和一批编辑器插件，这些插件是让编辑器读取配置文件并以此来格式化代码。

##### 使用方法：

1. 在当前项目根目录下添加.editorconfig文件
2. 安装EditorConfig扩展 
3. 全局安装或局部安装editorconfig依赖包(npm install -g editorconfig | npm install -D editorconfig)
4. 打开需要格式化的文件并手动格式化代码（Mac OS ：shift+option+f  Windows ：shift+alt+f）

可以通过资源管理器侧栏的上下文菜单右键选择Generate.editorconfig，然后这个目录下面就会创建出一个.editorconfig文件了，当然如果团队里其它项目中已经配置好了这个文件，我们可以直接复制过来就行了。

[我个人常用的EditorConfig文件](https://gitee.com/fenotes/configuration-files/blob/master/.editorconfig)



#### Git Graph

Git Graph 是服务于 Git 分支管理的一种可视化工具，帮助我们直观地理解 Git 仓库的繁杂分支信息。 从 HEAD 指针一直往下找到分叉节点的上一个 commit 就是衍生 Branch 的 commit。

点击窗口左侧的Git Graph图标可以唤出Git Graph窗口。

#### GitHub Copilot

#### GitHub Copilot Chat

### 自动完成

#### JavaScript(ES6) code snippets

#### ES7 React/Redux/GraphQL/React-Native snippets

### 界面美化

#### Chinese (Simplified) (简体中文) Language Pack for Visual Studio Code

简体中文语言包



### 其它
