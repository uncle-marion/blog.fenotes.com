> 平安蜀黍的前端教程 > 实战教学 > 完善全局框架

昨天的实战项目，我们将登录页重构了一遍，将状态与表现彻底分离开来，今天，我们需要将之前搭建的页面框架完善起来，同样的，这部分的功能也需要用到 redux:

### 构建 reducer

构建 reducer 之前，我们需要分析框架部分需要使用哪些 state，需要派发哪些 action:

#### 初始化状态

#### 定义 action

```javascript
/**
 * 将后端传入的数组格式菜单转换成树格式菜单
 */
export function transfromMenus() {}
/**
 * 监听路由变化
 */
export funciton routerChange() {}
/**
 * 用户信息管理
 */
export function loginOut() {}
/**
 * 系统消息管理
 */
export funciton getMessage() {}
```

#### 定义 reducer
