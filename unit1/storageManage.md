> 平安蜀黍的前端教程 > 备选知识点 > Storage 管理工具

在平常的工作中，我们常常会需要在本地管理一些数据，这些数据或是存储在 storage 中，或是存储在 cookie 中，为了避免占用 cookie 太多导致服务器无法正确读取/写入数据，大多数时候我们都是存储在 storage 中的，但 html5 所提供的 cookie 接口或 storage 接口都只能接受字符串类型作为它的值，而我们需要存储的这些值又大多都是对象类型，这其间便不可避免地需要使用各种对象字符串操作工具，为了避免代码冗余及个性化，我们有必要规范一下 storage 的管理工具：

#### 判断当前客户端是否支持 storage

一般情况下，大多数客户端都是支持 storage 的，但在有些移动端浏览器上，或是厂商的深度定制，或是用户开启了隐私模式，常常会导致我们无法正常使用 storage，这种情况下怎么处理呢？我们需要先判断客户端是否可以正常使用 storage：

```javascript
function checkStorage() {
  // 全局状态下是否有storage这个属性
  const storage = window.localStorage;

  if (!storage) return false;

  // 使用try catch来进一步判断storage是否可用
  try {
    const val = Math.random().toString(36);
    storage.setItem('checkStorage', val);
    const value = storage.getItem('checkStorage');
    storage.removeItem('checkStorage');
    return val === value;
  } catch (err) {
    return false;
  }
}
```

对于不能正常使用 storage 的，我们要对数据存储做一个降级处理，将数据存储到 cookie 中去：

```javascript
let storage = checkStorage() ? storage工具 : cookie工具;
```

#### cookie 管理工具的实现

一般来说，我们操作 storage 有 setItem 方法、getItem 方法及 removeItem 方法及 clear 方法，而 cookie 是没有这些方法的，为了统一接口，我们需要定义一个对象或类去管理这些方法，先简单地实现 setItem 与 getItem：

```javascript
// 使用cookie来模仿storage
const cookies = {
  /**
   * 写入cookie
   */
  setItem(name, value) {
    const dataStr = `${name}=${value}; expires=${new Date(
      Date.now() + defaultExpiryTime
    ).toUTCString()}`;
    document.cookie = dataStr;
  },

  /**
   * 从cookie中取出
   */
  getItem() {
    // 取出cookie数据并将它转成一个数组
    const cookies = document.cookie.split(';');
    // 使用reduce方法将数组转换成对象后返回
    return cookies.reduce((prev, curr) => {
      const [key, value] = curr.split('=');
      prev[key] = value;
      return prev;
    }, {})['dataRoot'];
  },
};
```

#### 自定义数据管理

统一了 cookie 与 storage 的接口名称后，我们还需要自定义一个对象或类来管理我们的数据：

在这里，我们需要做一些思考：

1. 对于 storage，是每个数据都分开存储还是将所有数据存储在同一个 key 下更优雅更有效率？

2. 对于数据的变化，我们是否需要跟踪监听？

3. cookie 数据有过期时间，而 storage 中并没有，我们有必要去支持有效期吗？

```javascript
/**
 * storage 管理类
 */
class StorageManage {
  baseData = {};

  /**
   * 写入管理
   * @param name key 需要保存的属性
   * @param data data 需要保存的数据，不接受方法、正则等非正常数据类型
   * @param expiryTime timeSteamp 时间戳，数据到期时间，以秒为单位，如未传则该数据会保存约三年时间
   */
  set(name, data, expiryTime = defaultExpiryTime) {
    /**
     * 计算数据失效时间
     * @param expiryTime
     * @returns
     */
    function getExpiryTime(expiryTime, name) {
      const now = Date.now();

      // 有效期大于当前时间，直接返回
      if (expiryTime > now) {
        return expiryTime;
      }

      // 未传入有效期，返回900天后的当前时间（有效期约三年）
      if (!expiryTime) {
        return now + 900 * 24 * 60 * 60 * 1000;
      }

      // 传入有效期，但有效期是秒数，转成毫秒
      if (expiryTime > 1e10 && expiryTime < now) {
        return expiryTime * 1000;
      }

      // 传入了有效期，但有效期不符合规则，数据在关闭窗口后直接失效
      return now;
    }
    // 将状态写入状态集
    this.baseData[name] = {
      // 增加一个有效期处理
      expiryTime: getExpiryTime(expiryTime, name),
      val: data,
    };
    // 调用命令将数据写入缓存中
    storage.setItem(name, this.baseData[name]);
  }
  /**
   * 读取管理
   * @param name
   * @returns
   */
  get(name) {
    /**
     * 校验数据有效性
     * @param expiryTime
     * @returns
     */
    function dataValidate(expiryTime) {
      return Date.now() < expiryTime;
    }
    // 从状态集中获取对应属性的值
    const data = this.baseData[name];
    // 从上面的set来看，我们的data还不能直接使用，需要经过有效期判断后才可以正常使用
    return dataValidate(data?.expiryTime) ? data.val : undefined;
  }

  /**
   * 移除指定的数据
   */
  remove(name) {
    // Reflect是Es6新增API，提供了大量的对象操作方法，特别是将以前的一些操作符功能比如in、delete等转换成了函数方式
    // 关于Reflect，我们会在稍后的第五单元课程中细讲，这里知道怎么用就行。有时间的同学也可以看下MDN上关于这块的一些解释
    // https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Reflect
    // 使用Reflect.deleteProperty方法来将对应的值从storage对象中移除
    const result = Reflect.deleteProperty(this.baseData, name);
    // 删除成功
    if (result) {
      // 更新storage中的内容
      storage.removeItem(name);
      return result;
    }
    // 失败则直接返回
    return false;
  }
}
```

