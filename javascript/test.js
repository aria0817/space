// function currying(fn, n) {
//     return function (m) {
//         console.log(m,n);
//       return fn.call(this, m, n);
//     };
//   }

//   function tailFactorial(n, total) {
//     if (n === 1) return total;
//     return tailFactorial(n - 1, n * total);
//   }

//   const factorial = currying(tailFactorial, 1);



//   function factorial(n, total = 1) {
//     if (n === 1) return total;
//     return factorial(n - 1, n * total);
//   }
//   factorial(5) // 120
//  console.log(factorial(5));

// function sum(arr){
//     if(!arr.length){
//         return 0
//     }else if (arr.length == 1){
//        return arr[0]
//     }else{
//        return arr[0] + sum(arr.slice(1));
//     }
// }

// console.log(sum([1,2,3]));
// 如果执行完了就可以被执行 如果没有执行完就什么都不做
// function (fn,delay){
//     let timer = null;
//     return function(...args){
//         if (!timer) {
//             timer = setTimeout(() => {
//                 fn.apply(this,args);
//                 timer = null;
//             },delay)
//         }
//     }
// }

// function debounce (fn,wait){
//     let timer = null
//     return function(...args){
//         let context = this; // 保存this指向
//         clearTimeout(timer)
//         timer = setTimeout(() => {
//             fn.apply(context,args)
//         }, wait);
//     }
// }

function debounce(fn, wait, immediate) {
    let timer = null
    return function (...args) {
        let context = this; // 保存this指向
        if (timer) clearTimeout(timer)

        if (immediate) {
            let callNow = !timer; // 第一次会立即执行，以后只有事件执行后才会再次触发
            timeout = setTimeout(function () {
                timeout = null;
            }, wait)
            if (callNow) {
                fn.apply(context, args)
            }

        } else {
            timer = setTimeout(() => {
                fn.apply(context, args)
            }, wait);
        }

    }
}