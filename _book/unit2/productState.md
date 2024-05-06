> 平安蜀黍的前端教程 > 实战教学 > 使用 redux 管理全局状态

学习完 redux 的理论知识与基本用法后，我们来学习 redux 在实际业务中的使用。

前面的课程中，因为还没有学习 redux，所以，登录组件是一个相对较复杂的容器组件。现在，我们尝试重构整个登录组件，将负责处理状态的逻辑提取出来放到 model 中，让登录组件成为一个纯渲染的无状态组件：

### 调整完善 store.js

首先我们需要配置好 storejs，引入开发中所需的其它依赖：

```javascript
// 导入creageStaore 用于创建store库
import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import promise from 'redux-promise';
import { composeWithDevTools } from 'redux-devtools-extension';

// redux-persist提供了两个方法分别用于持久化我们的store和reducer
import { persistStore, persistReducer } from 'redux-persist';
// 将redux数据存储到localStorage的工具
import storage from 'redux-persist/lib/storage';
// 将redux数据存储到sessionStorage的工具
import session from 'redux-persist/lib/storage/session';

// 根据项目需要，定义好需要的reducer方法名称
import { auth, goods, order, user, service, content } from './';

// 全局持久化的配置项
const rootPersistConfig = {
  key: 'root',
  blackList: ['auth'],
  storage,
};

// 授权相关状态持久化的配置项
const authPersistConfig = {
  key: 'auth',
  storage: session,
};

const rootReducers = combineReducers({
  // 对auth相关状态单独进行持久化操作
  auth: persistReducer(authPersistConfig, auth),
  // 其它状态统一使用rootPersistConfig配置
  goods,
  order,
  user,
  service,
  content,
});

// 全局状态的持久化操作
const persistedReducer = persistReducer(rootPersistConfig, rootReducers);

// 中间件配置
const middleware = applyMiddleware(thunk, promise);

// 只希望在开发环境使用调试工具
const enhancers =
  process.env.NODE_ENV === 'development'
    ? composeWithDevTools(middleware)
    : middleware;

// 调用createStore方法创建store库
const store = createStore(persistedReducer, enhancers);

// 调用persistStore持久化store并抛出结果
export const persistor = persistStore(store);
// 默认抛出store库
export default store;
```

### 创建 reducer 文件并导出

reducer.js

```javascript
// 定义初始化状态集
const initializeState = {};

// 定义reducer函数并抛出
export default function auth(state = initializeState, { type, payload }) {
  switch (type) {
    default:
      return state;
  }
}
```

index.js

```javascript
// 使用绝对路径，避免将来移动文件造成无法访问的情况
// 因为require会以对象的方式导入的文件中所有的函数，所以我们需要获取default属性
export const auth = require('@/models/auth').default;
```

这里使用 CommonJs 模块化的方式来加载文件，避免了 ES6 的加载方式需要先导入完成后导出的写法，这种写法可以直接导出。

### 重构登录页逻辑

#### 第一步：定义初始化状态

```javascript
// models/auth.js
const CAPTCHA_BASE = 'http://shop.fenotes.com/adminapi/captcha_pro';
// 定义初始化状态集
const initializeState = {
  // 本地信息
  isLogging: false, // 是否正在登录
  loggingStatus: false, // 是否登录成功
  loggingFailedMessage: null, // 登录失败的消息
  accountFailedCount: 0, // 账号密码输入错误次数
  remember: null, // 用户账号密码
  disableLoginTime: null, // 防暴力破解延时
  countzeroDesc: null, // 展示在登录按钮上的倒计时
  // 接口返回的信息
  captchaImg: `${CAPTCHA_BASE}?_=${Date.now()}`,
  token: '', // 服务器返回用户标识
  expiresTime: '', // 用户标识有效期
  menus: [], // 用户可访问菜单列表
  authList: [], // 用户权限信息
  userInfo: {}, // 用户描述信息
};
```

写业务代码之前，一定要先梳理整个业务的流程，对于整个流程中所依赖的状态要心里有数。登录这一块我们已经在 login 组件中把整个的登录逻辑都实现过了，所以相对应的状态都已经了解，这里就直接复制过来了

