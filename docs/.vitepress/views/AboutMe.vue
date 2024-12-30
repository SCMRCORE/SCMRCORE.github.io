<template>
  <div class="px-6 pb-24 mt-2 md:pb-32 md:px-12 lg:px-16">
    <div class="flex flex-col items-center justify-center max-w-6xl mx-auto">
      <!-- 头像与徽章 -->
      <div class="relative w-full mx-auto">
        <!-- 头像 -->
        <div class="relative py-2 h-52">
          <div
            class="absolute w-48 h-48 mx-auto rounded-full shadow-[0px_0px_3px#147eae] dark:shadow-[0px_0px_3px#9ba0a9] top-1/2 avatar-ping left-1/2"
          ></div>
          <img
            class="block w-48 h-48 mx-auto rounded-full"
            src="./img/Blog_logo.png"
            alt="avatar"
          />
        </div>
        <!-- Right-tags -->
        <p
          style="top: 32%"
          class="tag-bounce hidden sm:block sm:left-[69%] md:left-[66%] lg:left-[63%] xl:left-[60%] absolute px-3 py-0.5 text-sm font-bold rounded-full shadow-[0px_0px_1px_1px#eee]"
        >
<!--          🎵 白噪音循环一整天-->
          🚀Coding不能停
        </p>
        <p
          style="top: 50%"
          class="tag-bounce hidden sm:block sm:left-[69%] md:left-[66%] lg:left-[63%] xl:left-[60%] absolute px-3 py-0.5 text-sm font-bold rounded-full shadow-[0px_0px_1px_1px#eee]"
        >
          单臂弯举突破10KG ing🎯
        </p>
        <!-- Left-tags -->
        <p
          style="top: 32%"
          class="tag-bounce hidden sm:block sm:left-[8%] md:left-[13%] lg:left-[21%] xl:left-[27%] absolute px-3 py-0.5 text-sm font-bold rounded-full shadow-[0px_0px_1px_1px#eee]"
        >
          🌙 一点之前一定睡
        </p>
        <p
          style="top: 50%"
          class="tag-bounce hidden sm:block sm:left-[8%] md:left-[13%] lg:left-[21%] xl:left-[27%] absolute px-3 py-0.5 text-sm font-bold rounded-full shadow-[0px_0px_1px_1px#eee]"
        >
