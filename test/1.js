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

person.name='123'
