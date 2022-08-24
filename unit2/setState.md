> 平安蜀黍的前端教程 > React 必学知识点 > setState 任务队列详解

react 这个项目比较大，短期内我们是无法完整地看完整个项目的。所以，在这一部分课程中，我们会有选择地将一些需要理解的知识点拆分出来给大家进行解析。

### 调用 setState

当我们在组件中调用 setState 时，这个 setState 指向的位置就是我们的 component 原型上的 setState 方法，而这个原型的定义则是在 react 目录下的 ReactBaseClasses 文件中：

```javascript
/**
 * 这是用于改变状态的方法，您应该总是使用这个方法来改变this.state里的子集或状态而不是直接修改this.state。我们不能保证调用这个
 * 方法后会立即更新this.state，因此，你调用这个方法后立刻读取this.state可能会返回更新以前的值。因为我们不能保证对'setState'
 * 这个方法的调用会同步运行，它们可能会在最终一起进行批处理。所以您可以提供一个可选的回调，这个回调将在对setState的调用实际完成
 * 时执行。另外，当这个（回调）函数被提供给setState时，它将在未来的某个时间点被调用(不是同步调用)，它在被调用时会带有最新的组件
 * 参数(state, props, context)，需要注意的是，这些值可能会跟你声明这个函数时不太一样。因为你的函数可能会在receiveProps之后
 * 而在shouldComponentUpdate之前被调用，但这个时间可能新的state、props和context还没来得及分配给它。
 *
 * @param {object|function} partialState Next partial state or function to
 *        produce next partial state to be merged with current state.
 * @param {?function} callback Called after state is updated.
 * @final
 * @protected
 */
Component.prototype.setState = function (partialState, callback) {
  // 判断传入的参数是否是一个对象或者是一个函数
  // 如果失败则返回提示：
  // setState只能接受一个要更新的状态对象或者一个可以返回状态对象的函数
  invariant(
    typeof partialState === 'object' ||
      typeof partialState === 'function' ||
      partialState == null,
    'setState(...): takes an object of state variables to update or a ' +
      'function which returns an object of state variables.'
  );
  // 调用updater下的enqueueSetState方法
  // updater是react中的一个用于管理更新队列的方法集: classComponentUpdater，这里对应的方法在react-reconciler目录下
  this.updater.enqueueSetState(this, partialState, callback, 'setState');
};
```

当我们调用 setState 时，意味着组件对应的 fiber 节点产生了一个更新。而 setState 实际上是生成一个 update 对象，调用 enqueueSetState，将这个 update 对象连接到 fiber 节点的 updateQueue [链表](链接待更新)中。

接下来，我们跟着代码走，进入到 react-reconciler 目录下。在 ReactFiberClassComponent 文件中，实现了一个 classComponentUpdate 的对象，这个对象是用于管理类组件的 state 更新接口的，我们在上一段代码中看到的 this.updater 就是它。

```javascript
// ReactFiberClassComponent ...193行起
/**
 * 为类组件定义了一个用于管理state接口的对象，你可以把它理解为我们在上一段代码中看到的this.updater
 */
const classComponentUpdater = {
  // setState队列
  enqueueSetState(inst, payload, callback) {
    // 获取当前触发更新的fiber节点，这个inst是我们传进来的组件实例
    const fiber = getInstance(inst);
    // 获取当前触发更新的时间戳
    const eventTime = requestEventTime();
    // 获取本次更新的优先级
    const lane = requestUpdateLane(fiber);
    // 创建update对象
    const update = createUpdate(eventTime, lane);
    // payload就是setState时传入的第一个参数，回调函数或者是对象的形式。
    // 处理更新时参与计算新状态的过程
    update.payload = payload;
    // 成功回调的处理
    if (callback !== undefined && callback !== null) {
      if (__DEV__) {
        warnOnInvalidCallback(callback, 'setState');
      }
      update.callback = callback;
    }

    // 将update加入到fiber的更新队列enqueueUpdate中
    enqueueUpdate(fiber, update);
    // 开始进行调度
    scheduleUpdateOnFiber(fiber, lane, eventTime);
  },
  // ...
};
```

enqueueSetState 的职责是创建 update 对象，并将它加入 fiber 节点的 update [链表](链接待更新)（updateQueue），然后发起调度。那么，我们先梳理一下代码，看看在 enqueueSetState 中具体做了哪些事情：

#### 找到 fiber

```javascript
// ReactFiberClassComponent.old.js 196 行
const fiber = getInstance(inst);
```

先获取产生更新的组件所对应的 fiber 节点，因为产生的 update 对象需要放到 fiber 节点的 updateQueue 上。

#### 获取更新产生的时间

然后通过检查这个更新是组件内调用还是 js 事件调用来获取当前这个 update 产生的时间。

```javascript
// ReactFiberClassComponent.old.js 197 行
const eventTime = requestEventTime();
// ...
// ReactFiberWorkLoop.old.js 373 行开始
export function requestEventTime() {
  // 这里的&与|都是位运算符，它们的运算方法与我们常见的&&和||不太一样，它需要将运算的值转换成
  // 2 进制的数值，然后比较每一位数字，最后将结果按顺序组合起来
  // & 位与，如果都是 1，则返回 1，否则返回 0
  // | 位或，如果有一个是 1 就返回 1，否则返回 0
  // 比如 2 & 1，它们的二进制分别为 10 和 01，比较结果为 00，所以返回 0
  // 再比如 2 | 1，比较结果为 11，所以返回 3

  // executionContext 调度上下文，如果退出了react这个值就会变成 NoContext;
  // RenderContext 渲染上下文，同上;
  // CommitContext ;

  // 这种情况表示调用setState的代码运行在react生命周期函数中
  if ((executionContext & (RenderContext | CommitContext)) !== NoContext) {
    // 直接返回当前时间即可
    return now();
  }

  // 这种情况表示setState不是来自于react的生命周期，所以无法读取到
  if (currentEventTime !== NoTimestamp) {
    // 使用已有的时间，直到组件被重新部署(不参与排队，直接渲染)
    return currentEventTime;
  }

  // 如果上面都不是，表示这是当前组件初始化完成后发生的第一次更新，需要计算新的开始时间
  currentEventTime = now();
  return currentEventTime;
}
```

