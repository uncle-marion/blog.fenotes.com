> Marion 的 react 实战课程 > 第九部分 > TypeScript 与 react 组件

## 在 react 类组件中使用 typescript

### 目的

- 减少编写冗余的类型定义、类型标注，充分利用 ts 的自动类型推断，以及外部提供的类型声明。

- 类型安全：提供足够的类型信息来避免运行时错误，让错误暴露在开发期。这些类型信息同时能够提供代码补全、跳转到定义等功能。

### 原则

- 所有用到 jsx 语法的文件都需要以 tsx 后缀命名
- 所有组件都必须指明 props 与 state 的类型
- 全局变量或者自定义的 window 对象属性，统一在项目根下的 global.d.ts 中进行声明定义
- 对于项目中常用到的接口数据对象，在 types/目录下定义好其结构化类型声明

### 声明组件

1. 类组件

```javascript
import React, {PureComponent} from 'react'
// 定义props
interface IProps {
  color: string,
  size?: string
}
interface IState {
  count: number
}

class App extends PureComponent<IProps, IState> {
    readonly state: Readonly<IState> = {
      count: 1
    };
    componentDidMount() {
      this.setState({count: 2})
    }
    render() {
      return <div>this.count={this.state.count}</div>
    }
}
export default App
```

> **注意：**如果你通过声明 state 属性来初始化 state，那么你需要为这个属性增加 IState 类型标注。虽然这与前面的 React.Component<IProps, IState>有重复的嫌疑，但是这两者实际上是不同的：

> React.Component<IProps, IState>只是标注了基类的 state 属性类型。

> 而当你在子类声明 state 时，你可以为 state 标注一个【IState 的子类型】作为 override。这样，this.state 会以子类中的 state 属性声明作为类型信息的来源。

> **小技巧：**如果 state 很复杂不想一个个都初始化，可以结合类型断言初始化 state 为空对象或者只包含少数必须的值的对象：readonly state = {} as IState;

2. 函数组件

```javascript
import React, { FC, MouseEvent } from 'react';
interface IProps {
  onClick(event: MouseEvent<HTMLDivElement>): void;
}
const Button: FC<IProps> = ({ children, ...restProps }) => {
  // 巧妙地利用剩余参数绑定方法
  return <div {...restProps}>{children}</div>;
};
export default Button;
```

> FC 是 FunctionComponent 的缩写。

> IProps 不需要声明 children 属性的类型。React.FC 会自动为 props 添加这个属性类型。

> 当然，如果 children 期望一个 render prop，或者期望其他特殊的值，那么你还是要自己给 children 声明类型，而不是使用默认的 React.ReactNode。

> props 不需要重复做类型标注。

### react 中内建的组件类型

React.FC<Props>（即 React.FunctionComponent<Props>）
React.Component<Props, State>
React.ComponentType<Props>（即 ComponentClass<P> | FunctionComponent<P>）这个主要在写 HOC 的时候经用到。

```javascript
// 定义了P类型需要继承WrappedComponentProps这个类型
// 而后根据这个类型定义了参数的类型必须是一个组件
// 前一个尖括号表示对类型的声明，后面的是对类型的使用，调用这个函数时必须先传入泛型所需的参数，就是我们的这个组件长什么样子的
const withState = <P extends WrappedComponentProps>(WrappedComponent: React.ComponentType<P>) => {
  //...
}
```

### react 中提供的常见事件类型

- ClipboardEvent 剪贴板事件对象
- DragEvent 拖拽事件对象
- ChangeEvent Change 事件对象
- KeyboardEvent 键盘事件对象
- MouseEvent 鼠标事件对象
- TouchEvent 触摸事件对象
- WheelEvent 滚轮事件对象
- AnimationEvent 动画事件对象
- TransitionEvent 过渡事件对象

