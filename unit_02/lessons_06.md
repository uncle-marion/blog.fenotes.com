> Marion 的 react 实战课程 > 第二部分 > 嵌套路由与权限管理

## 嵌套路由的实现

```javascript
<Route
  path="/"
  render={() => (
    <div>
      <Route path="/" render={() => <div>外层</div>} />
      <Route path="/in" render={() => <div>内层</div>} />
      <Route path="/others" render={() => <div>其他</div>} />
    </div>
  )}
/>
```

## 配合路由守卫实现权限管理