#### 计算优先级

计算这个优先级的时候，是如何决定根据什么东西去计算呢？这还得从 React 的合成事件说起。

事件触发时，合成事件机制调用 scheduler 中的 runWithPriority 函数，目的是以这个交互事件所对应的事件优先级去派发真正的事件流程。runWithPriority 会将事件优先级转化为 scheduler 内部的优先级并记录下来。当调用 requestUpdateLane 计算 lane 的时候，会去获取 scheduler 中的优先级，以此作为 lane 计算的依据。

```javascript
// ReactFiberClassComponent.old.js 198 行
const lane = requestUpdateLane(fiber);
// ...
// ReactFiberWorkLoop.old.js 392行起
export function requestUpdateLane(fiber: Fiber): Lane {
  // Special cases
  const mode = fiber.mode;
  if ((mode & BlockingMode) === NoMode) {
    return (SyncLane: Lane);
  } else if ((mode & ConcurrentMode) === NoMode) {
    return getCurrentPriorityLevel() === ImmediateSchedulerPriority
      ? (SyncLane: Lane)
      : (SyncBatchedLane: Lane);
  } else if (
    !deferRenderPhaseUpdateToNextBatch &&
    (executionContext & RenderContext) !== NoContext &&
    workInProgressRootRenderLanes !== NoLanes
  ) {
    // This is a render phase update. These are not officially supported. The
    // old behavior is to give this the same "thread" (expiration time) as
    // whatever is currently rendering. So if you call `setState` on a component
    // that happens later in the same render, it will flush. Ideally, we want to
    // remove the special case and treat them as if they came from an
    // interleaved event. Regardless, this pattern is not officially supported.
    // This behavior is only a fallback. The flag only exists until we can roll
    // out the setState warning, since existing code might accidentally rely on
    // the current behavior.
    /** 直译
     * 这是一个渲染阶段的更新。这些都不受官方支持。旧的做法是给当前呈现的内容相同的“线程”(过期时间)。
     * 如果你在一个组件上调用setState，它会刷新。理想情况下，我们希望删除特殊情况，并将它们视为来
     * 自交叉事件。无论如何，此模式不受官方支持。这种行为只是一种退路。因为现有代码可能会意外地依赖
     * 于当前行为，所以该标志只在我们可以推出setState警告之前存在。
     * */
    return pickArbitraryLane(workInProgressRootRenderLanes);
  }

  // The algorithm for assigning an update to a lane should be stable for all
  // updates at the same priority within the same event. To do this, the inputs
  // to the algorithm must be the same. For example, we use the `renderLanes`
  // to avoid choosing a lane that is already in the middle of rendering.
  //
  // However, the "included" lanes could be mutated in between updates in the
  // same event, like if you perform an update inside `flushSync`. Or any other
  // code path that might call `prepareFreshStack`.
  //
  // The trick we use is to cache the first of each of these inputs within an
  // event. Then reset the cached values once we can be sure the event is over.
  // Our heuristic for that is whenever we enter a concurrent work loop.
  //
  // We'll do the same for `currentEventPendingLanes` below.
  /** 直译
   * 对于同一事件中具有相同优先级的所有更新，分配更新给lane的算法应该是稳定的。要做到这一点，
   * 算法的输入必须是相同的。例如，我们使用“renderLanes”来避免选择已经在渲染中的lane。但是，
   * “included”的lane可能会在同一事件的更新之间发生变化，比如在' flushSync '中执行更新。或者
   * 任何其他可能调用" prepareFreshStack "的代码中。我们使用的技巧是将这些输入中的第
   * 一个缓存到一个事件中。然后在确定事件结束后重置缓存的值。我们的启发式是当我们进入一个并
   * 发的工作循环时。我们将对下面的' currentEventPendingLanes '做同样的操作。
   *
   * 如下代码：
   * onClick = () => {
   *     this.setState({ count: 1 })
   *     this.setState({ count: 2 })
   * }
   * 在React17 和 16版本的行为是不一样的，16版本会将两次setState合并，只发起一次调度，而17则会发起两次
   * 但因为两个setState都来自于同一事件，这意味着它们有相同的事件优先级，第一个setState会发起一次调度，
   * 第二个也会发起一次，但是当第二次计算出的lane无论如何优先级都会低于第一次，在调度的关键
   * 函数ensureRootIsScheduled中，如果新任务的优先级小于等于当前正在渲染的优先级，那么会直接中止新任务
   * 继续调度，复用高优先级的任务，将低优先级的更新一并完成
   *
   * workInProgressRootIncludedLanes就是本次计算lane时之前已经存在的lane，可以理解为上边例子的第一个
   * setState计算出的lane，它会参与第二次setState的lane的计算，使得新lane的位在已有lane位的左边，即优先级
   * 低于已有的lane
   * */
  if (currentEventWipLanes === NoLanes) {
    currentEventWipLanes = workInProgressRootIncludedLanes;
  }

  const isTransition = requestCurrentTransition() !== NoTransition;
  if (isTransition) {
    if (currentEventPendingLanes !== NoLanes) {
      currentEventPendingLanes =
        mostRecentlyUpdatedRoot !== null
          ? mostRecentlyUpdatedRoot.pendingLanes
          : NoLanes;
    }
    return findTransitionLane(currentEventWipLanes, currentEventPendingLanes);
  }

  // TODO: Remove this dependency on the Scheduler priority.
  // To do that, we're replacing it with an update lane priority.
  // 先前事件优先级已经内化为scheduler的优先级，并记录下来了，这一步是获取这个记录下来的优先级
  // 为计算lane做准备
  const schedulerPriority = getCurrentPriorityLevel();

  // The old behavior was using the priority level of the Scheduler.
  // This couples React to the Scheduler internals, so we're replacing it
  // with the currentUpdateLanePriority above. As an example of how this
  // could be problematic, if we're not inside `Scheduler.runWithPriority`,
  // then we'll get the priority of the current running Scheduler task,
  // which is probably not what we want.
  let lane;
  if (
    // TODO: Temporary. We're removing the concept of discrete updates.
    (executionContext & DiscreteEventContext) !== NoContext &&
    schedulerPriority === UserBlockingSchedulerPriority
  ) {
    lane = findUpdateLane(InputDiscreteLanePriority, currentEventWipLanes);
  } else {
    const schedulerLanePriority =
      schedulerPriorityToLanePriority(schedulerPriority);

    if (decoupleUpdatePriorityFromScheduler) {
      // In the new strategy, we will track the current update lane priority
      // inside React and use that priority to select a lane for this update.
      // For now, we're just logging when they're different so we can assess.
      const currentUpdateLanePriority = getCurrentUpdateLanePriority();

      if (
        schedulerLanePriority !== currentUpdateLanePriority &&
        currentUpdateLanePriority !== NoLanePriority
      ) {
        if (__DEV__) {
          console.error(
            'Expected current scheduler lane priority %s to match current update lane priority %s',
            schedulerLanePriority,
            currentUpdateLanePriority
          );
        }
      }
    }
    // 根据优先级和已有的lane去计算新的lane
    lane = findUpdateLane(schedulerLanePriority, currentEventWipLanes);
  }

  return lane;
}
```