```javascript
// DOM事件的基本属性都定义在这里
interface BaseSyntheticEvent<E = object, C = any, T = any> {
  nativeEvent: E;
  currentTarget: C;
  target: T;
  bubbles: boolean;
  cancelable: boolean;
  defaultPrevented: boolean;
  eventPhase: number;
  isTrusted: boolean;
  preventDefault(): void;
  isDefaultPrevented(): boolean;
  stopPropagation(): void;
  isPropagationStopped(): boolean;
  persist(): void;
  timeStamp: number;
  type: string;
}
interface SyntheticEvent<T = Element, E = Event>
  extends BaseSyntheticEvent<E, EventTarget & T, EventTarget> {}

// 具体的事件类型：
interface FormEvent<T = Element> extends SyntheticEvent<T> {}
interface KeyboardEvent<T = Element>
  extends SyntheticEvent<T, NativeKeyboardEvent> {
  altKey: boolean;
  // ...
}
interface MouseEvent<T = Element, E = NativeMouseEvent>
  extends SyntheticEvent<T, E> {
  altKey: boolean;
  // ...
}
// ...
```

### Promise 类型

Promise 是一个泛型类型，T 泛型变量用于确定使用 then 方法时接收的第一个回调函数（onfulfilled）的参数类型

```javascript
interface IResponse<T> {
  message: string;
  result: T;
  success: boolean;
}
/**
 * 通过调用接口IResponse来告诉Promise的泛型方法，服务端返回的数据类型是什么样子
 * Promise泛型接口在获取到这个参数后会对接下来的内容进行声明和约束，这样我们就不需要对每一步的结果进行声明
 */
function getResponse(): Promise<IResponse<number[]>> {
  return {
    message: '获取成功',
    result: [1, 2, 3],
    success: true,
  };
}
getResponse().then(response => {
  console.log(response.result);
});
```

### 获取并扩展原生元素的 props 类型

```javascript
export const PrimaryButton = (
  props: Props & React.HTMLProps<HTMLButtonElement>
) => <Button size={ButtonSizes.default} {...props} />;
```

PrimaryButton 能够接受所有原生<button>所接受的 props。关键在于 React.HTMLProps。

## redux 的一些定义

store.ts

```javascript
import {
  createStore,
  applyMiddleware,
  StoreEnhancer,
  StoreEnhancerStoreCreator,
  Store,
} from 'redux';
import thunk from 'redux-thunk';
import reducer from './reducers';
const storeEnhancer: StoreEnhancer = applyMiddleware(thunk);
const storeEnhancerStoreCreator: StoreEnhancerStoreCreator =
  storeEnhancer(createStore);
const store: Store = storeEnhancerStoreCreator(reducer);
export default store;
```

reducer/index.ts

```javascript
import { combineReducers, ReducersMapObject, AnyAction, Reducer } from 'redux';
import counter, { CounterState } from './count';
//接口其实就是定义合并后的状态export interface CombinedState {  counter1: CounterState}
const reducers: ReducersMapObject<CombinedState, AnyAction> = {
  counter1: counter,
};
const reducer: Reducer<CombinedState, AnyAction> = combineReducers(reducers);
export default reducer;
```

reducer/count.ts

```javascript
import { AnyAction } from 'redux';
export interface CounterState {
  count: number;
}
const initialState: CounterState = { count: 0 };
export default function reducer(
  state: CounterState = initialState,
  action: AnyAction
): CounterState {
  console.log(action);
  switch (action.type) {
    case 'ADD':
      return { count: state.count + 1 };
    default:
      return state;
  }
}
```

index.tsx

```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Counter from './components/Counter';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import store from './store';
ReactDOM.render(
  <Provider store={store}>
    <Counter />
  </Provider>,
  document.getElementById('root')
);
```

counter.tsx

```javascript
import React from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { CounterState } from '../store/reducers/count';
import { CombinedState } from '../store/reducers';
const mapStateToProps = (state: CombinedState): CounterState => state.counter1;
const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    add() {
      dispatch({ type: 'ADD' });
    },
  };
};

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

class Counter extends React.Component<Props> {
  render() {
    return (
      <div>
        <button onClick={() => this.props.add()}>加</button>{' '}
        <div>{this.props.count}</div>
      </div>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Counter);
```