#### 第二步：创建 action creator 和 reducer

为了更好地管理 action name，我们一般都会设定一个 actionNames 的文件，用于存储 action name:

```javascript
// models/actionNames.js
export const CHANGE_CAPTCHA = 'ChangeCaptcha'; // 切换验证码

export const auth = {
  CHANGE_CAPTCHA: `auth/${CHANGE_CAPTCHA}`,
};
```

定义好 action name 后，我们先创建一个比较简单的 action creator：

```javascript
// models/auth.js
import { auth as actionNames } from '@/models/actionNames';
/**
 * 修改验证码
 */
export function changeCaptcha() {
  return {
    type: actionNames.CHANGE_CAPTCHA,
  };
}
```

同时在 reducer 函数中添加对应的状态处理逻辑：

```javascript
/**
 * 定义处理登录和授权相关信息的reducer函数并抛出
 * @param {*} state
 * @param {*} param1
 * @returns
 */
export default function auth(state = initializeState, { type, payload }) {
  switch (type) {
    // 修改验证码图片
    case actionNames.CHANGE_CAPTCHA:
      return { ...state, captchaImg: `${CAPTCHA_BASE}?_=${Date.now()}` };
    default:
      return state;
  }
}
```

#### 第三步：使用 connect 将 state 和 action 注入到组件

```javascript
import { connect } from 'react-redux';
import { changeCaptcha } from '@/models/auth';

class Login extends Component {
  // ...
  render() {
    const { captchaImg, changeCaptcha } = this.props
    // ...
    <Form.Item
      name="imgcode"
      label="验证码"
      rules={[
        { required: true, message: '请输入验证码!' },
        { len: 4, message: '验证码长度不正确' },
      ]}
    >
      <div className="captcha">
        <Input placeholder="填入验证码" size="large" />
        <img onClick={changeCaptcha} src={captchaImg} alt="pictrue" />
      </div>
    </Form.Item>
    // ...
  }
}

export default connect(state => state.auth, { changeCaptcha })(Login);
```

启动项目，我们应该可以在登录页看到验证码图片，同时点击验证码图片可以更新。

#### 第四步：优化登录逻辑

经过前三步的动作后，我们确认了组件可以通过 connect 获取到 state，同时也能通过 dispatch 将 action 派发到 store 中去。那么，接下来我们就需要完成相对较复杂的登录逻辑：

##### 1. 先处理最基本的请求

```javascript
// models/actionNames.js
export const CHANGE_REQUEST_STATUS = 'ChangeRequestStatus'; // 切换请求状态
export const RECORD_SUCCESS_INFO = 'RedordSuccessInfo'; // 记录成功返回信息
export const RECORD_FAILED_INFO = 'RedordFailedInfo'; // 记录失败返回信息

export const CHANGE_CAPTCHA = 'ChangeCaptcha'; // 切换验证码

export const auth = {
  CHANGE_REQUEST_STATUS: `auth/${CHANGE_REQUEST_STATUS}`,
  RECORD_SUCCESS_INFO: `auth/${RECORD_SUCCESS_INFO}`,
  RECORD_FAILED_INFO: `auth/${RECORD_FAILED_INFO}`,
  CHANGE_CAPTCHA: `auth/${CHANGE_CAPTCHA}`,
};
```

