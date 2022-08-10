> 平安蜀黍的前端教程 > JS 必学知识点 > javascript 正则表达式详解

---

**正则表达式是我们在平常工作中较常用到的一种工具表达式，用于在字符串对象中匹配指定字符串。**

---

### 一、正则表达式的组成

#### 定界符

“/”，在 JavaScript 中正则表达式的定界符就是一对“/”，所有写在“/”之内的都是正则的内容

#### 原子

原子是组成正则表达式的基本单位，一个正则表达式中至少要有一个原子。

- **普通字符作为原子**

普通字符也被称之可见字符，是正则中最常见的原子，比如 a-z、A-Z 或 0-9

> /abc/ 用于匹配字符串中是否有 abc 字符串出现

> /2/ 用于匹配字符串中是否有数字 2 出现

- **非可见字符作为原子**

非可见字符包括有换行符：\n，回车符：\r，制表符：\t，垂直制表符：\v，分页符：\f

> /\n/ 用于匹配字符串中是否有换行符出现

- **转义字符原子**

> \d 表示 0-9 之前任意一个数字字符，等价于[0-9]

> \D 表示除 0-9 之外任意一个非数字字符，等价于\[^0-9]

> \s 表示任意不可见字符，比如空格、换行或分页符等，等价于[\n\r\f\v\t]

> \S 表示任意可见字符，等价于\[^\n\r\f\v\t]

> \w 表示数字、字母或下划线中任意一个字符，等价于[0-9a-zA-Z_]

> \W 表示任意非数字、字母或下划线中的一个字符，等价于\[^0-9a-za-z\_]

> \b 单词边界，表示能够用来分割单词的字符，比如空格、标点符号及特殊字符，等价于\[^0-9a-z]

> \B 非单词边界，表示不能够用于分富单词的字符，等价于[0-9A-z]

- **自定义原子表**

> [] 原子列表 指定可包含的原子范围，在匹配时有任意一个原子通过匹配则返回成功，比如：

```javascript
/[ab]/.test('abcde') // true 字符串中有a, 匹配成功
/[hi]/.test('abcde') // false 字符串中不包含h或i, 匹配失败
// 注意，如果原子列表中的原子是连续的，可以进行缩写操作，比如[abcdefg]可以写成[a-g]
/[a-g]/.test('abcde') // true
```

> [^] 排除列表 指定不允许包含的原子范围，与原子列表规则相反：

```javascript
/[^0-9]/.test('12345') // false 字符串中没有数字以外的字符, 匹配失败
/[^a-z]/.test('12345') // true 字符串包含字母以外的字符，匹配成功
```

- **原子分组**

原子组就是小括号"()"与它们所包括起来的内容，我们可以用它将多个原子当成一个原子来使用，也可以用它来为匹配到的内容进行分组和命名：

```javascript
// 将整个表达式分成了年月日3个组后使用分组标记$进行位置转换
// 在没有对分组进行命名的情况下，分组编号是从左至右计算的，以"("出现的位置为准
'2022-03-17'.replace(/(\d{4})-(\d{2})-(\d{2})/g, '$2/$3/$1'); // '03/17/2022'

// 我们也可以给分组进行命名，命名的方式是在分组的前面加上?<分组名>，在正则较复杂时更加容易理解
'2022-03-17'.replace(
  /(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/g,
  '$<month>/$<day>/$<year>'
); // '03/17/2022'

// 分组命名后的好处是我们可以很容易地取到匹配的内容
const reg = /(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/g;
const {
  groups: { year, month, day },
} = reg.exec('2022-03-17');
console.log('year: %s, month: %s, day: %s', year, month, day); // year: 2022, month: 03, day: 17

// 或者我们可以复用分组的捕获来对匹配到的内容进行复用
const reg = /^(?<text>[a-z]+)!\k<text>{3}$/;
reg.test('abc!abcabcabc');
```

#### 元字符

元字符的作用是用来修饰原子，使正则表达式的结构更加灵活可靠，所以它也被称之为原子修饰符

> . 表示除\n 以外的任意一个字符

> - 任意数量的指定原子

> - 表示至少一个以上的原子

> ? 表示原子可以为 0 个或 1 个

> {} 用于描述原子的数量  
>  {n} 表示 n 个原子  
>  {n,} 表示至少 n 个原子，可以更多，没有上限  
>  {n,m} 表示原子数量在 n 到 m 个数量之间

> ^ 表示字符串必须以指定的原子开头

> $ 表示字符串必须以指定的原子结尾

> () 括号元字符，也被称之为原子组，表示可以将多个原子当成一个原子来使用

> | 或运算元字符，表示在"|"两侧的原子中进行二选一操作

#### 模式修正符

模式修正符也叫修饰符，是用于对匹配模式进行调节的符号。

> i 表示忽略大小写

> m 表示多行匹配

> g 表示全局匹配

---

### 二、正则的定义方式

#### 字面量方式

使用正则定界符“/”包括起来的字符串，要注意的是不能用““”包括：

