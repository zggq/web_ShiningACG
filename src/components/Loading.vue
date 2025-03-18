<template>
  <div class="loader-container" v-show="isLoading">
    <div class="logo-text">
      <span
        class="letter"
        v-for="(letter, index) in letters"
        :key="index"
        ref="lettersRef"
      >
        {{ letter }}
      </span>
    </div>
    <div class="progress-bar">
      <div class="progress" :style="{ width: progress + '%' }"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import gsap from "gsap";

const emit = defineEmits(["loaded"]);
const letters = ref(["S", "h", "i", "n", "i", "n", "g", "A", "C", "G"]);
const lettersRef = ref<HTMLElement[]>([]);
const progress = ref(0);
const isLoading = ref(true);

// 存储所有资源 Promise
const resourcePromises = ref<Promise<any>[]>([]);

// 初始化资源跟踪
const initResourceTracking = () => {
  // 获取所有图片元素（包括预加载的）
  const images = Array.from(document.querySelectorAll("img"))
    .filter((img) => !img.complete)
    .map((img) => {
      return new Promise((resolve) => {
        img.onload = resolve;
        img.onerror = resolve;
      });
    });

  // 跟踪字体加载
  const fontsToCheck = ["Firstfont", "隶书"];
  const fontPromises = fontsToCheck.map((fontName) => {
    return document.fonts.load(`1em "${fontName}"`);
  });

  // 合并所有资源
  resourcePromises.value = [...images, ...fontPromises];
};

// 更新进度条
const updateProgress = () => {
  const loadedCount =
    resourcePromises.value.length -
    resourcePromises.value.filter((p) => {
      return p instanceof Promise;
    }).length;

  const total = resourcePromises.value.length;
  const newProgress = Math.min(100, Math.round((loadedCount / total) * 100));

  gsap.to(progress, {
    value: newProgress,
    duration: 0.3,
    ease: "power2.out",
  });
};

// 创建加载动画
const createLoaderAnimation = () => {
  const tl = gsap.timeline({ repeat: -1 });

  lettersRef.value.forEach((letter, index) => {
    tl.to(
      letter,
      {
        y: -20,
        scale: 1.2,
        duration: 0.2,
        ease: "power2.out",
        delay: index * 0.1,
      },
      0
    ).to(
      letter,
      {
        y: 0,
        scale: 1,
        duration: 0.3,
        ease: "bounce.out",
      },
      index * 0.1 + 0.2
    );
  });

  return tl;
};

onMounted(async () => {
  const loaderTimeline = createLoaderAnimation();
  initResourceTracking();

  // 监听所有资源加载
  const timeoutPromise = new Promise((resolve) => setTimeout(resolve, 10000)); // 10秒超时

  await Promise.race([Promise.all(resourcePromises.value), timeoutPromise]);

  // 确保进度到100%
  gsap.to(progress, {
    value: 100,
    duration: 0.5,
    onComplete: () => {
      isLoading.value = false;
      emit("loaded");
      loaderTimeline.kill();
    },
  });
});

// 监听资源变化
onMounted(() => {
  resourcePromises.value.forEach((p) => {
    p.finally(updateProgress);
  });
});
</script>

<style scoped>
.loader-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgb(123, 210, 206);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 99;
}

.logo-text {
  display: flex;
  gap: 12px;
  margin-bottom: 30px;
}

.letter {
  font-size: 10rem;
  font-family: "Komigo";
  color: #333;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.573);
}

.progress-bar {
  width: 200px;
  height: 4px;
  background: #eee;
  border-radius: 2px;
  overflow: hidden;
}

.progress {
  width: 0%;
  height: 100%;
  background: linear-gradient(90deg, rgb(123, 187, 210), rgb(52, 146, 183));
  transition: width 0.3s ease;
}
</style>
