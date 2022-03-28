###


### VNode的种类：
* html/svg这一类
* 组件本身
* 纯文本
* Fragment:渲染一个片段，一般是有多个根元素，比如td片段。如果发现该 VNode 的类型是 Fragment，就只需要把该 VNode 的子节点渲染到页面。
* Portal:组件要渲染的内容不受 DOM 层级关系限制，即可以渲染到任何位置。不管在哪里使用组件，都会把内容渲染到target的元素下。

![alt](https://hcysunyang.github.io/vue-design/assets/img/vnode-types.7d99313d.png)

### 使用 flags 作为 VNode 的标识
**枚举出VNodeFlags的类型，然后给VNode添加flags来标识VNode属于哪一类型，在对VNode进行不同的处理。**

```
const htmlVnode = {
  flags: VNodeFlags.ELEMENT_HTML,
  tag: 'div',
  data: null
}

// svg 元素节点
const svgVnode = {
  flags: VNodeFlags.ELEMENT_SVG,
  tag: 'svg',
  data: null
}

// 函数式组件
const functionalComponentVnode = {
  flags: VNodeFlags.COMPONENT_FUNCTIONAL,
  tag: MyFunctionalComponent
}

// 普通的有状态组件
const normalComponentVnode = {
  flags: VNodeFlags.COMPONENT_STATEFUL_NORMAL,
  tag: MyStatefulComponent
}

// Fragment
const fragmentVnode = {
  flags: VNodeFlags.FRAGMENT,
  // 注意，由于 flags 的存在，我们已经不需要使用 tag 属性来存储唯一标识
  tag: null
}

// Portal
const portalVnode = {
  flags: VNodeFlags.PORTAL,
  // 注意，由于 flags 的存在，我们已经不需要使用 tag 属性来存储唯一标识，tag 属性用来存储 Portal 的 target
  tag: target
}

```
对于VNode的子标签，也分出类型。
* 没有子节点
* 只有一个子节点
* 多个子节点
    - 有 key
    - 无 key
* 不知道子节点的情况

###