```javascript
// 查找字符串中的数字
/\d/.exec('a1b2c3d4'); // ['1', index: 1, input: 'a1b2c3d4', groups: undefined]
// 测试是否正确的电话号码
/\d{3}-\d{8}|\d{4}-\d{7}/.test('010-12345678'); // true
```

#### 构造函数方式

使用 JavaScript 内置的正则构造函数进行实例化操作来生成：

```javascript
new RegExp('\\d'); // /\d/ 第一个斜杠表示为第二根斜杠进行转义
new RegExp('Ab', 'i'); // /Ab/i
```

---

### 三、正则的匹配模式

#### exec

用于在字符串中执行查找匹配的 RegExp 方法，它返回一个数组，如果未匹配到则返回 null

```javascript
// 用法
[regexp].exec(string);
// 示例
// 示例
/cb/.exec('abcdefg');
// 未找到返回 null
/bc/.exec('abcdefg');
// 返回数组形式
// 第一个为取到的值
// 第二个为获取到的位置
// 第三个是命名分组
// ['bc', index: 1, input: 'abcdefg', groups: undefined]
/(bc)d/.exec('abcdefg');
// 使用小括号对正则进行分组后
// 第一个为整个正则取到的值
// 第二个为分组1（第一对小括号）取到的值
// 第三个为获取到的位置
// 第四个为命名分组
// ['bcd', 'bc', index: 1, input: 'abcdefg', groups: undefined]
```

#### test

```javascript
// 用法
[regexp].test(string);
// 示例
/ab/.test('abcdefg');
// true
/ba/.test('abcdefg');
// false
```

---

### 四、字符串的匹配模式

#### match

```javascript
// 用法
[string].match(regexp);
// 示例
'abcdefg'.match(/cb/);
// 未找到返回 null
'abcdefg'.match(/bc/);
// 返回数组形式
// 第一个为取到的值
// 第二个为获取到的位置
// 第三个是命名分组
// ['bc', index: 1, input: 'abcdefg', groups: undefined]
'abcdefg'.match(/(<first>bc)d/);
// 使用小括号对正则进行分组后
// 第一个为整个正则取到的值
// 第二个为分组1（第一对小括号）取到的值
// 第三个为获取到的位置
// 第四个为命名分组
// ['bcd', 'bc', index: 1, input: 'abcdefg', groups: undefined]
```

#### replace

```javascript
// 用法
[string].replace(regexp, replaceString);
// 示例
'abcdefg'.replace(/cb/, 'ab');
// 未找到，返回原文: abcdefg
'abcdefg'.replace(/bc/, 'cb');
// 返回替换后的文本: acbdefg
'abcdefg'.replace(/(ab).+(fg)/, (all, first, last) => {
  return first + 1234567 + last;
});
// 返回替换后的文本ab1234567fg
```

#### exec 方法与 match 方法的相同点与不同点

- 如果在非 g 模式下,exec()和 match()除了操作格式不一样,结果是一样的。

- 在 g 模式下,exec()依然进行一次匹配,只不过在上次匹配的内容之后开始一次新的匹配

- 在 g 模式下,match()是一次性返回字符串中所有符合正则内容组成的数组。

