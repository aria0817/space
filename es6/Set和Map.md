## Set 和 Map 数据结构

Set
1. 成员不能重复
2. 只有健值，没有健名，有点类似数组。
3. 可以遍历，方法有add, delete,has

weakSet
1. 成员都是对象
2. 成员都是弱引用，随时可以消失。 可以用来保存DOM节点，不容易造成内存泄漏
3. 不能遍历，方法有add, delete,has 没有size

Map
1. 本质上是健值对的集合，类似集合
2. 可以遍历，方法很多，可以干跟各种数据格式转换

weakMap
1. 直接受对象作为健名（null除外），不接受其他类型的值作为健名
2. 键名所指向的对象，不计入垃圾回收机制
3. 不能遍历，方法同get,set,has,delete


set vs map
set: 集合存值的方式 [value, value]
map: 字典存值的方式 [key, value] 

### Set
#### 1. 定义
Set类似于数组，但是成员的值都是唯一的，没有重复的值。(可以用set来去重)
set通过接受一个数组(具有iterable接口的其他数据结构)作为参数，或者是使用add方法加入。
在set中使用===进行判断过滤，但是NaN在set内部是相等的。
```
const set = new Set([1, 2, 3, 4, 4]); // [1, 2, 3, 4]
set.add(5) // [1, 2, 3, 4, 5]

```

#### 2. set实例的属性和方法
a. 操作方法 
* add 添加某个值，返回Set结构本身
* delete 删除某个值，返回boolean，表示删除是否成功
* has 判断是否有该值 返回boolean
* clear 清空所有成员，没有返回值
Array.from 可以把set结构转为数组结构
[...set] 也可以把set结构转成数组结构
```

s.add(1).add(2).add(2);
// 注意2被加入了两次

s.size // 2

s.has(1) // true
s.has(2) // true
s.has(3) // false

s.delete(2);
s.has(2) // false

```

b. 遍历操作
* Set.prototype.keys()：返回键名的遍历器
* Set.prototype.values()：返回键值的遍历器
* Set.prototype.entries()：返回键值对的遍历器
* Set.prototype.forEach()：使用回调函数遍历每个成员

由于 Set 结构没有键名，只有键值（或者说键名和键值是同一个值），所以keys方法和values方法的行为完全一致。
```
let set = new Set(['red', 'green', 'blue']);

for (let item of set.keys()) {
  console.log(item);
}
// red
// green
// blue

for (let item of set.values()) {
  console.log(item);
}
// red
// green
// blue

for (let item of set.entries()) {
  console.log(item);
}
// ["red", "red"]
// ["green", "green"]
// ["blue", "blue"]


!! Set 结构的实例默认可遍历，它的默认遍历器生成函数就是它的values方法。
所以可以直接用for of循环遍历Set
for (let x of set) {
  console.log(x);
}
// red
// green
// blue


//Set 结构的实例与数组一样，也拥有forEach方法，用于对每个成员执行某种操作，没有返回值。
let set = new Set([1, 4, 9]);
set.forEach((value, key, set【集合本身】) => console.log(key + ' : ' + value))
// 1 : 1
// 4 : 4
// 9 : 9

```

c.遍历的应用
扩展运算符（...）内部使用for...of循环，所以也可以用于 Set 结构。
```
let set = new Set(['red', 'green', 'blue']);
let arr = [...set];
// ['red', 'green', 'blue']
```

扩展运算符和 Set 结构相结合，就可以去除数组的重复成员。还可以通过...将set转成数组，使用数组的方法。
```
let arr = [3, 5, 2, 2, 5, 5];
let unique = [...new Set(arr)];
// [3, 5, 2]

let set = new Set([1, 2, 3]);
set = new Set([...set].map(x => x * 2));
// 返回Set结构：{2, 4, 6}

let set = new Set([1, 2, 3, 4, 5]);
set = new Set([...set].filter(x => (x % 2) == 0));
// 返回Set结构：{2, 4}

```

