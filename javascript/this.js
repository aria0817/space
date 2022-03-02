// this是函数被调用时发生的绑定，它指向什么完全取决于函数在哪里被调用。

// this的四条绑定规则

// 1. 默认绑定 ：函数独立调用  
// foo是直接使用不带任何修饰的函数引用进行调用，this指向全局对象【 非严格模式下】
function foo(){
    console.log(this.a);
}
var a = 2;
foo() // 2


// 2. 隐式绑定：函数对象有上下文时候，会把函数调用的this绑定到这个上下文对象上
// 函数调用位置会使用obj上下文来引用函数foo 【obj.a 和 this.a是一样的】
function foo(){
    console.log(this.a);
}
var obj = {
    a:2,
    foo:foo
}
obj.foo() // 2  


// 隐式丢失：
function foo(){
    console.log(this.a)
}
var obj = {
    a:2,
    foo
}
var bar = obj.foo // bar是obj.foo的一个引用，实际上引用的foo函数本身  var bar = function(){ console.log(this.a);}
var a = 'oops,global';
bar();// oops,global

// 3.显示绑定  call apply bind 

// 当obj为null、undefined时候 this 指向window
// call 原函数会立即执行，只是临时改变this指向一次。
foo.call(obj,1,2,3)  //  this会变成obj
foo(1,2,3) // this指向window

// apply 原函数会立即执行，只是临时改变this指向一次。
foo.apply(obj,[1,2,3])
foo(1,2,3) // this指向window

// bind 改变this指向后不会立即执行，而是返回一个永久改变this指向的函数
foo.bind(obj,1,2,3) // 不会执行
foo(1,2,3) // this始终指向obj


// 3.1 区别总结：
/**
 * 都可以改变this指向
 * 第一个参数都是this要指向的对象，如果为null、undefined，会默认指向全局window
 * 都可以传参，apply是数组 call bind是参数列表
 * bind返回的绑定this以后的函数，apply和call是立即执行，并只绑定当次
 */


// 4. new绑定  在new的过程中，会将函数的this指向新的对象。
var bar = new foo();
bar.a = 2


// 箭头函数， 不使用this的四种规则，而是直接取决于外层作用域来决定this