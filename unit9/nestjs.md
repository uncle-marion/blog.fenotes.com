> Marion 的 react 实战课程 > 第九部分 > NestJS 入门

### 什么是 NestJS

NestJS 是一个用于构建高效、可扩展的 Node.js 服务器端应用程序的框架。它采用 TypeScript 编写，并提供了一套丰富的功能和工具，可以帮助开发人员快速构建强大的应用程序。NestJS 基于 Google 的 Gin 框架，并采用了类似 Angular 的架构。

在 NestJS 中，开发人员可以使用类似 Angular 的依赖注入（DI）系统来管理应用程序的组件和服务。此外，NestJS 还提供了一套完整的路由器，可以轻松地处理 HTTP 请求和响应。它还支持中间件，可以用于处理跨多个请求或响应的逻辑。

NestJS 还具有强大的测试工具，可以帮助开发人员编写可靠、可维护的代码。它支持单元测试和集成测试，并提供了模拟和存根功能，可以模拟依赖项或替换某些组件的行为。

除了这些基本功能外，NestJS 还支持许多流行的 Node.js 库和工具，例如 Express、MySQL、MongoDB 等。这意味着开发人员可以使用他们熟悉的工具和技术来构建 NestJS 应用程序。

总的来说，NestJS 是一个功能强大、易于使用的 Node.js 框架，可以帮助开发人员快速构建高质量的服务器端应用程序。对于前端开发人员来说，学习 NestJS 是一个很好的选择，因为它可以帮助他们更好地了解服务端技术，并掌握新的发展趋势。通过学习 NestJS，前端开发人员可以更好地与后端开发人员合作，并构建出更加强大、可扩展的应用程序。

### NestJS 环境搭建和项目创建

NestJS 需要 NodeJS 环境，对于 NodeJS 我们已经很熟悉了，所以在这里就不再重复。

[NestJS 中文文档](https://nest.nodejs.cn/)

我们先安装 NestJS 的脚手架：

```javascript
$ npm i -g @nestjs/cli
```

安装完成后可以尝试在终端中输入:

```javascript
$ nest -v
```

最后我们新建一个项目：

```javascript
$ nest new nest-demo --strict
```

这里 nest 会要求我们选择项目管理工具，因为国内环境问题，这里我建议大家选择 yarn 或 pnpm。

项目安装完成后，我们通过命令行进入项目然后执行 run start 命令启动项目：

```javascript
$ cd nest-demo
$ npm run start
```

### NestJS 控制器详解

#### 常用装饰器

| 装饰器     | 说明     |
| ---------- | -------- |
| @Request() | 请求参数 |
