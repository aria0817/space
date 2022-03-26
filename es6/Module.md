## Module

### 1.历史
ES6之前，模块化加载方案主要有CommonJS(服务器)和AMD(浏览器)两种。ES6的模块化实现了浏览器和服务器通用的解决方案。
CommonJS和AMD都只能在运行时确定模块以来关系。但是ES6模块不是对象，而是通过export命令显式输出制定代码，再通过import引入。
```
// CommonJS模块 
let { stat, exists, readfile } = require('fs');

// 等同于
let _fs = require('fs');
let stat = _fs.stat;
let exists = _fs.exists;
let readfile = _fs.readfile;

// ES6模块 编译时加载，
import { stat, exists, readFile } from 'fs';
```

ES6模块化带来的好处：
* 不再需要UMD模块格式，未来服务器和浏览器都会支持ES6。
* 未来浏览器的API就可以用模块格式提供，不用做成全局变量或者navigator对象的属性。
* 不再需要对象作为命名空间，未来可以通过模块提供。

### 2. 严格模式
**ES6 模块之中，顶层的this指向undefined，即不应该在顶层代码使用this。**
ES6的模块自动采用严格模式，主要有以下几个限制：
1. 变量必须声明后再使用（没有了变量提升）
2. 函数的参数不能有同名属性，会报错
3. 不能使用with语句 
4. 不能对只读属性赋值，否则报错
5. 不能使用前缀 0 表示八进制数，否则报错
6. 不能删除不可删除的属性，否则报错
7. 不能删除变量delete prop，会报错，只能删除属性delete global[prop]
8. eval不会在它的外层作用域引入变量
9. eval和arguments不能被重新赋值
10. arguments不会自动反映函数参数的变化
11. 不能使用arguments.callee/arguments.caller
12. 禁止this指向全局对象
13. 能使用fn.caller和fn.arguments获取函数调用的堆栈
14. 增加了保留字（比如protected、static和interface）

### 3. export 命令
模块功能主要由两个命令构成：export和import。export命令用于规定模块的对外接口，import命令用于输入其他模块提供的功能。
```
// profile.js
export var firstName = 'Michael';
export var lastName = 'Jackson';
export var year = 1958;

// 或者
var firstName = 'Michael';
var lastName = 'Jackson';
var year = 1958;

export { firstName, lastName, year };
```

**需要特别注意的是，export命令规定的是对外的接口，必须与模块内部的变量建立一一对应关系。**
```
// 报错
export 1;

// 报错
var m = 1;
export m;
```

**export命令可以出现在模块的任何位置，只要处于模块顶层就可以。如果处于块级作用域内，就会报错**

### 4. import
使用export命令定义了模块的对外接口以后，其他 JS 文件就可以通过import命令加载这个模块。
**1.注意，import命令具有提升效果，会提升到整个模块的头部，首先执行。**
**2.由于import是静态执行，所以不能使用表达式和变量，这些只有在运行时才能得到结果的语法结构。**

```
// main.js
import { firstName as name1, lastName, year } from './profile.js';

function setName(element) {
  element.textContent = firstName + ' ' + lastName;
}

firstName = 123; // Syntax Error : 'firstName' is read-only;
```
**如果firstName为对象的话，是可以重新赋值的**
<br>
由于import是静态执行，所以不能使用表达式和变量

```
// 报错
import { 'f' + 'oo' } from 'my_module';

// 报错
let module = 'my_module';
import { foo } from module;

// 报错
if (x === 1) {
  import { foo } from 'module1';
} else {
  import { foo } from 'module2';
}

```
**import语句是 Singleton 模式。**
拓展：
单例模式是一种十分常用但却相对而言比较简单的设计模式。 它是指在一个类只能有一个实例，即使多次实例化该类，也只返回第一次实例化后的实例对象。 单例模式不仅能减少不必要的内存开销, 并且在减少全局的函数和变量冲突也具有重要的意义。

```
import { foo } from 'my_module';
import { bar } from 'my_module';

// 等同于
import { foo, bar } from 'my_module';
```

