> 平安蜀黍的前端教程 > 实战教学 > 实现一个登录页

昨天的实战课程中我们实现了整个登录页的 UI 布局，今天我们需要实现整个登录的功能，包括输入验证、图片校验及登录操作

### 输入验证

输入验证，这一块因为我们使用了 antd 的表单，所以主要带着大家学习一下表单项校验的一些方法，antd 目前项目中比较常见的是 4.x 版本，然后有少量项目还在用着 3.x 版本，3.x 这块我们暂时不需要太多关注，如果真的在项目中遇到了，就要尽量升级到 4.x，别怕麻烦，这也是业绩的一部分。

```javascript
<Form.Item
  name="account"
  label="账号"
  {/* rules用于告诉valuedate插件用什么规则进行校验 */}
  rules={[{
    required: true, message: '请填写账号'
    }]}
  hasFeedback={false}
>
  <Input size="large" placeholder="用户名、邮箱或手机号" />
</Form.Item>
```

一般来说，我们只需要两个属性，required：是否必填，validator：使用自定义方法进行校验

```javascript
// 设定账号规则为必须小写字母开头且只允许包含小写字母与数字，最短4位，最长16位
const accountReg = /^[a-z][a-z0-9]{3,15}$/
// ...
/**
 * validator函数有三个参数
 * @param {object} rule 第一个参数是当前Item的描述对象，包括field,fullField,type
 * @param {string} value 第二个参数是当前输入框中的值
 */
checkAccount(rule, value) {
  // 返回一个promise
  return new Promise((resolve, reject) => {
    // 简单地进行正则校验
    if (accountReg.test(value)) {
      resolve(true)
    } else {
      reject('账号必须小写字母开头，可以包含数字且长度在4到16位之间')
    }
  })
}
// ...
<Form.Item
  name="account"
  label="账号"
  // rules 校验规则：用于向valuedate插件描述这个输入项的校验规则及校验失败后的提示信息
  // rules是一个数组，它可以接受多个规则对象作为它的成员，具体的规则我们可以看今天的附件三
  rules={[
    {
      required: true,
      message: '请输入用户名',
    },
    // 最后使用定义的方法进行校验
    {
      validator: this.checkAccount,
    },
  ]}
  hasFeedback={false}
>
  <Input size="large" placeholder="用户名" />
</Form.Item>
```

### 图片校验

图片校验需要实现两种更新方式，一是用户点击图片进行更新，另一个是用户输入完成点击登录后校验失败自动更新，所以，我们需要先实现一个生成图片验证码地址的方法：

```javascript
// 从utils中导入随机数生成方法
import { getRandomString } from '@/utils'
// ...
constructor() {
  super()
  this.state = {
    captcha: captchaBase,
  }
  // 将修改验证码图片等函数的this对象绑定到当前组件实例上
  this.changeCaptch = this.changeCaptch.bind(this)
}
// 验证码切换
changeCaptch() {
  this.setState({
    captcha: `${captchaBase}?_=${getRandomString(6)}`,
  })
}
```

然后替换 JSX 中验证码部分的 url

```javascript
<div className="captcha">
  <Input placeholder="填入验证码" size="large" />
  {/* 将原来的url地址替换成this.state.captcha，同时绑定点击事件this.changeCaptch */}
  <img onClick={this.changeCaptch} src={this.state.captcha} alt="pictrue" />
</div>
```

### 发起登录请求

antd 的 form 表单提供了 onFinish 属性用于在整个表单校验通过后返回表单域中的所有内容，也提供了 onFinishFailed 属性用于在表单校验失败后返回失败的信息；因为每个校验项我们都进行了设定，所以，onFinishFailed 的使用场景不是很多，这节我们主要学习如何使用 onFinish 提交用户输入信息：

