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
      path: "/宅舞",
      name: "宅舞",
      component: () => import("../pages/宅舞.vue"),
      meta: {
        keepAlive: false, // 不缓存活动页
      },
    },
    {
      path: "/视频",
      name: "视频",
      component: () => import("../pages/视频.vue"),
      meta: {
        keepAlive: false, // 不缓存活动页
      },
    },
    {
      path: "/网络",
      name: "网络",
      component: () => import("../pages/网络.vue"),
      meta: {
        keepAlive: false, // 不缓存活动页
      },
    },
    {
      path: "/活动",
      name: "活动",
      component: () => import("../pages/活动.vue"),
      meta: {
        keepAlive: false, // 不缓存活动页
      },
    },
    {
      path: "/wota艺",
      name: "wota艺",
      component: () => import("../pages/wota艺.vue"),
      meta: {
        keepAlive: false, // 不缓存活动页
      },
    },
    {
      path: "/轻音",
      name: "轻音",
      component: () => import("../pages/轻音.vue"),
      meta: {
        keepAlive: false, // 不缓存活动页
      },
    },
    {
      path: "/v曲",
      name: "v曲",
      component: () => import("../pages/v曲.vue"),
      meta: {
        keepAlive: false, // 不缓存活动页
      },
    },
    {
      path: "/模玩",
      name: "模玩",
      component: () => import("../pages/模玩.vue"),
      meta: {
        keepAlive: false, // 不缓存活动页
      },
    },
    {
      path: "/轻文",
      name: "轻文",
      component: () => import("../pages/轻文.vue"),
      meta: {
        keepAlive: false, // 不缓存活动页
      },
    },
    {
      path: "/音游",
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
      path: "/东方",
      name: "东方",
      component: () => import("../pages/东方.vue"),
      meta: {
        keepAlive: false, // 不缓存活动页
      },
    },
    {
      path: "/宣传",
      name: "宣传",
      component: () => import("../pages/宣传.vue"),
      meta: {
        keepAlive: false, // 不缓存活动页
      },
    },
    {
      path: "/秘书",
      name: "秘书",
      component: () => import("../pages/秘书.vue"),
      meta: {
        keepAlive: false, // 不缓存活动页
      },
    },
    {
      path: "/动漫研",
      name: "动漫研",
      component: () => import("../pages/动漫研.vue"),
      meta: {
        keepAlive: false, // 不缓存活动页
      },
    },
    //其他情况跳转到首页
  ],
});

export default router;
