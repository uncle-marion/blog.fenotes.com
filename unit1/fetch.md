> 平安蜀黍的前端教程 > 备选知识点 > Featch 源码解析

### 关于源码

这段代码来自于[https://github.com/github/fetch](https://github.com/github/fetch/blob/master/fetch.js)

因时间的关系，只对部分代码做了解析，部分非主线程代码希望你们自己能去理解并补充解析。

```javascript
// 寻找全局对象
var global =
  (typeof globalThis !== 'undefined' && globalThis) ||
  // 浏览器的window对象
  (typeof self !== 'undefined' && self) ||
  // nodejs的全局对象
  (typeof global !== 'undefined' && global) ||
  // 如果上面三个都没匹配到，则设定为一个空对象
  {};

// 一些功能的检测
var support = {
  // 检查当前环境是否有URLSearchParams方法用于处理queryString
  searchParams: 'URLSearchParams' in global,
  // 检查当前环境是否有Symbol方法以及Symbol是否支持iterator对象
  iterable: 'Symbol' in global && 'iterator' in Symbol,
  blob:
    'FileReader' in global &&
    'Blob' in global &&
    (function () {
      try {
        new Blob();
        return true;
      } catch (e) {
        return false;
      }
    })(),
  // 用于处理表单数据
  formData: 'FormData' in global,
  // 用于处理二进制存储
  arrayBuffer: 'ArrayBuffer' in global,
};

function isDataView(obj) {
  return obj && DataView.prototype.isPrototypeOf(obj);
}

// 支持的 ArrayBuffer类型
if (support.arrayBuffer) {
  var viewClasses = [
    '[object Int8Array]',
    '[object Uint8Array]',
    '[object Uint8ClampedArray]',
    '[object Int16Array]',
    '[object Uint16Array]',
    '[object Int32Array]',
    '[object Uint32Array]',
    '[object Float32Array]',
    '[object Float64Array]',
  ];
  // 检查是不是DataView，DataView是来读写ArrayBuffer的。
  var isArrayBufferView =
    ArrayBuffer.isView ||
    function (obj) {
      return (
        obj && viewClasses.indexOf(Object.prototype.toString.call(obj)) > -1
      );
    };
}

// Headers中调用的方法，如果name不是字符串，强制转成字符串同时将所有大写转成小写
function normalizeName(name) {
  // 不是字符串，转为字符串
  if (typeof name !== 'string') {
    name = String(name);
  }
  // 不是以a-z 0-9 等开头的抛出错误。
  if (/[^a-z0-9\-#$%&'*+.^_`|~!]/i.test(name) || name === '') {
    // 抛出类型错误
    throw new TypeError(
      'Invalid character in header field name: "' + name + '"'
    );
  }
  // 转为小写
  return name.toLowerCase();
}

// Headers中调用的方法，如果value不是字符串，强制转成字符串
function normalizeValue(value) {
  if (typeof value !== 'string') {
    value = String(value);
  }
  return value;
}

// 构建一个迭代器
function iteratorFor(items) {
  var iterator = {
    next: function () {
      var value = items.shift();
      return { done: value === undefined, value: value };
    },
  };

  if (support.iterable) {
    iterator[Symbol.iterator] = function () {
      return iterator;
    };
  }

  return iterator;
}

/**
 * Headers 构造函数（ES5中的用于构造实例的方法）
 * 对于构造器不熟悉的同学可以在后面的ES基础中学习到，js中的继承离不开构造函数
 */
export function Headers(headers) {
  // 创建一个map用于存储所有headers
  this.map = {};

  // 如果已经是Headers的实例
  if (headers instanceof Headers) {
    // 调用Headers原型上的forEach方法，遍历this.map对象，创建或更新this.map对象中的属性
    headers.forEach(function (value, name) {
      this.append(name, value);
    }, this);
  }
  // 如果传入的headers是一个二维数组
  else if (Array.isArray(headers)) {
    // 复制或更新属性
    headers.forEach(function (header) {
      this.append(header[0], header[1]);
    }, this);
  }
  // 如果headers是一个对象
  else if (headers) {
    // 取出它所有的key后遍历并复制属性
    // Object.getOwnPropertyNames()方法返回一个由指定对象的所有自身属性的属性名（包括不可枚举属性
    // 但不包括Symbol 值作为名称的属性）组成的数组
    Object.getOwnPropertyNames(headers).forEach(function (name) {
      this.append(name, headers[name]);
    }, this);
  }
}

