> 企业项目实战 > 项目实战准备知识 > 项目开发与工具使用 -> SSH 入门教程

## 什么是 SSH

SSH 是登录 Linux 服务器的必备工具，只要你在做互联网开发，多多少少都会用到它。
SSH 能够加密网络通信，保证不被窃听或篡改。它还能对操作者进行认证(authentication)和授权(authorization)，哪怕是明文的网络协议都可以套用在它的里面，从而实现加密。

#### SSH 客户端

我们经常使用的一般都是 OpenSSH，它的客户端是二进制程序 ssh。它在 Unix/Linux 系统的位置是/usr/local/bin/ssh，在 windows 系统的位置是\Program Files\OpenSSH\bin\ssh.exe。

我们可以通过在控制台打印 ssh -V 来检查本地是否有可用的 ssh 客户端，如果没有就需要安装：

我们早先的客户端一般都是使用的 putty，它相对简单而且够用，但前两年推出一个新的 ssh 客户端，业界的反馈比较不错，我们今天就来学习如何使用这个客户端 Termius

下载地址：https://www.termius.com/windows
