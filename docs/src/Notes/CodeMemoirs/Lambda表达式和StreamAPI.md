---
title: "☕ Lambda表达式和StreamAPI"
desc: "想到了函数式编程，于是写下这个方便回顾"
tags: "note"
updateTime: "2025-3-17 15:34"
outline: deep
---

# Lambda表达式和StreamAPI

视频来源：https://www.bilibili.com/video/BV1DZRTYUEC4

## Lambda表达式

Java7时，JVM引入了一个全新的指令invokedynamic (dynamic是动态的意思) 运行时函数类型动态分派；

这个指令第一次在Java语言中登场便是Lambda表达式。

```java
new Thread(new Runnable(){
	@Override
	public void run(){
		Foo.bar();
	}
}).start();
```

在过去**只能通过匿名类**的方式来这么写，在Java8以前函数式编程基本不可能。

也就是说Java是没法直接传入函数作为参数的，C#通过委托机制，Java则是通过函数式接口。

拿我们熟悉的Runnable举例：

```java
@FunctionalInterface
public interface Runnable{
	public abstract void run();
}
```

**简单来说，任意一个仅有一个抽象方法的接口都可以被当作函数式接口。**

> 函数式接口的**特点**便是：**无需像上面一样传入一个匿名类(没有变量名直接new的)，而是通过()->组成的Lambda表达式**

```java
invokeRunnable(()->{
	System.out.println(1);
});
```

也就是说**Lambda表达式类似于满足函数式接口的特殊语法构造**，在运行时会被动态转换成Runnable的接口实例(最初的那样)。



## Stream API

这里的流，并不是指IO流，而是一种数据流动管道。

比如我们有一个10000容量的数组，要对每一个大于5000的数随机加一个0~500随机数，最后求和。

在过去我们可能会这样写：

```java
public int sumRandomNumber(int[] array, Random random){
	int rst = 0;
	for(int i: array){
		if(i>5000){
			rst+=i+random.nextInt(500);
		}
	}
	return rst;
}
```

而借助Stream API

```java
public int sumRandomNumber(int[] array, Random random){
	return Arrays.stream(array)//将array转换为intStream流对象
        .filter(i -> i>5000)//中间函数
        .map(i -> i+random.nextInt(500))//中间函数
        .sum();//结尾函数
}
```

**这里也用到了我们函数式编程涉及到的lambda表达式**



## 拓展：算法的自定义排序

```java
Arrays.sort(intervals, new Comparator<int[]>(){
    public int compare(int[] interval1, int[] interval2){
        return interval1[0] - interval2[0];
    }
});
```

用Java写算法不可避免的会遇到这样的写法；

这里实际上就是运用的匿名内部类写法：

```Java
new Comparator<>(){...逻辑...}
```

因为只需要用一次，所以不需要命名也就是匿名；

实现逻辑也是直接 <>(){...这里写逻辑即可...}

这个其实有点像new int[]{1, 2, 3}

> **TIP：Comparator是util包的，我们还有个Comparable是lang包的**

他的compare函数则是：

```java
public class Job implements Comparable<Job> {
    private Runnable task;
    private long startTime;
    
    @Override
    public int compareTo(Job o) {//传入一个参数和当前对比
        return Long.compare(this.startTime, o.startTime);
    }
}
```