<!--          Coding不能停🚀-->
           白噪音循环一整天🎵
        </p>
      </div>
      <!-- 概述与箴言 -->
      <div class="flex flex-col w-full mt-4">
        <div class="flex flex-col justify-between gap-5 md:gap-0 md:flex-row">
          <!-- 概述 -->
          <div
            class="dark:from-sky-700 dark:to-teal-600 dark:border-slate-900 w-full flex flex-col justify-center rounded-xl border py-4 px-8 text-white md:w-[59%] bg-gradient-to-r from-sky-400 to-teal-400"
          >
            <p class="text-lg text-slate-50">你好，很高兴认识你 👋</p>
            <h1 class="text-2xl font-bold xl:text-3xl lg:break-normal lg:break-words">
              A Chinese undergraduate From SWPU
            </h1>
            <p class="text-slate-100">后端开发 / Live Wallpapers / 健身 🔥</p>
          </div>
          <!-- 箴言 -->
          <div
            class="bg-stripe dark:border-slate-900 dark:bg-slate-800 md:w-[39%] w-full rounded-xl border p-4 bg-slate-50"
          >
            <p class="text-[12px]">💬 Desc</p>
            <div>
              <h1 class="text-3xl leading-9">
                <span class="hidden font-bold text-teal-400 md:inline-block"
                  >Enjoying&nbsp;
                </span>
                <span class="hidden lg:inline-block"> Coding🚀</span>
              </h1>
              <h1 class="font-serif text-3xl tracking-widest md:text-2xl lg:text-3xl">
                Record what I <span class="font-bold text-sky-500">see and think</span>
              </h1>
              <h1 class="text-2xl leading-9 md:text-3xl">
                <span class="inline-block font-bold text-teal-400 md:hidden"
                  >Enjoying&nbsp;
                </span>
                <span class="inline-block lg:hidden">Coding🚀</span>
              </h1>
            </div>
          </div>
        </div>
      </div>
      <!-- 简介与技术栈 -->
      <div class="flex flex-col justify-between w-full gap-5 mt-4 md:gap-0 md:flex-row">
        <!-- 简介 -->
        <div
          class="bg-stripe w-full md:w-[35%] bg-slate-50 border dark:bg-slate-800 dark:border-slate-900 p-4 rounded-xl"
        >
          <p class="text-[12px]">👋Introduction</p>
          <div class="mt-2">
            <h1 class="text-xl">还在找一份后端实习ing</h1>
            <h1 class="text-xl">偶尔做做<span class="text-pink-500">Live Wallpapers</span></h1>
            <h1 class="text-xl lg:text-xl md:text-base">想要多做做Open Source</h1>
            <p></p>
          </div>
        </div>
        <!-- 技术栈 -->
        <div
          class="w-full md:w-[62%] dark:border-slate-900 border dark:bg-slate-800 bg-slate-50 p-4 rounded-xl"
        >
          <p class="text-[12px]">技术栈</p>
          <div class="mt-2 overflow-hidden">
            <!-- TODO:封装ICON组件,抽离背景颜色与svg地址 -->
            <div class="flex gap-4 w-fit icon-scroll">
              <div
                class="flex justify-center flex-shrink-0 w-20 h-20 p-4 rounded-lg bg-emerald-200"
              >
                <img src="https://user-images.githubusercontent.com/25181517/117201470-f6d56780-adec-11eb-8f7c-e70e376cfd07.png" alt="Spring" />
              </div>
              <div class="flex-shrink-0 w-20 h-20 p-4 bg-red-200 rounded-lg">
                <img  src="https://user-images.githubusercontent.com/25181517/182884894-d3fa6ee0-f2b4-4960-9961-64740f533f2a.png" alt="redis" />
              </div>
              <div class="flex-shrink-0 w-20 h-20 p-4 rounded-lg bg-sky-200">
                <img src="https://user-images.githubusercontent.com/25181517/117207330-263ba280-adf4-11eb-9b97-0ac5b40bc3be.png" alt="Docker" />
              </div>
              <div
                class="flex justify-center flex-shrink-0 w-20 h-20 p-4 rounded-lg bg-slate-200"
              >
                <img src="./img/tailwind.svg" alt="" />
              </div>
              <div
                class="flex justify-center w-20 h-20 p-4 flex-shrink-0 rounded-lg bg-[#f7cb4f]"
              >
                <img class="rounded-lg"  src="https://user-images.githubusercontent.com/25181517/183896128-ec99105a-ec1a-4d85-b08b-1aa1620b2046.png" alt="MySQL" />
              </div>
              <div
                class="flex justify-center flex-shrink-0 w-20 h-20 p-4 bg-red-400 rounded-lg"
              >
                <img class="rounded-lg" src="./img/git.svg" alt="" />
              </div>
              <div
                class="flex justify-center flex-shrink-0 w-20 h-20 p-4 rounded-lg bg-slate-200"
              >
                <img class="rounded-lg"  src="https://user-images.githubusercontent.com/25181517/117201156-9a724800-adec-11eb-9a9d-3cd0f67da4bc.png" alt="Java" />
              </div>
              <div
                class="flex justify-center flex-shrink-0 w-20 h-20 p-4 rounded-lg bg-rose-200"
              >
                <img class="rounded-lg"  src="https://user-images.githubusercontent.com/25181517/192109061-e138ca71-337c-4019-8d42-4792fdaa7128.png" alt="Postman" />
              </div>
              <div
                class="flex justify-center flex-shrink-0 w-20 h-20 p-4 bg-indigo-200 rounded-lg"
              >
                <img class="rounded-lg" src="https://user-images.githubusercontent.com/25181517/192108890-200809d1-439c-4e23-90d3-b090cf9a4eea.png" alt="IntelliJ" />
              </div>
              <div
                class="flex justify-center flex-shrink-0 w-20 h-20 p-4 rounded-lg bg-emerald-200"
              >
                <img src="https://user-images.githubusercontent.com/25181517/183345125-9a7cd2e6-6ad6-436f-8490-44c903bef84c.png" alt="Nginx"  />
              </div>
              <div class="flex-shrink-0 w-20 h-20 p-4 bg-red-200 rounded-lg">
                <img  src="https://user-images.githubusercontent.com/25181517/182884894-d3fa6ee0-f2b4-4960-9961-64740f533f2a.png" alt="redis" />
              </div>
              <div class="flex-shrink-0 w-20 h-20 p-4 rounded-lg bg-sky-200">
                <img src="https://user-images.githubusercontent.com/25181517/117207330-263ba280-adf4-11eb-9b97-0ac5b40bc3be.png" alt="Docker" />
              </div>
              <div
                class="flex justify-center flex-shrink-0 w-20 h-20 p-4 rounded-lg bg-slate-200"
              >
                <img src="./img/tailwind.svg" alt="" />
              </div>
              <div
                class="flex justify-center w-20 h-20 p-4 flex-shrink-0 rounded-lg bg-[#f7cb4f]"
              >
                <img class="rounded-lg"  src="https://user-images.githubusercontent.com/25181517/183896128-ec99105a-ec1a-4d85-b08b-1aa1620b2046.png" alt="MySQL" />
              </div>
              <div
                class="flex justify-center flex-shrink-0 w-20 h-20 p-4 bg-red-400 rounded-lg"
              >
                <img class="rounded-lg" src="./img/git.svg" alt="" />
              </div>
              <div
                class="flex justify-center flex-shrink-0 w-20 h-20 p-4 rounded-lg bg-slate-200"
              >
                <img class="rounded-lg" src="./img/python.svg" alt="" />
              </div>
              <div
                class="flex justify-center flex-shrink-0 w-20 h-20 p-4 rounded-lg bg-rose-200"
              >
                <img class="rounded-lg"  src="https://user-images.githubusercontent.com/25181517/192109061-e138ca71-337c-4019-8d42-4792fdaa7128.png" alt="Postman" />
              </div>
              <div
                class="flex justify-center flex-shrink-0 w-20 h-20 p-4 bg-indigo-200 rounded-lg"
              >
                <img class="rounded-lg" src="https://user-images.githubusercontent.com/25181517/192108890-200809d1-439c-4e23-90d3-b090cf9a4eea.png" alt="IntelliJ" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 图片与荣誉 -->
      <div class="flex flex-col justify-between w-full gap-5 mt-4 md:gap-0 md:flex-row">
        <!-- 图片 -->
        <div
          class="w-full md:w-[45%] honer-bg bg-center bg-no-repeat bg-cover rounded-xl h-52 sm:h-auto"
        ></div>
        <!-- 荣誉 -->
        <div
          class="bg-stripe w-full md:w-[50%] bg-slate-50 border dark:bg-slate-800 dark:border-slate-900 p-4 rounded-xl"
        >
          <p class="text-[12px]">🏆 Awards & Project</p>
          <h1 class="mt-2 text-4xl font-bold">无限进步</h1>
          <div class="mt-4 md:text-base lg:text-xl">
            <p class="py-1">🌟 The total play count of Bilibili videos has exceed 650,000</p>
            <p class="py-1">🌟 The contributor of spring-ai-alibaba</p>
          </div>
        </div>
      </div>
      <!-- 音乐/游戏 -->
      <div class="flex flex-col justify-between w-full gap-5 mt-4 md:gap-0 md:flex-row">
        <!-- 音乐 -->
        <div
          class="w-full md:w-[39%] rounded-xl min-h-[13rem] h-52 md:h-auto relative overflow-hidden sm:h-auto"
        >
          <div
            class="absolute w-full h-full bg-center bg-no-repeat bg-cover music-bg"
          ></div>
          <div class="relative z-10 p-4">
            <p class="text-[12px] text-slate-200">音乐喜好</p>
            <h1 class="mt-1.5 text-4xl font-bold text-white">国际流行、</h1>
            <h1 class="mt-1.5 text-4xl font-bold text-white">舞曲、</h1>
            <h1 class="mt-1.5 text-4xl font-bold text-white">嘻哈</h1>
            <p class="text-sm text-right text-slate-100">《This Feeling》</p>
          </div>
        </div>
        <!-- 游戏 -->
        <div
          class="relative w-full md:min-h-[13rem] h-52 md:h-auto md:w-[59%] overflow-hidden rounded-xl"
        >
          <div
            class="absolute w-full h-full bg-center bg-no-repeat bg-cover game-bg"
          ></div>
          <div class="relative z-10 flex flex-col justify-between h-full p-4">
            <p class="text-[12px] text-slate-50">电子竞技</p>
            <h1 class="flex-1 mt-2 text-4xl font-bold text-white">赛博竞速 / FPS</h1>
            <p class="self-end mt-2 text-sm text-right text-slate-100">
              瓦洛兰特 / Forza Horizon 5
            </p>
          </div>
        </div>
      </div>

      <!-- 运动/电影 -->
      <div class="flex flex-col justify-between w-full gap-5 mt-4 md:gap-0 md:flex-row">
        <!-- 电影 -->
        <div
          class="relative w-full md:min-h-[18rem] h-72 overflow-hidden md:w-[58%] rounded-xl"
        >
          <div
            class="absolute w-full bg-center bg-no-repeat bg-cover h-72 movie-bg"
          ></div>
          <div class="relative z-10 flex flex-col justify-between h-full p-4">
            <p class="text-[12px] text-slate-50">兴趣爱好</p>
            <h1 class="flex-1 mt-2 text-4xl font-bold text-white">
              科技 / <br />动漫影视剧
            </h1>
            <p class="self-end mt-2 text-sm text-right text-slate-100">
              “要是没有小祥你们的话，瓦达西...” ——《BanG Dream! It's MyGO!!!!!》
            </p>
          </div>
        </div>
        <!-- 运动 -->
        <div
          class="relative w-full md:min-h-[18rem] h-72 overflow-hidden md:w-[40%] rounded-xl"
        >
          <div
            class="absolute w-full bg-center bg-no-repeat bg-cover h-72 sport-bg"
          ></div>
          <div class="relative flex flex-col justify-between h-full p-4">
            <p class="text-[12px] text-slate-50">无氧运动</p>
            <h1 class="flex-1 mt-2 text-4xl font-bold text-white">健身</h1>
            <p class="self-end mt-2 text-sm text-right text-slate-100">
              单臂弯举突破10KG ing
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.honer-bg {
  background-image: url("./img/honer.jpg");
}
.music-bg {
  background-image: url("./img/music.jpg");
  filter: brightness(0.6);
}
.game-bg {
  background-image: url("./img/game.png");
  filter: brightness(0.8);
}
.sport-bg {
  background-image: url("./img/sport.jpg");
  filter: brightness(0.6);
}
.movie-bg {
  background-image: url("./img/movie.jpg");
  filter: brightness(0.6);
}
.avatar-ping {
  animation: avatarPing 2s ease-in infinite;
}
@keyframes avatarPing {
  0%,
  100% {
    transform: translateX(-50%) translateY(-50%) scale(1.05);
  }
  50% {
    transform: translateX(-50%) translateY(-50%) scale(1.1);
  }
}
.tag-bounce {
  animation: tagBounce 1.5s ease-in infinite;
}
@keyframes tagBounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10%);
  }
}

.icon-scroll {
  animation: iconScroll 20s linear infinite;
}
@keyframes iconScroll {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}
</style>
