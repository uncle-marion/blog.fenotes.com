import { defineConfig } from 'vitepress';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: '前端记事',
  base: '/blog.fenotes.com',
  description: 'A VitePress Site',
  lastUpdated: true,
  head: [
    [
      'link',
      {
        rel: 'shortcut icon',
        href: '/blog.fenotes.com/assets/images/favicon.ico',
        type: 'image/x-ico',
      },
    ],
  ],
  themeConfig: {
    logo: '/assets/images/logo.png',
    siteTitle: false,
    editLink: {
      pattern: 'https://github.com/uncle-marion/blog.fenotes.com',
      text: '在 github 上编辑此页',
    },
    lastUpdatedText: '本篇教程最后更新时间',

    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '开发环境与工具封装', link: '/unit1/operatingEnvironment.md' },
      { text: 'TypeScript 基础学习', link: '/unit2/firstTypeScript.md' },
      { text: '入门级服务环境搭建', link: '/unit2/firstTypeScript.md' },
      { text: 'React 基础与状态管理', link: '/unit2/firstTypeScript.md' },
      { text: 'Next 框架与开发实战', link: '/unit2/firstTypeScript.md' },
      { text: '使用RN开发移动应用', link: '/unit2/firstTypeScript.md' },
      { text: 'Electron 与桌面应用', link: '/unit2/firstTypeScript.md' },
      { text: 'JavaScript面试详解', link: '/unit2/firstTypeScript.md' },
      { text: '前端开发 面试技巧', link: '/unit2/firstTypeScript.md' },
    ],

    sidebar: {
      '/unit1/': [
        {
          text: '第一单元 开发环境与工具封装',
          items: [
            {
              text: '第一课 基本运行环境配置',
              link: '/unit1/operatingEnvironment.md',
              collapsed: true,
              items: [
                {
                  text: '附录 Windows 下安装 PowerShell',
                  link: '/unit1/powershell.md',
                },
                {
                  text: '附录 OSX 下安装Iterm',
                  link: '/unit1/iterm.md',
                },
                {
                  text: '附录 VSCode 常用插件',
                  link: '/unit1/vscode.md',
                },
                {
                  text: '附录 终端常用命令',
                  link: '/unit1/commonCommands.md',
                },
              ],
            },
            {
              text: '第二课 代码管理工具 Git',
              link: '/unit1/git.md',
              collapsed: true,
              items: [
                {
                  text: '附录 理解 Git 工作流',
                  link: '/unit1/gitFlow.md',
                },
                {
                  text: '附录 Git 常见问题',
                  link: '/unit1/gitQuery.md',
                },
                {
                  text: '附录 Git 常用命令集',
                  link: '/unit1/gitCommand.md',
                },
              ],
            },
            {
              text: '第三课 代码规范与 ESLint',
              link: '/unit1/codingStandard.md',
              collapsed: true,
              items: [
                {
                  text: '附录 关于ESLint',
                  link: '/unit1/eslint.md',
                },
              ],
            },
            {
              text: '第四课 项目构建工具 WebPack',
              link: '/unit1/webpack.md',
              collapsed: true,
              items: [
                {
                  text: '附录 模块化相关知识',
                  link: '/unit1/modular.md',
                },
                {
                  text: '附录 管理项目依赖',
                  link: '/unit1/npm.md',
                },
                {
                  text: '附录 WebPack 常见配置',
                  link: '/unit1/optimize.md',
                },
              ],
            },
            {
              text: '第五课 构建全新的 React项目',
              link: '/unit1/craco.md',
              collapsed: true,
              items: [
                {
                  text: '附录 Craco 配置详解',
                  link: '/unit1/customizeCra.md',
                },
                {
                  text: '附录 Vite 配置详解',
                  link: '/unit1/vite.md',
                },
              ],
            },
            {
              text: '第六课 自定义小工具',
              link: '/unit1/utilsPackage.md',
              collapsed: true,
              items: [
                {
                  text: '附录 本地缓存管理',
                  link: '/unit1/storageManage.md',
                },
                {
                  text: '附录 防抖与节流',
                  link: '/unit1/th.md',
                },
                {
                  text: '附录 日期格式转换',
                  link: '/unit1/optimize.md',
                },
              ],
            },
            {
              text: '第七课 AJAX 封装',
              link: '/unit1/axiosPackage.md',
              collapsed: true,
              items: [
                {
                  text: '附录 Axios 源码解析',
                  link: '/unit1/axios.md',
                },
                {
                  text: '附录 Fetch 源码解析',
                  link: '/unit1/fetch.md',
                },
              ],
            },
          ],
        },
      ],
      '/unit2/': [
        {
          text: '第二单元 TypeScript 基础学习',
          items: [
            {
              text: '第一课 第一个 TypeScript 程序',
              link: '/unit2/firstTypeScript.md',
              collapsed: true,
              items: [
                {
                  text: '附录 什么是 TypeScript',
                  link: '/unit2/whatIsTypeScript.md',
                },
                {
                  text: '附录 tsconfig.json 指南',
                  link: '/unit2/tsconfig.md',
                },
              ],
            },
            {
              text: '第二课 类型声明与 TS 原始类型',
              link: '/unit2/typeOfCleavage.md',
              collapsed: true,
              items: [
                {
                  text: '附录 什么是TypeScript',
                  link: '/unit1/whatIsTypeScript.md',
                },
                {
                  text: '附录 TypeScript',
                },
              ],
            },
            {
              text: '第三课 TS 对象类型与数组',
              link: '/unit2/typeOfObject.md',
              collapsed: true,
            },
            {
              text: '第四课 TS 中的类与接口',
              link: '/unit2/typeOfClass.md',
              collapsed: true,
            },
            {
              text: '第五课 函数类型',
              link: '',
              collapsed: true,
            },
            {
              text: '第六课 泛型',
              link: '',
              collapsed: true,
            },
            {
              text: '第七课 泛型',
              link: '',
              collapsed: true,
            },
            {
              text: '第八课 ',
              link: '',
              collapsed: true,
            },
            {
              text: '第九课',
              link: '',
              collapsed: true,
            },
            {
              text: '第十课',
              link: '',
              collapsed: true,
            },
          ],
        },
      ],
    },

    socialLinks: [
      {
        icon: 'github',
        link: 'https://github.com/uncle-marion/blog.fenotes.com',
      },
    ],
  },
});
