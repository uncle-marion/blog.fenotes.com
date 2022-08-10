> Marion 的 react 实战课程 > 第二单元 React 基础与关联知识 > 其它 hook

#### useContext

React Hook 里的 context 与 class 组件里的 context 是一样的效果，在上个月的 context 中我们知道了，context 能够允许数据跨越组件层级直接传递到任何的子组件上。我们今天再次重复一遍以加深记忆

```javascript
//Page.js
// Context 可以让我们无须明确地传遍每一个组件，就能将值深入传递进组件树。
import React, { Component } from 'react';
import List from './List';
//导出ThemeContext，让后面的Item组件可以拿到
export const ThemeContext = React.createContext();
export default class Page extends Component {
  constructor(props) {
    super(props);
    this.state = { theme: 'red' };
  }
  onChangeTheme = color => {
    this.setState({ theme: color });
  };
  render() {
    const data = [
      { id: 1, text: '随随便便输入', color: 'yellow' },
      { id: 2, text: '随便输入', color: 'blue' },
    ];
    // 使用一个 Provider 来将当前的 theme 传递给以下的组件树。
    // 无论多深，任何组件都能读取这个value值。
    return (
      <div>
        <ThemeContext.Provider
          value={{ theme: this.state.theme, onChangeTheme: this.onChangeTheme }}
        >
          <List data={data} />
        </ThemeContext.Provider>
      </div>
    );
  }
}
// List.js
import React from 'react';
import Item from './Item';
export default function List(props) {
  return (
    <div>
      {props.data.map(i => (
        <Item key={i.id} color={i.color}>
          {i.text}
        </Item>
      ))}
    </div>
  );
}
//Item.js
import React, { useContext } from 'react';
//引入useContext
///导入Page中的ThemeContext对象
import { ThemeContext } from './Page';
export default function Item(props) {
  //拿到context数据
  const context = useContext(ThemeContext);
  return (
    <div>
      <p style={{ color: context.theme }}>
        {props.children}
        <button onClick={() => context.onChangeTheme(props.color)}>
          {' '}
          点击变色{' '}
        </button>
      </p>
      <ThemeContext.Consumer>
        {value => {
          console.log(value, 'render');
        }}
      </ThemeContext.Consumer>
    </div>
  );
}
```

#### useMemo

在 class 组件中，我们使用 shouldComponentUpdate 方法或者通过继承 PureComponent 类来减少因为父组件的状态变化导致子组件的重复渲染：

##### shouldComponentUpdate

```javascript
// 使用shouldComponentUpdate来优化
import React, { Component } from 'react';

class TestButton extends Component {
  // shouldComponentUpdate(prevProps) {
  //   return prevProps.num !== this.props.num
  // }
  render() {
    console.log('我们来看看父组件的state变化是否会造成子组件的重新渲染');
    return (
      <div>
        <h1>props中的内容：{this.props.num}</h1>
        <button onClick={this.props.onClick}>click me</button>
      </div>
    );
  }
}

export default class TestShouldUpdate extends Component {
  state = {
    inputVal: '',
    num: 1,
  };
  render() {
    return (
      <div>
        <input
          value={this.state.inputVal}
          onChange={e => this.setState({ inputVal: e.target.value })}
        />
        <TestButton
          num={this.state.num}
          onClick={() =>
            this.setState(prevState => ({
              num: prevState.num + 1,
            }))
          }
        />
      </div>
    );
  }
}
```

##### React.PureComponent

上面这个例子，我们知道，也可以使用 React.PureComponent 来优化：

```javascript
import React, { Component, PureComponent } from 'react';

class TestButton extends PureComponent {
  render() {
    console.log('我们来看看父组件的state变化是否会造成子组件的重新渲染');
    return (
      <div>
        <h1>props中的内容：{this.props.num}</h1>
        <button onClick={this.props.onClick}>click me</button>
      </div>
    );
  }
}

export default class TestShouldUpdate extends Component {
  state = {
    inputVal: '',
    num: 1,
  };
  render() {
    return (
      <div>
        <input
          value={this.state.inputVal}
          onChange={e => this.setState({ inputVal: e.target.value })}
        />
        <TestButton
          num={this.state.num}
          // 注意这里，因为每次都会重新生成函数，所以会导致react发现函数引用地址不一致而重新渲染
          onClick={() =>
            this.setState(prevState => ({
              num: prevState.num + 1,
            }))
          }
        />
      </div>
    );
  }
}
```

