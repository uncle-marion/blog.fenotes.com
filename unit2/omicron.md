> 平安蜀黍的前端教程 > JS 必学知识点 > 算法

### 什么是算法

算法，我们可能在日常生活中听到太多关于算法的描述了，比如今日头条的新闻推荐，比如淘宝、拼多多的商品推荐，传闻都使用了很多逆天的算法，所以很多同学都认为，算法是一个很高深很复杂的知识。但实际上，算法并没有那么神奇，跟它的描述一样，就是一个用于解决问题的计算方式或步骤，比如生活中，番茄炒蛋的作法，也可以用算法来描述：

> 第一步：准备番茄、鸡蛋及所需调味料  
> 第二步：番茄用开水烫过，去皮后切小块；鸡蛋打入碗内，用筷子或打蛋器打匀  
> 第三步：大火热锅，加适量油  
> 第四步：油热后倒入鸡蛋，翻炒均匀  
> 第五步：鸡蛋炒至金黄色后加入番茄，继续翻炒  
> 第六步：盖上锅盖，中火闷煮 3~5 分钟  
> 第七步：加入盐、鸡精及少量糖调味后出锅

上面就是一个算法，我们要尽可能地按这个步骤来实现，如果打乱步骤就可能导致一些不好的后果，比如鸡蛋不打碎番茄不切块，下锅后能不能炒熟都是未知的；或者鸡蛋还没打番茄还没切的时候你提前开大火热锅最终肯定是要把锅烧坏的。

回归我们的程序本身，算法是什么呢？简单地举个例子：

```javascript
// 将数组arr转换成result，实现方式不限
const arr = [
  { id: 1, name: '部门1', pid: 0 },
  { id: 2, name: '部门2', pid: 1 },
  { id: 3, name: '部门3', pid: 1 },
  { id: 4, name: '部门4', pid: 3 },
  { id: 5, name: '部门5', pid: 4 },
];

const res = [
  {
    id: 1,
    name: '部门1',
    pid: 0,
    children: [
      {
        id: 2,
        name: '部门2',
        pid: 1,
        children: [],
      },
      {
        id: 3,
        name: '部门3',
        pid: 1,
        children: [
          // ...
        ],
      },
    ],
  },
];
```

如代码所示，我们需要将数组 arr 转换成数组 res，怎样实现呢？

首先我们分析数据格式，可以看到每个成员的 id 和 name 是不一样的，但 pid 是可以重复的，而且在结果中可以看出，pid 对应的是父元素的 id，也就是 parentId。那么我们要实现这个转换就很简单了，遍历整个数组，每个成员都去找一下有没有 pid 与自己 id 一样的，如果有就将它放到自己的 children 属性里：

> 第一步：遍历数组 arr，查找 pid 为 0 的数组成员，将它放入到一个新数组中  
> 第二步：使用查询到的成员的 id 去遍历数组 arr，查找 pid 与 id 一致的数组成员，将它放入到对应的成员的 child 属性中  
> 第三步：重复上一步的过程，直到所有数组成员都被遍历完成

```javascript
// 上述算法的代码实现
function getChild(id = 0) {
  const newArr = [];
  // 遍历
  for (let i = 0, l = arr.length; i < l; i++) {
    const item = arr[i];
    // 比较id
    if (item.pid === id) {
      // 如果匹配成功，使用当前的id继续向下匹配
      item.children = getChild(item.id);
      // 将匹配的结果加入到新数组中
      newArr.push(item);
    }
  }
  // 返回新数组
  return newArr;
}
const result = getChild(0);
```

所以，算法并不是一个很高深的词，简单地理解，就是我们需要在一个函数中通过多少个步骤来返回一个计算的结果。如果还是不能理解，那么你甚至可以认为每一个函数都是一个算法的体现，所以在不是很能理解的情况下，我们勉强能得出**算法约等于函数**这样一个概念。

### 算法的复杂度

了解了什么是算法后，我们还需要学习什么是好的算法，什么是不好的算法。那么怎么判断算法的好坏呢？

