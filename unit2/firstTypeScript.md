> 平安蜀黍的前端教程 > 第二单元 TypeScript 基础学习 > 第一个 TypeScript 程序

## 安装 VSCode 与配置 Node 环境

这个我们在上个单元的第一课已经全部配置完成，所以在这里就不再重复了，有需要的同学可以回过头去再看一看。

## 安装 TypeScript 编译器

```shell
yarn global add typescript
# 或者
npm i -g typescript
```

安装完成后，在终端输入

```shell
tsc -v
// Version *.*.*
```

如果是 windows 用户，可能会在输入命令后报错：

```bash
tsc: The term 'tsc' is not recognized as a name of a cmdlet, function, script file, or executable program.
Check the spelling of the name, or if a path was included, verify that the path is correct and try again.
```

出现这种情况是因为你使用了 yarn 来安装 TypeScript，但是 yarn 的 bin 路径还没有添加到你的环境变量中去：

在 windows 的搜索框内输入"系统环境变量"，然后在弹出的窗口中选择"编辑系统环境变量"，系统会弹出一个新窗口：
<img src="/assets/images/unit_02/change_path_01.jpg" />
在弹出的新窗口中选择"环境变量"系统会再一次弹出一个新窗口：
<img src="/assets/images/unit_02/change_path_02.jpg" />
选择红线框选的 path，双击它，会再次弹出一个新窗口：
<img src="/assets/images/unit_02/change_path_03.jpg" />
依照图上的描述，找到你的 yarn 目录所在的位置，然后把路径复制下来，粘贴进去重启系统即可。

PS: 上面的做法非常麻烦，我们也可以通过命令行来实现：

打开你的 CMD 窗口，注意一定是 CMD 而不是 shell 或是其它，然后输入：

```cmd
setx "path" "%path%;你上面复制的路径"
```

回车后重启即可。

- 小技巧

编辑完成后关闭当前 cmd 窗口，然后再次开启一个新的 cmd 窗口并输入 echo %path%，可以不需要重启。(待验证)

## 编写我们的第一个 TypeScript 程序

回过头来，我们先在工作目录中新建一个 typescript 文件夹，然后将它加入到我们的 VSCode 编辑器中，建立我们的第一个 ts 文件并保存为 hello.ts：

```javascript
console.log('Hello TypeScript');
```

然后我们可以在终端输入

```shell
tsc hello.ts
```

执行完成后会在当前目录下生成一个 hello.js 文件，我们可以在终端执行它：

```shell
node hello.js
```

接下来我们就可以写一个 ts 程序了，如果不了解，可以先不用理解为什么要这样写，我们只需要记住怎样做会出现什么样的结果就行

```typescript
// console.log('Hello TypeScript');
function greet(person, date) {
  console.log(`Hello ${person}, today is ${date}`);
}

greet();
```

可以看到，我们的代码中已经明确地提示了错误：

<img src="/assets/images/unit_02/typescript_error_01.jpg" />

那么，我们按照要求补完代码：

```typescript
// console.log('Hello TypeScript');
function greet(person, date) {
  console.log(`Hello ${person}, today is ${date}`);
}

greet('TypeScript', '05/06/2022');
```

这样就解决了报错问题，那么我们继续执行 tsc 对代码进行编译：

```shell
tsc hello.ts
```

执行完成后，我们发现 ts 代码中又出现了报错：

<img src="/assets/images/unit_02/typescript_error_02.jpg" />

为什么会出现函数实现重复这种错误呢？这是因为我们当前所编辑的 hello.ts 与编译后生成的 hello.js 两个文件，它们所默认的执行环境都是在全局环境下，这样，TSC 就会认为我们在全局环境下创建了两个 greet 方法，所以它就报错了，怎样解决这个问题呢？很简单，在项目里生成 tsconfig 文件就解决了。

## 配置 TypeScript 设置文件

回到我们的项目根目录，执行 tsc --init 命令：

```shell
tsc --init
```

