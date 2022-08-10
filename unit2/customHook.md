> Marion 的 react 实战课程 > 第二单元 React 基础与关联知识 > 自定义 hook

#### React Hooks 中的核心 API 使用注意事项

在前面的课程中我们把 react hook 中的 Api 基本上都过了一遍，也基本上了解哪些 Api 是常用的，哪些是在特殊需求下使用的：
我个人认为在正常业务开发中常用的有 useState, useEffect, useCallback, useMemo, useRef 这 5 个，无论你的组件是简单还是复杂，你需要使用 useState 来修改内部状态，使用 useEffect 来调用或修改外部状态，使用 useCallback 和 useMemo 来存储函数或变量，使用 useRef 来获取渲染完成后的 Dom 节点或者存储 state。

另外，像 useContext, useReducer, createContext 这些相对于前面的 5 个 Api 来说，使用频率就要少很多了，但不可避免的我们在一些复杂组件中也会用到。所以也需要了解

最后就是两个应该是用不着的：比如 useImperativeHandle，useDebugValue；前者一般是用于高阶组件中，后者的功能几乎没什么用处。

#### React 核心 Hook 的简单描述

- useState
  > 用于在函数组件中声明状态
  > 该方法接收一个初始值，返回一个数组，成员一是定义的状态，成员二是修改状态的方法；
  > 该方法与 this.setState 有一些区别：无法自动合并对象，只能覆盖；无法实时获取新赋予的状态；
- useEffect
  > 用于调用 api 或修改其它状态的副作用操作
  > 该方法接收一个必填参数：副作用的方法；一个可选参数：依赖的状态数组，当该可选参数不存在时，此方法会在函数组件每一次执行时被调用
  > 该方法使用方式与类组件中的生命周期函数类似，不同的我们可以通过定义它的依赖数组成员来设定它的执行方式；
- useRef
  > 用于定义一个返回固定对象的方法
  > useRef 在函数组件每次渲染时都会返回同一个 ref 对象，我们可以利用这个方法来保存一些变量或元素节点来提供给组件中其它生命周期函数使用
- useContext
  > 用于接收一个 context 对象并返回该 context 的当前值
  > 该方法可以简化 context consumer 组件的写法，定义后可以像使用普通状态一样使用 context provider 中创建的 value 内容
- memo
  > 一个应用于函数组件的类 PureComponent 的高阶函数
  > 该方法接收一个必填参数：需要优化的函数组件，当父组件 state 发生变化时进行一个浅比较来判断是否需要重新渲染组件；一个可选参数：该参数是一个方法，可以通过比较参数的属性来判断是否需要渲染组件
  > 该方法用于解决函数组件因为没有 shouldComponentUpdate 方法导致的子组件反复渲染的问题
- useMemo
  > 用于储存一个变量，避免每次渲染组件时都会重新计算
  > 该方法接收一个必填参数：返回一个变量的函数，当依赖参数变化时执行该方法并返回一个新的变量；一个可选参数，依赖的状态数组，作用与 useEffect 方法的依赖数组一致
  > 该方法主要用于优化子组件的反复渲染问题，也会用于缓存某些需要大量计算资源的变量定义上
- useCallback
  > 用于储存一个方法，避免每次渲染组件时都会重新定义
  > 该方法接收一个必填参数：一个回调函数，当依赖参数变化时返回一个新的函数；一个可选参数，依赖的状态数组，作用与 useEffect 方法的依赖数组一致
  > 该方法主要用于优化子组件的反复渲染问题
- useReducer
  > 与 redux 中的 reducer 差不多，它是一个纯函数，接收当前组件的 state 和一个用于描述操作目的的 action，通过 reducer 方法计算后返回一个新的 state

#### 自定义 hook

先看一段代码：

```javascript
function usePrevCount(val) {
  const ref = useRef();
  useEffect(() => {
    ref.current = val;
  });
  return ref.current;
}
function Counter() {
  const [count, setCount] = useState(0);
  const prevCount = usePrevCount(count);
  return (
    <>
      <h1>
        新的：{count}; 旧的：{prevCount}
      </h1>
      <button onClick={() => setCount(count => count + 1)}>加个数</button>
    </>
  );
}
```

上面的这段代码我们是不是有点熟悉？对的，就是我们前一节课程里学习 useRef 时使用的一段代码：

```javascript
function Counter() {
  const [count, setCount] = useState(0);
  const prevCountRef = useRef();
  useEffect(() => {
    prevCountRef.current = count;
  });
  const prevCount = prevCountRef.current;

  return (
    <>
      <h1>
        新的：{count}; 旧的：{prevCount}
      </h1>
      <button onClick={() => setCount(count => count + 1)}>加个数</button>
    </>
  );
}
```