#### 创建 update 对象，并将这个对象排入 updateQueue

```javascript
// ReactFiberClassComponent.old.js 200 行
const update = createUpdate(eventTime, lane);
// ...
enqueueUpdate(fiber, update);
// ...
// ReactUpdateQueue.old.js 184 行起
export function createUpdate(eventTime: number, lane: Lane): Update<*> {
  const update: Update<*> = {
    eventTime, // 更新产生的时间
    lane, // 优先级

    tag: UpdateState, // 更新的类型(UpdateState，ReplaceState，ForceUpdate，CaptureUpdate)
    payload: null, // 更新时传入的状态：状态有两种，一种回调，一种对象
    callback: null, // 更新完setState后的回调函数

    next: null, // 指向下一下update的指针
  };
  // 返回update对象
  return update;
}
```

#### 调度前的准备

```javascript
// ReactFiberClassComponent.old.js 201 行
scheduleUpdateOnFiber(fiber, lane, eventTime);
```

React 的更新入口是 scheduleUpdateOnFiber，它用于区分 update 的 lane，将同步更新和异步更新分流后让二者进入各自的流程。但在此之前，它会做一些准备工作：

##### 第一步，检查是否无限更新

比如在 render 里调用了 setState，可以有效避免陷入死循环导致浏览器假死；

##### 第二步，收集 lanes