```javascript
// models/auth.js
// 因为需要管理的状态较多，登录逻辑相对比较复杂，所以我们需要派发一个函数
/**
 * 创建用于登录的action, 一个相对较复杂的函数
 * @param {*} values // 页面中收集的表单数据
 * @returns
 */
export function createLoginAction(values) {
  return function (dispatch, getState) {
    // 发起请求
    Sapi.post('/adminapi/login', values)
      // 请求成功
      .then(res => {
        // 登录成功
        // 接口返回的数据包含状态码stateus、消息msg与数据data
        if (res.status !== 200) {
          // 抛出错误给catch
          return Promise.reject(res);
        }
        // 从data中取出需要用到的的数据
        const { token, expires_time, menus, unique_auth, user_info } = res.data;
        // 将授权相关数据存入redux中
        const payload = {
          token: token,
          expiresTime: expires_time,
          menus: menus,
          authList: unique_auth,
          userInfo: user_info,
        };
        // 将数据派发到store
        dispatch({
          type: actionNames.RECORD_SUCCESS_INFO,
          payload,
        });
      })
      // 请求失败
      .catch(error => {
        // 所有错误都需要提示用户错误信息
        dispatch({});
      })
      // 请求完成
      .finally(() => {
        // 切换验证码图片
        dispatch(changeCaptcha());
      });
  };
}
// ...

/**
 * 定义处理登录和授权相关信息的reducer函数并抛出
 * @param {*} state
 * @param {*} param1
 * @returns
 */
export default function auth(state = initializeState, { type, payload }) {
  switch (type) {
    // 修改验证码图片
    case actionNames.CHANGE_CAPTCHA:
      return { ...state, captchaImg: `${CAPTCHA_BASE}?_=${Date.now()}` };
    // 登录成功，记录授权信息等
    case actionNames.RECORD_SUCCESS_INFO:
      return { ...state, ...payload };
    // 登录失败，处理失败相关信息
    case actionNames.RECORD_FAILED_INFO:
      return { ...state, ...payload };
    default:
      return state;
  }
}
```

```javascript
// pages/login.jsx
import { connect } from 'react-redux';
import { changeCaptcha, createLoginAction } from '@/models/auth';

class Login extends Component {
  // ...
  render() {
    const { captchaImg, changeCaptcha, createLoginAction } = this.props
    // ...
    <Form
      labelCol={ { span: 7 }}
      wrapperCol={ { span: 16 }}
      autoComplete="off"
      initialValues={remember}
      // 输入内容全部验证通过会调用这个方法
      onFinish={createLoginAction}
    >
    </Form>
    // ...
  }
}

export default connect(state => state.auth, { changeCaptcha, createLoginAction })(Login);
```

刷新页面，进行提交测试，如果没有意外的话，这个时候应该是可以请求成功并且获取到服务器返回的授权信息了

##### 2. 根据需求，完善其它状态逻辑

首先我们需要一个计时器，用于在登录失败超过一定次数后禁用登录按钮，也因为增加了这个计时器，所以我们还需要监听组件的挂载与卸载事件：

完整的 actionNames 文件：

```javascript
// models/actionNames.js
export const COMPONENT_MOUNT = 'ComponentMount'; // 组件挂载
export const COMPONENT_UNMOUNT = 'ComponentUnmount'; // 组件卸载

export const CHANGE_REQUEST_STATUS = 'ChangeRequestStatus'; // 切换请求状态
export const RECORD_SUCCESS_INFO = 'RedordSuccessInfo'; // 记录成功返回信息
export const RECORD_FAILED_INFO = 'RedordFailedInfo'; // 记录失败返回信息

export const CHANGE_CAPTCHA = 'ChangeCaptcha'; // 切换验证码
export const COUNT_ZERO_DESCRIPTION = 'CountZeroDescription'; // 倒计时

export const auth = {
  COMPONENT_MOUNT: `auth/${COMPONENT_MOUNT}`,
  COMPONENT_UNMOUNT: `auth/${COMPONENT_UNMOUNT}`,
  CHANGE_REQUEST_STATUS: `auth/${CHANGE_REQUEST_STATUS}`,
  RECORD_SUCCESS_INFO: `auth/${RECORD_SUCCESS_INFO}`,
  RECORD_FAILED_INFO: `auth/${RECORD_FAILED_INFO}`,
  CHANGE_CAPTCHA: `auth/${CHANGE_CAPTCHA}`,
  COUNT_ZERO_DESCRIPTION: `auth/${COUNT_ZERO_DESCRIPTION}`,
};
```

完整的 reducer 文件：

