// function timeout(ms) {
//     return new Promise((resolve) => {
//       setTimeout(resolve, ms);
//     });
//   }

//   async function asyncPrint(value, ms) {
//       console.log('test');
//     await timeout(ms);
//     console.log(value);
//   }

//   asyncPrint('hello world', 1000);
// class Foo {
//     constructor(...args) {
//       this.args = args;
//     }
//     * [Symbol.iterator]() {
//       for (let arg of this.args) {
//         yield arg;
//       }
//     }
//   }
//   // 
//   for (let x of new Foo('hello', 'world')) {
//     console.log(x);
//   }

// class Logger {
//     printName(name = 'there') {
//         console.log(this);
//       this.print(`Hello ${name}`);
//     }

//     print(text) {
//       console.log(text);
//     }
//   }

//   const logger = new Logger();
//   logger.printName()
//   const { printName } = logger;
//   printName(); 

// class Point {
//     constructor(x) {
//         this.x = x
//         console.log(this.x);
//     }

// }
// class ColorPoint extends Point {
//     constructor(y) {
//         super()
//         this.y = y
//         console.log(this.y);
//     }
// }
// let a = new ColorPoint(2)

class Point {
    #x;
    #y;

    constructor(x, y) {
        this.#x = x;
        this.#y = y;
    }

    equals(point) {
        return this.#x === point.#x && this.#y === point.#y;
    }
}

var t = new Point(1,2)
console.log(t.equals());