```javascript
// 导入我们在第一单元中封装好的axios插件
import Sapi from '@/utils/admin'

// 检查我们在第一单元中配置的config文件里的proxy是否正确
// 根目录下的craco.config.js文件
proxy: {
  // 我们在utils/admin这个文件中配置了baseUrl，只要是通过这个文件发起的ajax请求都会被加上一个sapi的前缀，
  // 这个sapi就是为了在这里可以统一使用拦截器的
  '/sapi': {
    // 指定代理服务器
    target: 'http://shop.fenotes.com/',
    // 是否修改源
    changeOrigin: true,
    // 是否需要重写路径
    pathRewrite: { '^/sapi': '' },
  },
}

// 在组件中加入onFinish方法
onFinish(values) {
  // 提交数据到服务器
  Sapi.post('/adminapi/login', values)
    .then(res => {
      // 接口返回的数据包含状态码stateus、消息msg与数据data
      console.log(res)
      if (res.status !== 200) {
        // 抛出错误给catch
        return Promise.reject(res)
      }
      // 从data中取出需要用到的的数据
      const { token, expires_time, menus, unique_auth, user_info } = res.data
      // 将数据缓存到本地
      storageManage.set('token', token, expires_time)
      storageManage.set('menus', menus)
      storageManage.set('auth', unique_auth)
      storageManage.set('userInfo', user_info)
    })
    .catch(error => {
      // 如果登录失败，这里需要自动切换验证码图片
      this.changeCaptch()
      console.log(error)
    })
}
```

这样，我们的整个登录模块流程就通了，用户正确输入账号密码后就能实现登录操作，接下来还需要完善：

### 登录过期的处理

在上面的代码中我们发现，登录状态是有过期时间的，比如我们的登录服务器现在的登录有效期就是 3 小时，那么在没有关闭浏览器的情况下，用户 3 小时后访问网页中的内容发现登录过期了，这时怎么处理？

#### 登录超时

第一种情况，用户页面一直打开且没有任何操作，登录超时后用户访问某页面会直接跳转到登录页要求用户重新登录；如果用户直接访问某个接口一般都会从接口服务器返回一个 401 类型的消息，表示当前用户的权限已经失效，我们只需要跳转到登录页让用户重新登录即可。

#### 用户要求免登

第二种情况，就像我们的登录按钮的下面，有一个“记住我”的选择框，这个记住我有多种解释：

- 1. 在当前浏览器缓存中记住我的账号密码，未来我进入登录页时自动帮我填充，就是我们当前项目能支持的这种模式：

```javascript
// 在构造器中判断并获取状态
constructor() {
  super()
  this.state = {
    captcha: captchaBase,
    // 定义初始状态
    initialValues: null,
  }
  // 判断是否有用户信息预留
  const userInfo = storageManage.get('remember')
  if (userInfo) {
    // 将获取到的用户信息写入初始状态
    this.state.initialValues = userInfo
  }
  // 将修改验证码图片等函数的this对象绑定到当前组件实例上
  this.changeCaptch = this.changeCaptch.bind(this)
  this.onFinish = this.onFinish.bind(this)
  this.onFinishFailed = this.onFinishFailed.bind(this)
}

// 在登录成功后保存状态
onFinish(values) {
  // 提交数据到服务器
  Sapi.post('/adminapi/login', values)
    .then(res => {
      // ...
      // 如果需要记住当前用户账号与密码信息
      if (values.remember) {
        storageManage.set('remember', values)
      }
    })
    // ...
}

// 在form表单中添加初始状态
<Form
  // 写入初始状态
  initialValues={this.state.initialValues}
  // 输入内容全部验证通过会调用这个方法
  onFinish={this.onFinish}
>
```

- 2. 在服务端记住客户端的的登录状态，在一定时间内（3~7 天或更久）不需要再次登录，这种方式只需要正常提交 remember 参数即可，由服务器返回一个有效期较长的 token

- 3. 在计算机记住用户登录状态与失效时间，在用户登录状态失效前向服务器发起一个延时请求，可以实现浏览器关闭之前不需要再次登录。也可以建立一个 websocket 服务，当用户登录即将失效时由服务端推送一个新的 token 来实现。这种方式相对来说实现起来要复杂得多，我们在这里只简单地描述一下，具体的代码就不再实现了

上面的三种模式，第一种是最容易实现的，我们不需要任何服务器支持，但这种方式极不安全，容易暴露用户账号与密码信息；然后是第二种，我们需要服务器能够接受一个时间参数，然后返回有效期为指定时间的 token，这种方式相对安全，但在登录有效期内任何人在当前计算机打开网站都能进行操作；第三种相对来说要复杂很多，我们需要服务器在当前登录临失效前在后台发起一个延期请求，要求服务器更新当前登录状态，将有效期顺延指定时间，这种方式要相对安全得多。

### 防暴力破解

防暴力破解，以前是在用户输错账号密码一定次数(一般是 3 次)以后，通过限制用户在指定时间以后尝试重新登录：