```javascript
// models/auth.js
import { message } from 'antd';
import { auth as actionNames } from '@/models/actionNames';

import { getTimestamp, getTimeDesc } from '@/utils';
import Sapi from '@/utils/admin';

const CAPTCHA_BASE = 'http://shop.fenotes.com/adminapi/captcha_pro';
const disableCount = 10 * 60;
const remainCount = 5 * 10;

// 定义初始化状态集
const initializeState = {
  // 每次访问都需要初始化的
  captchaImg: `${CAPTCHA_BASE}?_=${Date.now()}`,
  isLogging: false, // 是否正在登录
  loggingStatus: false, // 是否登录成功
  loggingFailedMessage: null, // 登录失败的消息

  // 需要根据storage中的数据进行计算的
  lastLoginTime: null, // 最后一次登录时间
  accountFailedCount: 0, // 错误次数
  countzeroDesc: null, // 展示在登录按钮上的倒计时
  remember: null, // 记住用户的账号密码

  // 接口返回的
  token: '', // 用户标识
  expiresTime: '', // 用户标识有效期
  menus: [], // 用户可访问菜单列表
  authList: [], // 用户权限信息
  userInfo: {}, // 用户描述信息
};
// 本页有计时器
let timer = null;

/**
 * 初始化页面
 * 因为整个页面的状态都是通过redux来保存的，所以我们每一次进入页面需要检查状态是否是初始状态
 * @returns
 */
export function initPage() {
  return function (dispatch, getState) {
    const {
      auth: { accountFailedCount, lastLoginTime },
    } = getState();
    const payload = {
      captchaImg: `${CAPTCHA_BASE}?_=${Date.now()}`,
      isLogging: false,
      loggingStatus: false,
      loggingFailedMessage: null,
    };
    const currTime = getTimestamp();
    // 是否禁用登录状态
    const isDisableLogin =
      accountFailedCount >= 3 && lastLoginTime + disableCount > currTime;
    // 是否需要清除错误记录
    const isClearFailedCount =
      accountFailedCount < 3 && lastLoginTime + remainCount < currTime;

    // 展示倒计时
    if (isDisableLogin) {
      createCountzero(dispatch, lastLoginTime + disableCount - currTime);
    } else {
      payload.countzeroDesc = null;
      payload.accountFailedCount = 0;
    }

    // 清空错误记录
    if (isClearFailedCount) {
      payload.accountFailedCount = 0;
    }

    dispatch({
      type: actionNames.COMPONENT_MOUNT,
      payload,
    });
  };
}

export function closePage() {
  clearTimeout(timer);
  timer = null;
}

/**
 * 修改请求状态
 * @param {*} payload
 */
export function changeLoginStatus(payload) {
  return {
    type: actionNames.CHANGE_REQUEST_STATUS,
    payload,
  };
}

/**
 * 倒计时方法
 * @param {*} dispatch
 * @param {*} expiresTime
 */
export function createCountzero(dispatch, disableTime) {
  function countZero() {
    if (disableTime <= 0) {
      return dispatch({
        type: actionNames.COUNT_ZERO_DESCRIPTION,
        payload: {
          countzeroDesc: null,
          accountFailedCount: 0,
        },
      });
    }
    disableTime -= 1;
    // 计时器内递归调用
    timer = setTimeout(() => countZero(), 1000);
    dispatch({
      type: actionNames.COUNT_ZERO_DESCRIPTION,
      payload: { countzeroDesc: getTimeDesc(disableTime) },
    });
  }
  countZero();
}

/**
 * 修改验证码
 */
export function changeCaptcha() {
  return {
    type: actionNames.CHANGE_CAPTCHA,
  };
}

/**
 * 创建用于登录的action, payload是一个相对较复杂的函数
 * @param {*} values // 页面中收集的表单数据
 * @returns
 */
export function createLoginAction(values) {
  return function (dispatch, getState) {
    // 获取最新的状态
    const {
      auth: { isLogging, accountFailedCount },
    } = getState();
    // 如果上一次登录操作还没结束，不做任何操作
    if (isLogging) {
      return;
    }
    // 派发正在登录状态，不允许重复点击
    dispatch(changeLoginStatus(true));
    Sapi.post('/adminapi/login', values)
      // 请求成功
      .then(res => {
        if (res.status !== 200) {
          return Promise.reject(res);
        }
        dispatch({
          type: actionNames.RECORD_SUCCESS_INFO,
          payload: { ...res.data, values },
        });
      })
      // 请求失败
      .catch(error => {
        message.warn(error.msg);
        // 是否需要展示倒计时
        const isDisableLogin = accountFailedCount >= 2;
        if (isDisableLogin) {
          createCountzero(dispatch, disableCount);
        }
        dispatch({
          type: actionNames.RECORD_FAILED_INFO,
          payload: error,
        });
      })
      // 请求完成
      .finally(() => {
        dispatch(changeCaptcha());
        dispatch(changeLoginStatus(false));
      });
  };
}

/**
 * 定义处理登录和授权相关信息的reducer函数并抛出
 * @param {*} state
 * @param {*} param1
 * @returns
 */
export default function auth(state = initializeState, { type, payload }) {
  switch (type) {
    // 页面初始化
    case actionNames.COMPONENT_MOUNT:
      return { ...state, ...payload };

    // 修改验证码图片
    case actionNames.CHANGE_CAPTCHA:
      return { ...state, captchaImg: `${CAPTCHA_BASE}?_=${Date.now()}` };

    // 修改请求状态
    // 每一次都顺便记录一下操作时间，方便后续添加其它逻辑，比如错误多少次不允许登录，比如多长时间可以清空错误记录等等视产品需求而定
    case actionNames.CHANGE_REQUEST_STATUS:
      return { ...state, isLogging: payload, lastLoginTime: getTimestamp() };

    // 登录成功，记录授权信息等
    case actionNames.RECORD_SUCCESS_INFO:
      const { token, expires_time, menus, unique_auth, user_info, values } =
        payload;
      const successInfo = {
        loggingStatus: true,
        token: token,
        expiresTime: expires_time,
        menus: menus,
        authList: unique_auth,
        userInfo: user_info,

        accountFailedCount: 0,
        countzeroDesc: null,
      };

      // 如果需要记住当前用户账号与密码信息
      if (values.remember) {
        successInfo.remember = values;
      } else {
        successInfo.remember = null;
      }

      return { ...state, ...successInfo };

    // 登录失败，处理失败相关信息
    case actionNames.RECORD_FAILED_INFO:
      const errorInfo = {
        loggingStatus: false,
        loggingFailedMessage: payload.msg,
        accountFailedCount: state.accountFailedCount + 1,
        remember: null,
      };

      return { ...state, ...errorInfo };
    // 登录按钮被禁用显示倒计时
    case actionNames.COUNT_ZERO_DESCRIPTION:
      return { ...state, ...payload };
    default:
      return state;
  }
}
```

