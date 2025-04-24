<template>
  <div class="qa-container">
    <div
      v-for="(item, index) in qaList"
      :key="index"
      class="qa-card"
      @click="toggleCard(index)"
    >
      <div class="question">
        <span class="q-mark">Q:</span>
        <span>{{ item.question }}</span>
        <span
          :ref="(el) => (arrowRefs[index] = el  as HTMLElement)"
          class="arrow"
          >▼</span
        >
      </div>
      <div class="answer" :class="{ collapsed: !expandedStates[index] }">
        <span class="a-mark">A：</span>
        <div class="answer-content">{{ item.answer }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import gsap from "gsap";
import { ref, onMounted } from "vue";
import { qaList } from "../data/qaList";
const arrowRefs = ref<HTMLElement[]>([]);
const arrowAnimations = ref<{ [key: number]: gsap.core.Tween }>({});
// 使用数组保存每个卡片的展开状态
const expandedStates = ref<boolean[]>(qaList.map(() => false));
const toggleCard = (index: number) => {
  expandedStates.value[index] = !expandedStates.value[index];
  // 执行GSAP动画
  console.log(arrowAnimations.value[index]);

  if (expandedStates.value[index]) {
    arrowAnimations.value[index].play();
  } else {
    arrowAnimations.value[index].reverse();
  }
};
onMounted(() => {
  // 初始化箭头动画
  qaList.forEach((_, index) => {
    if (arrowRefs.value[index]) {
      arrowAnimations.value[index] = gsap.to(arrowRefs.value[index], {
        rotation: 180,
        duration: 0.3,
        paused: true,
        ease: "'elastic.out(1, 0.5)",
      });
    }
  });
});
</script>

<style scoped>
/* 容器布局 */
.qa-container {
  max-width: 800px;
  margin: 0 auto;
  padding-top: 15vh;
  user-select: none;
}

/* 卡片样式 */
.qa-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  transition: transform 0.3s ease;
  cursor: pointer;
}

.qa-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
}

/* 问题样式 */
.question {
  color: #091521;
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 1rem;
  position: relative;
  padding-left: 2rem;
  font-family: "Firstfont";
}

.q-mark {
  color: #409eff;
  position: absolute;
  left: 0;
  font-weight: 700;
}
.arrow {
  display: inline-block;
  transform-box: fill-box;
  will-change: transform;
}
/* 回答样式 */
.answer {
  color: #2c2828;
  line-height: 1.3;
  padding-left: 2rem;
  position: relative;
  font-family: "幼圆";
  font-size: 1.5rem;
  transition: max-height 0.3s ease;
  overflow: hidden;
}
.collapsed {
  max-height: 0;
  margin-bottom: 0;
}
.a-mark {
  color: #ce3838;
  position: absolute;
  left: 0;
  font-weight: 800;
  font-family: "Firstfont";
}

/* 响应式设计 */
@media (max-width: 768px) {
  .qa-container {
    padding: 1rem;
    padding-top: 15vh;
  }

  .question {
    font-size: 1.1rem;
  }

  .answer {
    font-size: 0.95rem;
  }
}
</style>