### 完整代码

下面是加入了数据监听的完整代码，因为缺少使用场景，部分程序或许不够完善，你们在用的时候可以自己完善一下：

```javascript
/**
 * auth: marion.lau
 * mail: marion.lau.z@gmail.com
 * lastChange: 2021/12/28 10:20
 */
const dataBase = {
  version: '1.0.0',
  auth: 'marion.lau',
  mail: 'marion.lau.z@gmail.com',
  root: {},
};

const hourToMS = 60 * 60 * 1000;

const defaultExpiryTime = 24 * 1000 * hourToMS;

// 使用cookie来模仿storage
const cookies = {
  /**
   * 写入cookie
   */
  setItem(name, value) {
    const dataStr = `${name}=${value}; expires=${new Date(
      Date.now() + defaultExpiryTime
    ).toUTCString()}`;
    document.cookie = dataStr;
  },

  /**
   * 从cookie中取出
   */
  getItem() {
    const cookies = document.cookie.split(';');
    return cookies.reduce((prev, curr) => {
      const [key, value] = curr.split('=');
      prev[key] = value;
      return prev;
    }, {})['dataRoot'];
  },
};

/**
 * 检查当前环境是否支持storage
 */
function checkStorage() {
  const storage = window.localStorage;

  if (!storage) return false;

  try {
    const val = Math.random().toString(36);
    storage.setItem('checkStorage', val);
    const value = storage.getItem('checkStorage');
    storage.removeItem('checkStorage');
    return val === value;
  } catch (err) {
    return false;
  }
}
// 如果不支持store就使用cookie
let storage = checkStorage() ? window.localStorage : cookies;

/**
 * 将用户数据写入缓存，
 */
function setStorage() {
  const dataStr = encodeURIComponent(JSON.stringify(dataBase));
  storage.setItem('dataRoot', dataStr);
}

/**
 * 从缓存中读取数据
 */
function getStorage() {
  const dataBase = storage.getItem('dataRoot');
  return dataBase ? JSON.parse(decodeURIComponent(dataBase)).root : {};
}

/**
 * 计算数据失效时间
 * @param expiryTime
 * @returns
 */
function getExpiryTime(expiryTime, name) {
  const now = Date.now();

  // 有效期大于当前时间，直接返回
  if (expiryTime > now) {
    return expiryTime;
  }

  // 未传入有效期，返回900天后的当前时间（有效期约三年）
  if (!expiryTime) {
    return now + 900 * 24 * 60 * 60 * 1000;
  }

  // 传入有效期，但有效期是秒数，转成毫秒
  if (expiryTime > 1e10 && expiryTime < now) {
    return expiryTime * 1000;
  }

  // 传入了有效期，但有效期不符合规则，数据在关闭窗口后直接失效
  return now;
}

/**
 * 校验数据有效性
 * @param expiryTime
 * @returns
 */
function dataValidate(expiryTime) {
  return Date.now() < expiryTime;
}

/**
 * 复制数据
 * @param data
 * @returns
 */
function cloneData(data) {
  return typeof data === 'object' ? JSON.parse(JSON.stringify(data)) : data;
}

/**
 * storage 管理类
 */
class StorageManage {
  constructor() {
    this.listenerCalls = {};
    dataBase.root = getStorage();
  }

  /**
   * 写入管理
   * @param name key 需要保存的属性
   * @param data data 需要保存的数据，不接受方法、正则等非正常数据类型
   * @param expiryTime timeSteamp 时间戳，数据到期时间，以秒为单位，如未传则该数据会保存约三年时间
   */
  set(name, data, expiryTime = defaultExpiryTime) {
    // 将状态加入到全局对象
    dataBase.root[name] = {
      expiryTime: getExpiryTime(expiryTime, name),
      val: data,
    };
    // 调用命令将数据写入缓存中
    setStorage();
    // 检查是否有对应的监听程序，如果有，调用监听程序
    const listenerCall = this.listenerCalls[name];
    if (listenerCall) {
      listenerCall.map(item => {
        return item(data);
      });
    }
    return true;
  }
  /**
   * 读取管理
   * @param name
   * @returns
   */
  get(name) {
    const data = dataBase.root[name];
    // 避免数据中存在引用类型导致全局变量中的状态发生变化
    return dataValidate(data?.expiryTime) ? cloneData(data.val) : undefined;
  }

  /**
   * 移除指定的数据
   */
  remove(name) {
    const result = Reflect.deleteProperty(dataBase.root, name);
    if (result) {
      setStorage();
      return true;
    }
    return false;
  }

  /**
   * 清除所有的数据
   */
  clear() {
    dataBase.root = {};
    setStorage();
    return true;
  }

  /**
   * 监听storage的变化并通知订阅者
   * @param callback
   */
  listener(name, callback) {
    // 判断是否已经存在对指定字段的监听
    const hasCallback = Reflect.has(this.listenerCalls, name);
    // 有就push，没有则写入
    if (hasCallback) {
      this.listenerCalls[name].push(callback);
    } else {
      this.listenerCalls[name] = [callback];
    }
  }
}

export default new StorageManage();
```
