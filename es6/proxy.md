## Proxy

### 1.定义
在目标对象之前设置一层拦截，外界对该对象的访问都必须先通过这一层拦截。因此提供了一种机制，可以对外界的访问进行过滤和改写。

### 2. 语法

```

let proxy = new Proxy(target,{
    get(target, propKey, receiver){
        // 重写get操作
        return target[propKey]
    },
    set(target, propKey, value, receiver){
        // 重写set操作
        target[propKey] = value
    }
})
```

支持一些拦截的方法：
* get(target, propKey, receiver)：拦截对象属性的读取，比如proxy.foo和proxy['foo']
* set(target, propKey, value, receiver)：拦截对象属性的设置，比如proxy.foo = v或proxy['foo'] = v，返回一个布尔值。
* has(target, propKey)：拦截propKey in proxy的操作，返回一个布尔值
* deleteProperty(target, propKey)：拦截delete proxy[propKey]的操作，返回一个布尔值。
* defineProperty(target, propKey, propDesc)：拦截Object.defineProperty(proxy, propKey, propDesc）、Object.defineProperties(proxy, propDescs)，返回一个布尔值。
* getPrototypeOf(target)：拦截Object.getPrototypeOf(proxy)，返回一个对象。
* apply(target, object, args)：拦截 Proxy 实例作为函数调用的操作，比如proxy(...args)、proxy.call(object, ...args)、proxy.apply(...)。
* construct(target, args)：拦截 Proxy 实例作为构造函数调用的操作，比如new proxy(...args)。
* isExtensible(target)：拦截Object.isExtensible(proxy)，返回一个布尔值。
* preventExtensions(target)：拦截Object.preventExtensions(proxy)，返回一个布尔值。

### 3. 方法实例

1. get() 方法用于拦截某个属性的读取操作，可以接受三个参数，依次为目标对象、属性名和 proxy 实例本身（严格地说，是操作行为所针对的对象），其中最后一个参数可选。
应用：利用 Proxy，可以将读取属性的操作（get），转变为执行某个函数，从而实现属性的链式操作。
```
var pipe = function (value) {
  var funcStack = [];
  var oproxy = new Proxy({} , {
    get : function (pipeObject, fnName) {
      if (fnName === 'get') {
        return funcStack.reduce(function (val, fn) {
          return fn(val);
        },value);
      }
      funcStack.push(window[fnName]);
      return oproxy;
    }
  });

  return oproxy;
}

var double = n => n * 2;
var pow    = n => n * n;
var reverseInt = n => n.toString().split("").reverse().join("") | 0;

pipe(3).double.pow.reverseInt.get; // 63

```

2. set 方法用来拦截某个属性的赋值操作，可以接受四个参数，依次为目标对象、属性名、属性值和 Proxy 实例本身，其中最后一个参数可选。

3. construct 方法用于拦截new命令
construct()拦截的是构造函数,所以它的目标对象必须是函数，否则就会报错。
参数：
target：目标对象。
args：构造函数的参数数组。
newTarget：创造实例对象时，new命令作用的构造函数（下面例子的p

```
const p = new Proxy(function () {}, {
  construct: function(target, args) {
    console.log('called: ' + args.join(', '));
    return { value: args[0] * 10 };
  }
});

(new p(1)).value // "called: 1"  // 10
```

4. deleteProperty 方法用于拦截delete操作，如果这个方法抛出错误或者返回false，当前属性就无法被delete命令删除。
```
var handler = {
  deleteProperty (target, key) {
    invariant(key, 'delete');
    delete target[key];
    return true;
  }
};
function invariant (key, action) {
  if (key[0] === '_') {
    throw new Error(`Invalid attempt to ${action} private "${key}" property`);
  }
}

var target = { _prop: 'foo' };
var proxy = new Proxy(target, handler);
delete proxy._prop
// Error: Invalid attempt to delete private "_prop" property

```

5. ownKeys()方法用来拦截对象自身属性的读取操作。
具体来说，拦截以下操作: 
Object.getOwnPropertyNames()
Object.getOwnPropertySymbols()
Object.keys()
for...in循环

可以改写返回的key
```

let target = {
  a: 1,
  b: 2,
  c: 3
};

let handler = {
  ownKeys(target) {
    return ['a'];
  }
};

let proxy = new Proxy(target, handler);

Object.keys(proxy)
// [ 'a' ]
```

⚠️
使用Object.keys()方法时，有三类属性会被ownKeys()方法自动过滤，不会返回：
目标对象上不存在的属性
属性名为 Symbol 值
不可遍历（enumerable）的属性


### this问题
虽然 Proxy 可以代理针对目标对象的访问，但它不是目标对象的透明代理，即不做任何拦截的情况下，也无法保证与目标对象的行为一致。主要原因就是在 Proxy 代理的情况下，目标对象内部的this关键字会指向 Proxy 代理。
```
const _name = new WeakMap();

class Person {
  constructor(name) {
    _name.set(this, name);
  }
  get name() {
    return _name.get(this);
  }
}

const jane = new Person('Jane');
jane.name // 'Jane'

const proxy = new Proxy(jane, {});   // 通过proxy访问，这里的this就指向了 proxy这个对象，而不是target
proxy.name // undefined 

```