我们只是将其中的计算功能抽取成了一个自定义 hook。从上面的代码中可以很明显地看到，我们的代码现在逻辑变得更清晰，表现与业务完全分离开来，组件中用于计算的代码被抽取成了一个独立的函数，最关键的是这个函数可以在任何地方被复用；

```javascript
import React, { useRef, useState, useEffect } from 'react';
function usePrevCount(val) {
  const ref = useRef();
  useEffect(() => {
    ref.current = val;
  });
  return ref.current;
}
export default function Counter() {
  const [count, setCount] = useState(0);
  const prevCount = usePrevCount(count);
  const [text, setText] = useState('abc');
  const prevText = usePrevCount(text);

  return (
    <>
      <h1>
        新的：{count}; 旧的：{prevCount}
      </h1>
      <button onClick={() => setCount(count => count + 1)}>加个数</button>
      <h1>
        新的：{text}; 旧的：{prevText}
      </h1>
      <button onClick={() => setText(text => text + 1)}>加个数</button>
    </>
  );
}
```

##### 自定义 hook 的更多用法

仍然是拿上面的增减数字来做一个例子，我们写一个 hook

```javascript
import React, {useState, useEffect} from 'react'
export default function Counter() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    prevCountRef.current = count;
  });
  const prevCount = prevCountRef.current;
  return (
    <h1>
      新的：{count}; 旧的：{prevCount}
    </h1>
    <button onClick={() => setCount(count => count + 1)}>加个数</button>
    <button onClick={() => setCount(count => count - 1)}>减个数</button>
  )
}
```

我们可以看到，上面这段代码有些问题，一是计算函数被多次重写，每一次渲染都是一次新的引用；而且它的计算功能夹杂在了表现代码中，这不是很符合我们平时说的表现与业务相分离的说法，所以我们需要改造一下：

```javascript
import React, { useState, useEffect, useRef, useCallback } from 'react';
// 用于计算的hook
function useCalcCount(initCount) {
  const [count, setCount] = useState(initCount);
  // 我们使用useCallback来解决第一个问题
  const add = useCallback(() => setCount(count => count + 1), []);
  const sub = useCallback(() => setCount(count => count - 1), []);
  return {
    count,
    add,
    sub,
  };
}
// 用于缓存的hook
function useCacheCount(val) {
  const ref = useRef();
  useEffect(() => {
    ref.current = val;
  });
  return ref.current;
}
export default function Counter() {
  const { count, add, sub } = useCalcCount(0);
  const prevCount = useCacheCount(count);
  return (
    <>
      <h1>
        新的：{count}; 旧的：{prevCount}
      </h1>
      <button onClick={add}>加个数</button>
      <button onClick={sub}>减个数</button>
    </>
  );
}
```

现在就干净了，我们的组件里引用了两个自定义 hook，所以，组件中没有任何的计算或者逻辑，它就是一个纯粹的展示，这符合表现与业务分离的定义；然后关键的是这两个自定义 hook 可以在其它地方复用！！

##### 小结一下，为什么要使用自定义 hook

从表面上看起来，我们的自定义 hook 函数与普通的组件函数基本一致，同样是使用了一些 react hook 的 api；如果是小型项目我们无所谓区分它们，可以随意地使用，但如果是大型项目且项目足够复杂的情况下，我们还是建议将它们拆分出来，让我们的**自定义 hooks 函数偏向于功能，而组件则偏向于 UI 和业务**。也就是实现所谓的表现与业务分离。同时，我们抽离出来的函数还可以大量地被复用在其它组件中。

##### 第一个正儿八经的自定义 hook，获取窗口的尺寸

上面的代码让我们理解了怎样自定义 hook，也知道了自定义 hook 的一些用法，那么接下来我们来自定义一个常用 hook:

```javascript
import React, { useState, useEffect, useCallback } from 'react';
// 以use开头定义一个函数来标识它是一个hook
function useWinSize() {
  // 使用useState来定义一个状态
  const [size, setSize] = useState({
    width: document.documentElement.clientWidth,
    height: document.documentElement.clientHeight,
  });
  // 使用useCallback来储存一个方法以避免生成新的函数句柄造成堆栈溢出
  const onResize = useCallback(() => {
    setSize({
      width: document.documentElement.clientWidth,
      height: document.documentElement.clientHeight,
    });
  }, []);
  // 使用useEffect来监听事件并在组件注销之前清除事件监听
  useEffect(() => {
    // window发生变化时改写size
    window.addEventListener('resize', onResize);
    return () => {
      // 清除事件监听
      window.removeEventListener('resize', onResize);
    };
  }, []);
  // 返回状态
  return size;
}

export default function TestHooks() {
  // 使用我们刚才创建的hook
  const size = useWinSize();
  return (
    <div>
      页面宽度:{size.width};页面高度:{size.height};
    </div>
  );
}
```