完整的页面文件

```javascript
import React, { Component } from 'react';
import { Form, Input, Button, Checkbox } from 'antd';
import { connect } from 'react-redux';
import {
  createLoginAction,
  changeCaptcha,
  initPage,
  closePage,
} from '@/models/auth';

import './login.less';

// 设定账号规则为必须小写字母开头且只允许包含小写字母与数字，最短4位，最长16位
const accountReg = /^[a-z][a-z0-9]{3,15}$/;
// 8~16位字符，必须包含有至少1位数字，1位字母
const passwordReg = /(?=.*[0-9])(?=.*[A-z]).{8,16}/;

class Login extends Component {
  // 验证账号规则
  checkAccount(_, value) {
    return new Promise((resolve, reject) => {
      if (accountReg.test(value)) {
        resolve(true);
      } else {
        reject('账号必须小写字母开头，可以包含数字且长度在4到16位之间');
      }
    });
  }
  // 验证密码规则
  checkPassword(_, value) {
    return passwordReg.test(value)
      ? Promise.resolve()
      : Promise.reject('密码必须包含字母和数字且长度在8到16位之间');
  }

  /**
   * 组件初始化
   */
  componentDidMount() {
    // 初始化状态
    this.props.initPage();
  }

  /**
   * 状态更新
   */
  componentDidUpdate() {
    const { loggingStatus, history } = this.props;
    // 返回登录成功，跳转路由到来时页或首页
    if (loggingStatus) {
      return history.push('/');
    }
  }

  /**
   * 组件卸载
   */
  componentWillUnmount() {
    // 需要关闭计时器等
    this.props.closePage();
  }

  render() {
    const {
      remember,
      captchaImg,
      changeCaptcha,
      createLoginAction,
      isLogging,
      countzeroDesc,
    } = this.props;
    return (
      // 所有的页面容器都需要docwrap这个样式名，便于设定一些全局的页面样式
      // 每个页面都需要一个自己的样式名，便于设定自己私有的页面样式且用于区分样式作用域
      <div className="docwrap login">
        <div className="container">
          {/* 所有的样式名不应该包含大写，如果是多个单词线成，应使用“-”号来连接，不要用大写，也不要用下划线 */}
          <div className="form-wrap">
            <Form
              labelCol={ { span: 7 }}
              wrapperCol={ { span: 16 }}
              autoComplete="off"
              initialValues={remember}
              // 输入内容全部验证通过会调用这个方法
              onFinish={createLoginAction}
            >
              <Form.Item
                name="account"
                label="账号"
                // rules 校验规则：用于向valuedate插件描述这个输入项的校验规则及校验失败后的提示信息
                // rules是一个数组，它可以接受多个规则对象作为它的成员，具体的规则我们可以看今天的附件三
                rules={[
                  {
                    // 必填
                    required: true,
                    message: '请填写账号',
                  },
                  // 最小长度为4
                  {
                    min: 4,
                    message: '账号长度最少4位',
                  },
                  // 最大长度为16
                  {
                    max: 16,
                    message: '账号长度最长为16位',
                  },
                  // 最后使用定义的方法进行校验
                  {
                    validator: this.checkAccount,
                  },
                ]}
                hasFeedback={false}
              >
                <Input size="large" placeholder="用户名、邮箱或手机号" />
              </Form.Item>
              <Form.Item
                name="pwd"
                label="密码"
                rules={[
                  {
                    required: true,
                    message: '请填写密码',
                  },
                  // 最小长度为8
                  {
                    min: 8,
                    message: '密码长度最少8位',
                  },
                  // 最大长度为16
                  {
                    max: 16,
                    message: '密码长度最长为16位',
                  },
                  // 最后使用定义的方法进行校验
                  {
                    validator: this.checkPassword,
                  },
                ]}
                hasFeedback={false}
              >
                <Input.Password
                  // 禁用自动填充
                  autoComplete="new-password"
                  size="large"
                  placeholder="填写登录密码"
                />
              </Form.Item>
              <Form.Item
                name="imgcode"
                label="验证码"
                rules={[
                  { required: true, message: '请输入验证码!' },
                  { len: 4, message: '验证码长度不正确' },
                ]}
              >
                <div className="captcha">
                  <Input placeholder="填入验证码" size="large" />
                  <img onClick={changeCaptcha} src={captchaImg} alt="pictrue" />
                </div>
              </Form.Item>
              <Form.Item>
                {/* 是否正在登录，是否失败3次后的禁止登录时间 */}
                {isLogging || countzeroDesc ? (
                  <Button type="primary" disabled block>
                    {countzeroDesc ? `${countzeroDesc}后可继续登录` : '登录'}
                  </Button>
                ) : (
                  <Button type="primary" htmlType="submit" block>
                    登录
                  </Button>
                )}
              </Form.Item>
              <Form.Item name="remember" valuePropName="checked">
                <Checkbox>记住我</Checkbox>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(state => state.auth, {
  createLoginAction,
  changeCaptcha,
  initPage,
  closePage,
})(Login);
```

好了，到这里为止，使用 redux 来管理登录状态的重构工作就完成了。从代码量来看，从使用 redux 前的 260 行左右到使用 redux 后的 400 行左右，看似增加了代码量以及跨文档的逻辑处理，需要更好地捋清思路，开发起来更麻烦了。但实际上，重构完成后，我们有效地将数据与表现分离开来，在有需要的时候，可以轻易地将 redux 中的一些 action 和 reducer 方法提供给未来其它的组件使用。
