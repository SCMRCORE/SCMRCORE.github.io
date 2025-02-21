---
title: "💻 Swarm集群部署"
desc: "关于如何实现跨服务器docker容器互联部署"
tags: "note"
updateTime: "2024-12-30 11:36"
outline: deep
---

# 跨服务器集群部署

## Swarm原理

原文见:

[第23章 快速搭建容器集群Docker三剑客之Docker Swarm安装和配置本文简介了 Docker Swarm，D - 掘金](https://juejin.cn/post/7448913839313764389?searchId=20241229113827270FD31CB173351E0A7E#heading-8)



## 实现步骤

### 1.在管理节点上初始化Swarm

在想要成为管理节点(Manager)的服务器上：

```powershell
sudo docker swarm init
```

初始化后会返回一个加入token：

```powershell
docker swarm join --token SWMTKN-1-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx 192.168.1.1:2377
```



### 2.加入Worker节点

直接在其他的服务器上输入刚才得到的：

```powershell
docker swarm join --token SWMTKN-1-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx 192.168.1.1:2377
```

**PS: Worker节点一般没有权限，所以查看node状态，service状态，部署/查看service都只能在Manager节点上进行。**



### 3.查看Swarm状态

这个命令会列出集群中的所有节点，包括它们的角色（Manager 或 Worker）和状态。

```powershell
sudo docker node ls
```



### 4.部署服务

这里不推荐常用的docker run，而是**采用docker service进行部署**

举例子：

- **部署：LecGateway**

```powershell
udo docker service create --constraint 'node.role==manager'  --network lecnetwork -p 8080:8080 --name LecGateway lec-gateway

// --constraint 用于绑定node节点，这里则是绑定manager
// --lecnetwork 是我们自己创建的overlay网络
```

- **部署：LecNacos**

```powershell
docker service create -d --name LecNacos --env-file ./nacos/custom.env -p 8848:8848 -p 9848:9848 -p 9849:9849 --constraint 'node.role==manager'  --network=lecnetwork nacos/nacos-server:v2.1.0-slim

//这里部署nacos也是一样，只不过不能有--restart=always
```

- **部署：LecClock**

```powershell
sudo docker service create --constraint 'node.role==worker' --network lecnetwork -p 8081:8081 --name LecClock lec-clock
```

- **部署：LecUser**

```powershell
sudo docker service create --constraint 'node.role==worker'  --network lecnetwork -p 8082:8082 --name LecUser lec-user
```

PS :如果我们不使用--constraint的话，会默认分配到一个节点，使用 --replicas 3 则表示生成3个副本，如果有3个节点则会均分到3个节点上。



### 5.操作service系列指令

- 查看服务状态

```powershell
sudo docker service ls
```

- 查看详细信息

my-web便是service的name

```powershell
sudo docker service ps my-web
```

- 移除服务

```powershell
sudo docker service rm my-web
```

- 查看日志

```powershell
sudo docker service logs my-web
```



### 6.管理Swarm

- **添加新的Manager节点**

在管理节点上输入下面，拿到token后再去新的节点上输入token

```powershell
sudo docker swarm join-token manager
```



- **添加新的Worker节点**

同上

```powershell
sudo docker swarm join-token worker
```



- **移除节点**

```powershell
sudo docker node rm node-id
```



- **更新服务**

可以使用 `docker service update` 命令来更新服务配置，例如增加副本数量： sudo docker service update --replicas 5 my-web



### 7.配置Swarm网络

Docker Swarm 支持多种网络模式，包括覆盖网络（Overlay Network），用于在多个节点之间通信。

```powershell
sudo docker network create --driver overlay --attachable my-network
```



### 8.停止Swarm集群

- 移除节点

```powershell
//移除节点
sudo docker node rm node-id

//移除所有节点
sudo docker node rm $(sudo docker node ls -q)
```

- 关闭Swarm

在我们移除所有节点后，便可以关闭Swarm

```powershell
sudo docker swarm leave --force
```

- 在Worker节点上离开Swarm

```powershell
sudo docker swarm leave
```

## 之前对于集群的误解

集群的话，可以在每个服务器都有对一个模块的实例，然后通过naco负载均衡，而不是之前理解的那样，不同服务器部署不同模块