##### React.memo

好了，到这里我们之前的关于 class 组件的优化方式就回顾得差不多了，但是，我们的函数组件怎么优化呢？要知道函数组件可没有 shouldComponentUpdate 或 PureComponent。
React 提供了一个叫 memo 的高阶函数来实现我们上面的优化:

```javascript
const TestButton = memo(
  props => {
    console.log('我们来看看父组件的state变化是否会造成子组件的重新渲染');
    return (
      <div>
        <h1>props中的内容：{props.num}</h1>
        <button onClick={props.onClick}>click me</button>
      </div>
    );
  },
  (prevProps, nextProps) => prevProps.num === nextProps.num
);
```

memo 接收两个参数，第一个参数是我们的函数组件，第二个参数是一个可选参数，当我们不传入可选参数时，memo 的作用与 PureComponent 一致，会对 props 的内容做一个浅比较；同样的，我们也可以传入一个函数，像 shouldComponentUpdate 一样去用它，不过它的用法与 shouldComponentUpdate 完全相反，需要渲染返回 false，否则返回 true!

##### React.useMemo

如同上面的例子，memo 用于优化函数组件的渲染行为，当传入的值未发生变化的情况下组件不参与渲染，否则重新渲染组件。

而 useMemo 则用于定义一段函数逻辑是否需要重复执行，本质上都是利用了同样的算法来判断依赖是否改变，从而判断是否触发特定逻辑。useMemo 主要用于减少不必要的计算来实现优化。

我们继续拿上面的例子来说话

```javascript
import React, { useState, memo, useMemo } from 'react';

const TestButton = memo(props => {
  console.log('我们来看看父组件的state变化是否会造成子组件的重新渲染');
  return (
    <div>
      <h1>props中的内容：{props.num}</h1>
      <button onClick={props.onClick}>click me</button>
    </div>
  );
});

export default function TestMemo() {
  const [inputVal, setInputVal] = useState('');
  const [num, setNum] = useState(0);
  // 这个函数在每次渲染时都会重新生成，导致引用地址始终不一致，所以我们在调用TestButton时不可避免地重新渲染
  const onClick = () => setNum(num + 1);
  // 与useEffect一样，我们在使用useMemo时也需要一个依赖，否则仍然会生成不同的函数
  // const onClick = useMemo(() => {
  //   return () => setNum(num + 1);
  // }, [num]);
  // useCallback，它与useMemo基本一致，只不过useMemo是返回我们传入的回调函数执行后的值，而useCallback则直接返回了我们传入的回调函数；如果我们使用useMemo返回了一个函数，那么就可以直接使用useCallback来直接返回一个函数以省略掉顶层的函数
  // const onClick = useCallback(() => setNum(num + 1), [num])
  return (
    <div>
      <input value={inputVal} onChange={e => setInputVal(e.target.value)} />
      <TestButton num={num} onClick={onClick} />
    </div>
  );
}
```

##### useMemo 与 useCallback 的区别

useCallback 它与 memo 基本一致，不过官方的说法是 memo 返回的是一个变量，而 callback 返回的是一个可调用的函数；这一块，初始的时候我总是弄错，后来才发现，它的意思是说，memo 返回给我们的是我们传入的回调函数被执行后返回的值，而 callback 则是将我们的回调函数直接返回了。

##### useMemo/useCallback 和 useEffect 的执行时机

useMemo 与 useEffect 最大的区别在于调用时机。useEffect 是副作用，所以它必须要等到渲染完成后执行；而 useMemo 是需要有返回值的，它的返回值需要直接参与渲染，所以 useMemo 是在渲染前完成的。

#### useReducer

useReducer，跟 redux 中的 reducer 差不多，它是一个纯函数，接收当前组件的 state 和一个用于描述操作目的的 action，计算然后返回最新的 state。

##### reducer 函数

```javascript
function countReducer(state = 1, { type }) {
  switch (type) {
    case 'add':
      return state + 1;
    case 'sub':
      return state - 1;
    default:
      return state;
  }
}
```

