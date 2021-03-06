# lessons_03. umi 的使用

## Umi 是什么？

乌米，是一个前端应用框架，目前在阿里系的技术圈中已经是必备技能，受阿里系影响比较大的杭州与上海，50%以上的公司都有项目在使用这个框架。而在北京，也有比较多的公司在使用 umi。

umi 的官网是这样描述的：Umi 以路由为基础的，同时支持配置式路由和约定式路由，保证路由的功能完备，并以此进行功能扩展。然后配以生命周期完善的插件体系，覆盖从源码到构建产物的每个生命周期，支持各种功能扩展和业务需求；

目前从我了解的信息上来看，umi 是一个以路由为基础的 react 应用框架。它支持一种叫做约定式路由的技术以及各种复杂的路由功能，并围绕这个核心进行功能扩展，比如支持路由级的按需加载。同时它还具备了前端插件管理系统、项目资源打包及语法编译等功能为一体，可以帮助开发者快速地创建一套完整体系的 react 项目。

## Umi 的特性

**🎉 可扩展** Umi 实现了完整的生命周期，并使其插件化，Umi 内部功能也全由插件完成。此外还支持插件和插件集，以满足功能和垂直域的分层需求。
**📦 开箱即用** Umi 内置了路由、构建、部署、测试等，仅需一个依赖即可上手开发。并且还提供针对 React 的集成插件集，内涵丰富的功能，可满足日常 80% 的开发需求。
**🐠 企业级** 经蚂蚁内部 3000+ 项目以及阿里、优酷、网易、飞猪、口碑等公司项目的验证，值得信赖。
**🚀 大量自研** 包含微前端、组件打包、文档工具、请求库、hooks 库、数据流等，满足日常项目的周边需求。
**🌴 完备路由** 同时支持配置式路由和约定式路由，同时保持功能的完备性，比如动态路由、嵌套路由、权限路由等等。
**🚄 面向未来** 在满足需求的同时，我们也不会停止对新技术的探索。比如 dll 提速、modern mode、webpack@5、自动化 external、bundler less 等等。

## 微前端

## 什么是配置式路由？

配置式路由，就是我们在学习 vue、react 时，通过手写 router 文件对每一个路由都指定 components 的方式

```javascript

```

## 什么是约定式路由？

约定式路由也叫文件路由，就是不需要手写路由配置，文件系统即路由，通过目录和文件以及它的命名来分析出路由配置。

比如这个文件结构

```javascript
└─  pages
 ├─  index.tsx
 └─  users.tsx
```

在支持约定式路由的框架中会生成下面这种路由配置

```javascript
[
  { exact: true, path: '/', component: '@/pages/index' },
  { exact: true, path: '/users', component: '@/pages/users' },
];
```

需要注意的是，满足以下任意规则的文件不会被注册为路由，

- 以 . 或 \_ 开头的文件或目录
- 以 d.ts 结尾的类型定义文件
- 以 test.ts、spec.ts、e2e.ts 结尾的测试文件（适用于 .js、.jsx 和 .tsx 文件）
- components 和 component 目录
- utils 和 util 目录
- 不是 .js、.jsx、.ts 或 .tsx 文件
- 文件内容不包含 JSX 元素

> 也就是说，它的文件遍历规则中首先收集所有 react 页面级组件，然后自动根据文件夹的路径生成文件的引用和路由表

**如果没有 routes 配置，Umi 会进入约定式路由模式，然后分析 src/pages 目录拿到路由配置。**

## 创建一个 umi+dva 的项目

mkdir umi_practice && cd umi_practice
yarn create @umijs/umi-app

## 热更新

###### 热更新加速

```javascript
// dev
mfsu: {}

// pro
mfsu: { production: { output: '.mfsu-production' } },
```

## 约定式路由

## 目录结构

###### /.env

###### /dist

###### /mock

###### /public

###### /src

###### /src/pages

###### /src/layouts

###### /src/.umi // no push

######

## layout
