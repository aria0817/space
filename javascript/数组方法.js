/**
 * 操作方法  
 * 排序方法 
 * 转换方法
 * 迭代方法
 */

// 操作方法 
var arr = []

/**
 * push
 * @param 
 * @returns arr.length
 * 会改变原数组
 */
// push方法接受任意数量参数,并且将其加到数组末尾。返回数组最新的长度
arr.push(1)  //  return arr.length

/**
 * unshift
 * @param 
 * @returns arr.length
 *  会改变原数组
 */
// unshift 在开头新增多个值 返回新的数组长度
arr.unshift(2)  //  return arr.length

/**
 * splice
 * @param
 * 开始位置
 * 要删除元素的数量
 * 插入的元素
 * @returns []
 *  会改变原数组
 */
//  let colors = ["red", "green", "blue"];
//  let removed = colors.splice(1, 0, "yellow", "orange")
//  console.log(colors) // red,yellow,orange,green,blue
//  console.log(removed) // []

/**
 * concat
 * @param 数组或者stirng
 * @returns 新构建的数组
 * 不影响原数组
 */
// concat 连接两个数组 创建当前数组的一个副本，然后把参数添加到末尾，返回这个新构建的数组
// let colors = ["red", "green", "blue"];
// let colors2 = colors.concat("yellow", ["black", "brown"]);
// console.log(colors); // ["red", "green","blue"]
// console.log(colors2); // ["red", "green", "blue", "yellow", "black", "brown"]


// 删除
// pop shift splice 改变原数组
// slice 不改变原数组，创建新的副本

// pop()  删除最后一项，返回被删除的项
let colors = ["red", "green"]
let item = colors.pop(); // 取得最后一项
console.log(item) // green
console.log(colors.length) // 1

// shift 删除数组的第一项 返回被删除的项
shift()

// splice 开始位置，删除元素的数量
// 返回删除元素的数组[]
splice()


// slice 构建一个新的数组，参数是 开始下标、结束下标 截取中间的[]
slice()


// 改

splice 
// let colors = ["red", "green", "blue"];
// let removed = colors.splice(1, 1, "red", "purple"); // 插入两个值，删除一个元素
// console.log(colors); // red,red,purple,blue
// console.log(removed); // green，只有一个元素的数组


// 查
// indexOf  inclueds  find:找到第一个匹配的元素


// 排序方法
// 翻转数组
// reverse  
// sort 默认排序顺序是在将元素转换为字符串，然后比较它们的UTF-16代码单元值序列时构建的
// 可以接受一个比较函数
// var numbers = [4, 2, 5, 1, 3];
// numbers.sort((a, b) => a - b);
// console.log(numbers);

// items.sort(function (a, b) {
//     return (a.value - b.value)
//   });


// 转换方法 join  用连接符号，返回一个由链接符连接的字符串


// 迭代方法 
// some() 如果有一项满足，则返回true
// every() 所有满足才能返回true
// forEach() 遍历 ，没有返回值
// filter() 过滤  为true的返回
// map 有返回的值的遍历 
// reduce() 