// 为构造器添加原型方法
// 上面用到的，复制属性的方法
Headers.prototype.append = function (name, value) {
  // 前面定义的，用于将key和value强制转换成字符串的方法
  name = normalizeName(name);
  value = normalizeValue(value);
  var oldValue = this.map[name];
  // 如果已经有这个属性，将值加入到原有的值的后面，如果没有就直接写入
  this.map[name] = oldValue ? oldValue + ', ' + value : value;
};

// 用于从当前headers中移除指定属性的方法
Headers.prototype['delete'] = function (name) {
  delete this.map[normalizeName(name)];
};

// 获取Headers中指定属性的值
Headers.prototype.get = function (name) {
  name = normalizeName(name);
  return this.has(name) ? this.map[name] : null;
};

// 判断Headers中是否有对应的属性
Headers.prototype.has = function (name) {
  // hasOwnProperty() 方法会返回一个布尔值，表示对象自身属性中是否具有指定的属性
  return this.map.hasOwnProperty(normalizeName(name));
};

// 写入新的属性到Headers中
Headers.prototype.set = function (name, value) {
  this.map[normalizeName(name)] = normalizeValue(value);
};

// 自定义了一个遍历的方法
Headers.prototype.forEach = function (callback, thisArg) {
  for (var name in this.map) {
    // 如果能从map里找到对应的属性
    if (this.map.hasOwnProperty(name)) {
      // 使用回调函数去call, thisArg在这里是调用时传入的this对象
      callback.call(thisArg, this.map[name], name, this);
    }
  }
};

// 获取Headers中所有的属性名称
Headers.prototype.keys = function () {
  var items = [];
  this.forEach(function (value, name) {
    items.push(name);
  });
  return iteratorFor(items);
};

// 获取Headers中所有的属性的值
Headers.prototype.values = function () {
  var items = [];
  this.forEach(function (value) {
    items.push(value);
  });
  return iteratorFor(items);
};

// 将Headers中的所有属性与对应的值转换成一个Set格式的数组
Headers.prototype.entries = function () {
  var items = [];
  this.forEach(function (value, name) {
    items.push([name, value]);
  });
  return iteratorFor(items);
};

if (support.iterable) {
  Headers.prototype[Symbol.iterator] = Headers.prototype.entries;
}

//

function consumed(body) {
  if (body.bodyUsed) {
    return Promise.reject(new TypeError('Already read'));
  }
  body.bodyUsed = true;
}

// 文件读取完成的处理函数
function fileReaderReady(reader) {
  return new Promise(function (resolve, reject) {
    reader.onload = function () {
      resolve(reader.result);
    };
    reader.onerror = function () {
      reject(reader.error);
    };
  });
}

// 将blob转换为为ArrayBuffer对象
function readBlobAsArrayBuffer(blob) {
  var reader = new FileReader();
  var promise = fileReaderReady(reader);
  reader.readAsArrayBuffer(blob);
  return promise;
}

// 将blob转换为文本
function readBlobAsText(blob) {
  var reader = new FileReader();
  var promise = fileReaderReady(reader);
  reader.readAsText(blob);
  return promise;
}

function readArrayBufferAsText(buf) {
  var view = new Uint8Array(buf);
  var chars = new Array(view.length);

  for (var i = 0; i < view.length; i++) {
    chars[i] = String.fromCharCode(view[i]);
  }
  return chars.join('');
}

// 克隆ArrayBuffer
function bufferClone(buf) {
  // 如果buf支持slice方法
  if (buf.slice) {
    // 直接返回buf集合中的第一位
    return buf.slice(0);
  }
  // 否则以填充模式复制
  else {
    var view = new Uint8Array(buf.byteLength);
    view.set(new Uint8Array(buf));
    return view.buffer;
  }
}

