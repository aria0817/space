# Class
## 1. 类的由来
ES6 的class可以看作只是一个语法糖，它的绝大部分功能，ES5 都可以做到，新的class写法只是让对象原型的写法更加清晰、更像面向对象编程的语法而已。
**ES6 的类，完全可以看作构造函数的另一种写法。**

class vs function 
1. constructor class中，constructor被定义在prototype上，构造函数constructor指向构造器自身
2. 重复定义 class会报错，构造函数会覆盖之前定义的方法
3. 原型/类中方法枚举： class不可以被Object.keys枚举到，构造函数可以(constructor除外)
4. class 没有变量提升
5. class定义的类没有私有方法和属性
6. this指向， class用类似于解构的方式获取原型上的方法

<br>

类的数据类型就是函数，类本身就指向构造函数。
```
function Point(x, y) {
  this.x = x;
  this.y = y;
}

Point.prototype.toString = function () {
  return '(' + this.x + ', ' + this.y + ')';
};

var p = new Point(1, 2);

class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  toString() {
    return '(' + this.x + ', ' + this.y + ')';
  }
}
```

**类的内部所有定义的方法，都是不可枚举的（non-enumerable）**
```
class Point {
  constructor(x, y) {
    // ...
  }

  toString() {
    // ...
  }
}

Object.keys(Point.prototype)
// []
Object.getOwnPropertyNames(Point.prototype)
// ["constructor","toString"]
```

### constructor 方法
constructor()方法默认返回实例对象（即this），完全可以指定返回另外一个对象。
```
class Foo {
  constructor() {
    return Object.create(null);
  }
}

new Foo() instanceof Foo
// false
```
上面代码中，constructor()函数返回一个全新的对象，结果导致实例对象不是Foo类的实例。

### 类的实例
实例的属性除非显式定义在其本身（即定义在this对象上），否则都是定义在原型上（即定义在class上）。

```
//定义类
class Point {

  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  toString() {
    return '(' + this.x + ', ' + this.y + ')';
  }

}

var point = new Point(2, 3);

point.toString() // (2, 3)

point.hasOwnProperty('x') // true
point.hasOwnProperty('y') // true
point.hasOwnProperty('toString') // false
point.__proto__.hasOwnProperty('toString') // true

```
类的所有实例共享一个原型对象.
```
var p1 = new Point(2,3);
var p2 = new Point(3,2);

p1.__proto__.printName = function () { return 'Oops' }; // p1的原型对象加上printName后，其他由Point实例化出来的实例的也可以调用

p1.printName() // "Oops"
p2.printName() // "Oops"

var p3 = new Point(4,2);
p3.printName() // "Oops"

```

### getter seeter
与 ES5 一样，在“类”的内部可以使用get和set关键字，对某个属性设置存值函数和取值函数，拦截该属性的存取行为。
```
class MyClass {
  constructor() {
    // ...
  }
  get prop() {
    return 'getter';
  }
  set prop(value) {
    console.log('setter: '+value);
  }
}

let inst = new MyClass();

inst.prop = 123;
// setter: 123

inst.prop
// 'getter'
```
### 属性表达式，类的属性名可以采用表达式

### Class 表达式 
在 Class 外部，这个类只能用MyClass引用。
```
const MyClass = class Me {
  getClassName() {
    return Me.name;
  }
};
let inst = new MyClass();
inst.getClassName() // Me
Me.name // ReferenceError: Me is not defined

```
采用 Class 表达式，可以写出立即执行的 Class。
```
let person = new class {
  constructor(name) {
    this.name = name;
  }

  sayName() {
    console.log(this.name);
  }
}('张三');

person.sayName(); // "张三"
```

### 注意点：
1. 类和模块内部默认就是严格模式
2. 不存在变量提升
3. name属性，name属性总是返回紧跟在class关键字后面的类名。
4. Generator方法：如果某个方法之前加上星号（*），就表示该方法是一个 Generator 函数
5. this指向 类的方法内部如果含有this，它默认指向类的实例

## 2. 静态方法
类相当于实例的原型，所有在类中定义的方法，都会被实例继承。如果在一个方法前，加上static关键字，就表示该方法不会被实例继承，而是直接通过类来调用，这就称为“静态方法”。
```
class Foo {
  static classMethod() {
    return 'hello';
  }
}

Foo.classMethod() // 'hello'

var foo = new Foo();
foo.classMethod()
// TypeError: foo.classMethod is not a function
```
父类的静态方法，可以被子类继承。
```
class Foo {
  static classMethod() {
    return 'hello';
  }
}

class Bar extends Foo {
}

Bar.classMethod() // 'hello'
```

## 3. 实例属性的新写法
```
class IncreasingCounter {
// 这个属性也可以定义在类的最顶层，其他都不变
  _count = 0;
  get value() {
    console.log('Getting the current value!');
    return this._count;
  }
  increment() {
    this._count++;
  }
}
```
## 4. 静态属性
```
class MyClass {
  static myStaticProp = 42;

  constructor() {
    console.log(MyClass.myStaticProp); // 42
  }
}
```

