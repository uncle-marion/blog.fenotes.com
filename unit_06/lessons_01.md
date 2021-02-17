> 企业项目实战 > React 函数式编程 > React Hooks

### 一个复杂的 hooks 实现

在前面的课程里，我们学会了使用 useScroll 来判断列表的滚动，然后去通过计算 scrollTop 来判断是否需要加载新的数据，因为需要监听浏览器的 scroll 事件，所以它很繁琐也很费资源。今天我们来学习一个比较复杂的无限下拉列表的实现，使用 react hook 与 IntersectionObserver。

#### 交叉观察者：IntersectionObserver

IntersectionObserver，是一个全新的浏览器 api，用于判断某个元素是否正在当前显示区域内，目前来说除了早期的 IE，大多数的浏览器都已经支持它了。

https://developer.mozilla.org/zh-CN/docs/Web/API/IntersectionObserver

```javascript
import React, { useState, useEffect, useRef } from 'react';
import './style.less';
const THRESHOLD = 15;
/**
 * 无限下拉列表组件
 * @param {*} props
 * @param {*} props.list
 */
function InfiniteScrollList(props) {
  // 定义列表最开始的下标
  const [start, setStart] = useState(0);
  // 定义列表结束的下标
  const [end, setEnd] = useState(THRESHOLD);
  // 配置观察者
  const [observer, setObserver] = useState(null);
  // 定义头部和底部的被观察者
  const btmRef = useRef();
  const topRef = useRef();

  useEffect(() => {
    // 开启观察者
    intiateScrollObserver();
    return () => {
      // 退出观察者
      resetObservation();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [start, end]);

  function intiateScrollObserver() {
    // 配置观察者
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1,
    };
    // 初始化观察者
    const Observer = new IntersectionObserver(callback, options);
    // 观察列表头部
    if (topRef.current) {
      Observer.observe(topRef.current);
    }
    // 观察列表底部
    if (btmRef.current) {
      Observer.observe(btmRef.current);
    }
    setObserver(Observer);
  }

  /**
   * 交叉观察的具体回调
   * @param {*} entries
   * @param {*} observer
   */
  function callback(entries, observer) {
    entries.forEach((entry, index) => {
      const listLength = props.list.length;
      // 向下滚动，
      if (entry.isIntersecting && entry.target.id === 'bottom') {
        const maxStartIndex = listLength - 1 - THRESHOLD; // Maximum index value `start` can take
        const maxEndIndex = listLength - 1; // Maximum index value `end` can take
        const newEnd = end + 10 <= maxEndIndex ? end + 10 : maxEndIndex;
        const newStart = end - 5 <= maxStartIndex ? end - 5 : maxStartIndex;
        setStart(newStart);
        setEnd(newEnd);
      }
      // 向上滚动
      if (entry.isIntersecting && entry.target.id === 'top') {
        const newEnd =
          end === THRESHOLD
            ? THRESHOLD
            : end - 10 > THRESHOLD
            ? end - 10
            : THRESHOLD;
        let newStart = start === 0 ? 0 : start - 10 > 0 ? start - 10 : 0;
        setStart(newStart);
        setEnd(newEnd);
      }
    });
  }

  /**
   * 停止滚动时退出观察
   */
  function resetObservation() {
    observer && observer.unobserve(btmRef.current);
    observer && observer.unobserve(topRef.current);
  }
  /**
   * 判断是否需要观察当前元素
   * @param {*} index
   * @param {*} isLastIndex
   */
  function getReference(index, isLastIndex) {
    if (index === 0) return topRef;
    if (isLastIndex) return btmRef;
    return null;
  }

  const { list, height } = props;
  // 取当前匹配的列表元素用于渲染
  const updatedList = list.slice(start, end);
  // 当前列表的最后一个下标
  const lastIndex = updatedList.length - 1;

  return (
    <ul style={{ position: 'relative' }}>
      {updatedList.map((item, index) => {
        const top = height * (index + start) + 'px';
        const refVal = getReference(index, index === lastIndex);
        const id = index === 0 ? 'top' : index === lastIndex ? 'bottom' : '';
        return (
          <li
            className="li-card"
            key={item.key}
            style={{ top }}
            ref={refVal}
            id={id}
          >
            {item.key}
            {item.value}
          </li>
        );
      })}
    </ul>
  );
}

const list = [
  {
    key: 1,
    value: 'A',
  },
  {
    key: 2,
    value: 'B',
  },
  {
    key: 3,
    value: 'C',
  },
  {
    key: 4,
    value: 'A',
  },
  {
    key: 5,
    value: 'B',
  },
  {
    key: 6,
    value: 'C',
  },
  {
    key: 7,
    value: 'A',
  },
  {
    key: 8,
    value: 'B',
  },
  {
    key: 9,
    value: 'C',
  },
  {
    key: 10,
    value: 'A',
  },
  {
    key: 11,
    value: 'B',
  },
  {
    key: 12,
    value: 'C',
  },
  {
    key: 13,
    value: 'A',
  },
  {
    key: 14,
    value: 'B',
  },
  {
    key: 15,
    value: 'C',
  },
  {
    key: 16,
    value: 'A',
  },
  {
    key: 17,
    value: 'B',
  },
  {
    key: 18,
    value: 'C',
  },
  {
    key: 19,
    value: 'A',
  },
  {
    key: 20,
    value: 'B',
  },
  {
    key: 21,
    value: 'C',
  },
  {
    key: 22,
    value: 'A',
  },
  {
    key: 23,
    value: 'B',
  },
  {
    key: 24,
    value: 'C',
  },
  {
    key: 25,
    value: 'A',
  },
  {
    key: 26,
    value: 'B',
  },
  {
    key: 27,
    value: 'C',
  },
  {
    key: 28,
    value: 'A',
  },
  {
    key: 29,
    value: 'B',
  },
  {
    key: 30,
    value: 'C',
  },
  {
    key: 31,
    value: 'A',
  },
  {
    key: 32,
    value: 'B',
  },
  {
    key: 33,
    value: 'C',
  },
  {
    key: 34,
    value: 'A',
  },
  {
    key: 35,
    value: 'B',
  },
  {
    key: 36,
    value: 'C',
  },
  {
    key: 37,
    value: 'A',
  },
  {
    key: 38,
    value: 'B',
  },
  {
    key: 39,
    value: 'C',
  },
  {
    key: 40,
    value: 'A',
  },
  {
    key: 41,
    value: 'B',
  },
  {
    key: 42,
    value: 'C',
  },
  {
    key: 43,
    value: 'A',
  },
  {
    key: 44,
    value: 'B',
  },
  {
    key: 45,
    value: 'C',
  },
  {
    key: 46,
    value: 'A',
  },
  {
    key: 47,
    value: 'B',
  },
  {
    key: 48,
    value: 'C',
  },
  {
    key: 49,
    value: 'A',
  },
  {
    key: 50,
    value: 'B',
  },
  {
    key: 51,
    value: 'C',
  },
];

export default function Home() {
  return (
    <div className="infinite-list">
      <h1>交叉观察者模式实现无限下拉</h1>
      <InfiniteScrollList list={list} height={195} />
    </div>
  );
}
```
