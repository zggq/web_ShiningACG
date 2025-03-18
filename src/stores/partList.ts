import { defineStore } from "pinia";
import { ref } from "vue";
interface PartList {
  name: string;
  path: string;
}
export const usePartListStore = defineStore("partList", () => {
  const partList = ref<PartList[]>([
    { name: "宣传", path: "/Pictora" },//Pict-（拉丁语 "绘画"）+ -ora（日式英语后缀，如 Animeora = 动画天地）
    { name: "视频", path: "/Video" },
    { name: "宅舞", path: "/Otadance" },// Otaku+Dance，日式英语典型构词
    { name: "轻音", path: "/Bando" },//Band（乐队）+ -dō（日语 "道"，如 Kendō= 剑道）
    { name: "活动", path: "/LogiCore" },//Logi-（Logistics 后勤缩写）+ -Core（核心）
    { name: "动漫研", path: "/Animeka" },// Anime + 日语 "科"（ka），仿学术后缀（如 Kagaku = 科学）
    { name: "cos", path: "/cos" },
    { name: "V曲", path: "/Vocaloid" },
    { name: "网络", path: "/Online" },
    { name: "模玩", path: "/Model" },
    { name: "轻文", path: "/Fictio" },//Fiction+Action，聚焦轻小说的虚构世界构建
    { name: "音游", path: "/Rhythm" },
    { name: "mc", path: "/mc" },
    { name: "WOTA艺", path: "/WOTAArt" },
    { name: "秘书", path: "/Liaison" },
    { name: "东方", path: "/Touhou" },
  ]);
  return { partList };
});
