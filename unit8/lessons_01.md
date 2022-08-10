> Marion 的 react 实战课程 > 第八部分 > 从零开始学习 redux-saga

## Generator

学习 saga 之前，我们需要学习一下 generator(生成器)

- Generator 是生成器，一个函数如果加了\*，它就会变成一个生成器函数，它的运行结果会返回一个迭代器对象

- Es6 规范中规定了迭代器必须有一个 next 方法，这个方法会返回一个对象，这个对象具有 done 和 value 两个属性

  > done 表示当前迭代器是否已经执行完成，执行完成为 true，否则为 false

  > value 表示当前步骤返回的值

- 当调用迭代器的 next 方法时，会继续往下执行，遇到 yield 关键字都会暂停执行，并将 yield 后面表达式的值作为返回对象的 value

让我们来执行下面的代码：

```javascript
// generator [dʒenəreɪtər] {生产者} 这里我们译为生成器，用于生成一个可迭代的对象
function* generator() {
  // yield [ji:ld] {产出结果} 这里的意思是告诉generator这里需要暂停一下，返回前面的代码执行的结果并等待下一个next调用
  let a = yield 1;
  // 使用这种特性，我们可以用它来处理异步，每次异步处理完成后将值传入
  console.log(
    a,
    '打印a的值, 它并不等于1, 如果next方法未传值, 它是undefined, 如果next方法有传值, 它就是传入的值'
  );
  let b = yield 2;
  console.log(b, '打印b的值');
  let c = yield 3;
  console.log(c, '打印c的值');
}
// iterator [ɪtə'reɪtə] {迭代器} 一个可迭代的对象，可以理解成一个可遍历的对象
// javascript中内置了迭代器的类型有：String, Array, Map, Set, arguments, ElementList（元素列表）等
// 调用生成器，返回一个迭代器
let iterator = generator();
// 执行到yield 1暂停，返回当前的迭代器状态对象，{value: 1, done: false}
// 状态对象中的value === yield后面的值，这里被称之为yield的返回值，需要注意的是，这个值并不赋给等号前面的属性，它只是赋给了next对象
// 状态对象中的done，用于表示当前这个iterator是否已经执行完毕
iterator.next(); // 第一次无需传参，因为是初始化，传入也无人接收
iterator.next('aaaa'); // 给a赋值，这个值才是赋给第一个yield等号前的属性的，如果不赋值，接
iterator.next('bbbb'); // 给b赋值
iterator.next('cccc'); // 给c赋值
```

- 知识点小结

> generator 就是一个可以生成遍历工具的方法，它生成的遍历工具与 for 循环有点不同就是每一步都可以使用 yield 命令来暂停它，同时还能使用 next 方法来重新执行，重新执行时能保持上一个迭代的状态和属性都不会发生变化。

> generator 是一个生成器，执行它返回的是一个迭代器

> iterator 是一个迭代器，是执行 generator 返回的一个实例，可以通过 next 方法去启动生成器以及控制生成器是否往下执行

> yield/next 这是控制代码执行顺序的一对命令  
> yield 负责在生成器函数中暂停代码的执行并保持生成器函数的活跃性（保持活跃的意思是它内部的资源都会存在原处不动，只不过是处在一个时间停止的状态）  
> 调用 iterator 里的 next 方法，可以从上次暂停的位置开始继续往下执行。

## generator 的遍历

```javascript
function co(generator) {
  const it = generator();
  let result;
  function next(args) {
    result = it.next(args);
    if (!result.done) {
      next(result.value);
    }
  }
  next();
}
co(generator);
```

## Redux-saga

用过了 thunk 与 promise 的组合后，你会发现 saga 很难用。。所以，对于 saga，我们只需要简单地了解一下即可，稍后的 dva 与 umi 才需要更多的学习

### saga 的配置

###### store.js

```javascript
import {createStore, applyMiddleware} form 'redux'
// 与thunk/promise不一样的是，这里导入的只是一个创建saga中间件的方法
import createSagaMiddleware from 'redux-saga'
import reducers from './reducer'
import {rootSaga} from './saga'

// 创建一个saga的中间件
const saga = createSagaMiddleware()

// 套娃式的写法（柯里化，高阶函数）
const store = applyMiddleware(saga)(createStore)(reducer)

// 习惯性的写法
const store = createStore(reducers, applyMiddleware(saga))

// 执行saga
saga.run(rootSaga)

export default store
```

###### saga.js

```javascript
// effects redux-saga中的指令集
// put 发送方法 用于将action派发到store
// take 接收方法 接收
import {put, take} from 'redux-saga/effects'

export function* rootSaga() {
  for (let i = 0; i < 3; i++>) {
    console.log('等待异步添加动作')
    // yield，表示暂停，需要接收到async_add指令才能往下继续
    const action = yield take('async_add')
    console.log('终于等到你', action)
    // put 实际上就等于store.dispatch，将这个action派发给了store
    yield put({type: 'async_add'})
    console.log('继续遍历')
  }
  console.log('遍历结束。。。')
}
```

###### reducer.js

```javascript
export function add() {
  return { type: 'add' };
}
export function asyncAdd() {
  return { type: 'async_add' };
}
export default function (state = { num: 0 }, { type, payload }) {
  switch (type) {
    case 'add':
      return { num: state.num + 0.1 };
    case 'async_add':
      return { num: state.num + 1 };
    default:
      return state;
  }
}
```

###### app.js

```javascript
import React from 'react';
import { connect } from 'react-redux';
import { add, asyncAdd } from './reducer/reducer';

class App extends React.Component {
  render() {
    return (
      <div>
        <div>{this.props.num}</div>
        <button onClick={this.props.add}> +0.1 </button>
        <button onClick={this.props.asyncAdd}> +1 </button>
      </div>
    );
  }
}
const mapStateToProps = state => state;
export default connect(mapStateToProps, actions)(App);
```
