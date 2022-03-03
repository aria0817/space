// 事件循环：
//js中任务可以分成 同步任务和异步任务
// 同步任务：立即执行的任务，一般会直接进入到主线程中执行
// 异步任务：异步执行的任务 比如ajax settimeout

// 异步任务又分为 宏任务和微任务
// 微任务: 一个需要执行的异步函数，在主函数执行以后，当前宏任务结束之前
//  Promise.then  process.nextTick(node.js) 

// 宏任务: 宏任务的时间粒度比较大，执行的时间间隔是不能精确控制
// setTimeout/setInterval、 script、 UIrendering/UI事件 、postMessage、MessageChannel、setImmediate、I/O（Node.js） 

// 同步任务进入主线程，异步任务进入任务队列。当主线程任务执行完毕，会去任务队列读取任务，推入到主线程中执行。
console.log(1)  // 同步任务，主线程中执行
setTimeout(()=>{
    console.log(2) // 异步任务 一个新的宏任务，放入到队列中
}, 0)
new Promise((resolve, reject)=>{ 
    console.log('new Promise') // 同步任务
    resolve()
}).then(()=>{  // 异步任务， 微任务放入任务队列中
    console.log('then')
})
console.log(3) // 同步任务 
// 当所有同步任务执行完成以后，会查看微任务列表的队列，将所有的微任务全部执行完成后，在去执行下一个宏任务。


// async: 异步方法  await:等待这个异步方法执行的结果    await 会阻塞后面的代码（即加入微任务队列）
async function fn1 (){
    console.log(1) // 立即执行
    await fn2() // 执行当前函数，并且阻塞后后面的代码
    console.log(2) // 被阻塞，加入到微任务队列中
    new Promise((resolve, reject)=>{
        console.log('Promise');
        resolve()
    }).then(()=>{
        console.log('then');
    })
}

async function fn2 (){
    console.log('fn2') // 立马执行 
}

fn1()
console.log(3) // 立马执行
console.log(4); //立马执行 

// 1 fn2 3 4 2 promise then 