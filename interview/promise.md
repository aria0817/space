https://juejin.cn/post/6844904077537574919 面试题
**我们知道如果直接在脚本文件中定义一个Promise，它构造函数的第一个参数是会立即执行的**
### 1
// 考点： **调用resolve或reject并不会终结 Promise 的参数函数的执行。**

```
const promise = new Promise((resolve, reject) => {
  console.log(1);
  resolve('success')
  console.log(2);
});
promise.then(() => {
  console.log(3);
});
console.log(4);

```
过程分析：

从上至下，先遇到new Promise，执行其中的同步代码1
再遇到resolve('success')， 将promise的状态改为了resolved并且将值保存下来。  // 
继续执行同步代码2
跳出promise，往下执行，碰到promise.then这个微任务，将其加入微任务队列
执行同步代码4
本轮宏任务全部执行完毕，检查微任务队列，发现promise.then这个微任务且状态为resolved，执行它。

<br>

### 2
**promise中并没有resolve或者reject**
```
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
```

// 1 2 4 

### 3
```
const promise1 = new Promise((resolve, reject) => {
  console.log('promise1')
  resolve('resolve1')
})
const promise2 = promise1.then(res => {
  console.log(res)
})
console.log('1', promise1);
console.log('2', promise2);

// promise1
// 1 Promise{<resolve>:'resolve1'} 
// 2  Promise{<pending>} 
// resolve1
```

从上至下，先遇到new Promise，执行该构造函数中的代码promise1
碰到resolve函数, 将promise1的状态改变为resolved, 并将结果保存下来
碰到promise1.then这个微任务，将它放入微任务队列
promise2是一个新的状态为pending的Promise
执行同步代码1， 同时打印出promise1的状态是resolved
执行同步代码2，同时打印出promise2的状态是pending
宏任务执行完毕，查找微任务队列，发现promise1.then这个微任务且状态为resolved，执行它。



### 4
```
const fn = () =>
  new Promise((resolve, reject) => {
    console.log(1);
    resolve("success");
  });
console.log("start");
fn().then(res => {
  console.log(res);
});
// start 1 success 
```
如果new Promise()包裹在函数中，只有在函数调用的时候才会执行。所以先打印出来的是start


### 和定时器结合
1. 
```
const promise = new Promise((resolve, reject) => {
  console.log(1);
  setTimeout(() => {
    console.log("timerStart");
    resolve("success");
    console.log("timerEnd");
  }, 0);
  console.log(2);
});
promise.then((res) => {
  console.log(res);
});
console.log(4);


// 1 2  4   timerStart timerEnd success
```
从上至下，先遇到new Promise，执行该构造函数中的代码1
然后碰到了定时器，将这个定时器中的函数放到下一个宏任务的延迟队列中等待执行
执行同步代码2
跳出promise函数，遇到promise.then，但其状态还是为pending，这里理解为先不执行
执行同步代码4
一轮循环过后，进入第二次宏任务，发现延迟队列中有setTimeout定时器，执行它
首先执行timerStart，然后遇到了resolve，将promise的状态改为resolved且保存结果并将之前的promise.then推入微任务队列
继续执行同步代码timerEnd
宏任务全部执行完毕，查找微任务队列，发现promise.then这个微任务，执行它。

2. 
// 任务队列是先进先出 所以先执行的是先入队列的定时器
```
setTimeout(() => {
  console.log('timer1');
  setTimeout(() => {
    console.log('timer3')
  }, 0)
}, 0)
setTimeout(() => {
  console.log('timer2')
}, 0)
console.log('start')

// start  timer1 timer2 timer3

// 当这一轮所有微任务全部执行完了以后才能进入下一个宏任务
setTimeout(() => {
  console.log('timer1');
  Promise.resolve().then(() => {
    console.log('promise')
  })
}, 0)
setTimeout(() => {
  console.log('timer2')
}, 0)
console.log('start')
// start timer1 promise timer2


const promise1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('success')
  }, 1000)
})
const promise2 = promise1.then(() => {
  throw new Error('error!!!')
})
console.log('promise1', promise1)
console.log('promise2', promise2)
setTimeout(() => {
  console.log('promise1', promise1)
  console.log('promise2', promise2)
}, 2000)

```