上面是一个最简单的 reducer 的例子，通过 action 的 type 属性对应地计算并返回一个全新的 state，它没有任何副作用，不会尝试影响外部状态或是传入的参数。这意味着只要给它相同的输入，它返回的内容也始终都是相同的，因此，通过 reducer 函数会很容易推测 state 的变化。

```javascript
const initState = {
  //...
  count: 1,
};
function countReducer(state = initState, { type }) {
  switch (type) {
    case 'add':
      return { ...state, count: state.count + 1 };
    case 'sub':
      return { ...state, count: state.count - 1 };
    default:
      return state;
  }
}
```

通过上面的代码我们重新温习了在 reduce 中如果去返回一个 javascript 对象：reducer 处理的 state 对象是一个不可变数据，我们永远都不要尝试直接修改参数中的 state 对象，这会导致一些意外的错误发生，比如明明改变了 state 中的数据但页面就是无法侦测到变化导致不能重新渲染等，我们应该做的是使用 ES6 中的解构赋值方式去创建一个新的对象，并复写我们需要改变的 state 属性。

##### action 对象

在我们的 redux 中，action 用来描述和表示即将触发的行为：用 type 来表示具体的行为类型，用 payload 来传递需要的数据

```javascript
const action = {
  type: 'addBook',
  payload: {
    bookId,
    bookName,
    author,
  },
};
function bookReducer(state, { type, payload }) {
  switch (type) {
    case 'addBook':
      const books = [...state.books, payload];
      return {
        ...state,
        books,
      };
    case 'subBook':
      const books = state.books.filter(item => item.bookId !== payload.bookId);
      return {
        ...state,
        books,
      };
    default:
      return state;
  }
}
```

从上面的简例中我们可以看到，action 的类型是添加一本书籍，payload 中是需要添加的书籍的资料信息，在 reducer 的 switch 中根据 action 的 type 来判断执行什么操作，然后在 addBook 动作中将新增的书籍放入到当前的书籍列表 books 中，然后以解构赋值的方式返回一个新增书籍信息后的 state。

##### 如何使用 useReducer

在 React Hook 中，我们已经学习了如何改变状态的 useState 和副作用 useEffect，我们刚刚又重新复习了 redux 中的 action 和 reducer。那么，大家应该能猜到我们将要学习的另一种操作 hooks 中 state 的方法：useReducer。下面，我们仍然通过一些 Demo 来学习如何使用 useReducer 来管理 state。

- 简单的加减操作

```javascript
import React, { useReducer } from 'react';
const initState = {
  count: 1,
};
function countReducer(state, { type }) {
  switch (type) {
    case 'add':
      return { ...state, count: state.count + 1 };
    case 'sub':
      return { ...state, count: state.count - 1 };
    default:
      return state;
  }
}
export default function Counter() {
  // 调用useReducer
  // 第一个参数，就是我们的reducer，写法与redux的reducer完全一致
  // 第二个参数，初始化的state，需要注意的是，我们在redux中，initState的赋值操作是在reduce中去做的，但在useReducer中，它必须在这里传入
  // useReducer的返回值为最新的state和dispatch函数，dispatch函数我们在之前的redux学习中已经说到了，它是用来派发action的，将action派发给reducer函数
  const [state, dispatch] = useReducer(countReducer, initState);
  return (
    <div>
      count: {state.count}
      {/* 通过dispatch将action派发给reducer */}
      <button onClick={() => dispatch({ type: 'add' })}>加个数</button>
      <button onClick={() => dispatch({ type: 'sub' })}>减个数</button>
    </div>
  );
}
```

从上面的例子中我们可以看出来，useReducer 的使用方式与 redux 的使用方式完全一致，然后我们来实现一个相对来说较为复杂的 Demo

- useState 版的 login 实现，我们先看下使用 useState 怎样实现 login

```javascript
function LoginPage() {
  const [name, setName] = useState('');
  const [pwd, setPwd] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errLog, setErrLog] = useState('');
  const [isLogged, setIsLogged] = useState(false);

  cosnt login = ev => {
    if (isLoading) {
      return
    }
    setIsLoading(true);
    setErrLog('');
    login({name, pwd}).then(() => {
      setIsLogged(true);
      setIsLoading(false);
    }).catch(err => {
      setErrLog(err.message);
      setName('');
      setPwd('');
      setIsLoading(false);
      setIsLogged(false);
    })
  }
  return (<div>login</div>)
}
```

