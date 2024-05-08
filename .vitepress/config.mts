import {defineConfig} from 'vitepress';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: '前端记事',
  description: 'A VitePress Site',
  lastUpdated: true,
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
      {text: '首页', link: '/'},
      {text: '开发环境与工具封装', link: '/unit1/operatingEnvironment.md'},
      {text: 'TypeScript 知识回顾', link: '/unit2/component.md'},
    ],

    sidebar: {
      '/unit1/': [
        {
          text: '第一单元 开发环境与工具封装',
          items: [
            {
              text: '第一课 项目的基本运行环境',
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
              ],
            },
            {
              text: '第二课 项目集成工具 WebPack',
              link: '/unit1/webpack.md',
              collapsed: true,
              items: [
                {
                  text: '附录 模块化管理项目',
                  link: '/unit1/module.md',
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
              text: '第三课 React项目配置',
              link: '/unit1/customizeCra.md',
              collapsed: true,
              items: [
                {
                  text: '附录 Craco 配置详解',
                  link: '/unit1/craco.md',
                },
                {
                  text: '附录 Vite 配置详解',
                  link: '/unit1/vite.md',
                },
              ],
            },
            {
              text: '第四课 代码管理工具 Git',
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
              text: '第五课 代码规范与 ESLint',
              link: '/unit1/condingStandard.md',
              collapsed: true,
              items: [
                {
                  text: '附录 ESLint',
                  link: '/unit1/eslint.md',
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
          text: 'TypeScript 知识回顾',
          link: '/unit2/component.md',
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
