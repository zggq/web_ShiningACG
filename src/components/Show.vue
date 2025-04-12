<template>
  <main class="content-container">
    <!-- 循环每个活动 -->
    <div
      v-for="(activity, index) in information"
      :key="index"
      class="activity-item"
    >
      <!-- 文字区域 -->
      <div class="text-content">
        <h2 class="activity-title">{{ activity.name }}</h2>
        <p class="activity-description">{{ activity.info }}</p>
      </div>

      <!-- 图片画廊 -->
      <div class="image-gallery">
        <img
          v-lazy="imgPath"
          :data-srcset="`${imgPath}?width=400 400w, ${imgPath}?width=800 800w`"
          sizes="(max-width: 600px) 300px, 800px"
          v-for="(imgPath, imgIndex) in activity.img"
          :key="imgIndex"
          :alt="`${activity.name}图片${imgIndex + 1}`"
          class="gallery-image"
          @click="openLightbox(imgPath)"
        />
      </div>
    </div>
    <div>
      <h2 class="activity-title">周常活动安排</h2>
      <p class="activity-schedule">
        <span style="color: #ce3838">周一</span>：由模玩部组织模型制作教学
      </p>
      <p class="activity-schedule">
        <span style="color: #ce3838">周二</span
        >：由宣传部组织进行绘画教学指导以及周五活动的海报绘制，<br />为热爱绘画的成员们提供一个良好的场所
      </p>
      <p class="activity-schedule">
        <span style="color: #ce3838">周三</span
        >：轻文部活动（7：00到8：00）；由活动部组织进行本周周常活动<br />宣传海报的张贴工作（无需要则开心打牌聊天，8：00以后）
      </p>
      <p class="activity-schedule">
        <span style="color: #ce3838">周四</span
        >：由cos部和宅舞部组织宅舞和cosplay的相关教学；wota艺教学和练习
      </p>
      <p class="activity-schedule">
        <span style="color: #ce3838">周五</span
        >：（5点之前）轻文部部活；（7：00以后）由活动部组织进行面向<br />全校范围的ACG相关内容的专题讲座/动漫研举办的放映会和主题讨论会
      </p>
      <p class="activity-schedule">
        <span style="color: #ce3838">周六</span
        >：由视频组组织进行技术教学、MAD鉴赏等活动（14：00到17：30），<br />音游组活动（17：30到20：00），
        v曲组活动（20：00以后）
      </p>
      <p class="activity-schedule">
        <span style="color: #ce3838">周日</span
        >：由轻音部组织乐队的自由排练，晚上wota艺教学练习，<br />东方组活动（19点~20点）
      </p>
      <p class="activity-schedule">
        此外，秘书处在线上随时接收来自社内所有成员的投稿；<br />每周二和每周四都会在社团的各大公众平台上发布周常专栏推送。
      </p>
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
interface Activity {
  name: string;
  info: string;
  img: string[];
}
defineProps<{
  information: Activity[];
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
.activity-schedule {
  user-select: none;
  color: rgb(15, 136, 210);
  font-size: 2rem;
  margin-bottom: 1rem;
  text-align: center;
  font-family: "Firstfont";
}
.activity-description {
  color: #373737;
  line-height: 1.8;
  font-size: 1.2rem;
}

/* 图片画廊 */
.image-gallery {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
}

.gallery-image {
  width: 100%;
  height: 220px;
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
