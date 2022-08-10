> Marion 的 react 实战课程 > 第七部分 > 使用 useContext 与 useReduce 代替 redux

## 为什么要这样做

在 redux 越来越容易上手的今天，为什么要使用 useContext 和 useReduce 来取代 redux 呢？

- redux 的构建相对来说较复杂，需要封装 store/action/reducer 等，还需要在页面中导入 connect 和一些中间件

- 对于 dispatch 了解不是很深刻的同学，可能不是很了解各种中间件的运行机制与它们的作用

## useReduce 能取代 redux 吗？

先从理论层面看看替代 Redux 的可能性，其实如果你对两个函数有所了解，只要我们巧妙的结合，这种替代方案是完全可行的。

useContext：可访问全局状态，避免一层层的传递状态。这符合 Redux 其中的一项规则，就是状态全局化，并能统一管理。

useReducer：通过 action 的传递，更新复杂逻辑的状态，主要是可以实现类似 Redux 中的 Reducer 部分，实现业务逻辑的可行性。

经过理论上的分析是完全可行的，接下来就用一个简单实例来看一下具体的实现方法。那先实现 useContext 部分（也就是状态共享），再继续 useReducer 部分（控制业务逻辑）

### 第一步，使用 useContext 管理全局状态

- 先建立一个用于显示的组件

```javascript
import React from 'react';

export default function Theme() {
  return <div style={{ color: 'red' }}>字体颜色为红色</div>;
}
```

- 建立一个按钮组件

```javascript
import React from 'react';

export default function Buttons() {
  //button组件
  return (
    <div>
      <button>红色</button>
      <button>黄色</button>
    </div>
  );
}
```

- 将它们导入到显示的页面中

```javascript
import React from 'react';
import Theme from './components/theme';
import Buttons from './components/buttons';

export default function ReduxExample() {
  return (
    <div>
      <Theme />
      <Buttons />
    </div>
  );
}
```

- 编写颜色管理的 color.js

```javascript
import React, { createContext, useState } from 'react';

// 创建并抛出一个context对象
export const ColorContext = createContext();

// 颜色配置
const colorList = {
  blue: { color: 'blue', desc: '蓝色' },
  red: { color: 'red', desc: '红色' },
  green: { color: 'green', desc: '绿色' },
};

// 导出context容器
export default function Color(props) {
  // 颜色管理
  const [color, setColor] = useState(colorList['blue']);
  // 方法管理
  function changeColor(color) {
    // 读取并写入对应的颜色配置
    setColor(colorList[color]);
  }
  return (
    // 嵌套封装，创建value容器，向下传递属性和方法
    <ColorContext.Provider value={{ color, colorList, changeColor }}>
      {props.children}
    </ColorContext.Provider>
  );
}
```

- 然后，我们来改写我们的组件代码，让它可以使用封装的全局颜色管理组件

页面文件

```javascript
import React from 'react';
import Theme from './components/theme';
import Buttons from './components/buttons';

// 导入封装的 colors 状态管理
import Color from './components/color';

export default function ReduxExample() {
  return (
    // 将组件嵌入状态管理容器
    <Color>
      <Theme />
      <Buttons />
    </Color>
  );
}
```

内容显示文件

```javascript
import React, { useContext } from 'react';

// 导入context
import { ColorContext } from './color';

export default function Theme() {
  // 使用useContext获取context中的属性
  const {
    color: { color, desc },
  } = useContext(ColorContext);
  // 渲染
  return <div style={{ color: color }}>字体颜色为{desc}</div>;
}
```

颜色控制按钮

```javascript
import React, { useContext } from 'react';

// 导入context
import { ColorContext } from './color';

export default function Buttons() {
  // 使用useContext获取context中的方法
  const { colorList, changeColor } = useContext(ColorContext);
  return (
    <div>
      {Reflect.ownKeys(colorList).map(item => (
        <button
          style={{ color: item, margin: '4px 8px' }}
          onClick={() => changeColor(item)}
        >
          {colorList[item].desc}
        </button>
      ))}
    </div>
  );
}
```

ok，到这里我们通过 useContext 来控制全局状态的代码就完成了

### 第二步，使用 useReduce 来管理状态

通过上面的代码，我们使用了 useContext 来模拟 Redux 状态共享的能力，下面我们就来学习如何使用 useReduce 来实现业务逻辑的处理

- 增加一个 reducer 文件

> 占位

```javascript
import { CHANGE_COLOR } from './actionType';
// reduce与redux中的reduce写法完全一致
export default function reducer(state, { type, payload }) {
  switch (type) {
    case CHANGE_COLOR:
      return { ...state, ...payload };
    default:
      return state;
  }
}
```

- 修改我们的 color.js，不再让它来管理 color 状态

```javascript
import React, { createContext, useReducer } from 'react';

import reducer from './reducer';
// 创建并抛出一个context对象
export const ColorContext = createContext();

const initState = {
  color: 'blue',
  desc: '蓝色',
};

// 导出context容器
export default function Color(props) {
  // 颜色管理, 初始化的时候需要传入reducer方法和一个默认状态
  // 与redux不同的是，useReducer需要在创建时通过第二个参数将默认状态传入而不是在reducer文件中自定义默认参数
  // useReducer方法返回两个属性，第一个是当前状态，第二个是dispatch方法
  const [{ color, desc }, dispatch] = useReducer(reducer, initState);

  return (
    // 嵌套封装，创建value容器，向下传递属性和方法
    <ColorContext.Provider value={{ color, desc, dispatch }}>
      {props.children}
    </ColorContext.Provider>
  );
}
```

- 最后修改我们的 buttons 文件

```javascript
import React, { useContext, useCallback } from 'react';

// 导入context
import { ColorContext } from './color';
// 与redux一样，我们统一由
import { CHANGE_COLOR } from './actionType';

// 颜色配置
const colorList = {
  blue: { color: 'blue', desc: '蓝色' },
  red: { color: 'red', desc: '红色' },
  green: { color: 'green', desc: '绿色' },
};

export default function Buttons() {
  // 使用useContext获取context中的方法
  const { dispatch } = useContext(ColorContext);

  /**
   * 创建一个action对象并派发到reducer
   * @param {*} color
   * @returns
   */
  const changeColorAction = useCallback(
    color =>
      dispatch({
        type: CHANGE_COLOR,
        payload: colorList[color],
      }),
    [dispatch]
  );
  return (
    <div>
      {Reflect.ownKeys(colorList).map(item => (
        <button
          key={item}
          style={{ color: item, margin: '4px 8px' }}
          onClick={() => changeColorAction(item)}
        >
          {colorList[item].desc}
        </button>
      ))}
    </div>
  );
}
```