一般来说，判断一个算法的好坏，我们要从**执行时间**和**占用空间**来看，当一个算法相比较于另一个算法的执行时间更短，占用内存更少，那么它就是一个相对较好的算法。

#### 时间复杂度

我们一般用**时间复杂度$$O(n)$$**这样一个指标来表示算法的**执行时间**。需要注意的是，在一般情况下**时间复杂度的计算并不是计算程序具体的运行时间，而是计算算法执行语句的次数**。随着括号中 n 的不断增大，时间复杂度不断增大，算法的执行时间越长。

##### 基础知识

- 什么是大 O

  大 O 在算法导论中表示的是算法复杂度的上界，上界的意思就是最复杂会到什么样的一种情况。

- 什么是 n

  这里的 n 是算法的输入大小，比如我们有一个对数组的 for 循环，当 i 小于数组的长度 l 时要做什么什么事情，这个 l 就表示的 n。

- 什么是 log

  在数学中 log 表示对数，是求幂运算的逆运算，比如 $$a^b=n$$，转换成求对数就是$$log_an=b$$。比如 $$2^3=8$$ 反过来表示就是 $$log_28=3$$。

> 注意思：在 $$log_an=b$$ 这个式子中，我们可以看出 log 最后等于的是 b，b 表示 a 的多少次方，b 是一个量级、a 是一个系数，而时间复杂度中只考虑量级，所以我们写的时候常常忽略 a，直接写 logn。

##### 常见的时间复杂度

