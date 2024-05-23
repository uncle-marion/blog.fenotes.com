> 平安蜀黍的前端教程 > 备选知识点 > vscode 插件管理

VSCode 轻量、开源，对于后端开发说可能有点幼稚，但对于前端来说刚刚好，毕竟不需要搞什么 Docker、数据库等等，装俩 VSCode 插件，打开网页，就能开工了。

但是当我们在一台全新的电脑上初始化安装的 VSCode 可谓是身无长物、一穷二白，连个最基本的项目管理的功能都没有。所以，这篇教程将从前端开发者的角度来介绍一些裸 VSCode 必备插件，打造一个相对于前端来说友好的开发 IDE。

#### Chinese (Simplified) (简体中文) Language Pack for Visual Studio Code

VSCode 简体中文语言包

## 一、代码规范(必装)

当大家在公司工作时，不可能永远是一个人维护一个项目，当多个人参与一个项目，极有可能每个人使用的编辑器不一样，而且每个人的代码风格也不一样，那么如何让使用不同编辑器的开发者能够轻松惬意的遵守公司约定的一些代码规范呢？

作为一名有多年工作经验的高级前端工程师来说，为了保持代码本身以及团队成员代码的一致性，ESLint,Prettier 和 EditorConfig 这三款 VSCode 插件我们是必须要使用的，也必须要习惯地去遵循它们的规范，以避免在未来的工作中出现问题。

### 1. ESLint

ESLint 是目前最受欢迎的 JavaScript 代码检测工具。它会静态分析我们的代码，以帮助我们检测格式问题并查找代码不一致的地方。当前国内无论公司大小，在代码提交时基本上都是需要进行代码检查的，所以，这个插件是属于必装！

#### 使用方法：

1. 安装完毕后，我们需要在项目根目录下创建一个.eslintrc 配置文件。
2. 在配置文件中，我们可以定义自己的规则或者扩展现有的配置，例如 eslint-config-airbnb。
3. 当我们开始编写代码时，ESLint 会在编辑器中实时提示不符合规则的代码。
4. 我们可以通过快捷键或右键菜单来修复这些问题。

### 2. Prettier - Code formatter

Prettier 的功能就是按照我们的配置文件，格式化我们的代码，减少在提交代码时出现太多的格式错误。

它的功能与 ESLint 很像，但它不检查你的代码质量。它只是作为一个代码格式化工具。对于它原生支持的 JavaScript 而言，它做的非常好。然后它同时也支持 JSX、Flow、TypeScript、HTML、JSON、CSS 等其他众多语言。

#### 使用方法

与 ESLint 需要一个配置文件不同，Prettier 原则上不用配置，这是为了让开发团队专注于更重要的事情。当然，它也是支持在 .prettierrc.\* 文件中自定义规则项的。

