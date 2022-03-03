## 执行上下文
- 当前js代码被解析和执行所在环境的抽象概念

### 执行上下文的类型
* 全局执行上下文： 只有一个，浏览器中的全局对象就是 window对象，this 指向这个全局对象
* 函数执行上下文：存在无数个，只有在函数被调用的时候才会被创建，每次调用函数都会创建一个新的执行上下文
* Eval 函数执行上下文： 指的是运行在 eval 函数中的代码

### 生命周期
创建 -> 执行 -> 回收

#### 1.创建阶段：确定this的值 -> LexicalEnvironment(词法环境) -> VariableEnvironment(变量环境)
1. 词法环境由两个部分组成：
* 全局环境：是一个没有外部环境的词法环境，其外部环境引用为null，有一个全局对象，this 的值指向这个全局对象
* 函数环境：用户在函数中定义的变量被存储在环境记录中，包含了arguments 对象，外部环境的引用可以是全局环境，也可以是包含内部函数的外部函数环境
```
GlobalExectionContext = {  // 全局执行上下文
  LexicalEnvironment: {       // 词法环境
    EnvironmentRecord: {     // 环境记录
      Type: "Object",           // 全局环境
      // 标识符绑定在这里 
      outer: <null>           // 对外部环境的引用
  }  
}

FunctionExectionContext = { // 函数执行上下文
  LexicalEnvironment: {     // 词法环境
    EnvironmentRecord: {    // 环境记录
      Type: "Declarative",      // 函数环境
      // 标识符绑定在这里      // 对外部环境的引用
      outer: <Global or outer function environment reference>  
  }  
}
```

2. 变量环境：也是一个词法环境
在ES6中，词法环境：用于存储函数的声明和变量绑定(let const)，和变量环境用于储存变量的绑定(var)
let和const在定义变量的创造阶段没有被赋值，但是var从创建阶段被赋值为undefined。
这是因为创建阶段会在代码中扫描变量和函数的声明，然后将函数声明存在环境中。但是变量会被初始化为undefined和保持uninitialized，
这是变量提升的原因。
```
let a = 20;  
const b = 30;  
var c;

function multiply(e, f) {  
 var g = 20;  
 return e * f * g;  
}

c = multiply(20, 30);

GlobalExectionContext = {

  ThisBinding: <Global Object>,

  LexicalEnvironment: {  // 词法环境
    EnvironmentRecord: {  
      Type: "Object",  
      // 标识符绑定在这里  
      a: < uninitialized >,  
      b: < uninitialized >,  
      multiply: < func >  
    }  
    outer: <null>  
  },

  VariableEnvironment: {  // 变量环境
    EnvironmentRecord: {  
      Type: "Object",  
      // 标识符绑定在这里  
      c: undefined,  
    }  
    outer: <null>  
  }  
}

FunctionExectionContext = {  
   
  ThisBinding: <Global Object>,

  LexicalEnvironment: {  
    EnvironmentRecord: {  
      Type: "Declarative",  
      // 标识符绑定在这里  
      Arguments: {0: 20, 1: 30, length: 2},  
    },  
    outer: <GlobalLexicalEnvironment>  
  },

  VariableEnvironment: {  
    EnvironmentRecord: {  
      Type: "Declarative",  
      // 标识符绑定在这里  
      g: undefined  
    },  
    outer: <GlobalLexicalEnvironment>  
  }  
}
```

#### 2. 执行阶段：执行变量赋值、代码执行
#### 3. 回收阶段：执行上下文出栈等待虚拟机回收执行上下文  ？其实我不懂 嘿嘿


##  执行栈：调用栈，具有后进先出(像桶装羽毛球)，用于存储在代码执行期间创建的所有执行上下文

let a = 'Hello World!';
function first() {
  console.log('Inside first function');
  second();
  console.log('Again inside first function');
}
function second() {
  console.log('Inside second function');
}
first();
console.log('Inside Global Execution Context');

创建全局上下文请压入执行栈
first函数被调用，创建函数执行上下文并压入栈
执行first函数过程遇到second函数，再创建一个函数执行上下文并压入栈
second函数执行完毕，对应的函数执行上下文被推出执行栈，执行下一个执行上下文first函数
first函数执行完毕，对应的函数执行上下文也被推出栈中，然后执行全局上下文
所有代码执行完毕，全局上下文也会被推出栈中，程序结束

![avatar](https://static.vue-js.com/ac11a600-74c1-11eb-ab90-d9ae814b240d.png)

