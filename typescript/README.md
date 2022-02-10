typescript 

### namespace

### 导入和导出方式
module: commonjs 选项以及使用 ES 模块语法导入、导出、编写模块。
如果是
```

```
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

### 1. Data type 
1. TypeScript - Tuples

```
其实和数组类似，但是会限定类型。能够使用数组的方法，比如push、pop等。
var employee: [number, string] = [1, "Steve"];
var person: [number, string, boolean] = [1, "Steve", true];
```

2. enmu 枚举

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
```



### 2. interface 和 type

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

区别：

* interface 支持 declaration merging，而 type alias 不支持。
* Type支持很多数据类型的饿定义，比如： a union, primitive, intersection, tuple, or any other type 【Tuples：它包括不同数据类型的值, ['test',1,false]，还可以push、concat等数组方法】

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



### 1. 继承：

* implements
  实现，一个新的类，从父类或者接口实现所有的属性和方法，【同时可以重写属性和方法】，包含一些新的功能
* extends
  继承，一个新的接口或者类，从父类或者接口继承所有的属性和方法，【不可以重写属性】，但可以重写方法


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



### 善用高级类型

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



### 善用类型收窄【类型收窄就是从**宽类型**转换成**窄类型**的过程】

1. 类型断言   值 as 类型 或者 <类型>值 
2. 类型守卫
   *  typeof : 用于判断 number，string，boolean或 symbol 四种类型；
   *  instanceof: 用于判断一个实例是否属于某个类
   *  in: 用于判断一个属性/方法是否属于某个对象
3. 双重断言 【除非迫不得已，千万别用双重断言】