这样，就会在我们的根目录下生成一个叫 tsconfig.json 的文件，我们可以通过编辑这个文件来解决未来我们在编码过程中可能遇到的一系列问题。打开 tsconfig.json 文件，我们可以看到是一堆被注释的内容，只有少量的属性是被打开的，我们不管它，直接复制下面的内容覆盖原有的文件内容：

```json
{
  "compileOnSave": true,
  "compilerOptions": {
    "target": "es2016", // 编译后生成的JS语言版本
    "lib": [
      // TS在编译成JS时需要引入哪些库，我们现在所引入的是dom,dom.iterable,esnext
      "dom", // 不是纯粹意义上我们所理解的DOM，这里的dom指的是我们通过DOM所操作的对象
      "dom.iterable", // dom.iterable是dom的子集，它是指那些可以被迭代的DOM元素
      "esnext" // 表示可以支持到ECMAScript的下一个版本(未发布但已定案，确定明年会发布)
    ],
    "strictNullChecks": true, // 严格空检查
    "noImplicitThis": true, // 关闭this类型注解提示
    "allowJs": true, // 允许编译器编译JS，JSX文件
    "skipLibCheck": true, // 跳过库里的声明文件的类型检查以提高编译速度
    "esModuleInterop": true, // 允许使用export导出，使用import导入
    "allowSyntheticDefaultImports": true, // 在静态类型检查时，把 import 没有 exports.default 的报错忽略掉
    "strict": true, // 开启严格模式
    "forceConsistentCasingInFileNames": true, // 强制代码中使用的模块文件名必须和文件系统中的文件名保持大小写一致
    "noFallthroughCasesInSwitch": true, // switch语句中必须有break对语句进行终止
    "module": "esnext", // 生成代码的模板标准
    "moduleResolution": "node", // 确定模块路径的算法，即如何查找模块
    "resolveJsonModule": true, // 允许使用import命令导入JSON文件
    "isolatedModules": true, // 设置如果当前 TypeScript 脚本作为单个模块编译，是否会因为缺少其他脚本的类型信息而报错
    "noEmit": true, // 设置是否产生编译结果。如果不生成，TypeScript 编译就纯粹作为类型检查了
    "jsx": "react-jsx" // 设置如何处理.tsx文件，react-jsx模式会将<div />编译成_jsx("div")
  }
}
```

上面这个文件内容是我们未来使用 CRA 生成 React + TypeScript 项目后脚本自动生成的 tsconfig 文件内容，每个人都需要了解，后面讲 React 的时候不会再解释这个文件。

## 显式类型

配置好 tsconfig 文件后，我们再看 hello.ts 文件，函数实现重复的问题解决了，但是出现了新的问题：

<img src="/assets/images/unit_02/typescript_error_03.jpg" />

参数 person 隐式具有 any 类型，这是因为我们在定义 greet 方法时，没有对它接受到的两个参数类型进行定义，导致它可以接受任意类型的数据作为它的参数，这违背了我们使用 TypeScript 的初衷，怎么解决呢？我们可以给它们进行一个显式的类型定义：

```typescript
// console.log('Hello TypeScript');
// 我们显式定义person为字符串类型，date为日期格式
function greet(person: string, date: Date) {
  console.log(`Hello ${person}, today is ${date}`);
}

greet('TypeScript', new Date());
```

修改完成后再次执行 tsc hello.ts，并执行它编译后的文件 hello.js

<img src="/assets/images/unit_02/typescript_error_04.jpg" />

OK，到这里，我们的第一个 TypeScript 程序就完成了，没有任何错误，编译执行后也能打印出正确的结果。

## 本节附录：tsconfig.json 文件注释

