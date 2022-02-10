typescript 

### 1. 原始数据类型
#### 1.原始数据类型包括：布尔值、数值、字符串、null、undefined 以及 ES6 中的新类型 Symbol 和 ES10 中的新类型 BigInt。

空值：void 没有任何返回值，一般用于没有任何返回值的函数
```
let unusable : void = undefined
```
Null和Undefined
undefined和null是所有类型的字类型
```
// 都不会报错
let num:number = undefined
let num:string = undefined
```

#### 2. 任意值
any 声明一个变量为any后，无论任何操作，返回的类型都是any。未声明类型会被识别为any
#### 3. 函数重载
重载允许一个函数接受不同数量或类型的参数时，作出不同的处理。
```
function reverse(x: number): number;
function reverse(x: string): string;
function reverse(x: number | string): number | string | void {
    if (typeof x === 'number') {
        return Number(x.toString().split('').reverse().join(''));
    } else if (typeof x === 'string') {
        return x.split('').reverse().join('');
    }
}
ts会从最前面的定义开始匹配，所以能够实现输入参数和输出参数类型一致
```

### 类型断言
手动指定一个值的类型 值 as 类型/ <类型>值
用途：
 * 将一个联合类型断言为其中一个类型 

 ```
interface Cat {
    name: string;
    run(): void;
}
interface Fish {
    name: string;
    swim(): void;
}

function isFish(animal: Cat | Fish) {
    if (typeof (animal as Fish).swim === 'function') {
        return true;
    }
    return false;
}
 ```


### 1. Data type 
#### 1. TypeScript - Tuples

```
其实和数组类似，但是会限定类型。能够使用数组的方法，比如push、pop等。
var employee: [number, string] = [1, "Steve"];
var person: [number, string, boolean] = [1, "Steve", true];
```

#### 2. enmu 枚举
* Numeric enum  [1,2,3]
* String enum ['a','d','e']
* Heterogeneous enum [1,false]

```
反向映射
enum PrintMedia {
  Newspaper = 1,
  Newsletter,
  Magazine,
  Book
}
浏览器展示：
{
  '1': 'Newspaper',
  '2': 'Newsletter',
  '3': 'Magazine',
  '4': 'Book',
  Newspaper: 1,
  Newsletter: 2,
  Magazine: 3,
  Book: 4 
}
手动赋值，未手动赋值的会接着上一个枚举项递增 +1 
enum Days {Sun = 7, Mon = 1, Tue, Wed, Thu, Fri, Sat};
console.log(Days["Sun"] === 7); // true
console.log(Days["Mon"] === 1); // true
console.log(Days["Tue"] === 2); // true
console.log(Days["Sat"] === 6); // true

```

#### 3. 类  和es6的类差不多 TypeScript提供三种修饰符
##### 修饰符：
public:公用属性，在任何地方都可以访问到。默认的方法和属性都是public
private: 私有属性/方法，只能在类的内部访问
protected:被保护属性/方法，可在类的内部会让子类中访问

##### 参数属性
readonly，有其他修饰符，它需要写在后面

##### 抽象类 abstract    why??
定义抽象类和其中的抽象方法。抽象类是不允许被实例化

```
公用的报警功能
interface Alarm {
    alert(): void;
}
interface Light(){
  lightOn(): void;
  lightOff(): void;
}

// 门
class Door {
  open(){}
}

class SecurityDoor extends Door implements Alarm {
    alert() {
        console.log('SecurityDoor alert');
    }
}
// 车 一个类可以实现多个接口
class Car implements Alarm,Light {
    alert() {
        console.log('Car alert');
    }
}

```
##### ts中接口可以继承接口，接口也可以继承类
-为什么接口也可以继承类？
因为在声明类的时候，同时也创建的一个类型
当我们在声明 class Point 时，除了会创建一个名为 Point 的类之外，同时也创建了一个名为 Point 的类型（实例的类型）
```
class Point {
    x: number;
    y: number;
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
    printPoint() {
        console.log(this.x, this.y);
    }
}

function printPoint(p: Point) {
    console.log(p.x, p.y);
}

printPoint(new Point(1, 2));
等价于 
class Point {
    x: number;
    y: number;
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}

interface PointInstanceType {
    x: number;
    y: number;
    printPoint(): void;
}

function printPoint(p: PointInstanceType) {
    console.log(p.x, p.y);
}

printPoint(new Point(1, 2));
```
##### 类也可以合并，和接口合并一样

#### 4. interface implements  type

interface 接口：对象的形状结构进行描述
接口可以支持合并，如果相同属性，类型如果不同就会报错
```
interface Alarm {
    price: number;
}
interface Alarm {
    weight: number;
}

相当于
interface Alarm {
    price: number;
    weight: number;
}
```


implements 实现：一般来说，一个类只能继承自另一个类，有时候不同类之间可以有一些共有的特性，这时候就可以把特性提取成接口（interfaces），用 implements 关键字来实现


