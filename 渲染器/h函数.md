## h函数
有了VNode后，开发中就变成了写VNode,我们使用h函数作为创建 VNode 对象的函数封装。
同时h函数也没有解决手写VNode的问题，后面还会有jsx和模版语法。

### 在VNode创建时确定其类型 - flags
这个 h 函数只能用来创建一个空的 <h1></h1> 标签，可以说没有任何意义。为了让 h 函数更加灵活，我们可以增加一些参数。
tag、data 和 children 
```
// tag来帮助确定VNode的类型
// VNode的flags来确定组件的类型，然后通过ChildrenFlags来确定children的类型
const Fragment = Symbol()
const Portal = Symbol()

function h(tag, data = null, children = null) {
    // 确认flags
    let flags = null;
    if (typeof tag === 'string') {
        // 说明这是html/svg的标签
        flags = tag === 'svg' ? VNodeFlags.ELEMENT_SVG : VNodeFlags.ELEMENT_HTML
    } else if (tag === Fragment) {
        //如果是一个片段
        flags = VNodeFlags.FRAGMENT
    } else if (tag === Portal) {
        // 如果是一个Portal，需要一个target的参数来确定组件的位置
        flags = VNodeFlags.PORTAL
        tag = data && data.target
    } else {
        // 为组件  兼容vue2 在 Vue2 中用一个对象作为组件的描述,通过检查该对象的 functional 属性的真假来判断该组件是否是函数式组件.
        if (tag !== null & typeof tag === 'object') {
            flags = tag.functional
                ? VNodeFlags.COMPONENT_FUNCTIONAL   // 函数式组件
                : VNodeFlags.COMPONENT_STATEFUL_NORMAL  // 有状态组件
        } else if (typeof tag === 'function') {
            // Vue3 中，因为有状态组件会继承基类，所以通过原型链判断其原型中是否有 render 函数的定义来确定该组件是否是有状态组件。
            flags = tag.prototype && tag.prototype.render
                ? VNodeFlags.COMPONENT_STATEFUL_NORMAL  // 有状态组件
                : VNodeFlags.COMPONENT_FUNCTIONAL       // 函数式组件
        }
    }

    // 在VNode创建时确定其children的类型
    /**
     *  以上用于确定 childFlags 的代码仅限于非组件类型的VNode，
     * 因为对于组件类型的VNode来说，它并没有子节点，所有子节点都应该作为 slots 存在。
     * 所以如果使用 h 函数创建一个组件类型的 VNode，那么我们应该把 children 的内容转化为 slots，
     * 然后再把 children 置为 null，
     */
    //
    let childFlags = null;
    if (Array.isArray(children)) {
        const { length } = children;
        if (length === 0) {
            childFlags = ChildrenFlags.NO_CHILDREN
        } else if (length === 1) {
            childFlags = ChildrenFlags.SINGLE_VNODE
            children = children[0]
        } else {
            // 多个子节点，且子节点使用key
            childFlags = ChildrenFlags.KEYED_VNODES
            children = normalizeVNodes(children)
        }
    } else if (children === null) {
        // 没有子节点
        childFlags = ChildrenFlags.NO_CHILDREN
    } else if (children._isVNode) {
        // 如果有isVNode，说明是单个VNode的对象
        // 单个子节点
        childFlags = ChildrenFlags.SINGLE_VNODE
    } else {
        // 其他情况都作为文本节点处理，即单个子节点，会调用 createTextVNode 创建纯文本类型的 VNode
        childFlags = ChildrenFlags.SINGLE_VNODE
        children = createTextVNode(children + '')
    }



    return {
        _isVNode: true,
        flags,
        tag,
        data,
        children,
        childFlags,
        el: null
    }
}


const normalizeVNodes = (children) => {
    const newChildren = [];
    for (let index = 0; index < children.length; index++) {
        const child = children[index]
        // // 如果原来的 VNode 没有key，则使用竖线(|)与该VNode在数组中的索引拼接而成的字符串作为key
        if (child.key == null) {
            child.key = '|' + index
        }
        newChildren.push(child)
    }
    // 返回新的children，此时 children 的类型就是 ChildrenFlags.KEYED_VNODES
    return newChildren
}

const createTextVNode = (text) => {
    return {
        _isVNode: true,
        flags: VNodeFlags.TEXT,
        tag: null,
        data: null,
        // 纯文本类型的 VNode，其 children 属性存储的是与之相符的文本内容
        children: text,
        // 文本节点没有子节点
        childFlags: ChildrenFlags.NO_CHILDREN,
        el: null

    }
}

// VNode的节点的枚举
const VNodeFlags = {
    // html 标签
    ELEMENT_HTML: 1,
    // SVG 标签
    ELEMENT_SVG: 1 << 1,

    // 普通有状态组件
    COMPONENT_STATEFUL_NORMAL: 1 << 2,
    // 需要被keepAlive的有状态组件
    COMPONENT_STATEFUL_SHOULD_KEEP_ALIVE: 1 << 3,
    // 已经被keepAlive的有状态组件
    COMPONENT_STATEFUL_KEPT_ALIVE: 1 << 4,
    // 函数式组件
    COMPONENT_FUNCTIONAL: 1 << 5,

    // 纯文本
    TEXT: 1 << 6,
    // Fragment
    FRAGMENT: 1 << 7,
    // Portal
    PORTAL: 1 << 8
}
// 子节点的枚举
const ChildrenFlags = {
    // 未知的 children 类型
    UNKNOWN_CHILDREN: 0,
    // 没有 children
    NO_CHILDREN: 1,
    // children 是单个 VNode
    SINGLE_VNODE: 1 << 1,

    // children 是多个拥有 key 的 VNode
    KEYED_VNODES: 1 << 2,
    // children 是多个没有 key 的 VNode
    NONE_KEYED_VNODES: 1 << 3
}

const elementVNode = h('div', null, h('span'))
const elementWithTextVNode = h('div', null, '我是文本')
const fragmentVNode = h(Fragment, null, [
    h('td'), h('td')
])
const portalVNode = h(
    Portal,
    {
      target: '#box'
    },
    h('h1')
  )
  
  // 
  /**
   * <template>
  <MyFunctionalComponent>
    <div></div>
  </MyFunctionalComponent>
</template>
   */

const  MyFunctionalComponent = () =>{
    return 2
}
const functionalComponentVNode = h(MyFunctionalComponent, null, h('div'))
console.log(functionalComponentVNode);


```

### 我们的 h 函数已经可以创建任何类型的 VNode 对象了