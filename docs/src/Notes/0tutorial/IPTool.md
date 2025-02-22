---
title: "🛜 ip类工具"
outline: deep
desc: "介绍InetAddress"
tags: "Tutorial"
updateTime: "2025-1-15 1:25"
---

# ip类工具

## 介绍InetAddress

InetAddress是java提供的一个类，用于表示ip地址。它提供了一系列静态方法来获取和操作ip

InetAddress类有两个子类：Inet4Address和Inet6Address，分别用于表示IPv4和IPv6地址。

常用方法

- getLocalHost()：获取本地主机的InetAddress对象，即获取本机的IP地址。
- getByName(String host)：根据指定的主机名或IP地址字符串，返回对应的InetAddress对象。
- getHostName()：获取InetAddress对象对应的主机名。
- getHostAddress()：获取InetAddress对象的IP地址字符串。
- isReachable(int timeout)：判断InetAddress对象对应的主机是否可达。
- equals(Object obj)：判断两个InetAddress对象是否相等。

完整介绍[Java-InetAddress、Inet4Address、Inet6Address介绍-CSDN博客](https://blog.csdn.net/qq_31536117/article/details/135472633?ops_request_misc=&request_id=&biz_id=102&utm_term=InetAddress&utm_medium=distribute.pc_search_result.none-task-blog-2~all~sobaiduweb~default-1-135472633.142^v100^pc_search_result_base3&spm=1018.2226.3001.4187)



**案例**：主要是通过它将字符串转化为IntAddress对象，然后再转成Ipv4地址

```java
ServerHttpRequest request = exchange.getRequest();
// 获取 IP 地址
String ip1 = getIP(request);

//有时获取到的字符串是ip+端口，裁切端口让字符串为ipv4格式
int position=0;//:的位置
for(int i=0; i<=ip1.length()-1; i++){
    if(ip1.charAt(i)==':'){
         position=i;
         break;
     }
}
String ip = ip1.substring(0,position);
log.info("========= 请求的IP地址： " + ip);

//解析ipv4
String ipv4Address = null;
try {
    //通过字符串来获取InetAddress对象，然后再转成ipv4地址
    InetAddress inetAddress = InetAddress.getByName(ip);
    if (inetAddress != null) {
        ipv4Address = inetAddress.getHostAddress();
        log.info("成功解析Ipv4:{}", ipv4Address);
    }
} catch (UnknownHostException e) {
    e.printStackTrace();
}
```





## 网关过滤器和普通过滤器获取ip

网关**ServerHttpRequest** 

下面是自己写的微服务中网关的案例：主要通过获取ipv4地址然后存入redis

```java
@Component
@Slf4j
public class ipv4Filter implements GlobalFilter, Ordered {

    @Resource
    RedisTemplate redisTemplate;

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        // 请求
        ServerHttpRequest request = exchange.getRequest();
        // 获取 IP 地址
        String ip1 = getIP(request);
        int position=0;//:的位置
        for(int i=0; i<=ip1.length()-1; i++){
            if(ip1.charAt(i)==':'){
                 position=i;
                 break;
             }
        }
        //有时获取到的字符串是ip+端口，裁切端口让字符串为ipv4格式
        String ip = ip1.substring(0,position);
        log.info("========= 请求的IP地址： " + ip);
        //解析ipv4
        String ipv4Address = null;
        try {
            InetAddress inetAddress = InetAddress.getByName(ip);
            if (inetAddress != null) {
                ipv4Address = inetAddress.getHostAddress();
                log.info("成功解析Ipv4:{}", ipv4Address);
            }
        } catch (UnknownHostException e) {
            e.printStackTrace();
        }

        //获取用户ID
        try {
            String userInfo =  request.getHeaders().get("userInfo").get(0);
            Long userId = Long.valueOf(userInfo);
            log.info("ip过滤器获取到用户id:{}", userId);
            redisTemplate.opsForValue().set(SystemConstant.REDIS_CLOCK_IPV4+userId, ipv4Address,2,TimeUnit.MINUTES);
            return chain.filter(exchange);
        }catch (Exception e){
//            e.printStackTrace();
            log.info("未获取到userInfo，有可能是无需登录的路径，直接放行");
            return chain.filter(exchange);
        }
    }

    @Override
    public int getOrder() {
        return 1;
    }

//正式模板
    // 多次反向代理后会有多个ip值 的分割符
    private final static String IP_UTILS_FLAG = ",";
    // 未知IP
    private final static String UNKNOWN = "unknown";
    // 本地 IP
    private final static String LOCALHOST_IP = "0:0:0:0:0:0:0:1";
    private final static String LOCALHOST_IP1 = "127.0.0.1";

    private static String getIP(ServerHttpRequest request){
        //获取header
        HttpHeaders headers = request.getHeaders();
        log.info("========= 请求的headers： " + headers);
        // 根据 HttpHeaders 获取 请求 IP地址
        String ip = request.getHeaders().getFirst("X-Forwarded-For");
        log.info("========= 请求的第一个IP地址： " + ip);
        if (ip==null || UNKNOWN.equalsIgnoreCase(ip)) {
            ip = request.getHeaders().getFirst("x-forwarded-for");
            log.info("========= 请求的第二个IP地址： " + ip);
            if (ip != null && ip.length() != 0 && !UNKNOWN.equalsIgnoreCase(ip)) {
                // 多次反向代理后会有多个ip值，第一个ip才是真实ip
                if (ip.contains(IP_UTILS_FLAG)) {
                    ip = ip.split(IP_UTILS_FLAG)[0];
                }
            }
        }
        if (ip == null || ip.length() == 0 || UNKNOWN.equalsIgnoreCase(ip)) {
            ip = request.getHeaders().getFirst("Proxy-Client-IP");
        }
        if (ip == null || ip.length() == 0 || UNKNOWN.equalsIgnoreCase(ip)) {
            ip = request.getHeaders().getFirst("WL-Proxy-Client-IP");
        }
        if (ip == null || ip.length() == 0 || UNKNOWN.equalsIgnoreCase(ip)) {
            ip = request.getHeaders().getFirst("HTTP_CLIENT_IP");
        }
        if (ip == null || ip.length() == 0 || UNKNOWN.equalsIgnoreCase(ip)) {
            ip = request.getHeaders().getFirst("HTTP_X_FORWARDED_FOR");
        }
        if (ip == null || ip.length() == 0 || UNKNOWN.equalsIgnoreCase(ip)) {
            ip = request.getHeaders().getFirst("X-Real-IP");
        }
        if (ip == null || ip.length() == 0 || UNKNOWN.equalsIgnoreCase(ip)) {
            ip = request.getRemoteAddress().toString().substring(1);
        }
        //TODO 解决ip问题，无法获取当前请求发送的ip
        log.info("========= 请求的代理或者路由IP地址： " + ip);
        //兼容k8s集群获取ip
        if (StringUtils.isEmpty(ip) || UNKNOWN.equalsIgnoreCase(ip)) {
            ip = request.getRemoteAddress().getAddress().getHostAddress();
            if (LOCALHOST_IP1.equalsIgnoreCase(ip) || LOCALHOST_IP.equalsIgnoreCase(ip)) {
                //根据网卡取本机配置的IP
                InetAddress iNet = null;
                try {
                    iNet = InetAddress.getLocalHost();
                } catch (UnknownHostException e) {
                    log.error("getClientIp error: ", e);
                }
                log.info("========= 请求的本地IP地址： " + iNet.getHostAddress());
                ip = iNet.getHostAddress();
            }
        }
        return ip;
    }
}
```

普通**HttpServletRequest**

```java
//正式模板
	private static final String IP_UTILS_FLAG = ",";
	private static final String UNKNOWN = "unknown";
	private static final String LOCALHOST_IP = "0:0:0:0:0:0:0:1";
	private static final String LOCALHOST_IP1 = "127.0.0.1";
	
	public static String getIpAddr(HttpServletRequest request) {
		String ip = null;
		try {
			//以下两个获取在k8s中，将真实的客户端IP，放到了x-Original-Forwarded-For。而将WAF的回源地址放到了 x-Forwarded-For了。
			ip = request.getHeader("X-Original-Forwarded-For");
			if (StringUtils.isEmpty(ip) || UNKNOWN.equalsIgnoreCase(ip)) {
				ip = request.getHeader("X-Forwarded-For");
			}
			//获取nginx等代理的ip
			if (StringUtils.isEmpty(ip) || UNKNOWN.equalsIgnoreCase(ip)) {
				ip = request.getHeader("x-forwarded-for");
			}
			if (StringUtils.isEmpty(ip) || UNKNOWN.equalsIgnoreCase(ip)) {
				ip = request.getHeader("Proxy-Client-IP");
			}
			if (StringUtils.isEmpty(ip) || ip.length() == 0 || UNKNOWN.equalsIgnoreCase(ip)) {
				ip = request.getHeader("WL-Proxy-Client-IP");
			}
			if (StringUtils.isEmpty(ip) || UNKNOWN.equalsIgnoreCase(ip)) {
				ip = request.getHeader("HTTP_CLIENT_IP");
			}
			if (StringUtils.isEmpty(ip) || UNKNOWN.equalsIgnoreCase(ip)) {
				ip = request.getHeader("HTTP_X_FORWARDED_FOR");
			}
			//兼容k8s集群获取ip
			if (StringUtils.isEmpty(ip) || UNKNOWN.equalsIgnoreCase(ip)) {
				ip = request.getRemoteAddr();
				if (LOCALHOST_IP1.equalsIgnoreCase(ip) || LOCALHOST_IP.equalsIgnoreCase(ip)) {
					//根据网卡取本机配置的IP
					InetAddress iNet = null;
					try {
						iNet = InetAddress.getLocalHost();
					} catch (UnknownHostException e) {
						log.error("getClientIp error: ", e);
					}
					ip = iNet.getHostAddress();
				}
			}
		} catch (Exception e) {
			log.error("IPUtils ERROR ", e);
		}
		//使用代理，则获取第一个IP地址
		if (!StringUtils.isEmpty(ip) && ip.indexOf(IP_UTILS_FLAG) > 0) {
			ip = ip.substring(0, ip.indexOf(IP_UTILS_FLAG));
		}
		return ip;
	}
```

原文链接

[ServerHttpRequest 和 HttpServletRequest区别以及获取IP_serverwebexchange获取ip-CSDN博客](https://blog.csdn.net/qililong88/article/details/126161694?ops_request_misc=%7B%22request%5Fid%22%3A%22EF2892E5-9A4E-4E30-8ABE-C49C5F492683%22%2C%22scm%22%3A%2220140713.130102334..%22%7D&request_id=EF2892E5-9A4E-4E30-8ABE-C49C5F492683&biz_id=0&utm_medium=distribute.pc_search_result.none-task-blog-2~all~top_click~default-2-126161694-null-null.142^v100^pc_search_result_base3&utm_term=ServerHttpRequest&spm=1018.2226.3001.4187)



## ip获取只能在服务器上测试

ip获取只能在服务器上测试，否则拿到的是回环地址



## ip地址转译为字符串存储

实现逻辑：获取ip -> 根据ip获取ipv4和子网掩码字节数组 -> 进行AND运算 -> 保存转译ip

```java
    @Override
    public Result addIpv4() throws UnknownHostException {
        Long id=UserContext.getUser();

        String ipv4= (String) redisTemplate.opsForValue().get(SystemConstant.REDIS_CLOCK_IPV4+id);
        log.info("获取的ip为：{}， id为：{}",ipv4,id);
        redisTemplate.delete(SystemConstant.REDIS_CLOCK_IPV4+id);
        
        // 将IP地址和子网掩码解析为InetAddress对象
        InetAddress ip = InetAddress.getByName(ipv4);
        InetAddress mask = InetAddress.getByName("255.255.255.0");

        // 获取IP地址和子网掩码的字节数组
        byte[] ipBytes = ip.getAddress();
        byte[] maskBytes = mask.getAddress();

        // 进行AND运算
        byte[] networkBytes = new byte[ipBytes.length];
        for (int i = 0; i < ipBytes.length; i++) {
            networkBytes[i] = (byte) (ipBytes[i] & maskBytes[i]);
        }
        //插入
        if(ipv4LogMapper.select(ipv4)==null){
            ipv4LogMapper.insert(ipv4);
        }
        String ipAndMask=Base64.getEncoder().encodeToString(networkBytes);
        log.info("执行更新打卡ip功能，转义后的ip:{}",ipAndMask);
        String clockIp=clockIpMapper.getClockIp(ipAndMask);
        if(!(clockIp ==null)){
            log.info("已经存在的打卡ip，ip:{},转义后的ip:{}",ipv4,ipAndMask);
            return Result.okResult("该网络可以打卡，请重新连接再次刷新,如果不成功请联系管理员");
        }
        log.info("成功添加可以打卡的公网ip,ip:{},转义后的ip:{}",ipv4,ipAndMask);
        clockIpMapper.insertClockIp(ipAndMask);
        return Result.okResult("操作成功，请再次尝试打卡，如若不成功请联系管理员");
    }
```

解析的话，同理，直接转译然后与数据库中的ip对比即可（有点暴力

```java
//从redis数据库里获取对应的ipv4信息
String ipv4= (String) redisTemplate.opsForValue().get(SystemConstant.REDIS_CLOCK_IPV4+id);
redisTemplate.delete(SystemConstant.REDIS_CLOCK_IPV4+id);
// 将IP地址和子网掩码解析为InetAddress对象
InetAddress ip = InetAddress.getByName(ipv4);
InetAddress mask = InetAddress.getByName("255.255.255.0");

// 获取IP地址和子网掩码的字节数组
byte[] ipBytes = ip.getAddress();
byte[] maskBytes = mask.getAddress();

// 进行AND运算
byte[] networkBytes = new byte[ipBytes.length];
for (int i = 0; i < ipBytes.length; i++) {
    networkBytes[i] = (byte) (ipBytes[i] & maskBytes[i]);
}
if(ipv4LogMapper.select(ipv4)==null&&ipv4!=null){
    ipv4LogMapper.insert(ipv4);
}
String ipAndMask= Base64.getEncoder().encodeToString(networkBytes);

log.info("子网信息:{}",ipAndMask);
List<String> list=clockIpMapper.getClockIpList();
boolean isClockIp=false;
log.info("list:{}",list);
for(String i:list){
    log.info("比对子网信息:{},:{}",ipAndMask, i);
    if(ipAndMask.equals(i)) {
        isClockIp=true;
        break;
    }
}
```

