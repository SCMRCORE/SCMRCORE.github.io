---
title: "🎥 record新类型"
desc: "关于如何实现跨服务器docker容器互联部署"
tags: "note"
updateTime: "2024-12-30 11:36"
outline: deep
---

# record新类型

record是Java14后引入的一个新类型。

1. **不可变性**：Record默认是不可变的，这意味着一旦创建了一个record实例，就不能再改变它的状态。**所有的字段都是final类型的**，而且没有生成setter方法。
2. **构造函数**：对于每个record，编译器会**自动生成**一个带有所有组件的规范构造函数（canonical constructor），用于初始化record的字段。
3. **访问器方法(getter)**：对于每一个字段，编译器都会**自动生成**相应的访问器方法，这些方法的名字与字段名相同。
4. **equals、hashCode和toString**：编译器还会为record生成合理的`equals`、`hashCode`和`toString`方法实现，这通常是我们手动编写数据载体类时需要自己定义的。
5. **模式匹配**：Records可以方便地与模式匹配（pattern matching）一起使用，例如switch表达式中的instanceof检查和解构。
6. **私有字段**：虽然record的字段默认是public的，但你可以通过更详细的声明来控制字段的可见性，比如设置为private，同时自定义访问器方法。
7. **静态和实例方法**：尽管records主要用于数据承载，但你仍然可以在record中**添加静态方法和实例方法**以扩展其功能。
8. **序列化**：Records默认实现了`Serializable`接口，因此它们是可序列化的。
9. **继承限制**：Records**不能继承其他类**，但**可以实现接口**。

例子：

```java
@JsonClassDescription("part of the response")
public record TranslationResult(
       @JsonProperty(required = true, value = "src") @JsonPropertyDescription("Original Content") String src,
       @JsonProperty(required = true, value = "dst") @JsonPropertyDescription("Final Result") String dst) {
}

@JsonClassDescription("complete response")
public record TranslationResponse(
       @JsonProperty(required = true,
             value = "from") @JsonPropertyDescription("Source language that needs to be translated") String from,
       @JsonProperty(required = true,
             value = "to") @JsonPropertyDescription("Target language to translate into") String to,
       @JsonProperty(required = true,
             value = "trans_result") @JsonPropertyDescription("part of the response") List<TranslationResult> trans_result) {
}
```

实例化使用：

```java
Map<String, String> translations = new HashMap<>();
TranslationResponse responseList = gson.fromJson(responseData, TranslationResponse.class);
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
```