从上至下，先执行第一个new Promise中的函数，碰到setTimeout将它加入下一个宏任务列表
跳出new Promise，碰到promise1.then这个微任务，但其状态还是为pending，这里理解为先不执行
promise2是一个新的状态为pending的Promise
执行同步代码console.log('promise1')，且打印出的promise1的状态为pending
执行同步代码console.log('promise2')，且打印出的promise2的状态为pending
碰到第二个定时器，将其放入下一个宏任务列表
第一轮宏任务执行结束，并且没有微任务需要执行，因此执行第二轮宏任务
先执行第一个定时器里的内容，将promise1的状态改为resolved且保存结果并将之前的promise1.then推入微任务队列
该定时器中没有其它的同步代码可执行，因此执行本轮的微任务队列，也就是promise1.then，它抛出了一个错误，且将promise2的状态设置为了rejected
第一个定时器执行完毕，开始执行第二个定时器中的内容
打印出'promise1'，且此时promise1的状态为resolved
打印出'promise2'，且此时promise2的状态为rejected

<!-- 'promise1' Promise{<pending>}
'promise2' Promise{<pending>}
test5.html:102 Uncaught (in promise) Error: error!!! at test.html:102
'promise1' Promise{<resolved>: "success"}
'promise2' Promise{<rejected>: Error: error!!!} -->


### promise的then catch reject
```
const promise = new Promise((resolve, reject) => {
  resolve("success1");
  reject("error");
  resolve("success2");
});
promise
.then(res => {
    console.log("then: ", res);
  }).catch(err => {
    console.log("catch: ", err);
  })
// Promise的状态一经改变就不能再改变
"then: success1"


const promise = new Promise((resolve, reject) => {
  reject("error");
  resolve("success2");
});
promise
.then(res => {
    console.log("then1: ", res);
  }).then(res => {
    console.log("then2: ", res);
  }).catch(err => {
    console.log("catch: ", err);
  }).then(res => {
    console.log("then3: ", res);
  })

// "catch: " "error"
// "then3: " undefined
```
catch不管被连接到哪里，都能捕获上层未捕捉过的错误。
catch()也会返回一个Promise，且由于这个Promise没有返回值，所以打印出来的是undefined。

```
Promise.resolve(1)
  .then(res => {
    console.log(res);
    return 2;
  })
  .catch(err => {
    return 3;
  })
  .then(res => {
    console.log(res);
  });
// 1 2
```
Promise可以链式调用，不过promise 每次调用 .then 或者 .catch 都会返回一个新的 promise，从而实现了链式调用, 它并不像一般我们任务的链式调用一样return this。
因为resolve(1)之后走的是第一个then方法，并没有走catch里，所以第二个then中的res得到的实际上是第一个then的返回值。
且return 2会被包装成resolve(2)。


3. 
```
Promise.reject(1)
  .then(res => {
    console.log(res);
    return 2;
  })
  .catch(err => {
    console.log(err);
    return 3
  })
  .then(res => {
    console.log(res);
  });

// 1 3 
```
//reject(1)此时走的就是catch，且第二个then中的res得到的就是catch中的返回值。

4. 
```
const promise = new Promise((resolve, reject) => {
  setTimeout(() => {
    console.log('timer')
    resolve('success')
  }, 1000)
})
const start = Date.now();
promise.then(res => {
  console.log(res, Date.now() - start)
})
promise.then(res => {
  console.log(res, Date.now() - start)
})
// 'timer'
// 'success' 1001
// 'success' 1002
```
当然，如果你足够快的话，也可能两个都是1001。
Promise 的 .then 或者 .catch 可以被调用多次，但这里 Promise 构造函数只执行一次。或者说 promise 内部状态一经改变，并且有了一个值，那么后续每次调用 .then 或者 .catch 都会直接拿到该值。

5. 
```
Promise.resolve().then(() => {
  return new Error('error!!!')
}).then(res => {
  console.log("then: ", res)
}).catch(err => {
  console.log("catch: ", err)
})
// "then: " "Error: error!!!"
```
任意一个非 promise 的值都会被包裹成 promise 对象，因此这里的return new Error('error!!!')也被包裹成了return Promise.resolve(new Error('error!!!'))。

6. 
```
const promise = Promise.resolve().then(() => {
  return promise;
})
promise.catch(console.err)

//Uncaught (in promise) TypeError: Chaining cycle detected for promise #<Promise>
```
**.then 或 .catch 返回的值不能是 promise 本身，否则会造成死循环。**


