## Module的加载实现

### 1. 浏览器加载
两种异步加载语法
```
<script src="path/to/myModule.js" defer></script>
<script src="path/to/myModule.js" async></script>
```
1. defer: 要等到整个页面在内存中正常渲染结束（DOM 结构完全生成，以及其他脚本执行完成），才会执行。多个会按照顺序来执行。
2. async一旦下载完，渲染引擎就会中断渲染，执行这个脚本以后，再继续渲染，无法按照孙顺序执行。

<br>

浏览器加载了ES6，使用type='module'来标记。是异步加载，不会造成堵塞浏览器，即等到整个页面渲染完，再执行模块脚本，等同于打开了<script>标签的defer属性。
也可以给script加上async属性，但是不会展示顺序执行了。
<br>

**ES6 模块也允许内嵌在网页中，语法行为与加载外部脚本完全一致。**
对于外部的模块脚本（上例是foo.js），有几点需要注意：
- 代码是在模块作用域之中运行，而不是在全局作用域运行。模块内部的顶层变量，外部不可见。
- 模块脚本自动采用严格模式，不管有没有声明use strict。
- 模块之中，可以使用import命令加载其他模块（.js后缀不可省略，需要提供绝对 URL 或相对 URL），也可以使用export命令输出对外接口。
- 模块之中，顶层的this关键字返回undefined，而不是指向window。也就是说，在模块顶层使用this关键字，是无意义的。
- 同一个模块如果加载多次，将只执行一次。


### 2. ES6模块和CommonJS的差异 
1. CommonJS 模块输出的是一个值的拷贝，ES6 模块输出的是值的引用：
CommonJS 模块输出的是值的拷贝，也就是说，一旦输出一个值，模块内部的变化就影响不到这个值。
**ES6 模块的运行机制遇到模块加载命令import，就会生成一个只读引用。等到脚本真正执行时，再根据这个只读引用，到被加载的那个模块里面去取值，ES6 模块输入的变量counter是活的。**
```
//由于 ES6 输入的模块变量，只是一个“符号连接”，所以这个变量是只读的，对它进行重新赋值会报错。
// lib.js
export let obj = {};

// main.js
import { obj } from './lib';

obj.prop = 123; // OK
obj = {}; // TypeError
```
2. CommonJS 模块是运行时加载，ES6 模块是编译时输出接口。
3. CommonJS 模块的require()是同步加载模块，ES6 模块的import命令是异步加载，有一个独立的模块依赖的解析阶段。

### 3. Node.js 的模块加载方法
JavaScript 现在有两种模块。一种是 ES6 模块，简称 ESM；另一种是 CommonJS 模块，简称 CJS。
**CommonJS 模块使用require()和module.exports，ES6 模块使用import和export。**
Node.js 要求 ES6 模块采用.mjs后缀文件名。也就是说，只要脚本文件里面使用import或者export命令，那么就必须采用.mjs后缀名。Node.js 遇到.mjs文件，就认为它是 ES6 模块，默认启用严格模式，不必在每个模块文件顶部指定"use strict"。

**ES6 模块与 CommonJS 模块尽量不要混用。**

### CommonJS 模块加载 ES6 模块

CommonJS 的require()命令不能加载 ES6 模块，会报错，只能使用import()这个方法加载。
```
(async () => {
  await import('./my-app.mjs');
})();
```
require()不支持 ES6 模块的一个原因是，它是同步加载，而 ES6 模块内部可以使用顶层await命令，导致无法被同步加载。

### ES6加载CommonJS模块
ES6 模块的import命令可以加载 CommonJS 模块，但是只能整体加载，不能只加载单一的输出项。
```
// 正确
import packageMain from 'commonjs-package';

// 报错
import { method } from 'commonjs-package';

//加载单一的输出项，可以写成下面这样。
import packageMain from 'commonjs-package';
const { method } = packageMain;
```

#### 同时支持两种格式的模块
1. 如果原始模块是 ES6 格式，那么需要给出一个整体输出接口，比如export default obj，使得 CommonJS 可以用import()进行加载。

2. 如果原始模块是 CommonJS 格式，那么可以加一个包装层。
```
import cjsModule from '../index.js';
export const foo = cjsModule.foo;
```

3. package.json文件的exports字段，指明两种格式模块各自的加载入口。
```
"exports"：{
  "require": "./index.js"，
  "import": "./esm/wrapper.js"
}
//上面代码指定require()和import，加载该模块会自动切换到不一样的入口文件。
```

## Node.js 的内置模块
1. 加载路径：ES6 模块的加载路径必须给出脚本的完整路径，不能省略脚本的后缀名。
2. 内部变量 ：顶层变量在 ES6 模块之中不存在：arguments、require、module、exports、__filename、__dirname

## 循环加载
“循环加载”（circular dependency）指的是，a脚本的执行依赖b脚本，而b脚本的执行又依赖a脚本。

### CommonJS 模块的加载原理 
CommonJS 的一个模块，就是一个脚本文件。require命令第一次加载该脚本，就会执行整个脚本，然后在内存生成一个对象。
```
{
  id: '...', //模块名
  exports: { ... }, // 模块输出的各个接口
  loaded: true, //模块的脚本是否执行完毕。
  ...
}
```
以后需要用到这个模块的时候，就会到exports属性上面取值。即使再次执行require命令，也不会再次执行该模块，而是到缓存之中取值。**CommonJS 模块无论加载多少次，都只会在第一次加载时运行一次，以后再加载，就返回第一次运行的结果，除非手动清除系统缓存。**

### CommonJS 模块的循环加载
CommonJS 模块的重要特性是加载时执行，即脚本代码在require的时候，就会全部执行。一旦出现某个模块被"循环加载"，就只输出已经执行的部分，还未执行的部分不会输出。

### ES6 模块的循环加载
ES6 模块是动态引用，如果使用import从一个模块加载变量（即import foo from 'foo'），那些变量不会被缓存，而是成为一个指向被加载模块的引用，需要开发者自己保证，真正取值的时候能够取到值。