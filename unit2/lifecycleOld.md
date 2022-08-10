> 平安蜀黍的前端教程 > 备选知识点 > 16.3 以前的生命周期

```javascript
class Test extends Readt.component {
  /* 1.创建阶段 */
  // 在创建类的时候被调用
  getDefaultProps: function() {
    console.log("定义默认props的方法: getDefaultProps");
    // 我们需要在这里定义默认的props，返回后react会将这个对象与传入的props进行合并
    return {
      auth: "平安蜀黍"
    };
  },

  /* 2.实例化阶段 */
  // 获取this.state的默认值
  getInitialState: function() {
    console.log("初始化组件自身状态的方法: getInitialState");
    // 返回的这个对象就是我们组件中的this.state
    return {
      name: "前端教程",
      url: "course.fenotes.com"
      };
  },
  // 组件将要加载, 在render之前调用此方法
  componentWillMount: function() {
    // 组件初始化业务逻辑的处理都应该放在这里, 比如数据渲染前可能存在的计算和转换等
    console.log("组件即将加载: componentWillMount");
  },
  // 渲染并返回一个虚拟DOM
  render: function() {
    console.log("组件开始渲染: render");
    return (
            <div>欢迎访问: {this.props.auth}的<a href={this.state.url}>{this.state.name}</a></div>
    );
  },
  // 组件完成加载, 在render之后调用此方法
  componentDidMount: function() {
    // 在该方法中, ReactJS会使用render方法返回的虚拟DOM对象来创建真实的DOM结构
    console.log("组件渲染完成: componentDidMount");
    // 我们已经可以从Dom中获取到渲染的节点
    var node = ReactDOM.findDOMNode(this);
    console.log(node);
  },

  /* 3.更新阶段 */
  // 该方法发生在this.props被修改或父组件调用setProps()方法之后
  componentWillReceiveProps: function() {
    console.log("状态发生变化，组件需要更新: componentWillRecieveProps");
  },
  // 是否需要更新
  shouldComponentUpdate: function() {
    console.log("我们在这里校验数据，判断组件是否需要更新: shouldComponentUpdate");
    return true;
  },
  // 将要更新
  componentWillUpdate: function() {
    console.log("组件更新前可能还需要计算或转换数据: componentWillUpdate");
  },
  // 更新完毕
  componentDidUpdate: function() {
    console.log("组件已经更新完毕，我们已经可以拿到dom节点了: componentDidUpdate");
  },

  /* 4.销毁阶段 */
  // 销毁时会被调用
  componentWillUnmount: function() {
    // 组件即将卸载，我们需要在这里清除计时器，中止一些未完成的ajax
    console.log("组件即将被卸载: componentWillUnmount");
  },
}
```
