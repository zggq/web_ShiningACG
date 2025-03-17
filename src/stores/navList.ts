import { defineStore } from "pinia";
import { ref } from "vue";
interface NavList {
  name: string;
  path: string;
}
export const useNavListStore = defineStore("navList", () => {
  const navList = ref<NavList[]>([
    { name: "首页", path: "/home" },
    { name: "部门介绍", path: "/" },
    { name: "社团活动", path: "/activity" },
    { name: "加入我们", path: "/join" },
    { name: "联系我们", path: "/contact" },
    { name: "Q&A", path: "/Q&A" },
  ]);
  return { navList };
});
