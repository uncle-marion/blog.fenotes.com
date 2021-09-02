> Marion 的 react 实战课程 > 第六部分 > Set/Map

## Set

从表面上看起来 Set 与数组类似，它是一个用于存储 key 的类数组数据结构，所以根据 key 不能重复的原则，它的最大的特性就是它的内部的每一个成员都是唯一的，绝不会重复。

```javascript
// 初始化一个空的Set
var set = new Set();
set.add(1);
set.add("1");
// Set(2){1, '1'}
// 也可以用它将一个数组转换成Set集合
var arr = new Set([1, 2, 1, 5, 3, 1, 4, 2, 5, 2, 3, 4, 6, 7]);
// Set(7){1，2，5，3，4，6，7} // 注意这里，它不是方括号而是花括号，关键的是最前面加了个前缀Set
// 所有具有迭代器的对象都可以用来构造Set, 比如array, string, arguments等等

// 它可以被遍历
for (const i of arr) {
  console.log(i);
}
// 1 2 5 3 4 6 7

// 也能被Array.from或扩展运算符转换成数组
arr = Array.from(arr);
// [1,2,5,3,4,6,7]
```

利用它的这种特性，我们经常用它来做一个对数组或字符串去重的工作

```javascript
// 数组去重
var arr = Array.from(new Set([1, 2, 1, 5, 3, 1, 4, 2, 5, 2, 3, 4, 6, 7]));
// 字符串去重
var str = [...new Set("dsafasdfasdfasfdasdfas")].join("");
```

它有一些方法

```javascript
// add 添加一个成员并返回结构本身
var arr = new Set();
var b = arr.add("a");
b.add("b");
b === a;

// delete 删除一个成员并返回一个boolean类型的删除状态
b.delete("a");

// has 判断是否包含某个成员，返回boolean
b.has("a");

// clear 清除所有成员，没有返回
b.clear();
```

它无法像数组或对象一样取值，只能通过遍历来取值

```javascript
// 支持keys\values\entries三种迭代器对象
aa = new Set("fdsagasdfasdfasdf"); // Set(5) {'f', 'd', 's', 'a', 'g'}
console.log(aa.keys()); // SetIterator {'f', 'd', 's', 'a', 'g'}
console.log(aa.values()); // SetIterator {'f', 'd', 's', 'a', 'g'}
console.log(aa.entries()); // SetIterator {'f' => 'f', 'd' => 'd', 's' => 's', 'a' => 'a', 'g' => 'g'}
// 从entries迭代器的结果可以看出，它储存的其实也是键值对，只不过它们的值是相同的
// 它本身默认的遍历器对象是values，我们可以直接使用forEach和for...of
aa.forEach((item) => console.log(item));
for (const item of aa) {
  console.log(item);
}
```

根据它的一些特性和方法，我们可以很容易地实现两个数组的交集、并集和差集操作

```javascript
var a = [1, 2, 3, 4];
var b = [3, 4, 5, 6];

var setA = new Set(a);
var setB = new Set(b);
// 并集(合并两个集合并去除重复的成员)
var setUnion = new Set([...a, ...b]);
// Set(6){1,2,3,4,5,6}
// 交集(两个集合中重复的成员)
var setInter = new Set(a.filter((x) => setB.has(x)));
// Set(2){3,4}
// 差集(a => b)(相对于b集合中a的私有成员)
var setDiff = new Set(a.filter((x) => !setB.has(x)));
// Set(2){1,2}
```

## Map

Map 与 Set 一样，也是一个类数组的数据结构，但与 Set 不同的是，它储存的是键值对(上面说到了，Set 其实也是键值对，但它们的值是一样的)，所以，它更像是一个对象，但它有一个对象所没有的特性，可以使用任何类型来作为 key，这让我们可以用它来应对一些特殊场景(没想起来)。当然，它的用法也比对象稍稍麻烦一点。

```javascript
// 二维数组可以转换成map
var test = [
  ["测试", "test"],
  ["看看", "have look"],
];
var map = new Map(test);
// 也可以创建一个空的map结构
var map = new Map();
// 写入属性， 与对象不同，map的key可以是任意类型
map.set(null, "qwer");
map.set(undefined, "asdf");
map.set({ a: "abc" }, { b: "abc" });
// 读取属性
map.get(null);
```

与 Set 一样，它也支持三种迭代器：

```javascript
var aa = { a: "aa" };
var bb = [1, 2, 3];
var cc = new Map([
  [aa, 123],
  [bb, "abc"],
]);
console.log(cc.keys()); // MapIterator {{a: 'aa'}, [1,2,3]}
console.log(cc.values()); // MapIterator {123, 'abc'}
console.log(cc.entries()); // MapIterator {Object => 123, Array(3) => 'abc'}
// for of遍历
for (const item of cc) {
  console.log(item);
}
for (const [key, value] of cc) {
  console.log(key, value);
}
// forEach遍历
cc.forEach((value, key) => console.log("key: %s, value: %s", key, value));
```

Es6 的扩展运算符与 Array.from 方法都可以将它转换成一个二维数组

```javascript
var arr = Array.from(cc);
var brr = [...cc];
```

克隆与合并

```javascript
var aa = new Map([
  ["key1", "value1"],
  ["key2", "value2"],
]);
var bb = new Map(aa);

console.log(aa === bb);
// 打印 false。 Map 对象构造函数生成实例，迭代出新的对象。

var aa = new Map([
  [1, "abc"],
  [2, "def"],
  [3, "ghi"],
]);
var bb = new Map([
  [1, "xyz"],
  [2, "uvw"],
]);

// 合并两个 Map 对象时，如果有重复的键值，则后面的会覆盖前面的，对应值即 xyz, uvw, ghi
var merged = new Map([...aa, ...bb]);
```

- Ojbect 的 key 只能是字符串或 Symbols, 但 Map 的 key 可以是任意值
- Map 中的键值是有序的(按 push 顺序)而 Object 中不是
- Map 的长度可能通过.size 获取到，而 Ojbect 只能获取迭代对象后计算
- Object 有自己的原型和原型链，而 Map 没有
