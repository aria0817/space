## Generator
Generator 函数是 ES6 提供的一种异步编程解决方案。语法上，首先可以把它理解成，Generator 函数是一个状态机，封装了多个内部状态。

### 1.概念
<br>
其实可以理解成分段执行函数，yield表达式是暂停执行的标记，而next方法可以恢复执行。（在中间件中就有用到）
<br>

形式上，Generator 函数是一个普通函数，但是有两个特征。一是，function关键字与函数名之间有一个星号；二是，函数体内部使用yield表达式，定义不同的内部状态（yield在英语里的意思就是“产出”）。

```
function* helloWorldGenerator() {
  yield 'hello';
  yield 'world';
  return 'ending';
}

var hw = helloWorldGenerator();

hw.next(); // next方法返回的对象的value属性就是当前yield表达式的值
```

调用 Generator 函数后，该函数并不执行，返回的也不是函数运行结果，而是一个指向内部状态的指针对象，必须调用遍历器对象的next方法，使得指针移向下一个状态。通过next来移动指针。

### yield 表达式
yield表达式就是暂停标志。
遍历器对象的next方法的运行逻辑如下：
* （1）遇到yield表达式，就暂停执行后面的操作，并将紧跟在yield后面的那个表达式的值，作为返回的对象的value属性值。
* （2）下一次调用next方法时，再继续往下执行，直到遇到下一个yield表达式。
* （3）如果没有再遇到新的yield表达式，就一直运行到函数结束，直到return语句为止，并将return语句后面的表达式的值，作为返回的对象的value属性值。
* （4）如果该函数没有return语句，则返回的对象的value属性值为undefined。

yield vs return 
* 相同点都能返回紧跟在语句后面的那个表达式的值
* 区别在于每次遇到yield，函数暂停执行，下一次再从该位置继续向后执行，而return语句不具备位置记忆的功能

### Generator 函数执行后，返回一个遍历器对象
```
function* gen(){
  // some code
}

var g = gen();

g[Symbol.iterator]() === g
// true
```

### 2.next的参数
yield表达式本身没有返回值，或者说总是返回undefined。next方法可以带一个参数，该参数就会被当作上一个yield表达式的返回值。
<br>

Generator 函数运行的不同阶段，从外部向内部注入不同的值，从而调整函数行为。
```
function* f() {
  for(var i = 0; true; i++) {
    var reset = yield i;
    if(reset) { i = -1; }
  }
}

var g = f();

g.next() // { value: 0, done: false }
g.next() // { value: 1, done: false }
g.next(true) // { value: 0, done: false }
当传入true以后，reset会办成false,跳出循环。
```


### 3. for...of 循环
for...of循环可以自动遍历 Generator 函数运行时生成的Iterator对象，且此时不再需要调用next方法。(for of看上去就是一次性执行完所有的next)

```
function* foo() {
  yield 1;
  yield 2;
  yield 3;
  yield 4;
  yield 5;
  return 6;
}

for (let v of foo()) {
  console.log(v);
}
// 1 2 3 4 5
```
原生的 JavaScript 对象没有遍历接口，无法使用for...of循环，通过 Generator 函数为它加上这个接口，就可以用了。

```
function* objectEntries(obj) {
  let propKeys = Reflect.ownKeys(obj);

  for (let propKey of propKeys) {
    yield [propKey, obj[propKey]];
  }
}

let jane = { first: 'Jane', last: 'Doe' };

for (let [key, value] of objectEntries(jane)) {
  console.log(`${key}: ${value}`);
}

```

### 4. Generator.prototype.throw() 
Generator 函数返回的遍历器对象，都有一个throw方法，可以在函数体外抛出错误，然后在 Generator 函数体内捕获。需要用try...catch代码块才能在内部捕获，且是必须至少执行过一次next方法。
```
var g = function* () {
  try {
    yield;
  } catch (e) {
    console.log('内部捕获', e);
  }
};

var i = g();
i.next();

try {
  i.throw('a');
  i.throw('b');
} catch (e) {
  console.log('外部捕获', e);
}
// 内部捕获 a
// 外部捕获 b

遍历器对象i连续抛出两个错误。第一个错误被 Generator 函数体内的catch语句捕获。i第二次抛出错误，由于 Generator 函数内部的catch语句已经执行过了，不会再捕捉到这个错误了，所以这个错误就被抛出了 Generator 函数体，被函数体外的catch语句捕获。
```

### 5. Generator.prototype.return() 
Generator 函数返回的遍历器对象，还有一个return()方法，可以返回给定的值，并且终结遍历 Generator 函数。

```
function* gen() {
  yield 1;
  yield 2;
  yield 3;
}

var g = gen();

g.next()        // { value: 1, done: false }
g.return('foo') // { value: "foo", done: true } //在这里已经终结了函数
g.next()        // { value: undefined, done: true }
```

### next()、throw()、return() 的共同点
next()是将yield表达式替换成一个值。
```

const g = function* (x, y) {
  let result = yield x + y;
  return result;
};

const gen = g(1, 2);
gen.next(); // Object {value: 3, done: false}

gen.next(1); // Object {value: 1, done: true}
// 相当于将 let result = yield x + y
// 替换成 let result = 1;
```
throw()是将yield表达式替换成一个throw语句。
```
gen.throw(new Error('出错了')); // Uncaught Error: 出错了
// 相当于将 let result = yield x + y
// 替换成 let result = throw(new Error('出错了'));
```

return()是将yield表达式替换成一个return语句
```
gen.return(2); // Object {value: 2, done: true}
// 相当于将 let result = yield x + y
// 替换成 let result = return 2;
```

