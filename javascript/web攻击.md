## web攻击

Web攻击（WebAttack）是针对用户上网行为或网站服务器等设备进行攻击的行为。如植入恶意代码，修改网站权限，获取网站用户隐私信息等等


### 常见的web攻击
* XSS (Cross Site Scripting) 跨站脚本攻击
* CSRF（Cross-site request forgery）跨站请求伪造
* SQL注入攻击
* DDOS 分布式拒绝服务攻击

#### 1.XSS攻击
XSS跨站脚本攻击定义: 跨站脚本攻击是指通过存在安全漏洞的Web网站注册用户的浏览器内运行非法的HTML标签或JavaScript进行的一种攻击。
XSS 的原理:
是恶意攻击者往 Web 页面里插入恶意可执行网页脚本代码，当用户浏览该页之时，嵌入其中 Web 里面的脚本代码会被执行，从而可以达到攻击者盗取用户信息或其他侵犯用户安全隐私的目的。

1. 非持久型 XSS（反射型 XSS ） 用户被诱骗点击到带有恶意脚本的代码参数的URL,点击后恶意的代码会被html解析和执行。
攻击者可以直接通过 URL (类似：https://xxx.com/xxx?default=<script>alert(document.cookie)</script>) 注入可执行的脚本代码。不过一些浏览器如Chrome其内置了一些XSS过滤器，可以防止大部分反射型XSS攻击。
<br>

非持久型 XSS 漏洞攻击有以下几点特征：
* 即时性，不经过服务器存储，直接通过 HTTP 的 GET 和 POST 请求就能完成一次攻击，拿到用户隐私数据。
* 攻击者需要诱骗点击,必须要通过用户点击链接才能发起
* 反馈率低，所以较难发现和响应修复
* 盗取用户敏感保密信息
<br>

防止非持久型XSS漏洞：
* Web页面渲染的所有内容或者渲染的数据都必须来自于服务端
* 尽量不要用eval，new Function(),document.write()，window.setInterval()，window.setTimeout()，innerHTML，document.createElement()等方法
* 尽量不要从URL，document.referrer，document.forms 等这种 DOM API 中获取数据直接渲染
* 前端渲染的时候对任何的字段都需要做 escape 转义编码。

2. 持久型XSS(存储型XSS) 一般是Form表单提交等交互功能，将内容经正常的提交到数据库持久保存，当前端页面获得后端从数据库中读取注入代码时，就会渲染恶意内容

攻击成功需要同时满足以下几个条件：
* POST 请求提交表单后端没做转义直接入库。
* 后端从数据库中取出数据没做转义直接输出给前端。
* 前端拿到后端数据没做转义直接渲染成 DOM。

持久型 XSS 有以下几个特点：
* 持久性，植入在数据库中
* 盗取用户敏感私密信息
* 危害面广

防御：
* CSP：建立白名单，开发者明确告诉浏览器哪些外部资源可以加载和执行。我们只需要配置规则，如何拦截是由浏览器自己实现的。我们可以通过这种方式来尽量减少 XSS 攻击。
通常可以通过两种方式来开启 CSP：
设置 HTTP Header 中的 Content-Security-Policy
设置 meta 标签的方式

* 转义字符 
用户的输入永远不可信任的，最普遍的做法就是转义输入输出的内容，对于引号、尖括号、斜杠进行转义

* HttpOnly Cookie 
这是预防XSS攻击窃取用户cookie最有效的防御手段。Web应用程序在设置cookie时，将其属性设为HttpOnly，就可以避免该网页的cookie被客户端恶意JavaScript窃取，保护用户cookie信息。(js无法读取cookie的信息)


#### 2. CSRF(Cross Site Request Forgery) 即跨站请求
它利用用户已登录的身份，在用户毫不知情的情况下，以用户的名义完成非法操作。
![alt](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/1/24/1688030a24702301~tplv-t2oaga2asx-zoom-in-crop-mark:1304:0:0:0.awebp)

完成 CSRF 攻击必须要有三个条件:
* 用户已经登录了站点 A，并在本地记录了 cookie
* 在用户没有登出站点 A 的情况下（也就是 cookie 生效的情况下），访问了恶意攻击者提供的引诱危险站点 B (B 站点要求访问站点A)。
* 站点 A 没有做任何 CSRF 防御

防范 CSRF 攻击可以遵循以下几种规则：
* Get 请求不对数据进行修改 
* 不让第三方网站访问到用户 Cookie 
* 阻止第三方网站请求接口
* 请求时附带验证信息，比如验证码或者 Token

1）SameSite:可以对 Cookie 设置 SameSite 属性。该属性表示 Cookie 不随着跨域请求发送，可以很大程度减少 CSRF 的攻击，但是该属性目前并不是所有浏览器都兼容。
2) Referer Check: 可以通过检查请求的来源来防御CSRF攻击。正常请求的referer具有一定规律，如在提交表单的referer必定是在该页面发起的请求。所以通过检查http包头referer的值是不是这个页面，来判断是不是CSRF攻击。
3）Anti CSRF Token: 即发送请求时在HTTP 请求中以参数的形式加入一个随机产生的token，并在服务器建立一个拦截器来验证这个token。服务器读取浏览器当前域cookie中这个token值，会进行校验该请求当中的token和cookie当中的token值是否都存在且相等，才认为这是合法的请求。否则认为这次请求是违法的，拒绝该次服务。
4) 验证码:应用程序和用户进行交互过程中，特别是账户交易这种核心步骤，强制用户输入验证码，才能完成最终请求。在通常情况下，验证码够很好地遏制CSRF攻击。但增加验证码降低了用户的体验，网站不能给所有的操作都加上验证码。所以只能将验证码作为一种辅助手段，在关键业务点设置验证码。


