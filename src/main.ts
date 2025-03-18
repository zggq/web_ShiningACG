import "./styles/style.css";//加载字体
import { createApp } from "vue";
import router from "./router";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate"; //导入pinia-plugin-persistedstate
import App from "./App.vue";
import VueLazyload from "vue-lazyload";

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

createApp(App)
  .use(pinia)
  .use(router)
  .use(VueLazyload, {
    loading: "/icon/loading.gif", // 占位符图片
    error: "/icon/error.png", // 错误图片
  })
  .mount("#app");
