<template>
  <div class="solar-system">
    <div class="center">
      <Logo1 />
    </div>
    <div class="orbit-container">
      <div
        v-for="(img, index) in imgList"
        :key="index"
        class="orbit"
        @click="routerSection(index)"
        @mouseenter="pauseAnimation"
        @mouseleave="resumeAnimation"
      >
        <Logo2 :image-path="img" :index="index" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" name="Logo_frame">
import gsap from "gsap";
import Logo1 from "../components/Logo_1.vue";
import Logo2 from "../components/Logo_2.vue";
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { usePartListStore } from "../stores/partList";

// import router from "../router";
const { partList } = usePartListStore(); //获取部门列表
const router = useRouter();
const imgList = ref<string[]>([]); // 图片列表
const radius = ref<number>(160); // 旋转半径
const containerAnimation = ref<gsap.core.Tween>(); // 容器旋转动画
const orbitAnimations = ref<gsap.core.Tween[]>([]); // 子元素旋转动画
const activeTweens: gsap.core.Tween[] = []; // 全局存储激活中的补间
let isPaused = false; // 暂停状态变量

for (let i = 1; i <= 16; i++) {
  imgList.value.push(`/img_logo/2.${i}.jpg`);
}
function routerSection(index: number) {
  // console.log(partList[index]);
  router.push({ path: partList[index].path });
}
function setupAnimations() {
  // 清除旧动画
  gsap.killTweensOf([containerAnimation.value, ...orbitAnimations.value]);
  // 容器顺时针旋转动画
  containerAnimation.value = gsap.to(".orbit-container", {
    rotation: 360,
    duration: 30,
    repeat: -1,
    ease: "none",
    paused: false, // 初始移动状态
  });

  // 子元素逆向旋转动画
  const orbits = gsap.utils.toArray<Element>(".orbit");
  orbitAnimations.value = orbits.map((orbit) =>
    gsap.to(orbit, {
      rotation: -360,
      duration: 30,
      repeat: -1,
      ease: "none",
      paused: false, // 初始移动状态
    })
  );

  // 启动动画
  updatePositions();
}
function updatePositions() {
  gsap.utils.toArray<Element>(".orbit").forEach((element, index) => {
    const img_length = imgList.value.length; //图片数量
    const num_in = Math.floor(img_length / 2); //内圈图片数量
    const num_out = img_length - num_in; //外圈图片数量
    const angle_base = 360 / img_length; //基角度
    let angle_per = 0, //每个图片的角度
      angle = 0, //当前图片的角度
      radius_per = 0; //每个图片的半径
    if (index < num_in) {
      //内圈处理
      angle_per = 360 / num_in; //内圈基角度
      angle = angle_per * index; //当前图片的角度
      radius_per = radius.value; //每个图片的半径
      // console.log(angle_per, angle, radius_per);
    }
    if (index >= num_in) {
      //外圈处理
      angle_per = 360 / num_out; //外圈基角度
      angle = angle_per * index + angle_base; //当前图片的角度
      radius_per = radius.value * 1.7; //每个图片的半径
      // console.log(angle_per, angle, radius_per);
    }
    const radian = (angle * Math.PI) / 180;
    const x = radius_per * Math.cos(radian);
    const y = radius_per * Math.sin(radian);
    // console.log(x, y);

    gsap.to(element, {
      duration: 2,
      x: x,
      y: y,
      ease: "power2.inOut",
    });
  });
}

const pauseAnimation = () => {
  // 清理旧补间
  activeTweens.forEach((t) => t.kill());
  activeTweens.length = 0;
  // 平滑减速动画
  const tween = gsap.to([containerAnimation.value, ...orbitAnimations.value], {
    timeScale: 0,
    duration: 1,
    ease: "power2.out",
    onComplete: () => {
      if (!isPaused) return;
      containerAnimation.value?.pause();
      orbitAnimations.value.forEach((anim) => anim.pause());
      isPaused = true;
    },
  });
  activeTweens.push(tween);
  // console.log(activeTweens);
};

const resumeAnimation = () => {
  // 清理旧补间
  activeTweens.forEach((t) => t.kill());
  activeTweens.length = 0;
  // 恢复播放状态
  containerAnimation.value?.play();
  orbitAnimations.value.forEach((anim) => anim.play());
  isPaused = false;
  // 平滑加速动画
  const tween = gsap.to([containerAnimation.value, ...orbitAnimations.value], {
    timeScale: 1,
    duration: 1,
    ease: "power2.out",
  });
  activeTweens.push(tween);
};
onMounted(() => {
  setupAnimations(); // 初始化动画
});
</script>

<style>
.solar-system {
  position: fixed;
  left: 40%;
  width: 50vw;
  height: 100vh;
  z-index: -1;
  user-select: none;
}

.center {
  position: absolute;
  top: 56%;
  left: 70%;
  transform: translate(-50%, -50%);
  z-index: 1;
}
.orbit-container {
  position: absolute;
  top: 56%;
  left: 70%;
  transform: translate(-50%, -50%);
}
.orbit {
  position: absolute;
  transform: translate(-50%, -50%);
  cursor: pointer;
}
@media (max-width: 480px) {
  .center {
    top: 88%;
    left: 83%;
  }
  .orbit-container {
    top: 88%;
    left: 83%;
  }
}
</style>