function Body() {
  this.bodyUsed = false;

  this._initBody = function (body) {
    /*
      fetch-mock将Response对象包装在ES6代理中，以提供有用的测试工具特性，如flush。 但是，在没有获取或代理的ES5浏览器上，必须使用poll填充支持; 除非在创建代理之前，对象上存在代理属性，否则代理poll填充无法代理该属性。 这个更改确保了Response。 bodyUsed存在于实例中，同时保持设置Request的语义。 body在调用_initBody之前在构造函数中使用。
    */
    this.bodyUsed = this.bodyUsed;
    this._bodyInit = body;
    if (!body) {
      this._bodyText = '';
    } else if (typeof body === 'string') {
      this._bodyText = body;
    } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
      this._bodyBlob = body;
    } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
      this._bodyFormData = body;
    } else if (
      support.searchParams &&
      URLSearchParams.prototype.isPrototypeOf(body)
    ) {
      this._bodyText = body.toString();
    } else if (support.arrayBuffer && support.blob && isDataView(body)) {
      this._bodyArrayBuffer = bufferClone(body.buffer);
      // IE 10-11 can't handle a DataView body.
      this._bodyInit = new Blob([this._bodyArrayBuffer]);
    } else if (
      support.arrayBuffer &&
      (ArrayBuffer.prototype.isPrototypeOf(body) || isArrayBufferView(body))
    ) {
      this._bodyArrayBuffer = bufferClone(body);
    } else {
      this._bodyText = body = Object.prototype.toString.call(body);
    }

    if (!this.headers.get('content-type')) {
      if (typeof body === 'string') {
        this.headers.set('content-type', 'text/plain;charset=UTF-8');
      } else if (this._bodyBlob && this._bodyBlob.type) {
        this.headers.set('content-type', this._bodyBlob.type);
      } else if (
        support.searchParams &&
        URLSearchParams.prototype.isPrototypeOf(body)
      ) {
        this.headers.set(
          'content-type',
          'application/x-www-form-urlencoded;charset=UTF-8'
        );
      }
    }
  };

  if (support.blob) {
    this.blob = function () {
      var rejected = consumed(this);
      if (rejected) {
        return rejected;
      }

      if (this._bodyBlob) {
        return Promise.resolve(this._bodyBlob);
      } else if (this._bodyArrayBuffer) {
        return Promise.resolve(new Blob([this._bodyArrayBuffer]));
      } else if (this._bodyFormData) {
        throw new Error('could not read FormData body as blob');
      } else {
        return Promise.resolve(new Blob([this._bodyText]));
      }
    };

    this.arrayBuffer = function () {
      if (this._bodyArrayBuffer) {
        var isConsumed = consumed(this);
        if (isConsumed) {
          return isConsumed;
        }
        if (ArrayBuffer.isView(this._bodyArrayBuffer)) {
          return Promise.resolve(
            this._bodyArrayBuffer.buffer.slice(
              this._bodyArrayBuffer.byteOffset,
              this._bodyArrayBuffer.byteOffset +
                this._bodyArrayBuffer.byteLength
            )
          );
        } else {
          return Promise.resolve(this._bodyArrayBuffer);
        }
      } else {
        return this.blob().then(readBlobAsArrayBuffer);
      }
    };
  }

  this.text = function () {
    var rejected = consumed(this);
    if (rejected) {
      return rejected;
    }

    if (this._bodyBlob) {
      return readBlobAsText(this._bodyBlob);
    } else if (this._bodyArrayBuffer) {
      return Promise.resolve(readArrayBufferAsText(this._bodyArrayBuffer));
    } else if (this._bodyFormData) {
      throw new Error('could not read FormData body as text');
    } else {
      return Promise.resolve(this._bodyText);
    }
  };

  if (support.formData) {
    this.formData = function () {
      return this.text().then(decode);
    };
  }

  this.json = function () {
    return this.text().then(JSON.parse);
  };

  return this;
}

// HTTP methods whose capitalization should be normalized
var methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT'];

function normalizeMethod(method) {
  var upcased = method.toUpperCase();
  return methods.indexOf(upcased) > -1 ? upcased : method;
}

/**
 * ajax request实现类
 */