上面的代码中，我们实现了一个用于实时计算窗口大小的自定义 hook，让我们的组件中不再有大量的获取窗口大小的代码；

##### 异步获取数据的 hooks

```javascript
import React, { useEffect, useState } from 'react';
import { get } from 'axios';

const useList = pageNum => {
  const [list, setList] = useState([]);
  useEffect(() => {
    get('https://api.baxiaobu.com/index.php/home/v5/getuser')
      .then(res => {
        setList([...list, ...res.data.users]);
      })
      .catch(e => {
        console.error(e);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNum]);
  return {
    list,
    setList,
  };
};

export default function Home(props) {
  const { list } = useList(1);
  return (
    <div>
      {list ? (
        <ul>
          {list.map(item => (
            <li key={item.id}>{item.id}</li>
          ))}
        </ul>
      ) : (
        'loading'
      )}
    </div>
  );
}
```

##### 不使用 effect 也能获取 setState 后的值

在我们学习 class 组件的时候使用 this.setState 可以接受两个参数，第一个参数是新的 state 或是一个可以实时获取到新的 state 的函数，第二个参数是更新后的回调函数，我们可以在这个回调函数中取到最新的 state。

但是在 hook 组件中的 useState 不支持第二个参数回调了，而在某些场景下我们的组件中有太多的 state 需要监听，不愿意使用太多的 useEffect 来监听 state 的变化，我们想要像 this.setState 中一样来使用回调函数获取最新的 state，怎么办呢？下面我们就来实现一个获取最新 state 的自定义 hook:

```javascript
/**
 * 用于监听state变化的hook
 * @param {any} initState state的初始值
 */
function useXState(initState) {
  // 定义一个 useState 用于记录 state 和获得修改 state 的方法
  const [state, setState] = useState(initState);
  // 定义一个 ref 对象用于保存 callback 方法
  const isUpdate = useRef();
  // 定义一个函数，该函数用于接收调用时传入的 state 的值和用于监听 state 变化的回调，并在调用时通过第一步所获取的方法将参数一写入 state
  const setXState = (state, callback) => {
    setState(prev => {
      isUpdate.current = typeof callback === 'function' ? callback : null;
      return typeof state === 'function' ? state(prev) : state;
    });
  };
  // 定义一个副作用，在 state 变化完成后执行第三步的参数二，也就是用于监听 state 变化的回调函数
  useEffect(() => {
    if (isUpdate.current) {
      isUpdate.current(state);
    }
  }, [state]);
  // 参照useState的返回，将state与接收监听函数的方法以数组的方式返回
  return [state, setXState];
}
```

- 实现 hooks 中监听 state 实时变化的算法
  > 1. 定义一个 useState 用于记录 state 和获得修改 state 的方法
  > 2. 定义一个 ref 对象用于保存 callback 方法
  > 3. 定义一个函数，该函数用于接收调用时传入的 state 的值和用于监听 state 变化的回调，并在调用时通过第一步所获取的方法将参数一写入 state
  > 4. 定义一个副作用，在 state 变化完成后执行第三步的参数二，也就是用于监听 state 变化的回调函数
  > 5. 参照 useState 的返回，将 state 与接收监听函数的方法以数组的方式返回

##### 实现组件的强制更新

我们都知道，在 react 中，如果没有调用 setState 的话是无法更新组件的，但有时候却因为某些情况在没有更新 state 的情况下刷新组件，这个时候我们不能仅仅是为了让组件渲染而强制让一个 state 做无意义的更新。所以我们在这里就可以自定义一个专用的更新 hook 来优雅地实现组件的强制更新：

```javascript
import { useState } from 'react';

function useUpdate() {
  // 定义了一个状态，但这个状态我们其实用不上，我们只需要setState方法来调用渲染函数
  const [, setFlag] = useState();
  // 返回一个方法用来调用setState
  return () => {
    setFlag(Date.now());
  };
}
export default function Home() {
  const update = useUpdate();
  return (
    <div>
      {Date.now()}
      <button onClick={update}>aa</button>
    </div>
  );
}
```

