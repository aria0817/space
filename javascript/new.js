// new 这一步骤做了什么事情呢？
/**
 * 1. 开辟了一个新对象obj
 * 2. 把obj的原型指向构造函数的原型对象
 * 3. 将构造函数的this指向obj
 * 4. 对构造函数的返回值做判断，返回对应的返回值
 */

function myNew(Fn,...args){
    let obj = {};
    obj.__proto__ = Fn.prototype;
    // Object.setPrototypeOf(obj,Fn.prototype)
    // 新的对象
    let res = Fn.apply(obj,args)
    console.log(res,res instanceof Object);
    return res instanceof Object ? res : obj
}

function Person(name){
    this.name = name;
}
let obj = myNew(Person,'test')
console.log(obj);