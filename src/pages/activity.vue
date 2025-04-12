<template>
  <Show :information="activityInfo"></Show>
</template>

<script setup lang="ts">
import { ref } from "vue";
import Show from "../components/Show.vue";
interface Activity {
  name: string;
  info: string;
  img: string[];
}
const activityInfo = ref<Activity[]>([
  {
    name: "绘画大赛",
    info: "ShiningACG绘画大赛在每年的十一月份举行，旨在为校内热爱绘画的同学提供一个展示自我、交流技艺的平台，比赛分为板绘与手绘两个版块，每个版块单独评选。并且设有丰厚的奖品，以表彰和鼓励那些才华横溢、创意无限的绘画爱好者。如果你热爱绘画，渴望在画布上挥洒自我，展现独特的艺术魅力，那么千万不要错过这场盛宴！",
    img: [
      "/img_activity/绘画大赛/24/1.jpg",
      "/img_activity/绘画大赛/24/2.jpg",
      "/img_activity/绘画大赛/23/1.jpg",
      "/img_activity/绘画大赛/23/2.jpg",
      "/img_activity/绘画大赛/23/3.jpg",
    ],
  },
  {
    name: "晒你纪",
    info: "晒你纪”是我们社团一年中规模最大的活动，面向全校师生，通常在每年的5月份举行。自14年来已成功举办了八届，吸引了众多参与者和观众。活动现场设有各种游玩摊位，精彩节目和丰富的礼品赠送。为了保证活动的顺利进行，我们会在寒假期间开始筹备。参展的摊位和活动项目以及节目内容都由我们社团的成员自行策划和完成。同时，参与者还有机会与其他学校的动漫社的同学互动交流。晒你祭本质为校内漫展，全过程由社员共同完成。漫展期间，有精彩的舞台表演、coser演出，参加各摊位活动更能获得奖品。如果你有想法想要在活动中展示，那就快来加入我们吧，让我们一起准备这场精彩的“晒你纪”活动！",
    img: [
      "/img_activity/晒你纪/24/1.jpg",
      "/img_activity/晒你纪/24/2.jpg",
      "/img_activity/晒你纪/23/1.png",
      "/img_activity/晒你纪/23/2.png",
      "/img_activity/晒你纪/23/3.png",
      "/img_activity/晒你纪/23/4.png",
    ],
  },
  {
    name: "部室（活动室）",
    info: "社团部室位于大学生活动中心524室，是社团成员的主要线下活动场所，如果想与社团建立更深的羁绊的话，记得多来部室线下交（da）流（pai）哦。部室内藏有大量轻小说、漫画，亦有各类桌游、音游机，喜欢和同好们线下交流的小伙伴不要忘记来玩哦~",
    img: [
      "/img_activity/部室/1.jpg",
      "/img_activity/部室/2.png",
      "/img_activity/部室/3.jpg",
    ],
  },
]);
</script>

<style scoped></style>