使用 Set 可以很容易地实现并集（Union）、交集（Intersect）和差集（Difference）。
```

let a = new Set([1, 2, 3]);
let b = new Set([4, 3, 2]);

// 并集
let union = new Set([...a, ...b]);
// Set {1, 2, 3, 4}

// 交集
let intersect = new Set([...a].filter(x => b.has(x)));
// set {2, 3}

// （a 相对于 b 的）差集
let difference = new Set([...a].filter(x => !b.has(x)));
// Set {1}

```

### WeakSet
#### 定义

与Set结构类型，也是不重复的值的集合。但是WeakSet的成员只能是对象，并且对象都是弱引用。(不会考虑对象是否在存在WeakSet中，垃圾回收机制会自动回收该对象的所占的内存)。

#### 特点
不可遍历
ES6 规定 WeakSet 不可遍历：由于 WeakSet 内部有多少个成员，取决于垃圾回收机制有没有运行，运行前后很可能成员个数是不一样的，而垃圾回收机制何时运行是不可预测的。
WeakSet适合临时存放一组对象。

#### 语法
作为构造函数，WeakSet 可以接受一个数组或类似数组的对象作为参数。
```
const ws = new WeakSet();
const a = [[1, 2], [3, 4]];
const ws = new WeakSet(a);
// WeakSet {[1, 2], [3, 4]}

```

#### 操作方法
* WeakSet.prototype.add(value)：向 WeakSet 实例添加一个新成员。 返回当前WeakSet实例
* WeakSet.prototype.delete(value)：清除 WeakSet 实例的指定成员。 返回boolean
* WeakSet.prototype.has(value)：返回一个布尔值，表示某个值是否在 WeakSet 实例之中。




### Map 
#### 定义
它类似于对象，也是键值对的集合，但是“键”的范围不限于字符串，各种类型的值（包括对象）都可以当作键。

```
const m = new Map();
const o = {p: 'Hello World'};

m.set(o, 'content')
m.get(o) // "content"

m.has(o) // true
m.delete(o) // true
m.has(o) // false

```

#### 特点
* 对同一个键多次赋值，后一次的值覆盖前一次的值。【只有对同一个对象的引用，Map 结构才将其视为同一个键】
* 如果 Map 的键是一个简单类型的值（数字、字符串、布尔值），则只要两个值严格相等，Map 将其视为一个键
* 虽然NaN不严格相等于自身，但 Map 将其视为同一个键。

#### 实例的属性和操作方法

size: size属性返回 Map 结构的成员总数。
```
const map = new Map();
map.set('foo', true);
map.set('bar', false);

map.size // 2
```

**Map.prototype.set(key, value)** :set方法设置键名key对应的键值为value，然后返回整个 Map 结构。如果key已经有值，则键值会被更新，否则就新生成该键。
**Map.prototype.get(key)**:get方法读取key对应的键值，如果找不到key，返回undefined
**Map.prototype.has(key)**:has方法返回一个布尔值，表示某个键是否在当前 Map 对象之中。
**Map.prototype.delete(key)**:delete方法删除某个键，返回true。如果删除失败，返回false。
**Map.prototype.clear()**:clear方法清除所有成员，没有返回值。

```
const m = new Map();
m.set('edition', 6).set('test',4)      // 键是字符串
m.set(262, 'standard')     // 键是数值
m.set(undefined, 'nah')    // 键是 undefined
m.has(undefined) 
m.delete(undefined)
m.clear()

```

#### 遍历 

Map 结构原生提供三个遍历器生成函数和一个遍历方法(Map 的遍历顺序就是插入顺序)
！可以将...把Map结构转成数组结构，从而可以使用数据的方法。

* Map.prototype.keys()：返回键名的遍历器。
* Map.prototype.values()：返回键值的遍历器。
* Map.prototype.entries()：返回所有成员的遍历器。
* Map.prototype.forEach()：遍历 Map 的所有成员。

