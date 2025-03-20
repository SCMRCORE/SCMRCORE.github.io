---
title: "🔒 实现简单ReentrantLock"
desc: "手写AQS实现Lock"
tags: "note"
updateTime: "2025-3-20 14:23"
---

# 手写AQS实现Lock

涉及八股：AQS，ReentrantLock，CAS，JUC，Atomic

仓库链接：[SCMRCORE/mini-reentrantlock: 手写一个AQS实现ReentrantLock](https://github.com/SCMRCORE/mini-reentrantlock)



## 前言：线程安全经典案例

因为我们的cout[0]--不是原子操作而是分三步，所以会出现线程安全问题。、

每次执行结果都不一样

```java
@SpringBootApplication
public class MiniAqsLockApplication {

    public static void main(String[] args) throws InterruptedException {
        int[] count = new int[]{1000};
        List<Thread> threads = new ArrayList<>();

        for (int i = 0; i < 100; i++) {
            threads.add(new Thread(()->{
                for (int i1 = 0; i1 < 10; i1++) {
                    try {
                        Thread.sleep(2);
                    } catch (InterruptedException e) {
                        throw new RuntimeException(e);
                    }
                    count[0]--;
                }
            }));
        }

        for(Thread thread:threads) thread.start();
        for(Thread thread:threads) thread.join();
        //这里不论是sleep还是join都是为了防止主线程执行太快，子线程任务还没执行完，主线程先结束，整个应用程序结束
        System.out.println(count[0]);
    }

}
```

知识点：

- 为什么用count[0]而不是count？因为**lambda表达式中变量必须原子或者final**
- join的作用是什么？
  - **join会让执行这个函数的线程(这里是主)等待目标线程(thread.join的这个thread)结束再进行**
  - **这里则是防止主线程执行太快，子任务还没执行完主任务先结束。**

为了保证线程安全我们需要加锁：

```java
Lock lock = new ReentrantLock();//可重入锁
for (int i = 0; i < 100; i++) {
    threads.add(new Thread(()->{
        lock.lock();
        {
            for (int i1 = 0; i1 < 10; i1++) {
                try {
                    Thread.sleep(2);
                } catch (InterruptedException e) {
                    throw new RuntimeException(e);
                }
                count[0]--;
            }
        }
        lock.unlock();
    }));
}
```

结果为0，符合；

我们今天的任务则是实现这把锁。





## 实现基础Lock

我们最基础的逻辑就是，**lock函数成功返回了就拿到了锁，否则就阻塞**

```java
public class MyLock {
    AtomicBoolean flag = new AtomicBoolean(false);

    void lock(){
        while(true){//自旋：一直竞争
            if(flag.compareAndSet(false, true)){
                return;//成功拿到锁，返回
            }
        }
    }

    void unlock(){
        while(true){//自旋：一直竞争
            if(flag.compareAndSet(true, false)){
                return;//成功拿到锁，返回
            }
        }
    }
}
```

这样也没问题



目前有两个问题：

- 为获取锁会一直自旋，系统资源占用大
- 无法判断解锁的线程是否是加锁的，容易误解锁

## 优化误解锁

通过一个owner字段，存储加锁线程

通过LockSupport避免一直自旋

```java
public class MyLock {
    AtomicBoolean flag = new AtomicBoolean(false);
    Thread owner = null;
    void lock(){
        while(true){//自旋：一直竞争
            if(flag.compareAndSet(false, true)){
                owner=Thread.currentThread();
                return;//成功拿到锁，返回
            }
            LockSupport.park();//防止一直自旋
        }
    }

    void unlock(){
        if(owner!=Thread.currentThread()){
            throw new IllegalStateException("不是当前线程，不能解锁");
        }

        while(true){//自旋：一直竞争
            if(flag.compareAndSet(true, false)){
                return;//成功拿到锁，返回
            }
        }
    }
}
```



## **优化自旋-加锁**

LockSupport.park加锁了，但是问题在怎么唤醒呢？

**如果唤醒所有线程，必然又进入激烈的竞争，所以可以用维护链表，把请求的线程放到末尾**

加锁逻辑：

- **先尝试获取锁**，一来就拿到，不用加入等待队列，设置owner然后返回
- **没拿到**，把自己加入尾节点，**为了保证多线程下，拿到的是最新尾节点**，只要CAS不成立，就一直while，拿到了就进行Node入尾操作
- **阻塞自己防止一直自旋消耗资源**，这里涉及到阻塞唤醒
  - **如果我们被唤醒了，说明轮到我们了，我们肯定就要拿锁**，但是为了防止**虚假唤醒**，我们需要一些条件才能拿锁（前驱是head，成功CAS替换了）
  - **拿到锁后**，设置owner，把自己剔除等待链表(自己成头节点)，这里的头节点类似于辅助节点，就是常规遍历用的

```java
//多线程环境下普通Node没法原子操作，会出现很多问题，AtomicReference<T>原子引用
AtomicReference<Node> head = new AtomicReference<>(new Node());
AtomicReference<Node> tail = new AtomicReference<>(head.get());
void lock(){
    if(flag.compareAndSet(false, true)){
        owner=Thread.currentThread();
        return;//成功拿到锁，返回
    }

    //没达到锁，把自己添加到尾节点(线程安全)
    Node curNode = new Node();
    curNode.thread=Thread.currentThread();
    //TODO 是否有线程安全问题
    while(true){//while保证拿到的是最新的尾节点
        Node curTail = tail.get();//类似于temp，保存之前的尾节点
        if(tail.compareAndSet(curTail, curNode)){//CAS操作将尾节点变成自己
            //修改前驱后驱逻辑
            curNode.pre=curTail;
            curTail.next=curNode;
            break;
        }
    }

    //阻塞自己防止一直自旋消耗资源
    while (true){
        LockSupport.park();
        //如果阻塞被唤醒会接着park()后面的逻辑
        //并且被唤醒了就说明拿到锁了，为了防止虚假唤醒，所以需要while和一些条件才能返回
            //head->A->B->C，唤醒后head肯定就变成了A，下一次唤醒同理
            //curNode.pre==head.get说明是真唤醒了轮到curNode了
        if(curNode.pre == head.get() && flag.compareAndSet(false, true)){
            //成功获取锁后的逻辑，修改owner，头节点
            owner = Thread.currentThread();
            head.set(curNode);//执行这个操作一定是持有锁时，线程安全的
            //head已经成A了，断开原有的head->A和head<-A
            curNode.pre.next = null;
            curNode.pre = null;
            return;
        }
    }

}
```

知识点：

- 因为我们要用到链表，涉及链表操作时，多线程环境下容易产生竞态条件，需要使用**原子引用`AtomicReference<T>`**
- 保证原子性，使用CAS来进行判断和替换
- **阻塞就一定要考虑虚假唤醒**





## 优化自旋-解锁

解锁就两步:**判断和唤醒**

**unlock后，我们会唤醒next，那这样的话就会继续lock里的park后的逻辑**

```java
void unlock(){
    if(owner!=Thread.currentThread()){
        throw new IllegalStateException("不是当前线程，不能解锁");
    }
    //走到这一步说明已经拿到锁了,不需要CAS
    //lock里拿到锁就两种情况，来就拿到没进队列，队列排队拿到
    //这两种情况，我们都只需要唤醒head节点的->即可
    Node headNode = head.get();
    Node next = headNode.next;
    flag.set(false);
    if(next!=null){
        LockSupport.unpark(next.thread);
        //如果我们把next唤醒了，去执行原本先park再if的逻辑，如果if失败，就一直阻塞了，没人唤醒
        //所以改下顺序，先自己if再park(见上)
    }
}
```

这里涉及到一个优化，可以看注释上：

- 如果我们把next唤醒了，去执行原本先park再if的逻辑，如果if失败，就一直阻塞了，没人唤醒
- 所以改下顺序，先自己if再park(见上)

具体优化实现：

```java
void lock(){
    if(flag.compareAndSet(false, true)){...}

    Node curNode = new Node();
    curNode.thread=Thread.currentThread();
    while(true){...}

    //优化
    while (true){
        //LockSupport.park();优化见下
        //如果阻塞被唤醒会接着park()后面的逻辑
        //并且被唤醒了就说明拿到锁了，为了防止虚假唤醒，所以需要while和一些条件才能返回
            //head->A->B->C，唤醒后head肯定就变成了A，下一次唤醒同理
            //curNode.pre==head.get说明是真唤醒了轮到curNode了
        if(curNode.pre == head.get() && flag.compareAndSet(false, true)){
            //成功获取锁后的逻辑，修改owner，头节点
            owner = Thread.currentThread();
            head.set(curNode);//执行这个操作一定是持有锁时，线程安全的
            //head已经成A了，断开原有的head->A和head<-A
            curNode.pre.next = null;
            curNode.pre = null;
            return;
        }
        //优化，先自己判断下能不能拿到锁，如果不能，就说明真的需要别人来唤醒了
        LockSupport.park();
    }
}
```





## 公平/非公平锁&结果解析

我们回看Lock会发现，if这段逻辑是，只要拿到了就不用排队

也就是说**可以直接插队，那岂不是非公平锁？**

只要我**把这段if注释掉，任何线程都要排队，也就是公平锁体现**

```java
void lock(){
    //把这段代码注释掉就是公平锁，只要lock就要排队
    if(flag.compareAndSet(false, true)){
        System.out.println(Thread.currentThread().getName()+"成功拿到锁");
        owner=Thread.currentThread();
        return;//成功拿到锁，返回
    }

    //没达到锁，把自己添加到尾节点(线程安全)
    Node curNode = new Node();
    curNode.thread=Thread.currentThread();
    while(true){...}

    //阻塞自己防止一直自旋消耗资源
    while (true){...}
}
```

**再看结果**

```java
@SpringBootApplication
public class MiniAqsLockApplication {

    public static void main(String[] args) throws InterruptedException {
        int[] count = new int[]{100};
        List<Thread> threads = new ArrayList<>();
        MyLock lock = new MyLock();
        for (int i = 0; i < 10; i++) {
            threads.add(new Thread(()->{
                lock.lock();
                {
                    for (int i1 = 0; i1 < 10; i1++) {
                        try {
                            Thread.sleep(2);
                        } catch (InterruptedException e) {
                            throw new RuntimeException(e);
                        }
                        count[0]--;
                    }
                }
                lock.unlock();
            }));
        }

        for(Thread thread:threads) thread.start();
        for(Thread thread:threads) thread.join();
        //这里不论是sleep还是join都是为了防止主线程执行太快，子线程任务还没执行完，主线程先结束，整个应用程序结束
        System.out.println(count[0]);
    }

}
```

我这里为了防止数据太多，把原测试数据的1000改成了100，100线程改成了10线程

```powershell
Thread-1成功添加到队列尾
Thread-0成功拿到锁
Thread-5成功添加到队列尾
Thread-7成功添加到队列尾
Thread-3成功添加到队列尾
Thread-4成功添加到队列尾
Thread-2成功添加到队列尾
Thread-6成功添加到队列尾
Thread-8成功添加到队列尾
Thread-9成功添加到队列尾
Thread-0唤醒了Thread-1
Thread-1被唤醒了，成功拿到锁
Thread-1唤醒了Thread-5
Thread-5被唤醒了，成功拿到锁
Thread-5唤醒了Thread-3
Thread-3被唤醒了，成功拿到锁
Thread-3唤醒了Thread-4
Thread-4被唤醒了，成功拿到锁
Thread-4唤醒了Thread-2
Thread-2被唤醒了，成功拿到锁
Thread-2唤醒了Thread-6
Thread-6被唤醒了，成功拿到锁
Thread-6唤醒了Thread-7
Thread-7被唤醒了，成功拿到锁
Thread-7唤醒了Thread-8
Thread-8被唤醒了，成功拿到锁
Thread-8唤醒了Thread-9
Thread-9被唤醒了，成功拿到锁
0
```

这里就很清晰了，我们在sleep的情况下，拿到锁/加入队列，紧接着唤醒，再拿锁依次类推

**只要我们去掉了sleep，基本就会出现公平/非公平的情况了**





## 完整代码

**main**

```java
@SpringBootApplication
public class MiniAqsLockApplication {

    public static void main(String[] args) throws InterruptedException {
        int[] count = new int[]{100};
        List<Thread> threads = new ArrayList<>();
        MyLock lock = new MyLock();
        for (int i = 0; i < 10; i++) {
            threads.add(new Thread(()->{
                lock.lock();
                {
                    for (int i1 = 0; i1 < 10; i1++) {
                        try {
                            Thread.sleep(2);
                        } catch (InterruptedException e) {
                            throw new RuntimeException(e);
                        }
                        count[0]--;
                    }
                }
                lock.unlock();
            }));
        }

        for(Thread thread:threads) thread.start();
        for(Thread thread:threads) thread.join();
        //这里不论是sleep还是join都是为了防止主线程执行太快，子线程任务还没执行完，主线程先结束，整个应用程序结束
        System.out.println(count[0]);
    }

}
```

**lock**

```java
public class MyLock {
    AtomicBoolean flag = new AtomicBoolean(false);
    Thread owner = null;
    //多线程环境下普通Node没法原子操作，会出现很多问题，AtomicReference<T>原子引用
    AtomicReference<Node> head = new AtomicReference<>(new Node());
    AtomicReference<Node> tail = new AtomicReference<>(head.get());
    void lock(){
        //把这段代码注释掉就是公平锁，只要lock就要排队
        if(flag.compareAndSet(false, true)){
            System.out.println(Thread.currentThread().getName()+"成功拿到锁");
            owner=Thread.currentThread();
            return;//成功拿到锁，返回
        }

        //没达到锁，把自己添加到尾节点(线程安全)
        Node curNode = new Node();
        curNode.thread=Thread.currentThread();
        while(true){//while保证拿到的是最新的尾节点
            Node curTail = tail.get();//类似于temp，保存之前的尾节点
            if(tail.compareAndSet(curTail, curNode)){//CAS操作将尾节点变成自己
                System.out.println(Thread.currentThread().getName()+"成功添加到队列尾");
                //修改前驱后驱逻辑
                curNode.pre=curTail;
                curTail.next=curNode;
                break;
            }
        }

        //阻塞自己防止一直自旋消耗资源
        while (true){
            //LockSupport.park();优化见下
            //如果阻塞被唤醒会接着park()后面的逻辑
            //并且被唤醒了就说明拿到锁了，为了防止虚假唤醒，所以需要while和一些条件才能返回
                //head->A->B->C，唤醒后head肯定就变成了A，下一次唤醒同理
                //curNode.pre==head.get说明是真唤醒了轮到curNode了
            if(curNode.pre == head.get() && flag.compareAndSet(false, true)){
                //成功获取锁后的逻辑，修改owner，头节点
                owner = Thread.currentThread();
                head.set(curNode);//执行这个操作一定是持有锁时，线程安全的
                //head已经成A了，断开原有的head->A和head<-A
                curNode.pre.next = null;
                curNode.pre = null;
                System.out.println(Thread.currentThread().getName()+"被唤醒了，成功拿到锁");
                return;
            }
            //优化，先自己判断下能不能拿到锁，如果不能，就说明真的需要别人来唤醒了
            LockSupport.park();
        }
    }

    void unlock(){
        if(owner!=Thread.currentThread()){
            throw new IllegalStateException("不是当前线程，不能解锁");
        }
        //走到这一步说明已经拿到锁了,不需要CAS
        //lock里拿到锁就两种情况，来就拿到没进队列，队列排队拿到
        //这两种情况，我们都只需要唤醒head节点的->即可
        Node headNode = head.get();
        Node next = headNode.next;
        flag.set(false);
        if(next!=null){
            System.out.println(Thread.currentThread().getName()+"唤醒了"+next.thread.getName());
            LockSupport.unpark(next.thread);
            //如果我们把next唤醒了，去执行原本先park再if的逻辑，如果if失败，就一直阻塞了，没人唤醒
            //所以改下顺序，先自己if再park(见上)
        }
    }

    class Node{
        Thread thread;
        Node pre;
        Node next;

    }
}
```



## 遗憾/代办：实现可重入

