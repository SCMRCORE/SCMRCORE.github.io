---
title: "😣 Jmeter快速入门"
outline: deep
desc: "一个可实现高并发请求的压测工具"
tags: "Tutorial"
updateTime: "2025-1-24 22:09"
---

## Jmeter快速入门

Jmeter是一个可实现高并发请求的压测工具。

### 1.安装Jmeter

Jmeter依赖于JDK，所以必须确保当前计算机上已经安装了JDK，并且配置了环境变量。

#### 1.1.下载

可以Apache Jmeter官网下载，地址：http://jmeter.apache.org/download_jmeter.cgi

链接进去的界面，选Binaries的zip即可。

#### 1.2.解压

因为下载的是zip包，解压缩即可使用。其中的bin目录就是执行的脚本，其中包含启动脚本：

![image-20210715193414601](../../public/Jmeter.assets/image-20210715193414601.png)

#### 1.3.运行

双击即可运行，但是有两点注意：

- 启动速度比较慢，要耐心等待
- 启动后黑窗口不能关闭，否则Jmeter也跟着关闭了

### 2.快速入门

#### 2.1.设置中文语言

默认Jmeter的语言是英文，需要设置：

![image-20210715193838719](../../public/Jmeter.assets/image-20210715193838719.png)

> **注意**：上面的配置只能保证本次运行是中文，如果要永久中文，需要修改Jmeter的配置文件

打开jmeter文件夹，在bin目录中找到 **jmeter.properties**，添加下面配置：

```properties
language=zh_CN
```

![image-20210715194137982](../../public/Jmeter.assets/image-20210715194137982.png)

PS：前面不要出现#，#代表注释，另外这里是下划线，不是中划线





#### 2.2.基本用法

在测试计划上点鼠标右键，选择添加 > 线程（用户）> 线程组：

![image-20210715194413178](../../public/Jmeter.assets/image-20210715194413178.png)

在新增的线程组中，填写线程信息：

![image-20210715195053807](../../public/Jmeter.assets/image-20210715195053807.png)

给线程组点鼠标右键，添加http取样器：

![image-20210715195144130](../../public/Jmeter.assets/image-20210715195144130.png)

编写取样器内容：

![image-20210715195410764](../../public/Jmeter.assets/image-20210715195410764.png)

添加监听报告：

![image-20210715195844978](../../public/Jmeter.assets/image-20210715195844978.png)

添加监听结果树：

![image-20210715200155537](../../public/Jmeter.assets/image-20210715200155537.png)

汇总报告结果：

![image-20210715200243194](../../public/Jmeter.assets/image-20210715200243194.png)

结果树：

![image-20210715200336526](../../public/Jmeter.assets/image-20210715200336526.png)

