<template>
  <main class="content-container">
    <!-- 循环每个活动 -->
    <div class="activity-item">
      <!-- 文字区域 -->
      <div class="text-content">
        <h2 class="activity-title">{{ information.part }}</h2>
        <p class="activity-description">{{ information.brief }}</p>
      </div>

      <!-- 图片画廊 -->
      <div class="image-gallery">
        <img
          v-lazy="imgPath"
          :data-srcset="`${imgPath}?width=400 400w, ${imgPath}?width=800 800w`"
          sizes="(max-width: 600px) 300px, 800px"
          v-for="(imgPath, imgIndex) in information.img"
          :key="imgIndex"
          :src="imgPath"
          :alt="`${information.part}图片${imgIndex + 1}`"
          class="gallery-image"
          @click="openLightbox(imgPath)"
        />
      </div>
    </div>
    <!-- 图片预览层 -->
    <Teleport to="body">
      <transition name="fade">
        <div
          v-if="lightboxVisible"
          class="lightbox"
          @click.self="closeLightbox"
        >
          <div class="lightbox-content">
            <button class="close-btn" @click="closeLightbox">×</button>
            <img :src="currentImage" class="lightbox-image" />
          </div>
        </div>
      </transition>
    </Teleport>
    <!-- 返回顶部按钮 -->
    <Teleport to="body">
      <transition name="fade">
        <button v-show="showBackTop" class="back-top" @click="scrollToTop">
          ↑
        </button>
      </transition>
    </Teleport>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { gsap } from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { debounce } from "lodash-es";
gsap.registerPlugin(ScrollToPlugin);
const showBackTop = ref(false);
// 定义props类型
interface Part {
  part: string;
  brief: string;
  img?: string[];
}
defineProps<{
  information: Part;
}>();
// 图片预览功能
const lightboxVisible = ref(false);
const currentImage = ref("");

const openLightbox = (img: string) => {
  currentImage.value = img;
  lightboxVisible.value = true;
};
const closeLightbox = () => {
  lightboxVisible.value = false;
  document.body.style.overflow = "";
};
// 滚动处理
const handleScroll = debounce(() => {
  showBackTop.value = window.scrollY > 100;
  console.log(showBackTop.value);
}, 100);

// 返回顶部动画
const scrollToTop = () => {
  gsap.to(window, {
    duration: 0.8,
    scrollTo: 0,
    ease: "power2.inOut",
  });
};

// 生命周期
onMounted(() => window.addEventListener("scroll", handleScroll));
onUnmounted(() => window.removeEventListener("scroll", handleScroll));
</script>

<style scoped>
.content-container {
  /* position: static; */
  width: 86%;
  padding-top: 5vh;
  margin-left: 7vw;
  background-color: rgba(243, 250, 252, 0.679);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(8px);
  border-radius: 18px;
}

.activity-item {
  padding: 2rem;
  background: white;
}
/* 文字区域样式 */
.text-content {
  margin-bottom: 2rem;
}
.activity-title {
  user-select: none;
  color: #ce3838;
  font-size: 3rem;
  margin-bottom: 1rem;
  text-align: center;
  font-family: "Firstfont";
}
.activity-description {
  color: #101010;
  line-height: 1.6;
  font-size: 1.6rem;
  font-family: "Firstfont";
}

/* 图片画廊 */
.image-gallery {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(35vw, 1fr));
  gap: 1rem;
}

.gallery-image {
  width: 39vw;
  /* height: 220px; */
  object-fit: cover;
  border-radius: 4px;
  cursor: pointer;
  transition: transform 0.3s ease;
  user-select: none;
}

.gallery-image:hover {
  transform: scale(1.05);
}

/* 返回顶部按钮 */
.back-top {
  position: fixed;
  right: 1rem;
  bottom: 2rem;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: #40a0ffb3;
  color: white;
  cursor: pointer;
  border: 1px solid #5a8ab9a2;
  box-shadow: 2px 4px 10px rgba(26, 50, 64, 0.542);
  transition: transform 0.3s ease, opacity 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
}

.back-top:hover {
  transform: translateY(-3px);
  background: #66b1ff;
}

/* 遮罩层样式 */
.lightbox {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.8);
  z-index: 99;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 预览内容 */
.lightbox-content {
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
}

/* 预览图片 */
.lightbox-image {
  max-width: 100%;
  max-height: 80vh;
  border-radius: 8px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
}

/* 关闭按钮 */
.close-btn {
  position: absolute;
  top: -25px;
  right: -50px;
  color: white;
  font-size: 5rem;
  background: none;
  border: none;
  cursor: pointer;
  transition: opacity 0.3s;
}

.close-btn:hover {
  opacity: 0.8;
}

/* 过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .content-wrapper {
    padding: 1rem;
    padding-top: 15vh;
  }

  .back-top {
    right: 1rem;
    bottom: 1rem;
    width: 36px;
    height: 36px;
  }
}
</style>