## 5.私有方法和私有属性
es6没有给class提供私方法和属性
利用Symbol值的唯一性来命明私有方法

### 静态块
允许在类的内部设置一个代码块，在类生成时运行一次，主要作用是对静态属性进行初始化。每个类只能有一个静态块，在静态属性声明后运行。静态块的内部不能有return语句

### new.target属性
一般用在构造函数之中，返回new命令作用于的那个构造函数
```
function Person(name) {
  if (new.target !== undefined) {
    this.name = name;
  } else {
    throw new Error('必须使用 new 命令生成实例');
  }
}

// 另一种写法
function Person(name) {
  if (new.target === Person) {
    this.name = name;
  } else {
    throw new Error('必须使用 new 命令生成实例');
  }
}

var person = new Person('张三'); // 正确
var notAPerson = Person.call(person, '张三');  // 报错


class Rectangle {
  constructor(length, width) {
    console.log(new.target === Rectangle);
    // ...
  }
}

class Square extends Rectangle {
  constructor(length, width) {
    super(length, width);
  }
}

var obj = new Square(3); // 输出 false
```

## Class的继承
Class 可以通过extends关键字实现继承，让子类继承父类的属性和方法。
### 为什么要在子类中调用super方法
ES5 的继承机制，是先创造一个独立的子类的实例对象，然后再将父类的方法添加到这个对象上面，即“实例在前，继承在后”。ES6 的继承机制，则是先将父类的属性和方法，加到一个空的对象上面，然后再将该对象作为子类的实例，即“继承在前，实例在后”。这就是为什么 ES6 的继承必须先调用super()方法。

```
class Foo {
  constructor() {
    console.log(1);
  }
}

class Bar extends Foo {
  constructor() {
    super();
    console.log(2);
  }
}

const bar = new Bar();
// 1
// 2
新建子类实例时，父类的构造函数必定会先运行一次。
// 只有调用super()之后，才可以使用this关键字，否则会报错
```

继承逻辑：**除了私有属性，父类的所有属性和方法，都会被子类继承，其中包括静态方法。**

### 2. Object.getPrototypeOf 可以用来从子类上获取父类。
```
class Point { /*...*/ }
class ColorPoint extends Point { /*...*/ }
Object.getPrototypeOf(ColorPoint) === Point
// true
可以使用这个方法判断，一个类是否继承了另一个类。
```

### 3. super关键字
super这个关键字，既可以当作函数使用，也可以当作对象使用。**使用super的时候，必须显式指定是作为函数、还是作为对象使用，否则会报错。**
1. 当作函数调用，代表父类的构造函数。**super()内部的this指向当前class,并且只能用在子类的构造函数之中**
super虽然代表了父类A的构造函数，但是返回的是子类B的实例，即super内部的this指的是B的实例，因此super()在这里相当于A.prototype.constructor.call(this)。
```
class A {
  constructor() {
    console.log(new.target.name);
  }
}
class B extends A {
  constructor() {
    super();
  }
}
new A() // A
new B() // B

```

2. super作为对象使用
**在普通方法中，指向父类的原型对象；在静态方法中，指向父类。**
```
class A {
  p() {
    return 2;
  }
}

class B extends A {
  constructor() {
    super();
    console.log(super.p()); // 2
  }
}

let b = new B();
```
### 4. 类的 prototype 属性和__proto__属性
第一种，子类继承Object类。
A其实就是构造函数Object的复制，A的实例就是Object的实例。


```
class A extends Object {
}

A.__proto__ === Object // true
A.prototype.__proto__ === Object.prototype // true
```
第二种情况，不存在任何继承。
```
class A {
}

A.__proto__ === Function.prototype // true
A.prototype.__proto__ === Object.prototype // true
```
A作为一个基类（即不存在任何继承），就是一个普通函数，所以直接继承Function.prototype。但是，A调用后返回一个空对象（即Object实例），所以A.prototype.__proto__指向构造函数（Object）的prototype属性。


### 5. 构造函数的继承
ES5不可以继承，子类无法获得原生构造函数的内部属性，通过Array.apply()或者分配给原型对象都不行。
ES6 可以自定义原生数据结构（比如Array、String等）的子类。
**extends关键字不仅可以用来继承类，还可以用来继承原生的构造函数。**
```
class VersionedArray extends Array {
  constructor() {
    super();
    this.history = [[]];
  }
  commit() {
    this.history.push(this.slice());
  }
  revert() {
    this.splice(0, this.length, ...this.history[this.history.length - 1]);
  }
}

var x = new VersionedArray();

x.push(1);
x.push(2);
x // [1, 2]
x.history // [[]]

x.commit();
x.history // [[], [1, 2]]

x.push(3);
x // [1, 2, 3]
x.history // [[], [1, 2]]

x.revert();
x // [1, 2]

```