在上面的例子中我们定义了 5 个必要的 state 来描述页面状态，从 login 函数当中登陆成功或失败时进行了一些 state 的设置。在没有注释的情况下，代码的可读性也还可以。但可以想象一下，如果我们的需求变得越来越复杂时，可能会有更多的 state 需要管理，更多的 setState 分散在程序的各个位置，一不小心就会出现错误或遗漏，这样的维护体验是我们需要摒弃的。那么，使用 useReducer 来管理这些状态呢？

```javascript
const initState = {
  name: '',
  pwd: '',
  isLoading: false,
  errLog: '',
  isLogged: false,
};
function loginReducer(state, { action, payload }) {
  switch (type) {
    case 'login':
      return {
        ...state,
        isLoading: true,
        errLog: '',
      };
    case 'success':
      return {
        ...state,
        isLoading: false,
        isLogged: true,
      };
    case 'error':
      return {
        name: '',
        pwd: '',
        isLoading: false,
        isLogged: false,
        errLog: payload.message,
      };
  }
}
export default function loginPage() {
  const [state, dispatch] = useReducer(loginReducer, initState);
  const [name, pwd, isLoading, isLogged, errLog] = state;
  const login = ev => {
    dispatch({ type: 'login' });
    login({ name, pwd })
      .then(() => {
        dispatch({ type: 'success' });
      })
      .catch(err => {
        dispatch({
          type: 'error',
          payload: err,
        });
      });
  };
  return <div>login</div>;
}
```

从上面这段代码可以看出，虽然使用 useReducer 后代码变得更多了，但很明显代码的可读性也更高了，我们能更清晰地了解整个 state 变化的逻辑。LoginPage 现在不需要关心如何处理登陆成功失败这些行为，这些任务都分配给了 loginReducer 了，表现与业务完全分离开来。同时，我们的代码复用性也提高了一个层次，比如说在程序中某个地方需要触发一次登陆失败的操作，只需要 dispatch({type: 'error'})即可。

useReducer 可以让我们将做什么和怎么做分开：比如点击了登陆按钮，我们要做的就是 dispatch({type: 'login'});点击了退出按钮就 dispatch({type: 'logout'});我们的组件再也不关心某些状态时需要怎么做，相关的代码都在 reducer 中维护，组件只需要知道什么时候做什么就行。

> 做个小结
> 无论说得多好，reducer 终归是比 state 多了些代码或者方法，所以我们仍然要考虑什么时候才会使用 useReducer:
> 如果你的 state 是一个较大的数组或对象
> 如果你的 state 变化比较复杂，经常一个操作需要修改多个 state
> 如果你需要在深层的子组件中去修改一些状态(这个应该是在总结里的，下面还有一个 Demo，先放着)
> 如果你的应用比较大，希望表现与业务分开维护

##### 配合 useContext 来使用 useReducer

刚刚的例子中我们学会了怎样使用 useReducer 来集中处理复杂的 state。但如果我们的页面比较复杂，需要拆分成多层多个组件，我们怎样在子组件来触发 dispatch 呢？
答案是使用 useContext，useContext 允许我们将方法跨组件层级直接传递到任何子组件中

仍然是使用上面的 login 来示例，假如我们的登陆按钮被拆分成了一个子组件：

```javascript
const initState = {
  name: '',
  pwd: '',
  isLoading: false,
  errLog: '',
  isLogged: false,
};
function loginReducer(state, { action, payload }) {
  switch (type) {
    case 'login':
      return {
        ...state,
        isLoading: true,
        errLog: '',
      };
    case 'success':
      return {
        ...state,
        isLoading: false,
        isLogged: true,
      };
    case 'error':
      return {
        name: '',
        pwd: '',
        isLoading: false,
        isLogged: false,
        errLog: payload.message,
      };
  }
}
const { Provider } = createContext();
export default function loginPage() {
  const [state, dispatch] = useReducer(loginReducer, initState);
  const [name, pwd, isLoading, isLogged, errLog] = state;
  const login = ev => {
    dispatch({ type: 'login' });
    login({ name, pwd })
      .then(() => {
        dispatch({ type: 'success' });
      })
      .catch(err => {
        dispatch({
          type: 'error',
          payload: err,
        });
      });
  };
  return <div>login</div>;
}
```
