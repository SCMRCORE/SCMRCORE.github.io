---
title: "🌈 拦截器依赖注入"
desc: "token续期时遇到的拦截器和Bean的所思所想"
tags: "note"
updateTime: "2025-1-22 0:37"
outline: deep
---

# 拦截器依赖注入

今天写redis案例的token续期时遇到了这个问题，在一个没有加任何@注解的拦截器尝试@Resource注入失败了。后面回顾了下八股才猛然想起。

**知识点：只有当某个组件被注册为Bean时，才会在创建该Bean实例时进行依赖注入和初始化，@Resource这些才会起作用。**



> **为什么这里可以直接用@Resource注入Redistemplate**

我们先看一个mvc配置类，顺便回顾下拦截器注册，**多个拦截器也用一个mvc注册就行**

- 拦截器顺序：`.order(number)`数字越大越靠后
- 需要拦截的路径：`.addPathPatterns("路径")`不写这个的话默认拦截所有
- 不需要拦截的路径：`.excludePathPatterns("路径")`拦截路径

```java
@Configuration
public class MvcConfig implements WebMvcConfigurer {

    @Resource
    private RedisTemplate redisTemplate;

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(new RefreshTokenInterceptor(redisTemplate)).order(0);
        registry.addInterceptor(new LoginInterceptor())
                // 排除不需要拦截的请求路径
                .excludePathPatterns(
                    "/user/code",
                    "/user/login",
                ).order(1);
    }
}
```

`@Configuration` 注解将 `MvcConfig` 类标记为一个配置类，并且它本身也会被注册为 Spring 容器中的一个 Bean。因此，当 `MvcConfig` **成为 Spring 管理的 Bean 时，Spring 就会处理它的依赖注入**。



> **这里的话为什么只能用构造方法呢？**

```java
@Slf4j
public class RefreshTokenInterceptor implements HandlerInterceptor {
    private RedisTemplate redisTemplate;

    @Autowired
    public RefreshTokenInterceptor(RedisTemplate redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
		...
        return true;
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {
        BaseContext.remove();
    }
}
```

这就涉及到一个注意事项：

- 我们在mvc配置文件里(最上面的代码)，**是直接以new**创建的RefreshTokenInterceptor并作为参数传入，这样的话相当于**绕过了IOC机制，不以Bean的方式创建，自然不会进行依赖注入**。
- 直接@Resoure的方式注入redistemplate是无效的。**从Bean的生命周期里也可以知道，依赖注入是Bean创建时的步骤，既然不是Bean自然不会注入。**

```java
registry.addInterceptor(new RefreshTokenInterceptor(redisTemplate)).order(0);
```

​	**所以我们这里取了个巧，选择直接在拦截器的构造方法传入已经注入好参数的redistemplate，然后直接构造方法赋值**

```java
//截取上面代码的第一段    
	private RedisTemplate redisTemplate;

    @Autowired
    public RefreshTokenInterceptor(RedisTemplate redisTemplate) {
        this.redisTemplate = redisTemplate;
    }
```





> **有没有不使用传入new参数的办法呢?**

答案是有的，我们**要确保拦截器是在配置类中通过构造函数或者方法参数显示注入的**。

下面这个MVC配置类**通过构造函数显示注入RefreshTokenInterceptor和LoginInterceptor，他俩会被自动注册为Bean**，依赖注入。

```java
@Configuration
public class MvcConfig implements WebMvcConfigurer {

    private final RefreshTokenInterceptor refreshTokenInterceptor;
    private final LoginInterceptor loginInterceptor;

    @Autowired
    public MvcConfig(RefreshTokenInterceptor refreshTokenInterceptor, LoginInterceptor loginInterceptor) {
        this.refreshTokenInterceptor = refreshTokenInterceptor;
        this.loginInterceptor = loginInterceptor;
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(refreshTokenInterceptor).order(0);
        registry.addInterceptor(loginInterceptor)
                .excludePathPatterns(
                        "/user/code",
                        "/user/login",
                        "/blog/hot",
                        "/shop/**",
                        "/shop-type/**",
                        "/voucher/**",
                        "/upload/**"
                ).order(1);
    }
}
```

这样的话，我们就可以在拦截器中直接使用@Autowired注解进行依赖注入了。





> **依赖注入失败案例**

```java
@Autowired
private SnowflakeIdWorker snowflakeIdWorker;
```

这个案例的构造函数要求：基本数据类型long，但是Spring容器找不到这样的Bean；

**依赖注入一般是针对Bean而言，基本数据类型并非Bean，因此没法直接注入**

```java
/**
 * 雪花算法生成唯一id
 */
@Component
public class SnowflakeIdWorker {
	........
    public SnowflakeIdWorker(long workerId) {
        if (workerId > maxWorkerId || workerId < 0) {
            throw new IllegalArgumentException(String.format("workerId can't be greater than %d or less than 0", maxWorkerId));
        }
        this.workerId = workerId;
    }
	........
}
```

如何解决？

**方案1：编写配置类**

将需要的workId和snowflakeIdWorker都注册为Bean，然后把workId传入snowflakeIdWorker

```java
@Configuration
public class SnowflakeIdWorkerConfig {

    @Bean
    public long SnowWorkId(){
        return 1L;
    }

    @Bean
    public SnowflakeIdWorker snowflakeIdWorker(long SnowWorkId){
        return new SnowflakeIdWorker(SnowWorkId);
    }
}
```

**方案2：直接new**

```java
private SnowflakeIdWorker snowflakeIdWorker = new SnowflakeIdWorker(1L);
```

