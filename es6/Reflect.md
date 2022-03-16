## Reflect 
定义：Reflect是ECMAScript2015中提供的一个全新的内置对象，如果按照java或者c#这类语言的说法，Reflect属于一个静态类，也就是说他不能通过new的方式去构建一个实例对象。只能够去调用这个静态类中的静态方法。(比如Math)
<br>

### 特点
基本特点：
* 只要Proxy对象具有的代理方法，Reflect对象全部具有，以静态方法的形式存在
* 修改某些Object方法的返回结果，让其变得更合理（定义不存在属性行为的时候不报错而是返回false）
* 让Object操作都变成函数行为

### 1.设计目的
1. 将Object对象的一些明显属于语言内部的方法（比如Object.defineProperty）放到Reflect对象上。现在是某些方法同时在Object和Reflect对象上部署，未来将只在Reflect上部署。
2. 修改某些Object的方法的返回结果，让其变得合理。比如在Object.defineProperty(obj, name, desc)在无法定义属性时，会抛出一个错误，而Reflect.defineProperty(obj, name, desc)则会返回false。
```
// 老写法
try {
  Object.defineProperty(target, property, attributes);
  // success
} catch (e) {
  // failure
}

// 新写法
if (Reflect.defineProperty(target, property, attributes)) {
  // success
} else {
  // failure
}
```
3. 让Object的操作都变成函数行为。比如 name in obj,delete obj[name]会变成Reflect.has(obj,name)和Reflect.deleteProperty(obj,name)

4. Reflect对象和方法和Proxy对象的方法一一对应，只要是Proxy对象的方法，就能在Reflect对象上找到对应的方法。这就让Proxy对象可以方便的调用对应的Reflect方法，完成默认行为，作为修改行为的基础。不管Proxy怎么修改，总能在Reflect上获取默认行为。

```
var loggedObj = new Proxy(obj, {
  get(target, name) {
    console.log('get', target, name);
    return Reflect.get(target, name);
  },
  deleteProperty(target, name) {
    console.log('delete' + name);
    return Reflect.deleteProperty(target, name);
  },
  has(target, name) {
    console.log('has' + name);
    return Reflect.has(target, name);
  }
});

```

有了Reflect对象以后，很多操作会更易读。
```
// 老写法
Function.prototype.apply.call(Math.floor, undefined, [1.75]) // 1

// 新写法
Reflect.apply(Math.floor, undefined, [1.75]) // 1
```

### 2.静态方法

Reflect.get(target,name,receiver):查找并返回target对象的name属性，如果没有该属性，则返回undefined。
**如果name属性部署了getter方法，则读取函数的this绑定receiver**
也就是属性如果有get方法，就会将this指向传入的第三个参数
```
var myObject = {
  foo: 1,
  bar: 2,
  get baz() {
    return this.foo + this.bar;
  },
};

var myReceiverObject = {
  foo: 4,
  bar: 4,
};

Reflect.get(myObject, 'baz', myReceiverObject)  // 8 
Reflect.get(myObject, 'foo', myReceiverObject)  // 1 

```
<br>

Reflect.set(target, name, value, receiver):target对象的name属性等于value。
**同样的，如果属性有setter，则赋值函数的this绑定receiver**

```
var myObject = {
  foo: 4,
  set bar(value) {
    return this.foo = value;
  },
  set foo(value) {
      
  }
};

var myReceiverObject = {
  foo: 0,
};

Reflect.set(myObject, 'bar', 1, myReceiverObject);
myObject.foo // 4 这里的foo没有发生改变，因为this绑定到了reveiver对象上
myReceiverObject.foo // 1 // 
```
注意，如果 Proxy对象和 Reflect对象联合使用，前者拦截赋值操作，后者完成赋值的默认行为，而且传入了receiver，那么Reflect.set会触发Proxy.defineProperty拦截。

