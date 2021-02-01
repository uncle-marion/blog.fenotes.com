# lessons_12. Redux 的异步数据获取

第一步，定义一个 action 方法用于获取数据

```javascript
// 引入actionType声明
import { LOGIN } from './actionTypes';
// 引入axios工具
import { post } from '@utils/service';
// 定义获取数据的接口
const loginApi = '/api/user/login';
// 定义action方法，抛出一个action对象
export function LoginAction(options) {
  return {
    type: LOGIN,
    // promise数据需要redux-promise插件
    payload: post(loginApi, options),
  };
}
```

第二步，定义一个用于处理 promise 数据的 reduce 方法, 最好与 action 同名

```javascript
// 引入actionType声明
import { LOGIN } from '@action/actionTypes';
// 定义默认数据
const defaultValue = {
  statusText: '未登陆',
};
// 定义reduce方法，此方法必须是一个纯函数
export default function ReduxDemo(state = defaultValue, action) {
  // 匹配事件描述
  switch (action.type) {
    case LOGIN:
      // 判断返回数据是否正确
      if (action.payload.code === 200) {
        // 将数据处理后返回给store
        return {
          statusText: '已登陆',
          ...action.payload.data.userInfo[0],
        };
      }
      // 失败则返回异常信息
      return { statusText: action.payload.message };
    default:
      return state;
  }
}
```

第三步，在 store.js 中加入需要的插件

```javascript
/**
 * applyMiddleware 作用是将所有中间件组成一个数组, 然后扔给下面的compose依次执行
 * combineReducers 接受一个由reducer组成的对象, 将其转换成一个纯函数
 * compose store增强, 意思就是往我们的store中增加新的方法
 * createStore 用于创建一个store库
 */
import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
// 中间件，一个用于redux的promise插件, 修改了store.dispatch方法，使它能接受一个promise做为参数
import promise from 'redux-promise';
// 中间件，仍然是用于处理异步的插件，修改了store.dispatch方法，使它能接受一个函数作为参数
import thunk from 'redux-thunk';

// 引入reducer, 这个reducer是由多个reduce组成的对象
import Reducer from '@reducer';
// 加入redux浏览器调试工具
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// 创建一个story
const store = createStore(
  combineReducers(Reducer),
  // 中间件的引入(composeEnhancers, 可以认为它就是compose)
  composeEnhancers(applyMiddleware(promise, thunk))
);

export default store;
```

4 在需要异步加载数据的页面中引入 react-redux 与上面写的 reduce

```javascript
// 引入connect方法,用于将store和action嵌入我们的组件props中
import { connect } from 'react-redux'
// 引入我们第一步中完成的action
import { LoginAction } from '@action/loginDemo'

export default
// 使用装饰器将connect方法绑定到类组件中
@connect(
  // 第一个参数是store返回给我们的状态树, 可以通过props.state拿到
  state => {
    return {
      state,
    }
  },
  // 第二个参数是一个actions的对象，页面中所有需要触发的action都需要放在这里面
  {
    LoginAction,
  }
)
class LoginDemo extends PureComponent {
  //...其它逻辑代码
  // 这个是store返回给我们的状态树，我们可以用它来渲染页面
  const {state} = this.props
  // 这个是我们的action, 已经在react-redux中注册过了, 直接调用, 不需要dispatch
  const {LoginAction} = this.props
  //...其它逻辑代码
}
```
