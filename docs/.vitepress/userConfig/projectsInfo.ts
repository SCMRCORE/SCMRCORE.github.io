interface Project {
  banner: string; // 图片链接
  title: string; // 项目标题
  description: string; // 项目简介
  link: string; // 项目链接
  tag?: string; // 项目标签
}

/**
 * TODO: 缺项处理
 * 在此处填写你的项目介绍
 */
export const projectsInfo: Project[] = [
  {
    banner: "/project-img/lec-page2.png",
    title: "lec-clock-time-system",
    description:
      "基于SpringCloud架构的实验室聚合平台(开发中)",
    link: "https://github.com/SCMRCORE/lec-clock-time-system",
    tag: "Java",
  },
  {
    banner: "/project-img/alibabacloud.png",
    title: "spring-ai-alibaba",
    description: "An Application Framework for Java Developers",
    link: "https://github.com/alibaba/spring-ai-alibaba",
    tag: "Java",
  },
  // {
  //   banner: "/project-img/analyze-tool.png",
  //   title: "Npm Analyze-tool",
  //   description:
  //     "一款用于可视化分析项目依赖关系的命令行工（第六届字节跳动前端青训大项目三等奖）",
  //   link: "https://github.com/jonlyes/packageResolution",
  //   tag: "TypeScript",
  // },
  // {
  //   banner: "/project-img/dora-bot.png",
  //   title: "Dora-bot",
  //   description:
  //     "基于 go-cqhttp 框架开发的QQ聊天机器人，接入 mongodb 存储消息记录以实现虚假的学习功能.",
  //   link: "https://github.com/ZbWeR/qqbot-Dora",
  //   tag: "Python",
  // },
  // {
  //   banner: "/project-img/ruleMining.png",
  //   title: "Rule Mining",
  //   description:
  //     "采用 Apriori / Fpgrowth / Eclat 算法对超市商品数据集进行关联规则的挖掘.",
  //   link: "https://github.com/ZbWeR/Association-rule-mining",
  //   tag: "Python",
  // },
  // {
  //   banner: "/project-img/dinosaur.png",
  //   title: "Dinosaur-Game",
  //   description: "基于 EasyX 开发的一款游戏内容更加丰富的谷歌断网小恐龙游戏.",
  //   link: "https://github.com/ZbWeR/Dinosaur-Game",
  //   tag: "C++",
  // },
];