##### 实现一个节流的 hook

节流的实现比较简单，它的意义在于我们可以控制高频触发的事件在同一个时间周期内发生的频率：

```javascript
/**
 * 一个简单的节流函数
 * @param {function} fun 需要执行的函数
 * @param {number} time 指定的时间周期长度（毫秒）
 */
function throttle(fun, time = 500) {
  let previous = 0;
  return function (...args) {
    // 当前时间
    let now = Date.now();
    // 上次执行时间到当前时间是否已经允许再次执行
    if (now - previous > time) {
      // 执行函数
      fun.apply(this, args);
      // 修改上次时间为当前时间
      previous = now;
    }
  };
}

/**
 * 然后再实现一个考虑比较周全的节流
 *
 * @param {function} func 需要执行的方法
 * @param {number} wait 时间周期
 * @param {object} options 配置项
 * @param {boolean} options.leading 第一次调用函数时是否需要执行
 * @param {boolean} options.trailing 最后一次调用函数时是否需要执行
 */
function throttle(
  func,
  wait = 500,
  options = { leading: false, trailing: false }
) {
  // 设立一个定时器，便于执行最后一次任务
  let timer;

  // 上一次执行回调的时间戳
  let previous = 0;

  function later(context, args) {
    // 当设置 { leading: false } 时，每次触发回调函数后设置 previous 为 0
    // 不然为当前时间
    previous = !options.leading ? 0 : Date.now();

    // 停止计时器并手动清空防止内存泄漏
    clearTimeout(timer);
    timer = null;

    // 执行函数
    func.apply(context, args);
  }

  // 每次触发事件回调都执行这个函数
  // 函数内判断是否执行 func
  // func 才是我们业务层代码想要执行的函数
  function throttled(...args) {
    // 记录当前时间
    let now = Date.now();

    // 第一次执行时
    // 并且设置了 { leading: false }（表示第一次回调不执行）
    // 此时设置 previous 为当前值，表示刚执行过，本次就不执行了
    if (!previous && !options.leading) {
      previous = now;
    }

    // 距离下次触发 func 还需要等待的时间
    let remaining = wait - (now - previous);

    // 要么是到了间隔时间了（remaining <= 0）
    // 要么是没有传入 {leading: false}，且第一次触发回调，即立即触发
    // 此时 previous 为 0，wait - (now - previous) 也满足 <= 0
    // 之后便会把 previous 值迅速置为 now
    if (remaining <= 0 || remaining > wait) {
      if (timer) {
        // 停止计时器并手动清空防止内存泄漏
        clearTimeout(timer);
        timer = null;
      }

      // 设置 previous 为当前时间
      previous = now;
      // 执行 func 函数
      func.apply(this, args);
    } else if (!timer && !options.trailing) {
      // 如果已经存在一个定时器，则不会进入该 if 分支
      // 如果 {trailing: false}，即最后一次不需要触发了，也不会进入这个分支
      // 间隔 remaining milliseconds 后触发 later 方法
      timer = setTimeout(() => later(this, args), remaining);
    }
  }

  // 手动取消
  throttled.cancel = function () {
    clearTimeout(timer);
    timer = null;
    previous = 0;
  };
  return throttled;
}
```

- hooks 的实现

```javascript
/**
 * 用于节流的hook
 * 节流的意义在于我们可以控制高频触发的事件在同一个时间周期内发生的频率
 *
 * @param {function} func 必填，事件的处理函数
 * @param {number} wait 可选，时间周期，默认500ms
 * @param {object} options 可选，配置项，默认第一次不需要执行，最后一次需要执行
 * @param {boolean} options.leading 第一次调用函数时是否需要执行
 * @param {boolean} options.trailing 最后一次调用函数时是否需要执行
 */
export function useThrottle(
  func,
  wait = 500,
  options = { leading: false, trailing: true }
) {
  // 定义一个ref对象，用于储存一个定时器
  const timer = useRef();
  // 定义一个ref对象，用于储存一个上次执行参数一方法的时间戳
  const previous = useRef(0);
  // 定义一个用于清除计时器的方法
  const clearTimer = () => {
    // 检查计时器是否存在，如果存在手动清除并将其值置为null以便于垃圾回收机制清空处理
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
  };
  // 定义一个执行参数一的方法
  const applyFunc = args => {
    // 修改previous对象的值为当前时间戳，表示本次调用已执行，新的调用需要等待另一个时间周期结束
    previous.current = now;
    // 使用apply方式执行参数一方法并将参数传入
    func.apply(this, args);
    timer.current = null;
  };
  // 定义并返回一个闭包函数，该函数每次调用时通过比较第二步定义的时间戳来判断是否需要执行参数一方法
  return function throttled(...args) {
    // 获取当前时间
    const now = Date.now();
    // 通过检查previous对象和options.leading属性来判断是否将previous对象置为当前时间，
    // 当previous对象被置为当前时间时代表着参数一方法会被储存至timer定时器对象中延迟处理
    if (!previous.current && !options.leading) {
      previous.current = now;
    }
    // 距离下次触发 func 还需要等待的时间差值
    const remaining = wait - (now - previous.current);
    // 清除计时器
    clearTimer();
    // 上一步计算出来的差值如果小于等于零则立即执行参数一中的方法
    if (remaining <= 0) {
      return applyFunc(args);
    }
    // 上一步计算出来的差值如果大于零则需要检查配置参数中是否设定了最后一次调用需要执行，如果需
    // 要执行，定义一个计时器用于执行参数一方法，其等待时间为计算出来的差值
    if (options.trailing) {
      // 修改定时器
      timer.current = setTimeout(applyFunc, remaining);
      return false;
    }
  };
}
```