### 5. 模块的整体加载
除了指定加载某个输出值，还可以使用整体加载，即用星号（*）指定一个对象，所有输出值都加载在这个对象上面
```
// circle.js

export function area(radius) {
  return Math.PI * radius * radius;
}

export function circumference(radius) {
  return 2 * Math.PI * radius;
}

// 可以用*指定一个对象，所有的输出值都在这个对象上
import * as circle from './circle';

console.log('圆面积：' + circle.area(4));
console.log('圆周长：' + circle.circumference(14));
```

**注意，模块整体加载所在的那个对象（上例是circle），应该是可以静态分析的，所以不允许运行时改变**
```
import * as circle from './circle';

// 下面两行都是不允许的
circle.foo = 'hello';
circle.area = function () {};
```

### 6. export default
为模块指定默认输出。
输出一个叫做default的变量或方法，然后系统允许你为它取任意名字。
**export *命令会忽略circle模块的default方法**
```
// export-default.js
export default function () {
  console.log('foo');
}

// import-default.js
// 其他模块加载该模块时，import命令可以为该匿名函数指定任意名字。
import customName from './export-default';
customName(); // 'foo'


<!-- export default就是输出一个叫做default的变量或方法，然后系统允许你为它取任意名字。但是它后面不能跟变量声明语句。 -->
// modules.js
function add(x, y) {
  return x * y;
}
export {add as default};
// 等同于
// export default add;

// 错误
export default var a = 1;
```

如果想在一条import语句中，同时输入默认方法和其他接口
```
import _, { each, forEach } from 'lodash';

//
export default function (obj) {
  // ···
}
export function each(obj, iterator, context) {
  // ···
}
export { each as forEach };
```

### 7. export 与 import 的复合写法
如果在一个模块之中，先输入后输出同一个模块，import语句可以与export语句写在一起。
```
export { foo, bar } from 'my_module';

// 可以简单理解为
import { foo, bar } from 'my_module';
export { foo, bar };


// 接口改名
export { foo as myFoo } from 'my_module';

// 整体输出
export * from 'my_module';

// 复合写法：
export * as ns from "mod";

// 等同于
import * as ns from "mod";
export {ns};
```

### 8.模块的继承
模块之间也可以继承.
```
// circleplus.js
//export *命令会忽略circle模块的default方法
export * from 'circle';
export var e = 2.71828182846;
export default function(x) {
  return Math.exp(x);
}
```
### import() 
支持动态加载模块。弥补reuqire的动态加载功能。
import()返回一个 Promise 对象。
```
const main = document.querySelector('main');

import(`./section-modules/${someVariable}.js`)
  .then(module => {
    module.loadPageInto(main);
  })
  .catch(err => {
    main.textContent = err.message;
  });
```
特点：
1. 可以用在任何地方，不仅仅是模块，非模块的脚本也可以使用。它是运行时执行，也就是说，什么时候运行到这一句，就会加载指定的模块
2. 与所加载的模块没有静态连接关系
3. 类似于Node 的require方法，区别主要是前者是异步加载，后者是同步加载。

#### 适合场合
1. 按需加载
```
button.addEventListener('click', event => {
  import('./dialogBox.js')
  .then(dialogBox => {
    dialogBox.open();
  })
  .catch(error => {
    /* Error handling */
  })
});
```
2. 条件加载
import()可以放在if代码块，根据不同的情况，加载不同的模块。
```
if (condition) {
  import('moduleA').then(...);
} else {
  import('moduleB').then(...);
}
```

3. 动态的模块路径
import()允许模块路径动态生成
```
import(f())
.then(...);
```

#### 注意点：
import()加载模块成功以后，这个模块会作为一个对象，当作then方法的参数。因此，可以使用对象解构赋值的语法，获取输出接口。
```
//export1和export2都是myModule.js的输出接口，可以解构获得
import('./myModule.js')
.then(({export1, export2}) => {
  // ...·
});

import('./myModule.js')
.then(myModule => {
  console.log(myModule.default);
});

// 加载多个模块
Promise.all([
  import('./module1.js'),
  import('./module2.js'),
  import('./module3.js'),
])
.then(([module1, module2, module3]) => {
   ···
});

// import()也可以用在 async 函数之中。
async function main() {
  const myModule = await import('./myModule.js');
  const {export1, export2} = await import('./myModule.js');
  const [module1, module2, module3] =
    await Promise.all([
      import('./module1.js'),
      import('./module2.js'),
      import('./module3.js'),
    ]);
}
main();
```