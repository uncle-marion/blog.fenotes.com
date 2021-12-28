> Marion 前端教程 > 前端开发应知应会 > 第一部分 > storage 的管理

```javascript
import { stringify, parse } from 'qs';

// 方法未经调试，可能存在有大量问题，慎用
// 如果没有localStorage, 我们尝试使用cookie来实现localStorage的工作
class EmulatorStorage {
  setItem(key, value, expires) {}
  getItem(key) {
    return {};
  }
  removeItem(key) {}
}

// 管理类的实现
/**
 * 这个类的实现主要是为了解决storage管理起来比较麻烦的问题，将所有的状态都存在了
 * 同一个对象里，同时只写不读也减少了系统io的占用。
 * 另外，还解决了一个问题就是当用户开启隐私模式无法使用storage时，可以通过cookie
 * 缓存一些必要的用户数据
 * 第三个，是让storage能像cookie一样，有自己的有效期
 */
class Manage {
  cookie = new EmulatorStorage();
  // 如果当前客户端不支持storage, 使用cookie
  storage = this.hasStorage(window.localStorage)
    ? window.localStorage
    : this.cookie;
  // 如果当前客户端不支持session, 使用cookie
  session = this.hasStorage(window.sessionStorage)
    ? window.sessionStorage
    : this.cookie;
  /**
   * 判断是否可以使用storage
   */
  hasStorage(storage = window.localStorage) {
    // 因为有隐私模式，所以不只是要判断存在，还要判断写入后是否能读取
    if (storage) {
      storage.setItem('testManage', 'testManage');
      const result = storage.getItem('testManage') === 'testManage';
      storage.removeItem('testManage');
      return result;
    }
    return false;
  }
  /**
   * storage写入操作
   * @param key 初始化时定义的标记存储信息的名字
   * @param data 待存储的值
   */
  setStorage(key, data) {
    this.storage.setItem(key, stringify(data));
  }

  /**
   * getItem方法用的较少，仅在初始化时调用一次
   * @param key
   * @returns
   */
  getStorage(key) {
    const store = this.storage.getItem(key);
    return store ? parse(store) : { key };
  }

  removeItem(key) {
    this.storage.removeItem(key);
  }

  /**
   * session写入操作
   * @param key
   * @param data
   * @param expires
   */
  setSession(key, data) {
    this.session.setItem(key, stringify(data));
  }
  /**
   * getItem方法用的较少，仅在初始化时调用一次
   * @param key
   * @returns
   */
  getSession(key) {
    const store = this.session.getItem(key);
    return store ? parse(store) : { key };
  }

  /**
   * 有效期计算
   * @param expires
   * @returns
   */
  calcExpires(expires) {
    return Date.now() + expires * 24 * 3600 * 1000;
  }
}
// 实例化管理类
const manage = new Manage();

// 抛出的类
export default class StorageManage {
  constructor(key = 'baseData') {
    this.key = key;
    // 初始化当前的缓存
    // 所有的get操作只在这个对象上操作
    // set和remove会进行写入操作
    this.store = manage.getStorage(key);
    this.session = manage.getSession(key);
  }

  /**
   * storage 写入
   * @param args
   */
  setStorage(...args) {
    const [key, data, expires] = args;
    manage.setStorage(this.key, {
      // 保留其它状态，仅使用新传入的value覆盖现有的内容
      ...this.store,
      [key]: {
        data,
        // 如果有有效期设置，创建一个key存起来
        expires: expires ? manage.calcExpires(expires) : null,
      },
    });
  }

  /**
   * session 写入
   * @param args
   */
  setSession(...args) {
    const [key, data] = args;
    manage.setSession(this.key, {
      ...this.store,
      [key]: {
        ...data,
      },
    });
  }

  /**
   * storage 读取
   * @param key
   * @returns
   */
  getStorage(key) {
    const state = this.store[key];
    if (state) {
      // 如果没有有效期或有效期大于当前时间，返回当前数据
      if (!state.expires || state.expires > Date.now()) {
        return state.data;
      }
      // 清空当前key对应的内容
      else {
        this.remove(key);
        return null;
      }
    } else {
      return null;
    }
  }

  /**
   * session 读取
   * @param key
   * @returns
   */
  getSession(key) {
    const state = this.session[key];
    if (state) {
      return state.data;
    }
  }

  /**
   * 清空当前store
   */
  clear() {
    manage.removeItem(this.key);
  }

  /**
   * 清除指定的state
   * @param key
   */
  remove(key) {
    manage.removeItem(key);
  }
}
```
