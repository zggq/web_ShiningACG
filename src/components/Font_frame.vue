<template>
  <!-- 在原有内容中添加 -->
  <div class="hero-text">
    <!-- 第一行 -->
    <div class="line line-first" @mouseenter="animateComplexWave">
      <span
        v-for="(char, charIndex) in firstLineChars"
        :key="'first-' + charIndex"
        class="char"
        >{{ char }}</span
      >
    </div>
    <!-- 第二行 -->
    <div class="line line-second">
      <span
        v-for="(char, charIndex) in secondLineChars"
        :key="'second-' + charIndex"
        class="char"
        >{{ char }}</span
      >
    </div>
    <!-- 第三行 -->
    <div class="line line-third">
      <span class="char" style="font-size: 80px;"><span style="color: rgba(219, 4, 4, 0.953);">晒你</span>动漫社</span><br>
      <span class="char">点击部门<span class="logo">logo</span>查看详情</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import gsap from "gsap";

// 拆分文本
const firstLineChars = ref("Shining".split(""));
const secondLineChars = ref("ACG".split(""));
let waveAnimation: gsap.core.Timeline | null = null;
// 复杂麦浪动画
const animateComplexWave = () => {
  // 如果已有动画正在运行，先清除
  if (waveAnimation) waveAnimation.kill();

  waveAnimation = gsap.timeline({
    defaults: {
      duration: 0.3,
      ease: "sine.inOut",
      // overwrite: true
    },
  });

  // 第一波动画（主波）
  waveAnimation
    .to(".line-first .char", {
      y: 20,
      rotation: -5,
      // duration: 0.2,
      stagger: {
        each: 0.08,
        from: "start",
        grid: "auto",
      },
    })
    // 第二波动画（次级波）
    .to(
      ".line-first .char",
      {
        y: -20,
        rotation: 3,
        stagger: {
          each: 0.08,
          from: "start",
        },
      },
      "<+=0.15"
    )
    // 第三波动画（复位）
    .to(
      ".line-first .char",
      {
        y: 0,
        rotation: 0,
        stagger: {
          each: 0.08,
          from: "start",
        },
      },
      "<+=0.25"
    );
};
onMounted(() => {
  // animateText();
  const tl = gsap.timeline();

  // 第一行动画：缩放淡入
  tl.fromTo(
    ".line-first .char",
    {
      opacity: 0,
      scale: 1.3,
    },
    {
      opacity: 1,
      scale: 1,
      duration: 0.8,
      stagger: {
        each: 0.15,
        from: "start",
      },
      ease: "sine.out",
      force3D: true, // 启用硬件加速
    }
  );

  // 第二行动画：下落弹跳
  tl.fromTo(
    ".line-second .char",
    {
      opacity: 0,
      y: -60,
    },
    {
      opacity: 1,
      y: 0,
      duration: 0.6,
      stagger: 0.2,
      ease: "bounce.out", // 弹跳函数
    }
  );

  // 第三行动画：淡入
  tl.fromTo(
    ".line-third .char",
    {
      opacity: 0,
    },
    {
      opacity: 1,
      duration: 0.6,
    }
  );
});
</script>

<style scoped>


/* 更新样式 */
.hero-text {
  position: fixed;
  left: 8%;
  top: 50%;
  transform: translateY(-50%);
  z-index: 2;
}

.char {
  font-family: "Komigo", "Firstfont", sans-serif;
  font-size: 12rem;
  font-weight: 700;
  line-height: 1;
  text-shadow: 8px 2px 4px rgba(77, 41, 41, 0.236);
  transform-style: preserve-3d;
  white-space: pre-wrap;
  will-change: transform, opacity, filter;
  margin: 0 0.35rem;
  display: inline-block;
}

.line-first .char {
  font-size: 8rem;
  color: rgba(219, 4, 4, 0.653);
  margin-bottom: -1.2rem;
  cursor: default;
  user-select: none;
}
.line-second .char {
  color: rgb(15, 136, 210);
  /* 事件穿透 */
  pointer-events: none;
  margin: 0 0.5rem;
  user-select: none;
}
.line-third .char {
  margin-top: 10px;
  font-size: 2rem;
  cursor: default;
  user-select: none;
}
.logo {
  font-size: 2.5rem;
}
.logo:hover {
  color: rgb(15, 136, 210);
  cursor: default;
}
/* 响应式调整 */
@media (max-width: 1024px) {
  .char {
    font-size: 4.5rem;
  }
  .line:first-child .char {
    font-size: 2.8rem;
  }
}

@media (max-width: 768px) {
  .char {
    font-size: 3.2rem;
  }
  .line:first-child .char {
    font-size: 2rem;
  }
}
</style>
