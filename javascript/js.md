## 什么是javascript 



### 类型转换
- 显式类型转换
```
/**
 * Number()
 * parseInt()
 * String()
 * Boolean()
 */


/**
 * Number 强制类型转换
 * 
 */
// console.log(Number(undefined)); NaN
// console.log(Number(null)); 0 
// console.log(Number(true)); 1 
// console.log(Number(false)); 0 
// console.log(Number('234')); 234
// console.log(Number('2423fd')); NaN
// console.log(Number([2,3,4]));NaN
// console.log(Number([2]));2
// console.log(Number({a:3}));NaN

/**
 * parseInt
 * parseInt函数逐个解析字符，遇到不能转换的字符就停下来
 */

//  console.log(parseInt({a:3})); 
//  console.log(parseInt('12323.323'));  // 不会解析小数点后
//  console.log(parseInt('24v'));  24
//  console.log(parseInt(undefined)); NaN
//  console.log(parseInt(null)); NaN
//  console.log(parseInt({a:3})); NaN


/**
 * String  可以将任意类型的值转化成字符串
 */

// console.log(String(234));
// console.log(String(true));
// console.log(String(null));
// console.log(String(undefined));
// console.log(String([1,2,4])); // 124
// console.log(String({a:34})); // [object Object]

/**
 * Boolean 可以将任意类型的值转为布尔值，转换规则如下：
 * 
 * 
 */

 // 转换成false的6种情况
// console.log(Boolean(undefined));
// console.log(Boolean(null));
// console.log(Boolean(0));
// console.log(Boolean(NaN));
// console.log(Boolean(''));
// console.log(Boolean(false));

// 为对象/数组时候为true
console.log(Boolean({}));
console.log(Boolean([]));
console.log(Boolean(new Boolean(false)));
```

- 隐式类型转换
```
发生条件： 有比较运算符、算数运算符时，并且运算符两边的操作数不是同一个类型
```