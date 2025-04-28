<script setup lang="ts">
import { RouterView, useRouter, useRoute } from "vue-router";
import Background from "./components/Background.vue";
import { useNavListStore } from "./stores/navList";
import { usePartListStore } from "./stores/partList";
import { useUserStore } from "./stores/userStore";
import { ref, watch, computed, onMounted } from "vue";
import gsap from "gsap";
import Loading from "./components/Loading.vue";
import LoginModal from "./components/LoginModal.vue";

const userStore = useUserStore();
const { navList } = useNavListStore();
const { partList } = usePartListStore();
const router = useRouter();
const route = useRoute();
const showSubnav = ref(false);
const activeNav = ref(0);
const showLoginModal = ref(false);
// 需要缓存的视图列表
const cachedViews = ref<string[]>([]);

// 计算属性，确保响应式更新
const isLoggedIn = computed(() => {
  console.log('当前登录状态:', userStore.user.isLoggedIn);
  return userStore.user.isLoggedIn;
});
const username = computed(() => userStore.user.username);

function jumpRoute(nav: string, index: number) {
  console.log(nav);
  router.push({ path: nav });
  showSubnav.value = false;
  console.log('1'+showSubnav.value);
  activeNav.value = index;
}

function enterDepartment() {
  showSubnav.value = !showSubnav.value;
  console.log('2'+showSubnav.value);
  gsap.killTweensOf(".nav_lev2");
  gsap.set(".nav_lev2", {
    scale: 0.5,
    opacity: 0.2,
    transformOrigin: "top center",
  });
  gsap.to(".nav_lev2", {
    scale: 1,
    opacity: 1,
    ease:"back.out(1.7)"
  });
}

function openLoginModal() {
  showLoginModal.value = true;
}

function closeLoginModal() {
  showLoginModal.value = false;
}

function goToProfile() {
  router.push('/profile');
}

async function handleLogout() {
  try {
    console.log('开始登出操作');
    await userStore.logout();
    console.log('登出后状态:', userStore.user.isLoggedIn);
    // 登出后可以重定向到首页
    if (route.path === '/profile') {
      router.push('/');
    }
  } catch (error) {
    console.error('登出失败:', error);
  }
}

function handleLoginSuccess() {
  // 强制UI更新以确保状态变化反映在视图上
  console.log('登录成功，用户信息：', userStore.user);
  // 确保关闭登录模态框
  showLoginModal.value = false;
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

// 确保在组件挂载时检查登录状态
onMounted(() => {
  console.log('App组件挂载，当前登录状态:', userStore.user.isLoggedIn);
});
</script>

<template>
  <Loading/>
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
        <div class="nav_lev2" v-show="showSubnav" v-if="index === 1">
          <div
            v-for="(part, index) in partList"
            :key="index"
            class="subnav_item"
            @click.stop="jumpRoute(part.path, 1)"
          >
            {{ part.name }}
          </div>
        </div>
      </span>
      
      <!-- 用户头像/登录按钮 -->
      <span v-if="isLoggedIn" class="user-avatar-wrapper" @click="goToProfile" title="个人中心">
        <div class="avatar-text">{{ username.charAt(0).toUpperCase() }}</div>
      </span>
      <span v-else @click="openLoginModal">
        登录
      </span>
    </div>
  </nav>
  
  <!-- 登录/注册模态框 -->
  <LoginModal 
    v-if="showLoginModal" 
    @close="closeLoginModal"
    @login-success="handleLoginSuccess" 
  />
  
  <RouterView v-slot="{ Component }">
    <template v-if="$route.meta.keepAlive">
      <keep-alive :include="cachedViews" :max="5">
        <component :is="Component" :key="$route.fullPath" />
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
  
  padding: 5px;
  border-radius: 10px;
  display: flex;
  justify-content: space-between;
  z-index: 1;
  position: fixed;
  width: 99.1%;
  background-color: rgba(236, 244, 248, 1);
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
  margin-top: 10px;
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

/* 用户状态样式 */
.user-avatar-wrapper {
  height: 60%;
  width: 6rem;
  background-color: rgba(208, 229, 237, 0.896);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  user-select: none;
  font-family: "Firstfont", sans-serif;
  font-size: 1.3rem;
  color: rgba(15, 135, 210, 0.673);
}

.user-avatar-wrapper:hover {
  color: rgb(15, 135, 210);
  font-weight: 800;
}

.avatar-text {
  font-weight: bold;
  font-size: 1.2rem;
}

@media (max-width: 480px){
  nav{
    margin-left: -5px;
  }
  .img_nav{
    width: 100px;
  }
  .nav_text{
    width: 80%;
  }
  
  .nav_text span,
  .user-avatar-wrapper {
    font-size: 0.9rem;
    padding: 0 10px;
  }
}
</style>
