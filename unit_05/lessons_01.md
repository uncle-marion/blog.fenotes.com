> 企业项目实战 > React 函数式编程 > 什么是函数式编程

## 什么是函数式编程？

需要注意的是，这里的函数与我们理解的函数有一点点的不一致，并不是你理解的我们写的代码的函数，而是指的数学中的函数，即自变量的映射。简单来说，函数式编程是一种强调以函数使用为主的软件开发风格。而我们没有办法学得太透彻，像书上讲的那么高大上。所以，我们主要学习就是

### 为什么要使用函数式编程

###

```javascript
var add = (...args) => {
  const addFn = () => addFn;
  addFn.toString = () => {
    return args.reduce((prev, next) => {
      console.log(prev, next);
      return prev + next;
    });
  };
  return addFn;
};

console.log(add(1, 2, 3, 4, 5)); // 15
```