- 实现节流 hook 的算法与步骤

  > 1.定义一个 Ref，用于储存一个定时器

- 节流 hook 的调用

```javascript
export default function Home(props) {
  const [a, setA] = useState(0);
  const [b, setB] = useState(0);
  const cancel = useThrottle(
    () => {
      setB(a);
    },
    2000,
    [a]
  );
  function changeInput(e) {
    setA(e.target.value);
  }
  return (
    <div>
      <input type="text" onChange={changeInput} />
      {a}###{b}
    </div>
  );
}
```

##### 实现一个防抖的 hook

防抖的实现与节流差不多：节流是将多次执行的事件稀释成每隔一段时间执行来降低事件发生的频率，而防抖则是将多次执行的事件转变成最后一次执行。

```javascript
// 一个最简单的节流
function debounce(fun, wait = 50) {
  let timer;
  return function (...args) {
    // 有新的请求进来就干掉原来的计时器，重新开始计时
    if (timer) {
      clearTimeout(timer);
    }
    // 计时器完成，执行函数
    timer = setTimeout(() => {
      fun.apply(this, args);
    }, wait);
  };
}
```

- hook 的实现

```javascript
import { useEffect, useRef } from 'react';
function useDebounce(func, wait = 50, deps = []) {
  let timer = useRef();
  useEffect(() => {
    if (timer.current) {
      clearTimeout(timer.current);
    }
    timer.current = setTimeout(() => {
      func();
    }, wait);
  }, deps);
  // 取消函数，用于向外暴露停止防抖函数
  function cancel() {
    clearTimeout(timer);
    timer = null;
  }
  return cancel;
}
```

- 防抖 hook 的调用

```javascript
export default function Home(props) {
  const [a, setA] = useState(0);
  const [b, setB] = useState(0);
  const cancel = useDebounce(
    () => {
      setB(a);
    },
    2000,
    [a]
  );

  function changeInput(e) {
    setA(e.target.value);
  }
  return (
    <div>
      <input type="text" onChange={changeInput} />
      {a}###{b}
    </div>
  );
}
```

##### 实现一个 useScroll

scroll 也是一个高频使用的 hook，我们经常需要监听一个元素的滚动位置来决定展示的内容：

```javascript
import { useState, useEffect, useRef } from 'react';
import './style.less';

const useScroll = scrollRef => {
  const [pos, setPos] = useState([0, 0]);

  useEffect(() => {
    const { current } = scrollRef;
    function handleScroll(e) {
      setPos([current.scrollLeft, current.scrollTop]);
    }
    // 事件绑定
    current.addEventListener('scroll', handleScroll, false);
    // 清除事件
    return () => {
      current.removeEventListener('scroll', handleScroll, false);
    };
    // 将scrollRef当成依赖，避免在ref.current为undefined时进行事件绑定
  }, [scrollRef]);

  return pos;
};

export default function Home(props) {
  const scrollRef = useRef();

  const [x, y] = useScroll(scrollRef);

  return (
    <div>
      <div className="container" ref={scrollRef}>
        <div className="innerBox"></div>
      </div>

      <div>
        {x}, {y}
      </div>
    </div>
  );
}
```

##### 实现一个小型的 redux hook

通过前段时间学习到的 hooks Api 的知识，我们知道，在 react hook 中有一个叫 useReducer 的 api，我们也可以用它来实现一个 redux 玩玩：

```javascript
//
```
