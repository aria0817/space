// 不重新加载网页的情况下与服务器交换数据，并更新部分页面。
/**
 * 原理：
 * 通过XmlHttpRequest对象向服务器发起异步请求，从服务器获取数据，通过js来更新界面。
 */


var xhr = new XMLHttpRequest()
// async 是否异步。默认true
// xhr.open(method,url, [async][, user][, password])
xhr.open(xxx)
xhr.send([body])


var ajax = function(options){
    const xhr = new XMLHttpRequest()
    options = options || {}
    // 设置默认的方法
    options.type = (options.type||'GET').toUpperCase()
    options.dataType = options.dataType || 'json'

    const params = options.data

    if( options.type === 'GET'){
        xhr.open('GET',options.url + '?' + params)
        xhr.send(null)
    }else{
        xhr.open('POST',options.url)
        xhr.send(params)
    }

    /**
     * readyState
     * 0: 未打开 ： open还未调用
     * 1: 未发送： send还没有发出去
     * 2: 已获取相应头  send发出，相应头和相应状态已经返回
     * 3: 正在下载响应体 
     * 4: done 请求完成
     */

    xhr.onreadystatechange = function(){
        if(xhr.readyState === 4){
            let status = xhr.status
            if(status >=200 && status<300){
                options.success && options.success(xhr.responseText, xhr.responseXML)
            }else{
                options.fail && options.fail(status)
            }
        }
    }

}



// 使用
ajax({
    type: 'post',
    dataType: 'json',
    data: {},
    url: 'https://xxxx',
    success: function(text,xml){//请求成功后的回调函数
        console.log(text)
    },
    fail: function(status){////请求失败后的回调函数
        console.log(status)
    }
})
