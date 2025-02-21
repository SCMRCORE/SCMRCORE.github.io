---
title: "🎯 常用的Json转换工具"
outline: deep
desc: "两个JSON转换工具"
tags: "Tutorial"
updateTime: "2025-1-24 22:09"
---

# 常用的Json转换工具

## GSON：JSON/字符串处理

gson支持自定义类接收字符串转json数据。

看代码就能理解运作方式了

常用方法：

```java
//1.Map已有类
Map<String, String> responseList = gson.fromJson(responseData, new TypeToken<Map<String, String>>() {}.getType());

//2.自定义类
TranslationResponse responseList = gson.fromJson(responseData, TranslationResponse.class);

//3.JsonElement工具
JsonElement jsonElement = gson.fromJson(responseData, JsonElement.class);
if (jsonElement.getAsJsonObject().has("error_code")) {
    
}else{
    
}
```



## Jackson：JSON/字符串处理(推荐)

三大核心，今天只讲core

- jackson-core，核心包，提供基于"流模式"解析的相关API(JsonPaser和JsonGenerator)，生成和解析json
- jackson-annotations，注解包，提供标准注解功能
- jackson-databind ，数据绑定包，提供基于"对象绑定"解析的相关API(ObjectMapper)和"树模型"解析的相关API(JsonNode)

```xml
<dependency>
    <groupId>com.fasterxml.jackson.core</groupId>
    <artifactId>jackson-databind</artifactId>
    <version>2.11.0</version>
</dependency>
```

序列化和反序列化通常通过objectMapper来实现

```java
// 序列化
     String jsonString = objectMapper.writeValueAsString(user);
     System.out.println("序列化字符串：" + jsonString);
// 反序列化
     User userFromJson = objectMapper.readValue(jsonString, User.class);
     System.out.println("反序列化结果：" + userFromJson);
```

spring-ai-alibaba的开发样例：

```java
private Response parseResponse(String responseData) {
    ObjectMapper mapper = new ObjectMapper();
    try {
       Map<String, String> translations = new HashMap<>();
       TranslationResponse responseList = mapper.readValue(responseData, TranslationResponse.class);
       String to = responseList.to;
       List<TranslationResult> translationsList = responseList.trans_result;
       if (translationsList != null) {
          for (TranslationResult translation : translationsList) {
             String translatedText = translation.dst;
             translations.put(to, translatedText);
             logger.info("Translated text to {}: {}", to, translatedText);
          }
       }
       return new Response(translations);
    }
    catch (Exception e) {
       try {
          Map<String, String> responseList = mapper.readValue(responseData,
                mapper.getTypeFactory().constructMapType(Map.class, String.class, String.class));
          logger.info(
                "Translation exception, please inquire Baidu translation api documentation to info error_code:{}",
                responseList);
          return new Response(responseList);
       }
       catch (Exception ex) {
          logger.error("Failed to parse json due to: {}", ex.getMessage());
          return null;
       }
    }
}
```

其中有用到

```java
mapper.getTypeFactory().constructMapType(Map.class, String.class, String.class)
```

Jackson自带的一个转换为ValueType

