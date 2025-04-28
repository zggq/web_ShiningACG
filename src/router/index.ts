import { createRouter, createWebHistory } from "vue-router";
import Home from "../components/Home.vue";
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/home",
      name: "home",
      component: Home,
      meta: {
        keepAlive: true, // 添加缓存标识
      },
    },
    {
      path: "/",
      redirect: "/home",
    },
    {
      path: "/profile",
      name: "个人中心",
      component: () => import("../pages/Profile.vue"),
      meta: {
        keepAlive: false,
        requiresAuth: true, // 需要登录才能访问
      },
    },
    {
      path: "/activity",
      name: "activity",
      component: () => import("../pages/activity.vue"),
      meta: {
        keepAlive: true, // 添加缓存标识
      },
    },
    {
      path: "/join",
      name: "join",
      component: () => import("../pages/join.vue"),
      meta: {
        keepAlive: true, // 添加缓存标识
      },
    },
    {
      path: "/contact",
      name: "contact",
      component: () => import("../pages/contact.vue"),
      meta: {
        keepAlive: true, // 添加缓存标识
      },
    },
    {
      path: "/Q&A",
      name: "Q&A",
      component: () => import("../pages/Q&A.vue"),
      meta: {
        keepAlive: true, // 添加缓存标识
      },
    },
    {
      path: "/cos",
      name: "cos",
      component: () => import("../pages/cos.vue"), //路由懒加载
      meta: {
        keepAlive: false, // 不缓存活动页
      },
    },
    {
      path: "/Otadance",
      name: "宅舞",
      component: () => import("../pages/宅舞.vue"),
      meta: {
        keepAlive: false, // 不缓存活动页
      },
    },
    {
      path: "/Video",
      name: "视频",
      component: () => import("../pages/视频.vue"),
      meta: {
        keepAlive: false, // 不缓存活动页
      },
    },
    {
      path: "/Online",
      name: "网络",
      component: () => import("../pages/网络.vue"),
      meta: {
        keepAlive: false, // 不缓存活动页
      },
    },
    {
      path: "/LogiCore",
      name: "活动",
      component: () => import("../pages/活动.vue"),
      meta: {
        keepAlive: false, // 不缓存活动页
      },
    },
    {
      path: "/WOTAArt",
      name: "wota艺",
      component: () => import("../pages/wota艺.vue"),
      meta: {
        keepAlive: false, // 不缓存活动页
      },
    },
    {
      path: "/Bando",
      name: "轻音",
      component: () => import("../pages/轻音.vue"),
      meta: {
        keepAlive: false, // 不缓存活动页
      },
    },
    {
      path: "/Vocaloid",
      name: "v曲",
      component: () => import("../pages/v曲.vue"),
      meta: {
        keepAlive: false, // 不缓存活动页
      },
    },
    {
      path: "/Model",
      name: "模玩",
      component: () => import("../pages/模玩.vue"),
      meta: {
        keepAlive: false, // 不缓存活动页
      },
    },
    {
      path: "/Fictio",
      name: "轻文",
      component: () => import("../pages/轻文.vue"),
      meta: {
        keepAlive: false, // 不缓存活动页
      },
    },
    {
      path: "/Rhythm",
      name: "音游",
      component: () => import("../pages/音游.vue"),
      meta: {
        keepAlive: false, // 不缓存活动页
      },
    },
    {
      path: "/mc",
      name: "mc",
      component: () => import("../pages/mc.vue"),
      meta: {
        keepAlive: false, // 不缓存活动页
      },
    },
    {
      path: "/Touhou",
      name: "东方",
      component: () => import("../pages/东方.vue"),
      meta: {
        keepAlive: false, // 不缓存活动页
      },
    },
    {
      path: "/Pictora",
      name: "宣传",
      component: () => import("../pages/宣传.vue"),
      meta: {
        keepAlive: false, // 不缓存活动页
      },
    },
    {
      path: "/Liaison",
      name: "秘书",
      component: () => import("../pages/秘书.vue"),
      meta: {
        keepAlive: false, // 不缓存活动页
      },
    },
    {
      path: "/Animeka",
      name: "动漫研",
      component: () => import("../pages/动漫研.vue"),
      meta: {
        keepAlive: false, // 不缓存活动页
      },
    },
    {
      path: "/weather",
      name: "weather",
      component: () => import("../pages/weather.vue"), //路由懒加载
    },
    //其他情况跳转到首页
  ],
  scrollBehavior(_to, _from,savedPosition) {
    // 处理浏览器原生返回/前进
    return savedPosition || { top: 0 }
  }
});

// 全局路由守卫，检查登录状态
router.beforeEach((to, from, next) => {
  // 如果路由需要认证
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // 从localStorage获取用户信息
    const userStr = localStorage.getItem('user');
    let isLoggedIn = false;
    
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        isLoggedIn = user.isLoggedIn;
      } catch (e) {
        console.error('解析用户信息失败', e);
      }
    }
    
    if (!isLoggedIn) {
      // 未登录时重定向到首页
      next('/');
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
