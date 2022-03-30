function render(vnode, container) {
    const prevNode = container.vnode;
    // 旧的不存在
    if (prevNode == null) {
        if (vnode) {
            mount(vnode, container);
            //将新的 VNode 添加到 container.vnode 属性下，这样下一次渲染时旧的 VNode 就存在了
            container.vnode = vnode
        }
    } else {
        if (vnode) {
            // patch
            patch(vnode, container)
            // 更新container的vnode
            container.vnode = vnode
        } else {
            // 移除
            // 有旧的 VNode 但是没有新的 VNode，这说明应该移除 DOM，在浏览器中可以使用 removeChild 函数。
            container.removeChild(prevNode.el);
            container.vnode = null;
        }
    }
}

//实现mount
// 普通标签
/**
 * 
     _isVNode: true,
    flags,
    tag,
    data,
    children,
    childFlags,
    el: null
 */
function mount(vnode, container) {
    // flags
    const { flags } = vnode;
    if (flags & VNodeFlags.ELEMENT) {
        // 挂载普通标签
        mountElement(vnode, container)
    } else if (flags & VNodeFlags.COMPONENT) {
        // 挂载组件
        mountComponent(vnode, container)
    } else if (flags & VNodeFlags.TEXT) {
        // 挂载纯文本
        mountText(vnode, container)
    } else if (flags & VNodeFlags.FRAGMENT) {
        // 挂载 Fragment
        mountFragment(vnode, container)
    } else if (flags & VNodeFlags.PORTAL) {
        // 挂载 Portal
        mountPortal(vnode, container)
    }
}
// 这里的mount存在什么问题呢
const domPropsRE = /\[A-Z]|^(?:value|checked|selected|muted)$/
function mountElement(vnode, container, isSVG) {
    // 不能严谨的处理 svg 
    isSVG = isSVG || vnode.flags & VNodeFlags.ELEMENT_SVG
    const el = isSVG
        ? document.createElementNS('http://www.w3.org/2000/svg', vnode.tag)
        : document.createElement(vnode.tag);
    vnode.el = el;
    // 没有将VNodeData的数据应用在元素上
    const data = vnode.data;
    if (data) {
        // 遍历
        for (const key in data) {
            switch (key) {
                case 'style':
                    for (const k in data.style) {
                        el.style[k] = data.style[k]
                    }
                    break;
                case 'class':
                    if (isSVG) {
                        el.setAttribute('class', data[key])
                    } else {
                        el.className = data[key]
                    }
                    break;

                default:
                    // 处理事件，要给事件加上特殊的标识，从而区别原生事件
                    if (key[0] === 'o' && key[1] === 'n') {
                        // 事件
                        el.addEventListener(key.slice(2), data[key])
                    } else if (domPropsRE.test(key)) {
                        // 一些特殊的事情，不能用setAttribute来处理的
                        // 当作 DOM Prop 处理
                        el[key] = data[key]
                    } else {
                        // 当作 Attr 处理
                        el.setAttribute(key, data[key])
                    }
                    break;
            }
        }
    }
    // VNode 被渲染为真实DOM之后，没有引用真实DOM元素   --- 会有什么问题呢
    vnode.el = el;
    // 如果有子节点   子节点也有很多类型
    const childFlags = vnode.childFlags
    const children = vnode.children
    // // 检测如果没有子节点则无需递归挂载
    if (childFlags !== ChildrenFlags.NO_CHILDREN) {
        if (childFlags & ChildrenFlags.SINGLE_VNODE) {
            //如果是单个子节点  // 需要多传递一个isSVG，为了让svg的字元素能够正确渲染
            mount(children, el, isSVG)
        } else if (childFlags & ChildrenFlags.MULTIPLE_VNODES) {
            // 如果是多个子节点
            for (let index = 0; index < children.length; index++) {

                mount(children[index], el, isSVG)
            }
        }
    }

    container.appendChild(el);
}

function mountText(vnode, container) {
    const el = document.createTextNode(vnode.children)
    vnode.el = el;
    container.appendChild(el)
}



