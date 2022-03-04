## Vite 

当前打包工具存在的问题：
* 本地启动时候，像webpack会把所有的模块先打包，然后在启动服务器，请求服务器的时候直接返回打包后的结果。在大型应用构建时候，导致启动很慢。
* 缓慢的更新，



实践：

webpack -> vite 


* 

vite暂时不支持vue 所以需要vue插件 vite-plugin-vue2


遇到的问题：
1. vite不支持ProviderPlugin，解决方案 https://github.com/vitejs/vite/discussions/3744
2. html 在js中使用模版语法 暂时还未解决  没法注入进去，因为是在html模版中取的值