### yield* 表达式
用来在一个 Generator 函数里面执行另一个 Generator 函数。相当于直接加载这个函数的内容到外层的函数里面。
```
function* bar() {
  yield 'x';
  yield* foo();
  yield 'y';
}

// 等同于
function* bar() {
  yield 'x';
  yield 'a';
  yield 'b';
  yield 'y';
}

// 等同于
function* bar() {
  yield 'x';
  for (let v of foo()) {
    yield v;
  }
  yield 'y';
}

for (let v of bar()){
  console.log(v);
}

```
yield表达式返回整个字符串，yield*语句返回单个字符
```
function* gen(){
  yield* ["a", "b", "c"];
}

function* gen1(){
  yield ["a", "b", "c"];
}

gen().next()  // a 
gen1().next() // 返回值为["a", "b", "c"]

```
拉平数组
```
function* iterTree(tree) {
  if (Array.isArray(tree)) {
    for(let i=0; i < tree.length; i++) {
      yield* iterTree(tree[i]);
    }
  } else {
    yield tree;
  }
}

const tree = [ 'a', ['b', 'c'], ['d', 'e'] ];
[...iterTree(tree)] // 直接消费
<!-- for(let x of iterTree(tree)) {
  console.log(x);
} -->
```

### 应用
Generator 与状态机
```
var clock = function* () {
    while (true) {
        console.log('Tick!');
        yield;
        console.log('Tock!');
        yield;
    }
};
let g = clock()
```

1. 异步操作的同步化表达

```
function* loadUI() {
  showLoadingScreen();
  yield loadUIDataAsynchronously();
  hideLoadingScreen();
}
var loader = loadUI();
// 加载UI
loader.next()

// 卸载UI
loader.next()
```

2. 部署 Iterator 接口 
可以在对象上部署Iterator
```

function* iterEntries(obj) {
  let keys = Object.keys(obj);
  for (let i=0; i < keys.length; i++) {
    let key = keys[i];
    yield [key, obj[key]];
  }
}

let myObj = { foo: 3, bar: 7 };

for (let [key, value] of iterEntries(myObj)) {
  console.log(key, value);
}

```

3. 作为数据结构
Generator 可以看作是数据结构，更确切地说，可以看作是一个数组结构，因为 Generator 函数可以返回一系列的值，这意味着它可以对任意表达式，提供类似数组的接口。
```
function* doStuff() {
  yield fs.readFile.bind(null, 'hello.txt');
  yield fs.readFile.bind(null, 'world.txt');
  yield fs.readFile.bind(null, 'and-such.txt');
}
for (task of doStuff()) {
  // task是一个函数，可以像回调函数那样使用它
}
```
<br>

## Generator 函数的异步应用
JavaScript 语言的执行环境是“单线程”的，如果没有异步编程，根本没法用，非卡死不可。出现了以下几个方法来解决同步问题。
* 回调函数
* 事件监听
* 发布/订阅
* Promise 对象

回调函数
```
fs.readFile('/etc/passwd', 'utf-8', function (err, data) {
  if (err) throw err;
  console.log(data);
});
回调函数的第一个参数，必须是错误对象.因为第一段执行完以后，任务所在的上下文环境就已经结束了。在这以后抛出的错误，原来的上下文环境已经无法捕捉，只能当作参数，传入第二段。
```


Promise 的最大问题是代码冗余，原来的任务被 Promise 包装了一下，不管什么操作，一眼看去都是一堆then，原来的语义变得很不清楚。
```
fs.readFile(fileA, 'utf-8', function (err, data) {
  fs.readFile(fileB, 'utf-8', function (err, data) {
    // ...
  });
});


var readFile = require('fs-readfile-promise');
readFile(fileA)
.then(function (data) {
  console.log(data.toString());
})
.then(function () {
  return readFile(fileB);
})

```




协程的 Generator 函数实现，最大特点就是可以交出函数的执行权（即暂停执行）。
```
//由于Fetch模块返回的是一个 Promise 对象，因此要用then方法调用下一个next方法。
var fetch = require('node-fetch');

function* gen(){
  var url = 'https://api.github.com/users/github';
  var result = yield fetch(url);
  console.log(result.bio);
}

var g = gen();
var result = g.next();

result.value.then(function(data){
  return data.json();
}).then(function(data){
  g.next(data);
});

```

### Genreator函数的自动执行
总结：

* 由于yield表达式可以暂停执行，next方法可以恢复执行，这使得Generator函数很适合用来将异步任务同步化。
* 但是Generator函数的流程控制会稍显麻烦，因为每次都需要手动执行next方法来恢复函数执行，并且向next方法传递参数以输出上一个yiled表达式的返回值。
* 于是就有了thunk(thunkify)函数和co模块来实现Generator函数的自动流程控制。
* 通过thunk(thunkify)函数分离参数，以闭包的形式将参数逐一传入，再通过apply或者call方法调用，然后配合使用run函数可以做到自动流程控制。
* 通过co模块，实际上就是将run函数和thunk(thunkify)函数进行了封装，并且yield表达式同时支持thunk(thunkify)函数和Promise对象两种形式，使得自动流程控制更加的方便。

```
var fs = require('fs');

var readFile = function (fileName){
  return new Promise(function (resolve, reject){
    fs.readFile(fileName, function(error, data){
      if (error) return reject(error);
      resolve(data);
    });
  });
};

var gen = function* (){
  var f1 = yield readFile('/etc/fstab');
  var f2 = yield readFile('/etc/shells');
  console.log(f1.toString());
  console.log(f2.toString());
};

// 自动执行 用递归调用执行
function run(gen){
  var g = gen();

  function next(data){
    var result = g.next(data);
    if (result.done) return result.value;
    result.value.then(function(data){
      next(data);
    });
  }

  next();
}

run(gen);
```




