<script setup lang="ts">
import { RouterView, useRouter, useRoute } from "vue-router";
import Background from "./components/Background.vue";
import { useNavListStore } from "./stores/navList";
import { usePartListStore } from "./stores/partList";
import { ref, watch } from "vue";
import gsap from "gsap";
const { navList } = useNavListStore();
const { partList } = usePartListStore();
const router = useRouter();
const route = useRoute();
const showSubnav = ref(false);
const activeNav = ref(0);
// 需要缓存的视图列表
const cachedViews = ref<string[]>([]);
function jumpRoute(nav: string, index: number) {
  // console.log(nav);
  router.push({ path: nav });
  showSubnav.value = false;
  activeNav.value = index;
}
function enterDepartment() {
  showSubnav.value = !showSubnav.value;
  // console.log(1);
  gsap.set(".nav_lev2", {
    x: -226,
    y: 225,
    scale: 0.5,
    opacity: 0.2,
    transformOrigin: "top center",
  });
  gsap.to(".nav_lev2", {
    scale: 1,
    opacity: 1,
  });
}
// 动态添加需要缓存的组件
watch(
  () => route.meta?.keepAlive,
  (keepAlive) => {
    if (keepAlive && route.name) {
      if (!cachedViews.value.includes(route.name as string)) {
        cachedViews.value.push(route.name as string);
      }
    }
  },
  { immediate: true }
);
</script>

<template>
  <Background />
  <nav>
    <div class="img_nav">
      <img
        src="/img_nav/nav.png"
        alt="Shining ACG FanClub"
        style="width: 100%"
      />
    </div>
    <div class="nav_text">
      <span
        v-for="(nav, index) in navList"
        :key="index"
        :class="{ selected: activeNav === index }"
        @click="index === 1 ? enterDepartment() : jumpRoute(nav.path, index)"
      >
        {{ nav.name }}
      </span>
      <div class="nav_lev2" v-show="showSubnav">
        <div
          v-for="(part, index) in partList"
          :key="index"
          class="subnav_item"
          @click="jumpRoute('/' + part, 1)"
        >
          {{ part }}
        </div>
      </div>
    </div>
  </nav>
  <RouterView v-slot="{ Component }">
  <template v-if="$route.meta.keepAlive">
    <keep-alive :include="cachedViews" :max="5">
      <component
        :is="Component"
        :key="$route.fullPath"
      />
    </keep-alive>
  </template>
  <template v-else>
    <component :is="Component" :key="$route.fullPath" />
  </template>
</RouterView>
</template>

<style scoped>
nav {
  border: 2px solid rgb(200, 224, 228);
  /* margin: 0 10px; */
  padding: 5px;
  border-radius: 10px;
  display: flex;
  justify-content: space-between;
  z-index: 1;
  position: fixed;
  width: 99.1%;
  background-color: rgba(236, 244, 248, 0.91);
}
.img_nav {
  width: 165px;
  height: 78px;
  border-radius: 15px;
  overflow: hidden;
  user-select: none;
}
.nav_text {
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 68%;
}

.nav_text span,
.nav_lev2 {
  height: 60%;
  width: 6rem;
  background-color: rgba(208, 229, 237, 0.896);
  border-radius: 15px;
  align-content: center;
  text-align: center;
  color: rgba(15, 135, 210, 0.673);
  cursor: pointer;
  user-select: none;
  font-family: "Firstfont", sans-serif;
  font-size: 1.3rem;
}
.nav_lev2 {
  position: absolute;
  height: auto;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
}
.selected {
  border: 2px solid rgb(15, 135, 210);
  font-weight: 800;
}
.nav_text span:hover,
.subnav_item:hover {
  color: rgb(15, 135, 210);
  font-weight: 800;
}
</style>
