class MyComponment {
    render(){
        return {
            tag:'div'
        }
    }
}
// vDOM的tag指向组件本身
const componentVnode = {
    tag:MyComponment
}
// 渲染
render(componentVnode, document.getElementById('app'))

function mountElement(vnode,container){
    // html标签
    const el = document.createElement(vnode.tag)
    container.appendChild(el)
}

function mountComponent(vnode,container){
    // 创建组件实例
    const instance = new vnode.tag()
    // 渲染出vdom
    instance.$vnode = instance.render()
    //将vdom挂载上去
    mountElement(instance.$vnode,container)
}

function render(vnode,container){
    //首先判断是不是组件，如果不是组件就可以直接渲染chu lai
    if(typeof componentVnode.tag === 'string'){
        // 如果是html标签，就创建元素并且append到容器中
        mountElement(vnode,container)
    }else{
        mountComponent(vnode,container)
    }
}