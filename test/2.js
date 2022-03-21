function* gen() {
    // some code
}

var g = gen();
console.log(g[Symbol.iterator]());

console.log(g[Symbol.iterator]() === g);