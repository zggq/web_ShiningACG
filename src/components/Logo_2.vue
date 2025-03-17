<template>
  <div class="satellite-container" ref="containerRef">
    <div
      class="satellite-logo"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
      ref="logoRef"
    >
      <img :src="props.imagePath" :alt="'Logo_' + props.index" />
    </div>
    <!-- 使用Teleport将气泡卡片提升到body层级 -->
    <Teleport to="body">
      <div class="bubble-card" ref="bubbleRef" v-show="showBubble">
        <!-- <div class="bubble-content"> -->
        <div>
          <h3 class="title">{{ partBrief[props.index].part }}</h3>
        </div>
        <div class="a">
          <p class="title-decorator">{{ partBrief[props.index].brief }}</p>
        </div>

        <!-- </div> -->
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import gsap from "gsap";
import { usePartIntroductionStore } from "../stores/partIntroduction";
const { partBrief } = usePartIntroductionStore();
const props = defineProps<{
  imagePath: string;
  index: number;
}>();

const logoRef = ref<HTMLElement>();
const bubbleRef = ref<HTMLElement>();
const showBubble = ref(false);
const activeTweens: gsap.core.Tween[] = []; // 全局存储激活中的补间
// 计算定位方向
const calculatePosition = (baseX: number, baseY: number) => {
  const width = window.innerWidth; // 获取窗口的宽度
  const height = window.innerHeight; // 获取窗口的高度
  const xPercent = (baseX / width) * 100;
  const yPercent = (baseY / height) * 100;
  console.log(xPercent, yPercent);
  let dX = 1;
  let dY = 0;
  if (yPercent < 32) {
    if (yPercent < 28) {
      dX = 0;
      dY = 1;
      console.log("下");
    } else if (xPercent > 78) {
      dX = -1;
      dY = 0;
    } else {
      dX = 1;
      dY = 0;
    }
  } else if (yPercent > 56) {
    if (yPercent > 70) {
      dX = 0;
      dY = -1;
    } else if (xPercent > 80) {
      dX = -1;
      dY = 0;
    } else {
      dX = 0;
      dY = -1;
    }
  } else if (xPercent > 78) {
    dX = -1;
    dY = 0;
  } else {
    dX = 1;
    dY = 0;
  }
  return { dX, dY };
};
// 在组件顶部添加防抖相关变量
let hoverTimeout: number | null = null;
let isHovered = false;

// 鼠标进入处理
const handleMouseEnter = () => {
  isHovered = true;
  // 清除可能存在的旧计时器
  if (hoverTimeout) {
    clearTimeout(hoverTimeout);
    hoverTimeout = null;
  }
  hoverTimeout = window.setTimeout(() => {
    // console.log("1:", isHovered);
    if (!isHovered) return;
    if (!logoRef.value || !bubbleRef.value) return;
    const logoRect = logoRef.value.getBoundingClientRect(); //获取元素的大小及其相对于视口的位置
    // console.log(logoRect);
    // console.log(event.clientX, event.clientY);
    // 计算定位坐标
    const baseX = logoRect.left + logoRect.width / 2;
    const baseY = logoRect.top + logoRect.height / 2;
    const { dX, dY } = calculatePosition(baseX, baseY);
    // console.log(dX, dY);

    // 执行动画
    showBubble.value = true;
    gsap.set(".bubble-card", {
      x: baseX + 65 * dX, //65 * dX
      y: baseY + 95 * dY, //95 * dY
      xPercent: -50,
      yPercent: -50,
      opacity: 1,
      scale: 0.8,
    });
    // console.log("2:", isHovered);
    const tween = gsap.to(".bubble-card", {
      x: baseX + 180 * dX,
      y: baseY + 170 * dY,
      opacity: 1,
      scale: 1,
      duration: 0.4,
      ease: "power2.out",
      onStart: () => {
        // 确保状态仍然有效
        if (!isHovered) tween.progress(1).kill();
        // console.log("3:", isHovered);
      },
    });
    activeTweens.push(tween);
    // console.log("4:", isHovered);
  }, 300); // 300ms延迟
};

// 鼠标离开处理
const handleMouseLeave = () => {
  isHovered = false;
  // 立即清除计时器
  if (hoverTimeout) {
    clearTimeout(hoverTimeout);
    hoverTimeout = null;
  }
  // if (!bubbleRef.value) return;
  activeTweens.forEach((tween) => tween.kill());
  activeTweens.length = 0;
  // console.log(activeTweens);
  if (showBubble.value) {
    const tween = gsap.to(".bubble-card", {
      opacity: 0,
      scale: 0.8,
      duration: 0.2,
      onComplete: () => {
        showBubble.value = false;
      },
    });
    activeTweens.push(tween);
  } else {
    showBubble.value = false;
  }
};
</script>

<style>
.satellite-container {
  position: relative;
  display: inline-block;
}
.satellite-logo {
  width: 6rem;
  height: 6rem;
  border-radius: 50%;
  overflow: hidden;
  box-shadow: -4px 3px 6px 0px #20323f57;
}

.satellite-logo img {
  position: relative;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: -1;
}
.bubble-card {
  position: fixed; /* 改为固定定位 */
  display: flex;
  width: 14rem;
  height: 12rem;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(8px) saturate(120%);
  padding: 1rem;
  will-change: transform, opacity;
  pointer-events: none;
  flex-direction: column;
}
.title {
  font-size: 1.8rem;
  font-family: "Firstfont", sans-serif;
  color: #ffffff;
  background-color: #e74c4cc4;
  border: 2px solid #dd3d3d6a;
  box-shadow: 0 2px 8px rgba(211, 22, 22, 0.635);
  margin: 0;
  padding: 5px;
  border-radius: 8px;
}
.bubble-card div {
  display: flex;
  flex-grow: 1;
  /* justify-content: center; */
  align-items: center;
}
.title-decorator {
  margin: 0;
  font-size: 1.3rem;
  font-family: "隶书", sans-serif;
  padding: 0;
}
/* 响应式调整 */
@media (max-width: 1024px) {
  .bubble-card {
    width: 10rem;
    height: 10rem;
  }
  .satellite-logo {
    width: 5rem;
    height: 5rem;
  }
}

@media (max-width: 768px) {
  .bubble-card {
    width: 8rem;
    height: 8rem;
  }
  .satellite-logo {
    width: 3rem;
    height: 3rem;
  }
}
</style>
