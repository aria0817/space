// 用promise对象实现ajax 

const ajaxGet = function(url){
    const promise = new Promise(function(res,rej){
       const handler = function(){
           if(this.readyState !== 4){
               return;
           }
           if(this.status === 200){
            res(this.response)
           }else{
               rej(new Error(this.statusText))
           }
       }
       const clinet = new XMLHttpRequest();
       clinet.open("GET",url)
       clinet.send();
       clinet.onreadystatechange = handler;

    })
    return promise
}

ajaxGet('xxx').then((val)=>{
    console.log('success');
},(error)=>{
    console.error(error);
})