关于正则的基础，有时间可以看菜鸟上的这篇文档[https://www.runoob.com/regexp/regexp-tutorial.html](https://www.runoob.com/regexp/regexp-tutorial.html)

---

### 五、一些常用到的规则模式

#### 贪婪与非贪婪

我们先看下面两个正则的匹配结果：

```javascript
const reg1 = /a.*b/;
const reg2 = /a.*?b/;
const str = 'abcdefgabcdefg';
console.log(str.match(reg1)); // ['abcdefgab', index: 0, input: 'abcdefgabcdefg', groups: undefined]
console.log(str.match(reg2)); // ['ab', index: 0, input: 'abcdefgabcdefg', groups: undefined]
```

上面的实例中只是因为在*号后面加了一个问号，匹配出来的结果就完全不一样了，这是为什么呢？因为正则表达式在匹配时，会尽量多的匹配符合条件的内容，如果在正则中遇到“+, ?, *, {n}, {n,}, {n,m}”这几个标识符，代表的是贪婪匹配，会尽可能地去匹配更多内容；而如果是遇到了“+?, ??, \*?, {n}?, {n,}?, {n, m}?”这种标识符则表示与贪婪相反，会在达成匹配要求后立刻返回匹配成功结束匹配（如果是在 g 模式下，会开启一下组匹配）

```javascript
const reg3 = /a.*b/g;
const reg4 = /a.*?b/g;
const str1 = 'gfedcbaabcdefgabcdefg';
console.log(str1.match(reg3)); // ['aabcdefgab']
// 如果是在g模式下，匹配返回的结果会丢弃掉位置及输入信息等，只保留匹配到的内容
console.log(str1.match(reg4)); // ['aab', 'ab']
```

为什么 reg3 只有一个而 reg4 却匹配到两个内容呢？因为 reg3 是贪婪模式，会在匹配到第一个字母后开始匹配.\*时一直往后匹配，直至匹配到最后一个满足条件的 b 为止，因此匹配完成后就再也找不到其它的内容了；而 reg4 是非贪婪模式，它会在匹配到第一个 b 字母后结束匹配，然后开始第二轮匹配。

为什么是"aab"而不是“ab”？因为正则表达式有一个匹配的优先规则：**最先开始的匹配拥有最高的优先权**第一个 a 匹配到以后，只要没有发生匹配失败的情况，它就会一直匹配下去，直到匹配成功。

#### 正则预查

预查是一种用于复杂度较高的规则匹配模式，属于一种叫做零宽断言的概念。正则预查有 4 个语法：

| 语法       | 功能描述                                                               |
| ---------- | ---------------------------------------------------------------------- |
| (?=regex)  | 肯定性前瞻，表示先检查当前位置前方（右侧）字串是否匹配规则但不向前走   |
| (?!regex)  | 否定性前瞻，表示先检查当前位置前方（右侧）字串是否不匹配规则但不向前走 |
| (?<=regex) | 肯定性后顾，表示先检查当前位置后方（左侧）字串是否匹配规则             |
| (?<!regex) | 否定性后顾，先检查当前位置后方(左侧)字串是否不匹配规则                 |

注：为什么前方是右侧，后方是左侧？因为正则是**从左往右**匹配的，就像我们往前走，那么**向前看就是右边、正向，向后看就是左边、反向**，注意一定要记清楚前缀

前瞻就是先看整个字串中是否有达成要求：比如，我们需要检查一个密码是否同时包含但不限于大写字母、小写字母和数字，而且不能出现重复的字符：

```javascript
// 整个表达式分为4组
// (?=.*[A-Z]) 肯定性前瞻，表示字串内必须要有大写字母
// (?=.*[a-z]) 肯定性前瞻，表示字串内必须要有小写字母
// (?=.*\d) 肯定性前瞻，表示字串内必须要有数字
// (?!.*(?<re>[A-z0-9])\k<re>) 否定性前瞻，表示不能有重复输入
// 上面4个表达式走完以后index仍然在0的位置，接下来就是匹配.{8,32}这个规则了
const reg =
  /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?!.*(?<re>[A-z0-9])\k<re>).{8,32}$/;
const str1 = '1q2w3e4R';
const str2 = '1q2w3e4r';
const str2 = 'faSdff1q';
reg.test(str1); // true
reg.test(str2); // 没有大写字母 false
reg.test(str3); // 有重复 false
```

后顾就是每一次匹配都回头看看是否匹配上一个规则：比如，我们需要将字符串中前后都是数字的”,“删除

```javascript
const str = 'And then, I have 1,003,334, you have 996,6,6,6';
// 整个表达式分为两组
// (?<=\d) 肯定性后顾，表示检测到“,”符号后往后看一下是否是数字
// (?=\d) 肯定性前瞻，表示检测到“,”符号后往前看一下是否是数字
const reg = /(?<=\d),(?=\d)/g;
// 正确替换所有数字中的“,”且不影响其它“,”
str.replace(reg, ''); // 'And then, I have 1003334, you have 996666'
```

或者为长数字添加千分位“,”符号

```javascript
const num = 523456234523;
// 整个表达式分为三组
// (?<=\d) 肯定性后顾，每
const reg = /(?<=\d)(?=(?:\d{3})+(?!\d))/g;

num.toString().replace(reg, ','); // '523,456,234,523'
```

### 六、实例解析

- 提取字符串中 div 标签包裹的内容

```javascript
const str =
  '<body><div><span>用户：</span><span>平安蜀黍</span></div><div><span>手机：</span><span>18612692926</span></div></body>';
// <div>.*?<\/div>代表每次只会匹配一次div，这样可以确保每一个div不会越界
// 最后的g代表全局匹配，即第一次匹配成功后，会将匹配结果放入数组，然后从下一个index重新开始匹配新的结果
const reg = /<div>.*?<\/div>/g;

console.log(str.match(reg));
// ['<div><span>用户：</span><span>平安蜀黍</span></div>', '<div><span>手机：</span><span>18612692926</span></div>']
```

- 提取字符串中成对“"”包裏的字符，要求不能再包含有“"”字符

```javascript
const str = '"The phrase "regular expression" is called "Regex" for short"';
// 使用非贪婪模式匹配，根据“"”后是否有空格来判断是否结束的引号
const reg = /".*?"\s/g;
console.log(str.match(reg));
// ['"The phrase "regular expression" ', '"Regex" ']
```

很明显的，这个匹配结果与我们想要的结果不一致，首次匹配时会把第一个”"“也包含进来

```javascript
const str = '"The phrase "regular expression" is called "Regex" for short"';
// 使用贪婪模式匹配，不允许在字符串中包含有”"“
const reg = /"[^"]*"\s/g;
console.log(str.match(reg));
// ['"regular expression" ', '"Regex" ']
```

完整的正则表达式阐述，可以看 MDN[https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/RegExp](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/RegExp)
