// 函数内部可以访问到外层函数的作用域 
// 使用场景： 创建私有变量 延长变量使用的生命周期
// 缺点：降低处理速度和内存消耗
// 比如在JQ中也有用到闭包  一个沙箱环境就是一个闭包 惰性函数（ 可以用在浏览器兼容中 

// 柯里化函数：避免频繁调用具有相同参数函数和能够实现轻松重用
// 假设我们有一个求长方形面积的函数

function getArea(width, height) {
    return width * height
}
// 如果我们碰到的长方形的宽老是10
const area1 = getArea(10, 20)
const area2 = getArea(10, 30)
const area3 = getArea(10, 40)

// 我们可以使用闭包柯里化这个计算面积的函数
function getArea(width) {
    return height => {
        return width * height
    }
}

const getTenWidthArea = getArea(10)
// 之后碰到宽度为10的长方形就可以这样计算面积
const area1 = getTenWidthArea(20)

// 而且如果遇到宽度偶尔变化也可以轻松复用
const getTwentyWidthArea = getArea(20)