[我个人常用的 Prettierrc 文件](https://gitee.com/fenotes/configuration-files/blob/master/.prettierrc)

### 3. EditorConfig for VS Code

EditorConfig 则既不检测也不格式化我们的代码。它仅仅在开发者团队内部使用的所有 IDE 和编辑器之间定义一份标准的代码风格指南。比如，一个团队中同时有人在使用 Sublime Text 和 VSCode，那么 EditorConfig 就能够使它们在单个文件内定义公共的缩进模式（空格或制表符）。

EditorConfig 是一款用来规范代码风格的插件，我们使用 EditorConfig 所配置的代码规范规则优先级高于编辑器默认的代码格式化规则。如果我们没有配置 Editorconfig，执行的就是编辑器默认的代码格式化规则；如果我们已经配置了 EditorConfig，则按照我们设置的规则来，从而忽略编辑器的设置。EditorConfig 包含一个用于定义代码格式的文件和一批编辑器插件，这些插件是让编辑器读取配置文件并以此来格式化代码。

#### 使用方法：

1. 在当前项目根目录下添加.editorconfig 文件
2. 安装 EditorConfig 扩展
3. 全局安装或局部安装 editorconfig 依赖包(npm install -g editorconfig | npm install -D editorconfig)
4. 打开需要格式化的文件并手动格式化代码（Mac OS ：shift+option+f Windows ：shift+alt+f）

可以通过资源管理器侧栏的上下文菜单右键选择 Generate.editorconfig，然后这个目录下面就会创建出一个.editorconfig 文件了，当然如果团队里其它项目中已经配置好了这个文件，我们可以直接复制过来就行了。

[我个人常用的 EditorConfig 文件](https://gitee.com/fenotes/configuration-files/blob/master/.editorconfig)

### 4. 项目中如何配置 ESLint、Prettier 与 EditorConfig

上面三个插件是我们在写代码之前必须要安装的，但在实际使用中，我们可能经常会碰到 ESLint 与 Prettierrc 或 EditorConfig 起冲突的现象，所以，我们需要对这三个插件进行兼容性调整：

为什么要进行兼容性调整？因为它们在一起的时候，很有可能会遇到代码格式的问题：

<img src="/assets/images/unit_01/eslint.jpg" />

比如上图，当我们使用 ESLint 和 Prettier 来升级代码检测能力时，发现 Prettier 的规则导致 ESLint 的错误。我们可以通过强制为 ESLint 添加新的规则来清除掉这个错误，但是后续还会有其它冲突，很显然，我们不能通过为每个冲突添加 ESLint 规则来修补这些冲突。

#### 解决方案

我们尝试使用**专事专办**的方法，ESLint 只负责代码质量检测，Prettier 则充当代码格式化的工具，最后由 EditorConfig 来为每个人提供正确的编辑器配置。规则如下：

> 与编辑器相关的所有配置（尾行、缩进风格、缩进大小等）交由 EditorConfig 来处理；

> 与代码格式相关的一切事物应该由 Prettier 来处理；

> 剩下的(代码质量)则由 ESLint 来负责。

因为缺乏具体项目，仅在这里空泛地描述可能并不适合，所以我将这块的具体作法放到了本单元[第五课 构建全新的 React 项目](/unit1/craco.md)，感兴趣的同学可以提前看看。

## 二、Git 管理

### Git Graph

最好用的 Git 插件，拥有超级强大的 Git 功能

#### 使用方法：

##### 1. 查看 Git Graph

VSCode 左下角，有一个 Git Graph 按钮，点击即显示 Graph

每一条线就是一个分支(branch)

每一个点就是一次提交(commit)

每一个拐点就是一次合并(merge)

## 三、自动完成

### ES7 React/Redux/GraphQL/React-Native snippets

ES7 React/Redux/GraphQL/React-Native snippets 提供了一系列的代码片段，包括但不限于快速生成各种 React 组件。

[常用缩写](/unit1/snippets.md)

## 四、功能增强

### Auto Close Tag

在我们输入 html 标签时帮我们自动生成对应的结束标签，避免因为代码多次缩进后遗失对应的结束标签。

### Auto Rename Tag

在我们编辑 html 代码时，这个插件可以帮助我们同步更改相对应的标签名

### CSS Peek

在我们编辑 html 代码时，可能会需要对当前标签用到的 class 进行调整， Css Peek 可以帮助我们很方便地达成这个目的。

### Path Intellisense

Path Intellisense 插件可以自动完成文件路径，在输入 import 语句或其他需要路径引用的地方，插件会提供自动完成建议。可以自定义插件的触发字符，默认为/，支持在设置中过滤建议列表，例如忽略特定的文件类型，也可以自定义搜索路径的优先级，提高路径查找的准确性。Path Intellisense 插件极大地简化了文件引用操作。

### React PropTypes Generate

React PropTypes Generate 用于生成 React 组件的 PropTypes 声明，有助于类型检查和文档自动生成。

#### 使用方式

> 在组件文件中，使用 propTypes 快捷命令。

> 插件会根据组件中的 props 自动生成 PropTypes 声明。

> 支持不同的 PropTypes 检查类型，如 array、bool 等。

> 可以根据实际 props 使用情况，快速进行补充和修改。

> 对于大型组件，PropTypes 生成能够显著提升开发效率。

### VSCode React Refactor

有时候我们某个 JSX 文件在业务的迭代过程中变得越来越复杂且庞大，这个时候就必须对一些可独立使用的 JSX 代码抽出并封装成单独的 React 组件，VSCode React Refactor 可以帮我们轻松地将待抽取代码从主代码中分离出来。

## 五、治疗手残

### Error Lens

在我们开发过程中难免会碰到一些小疏忽，比如：标点未区分中英文或是代码经过多次缩进后括号遗失了等等比较低级的错误，Error Lens 可以在我们输入一些错误的语法格式时提示我们。

#### 调整为中文提示

选择文件 => 首选项 => 设置 => 扩展 => TypeScript => TypeScript Locale

或者按住 "ctrl" + "," 唤出设置窗口并在搜索框中输入 "TypeScript Locale"

在下拉框中选中"zh-CN"即可。

### Code Spell Checker

这个插件的功能很简单，就是帮助你检查英文单词的拼写错误。

在开发中，我们偶尔写错单词，比如 history 写成 histoy，比如 active 写成了 actived，安装了这个插件后拼写错误的单词下会有淡淡的蓝色波浪线，划到上方就选择 Quick Fix 就可以看到一些可能正确的单词，选中它就可以替换掉。

#### 配置文件

Code Spell Checker 支持在本地根目录自定义一个 cspell.json 配置文件，用于解决一些项目中的生造词引起的问题：

```json
// cSpell 配置
{
  // 配置文件版本
  "version": "0.2",

  // 当前生效的语言
  "language": "en",

  // 自定义正确的单词，通常是一些库名字和专有api,
  "words": [
    "vfonts",
    "Lato",
    "Pinia",
    "pinia",
    "ionicons",
    "homebg",
    "vicons",
    "Chatbubble"
  ],

  //确实是单词，但是自认为在项目中一定是错的，设定后就会报错，例如单词the容易写成hte,blog写成blg
  "flagWords": ["hte", "blg"],

  //忽略检查的路径，例如忽略安装的包中的所有代码的检查，忽略svg图片，package.json,readme.md中的单词的检查，还是很有用的
  "ignorePaths": ["node_modules/**", "**/*.{svg,txt,json,md}"]
}
```

### var-translate-en

这个插件是对于大多数英语不好的同学的最好辅助：

- 转英文

> 1. 输入中文（也支持其他语言转英文，具体支持语言参考各翻译平台文档）。

> 2. 选中要翻译转换的内容。

> 3. 默认快捷键 win: Ctrl + Shift + v， mac: Control + Shift + v 若需自定义快捷键参考下面 自定义快捷键配置。

> 4. 转换后选择想要的命名风格，确定即可。

- 转中文

> 1. 选中要翻译的内容（也支持其他语言转中文，具体支持语言参考各翻译平台文档）。

> 2. 默认快捷键 win: Ctrl Ctrl（双击 Ctrl）， mac: Control Control（双击 Control）若需自定义快捷键参考下面 自定义快捷键配置。

> 3. 翻译后的中文支持选中替换。

## 六、界面美化

### Bracket Pair Colorizer 2

Bracket Pair Colorizer 可以给匹配的括号加上不同的颜色，使得代码更加易读，特别是在嵌套多层的 jsx 代码中，编码时自动高亮匹配的括号。Bracket Pair Colorizer 支持对圆括号、方括号和花括号进行颜色区分，非常适合 React 开发中复杂的组件结构和高阶函数使用。

### Color Highlight

Color Highlight 是一款用于 Css 开发的插件，它会将颜色值直接转换成色块显示在界面上。

### Material Theme Icons

一个图标扩展，可以让我们左侧的资源管理栏看起来更美观且更容易辨认各种文件类型。