```
const map = new Map([
  ['F', 'no'],
  ['T',  'yes'],
]);

for (let key of map.keys()) {
  console.log(key);
}
// "F"
// "T"

for (let value of map.values()) {
  console.log(value);
}
// "no"
// "yes"

for (let item of map.entries()) {
  console.log(item[0], item[1]);
}
// "F" "no"
// "T" "yes"

// 或者
for (let [key, value] of map.entries()) {
  console.log(key, value);
}
// "F" "no"
// "T" "yes"

// 等同于使用map.entries()
for (let [key, value] of map) {
  console.log(key, value);
}
// "F" "no"
// "T" "yes"


map.forEach(function(value, key, map) {
  console.log("Key: %s, Value: %s", key, value);
});

```

#### 与其他数据结构互相转换
1. Map转为数组  ...运算符
```
const myMap = new Map()
  .set(true, 7)
  .set({foo: 3}, ['abc']);
[...myMap]
// [ [ true, 7 ], [ { foo: 3 }, [ 'abc' ] ] ]
```

2. 数组转为Map 将数组传入Map的构造函数
```
new Map([
  [true, 7],
  [{foo: 3}, ['abc']]
])
// Map {
//   true => 7,
//   Object {foo: 3} => ['abc']
// }
```

3. Map转为对象  如果所有 Map 的键都是字符串，它可以无损地转为对象。

```
function strMapToObj(strMap){
    let obj = Object.create(null) // Object.create没有继承任何原型方法，也就是说它的原型链没有上一层。
    for(let [k,v] of strMap){
        obk[k]= v;
    }
    return obj
}
const myMap = new Map()
  .set('yes', true)
  .set('no', false);
strMapToObj(myMap)

```

4. 对象转为Map 
```
let obj = {"a":1, "b":2};
let map = new Map(Object.entries(obj));

```

5. Map转为JSON 
```
// 一种情况是，Map 的键名都是字符串:  先转成对象，在转成json
function strMapToJson(strMap) {
  return JSON.stringify(strMapToObj(strMap));
}

let myMap = new Map().set('yes', true).set('no', false);
strMapToJson(myMap)

// Map 的键名有非字符串，这时可以选择转为数组 JSON。
function mapToArrayJson(map) {
  return JSON.stringify([...map]);
}

let myMap = new Map().set(true, 7).set({foo: 3}, ['abc']);
mapToArrayJson(myMap)
// '[[true,7],[{"foo":3},["abc"]]]'

```

6. JSON to Map
// 先转成对象，对象在转成json
```
function jsonToStrMap(jsonStr) {
  return objToStrMap(JSON.parse(jsonStr));
}

jsonToStrMap('{"yes": true, "no": false}')
// Map {'yes' => true, 'no' => false}

//整个 JSON 就是一个数组，且每个数组成员本身，又是一个有两个成员的数组。这时，它可以一一对应地转为 Map
function jsonToMap(jsonStr) {
  return new Map(JSON.parse(jsonStr));
}

jsonToMap('[[true,7],[{"foo":3},["abc"]]]')
// Map {true => 7, Object {foo: 3} => ['abc']}
```

### WeakMap 
WeakMap结构与Map结构类似，也是用于生成键值对的集合。
使用时机：如果你要往对象上添加数据，又不想干扰垃圾回收机制。
vs Map 
* WeakMap只接受对象作为键名（null除外），不接受其他类型的值作为键名。
* WeakMap的键名所指向的对象，不计入垃圾回收机制
```
// WeakMap 可以使用 set 方法添加成员
const wm1 = new WeakMap();
const key = {foo: 1};
wm1.set(key, 2);
wm1.get(key) // 2

// WeakMap 也可以接受一个数组，
// 作为构造函数的参数
const k1 = [1, 2, 3];
const k2 = [4, 5, 6];
const wm2 = new WeakMap([[k1, 'foo'], [k2, 'bar']]);
wm2.get(k2) // "bar"
```

#### 语法 
WeakMap 与 Map 在 API 上的区别主要是两个，一是没有遍历操作（即没有keys()、values()和entries()方法），也没有size属性。
get()、set()、has()、delete()。

```
const wm = new WeakMap();

// size、forEach、clear 方法都不存在
wm.size // undefined
wm.forEach // undefined
wm.clear // undefined
```

#### 用途
WeakMap 应用的典型场合就是 DOM 节点作为键名











