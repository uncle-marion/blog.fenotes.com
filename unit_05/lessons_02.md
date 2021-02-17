> 企业项目实战 > React 函数式编程 > 函数式编程实战内容

### 工具的使用：普通函数的柯里化

假如我们有下面的一个数组（数组内容可能会很长，类别会有很多），我们需要实现一个方法将里面的 type 一致的商品筛选出来

```javascript
const goods = [
  {
    name: '长袖衬衫',
    type: '衬衫',
  },
  {
    name: '短袖衬衫',
    type: '衬衫',
  },
  {
    name: '长裤',
    type: '裤子',
  },
  {
    name: '休闲西服',
    type: '外套',
  },
];
// 命令式编程
const shirtFilter = goods.filter(item => item.type === '衬衫');
const trousersFilter = goods.filter(item => item.type === '长裤');

// 经过简单抽象的实现
const hasType = (type, item) => item.type === type;
const shirtFilter = goods.filter(item => hasType('衬衫', item));

// 将抽象出来的方法转换成柯里化函数
const hasType = type => item => item.type === type;
const shirtFilter = goods.filter(hasType('衬衫'));
```

我们在上面将筛选函数进行了手动柯里化，但这种方式不得不说有点不方便，我们需要手动去改变代码内容，所以，我们需要一个工具来实现柯里化的过程。

```javascript
function curry(func) {
  if (typeof func !== 'function') {
    throw Error('No function provided!');
  }
  return function curriedFn(...args) {
    // 判断通过...args传入的参数长度是否小于函数参数列表的长度
    // 如果参数长度不足，则返回一个新的函数
    if (args.length < func.length) {
      return function () {
        //使用concat函数连接一次传入一个的参数，并递归调用curriedFn
        return curriedFn.apply(null, args.concat([].slice.call(arguments)));
        //除此之外，由于args是类数组，并没有concat方法，
        //所以，需要应用数组的slice方法。
      };
    }
    return func.apply(null, args); //直接调用整个函数
  };
}
const hasType = curry((type, item) => item.type === type);
const shirtFilter = goods.filter(hasType('衬衫'));
console.log(shirtFilter);
```

我们在上面实现了一个将普通多元函数转换为一个柯里化函数的方法，这个方法有很多的实现方式，这里就不一一举例了，大家了解它实现的逻辑就行；而且，在一些优秀的工具库中比如 lodash 中也是有的。如果我们的业务中已经存在 lodash 类似的工具库，那么直接引用就行

```javascript
import _ from 'lodash';
const hasType = _.curry((type, item) => item.type === type);
```

### 工具的使用：合并多个方法

```javascript
const compose = (f, g) => x => f(g(x));
var first = arr => arr[0];
var reverse = arr => arr.reverse();
var last = compose(first, reverse);
last([1, 2, 3, 4, 5]);
```

#### 柯里化的实用场景

```javascript
//
```

### 格式化一个 txt 文件

data.txt 文件

```txt
mark johansson  waffle iron  80   2
mark johansson  blender      200  1
mark johansson  knife        10   4
nikita smith    waffle iron  80   1
nikita smith    knife        10   2
nikita smith    pot          20   3
```

如上所示，我们手上有个需求，需要把上面的 txt 文件内容转换为下面的对象格式，怎样实现？大家有什么想法吗？

```javascript
{
  'mark johansson': [{
    name: 'waffle iron',
    price: '80',
    quantity: '2'
  }, {
    name: 'blender',
    price: '200',
    quantity: '1'
  }, {
    name: 'knife',
    price: '10',
    quantity: '4'
  }],
  'nikita smith': [{
    name: 'waffle iron',
    price: '80',
    quantity: '1'
  }, {
    name: 'knife',
    price: '10',
    quantity: '2'
  }, {
    name: 'pot',
    price: '20',
    quantity: '3'
  }]
}
```

注意：在进行下面这个实例之前，我们需要全局安装 babel-cli: npm i -g babel-cli

```javascript
// 引入fs插件用以读取文件
const fs = require('fs');
// 以utf8格式读取文件内容，注意，如果没有后面第二个参数，可能读回来的是一个Buffer类，里面都是些bytes，就是传说中的二进制数据。为了解决这个问题，我们需要告诉系统我们需要以什么格式来读文件
const data = fs
  // 路径需要自己匹配，windows下不一样的
  .readFileSync('src/pages/Functions/data.txt', 'utf-8')
  // 通过换行符将文本转换成一个数组
  .split('\n')
  // 通过replace方法把空格转换成逗号后再将行内容转换成数组
  .map(line => line.replace(/\s{2,}/g, ',').split(','))
  // 使用reduce来将其转换成一个对象
  .reduce((customers, line) => {
    // 用数组第一个值当成key然后将其赋成一个数组
    customers[line[0]] = customers[line[0]] || [];
    // 将后面的内容转换成对象压入到数组当中
    customers[line[0]].push({
      name: line[1],
      price: line[2],
      quantity: line[3],
    });
    return customers;
  }, {});

console.log(data);
```

运行 babel formatText.js | node
或者 babel-node formatTxt.js

#### 将一个关系型数组转换成一棵树

有的时候，我们需要将从数据库获取到的一些关系数据转换成一个树：

```javascript
[{}, {}];
```

今天我们用递归+函数式编程的方式来实现另一种转换

```javascript
function makeTree(list, parent) {
  let tree = {};
  list
    .filter(item => item.parent === parent)
    .forEach(item => (tree[item.code] = makeTree(list, item.code)));
  return tree;
}
console.log(JSON.stringify(makeTree()));
```
