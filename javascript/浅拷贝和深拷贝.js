/**
 * 浅拷贝：浅拷贝就是拷贝第一层。如果是基本类型，就是拷贝基本类型的值。如果是引用类型，拷贝的就是内存地址。
 */

// 浅拷贝    name1都会发生变化，因为指向的是同一个地址
// Object.assign  slice concat ... 都是浅拷贝
// var obj = {
//     names: {
//         name1: 'fx',
//     }
// }
// var newObj = Object.assign({}, obj);
// console.log(obj, newObj);
// newObj.names.name1 = 123
// console.log(obj, newObj);


// function shallowCopy(obj) {
    // Object.assign 
    // return Object.assign({}, obj)
    // return { ...obj}
    // 
// }


/**
 * 深拷贝：开辟一个新的栈，两个对象的属性完全相同，但是是两个不同的地址，所以一个一个对象属性发生变化，另外一个是不变的。
 * _.cloneDeep()  jQuery.extend() 
 * JSON.stringify()： 但是这种方式存在弊端，会忽略undefined、symbol和函数
 */
 const obj = {
    name: 'A',
    name1: undefined,
    name3: function() {},
    name4:  Symbol('A')
}
const obj2 = JSON.parse(JSON.stringify(obj));
console.log(obj,obj2); 
obj2.name='B'
console.log(obj,obj2); // obj的name依旧是A

//区别  
// - 对于基本类型来说，其实浅拷贝和深拷贝一样，都是对值的拷贝。
// - 对于属性为引用类型来说：
    // 1. 浅拷贝是拷贝一层，浅拷贝是复制，两个对象指向同一个地址。
    // 2. 深拷贝是递归拷贝，深拷贝是新开了一个栈，两个对象之乡不同的地址。

