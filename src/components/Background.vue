<template>
  <div class="container">
    <div
      v-for="orb in orbs"
      :key="orb.id"
      ref="orbsRefs"
      class="orb"
      :style="{
        left: orb.x + 'px',
        top: orb.y + 'px',
        width: orb.size + 'px',
        height: orb.size + 'px',
        background: `radial-gradient(circle at 30% 30%, ${orb.color}, transparent)`,
        filter: `blur(${orb.blur}px)`,
      }"
    ></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import gsap from "gsap";

// 光圈配置
const CONFIG = {
  COUNT: 30, // 光圈数量
  COLOR_PALETTE: [
    // 颜色数组
    "#FFD700", // 金色
    "#FF6B6B", // 红色
    "#4ECDC4", // 青色
    "#45B7D1", // 蓝色
    "#96CEB4", // 绿色
    "#FFD3B6", // 浅橙色
    "#FFB7B2", // 浅粉色
    "#FFE156", // 明亮黄色
    "#FF9F1C", // 亮橙色
    "#00B8A9", // 浅绿蓝
    "#A3D2CA", // 浅青色
    "#FF6F91", // 浅玫红色
    "#D4E157", // 浅绿色
    "#82B1FF", // 浅蓝色
    "#FFB6C1", // 淡粉色
    '#FF7F50',  // 珊瑚色
    '#F4A300',  // 深橙色
    '#3B8E8C',  // 深绿蓝
    '#FF6347',  // 番茄红
    // '#006F62',  // 深青色
    '#B0C4DE',  // 亮钢蓝色
    '#FF8C00',  // 深橙色
    // '#5F9EA0',  // 深灰蓝
    '#32CD32',  // 石榴红
    '#7B68EE',  // 中紫色
    '#6495ED',  // 粉蓝色
  ],
  MIN_SIZE: 3,
  MAX_SIZE: 30,
  BLUR: 1, // 模糊度
};

// 生成初始光圈数据
const orbs = ref(
  Array.from({ length: CONFIG.COUNT }, (_, i) => ({
    id: i,// 光圈id
    color:
      CONFIG.COLOR_PALETTE[
        Math.floor(Math.random() * CONFIG.COLOR_PALETTE.length)
      ],
    size: Math.random() * (CONFIG.MAX_SIZE - CONFIG.MIN_SIZE) + CONFIG.MIN_SIZE,
    x: Math.random() * window.innerWidth,// 光圈位置
    y: Math.random() * window.innerHeight,
    blur: CONFIG.BLUR,
  }))
);

const orbsRefs = ref([]);

// 动画逻辑
const animateOrb = (element) => {
  const timeline = gsap.timeline({
    repeat: -1, // 无限循环
    repeatRefresh: true,// 重复动画时刷新
  });

  // 随机运动路径
  timeline.to(element, {
    x: () => gsap.utils.random(-window.innerWidth / 4, window.innerWidth / 4),
    y: () => gsap.utils.random(-window.innerHeight / 4, window.innerHeight / 4),
    duration: gsap.utils.random(6, 16),
    ease: "power1.inOut",
    overwrite: true,// 重叠动画
  });
};

onMounted(() => {
  // 为每个光圈创建动画
  orbsRefs.value.forEach((orb) => {
    gsap.set(orb, {
      x: parseFloat(orb.style.left),
      y: parseFloat(orb.style.top),
    });
    animateOrb(orb);
  });

  // 窗口大小变化时重置位置
  window.addEventListener("resize", () => {
    orbs.value = orbs.value.map((orb) => ({
      ...orb,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
    }));
  });
});
</script>

<style scoped>
.container {
  position: fixed;
  width: 100vw;
  height: 100vh;
  overflow: visible;
  pointer-events: none;
  z-index:-1;
}



.orb {
  position: absolute;
  border-radius: 50%;
  will-change: transform; /* 优化动画性能 */
  mix-blend-mode: screen; /* 颜色混合模式 */
  z-index: 0;
}
</style>