```
let p = {
  a: 'a'
};

let handler = {
  set(target, key, value, receiver) {
    console.log('set');
    Reflect.set(target, key, value)
  },
  defineProperty(target, key, attribute) {
    console.log('defineProperty');
    Reflect.defineProperty(target, key, attribute);
  }
};

let obj = new Proxy(p, handler);
obj.a = 'A';
// set 这里只会出现一个set 如果Reflect.set传入了receiver，就会出发Proxy的defineProperty拦截，会打印defineProperty
```
<br>

Reflect.has(obj,name): 对应name in obj里面的in运算符。
```
var myObject = {
  foo: 1,
};

// 旧写法
'foo' in myObject // true

// 新写法
Reflect.has(myObject, 'foo') // true
```
<br>

Reflect.deleteProperty(obj, name):等同于delete obj[name]，用于删除对象的属性。
```
const myObj = { foo: 'bar' };

// 旧写法
delete myObj.foo;

// 新写法
Reflect.deleteProperty(myObj, 'foo');
```
<br>

Reflect.construct(target, args):等同于new target(...args)，这提供了一种不使用new，来调用构造函数的方法。

```
function Greeting(name) {
  this.name = name;
}

// new 的写法
const instance = new Greeting('张三');

// Reflect.construct 的写法
const instance = Reflect.construct(Greeting, ['张三']);
```
<br>

Reflect.getPrototypeOf方法用于读取对象的__proto__属性，对应Object.getPrototypeOf(obj)。

Reflect.getPrototypeOf和Object.getPrototypeOf的一个区别是，如果参数不是对象，Object.getPrototypeOf会将这个参数转为对象，然后再运行，而Reflect.getPrototypeOf会报错。
```
const myObj = new FancyThing();

// 旧写法
Object.getPrototypeOf(myObj) === FancyThing.prototype;

// 新写法
Reflect.getPrototypeOf(myObj) === FancyThing.prototype;

```

Reflect.setPrototypeOf(obj, newProto):Reflect.setPrototypeOf方法用于设置目标对象的原型（prototype），对应Object.setPrototypeOf(obj, newProto)方法。它返回一个布尔值，表示是否设置成功。
```
const myObj = {};

// 旧写法
Object.setPrototypeOf(myObj, Array.prototype);

// 新写法
Reflect.setPrototypeOf(myObj, Array.prototype);

myObj.length // 0
```


Reflect.apply(func, thisArg, args):Function.prototype.apply.call(func, thisArg, args)，用于绑定this对象后执行给定函数。

如果要绑定一个函数的this对象，可以这样写fn.apply(obj, args)，但是如果函数定义了自己的apply方法，就只能写成Function.prototype.apply.call(fn, obj, args)，采用Reflect对象可以简化这种操作

```
const ages = [11, 33, 12, 54, 18, 96];

// 旧写法·
const youngest = Math.min.apply(Math, ages);
const oldest = Math.max.apply(Math, ages);
const type = Object.prototype.toString.call(youngest);

// 新写法
const youngest = Reflect.apply(Math.min, Math, ages);
const oldest = Reflect.apply(Math.max, Math, ages);
const type = Reflect.apply(Object.prototype.toString, youngest, []);
```

... 还有一些，可以参考文档。


### 使用Proxy实现观察者模式
观察者模式（Observer mode）指的是函数自动观察数据对象，一旦对象有变化，函数就会自动执行。
```
// 观察者模式（Observer mode）指的是函数自动观察数据对象，一旦对象有变化，函数就会自动执行。

//创建一个set数组 用来执行函数
const queuedObservers = new Set();
const observe = fn => queuedObservers.add(fn); //观察者方法
const observable =  obj => new Proxy(obj, {
    set(target, key, value, receiver) {
        const result = Reflect.set(target, key, value, receiver);
        // set的执行在所有观察的方法
        queuedObservers.forEach(observer => observer(target))
        return result
    }
})

const person = observable({
    name:'lihua',
    age:12
})

const test = (obj)=>{
    console.log(obj);
}
observe(test)
person.name='123' // 当对象发生变化的时候会调用对应的方法。
```