```javascript
// 组件初始化
constructor() {
  super()
  this.state = {
    captcha: captchaBase,
    // 初始化状态
    initialValues: null,
    // 禁用登录时间
    disableLoginTime: 0,
  }

  // 创建一个状态用于记录用户名或密码输入错误次数
  const accountFailedCount = storageManage.get('accountFailedCount')
  this.accountFailedCount = accountFailedCount || 0
  // 判断当前用户是否可以进行登录操作
  const disableLoginTime = storageManage.get('disableLoginTime')
  const now = Date.now()
  //
  if (disableLoginTime && now < disableLoginTime) {
    // constructor中，因为组件还没有实例化，所以我们可以直接操作对象
    this.state.disableLoginTime = parseInt((disableLoginTime - now) / 1000, 10)
  }
}

// 登录失败的处理
onFinish(values) {
  // 提交数据到服务器
  Sapi.post('/adminapi/login', values)
    .catch(error => {
    // 如果登录失败，这里需要自动切换验证码图片
      this.changeCaptch()
      // 提示用户错误信息
      message.error(error.msg)
      // 如果失败原因是账号或密码错误，需要增加错误计数
      const isAccountError = error.status === 400 && error.msg.includes('账号')
      if (isAccountError) {
        this.accountFailedCount += 1
        // 为避免暴力破解采用每次刷新页面的方式，数据要缓存到本地
        storageManage.set('accountFailedCount', this.accountFailedCount, 1000 * 60 * 30)
      }
      // 如果失败次数大于3次，则禁用登录按钮
      if (this.accountFailedCount >= 3) {
        // 多长时间后允许登录
        const disableLoginTime = 10 * 60
        this.setState({
          disableLoginTime,
        })
        // 禁用按钮的有效期
        const exp = Date.now() + disableLoginTime * 1000
        storageManage.set('disableLoginTime', exp, exp)
      }
    })
}

// 将时间转换成文字并显示在按钮上
handlerDisableTime() {
  // 1秒后改变禁用时间
  this.timer = setTimeout(() => {
    this.setState({
      disableLoginTime: this.state.disableLoginTime - 1,
    })
  }, 1000)
  // 返回需要显示的文本
  return `${Math.floor(this.state.disableLoginTime / 60)}分${
    this.state.disableLoginTime % 60
  }秒后重试登录`
}
// 根据条件判断渲染哪个按钮
render() {
  return this.state.disableLoginTime > 0 ? (
    <Button type="primary" disabled block>
      {this.handlerDisableTime()}
    </Button>
  ) : (
    <Button type="primary" htmlType="submit" block>
      登录
    </Button>
  )
}
```

防暴力破解另一种常见的方式是点击验证与拖拽验证，在用户输入错误后弹出一个对话框，要求用户点击图片中的某些标记或将图中的滑块拖动到指定的位置，这种方式也常见于人机识别：

```javascript
// coding...
```

原本是想通过第三方插件实现，后发现目前网上开源的插件基本上都是前端校验，这样的实现既影响用户体验又达不到相对安全的级别，极易被程序破解，正在结合 node 与 js 进行 coding，稍后完成会放在总复习中讲解

### 完整代码