implements vs extends
implements实现，一个新的类，从父类或者接口实现所有的属性和方法，【同时可以重写属性和方法】，包含一些新的功能
extends继承，一个新的接口或者类，从父类或者接口继承所有的属性和方法，【不可以重写属性】，但可以重写方法

interface vs type
interface 支持 declaration merging，而 type alias 不支持。
type 支持很多数据类型的定义，比如： a union, primitive, intersection, tuple, or any other type 【Tuples：它包括不同数据类型的值, ['test',1,false]，还可以push、concat等数组方法】

```javascript
interface X {
    a: number
    b: string
}

type Y = {
    a: number
    b: string
};

interface T extends Y {
	c: number
}

type Z = X & {
	d: number
}
```


```
interface Song {
  artistName: string;
};

interface Song {
  songName: string;
};
const song: Song = {
  artistName: "Freddie",
  songName: "The Chain"
};

```


#### 5. 泛型：是指在定义函数、接口或类的时候，不预先指定具体的类型，而在使用的时候再指定类型的一种特性。

```
function createArray<T>(length: number, value: T): Array<T> {
    let result: T[] = [];
    for (let i = 0; i < length; i++) {
        result[i] = value;
    }
    return result;
}

多个类型参数
function swap<T, U>(tuple: [T, U]): [U, T] {
    return [tuple[1], tuple[0]];
}

swap([7, 'seven']); // ['seven', 7]
createArray(3, 'x'); // ['x', 'x', 'x']
```
##### 泛型约束
```
arg需要有length属性
function loggingIdentity<T extends Lengthwise>(arg: T): T {
    console.log(arg.length);
    return arg;
}
```
##### 泛型接口
用接口的方式来定义一个函数需要符合的形状
```
interface CreateArrayFunc<T> {
    (length: number, value: T): Array<T>;
}

let createArray: CreateArrayFunc;
createArray = function<T>(length: number, value: T): Array<T> {
    let result: T[] = [];
    for (let i = 0; i < length; i++) {
        result[i] = value;
    }
    return result;
}

createArray(3, 'x'); // ['x', 'x', 'x']
```
##### 泛型类
```
class GenericNumber<T> {
    zeroValue: T;
    add: (x: T, y: T) => T;
}

let myGenericNumber = new GenericNumber<number>();
myGenericNumber.zeroValue = 0;
myGenericNumber.add = function(x, y) { return x + y; };

```


### 2. .d.ts 

1. 第三方声明文件：
   当在 TypeScript 项目中使用第三方库时，我们需要引用它的声明文件，才能获得对应的代码补全、接口提示等功能。https://www.npmjs.com/~types
   针对多数第三方库，社区已经帮我们定义好了它们的声明文件，我们可以直接下载下来使用。一般推荐使用 @types 统一管理第三方库的声明文件，@types 的使用方式很简单，直接用 npm 或 yarn 安装对应的声明模块即可。以 lodash 为例：

```
npm install atypes/lodash --save-dev
```

2. 自定义声明文件
   一般都是为第三方库没有声明文件时自己写的
   // 像这个：
   declare module 'antd-dayjs-webpack-plugin'

"d.ts"文件用于为 TypeScript 提供有关用 JavaScript 编写的 API 的类型信息。
简单讲，就是你可以在 ts 中调用的 js 的声明文件。TS的核心在于静态类型，我们在编写 TS 的时候会定义很多的类型，但是主流的库都是 JS编写的，并不支持类型系统。这个时候你不能用TS重写主流的库，这个时候我们只需要编写仅包含类型注释的 d.ts 文件，然后从您的 TS 代码中，可以在仍然使用纯 JS 库的同时，获得静态类型检查的 TS 优势。推荐使用 @types 方式。
可参考链接：
https://juejin.cn/post/6987735091925483551#heading-6

在代码量较大的情况下，为了避免各种变量名冲突, 可以将相同模块的函数、类、接口等都放置在命名空间内。
就可以新增d.ts文件，这样子就可以全局访问了。



### 小技巧
#### 善用高级类型

1. 索引类型 keyof 类似于Object.keyof 
2. 约束类型 extends 对泛型加以约束

```javascript
type Button = {
	 type:string,
	 text:string
}
type Buttonskeys = keyof Button => type Buttonskeys = "type"| "text"

type BaseType = string | number 
function copy<T extends BaseType>(arg:T){}
const arr = copy([]) => error 

一般联合使用，对象不确定的情况下获取对象的值
function getValue<T,K extends keyof T>(obj:T,key:K){
  return obj[key]
}
const obj = { a : 1}
const b = getValue(obj,'b') => error
```

3. 类型映射 in 

   ```
   type Readonly<T> = {
     readonly [P in keyof T]:T[P]
   }
   ```


#### 善用类型收窄【类型收窄就是从**宽类型**转换成**窄类型**的过程】

1. 类型断言   值 as 类型 或者 <类型>值 
2. 类型守卫
   *  typeof : 用于判断 number，string，boolean或 symbol 四种类型；
   *  instanceof: 用于判断一个实例是否属于某个类
   *  in: 用于判断一个属性/方法是否属于某个对象
3. 双重断言 【除非迫不得已，千万别用双重断言】