### Promise中的all和race
all vs race
除非all中所有都resolve才会resolve，并且在所有异步操作执行完后才执行回调。
race是其中一个resolve就resolve了，保留取第一个执行完成的异步操作的结果，其他的方法仍在执行，不过执行结果会被抛弃。

**特点：**
* Promise.all()的作用是接收一组异步任务，然后并行执行异步任务，并且在所有异步操作执行完后才执行回调。
* .race()的作用也是接收一组异步任务，然后并行执行异步任务，只保留取第一个执行完成的异步操作的结果，其他的方法仍在执行，不过执行结果会被抛弃。
* Promise.all().then()结果中数组的顺序和Promise.all()接收到的数组顺序一致。
* all和race传入的数组中如果有会抛出异常的异步任务，那么只有最先抛出的错误会被捕获，并且是被then的第二个参数或者后面的catch捕获；但并不会影响数组中其它的异步任务的执行。


1. 
all:有了all，你就可以并行执行多个异步操作，并且在一个回调中处理所有的返回数据。
```
function runAsync (x) {
    const p = new Promise(r => setTimeout(() => r(x, console.log(x)), 1000))
    return p
}
Promise.all([runAsync(1), runAsync(2), runAsync(3)])
  .then(res => console.log(res))
// 1
// 2
// 3
// [1, 2, 3]
```
你打开页面的时候，在间隔一秒后，控制台会同时打印出1, 2, 3，还有一个数组[1, 2, 3]。

2. 
```
function runAsync (x) {
  const p = new Promise(r => setTimeout(() => r(x, console.log(x)), 1000))
  return p
}
function runReject (x) {
  const p = new Promise((res, rej) => setTimeout(() => rej(`Error: ${x}`, console.log(x)), 1000 * x))
  return p
}
Promise.all([runAsync(1), runReject(4), runAsync(3), runReject(2)])
  .then(res => console.log(res))
  .catch(err => console.log(err))
// 1s后输出
1
3
// 2s后输出
2
Error: 2
// 4s后输出
4
```
**.catch是会捕获最先的那个异常，在这道题目中最先的异常就是runReject(2)的结果。**


3. race 它只会获取最先执行完成的那个结果
```
function runAsync (x) {
  const p = new Promise(r => setTimeout(() => r(x, console.log(x)), 1000))
  return p
}
Promise.race([runAsync(1), runAsync(2), runAsync(3)])
  .then(res => console.log('result: ', res))
  .catch(err => console.log(err))
1
'result: ' 1
2
3
```


### async/await的几道题
```
async function async1() {
  console.log("async1 start");
  await async2();
  console.log("async1 end");
}

async function async2() {
  console.log("async2");
}

console.log("script start");

setTimeout(function() {
  console.log("setTimeout");
}, 0);

async1();

new Promise(function(resolve) {
  console.log("promise1");
  resolve();
}).then(function() {
  console.log("promise2");
});
console.log('script end')


'script start'
'async1 start'
'async2'
'promise1'
'script end'
'async1 end'
'promise2'
'setTimeout'

```

###  async处理错误 
1. 
```
async function async1 () {
  await async2();
  console.log('async1');
  return 'async1 success'
}
async function async2 () {
  return new Promise((resolve, reject) => {
    console.log('async2')
    reject('error')
  })
}
async1().then(res => console.log(res))

// 'async2'
//Uncaught (in promise) error
如果在async函数中抛出了错误，则终止错误结果，不会继续向下执行。
```

### 综合题 

```
const async1 = async () => {
  console.log('async1');
  setTimeout(() => {
    console.log('timer1')
  }, 2000)
  await new Promise(resolve => {   // sync函数中await的new Promise要是没有返回值的话则不执行后面的内容
    console.log('promise1')
  })
  console.log('async1 end')
  return 'async1 success'
} 
console.log('script start');
async1().then(res => console.log(res)); 
console.log('script end');
Promise.resolve(1)
  .then(2)
  .then(Promise.resolve(3))
  .catch(4)
  .then(res => console.log(res))
setTimeout(() => {
  console.log('timer2')
}, 1000)


'script start'
'async1'
'promise1'
'script end'
1  // 
'timer2'
'timer1'
```
