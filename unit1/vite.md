> 平安蜀黍的前端教程 > 备选知识点 > Vite 配置文件

### 什么是 Vite

vite 是一种新的前端构建工具，其功能与 webpack 大致相同，但它大胆地将应用中的模块拆分为依赖与源码，使用 [esbuild 预构建依赖](https://cn.vitejs.dev/guide/dep-pre-bundling.html)，同时以[原生 ESM(ES6 模块化)](modular.md) 的方式来提供源码，大大提高了开发时项目更新的速度。

### 使用 vite 命令创建项目

> **注意：**  
> Vite 需要 Node.js 版本 >= 14.18.0。部分模块可能需要依赖更高版本的 NodeJS，所以，当你的包管理器发出警告时，尽快升级你的 Node 版本

#### 创建项目

```bash
# 使用npm
npm create vite@latest
# 使用yarn
yarn create vite
```

然后按照系统提示进行操作，习惯使用 Vue 脚手架的同学这里应该会非常熟悉。然后我们也可以通过增加命令行参数的方式来指定项目名称和需要使用的模板：

```bash
# 使用npm
npm create vite test --template react
# 使用yarn
yarn create vite test --template react
```

### vite 的配置项参考

[直接看官网吧，太多了](https://cn.vitejs.dev/config/)

### react 项目中常见配置

```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import vitePluginImp from 'vite-plugin-imp';

export default defineConfig({
  plugins: [
    react(),
    // antd 样式文件按需加载
    vitePluginImp({
      libList: [
        {
          libName: 'antd',
          style: name => `antd/es/${name}/style`,
        },
      ],
    }),
  ],
  css: {
    // css预处理器
    preprocessorOptions: {
      less: {
        // 允许从jsx中读写less代码
        javascriptEnabled: true,
        modifyVars: {
          '@primary-color': '#4377FE', //设置antd主题色
          '@font-size-base': '13px', // 全局字体大小
        },
      },
    },
  },
  resolve: {
    // 路径别名
    // 注意：配置了别名后还需要配置jsconfig.json文件，这样编辑器才能找到别名所指向的路径
    alias: {
      '@': '/src/',
    },
  },
  server: {
    // 跨域
    proxy: {
      // 选项写法
      '/admin': {
        target: 'http://shop.fenotes.com',
        changeOrigin: true,
        // rewrite: path => path.replace(/^\/api/, '/admin'),
      },
    },
    // 项目启动后自动打开浏览器窗口
    open: true,
  },
});
```