从产生更新的节点开始，向上循环到根节点(#root)，这一步是用来收集 lanes 并将它们放到父节点的 childLanes 中。如果在这其中有任意节点的 fiber.lanes 不为空，则表示当前这个节点中的内容需要更新，可以继续向下构建；如果没有更新就表示可以直接复用已有的 fiber 树以减少不必要的计算；

##### 第三步，在根节点上标记更新

这一步会将当前 update 的 lane 放到 root.pendingLanes 中，然后在每一次渲染时，通过 root.pendingLanes 中的 lanes 来判断哪些 renderLanes 是最紧急的。

```javascript
// ReactFiberWorkLoop.old.js 517行起
export function scheduleUpdateOnFiber(
  fiber: Fiber,
  lane: Lane,
  eventTime: number
) {
  // 第一步 检查是否无限更新
  checkForNestedUpdates();
  warnAboutRenderPhaseUpdatesInDEV(fiber);

  // 第二步 收集lanes
  const root = markUpdateLaneFromFiberToRoot(fiber, lane);
  if (root === null) {
    warnAboutUpdateOnUnmountedFiberInDEV(fiber);
    return null;
  }

  // 第三步 标记更新
  markRootUpdated(root, lane, eventTime);

  // ...
  // ReactFiberWorkLoop.old.js 562行起
  // TODO: requestUpdateLanePriority also reads the priority. Pass the
  // priority as an argument to that function and this one.
  // 根据Scheduler的优先级获取到对应的React优先级
  const priorityLevel = getCurrentPriorityLevel();

  // 同步更新任务
  if (lane === SyncLane) {
    // 当前没有其它渲染任务在执行
    if (
      (executionContext & LegacyUnbatchedContext) !== NoContext &&
      (executionContext & (RenderContext | CommitContext)) === NoContext
    ) {
      // 将更新操作写入到根节点，避免丢失更新数据
      schedulePendingInteractions(root, lane);
      // 调用performSyncWorkOnRoot开始更新
      performSyncWorkOnRoot(root);
    }
    // 当前已有其它渲染任务在执行
    else {
      // 调用ensureRootIsScheduled重新执行正在更新的任务，同时将新任务插入到这个任务中一起完成
      ensureRootIsScheduled(root, eventTime);
      // 将更新操作写入到根节点，避免丢失更新数据
      schedulePendingInteractions(root, lane);
      if (executionContext === NoContext) {
        resetRenderTimer();
        flushSyncCallbackQueue();
      }
    }
  }
  // 异步更新任务
  else {
    // 通过比较用户阻塞等来判断执行优先等级
    if (
      (executionContext & DiscreteEventContext) !== NoContext &&
      (priorityLevel === UserBlockingSchedulerPriority ||
        priorityLevel === ImmediateSchedulerPriority)
    ) {
      // 如果没有正在执行的任务
      if (rootsWithPendingDiscreteUpdates === null) {
        rootsWithPendingDiscreteUpdates = new Set([root]);
      }
      // 将当前更新添加到已有任务中
      else {
        rootsWithPendingDiscreteUpdates.add(root);
      }
    }
    // 在保持回调同步的情况下调用ensureRootIsScheduled开始更新
    ensureRootIsScheduled(root, eventTime);
    // 将更新操作写入到根节点，避免丢失更新数据
    schedulePendingInteractions(root, lane);
  }
  // ...
}
```

#### 开始调度

在做完所有准备后，scheduleUpdateOnFiber 开始调用 ensureRootIsScheduled 来让 React 任务被调度，这是一个非常重要的函数，它涉及到了同等或较低优先级任务的收敛、高优先级任务插队和任务饥饿等一系列问题。

在开始真正解析 ensureRootIsScheduled 之前，我们需要先了解 React 更新任务的具体实现流程

##### React 任务的本质

一个 update 的产生最终会使 React 在内存中根据现有的 fiber 树构建一棵新的 fiber 树，新的 state 的计算、diff 操作、以及一些生命周期的调用，都会在这个构建过程中进行。这个整体的构建工作被称为 render 阶段，这个 render 阶段整体就是一个完整的 React 更新任务。

更新任务可以看作是执行一个函数，这个函数在 concurrent 模式下就是 performConcurrentWorkOnRoot，更新任务的调度可以看成是这个函数被 scheduler 按照任务优先级安排它何时执行。

> Scheduler 的调度和 React 的调度是两个完全不同的概念，React 的调度是协调任务进入哪种 Scheduler 的调度模式，它的调度并不涉及任务的执行。而 Scheduler 是调度机制的真正核心，它是实打实地去执行任务，没有它，React 的任务再重要也无法执行，希望各位同学加以区分这两种概念。

当一个任务被调度之后，scheduler 就会生成一个任务对象（task），它的结构如下所示：

```javascript
var newTask = {
  id: taskIdCounter++,
  // 任务函数，也就是 performConcurrentWorkOnRoot
  callback,
  // 任务调度优先级，由即将讲到的任务优先级转化而来
  priorityLevel,
  // 任务开始执行的时间点
  startTime,
  // 任务的过期时间
  expirationTime,
  // 在小顶堆任务队列中排序的依据
  sortIndex: -1,
};
```

每当生成了一个这样的任务，它就会被挂载到 root 节点的 callbackNode 属性上，以表示当前已经有任务被调度了，同时会将任务优先级存储到 root 的 callbackPriority 上，表示如果有新的任务进来，必须用它的任务优先级和已有任务的优先级（root.callbackPriority）比较，来决定是否有必要取消已经有的任务。

所以在调度任务的时候，任务优先级是不可或缺的一个重要角色。

##### 任务优先级

任务本身是由更新产生的，因此任务优先级本质上是和 update 的优先级，即 update.lane 有关（只是有关，不一定是由它而来）。得出的任务优先级属于 lanePriority，它不是 update 的 lane，而且与 scheduler 内部的调度优先级是两个概念，React 中的优先级转化关系可以看我总结过的一篇文章：React 中的优先级，我们这里只探讨任务优先级的生成过程。

在 调度准备 的最后提到过，update.lane 会被放入 root.pendingLanes，随后会获取 root.pendingLanes 中最优先级的那些 lanes 作为 renderLanes。任务优先级的生成就发生在计算 renderLanes 的阶段，任务优先级其实就是 renderLanes 对应的 lanePriority。因为 renderLanes 是本次更新的优先级基准，所以它对应的 lanePriority 被作为任务优先级来衡量本次更新任务的优先级权重理所应当。

root.pendingLanes，包含了当前 fiber 树中所有待处理的 update 的 lane。

任务优先级有三类：

- 同步优先级：React 传统的同步渲染模式产生的更新任务所持有的优先级

- 同步批量优先级：同步模式到 concurrent 模式过渡模式：blocking 模式（介绍）产生的更新任务所持有的优先级

- concurrent 模式下的优先级：concurrent 模式产生的更新持有的优先级

最右面的两个 lane 分别为同步优先级和同步批量优先级，剩下左边的 lane 几乎所有都和 concurrent 模式有关。

```javascript
export const SyncLane: Lane = /*                        */ 0b0000000000000000000000000000001;
export const SyncBatchedLane: Lane = /*                 */ 0b0000000000000000000000000000010;

concurrent模式下的lanes：/*                               */ 0b1111111111111111111111111111100;
```

计算 renderLanes 的函数是 getNextLanes，生成任务优先级的函数是 getHighestPriorityLanes

> 任务优先级决定着任务在 React 中被如何调度，而由任务优先级转化成的任务调度优先级（上面给出的 scheduler 的 task 结构中的 priorityLevel），决定着 Scheduler 何时去处理这个任务。

##### 任务调度协调

目前为止我们了解了任务和任务优先级的本质，下面正式进入任务的调度过程。React 这边对任务的调度本质上其实是以任务优先级为基准，去操作多个或单个任务。

多个任务的情况，相对于新任务，会对现有任务进行或复用，或取消的操作，单个任务的情况，对任务进行或同步，或异步，或批量同步（暂时不需要关注） 的调度决策，
这种行为可以看成是一种任务调度协调机制，这种协调通过 ensureRootIsScheduled 去实现。

让我们看一看 ensureRootIsScheduled 函数做的事情，先是准备本次任务调度协调所需要的 lanes 和任务优先级，然后判断是否真的需要调度

- 获取 root.callbackNode，即旧任务

- 检查任务是否过期，将过期任务放入 root.expiredLanes，目的是让过期任务能够以同步优先级去进入调度（立即执行）

- 获取 renderLanes（优先从 root.expiredLanes 获取），如果 renderLanes 是空的，说明不需要调度，直接 return 掉

- 获取本次任务，即新任务的优先级：newCallbackPriority

接下来是协调任务调度的过程：

- 首先判断是否有必要发起一次新调度，方法是通过比较新任务的优先级和旧任务的优先级是否相等：

- > 相等，则说明无需再次发起一次调度，直接复用旧任务即可，让旧任务在处理更新的时候顺便把新任务给做了。

- > 不相等，则说明新任务的优先级一定高于旧任务，这种情况就是高优先级任务插队，需要把旧任务取消掉。

- 真正发起调度，看新任务的任务优先级：

- > 同步优先级：调用 scheduleSyncCallback 去同步执行任务。

- > 同步批量执行：调用 scheduleCallback 将任务以立即执行的优先级去加入调度。

- > 属于 concurrent 模式的优先级：调用 scheduleCallback 将任务以上面获取到的新任务优先级去加入调度。

这里还有两点需要说明：

1. 为什么新旧任务的优先级如果不相等，那么新任务的优先级一定高于旧任务？

这是因为每次调度去获取任务优先级的时候，都只获取 root.pendingLanes 中最紧急的那部分 lanes 对应的优先级，低优先级的 update 持有的 lane 对应的优先级是无法被获取到的。通过这种办法，可以将来自同一事件中的多个更新收敛到一个任务中去执行，言外之意就是同一个事件触发的多次更新的优先级是一样的，没必要发起多次任务调度。例如在一个事件中多次调用 setState:

```javascript
class Demo extends React.Component {
  state = {
    count: 0,
  };

  onClick = () => {
    this.setState({ count: 1 });
    this.setState({ count: 2 });
  };

  render() {
    return <button onClick={onClick}>{this.state.count}</button>;
  }
}
```

页面上会直接显示出 2，虽然 onClick 事件调用了两次 setState，但只会引起一次调度，设置 count 为 2 的那次调度被因为优先级与设置 count 为 1 的那次任务的优先级相同，
所以没有去再次发起调度，而是复用了已有任务。这是 React17 对于多次 setState 优化实现的改变，之前是通过 batchingUpdate 这种机制实现的。

2. 三种任务优先级的调度模式有何区别，行为表现上如何？

- 同步优先级：传统的 React 同步渲染模式和过期任务的调度。通过 React 提供的 scheduleSyncCallback 函数将任务函数 performSyncWorkOnRoot 加入到 React 自己的同步队列（syncQueue）中，之后以 ImmediateSchedulerPriority 的优先级将循环执行 syncQueue 的函数加入到 scheduler 中，目的是让任务在下一次事件循环中被执行掉。但是因为 React 的控制，这种模式下的时间片会在任务都执行完之后再去检查，表现为没有时间片。

- 同步批量执行：同步渲染模式到 concurrent 渲染模式的过渡模式 blocking 模式，会将任务函数 performSyncWorkOnRoot 以 ImmediateSchedulerPriority 的优先级加入到 scheduler 中，也是让任务在下一次事件循环中被执行掉，也不会有时间片的表现。

- 属于 concurrent 模式的优先级：将任务函数 performConcurrentWorkOnRoot 以任务自己的优先级加入到 scheduler 中，scheduler 内部的会通过这个优先级控制该任务在 scheduler 内部任务队列中的排序，从而决定任务合适被执行，而且任务真正执行时会有时间片的表现，可以发挥出 scheduler 异步可中断调度的真正威力。

> 要注意一点，用来做新旧任务比较的优先级与这里将任务加入到 scheduler 中传入的优先级不是一个，后者可由前者通过 lanePriorityToSchedulerPriority 转化而来。

经过以上的分析，相信大家已经对 ensureRootIsScheduled 的运行机制比较清晰了，现在让我们再看一下它的实现

```javascript
function ensureRootIsScheduled(root: FiberRoot, currentTime: number) {
  // 获取旧任务
  const existingCallbackNode = root.callbackNode;

  // 记录任务的过期时间，检查是否有过期任务，有则立即将它放到root.expiredLanes，
  // 便于接下来将这个任务以同步模式立即调度
  markStarvedLanesAsExpired(root, currentTime);

  // 获取renderLanes
  const nextLanes = getNextLanes(
    root,
    root === workInProgressRoot ? workInProgressRootRenderLanes : NoLanes
  );

  // 获取renderLanes对应的任务优先级
  const newCallbackPriority = returnNextLanesPriority();

  if (nextLanes === NoLanes) {
    // 如果渲染优先级为空，则不需要调度
    if (existingCallbackNode !== null) {
      cancelCallback(existingCallbackNode);
      root.callbackNode = null;
      root.callbackPriority = NoLanePriority;
    }
    return;
  }

  // 如果存在旧任务，那么看一下能否复用
  if (existingCallbackNode !== null) {
    // 获取旧任务的优先级
    const existingCallbackPriority = root.callbackPriority;

    // 如果新旧任务的优先级相同，则无需调度
    if (existingCallbackPriority === newCallbackPriority) {
      return;
    }
    // 代码执行到这里说明新任务的优先级高于旧任务的优先级
    // 取消掉旧任务，实现高优先级任务插队
    cancelCallback(existingCallbackNode);
  }

  // 调度一个新任务
  let newCallbackNode;
  if (newCallbackPriority === SyncLanePriority) {
    // 若新任务的优先级为同步优先级，则同步调度，传统的同步渲染和过期任务会走这里
    newCallbackNode = scheduleSyncCallback(
      performSyncWorkOnRoot.bind(null, root)
    );
  } else if (newCallbackPriority === SyncBatchedLanePriority) {
    // 同步模式到concurrent模式的过渡模式：blocking模式会走这里
    newCallbackNode = scheduleCallback(
      ImmediateSchedulerPriority,
      performSyncWorkOnRoot.bind(null, root)
    );
  } else {
    // concurrent模式的渲染会走这里

    // 根据任务优先级获取Scheduler的调度优先级
    const schedulerPriorityLevel =
      lanePriorityToSchedulerPriority(newCallbackPriority);

    // 计算出调度优先级之后，开始让Scheduler调度React的更新任务
    newCallbackNode = scheduleCallback(
      schedulerPriorityLevel,
      performConcurrentWorkOnRoot.bind(null, root)
    );
  }

  // 更新root上的任务优先级和任务，以便下次发起调度时候可以获取到
  root.callbackPriority = newCallbackPriority;
  root.callbackNode = newCallbackNode;
}
```

ensureRootIsScheduled 实际上是在任务调度层面整合了高优先级任务的插队和任务饥饿问题的关键逻辑，这只是宏观层面的决策，决策背后的原因是 React 处理更新时
对于不同优先级的 update 的取舍以及对 root.pendingLanes 的标记操作，这需要我们下沉到执行更新任务的过程中。

#### 处理更新

一旦有更新产生，update 对象就会被放入 updateQueue 并挂载到 fiber 节点上。构建 fiber 树时，会带着 renderLanes 去处理 updateQueue，在 beginWork 阶段，对于类组件
会调用 processUpdateQueue 函数，逐个处理这个链表上的每个 update 对象，计算新的状态，一旦 update 持有的优先级不够，那么就会跳过这个 update 的处理，并把这个被跳过的 update 的 lane 放到 fiber.lanes 中，好在 completeWork 阶段收集起来。

循环 updateQueue 去计算状态的过程实际上较为复杂，因为低优先级 update 会被跳过并且会重做，所以这涉及到最终状态统一的问题，关于这一过程的原理解读在我的这篇文章里：扒一扒 React 计算状态的原理，在本篇文章中只关注优先级相关的部分。

关于优先级的部分比较好理解，就是只处理优先级足够的 update，跳过那些优先级不足的 update，并且将这些 update 的 lane 放到 fiber.lanes 中。我们直接来看一下实现：

```javascript
function processUpdateQueue<State>(
  workInProgress: Fiber,
  props: any,
  instance: any,
  renderLanes: Lanes,
): void {

  ...

  if (firstBaseUpdate !== null) {
    let update = firstBaseUpdate;
    do {
      const updateLane = update.lane;
      // isSubsetOfLanes函数的意义是，判断当前更新的优先级（updateLane）
      // 是否在渲染优先级（renderLanes）中如果不在，那么就说明优先级不足
      if (!isSubsetOfLanes(renderLanes, updateLane)) {

      // ...

        /*
        *
        * newLanes会在最后被赋值到workInProgress.lanes上，而它又最终
        * 会被收集到root.pendingLanes。
        *
        * 再次更新时会从root上的pendingLanes中找出应该在本次中更新的优先
        * 级（renderLanes），renderLanes含有本次跳过的优先级，再次进入，
        * processUpdateQueue wip的优先级符合要求，被更新掉，低优先级任务
        * 因此被重做
        * */
        newLanes = mergeLanes(newLanes, updateLane);
      } else {

        // 优先级足够，去计算state
        ...

      }
    } while (true);

    // 将newLanes赋值给workInProgress.lanes，
    // 就是将被跳过的update的lane放到fiber.lanes
    workInProgress.lanes = newLanes;

  }
}

```

只处理优先级足够的 update 是让高优先级任务被执行掉的最本质原因，在循环了一次 updateQueue 之后，那些被跳过的 update 的 lane 又被放入了 fiber.lanes，现在，只需要将它放到 root.pendingLanes 中，就能表示在本轮更新后，仍然有任务未被处理，从而实现低优先级任务被重新调度。所以接下来的过程就是 fiber 节点的完成阶段：completeWork 阶段去收集这些 lanes。

#### 收集未被处理的 lane

在 completeUnitOfWork 的时候，fiber.lanes 和 childLanes 被一层一层收集到父级 fiber 的 childLanes 中，该过程发生在 completeUnitOfWork 函数中调用的 resetChildLanes，它循环 fiber 节点的子树，将子节点及其兄弟节点中的 lanes 和 childLanes 收集到当前正在 complete 阶段的 fiber 节点上的 childLanes。

```jsx
<root>
  {/* pendingLanes: 0b01110 */}
  <div>
    {/* childLanes: 0b01110 */}
    <ul>
      {/* lanes: 0b00010 */}
      {/* childLanes: 0b01000 */}
      <li />
    </ul>
    <table>
      {/* lanes: 0b00100 */}
      <tr>
        <td />
      </tr>
    </table>
    <p />
  </div>
</root>
```

假设第 3 层中的<ul>和<table>组件都分别有 update 因为优先级不够而被跳过，那么在它们父级的 div fiber 节点 completeUnitOfWork 的时候，会调用 resetChildLanes 把它俩的 lanes 收集到 div fiber.childLanes 中，最终把所有的 lanes 收集到 root.pendingLanes.

```javascript
// ReactFiberWorkLoop.old.js 1670行起
function completeUnitOfWork(unitOfWork: Fiber): void {
  // 已经结束beginWork阶段的fiber节点被称为completedWork
  let completedWork = unitOfWork;
  do {
    // 向上一直循环到root的过程
    // ...
    // fiber节点的.flags上没有Incomplete，说明是正常完成了工作
    if ((completedWork.flags & Incomplete) === NoFlags) {
      // ...
      // 调用resetChildLanes去收集lanes
      resetChildLanes(completedWork);
      // ...
    } else {
      /*...*/
    }
    // ...
  } while (completedWork !== null);
  // ...
}
```

在每一次往上循环的时候，都会调用 resetChildLanes，目的是将 fiber.childLanes 层层收集。

```javascript
// ReactFiberWorkLoop.old.js 1804行起
function resetChildLanes(completedWork: Fiber) {
  // ...
  let newChildLanes = NoLanes;
  if (enableProfilerTimer && (completedWork.mode & ProfileMode) !== NoMode) {
    // profile相关，无需关注
  } else {
    // 循环子节点和兄弟节点，收集lanes
    let child = completedWork.child;
    while (child !== null) {
      // 收集过程
      newChildLanes = mergeLanes(
        newChildLanes,
        mergeLanes(child.lanes, child.childLanes)
      );
      child = child.sibling;
    }
  }
  // 将收集到的lanes放到该fiber节点的childLanes中
  completedWork.childLanes = newChildLanes;
}
```

resetChildLanes 中只收集当前正在 complete 的 fiber 节点的子节点和兄弟节点的 lanes 以及 childLanes。最后将这些收集到的 childLanes 放到 root.pendingLanes 的过程，是发生在本次更新的 commit 阶段中，因为 render 阶段的渲染优先级来自 root.pendingLanes，不能随意地修改它。所以要在 render 阶段之后的 commit 阶段去修改。我们看一下 commitRootImpl 中这个过程的实现：

```javascript
function commitRootImpl(root, renderPriorityLevel) {
  // 将收集到的childLanes，连同root自己的lanes，一并赋值给remainingLanes
  let remainingLanes = mergeLanes(finishedWork.lanes, finishedWork.childLanes);
  // markRootFinished中会将remainingLanes赋值给remainingLanes
  markRootFinished(root, remainingLanes);
  // ...
}
```

#### 重新发起调度

至此，我们将低优先级任务的 lane 重新收集到了 root.pendingLanes 中，这时只需要再发起一次调度就可以了，通过在 commit 阶段再次调用 ensureRootIsScheduled 去实现，这样就又会走一遍调度的流程，低优先级任务被执行。

```javascript
function commitRootImpl(root, renderPriorityLevel) {
  // 将收集到的childLanes，连同root自己的lanes，一并赋值给remainingLanes
  let remainingLanes = mergeLanes(finishedWork.lanes, finishedWork.childLanes);
  // markRootFinished中会将remainingLanes赋值给remainingLanes
  markRootFinished(root, remainingLanes);
  // ...
  // 在每次所有更新完成的时候都会调用这个ensureRootIsScheduled
  // 以保证root上任何的pendingLanes都能被处理
  ensureRootIsScheduled(root, now());
}
```

---

### 练习：模拟实现一个简单的 setState

在早期版本的 React 的 setState 函数实现中, 会根据一个变量 isBatchingUpdates (yisibaiqinapudeici)判断是直接更新 this.state 还是放到 enqueueSetState(enkuiseitesidete) 队列中, isBatchingUpdates 默认值是 false, 也就表示 setState 会同步更新 this.state。

但是 setState 中有一个函数 batchedUpdates(baiqindeapudeici), 这个函数会把 isBatchingUpdates 修改为 true, 而当 React 在进行队列事件处理之前就会调用这个 batchedUpdates 函数, 造成的后果, 就是由 React 在接收到一个 setState 请求时, 不会直接更新 state。关于 isBatchingUpdates 方法，除了 enqueueSetState 队列更新时会调用 batchedUpdates 来标记当前更新状态, 所有的 React 生命周期函数在执行的时候也会修改 isBatchingUpdates 的值为 true。

最后有一种例外不得不提的是，当我们在一些类似于 setTimeout(setaimuaote) 这种异步函数中执行 setState 时, 因为 React 无法感知我们的渲染顺序, 所以它放弃了修改 isBatchingUpdates 而是直接更新了 state。

```javascript
// 为了看清代码执行步骤，在这定义一个无用的变量
let step = 1;
// 定义一个状态树
let oldState = { msg: '原始值' };
// 定义一个用于判断是否正在执行setState事件的标记
let isBatchingUpdates = false; // false表示未更新
// 定义一个队列，用于储存所有的setState调用
let enqueueSetState = [];
// 定义一个队列，用于储存setState第二个参数，也就是更新完成的回调函数
let callbackList = [];
// 定义一个方法，模拟React.setState方法
function mySetState(state, callback) {
  // 将当前需要更新的state存入setState队列
  if (state) {
    Object.prototype.toString.call(state) === '[object Object]' &&
      enqueueSetState.push(state);
  } else {
    console.log('%c递归调用，没有传值', 'color:#f00');
  }
  console.log(
    `%c看看它们调用的顺序:${step} ${JSON.stringify(
      state ? state : '这是函数内部调用的'
    )}`,
    'color: #060'
  );
  step += 1;
  // 如果有回调函数把回调函数则存入回调队列里
  callback &&
    // 这里是判断它是否是一个函数，只有当它是函数时才存储，避免无法执行报错
    Object.prototype.toString.call(callback) === '[object Function]' &&
    callbackList.push(callback);

  // 判断是否正在更新,如果正在更新，等待更新完成后第45行的调用
  if (isBatchingUpdates) {
    console.log(`%c看看谁被挡出去了${JSON.stringify(state)}`, 'color:#00f');
    return;
  }
  // 修改状态表示正在更新state，新加入队列的setState不再进行处理
  // 因为前面已经将state存入了enqueueSetState队列，所以不用担心这个state会丢失
  isBatchingUpdates = true;

  // 创建一个队列副本
  // 这个副本的作用是避免当我们对enqueueSetState队列进行操作时，有新的setState命令进入导致队列长度发生变化
  const newSetState = [...enqueueSetState];
  // 清空原有队列，保证当新的setState命令进入时不与原有操作发生冲突
  enqueueSetState = [];
  const newCallback = [...callbackList];
  callbackList = [];

  // 写state的方法
  function setState(state) {
    // 使用新的state覆盖旧的state
    oldState = Object.assign(oldState, state);
    // 打印结果
    console.log('%c处理完毕，over!', 'color: #909');
    // 检查是否有回调，如果有，执行它
    for (let cb of newCallback) {
      cb(oldState);
    }
  }
  console.log('主线程执行到这，mysetState已经执行完成，被弹出');
  setTimeout(() => {
    // 如果没有在更新状态，开始处理数据
    const newState = newSetState.reduce((prev, next) => {
      return Object.assign(prev, next);
    }, {});
    console.log('看看有哪些数据被合并了', newSetState);
    // 数据合并完成，写入当前state
    setState(newState);

    // 数据写入完成，修改更新状态，表示可以进行另一个队列的操作了
    isBatchingUpdates = false;
    // 检查是不是还有数据在排队，如果有排队的，从头再来
    if (enqueueSetState.length) {
      mySetState();
    }
  });
}
mySetState({ msg: '哥是第一个,后来的等着' }, state => {
  console.log('第一步更新完成', state);
});
mySetState({ msg: '后来的排个队' }, state => {
  console.log('第二步更新完成', state);
});
mySetState({ msg: '排队ing...' }, state => {
  console.log('第三步更新完成', state);
});
setTimeout(() => {
  mySetState({ msg: '又没赶上。。继续排队ing...' }, state => {
    console.log('第四步更新完成', state);
  });
});
setTimeout(() => {
  mySetState({ msg: 'me too...' }, state => {
    console.log('第五步更新完成', state);
  });
});
```

上面这段代码比较简单，只是让大家理解 setState 的异步操作是怎样实现的，真实的 setState 源码可以看这里
[setState 源码](setState.md)

什么是组件，什么是 state，这两个问题，这是 react 运行的基本构成，大家一定要有自己的理解，后续才能更好地学习接下来的内容。不一定要精确地描述出来，但要大致能说清逻辑。

setState 是一个很灵活的方法，它接受两个参数，参数一可以是一个 state 对象，也可以是一个实时返回 state 对象的函数，参数二是一个回调，用于实时获取改变后的 state 进行更多的业务处理

然后，setState 的简单描述也要记一下，最好是把这些英文单词发音都背下来，这样面试时一旦问起，你娴熟的术语描述将会大大提升你在面试官眼中的形象，关键是，这段描述代表着你已经把 setState 的这段代码看完且理解了。

### 总结

在 17.0.2 版本的 setState 中，整体明高优先级任务插队，低优先级任务重做的整个过程共有四个关键点：

- ensureRootIsScheduled 取消已有的低优先级更新任务，重新调度一个任务去做高优先级更新，并以 root.pendingLanes 中最重要的那部分 lanes 作为渲染优先级
- 执行更新任务时跳过 updateQueue 中的低优先级 update，并将它的 lane 标记到 fiber.lanes 中。
- fiber 节点的 complete 阶段收集 fiber.lanes 到父级 fiber 的 childLanes，一直到 root。
- commit 阶段将所有 root.childLanes 连同 root.lanes 一并赋值给 root.pendingLanes。
- commit 阶段的最后重新发起调度。

整个流程始终以高优先级任务为重，顾全大局，最能够体现 React 提升用户体验的决心。