因为编译选项配置非常繁杂，有很多配置，我在这里只列出一些常用的配置，至于未来可能需要用到什么配置，我们可以去到[官网查阅](https://www.typescriptlang.org/tsconfig)

```json
{
  "compilerOptions": {
    "incremental": true, // TS编译器在第一次编译之后会生成一个存储编译信息的文件，第二次编译会在第一次的基础上进行增量编译，可以提高编译的速度
    "tsBuildInfoFile": "./buildFile", // 增量编译文件的存储位置
    "diagnostics": true, // 打印诊断信息
    "target": "ES5", // 目标语言的版本
    "module": "CommonJS", // 生成代码的模板标准
    "outFile": "./app.js", // 将多个相互依赖的文件生成一个文件，可以用在AMD模块中，即开启时应设置"module": "AMD",
    "lib": ["DOM", "ES2015", "ScriptHost", "ES2019.Array"], // TS需要引用的库，即声明文件，es5 默认引用dom、es5、scripthost,如需要使用es的高级版本特性，通常都需要配置，如es8的数组新特性需要引入"ES2019.Array",
    "allowJS": true, // 允许编译器编译JS，JSX文件
    "checkJs": true, // 允许在JS文件中报错，通常与allowJS一起使用
    "outDir": "./dist", // 指定输出目录
    "rootDir": "./", // 指定输出文件目录(用于输出)，用于控制输出目录结构
    "declaration": true, // 生成声明文件，开启后会自动生成声明文件
    "declarationDir": "./file", // 指定生成声明文件存放目录
    "emitDeclarationOnly": true, // 只生成声明文件，而不会生成js文件
    "sourceMap": true, // 生成目标文件的sourceMap文件
    "inlineSourceMap": true, // 生成目标文件的inline SourceMap，inline SourceMap会包含在生成的js文件中
    "declarationMap": true, // 为声明文件生成sourceMap
    "typeRoots": [], // 声明文件目录，默认时node_modules/@types
    "types": [], // 加载的声明文件包
    "removeComments": true, // 删除注释
    "noEmit": true, // 不输出文件,即编译后不会生成任何js文件
    "noEmitOnError": true, // 发送错误时不输出任何文件
    "noEmitHelpers": true, // 不生成helper函数，减小体积，需要额外安装，常配合importHelpers一起使用
    "importHelpers": true, // 通过tslib引入helper函数，文件必须是模块
    "downlevelIteration": true, // 降级遍历器实现，如果目标源是es3/5，那么遍历器会有降级的实现
    "strict": true, // 开启所有严格的类型检查
    "alwaysStrict": true, // 在代码中注入'use strict'
    "noImplicitAny": true, // 不允许隐式的any类型
    "strictNullChecks": true, // 不允许把null、undefined赋值给其他类型的变量
    "strictFunctionTypes": true, // 不允许函数参数双向协变
    "strictPropertyInitialization": true, // 类的实例属性必须初始化
    "strictBindCallApply": true, // 严格的bind/call/apply检查
    "noImplicitThis": true, // 不允许this有隐式的any类型
    "noUnusedLocals": true, // 检查只声明、未使用的局部变量(只提示不报错)
    "noUnusedParameters": true, // 检查未使用的函数参数(只提示不报错)
    "noFallthroughCasesInSwitch": true, // 防止switch语句贯穿(即如果没有break语句后面不会执行)
    "noImplicitReturns": true, //每个分支都会有返回值
    "esModuleInterop": true, // 允许export=导出，由import from 导入
    "allowUmdGlobalAccess": true, // 允许在模块中全局变量的方式访问umd模块
    "moduleResolution": "node", // 模块解析策略，ts默认用node的解析策略，即相对的方式导入
    "baseUrl": "./", // 解析非相对模块的基地址，默认是当前目录
    "paths": {
      // 路径映射，相对于baseUrl
      // 如使用jq时不想使用默认版本，而需要手动指定版本，可进行如下配置
      "jquery": ["node_modules/jquery/dist/jquery.min.js"]
    },
    "rootDirs": ["src", "out"], // 将多个目录放在一个虚拟目录下，用于运行时，即编译后引入文件的位置可能发生变化，这也设置可以虚拟src和out在同一个目录下，不用再去改变路径也不会报错
    "listEmittedFiles": true, // 打印输出文件
    "listFiles": true // 打印编译的文件(包括引用的声明文件)
  },
  // 指定一个匹配列表（属于自动指定该路径下的所有ts相关文件）
  "include": ["src/**/*"],
  // 指定一个排除列表（include的反向操作）
  "exclude": ["demo.ts"],
  // 指定哪些文件使用该配置（属于手动一个个指定文件）
  "files": ["demo.ts"]
}
```
