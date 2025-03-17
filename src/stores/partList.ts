import { defineStore } from "pinia";
import { ref } from "vue";
export const usePartListStore = defineStore("partList", () => {
  const partList = ref<string[]>([
    '宣传',
    "视频",
    "宅舞",
    "轻音",
    "活动",
    "动漫研",
    "cos",
    "V曲",
    "网络",
    "模玩",
    "轻文",
    "音游",
    "mc",
    'WOTA艺',
    '秘书',
    '东方',
  ]);
  return { partList };
});