## nginx

### 定义 
nginx是一款基于异步框架的轻量级/高性能的web服务器/反向代理服务器/缓存服务器/电子邮件代理服务器。

### 特点 
优点： 
高并发
内存消耗少
简单稳定
模块化程度高
低成本
支持多系统

缺点：
动态处理差
rewrite弱

### 配置简介

软件目录：
- 工作目录：/etc/nginx
- 执行文件:/usr/sbin/nginx
- 日志目录：/var/log/nginx
- 启动文件：/etc/init.d/nginx
- web目录：/var/www/html/
- 首页文件是 index.html

#### 全局配置字段
user 设置使用用户(worker)
worker_processes 进行增大并发连接数的处理跟cpu保持一致八核设置八个
error_log  nginx的错误日志
pid  nginx服务启动时候pid
events  定义事件相关的属性
worker_connections  一个进程允许处理的最大连接数
use   定义使用的内核模型

#### http配置段
include mime.types;  文件扩展名与文件类型映射表
default_type application/octet-stream;  默认文件类型
sendfile on;  开启高效文件传输模式。
autoindex on;  开启目录列表访问，合适下载服务器，默认关闭。
tcp_nopush on;  防止网络阻塞
tcp_nodelay on;  防止网络阻塞
keepalive_timeout 120;  长连接超时时间，单位是秒
gzip on;   开启gzip压缩输出


#### Server常见配置属性
listen 端口
server_name 主机名

#### location 常用配置 
root alias
root: 一般用来匹配根路径， 因为会把路径直接拼在 root后面 
alias: 一般用在有路径匹配，比如 /test 会在alias的路径去找test【指定查看文件列表路径，绝对路径】
try_files $uri $uri/= 404: 如果root指定路径下有查找文件，就返回，没有就404


```


```