3. 点击挟持 ：是一种视觉欺骗的攻击手段。攻击者将需要攻击的网站通过 iframe 嵌套的方式嵌入自己的网页中，并将 iframe 设置为透明，在页面中透出一个按钮诱导用户点击。

特点：
* 隐蔽性较高，骗取用户操作
* "UI-覆盖攻击"
* 利用iframe或者其它标签的属性

原理：
用户在登陆 A 网站的系统后，被攻击者诱惑打开第三方网站，而第三方网站通过 iframe 引入了 A 网站的页面内容，用户在第三方网站中点击某个按钮（被装饰的按钮），实际上是点击了 A 网站的按钮。

防御：
* X-FRAME-OPTIONS是一个 HTTP 响应头，这个 HTTP 响应头 就是为了防御用 iframe 嵌套的点击劫持攻击。
* javascript防御  以上代码的作用就是当通过 iframe 的方式加载页面时，攻击者的网页直接不显示所有内容了。
```
<head>
  <style id="click-jack">
    html {
      display: none !important;
    }
  </style>
</head>
<body>
  <script>
    if (self == top) {
      var style = document.getElementById('click-jack')
      document.body.removeChild(style)
    } else {
      top.location = self.location
    }
  </script>
</body>
```

4. URL跳转漏洞:借助未验证的URL跳转，将应用程序引导到不安全的第三方区域，从而导致的安全问题。
原理:
黑客构建恶意链接(链接需要进行伪装,尽可能迷惑),发在QQ群或者是浏览量多的贴吧/论坛中。 安全意识低的用户点击后,经过服务器或者浏览器解析后，跳到恶意的网站中。

实现方式：
* Header头跳转
* Javascript跳转
* META标签跳转

```
<?php
$url=$_GET['jumpto'];
header("Location: $url");
?>

http://www.wooyun.org/login.php?jumpto=http://www.evil.com
这里用户会认为www.wooyun.org都是可信的，但是点击上述链接将导致用户最终访问www.evil.com这个恶意网址。

```

防御：
1)referer的限制：如果确定传递URL参数进入的来源，我们可以通过该方式实现安全限制，保证该URL的有效性，避免恶意用户自己生成跳转链接
2)加入有效性验证Token:我们保证所有生成的链接都是来自于我们可信域的，通过在生成的链接里加入用户不可控的Token对生成的链接进行校验，可以避免用户生成自己的恶意链接从而被利用，但是如果功能本身要求比较开放，可能导致有一定的限制。


5. SQL注入：
原理：我们会发现SQL注入流程中与正常请求服务器类似，只是黑客控制了数据，构造了SQL查询，而正常的请求不会SQL查询这一步，SQL注入的本质:数据和代码未分离，即数据当做了代码来执行。
SQL注入的必备条件： 1.可以控制输入的数据 2.服务器要执行的代码拼接了控制的数据。

危害：
* 获取数据库信息
        管理员后台用户名和密码
        获取其他数据库敏感信息：用户名、密码、手机号码、身份证、银行卡信息……
        整个数据库：脱裤
* 获取服务器权限
* 植入Webshell，获取服务器后门
* 读取服务器敏感文件

防御：
* 严格限制Web应用的数据库的操作权限，给此用户提供仅仅能够满足其工作的最低权限，从而最大限度的减少注入攻击对数据库的危害
* 后端代码检查输入的数据是否符合预期，严格限制变量的类型，例如使用正则表达式进行一些匹配处理。
* 对进入数据库的特殊字符（'，"，\，<，>，&，*，; 等）进行转义处理，或编码转换。基本上所有的后端语言都有对字符串进行转义处理的方法，比如 lodash 的 lodash._escapehtmlchar 库。
* 所有的查询语句建议使用数据库提供的参数化查询接口，参数化的语句使用参数而不是将用户输入变量嵌入到 SQL 语句中，即不要直接拼接 SQL 语句。


6. OS命令注入攻击
OS命令注入和SQL注入差不多，只不过SQL注入是针对数据库的，而OS命令注入是针对操作系统的。OS命令注入攻击指通过Web应用，执行非法的操作系统命令达到攻击的目的。只要在能调用Shell函数的地方就有存在被攻击的风险。倘若调用Shell时存在疏漏，就可以执行插入的非法命令。

命令注入攻击可以向Shell发送命令，让Windows或Linux操作系统的命令行启动程序。也就是说，通过命令注入攻击可执行操作系统上安装着的各种程序。 Crazy
![alt](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/1/27/1688f285cb8da6c7~tplv-t2oaga2asx-zoom-in-crop-mark:1304:0:0:0.awebp)

```
// 以 Node.js 为例，假如在接口中需要从 github 下载用户指定的 repo
const exec = require('mz/child_process').exec;
let params = {/* 用户输入的参数 */};
exec(`git clone ${params.repo} /some/path`);
```

复制代码如果 params.repo 传入的是 https://github.com/admin/admin.github.io.git 确实能从指定的 git repo 上下载到想要的代码。
但是如果 params.repo 传入的是 https://github.com/xx/xx.git && rm -rf /* && 恰好你的服务是用 root 权限起的就糟糕了。

如何防御
* 后端对前端提交内容进行规则限制（比如正则表达式）。
* 在调用系统命令前对所有传入参数进行命令行参数转义过滤。
* 不要直接拼接命令语句，借助一些工具做拼接、转义预处理，例如 Node.js 的 shell-escape npm包