export function Request(input, options) {
  if (!(this instanceof Request)) {
    throw new TypeError(
      'Please use the "new" operator, this DOM object constructor cannot be called as a function.'
    );
  }

  options = options || {};
  var body = options.body;

  // 如果input已经是一个Request类的实例
  if (input instanceof Request) {
    if (input.bodyUsed) {
      throw new TypeError('Already read');
    }
    this.url = input.url;
    this.credentials = input.credentials;
    // 如如传入的配置参数中存在headers，实例化它们并
    if (!options.headers) {
      this.headers = new Headers(input.headers);
    }
    this.method = input.method;
    this.mode = input.mode;
    this.signal = input.signal;
    if (!body && input._bodyInit != null) {
      body = input._bodyInit;
      input.bodyUsed = true;
    }
  }
  // 如果不是就将input转换成url字符串
  else {
    this.url = String(input);
  }

  this.credentials = options.credentials || this.credentials || 'same-origin';
  // 生成headers
  if (options.headers || !this.headers) {
    this.headers = new Headers(options.headers);
  }
  // 请求的类型，如果没有默认为get
  this.method = normalizeMethod(options.method || this.method || 'GET');
  this.mode = options.mode || this.mode || null;

  // 取消请求的方法
  this.signal =
    options.signal ||
    this.signal ||
    (function () {
      if ('AbortController' in global) {
        var ctrl = new AbortController();
        return ctrl.signal;
      }
    })();
  this.referrer = null;

  // Get方法和Head方法不允许有body
  if ((this.method === 'GET' || this.method === 'HEAD') && body) {
    throw new TypeError('Body not allowed for GET or HEAD requests');
  }
  this._initBody(body);

  if (this.method === 'GET' || this.method === 'HEAD') {
    if (options.cache === 'no-store' || options.cache === 'no-cache') {
      // Search for a '_' parameter in the query string
      var reParamSearch = /([?&])_=[^&]*/;
      if (reParamSearch.test(this.url)) {
        // If it already exists then set the value with the current time
        this.url = this.url.replace(
          reParamSearch,
          '$1_=' + new Date().getTime()
        );
      } else {
        // Otherwise add a new '_' parameter to the end with the current time
        var reQueryString = /\?/;
        this.url +=
          (reQueryString.test(this.url) ? '&' : '?') +
          '_=' +
          new Date().getTime();
      }
    }
  }
}

Request.prototype.clone = function () {
  return new Request(this, { body: this._bodyInit });
};

// 将body属性序列化成formData
function decode(body) {
  var form = new FormData();
  body
    .trim()
    .split('&')
    .forEach(function (bytes) {
      if (bytes) {
        var split = bytes.split('=');
        var name = split.shift().replace(/\+/g, ' ');
        var value = split.join('=').replace(/\+/g, ' ');
        form.append(decodeURIComponent(name), decodeURIComponent(value));
      }
    });
  return form;
}

function parseHeaders(rawHeaders) {
  var headers = new Headers();
  // Replace instances of \r\n and \n followed by at least one space or horizontal tab with a space
  // https://tools.ietf.org/html/rfc7230#section-3.2
  var preProcessedHeaders = rawHeaders.replace(/\r?\n[\t ]+/g, ' ');
  // Avoiding split via regex to work around a common IE11 bug with the core-js 3.6.0 regex polyfill
  // https://github.com/github/fetch/issues/748
  // https://github.com/zloirock/core-js/issues/751
  preProcessedHeaders
    .split('\r')
    .map(function (header) {
      return header.indexOf('\n') === 0
        ? header.substr(1, header.length)
        : header;
    })
    .forEach(function (line) {
      var parts = line.split(':');
      var key = parts.shift().trim();
      if (key) {
        var value = parts.join(':').trim();
        headers.append(key, value);
      }
    });
  return headers;
}

Body.call(Request.prototype);

/**
 * Response类，用于将接口返回的数据封装成合乎标准的统一格式的json对象
 */
export function Response(bodyInit, options) {
  if (!(this instanceof Response)) {
    throw new TypeError(
      'Please use the "new" operator, this DOM object constructor cannot be called as a function.'
    );
  }
  if (!options) {
    options = {};
  }

  this.type = 'default';
  this.status = options.status === undefined ? 200 : options.status;
  this.ok = this.status >= 200 && this.status < 300;
  this.statusText =
    options.statusText === undefined ? '' : '' + options.statusText;
  this.headers = new Headers(options.headers);
  this.url = options.url || '';
  this._initBody(bodyInit);
}

Body.call(Response.prototype);

Response.prototype.clone = function () {
  return new Response(this._bodyInit, {
    status: this.status,
    statusText: this.statusText,
    headers: new Headers(this.headers),
    url: this.url,
  });
};