```javascript
import React, { Component } from 'react';
import { Form, Input, Button, Checkbox, message } from 'antd';
import { getRandomString } from '@/utils';
import Sapi from '@/utils/admin';
import { storageManage } from 'mkit-utils';

import './login.less';

// 验证码图片
const captchaBase = 'http://shop.fenotes.com/adminapi/captcha_pro';
// 设定账号规则为必须小写字母开头且只允许包含小写字母与数字，最短4位，最长16位
const accountReg = /^[a-z][a-z0-9]{3,15}$/;
// 8~16位字符，必须包含有至少1位数字，1位字母
const passwordReg = /(?=.*[0-9])(?=.*[A-z]).{8,16}/;
export default class Login extends Component {
  constructor() {
    super();
    this.state = {
      captcha: captchaBase,
      // 初始化状态
      initialValues: null,
      // 是否显示禁止登录按钮
      // 可登录时间
      disableLoginTime: 0,
    };
    // 判断是否有用户信息预留
    const userInfo = storageManage.get('remember');
    if (userInfo) {
      // 将获取到的用户信息写入初始状态
      this.state.initialValues = userInfo;
    }

    // 用户名或密码输入错误次数
    const accountFailedCount = storageManage.get('accountFailedCount');
    this.accountFailedCount = accountFailedCount || 0;
    // 判断当前用户是否可以进行登录操作
    const disableLoginTime = storageManage.get('disableLoginTime');
    const now = Date.now();
    if (disableLoginTime && now < disableLoginTime) {
      this.state.disableLoginTime = parseInt(
        (disableLoginTime - now) / 1000,
        10
      );
    }

    // 将修改验证码图片等函数的this对象绑定到当前组件实例上
    this.changeCaptch = this.changeCaptch.bind(this);
    this.onFinish = this.onFinish.bind(this);
    this.onFinishFailed = this.onFinishFailed.bind(this);
  }
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
  // 验证码切换
  changeCaptch() {
    this.setState({
      captcha: `${captchaBase}?_=${getRandomString(6)}`,
    });
  }
  onFinish(values) {
    // 提交数据到服务器
    Sapi.post('/adminapi/login', values)
      .then(res => {
        // 接口返回的数据包含状态码stateus、消息msg与数据data
        if (res.status !== 200) {
          // 抛出错误给catch
          return Promise.reject(res);
        }
        // 从data中取出需要用到的的数据
        const { token, expires_time, menus, unique_auth, user_info } = res.data;
        // 将数据缓存到本地
        storageManage.set('token', token, expires_time);
        storageManage.set('menus', menus);
        storageManage.set('auth', unique_auth);
        storageManage.set('userInfo', user_info);
        // 如果需要记住当前用户账号与密码信息
        if (values.remember) {
          storageManage.set('remember', values);
        }
      })
      .catch(error => {
        console.log(error);
        // 如果登录失败，这里需要自动切换验证码图片
        this.changeCaptch();
        // 提示用户错误信息
        message.error(error.msg);
        // 如果失败原因是账号或密码错误，需要增加错误计数
        const isAccountError =
          error.status === 400 && error.msg.includes('账号');
        if (isAccountError) {
          this.accountFailedCount += 1;
          // 为避免暴力破解采用每次刷新页面的方式，数据要缓存到本地
          storageManage.set(
            'accountFailedCount',
            this.accountFailedCount,
            1000 * 60 * 30
          );
        }
        // 如果失败次数大于3次，则禁用登录按钮
        if (this.accountFailedCount >= 3) {
          // 多长时间后允许登录
          const disableLoginTime = 10 * 60;
          this.setState({
            disableLoginTime,
          });
          // 禁用按钮的有效期
          const exp = Date.now() + disableLoginTime * 1000;
          storageManage.set('disableLoginTime', exp, exp);
        }
      });
  }
  onFinishFailed() {}
  handlerDisableTime() {
    // 1秒后改变禁用时间
    this.timer = setTimeout(() => {
      this.setState({
        disableLoginTime: this.state.disableLoginTime - 1,
      });
    }, 1000);
    // 返回需要显示的文本
    return `${Math.floor(this.state.disableLoginTime / 60)}分${
      this.state.disableLoginTime % 60
    }秒后重试登录`;
  }
  componentWillUnmount() {
    // 卸载时如果有计时器正在运行
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }
  render() {
    return (
      // 所有的页面容器都需要docwrap这个样式名，便于设定一些全局的页面样式
      // 每个页面都需要一个自己的样式名，便于设定自己私有的页面样式且用于区分样式作用域
      <div className="docwrap login">
        <div className="container">
          {/* 所有的样式名不应该包含大写，如果是多个单词线成，应使用“-”号来连接，不要用大写，也不要用下划线 */}
          <div className="form-wrap">
            <Form
              labelCol={{ span: 7 }}
              wrapperCol={{ span: 16 }}
              autoComplete="off"
              initialValues={this.state.initialValues}
              // 输入内容全部验证通过会调用这个方法
              onFinish={this.onFinish}
              // 有校验不通过的调用这个方法
              onFinishFailed={this.onFinishFailed}
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
                  <img
                    onClick={this.changeCaptch}
                    src={this.state.captcha}
                    alt="pictrue"
                  />
                </div>
              </Form.Item>
              <Form.Item>
                {this.state.disableLoginTime > 0 ? (
                  <Button type="primary" disabled block>
                    {this.handlerDisableTime()}
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
```