算法复杂度的计算是一个相对比较复杂的东西，具体的需要花一点点时间去看看[《算法导论》](https://item.jd.com/11144230.html)。为了避免我们在接下来的学习过程中产生太多的困惑，在这里我们只是简单地说一下常见的时间复杂度有哪些：

- 常数复杂度 Constant Complexity: $$O(1)$$

```javascript
let x = 1;
let y = 2;
++x;
y++;
let z = x + y;
```

上面这种代码在执行的时候，它消耗的时间并不会随着某个变量的增长而变化，那么无论代码有多长，哪怕是几万行几十万行，都被称之为常数复杂度，常数复杂度用$$O(1)$$来表示。这是算法中最小的复杂度。常见的算法像哈希算法就是$$O(1)$$的算法。

- 对数复杂度 Logarithmic Complexity: $$O(log n)$$

```javascript
let num = 0;
for (let i = 1; i < n; i * 2) {
  num += i;
}
```

在上面的循环里，每次都会将 i 乘以 2，乘完之后，i 距离 n 就越来越近了。假设循环 x 次之后，i 就大于或等于 n 了，此时这个循环就退出了，也就是说 2 的 x 次方大于或等于 n，那么$$x=log_2n$$也就是说当循环$$log_2n$$次以后，这个代码就结束了。因此这个代码的时间复杂度为：$$O(log_2n)$$。$$O(log_2n)$$的这个 2 时间上是根据代码变化的，当我们将代码修改为$$i=i*3$$，则是$$O(log_3n)$$。这是算法中大于常数阶又小于线性阶的复杂度。常见的算法像二分查找就是 O(log n)的算法。

- 线性复杂度 Linear Complexity: $$O(n)$$

```javascript
for (let i = 0; i <= n; i++) {
  console.log(i);
}
```

上面的程序循环了 n 次，它所消耗的时间是随着 n 的变化而变化的，如果 n 等于 6 那么就执行了 6 次，它的时间复杂度就是$$O(6)$$，如果 n 等于 100 它就要执行 100 次，时间复杂度就是$$O(100)$$，这种情况被记成$$O(n)$$。所有的遍历算法都被记成$$O(n)$$。

要注意的一点：如果 for 循环中的 n 是固定的，是常量时，那么这段代码的算法复杂度仍然是常数阶的，记成 O(1)，因为常量并不会因为算法中某个变量的增加而增加整个执行次数。

- 对数线性复杂度 Log-Linear Complexity: $$O(n log n)$$

```javascript
for (let i = 0; i < n; i++) {
  let x = 0; // 执行n次
  while (x < n) {
    x = x * 2; // 执行 n*O(log n)次
  }
}
```

了解了对数阶和线性阶以后，对数线性复杂度就很容易理解了，就是在线性遍历里嵌套一个对数循环，这样它的时间复杂度就成了$$n*O(log n)$$，也就是$$O(n log n)$$

- 平方复杂度 N square Complexity: $$O(n^2)$$

```javascript
for (let i = 0; i <= n; i++) {
  for (let j = 0; j <= n; j++) {
    // 执行n次
    console.log(i, j); // 执行 n * n次
  }
}
```

平方复杂度就比较好理解了，相对于线性复杂度它就是在循环中进行了一个嵌套，它的时间复杂度就等于$$O(n * n)$$。

- 立方复杂度 N cubic Complexity: $$O(n^3)$$

这个就不举例了，它就是个三层嵌套的遍历。

- 指数复杂度 Exponential Complexity: $$O(2^n)$$

```javascript
function fibonacci(n) {
  if (n === 1 || n === 2) {
    return 1;
  }
  return fibonacci(n - 1) + fibonacci(n - 2);
}
console.time('start');
console.log(fibonacci(10));
console.timeEnd('start');
```

在上面的例子中，每当输入 n 增加 1 时，执行的操作数量就会翻倍。这是因为我们没有缓存每个函数调用的结果，所以必须从最开始重新计算所有的值。因此，这种算法的时间复杂度会随着 n 的变化而指数性地增加，记成 $$O(k^n)$$

- 阶乘复杂度 Factorial: $$O(n!)$$

```javascript
function factorial(n) {
  let num;
  if (n === 0) {
    return 1;
  }
  for (let i = 0; i < n; i++) {
    num = n * factorial(n - 1);
  }
  return num;
}
console.time('start');
console.log(factorial(10));
console.timeEnd('start');
```

上面这段代码体现的就是一个阶乘的复杂度算法，当 n 小于 10 的时候，我们基本看不出太多的时间变化，但当 n 大于或等于 10 的时候，我们可以很明显地看到，每增加一个数，执行时间是以几何级的速度在发生变化。所以，我们在平时的代码中，一定要注意禁止出现这种算法。

##### 时间复杂度的计算方法

- 如果算法的执行时间不随 n 的增加而增长，假如算法中有上千条语句，执行时间也不过是一个较大的常数。此类算法的时间复杂度是$$O(1)$$。 举例如下：代码执行 100 次，是一个常数，复杂度也是$$O(1)$$。

```javascript
let x = 1;
while (x < 100) {
  x++;
}
```

- 循环次数最多原则

```javascript
function calcSum(n) {
  let sum = 0; // 执行一次
  for (let i = 0; i < n; i++) {
    sum += i; // 执行n次，线性阶，记成O(n)
  }
  return sum; // 执行一次
}
```

根据循环次数最多原则，这里忽略掉遍历前后两个执行一次的语句，保留执行 n 次的操作，因此时间复杂度记为$$O(n)$$

- 有多个循环语句时候，算法的时间复杂度是由嵌套层数最多的循环语句中最内层语句的方法决定的。举例如下：在下面 for 循环当中，外层循环每执行一次，内层循环要执行 n 次，执行次数是根据 n 所决定的，时间复杂度是$$O(n^2)$$。

```javascript
function calcSum(n) {
  let sum = 0; // 执行一次
  for (let i = 0; i < 100; i++) {
    sum += i; // 执行100次 100为常量，所以是常数阶，记成O(1)
  }
  for (let i = 0; i < n; i++) {
    sum += i; // 执行n次，线性阶，记成O(n)
  }
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      sum += i; // 执行n * n次，记成O(n*n)，因为嵌套遍历中使用的同一个变量，所以它被记成平方阶O(n^2)
    }
  }
  return sum; // 执行一次
}
```

上面的代码中，最大的复杂度为 $$O(n*n)$$，所以，这里的时间复杂度记成 $$O(n^2)$$

- 循环不仅与 n 有关，还与执行循环判断条件有关。举例如下：在代码中，如果 arr[i]不等于 1 的话，时间复杂度是 O(n)。如果 arr[i]等于 1 的话，循环不执行，时间复杂度是 O(0)。

```javascript
for (var i = 0; i < n && arr[i] !== 1; i++) {
  // ...
}
```

##### 平均时间复杂度和最坏时间复杂度

1. 平均时间复杂度是指所有可能的输入实例均以等概率出现的情况下，该算法的运行时间；

2. 最坏情况下的时间复杂度称最坏时间复杂度。一般讨论的时间复杂度均是最坏情况下的时间复杂度。这样做的原因是：最坏情况下的时间复杂度是算法在任何输入实例上运行时间的界限，这就保证了算法的运行时间不会比最坏情况更长。

3. 平均时间复杂度和最坏时间复杂度是否一致，和算法有关，如下表所示：

| 算法 | 平均复杂度     | 最好情况        | 最坏情况        | 稳定性 | 空间复杂度 | 排序方式  | 备注                   |
| ---- | -------------- | --------------- | --------------- | ------ | ---------- | --------- | ---------------------- |
| 冒泡 | $$O(n2)$$      | O(n)            | $$O(n2)$$       | 稳定   | $$O(1)$$   | In-place  | 适用于 n 较小时        |
| 选择 | $$O(n2)$$      | $$O(n2)$$       | $$O(n2)$$       | 不稳定 | $$O(1)$$   | In-place  | 适用于 n 较小时        |
| 插入 | $$O(n2)$$      | O(n)            | $$O(n2)$$       | 稳定   | $$O(1)$$   | In-place  | 大部分都已排序时比较好 |
| 希尔 | $$O(n log n)$$ | $$O(n log^2n)$$ | $$O(n log^2n)$$ | 不稳定 | $$O(1)$$   | In-place  |                        |
| 归并 | $$O(n log n)$$ | $$O(n log n)$$  | $$O(n2)$$       | 不稳定 | $$O(1)$$   | Out-place | 适用于 n 较大时        |
| 快排 | $$O(n log n)$$ | $$O(n log^2n)$$ | $$O(n log^2n)$$ | 不稳定 | $$O(1)$$   | In-place  | 适用于 n 较大时        |
| 基数 | $$O(n2)$$      |                 | $$O(n2)$$       | 稳定   | $$O(1)$$   | In-place  | n 较小时比较快速       |
| 交换 | $$O(n2)$$      |                 | $$O(n2)$$       | 不稳定 | $$O(1)$$   | In-place  | n 较小时比较快速       |

#### 空间复杂度

空间复杂度是对一个算法在运行过程中临时占用存储空间的大小的表示。

#### 空间复杂度的计算方法

- 1 忽略常数，用 $$O(1)$$表示
- 2 递归算法的空间复杂度=(递归深度 n)\*(每次递归所要的辅助空间)

计算空间复杂度的简单几点

- 仅仅只复制单个变量，空间复杂度为 $$O(1)$$。举例如下：空间复杂度为 $$O(n)$$ = $$O(1)$$

```javascript
let a = 1;
let b = 2;
let c = 3;
console.log('输出a,b,c', a, b, c);
```

- 递归实现，调用 fun 函数，每次都创建 1 个变量 k。调用 n 次，空间复杂度 $$O(n*1)$$ = $$O(n)$$

```javascript
function fun(n) {
  let k = 10;
  if (n == k) {
    return n;
  } else {
    return fun(++n);
  }
}
```

### 复杂度计算实战

#### 扁平数据结构转树结构

拿上面我们实现的的代码来举例：

```javascript
function getChild(id = 0) {
  const newArr = []; // O(1)
  for (let i = 0, l = arr.length; i < l; i++) {
    const item = arr[i]; // O(n)
    // 如果条件不通过，块中的复杂度为O(0)
    if (item.pid === id) {
      item.children = getChild(item.id); // 条件通过，则为指数级，记成O(2^n)
      newArr.push(item); // O(n)
    }
  }
  // 返回新数组
  return newArr; // O(1)
}
const result = getChild(0);
```

上面的代码是我们在应对面试时，不考虑性能和效率，直接暴力实现的方式，可以看出来最复杂的部分是一个指数阶，所以时间复杂度为$$O(2^n)$$，存储了一个变量，每个循环都会存取一次，空间复杂度$$O(n)$$。

如果是一般的面试，可能也就过去了，但如果你的面试官对你比较感兴趣或认为你之前的面试非常优秀，想要看看你在算法这一块的研究深度时，就会问你：“有没有更好的实现？”

##### 更好的实现

我们可以先将数据转换成 Map，然后在遍历的同时，借助对象引用，直接从 Map 中查找对应的数据：

```javascript
function arrayToTree(items) {
  const result = []; // O(1)
  const itemMap = {}; // O(1)

  // 先转成map存储
  for (const item of items) {
    itemMap[item.id] = { ...item, children: [] }; // 线性阶O(n)
  }

  for (const item of items) {
    const pid = item.pid; // O(n)
    const treeItem = itemMap[item.id]; // O(n)
    // 第一级的直接写入数组
    if (pid === 0) {
      result.push(treeItem); // 当pid !== 0时它是O(n)，如果pid===0时它是O(0)
    }
    // 寻找父级
    else {
      // 复杂度参考上面的注释
      // 如果没有父级，创建一个，避免报错
      if (!itemMap[pid]) {
        itemMap[pid] = {
          children: [],
        };
      }
      // 将成员写入到父级的children属性中
      itemMap[pid].children.push(treeItem);
    }
  }
  return result; // O(1)
}
```

算法复杂度：忽略有两次循环，根据循环次数取最多原则，该实现的时间复杂度为 O(n)，需要一个 Map 把数据存储起来，空间复杂度 O(n)。

##### 最优性能

```javascript
function arrayToTree(items) {
  const result = [];
  const itemMap = {};
  for (const item of items) {
    const id = item.id;
    const pid = item.pid;

    // 如果map中没有对应属性，创建一个
    // 这一步是为了避免下面获取Children时出现报错
    if (!itemMap[id]) {
      itemMap[id] = {
        children: [],
      };
    }

    // 写入其它属性
    itemMap[id] = {
      ...item,
      children: itemMap[id]['children'],
    };

    const treeItem = itemMap[id];
    if (pid === 0) {
      result.push(treeItem);
    } else {
      if (!itemMap[pid]) {
        itemMap[pid] = {
          children: [],
        };
      }
      itemMap[pid].children.push(treeItem);
    }
  }
  return result;
}
```

上面的算法虽然已经达到了 O(n)，但实际上，还有可优化的空间，我们可以想办法把两个循环合并成一个循环，这样的话虽然算法复杂度没有变化，但实际上的执行时间是要远远小于两个循环的。

#### 斐波那契计算函数

仍然是用我们已经实现的代码：

```javascript
function fibonacci(n) {
  if (n === 1 || n === 2) {
    return 1; // 条件通过为O(1)
  }
  return fibonacci(n - 1) + fibonacci(n - 2); // 上面说过，这里是指数级O(2^n)
}
```

#### 更好的实现

```javascript
function fibonacci(n) {
  // 通过参数的方式缓存上一步的计算结果，减少新的计算
  function calcFib(n, n1, n2) {
    if (n === 1) {
      return n1;
    }
    if (n === 2) {
      return n2;
    }
    // 在传参时直接进行计算
    return calcFib(n - 1, n2, n1 + n2); // 虽然还是指数级，但有效地把两个指数级合并成了一个指数级，所以减少了计算
  }
  return calcFib(n, 1, 1);
}
```

#### 最优的实现

```javascript
function fibonacci(n) {
  let n1 = 1;
  let n2 = 1;
  for (let i = 2; i < n; i++) {
    [n1, n2] = [n2, n1 + n2]; // 用空间换时间，有效地将时间复杂度转换成了O(n)
  }
  return n2;
}
```
