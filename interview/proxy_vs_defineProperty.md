1. Proxy是对整个对象进行代理，而Obejct.defineProperty只能代理某个属性。
2. 对象上新增的属性，Proxy可以监听到，Obejct.defineProperty不能。
3. 数组新增的修改，Proxy可以监听到，Obejct.defineProperty不能。
4. 若对象内部属性要全部递归代理，Proxy可以只在调用的时候递归，而Object.definePropery需要一次完成所有递归，性能比Proxy差。
5. Proxy不兼容IE，Object.defineProperty不兼容IE8及以下
6. Proxy使用上比Object.defineProperty方便多。