Response.error = function () {
  var response = new Response(null, { status: 0, statusText: '' });
  response.type = 'error';
  return response;
};

var redirectStatuses = [301, 302, 303, 307, 308];

Response.redirect = function (url, status) {
  if (redirectStatuses.indexOf(status) === -1) {
    throw new RangeError('Invalid status code');
  }

  return new Response(null, { status: status, headers: { location: url } });
};

export var DOMException = global.DOMException;
try {
  new DOMException();
} catch (err) {
  DOMException = function (message, name) {
    this.message = message;
    this.name = name;
    var error = Error(message);
    this.stack = error.stack;
  };
  DOMException.prototype = Object.create(Error.prototype);
  DOMException.prototype.constructor = DOMException;
}

/**
 * fetch主文件 我们在外面调用的就是它
 * fetch(url, options)
 */
export function fetch(input, init) {
  // 返回一个Promise对象
  return new Promise(function (resolve, reject) {
    // 构建一个Request实例以获取各种配置项
    var request = new Request(input, init);

    // 如果请求已经被取消
    if (request.signal && request.signal.aborted) {
      return reject(new DOMException('Aborted', 'AbortError'));
    }

    // 使用xmlhttprequest
    var xhr = new XMLHttpRequest();

    // xhr的取消方法
    function abortXhr() {
      xhr.abort();
    }

    // 先绑定各种事件
    xhr.onload = function () {
      var options = {
        status: xhr.status,
        statusText: xhr.statusText,
        headers: parseHeaders(xhr.getAllResponseHeaders() || ''),
      };
      options.url =
        'responseURL' in xhr
          ? xhr.responseURL
          : options.headers.get('X-Request-URL');
      var body = 'response' in xhr ? xhr.response : xhr.responseText;
      // 将操作放入到异步队列中避免造成阻塞
      // setTimeout最大的好处就是不会影响当前进程和已进入队列里的函数，它的意思是一旦主调用栈空闲就立刻执行
      setTimeout(function () {
        // 通过response来返回统一格式的数据
        resolve(new Response(body, options));
      }, 0);
    };

    xhr.onerror = function () {
      setTimeout(function () {
        reject(new TypeError('Network request failed'));
      }, 0);
    };

    xhr.ontimeout = function () {
      setTimeout(function () {
        reject(new TypeError('Network request failed'));
      }, 0);
    };

    xhr.onabort = function () {
      setTimeout(function () {
        reject(new DOMException('Aborted', 'AbortError'));
      }, 0);
    };

    function fixUrl(url) {
      try {
        return url === '' && global.location.href ? global.location.href : url;
      } catch (e) {
        return url;
      }
    }
    // 最后再激活它
    xhr.open(request.method, fixUrl(request.url), true);

    if (request.credentials === 'include') {
      xhr.withCredentials = true;
    } else if (request.credentials === 'omit') {
      xhr.withCredentials = false;
    }

    if ('responseType' in xhr) {
      if (support.blob) {
        xhr.responseType = 'blob';
      } else if (
        support.arrayBuffer &&
        request.headers.get('Content-Type') &&
        request.headers
          .get('Content-Type')
          .indexOf('application/octet-stream') !== -1
      ) {
        xhr.responseType = 'arraybuffer';
      }
    }

    if (
      init &&
      typeof init.headers === 'object' &&
      !(init.headers instanceof Headers)
    ) {
      Object.getOwnPropertyNames(init.headers).forEach(function (name) {
        xhr.setRequestHeader(name, normalizeValue(init.headers[name]));
      });
    } else {
      request.headers.forEach(function (value, name) {
        xhr.setRequestHeader(name, value);
      });
    }

    if (request.signal) {
      request.signal.addEventListener('abort', abortXhr);

      xhr.onreadystatechange = function () {
        // DONE (success or failure)
        if (xhr.readyState === 4) {
          request.signal.removeEventListener('abort', abortXhr);
        }
      };
    }
    // 建立起连接后发送数据到服务器
    xhr.send(
      typeof request._bodyInit === 'undefined' ? null : request._bodyInit
    );
  });
}

fetch.polyfill = true;

// 如果全局对象下没有fetch
if (!global.fetch) {
  global.fetch = fetch;
  global.Headers = Headers;
  global.Request = Request;
  global.Response = Response;
}
```
