https://juejin.cn/post/6844904077537574919 面试题

// 考点： **调用resolve或reject并不会终结 Promise 的参数函数的执行。**
const promise = new Promise((resolve, reject) => {
  console.log(1);
  resolve('success')
  console.log(2);
});
promise.then(() => {
  console.log(3);
});
console.log(4);


过程分析：

从上至下，先遇到new Promise，执行其中的同步代码1
再遇到resolve('success')， 将promise的状态改为了resolved并且将值保存下来。  // 
继续执行同步代码2
跳出promise，往下执行，碰到promise.then这个微任务，将其加入微任务队列
执行同步代码4
本轮宏任务全部执行完毕，检查微任务队列，发现promise.then这个微任务且状态为resolved，执行它。

<br>

**promise中并没有resolve或者reject**
const promise = new Promise((resolve, reject) => {
  console.log(1);
  console.log(2);
});
promise.then(() => {
  console.log(3);  // 这里不会执行
});
console.log(4);
和题目二相似，只不过在promise中并没有resolve或者reject
因此promise.then并不会执行，它只有在被改变了状态之后才会执行。


