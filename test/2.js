// // 下面是二叉树的构造函数，
// // 三个参数分别是左树、当前节点和右树
// function Tree(left, label, right) {
//     this.left = left;
//     this.label = label;
//     this.right = right;
//   }

//   // 下面是中序（inorder）遍历函数。
//   // 由于返回的是一个遍历器，所以要用generator函数。
//   // 函数体内采用递归算法，所以左树和右树要用yield*遍历
//   function* inorder(t) {
//     if (t) {
//       yield* inorder(t.left);
//       yield t.label;
//       yield* inorder(t.right);
//     }
//   }

//   // 下面生成二叉树
//   function make(array) {
//     // 判断是否为叶节点
//     if (array.length == 1) return new Tree(null, array[0], null);
//     return new Tree(make(array[0]), array[1], make(array[2]));
//   }
//   let tree = make([[['a'], 'b', ['c']], 'd', [['e'], 'f', ['g']]]);
//   console.log(tree);
//   // 遍历二叉树
//   var result = [];
//   for (let node of inorder(tree)) {
//     result.push(node);
//   }

//   result
// ['a', 'b', 'c', 'd', 'e', 'f', 'g']

// function* g() { }

// // g.prototype.hello = function () {
// //     return 'hi!';
// // };

// console.log(g.prototype);

// let obj = g();

// obj instanceof g // true
// obj.hello()

// function* gen() {
//     this.a = 1;
//     yield this.b = 2;
//     yield this.c = 3;
// }

// function F() {
//     return gen.call(gen.prototype);
// }

// var f = new F();

// console.log(f.next());
// console.log(f.next());
// console.log(f.next());



// function* loadUI() {
//    console.log('************');
//     yield console.log('44444');;
//     console.log('%%%%%');
//   }
//   var loader = loadUI();
//   // 加载UI
//   loader.next()
  
//   // 卸载UI
//   loader.next()

// function* numbers() {
//     let file = new FileReader("numbers.txt");
//     console.log(file);
//     try {
//       while(!file.eof) {
//         yield console.log(parseInt(file.readLine(), 10));;
//       }
//     } finally {
//       file.close();
//     }
//   }

//   let g = numbers()
// console.log(g.next())

function run(fn) {
    var gen = fn();
  
    function next(err, data) {
      var result = gen.next(data);
      if (result.done) return;
      result.value(next);
    }
  
    next();
  }
  
  var g = function* (){
    var f1 = yield 'fileA';
    var f2 = yield 'fileB';
    // ...
    var fn = yield 'fileN';
  };
  
  
  run(g);