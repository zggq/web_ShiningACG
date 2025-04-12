<template>
  <div class="qa-container">
    <div
      v-for="(item, index) in qaList"
      :key="index"
      class="qa-card"
      @click="toggleCard(index)"
    >
      <div class="question">
        <span class="q-mark">Q:</span>
        <span>{{ item.question }}</span>
        <span
          :ref="(el) => (arrowRefs[index] = el  as HTMLElement)"
          class="arrow"
          >▼</span
        >
      </div>
      <div class="answer" :class="{ collapsed: !expandedStates[index] }">
        <span class="a-mark">A：</span>
        <div class="answer-content">{{ item.answer }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface QAItem {
  question: string;
  answer: string;
}
import gsap from "gsap";
import { ref, onMounted } from "vue";
const qaList = ref<QAItem[]>([
  {
    question: "动漫社是干什么的？",
    answer:
      "社团宗旨是“以漫会友”，我们为喜爱泛ACG文化的同学们提供一个结识、交流的平台，之后就是大家各自施展能力的时候了。除开由社团组织各个部门的周常活动及全社团的大型外场以外，社员们可以在公共开放时间的活动室内自由进行各项线下交流，包括但不限于游戏、漫画、桌游、编程等。",
  },
  {
    question: "ID怎么设置？",
    answer:
      "本社团在一切活动及其它形式的交流中均不需要年级、学院、专业、真实姓名等信息，使用ID（类似于网名）相称。同时，鼓励各位新人在自己的ID后添加自己感兴趣的内容，如：御坂美琴（追番/补番/电击文库），便于寻找同好、互相交流。",
  },
  {
    question: "社团有哪些日常活动/有多少部门/各个部门平时都在做什么？",
    answer:
      "可参见部门介绍，内有各个部门的职能、日常活动及活动时间。欢迎各位新人根据自己的兴趣加入对应的部门。另外，没有技术基础没关系，只要乐于学习、能够坚持，我们欢迎大家加入各个部门，从零开始协同成长。",
  },
  {
    question:
      "你们说的部门，为什么报名选部门的时候没有啊/到哪儿找玩xxx的大佬啊？",
    answer:
      "社团目前有八个官方部门：活动部、宣传部、轻音部、模玩部、轻文部、COS部、宅舞部以及秘书处。而这八个以外的“部门”，有些是以社团名义进行实业的兴趣组织（如汉化部、网络部、MC组等），也有一些是因为相同的爱好聚到一起的组织（如手游交流群、各个端游(如FF14)的交流群）。这些组织就不需要正式报名，完全凭借兴趣加入/退出，加入时联系相关组织内的成员就可以啦！",
  },
  {
    question: "怎么就撤回我消息了/你怎么禁言我啊/我刚才说什么了？",
    answer:
      "事出皆有因，被管理员处理了，一定是因为你的发言触犯了群规（如：政治话题、工口话题、真相话题以及其他不适言论，具体请看群文件内群规）在文化建设方面，我们“法无禁止即自由”；但是在人事管理方面，我们“法无准许即禁止”。",
  },
  {
    question: "加完群之后干什么呀？",
    answer:
      "请耐心等待暑假假期后的2023-2024学年社团全员见面会~在见面会上我们会对各个部门的职能、工作等做更加详细的介绍，然后本学年的社团工作就正式开始啦~（撒花）见面会的时间和地点之后将于群公告中发布！",
  },
]);
const arrowRefs = ref<HTMLElement[]>([]);
const arrowAnimations = ref<{ [key: number]: gsap.core.Tween }>({});
// 使用数组保存每个卡片的展开状态
const expandedStates = ref<boolean[]>(qaList.value.map(() => false));
const toggleCard = (index: number) => {
  expandedStates.value[index] = !expandedStates.value[index];
  // 执行GSAP动画
  console.log(arrowAnimations.value[index]);
  
  if (expandedStates.value[index]) {
    arrowAnimations.value[index].play();
  } else {
    arrowAnimations.value[index].reverse();
  }
};
onMounted(() => {
  // 初始化箭头动画
  qaList.value.forEach((_, index) => {
    if (arrowRefs.value[index]) {
      arrowAnimations.value[index] = gsap.to(arrowRefs.value[index], {
        rotation: 180,
        duration: 0.3,
        paused: true,
        ease: "'elastic.out(1, 0.5)",
      });
    }
  });
});
</script>

<style scoped>
/* 容器布局 */
.qa-container {
  max-width: 800px;
  margin: 0 auto;
  padding-top: 15vh;
  user-select: none;
}

/* 卡片样式 */
.qa-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  transition: transform 0.3s ease;
  cursor: pointer;
}

.qa-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
}

/* 问题样式 */
.question {
  color: #091521;
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 1rem;
  position: relative;
  padding-left: 2rem;
  font-family: "Firstfont";
}

.q-mark {
  color: #409eff;
  position: absolute;
  left: 0;
  font-weight: 700;
}
.arrow {
  display: inline-block;
  transform-box: fill-box;
  will-change: transform;
}
/* 回答样式 */
.answer {
  color: #2c2828;
  line-height: 1.3;
  padding-left: 2rem;
  position: relative;
  font-family: "幼圆";
  font-size: 1.5rem;
  transition: max-height 0.3s ease;
  overflow: hidden;
}
.collapsed {
  max-height: 0;
  margin-bottom: 0;
}
.a-mark {
  color: #ce3838;
  position: absolute;
  left: 0;
  font-weight: 800;
  font-family: "Firstfont";
}

/* 响应式设计 */
@media (max-width: 768px) {
  .qa-container {
    padding: 1rem;
    padding-top: 15vh;
  }

  .question {
    font-size: 1.1rem;
  }

  .answer {
    font-size: 0.95rem;
  }
}
</style>
