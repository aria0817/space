// instanceof 用于检测构造函数的 prototype 属性是否出现在某个实例对象的原型链上
const myInstanceOf = function(left,right){
    // 用typeof判断是否为基础数据类型，如果是直接返回false
    if(typeof left !== 'object' || left === null) return false;
    // 拿到left的原型对象
    let proto = Object.getPrototypeOf(left)
    // 
    while(true){
        if(proto === null) return false;
        // 找到相同原型对象，返回true
        if(proto === right.prototype) return true;
        // 一直顺着原型链去找，直到找到相同的原型
        proto = Object.getPrototypeof(proto);
    }
}

var str = new String('123')
var isString = myInstanceOf(str,String)

// console.log(isString); true
// console.log(str instanceof String);  true



// typeof  vs  instanceof 
// typeof 操作符返回一个字符串，表示未经计算的操作数的类型。一般用来检测简单类型，引用类型只有function会返回function以外，
// 其他的都是object

// 区别
/**
 * 1. typeof 会返回一个基本变量类型，而 instanceof 会返回一个布尔值
 * 2. instanceof 可以准确的判断出复杂引用类型的数据，但是不能正确的判断基础类型
 * 3. typeof 除了function的以外的引用类型，都不能判断
 */

// 通用的数据类型检测  Object.prototype.toString.call()
console.log(Object.prototype.toString.call('test')); // [object String]
console.log(Object.prototype.toString.call({a:3})); // [object Object]
console.log(Object.prototype.toString.call(function(){})); // [object Function]