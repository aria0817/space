## ES6

### 1.扩展运算符的应用
ES6通过扩展元素符...，好比 rest 参数的逆运算，将一个数组转为用逗号分隔的参数序列
```
console.log(...[1, 2, 3])
// 1 2 3

console.log(1, ...[2, 3, 4], 5)
// 1 2 3 4 5

// 能够实现数组的复制 
const a1 = [1, 2];
const [...a2] = a1;

// 数组合并

// 可以将字符串转为真正的数组
//定义了遍历器（Iterator）接口的对象，都可以用扩展运算符转为真正的数组
let nodeList = document.querySelectorAll('div');
let array = [...nodeList];

let map = new Map([
  [1, 'one'],
  [2, 'two'],
  [3, 'three'],
]);


let arr = [...map.keys()]; // [1, 2, 3]
如果对没有 Iterator 接口的对象，使用扩展运算符，将会报错

const obj = {a: 1, b: 2};
let arr = [...obj]; // TypeError: Cannot spread non-iterable object

```




### 2.构造函数新增的方法
Array.from()
Array.of()

Array.from:将类似数组的对象和可遍历（iterable）的对象（包括 ES6 新增的数据结构 Set 和 Map）转成真正的数组。
还可以接受第二个参数，用来对每个元素进行处理，将处理后的值放入返回的数组。
Array.from([1, 2, 3], (x) => x * x)
// [1, 4, 9]

Array.of()：用于将一组值，转换为数组
Array.of(3, 11, 8) // [3,11,8]
// 当参数只有一个时，参数为数组的长度。当参数大于一个时，才会返回由参数组成的新数组。

### 3. 实例对象新增的方法
copyWithin()
find()、findIndex()
fill()： 给定值填充数组，还可以接受第二个第三个参数，填充的起始和结束的位置
entries()，keys()，values()
includes()
flat()，flatMap()

copyWithin： 将指定位置的成员复制到其他位置（会覆盖原有成员），然后返回当前数组
* target（必需）：从该位置开始替换数据。如果为负值，表示倒数。
* start（可选）：从该位置开始读取数据，默认为 0。如果为负值，表示从末尾开始计算。
* end（可选）：到该位置前停止读取数据，默认等于数组长度。如果为负值，表示从末尾开始计算。

find: 找到第一个符合条件的数组成员
findIndex: 找到第一个符合条件的数组成员位置

entries
keys()是对键名的遍历、values()是对键值的遍历，entries()是对键值对的遍历


flat()，flatMap()

flat 对原数据没有影响，默认拉平一列。flat(n) 拉平n层列
[1, 2, [3, 4]].flat() // [1,2,3,4] 

flatMap 方法对原数组的每个成员执行一个函数相当于执行Array.prototype.map()，然后对返回值组成的数组执行flat()方法。该方法返回一个新数组，不改变原数组