function mountFragment(vnode, container, isSVG) {
    // 拿到 children 和 childFlags
    const { children, childFlags } = vnode
    switch (childFlags) {
        case ChildrenFlags.SINGLE_VNODE:
            // 如果是单个子节点，则直接调用 mount
            mount(children, container, isSVG);
            vnode.el = children.el
            break
        case ChildrenFlags.NO_CHILDREN:
            // 如果没有子节点，等价于挂载空片段，会创建一个空的文本节点占位
            const placeholder = createTextVNode('')
            mountText(placeholder, container)
            //  // 没有子节点指向占位的空文本节点
            vnode.el = placeholder.el
            break
        default:
            // 多个子节点，遍历挂载之
            for (let i = 0; i < children.length; i++) {
                mount(children[i], container, isSVG)

            }
            // 多个子节点，指向第一个子节点
            vnode.el = children[0].el
    }
}

// 挂载 Portal

function mountPortal(vnode, container) {
    const { tag, children, childFlags } = vnode

    // 获取挂载点
    const target = typeof tag === 'string' ? document.querySelector(tag) : tag

    if (childFlags & ChildrenFlags.SINGLE_VNODE) {
        // 将 children 挂载到 target 上，而非 container
        mount(children, target)
    } else if (childFlags & ChildrenFlags.MULTIPLE_VNODES) {
        for (let i = 0; i < children.length; i++) {
            // 将 children 挂载到 target 上，而非 container
            mount(children[i], target)
        }
    }
    //虽然 Portal 的内容可以被渲染到任意位置，但它的行为仍然像普通的DOM元素一样，如事件的捕获/冒泡机制仍然按照代码所编写的DOM结构实施。要实现这个功能就必须需要一个占位的DOM元素来承接事件。但目前来说，我们用一个空的文本节点占位即可
    // 占位的空文本节点
    const placeholder = createTextVNode('')
    // 将该节点挂载到 container 中
    mountText(placeholder, container, null)
    // el 属性引用该节点
    vnode.el = placeholder.el
}

// 有状态组件的挂载和原理
// 挂载一个有状态组件只需要四步，如下是 mountStatefulComponent 函数的实现：
function mountComponent(vnode, container, isSVG) {
    if (vnode.flags & VNodeFlags.COMPONENT_STATEFUL) {
        mountStatefulComponent(vnode, container, isSVG)
    } else {
        mountFunctionalComponent(vnode, container, isSVG)
    }
}

/**
 * 
实际上如果对于 有状态组件 和 函数式组件 具体的区别不太了解的同学看到这里或许会产生疑问，觉得 有状态组件 的实例化很多余，实际上实例化是必须的，因为 有状态组件 在实例化的过程中会初始化一系列 有状态组件 所特有的东西，诸如 data(或state)、computed、watch、生命周期等等。而函数式组件只有 props 和 slots，它要做的工作很少，所以性能上会更好。具体的关于本地数据、props 数据，计算属性，插槽等的设计和实现，我们在后面的章节中统一讲解，这里给大家展示的就是最根本的原理。 
 */

function mountStatefulComponent(vnode, container, isSVG) {
    // 创建组件实例 如果一个 VNode 描述的是有状态组件，那么 vnode.tag 属性值就是组件类的引用，所以通过 new 关键字创建组件实例。
    const instance = new vnode.tag()
    // 渲染VNode 一个组件的核心就是其 render 函数，通过调用 render 函数可以拿到该组件要渲染的内容。
    instance.$vnode = instance.render()
    // 挂载到 container 上就可以了。
    mount(instance.$vnode, container, isSVG)
    // el 属性值 和 组件实例的 $el 属性都引用组件的根DOM元素
    instance.$el = vnode.el = instance.$vnode.el
}

function mountFunctionalComponent(vnode, container, isSVG) {
    // 获取 VNode
    const $vnode = vnode.tag() // 这里的tag就是一个函数
    // 挂载
    mount($vnode, container, isSVG)
    // el 元素引用该组件的根元素
    vnode.el = $vnode.el
  }