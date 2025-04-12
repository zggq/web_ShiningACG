<template>
  <div class="join-us-container">
    <!-- 官方部门 -->
    <div class="department-section">
      <div class="divider">
        <span class="divider-text">官方部门</span>
      </div>
      <div class="department-grid">
        <div
          v-for="(dept, index) in officialDepartments"
          :key="'official-' + index"
          class="department-card"
          @click="openLightbox(dept.qrcode)"
        >
          <img
            alt="二维码"
            class="qrcode-image"
            v-lazy="dept.qrcode"
            :data-srcset="`${dept.qrcode}?width=400 400w, ${dept.qrcode}?width=800 800w`"
            sizes="(max-width: 600px) 300px, 800px"
          />
          <div class="department-name">{{ dept.name }}</div>
        </div>
      </div>
    </div>

    <!-- 分界线 -->
    <div class="divider">
      <span class="divider-text">里群部门</span>
    </div>

    <!-- 里群部门 -->
    <div class="department-section">
      <div class="department-grid">
        <div
          v-for="(dept, index) in informalDepartments"
          :key="'informal-' + index"
          class="department-card"
          @click="openLightbox(dept.qrcode)"
        >
          <img :src="dept.qrcode" alt="二维码" class="qrcode-image" />
          <div class="department-name">{{ dept.name }}</div>
        </div>
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
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { gsap } from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { debounce } from "lodash-es";
gsap.registerPlugin(ScrollToPlugin);
const showBackTop = ref(false);
import { useQrcodeStore } from "../stores/qrcode";
const { officialDepartments, informalDepartments } = useQrcodeStore();

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
.join-us-container {
  padding-top: 10vh;
  margin: 0 80px;
  user-select: none;
}

.department-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  padding: 1rem;
}

.department-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  overflow: hidden;
  cursor: pointer;
}

.department-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.qrcode-image {
  width: 100%;
  height: 300px;
  object-fit: cover;
}

.department-name {
  padding: 1.5rem;
  text-align: center;
  font-size: 2rem;
  color: #333;
  background: #f8f9fa;
  font-family: "Firstfont";
}

/* 分界线样式 */
.divider {
  position: relative;
  margin: 2rem 0;
  text-align: center;
}

.divider-text {
  display: inline-block;
  padding: 0 1rem;
  background: white;
  color: #ce3838;
  font-size: 3rem;
  position: relative;
  font-family: "Firstfont";
}

.divider::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, #ce3838, transparent);
  transform: translateY(-50%);
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

/* 响应式设计 */
@media (max-width: 768px) {
  .join-us-container {
    padding: 1rem;
    padding-top: 15vh;
    margin: auto;
  }

  .section-title {
    font-size: 1.5rem;
  }

  .department-grid {
    gap: 1rem;
  }

  .qrcode-image {
    height: 250px;
  }

  .department-name {
    padding: 1rem;
    font-size: 1rem;
  }

  .divider {
    margin: 3rem 0;
  }

  .divider-text {
    font-size: 1.2rem;
  }
}
</style>
