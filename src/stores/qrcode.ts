import { defineStore } from "pinia";
interface Department {
  name: string;
  qrcode: string;
}
export const useQrcodeStore = defineStore("qrcode", () => {
  const officialDepartments = [
    { name: "宣传部", qrcode: "/img_part/二维码/official/1.jpg" },
    { name: "视频组", qrcode: "/img_part/二维码/official/2.jpg" },
    { name: "宅舞部", qrcode: "/img_part/二维码/official/3.jpg" },
    { name: "轻音部", qrcode: "/img_part/二维码/official/4.jpg" },
    { name: "活动部", qrcode: "/img_part/二维码/official/5.jpg" },
    { name: "动漫研", qrcode: "/img_part/二维码/official/6.jpg" },
    { name: "cos部", qrcode: "/img_part/二维码/official/7.jpg" },
    { name: "V曲组", qrcode: "/img_part/二维码/official/8.jpg" },
    { name: "网络部", qrcode: "/img_part/二维码/official/9.jpg" },
    { name: "模玩部", qrcode: "/img_part/二维码/official/10.jpg" },
    { name: "轻文部", qrcode: "/img_part/二维码/official/11.jpg" },
    { name: "音游部", qrcode: "/img_part/二维码/official/12.jpg" },
    { name: "Minecraft组", qrcode: "/img_part/二维码/official/13.jpg" },
    { name: "WOTA艺组", qrcode: "/img_part/二维码/official/14.jpg" },
    { name: "秘书处", qrcode: "/img_part/二维码/official/15.jpg" },
    { name: "东方组", qrcode: "/img_part/二维码/official/16.jpg" },
  ] as Department[];
  const informalDepartments = [
    { name: "fgo养生群", qrcode: "/img_part/二维码/informal/1.jpg" },
    { name: "GalGame交流群", qrcode: "/img_part/二维码/informal/2.jpg" },
    { name: "GGST交流群", qrcode: "/img_part/二维码/informal/3.jpg" },
    { name: "limbus company", qrcode: "/img_part/二维码/informal/4.jpg" },
    { name: "宝可梦交流群", qrcode: "/img_part/二维码/informal/5.jpg" },
    { name: "尘白禁区交流群", qrcode: "/img_part/二维码/informal/6.jpg" },
    { name: "汉化部", qrcode: "/img_part/二维码/informal/7.jpg" },
    {
      name: "红烧天堂(炽焰天穹)交流群",
      qrcode: "/img_part/二维码/informal/8.jpg",
    },
    { name: "魂系同好会", qrcode: "/img_part/二维码/informal/9.jpg" },
    { name: "鸣潮漂流群", qrcode: "/img_part/二维码/informal/10.jpg" },
    { name: "忍者アカデミー", qrcode: "/img_part/二维码/informal/11.jpg" },
    { name: "赛马同好会", qrcode: "/img_part/二维码/informal/12.jpg" },
    { name: "晒你DOTA2群", qrcode: "/img_part/二维码/informal/13.jpg" },
    { name: "晒你手游总群", qrcode: "/img_part/二维码/informal/14.jpg" },
    { name: "绳网总网晒你分网", qrcode: "/img_part/二维码/informal/15.jpg" },
    { name: "泰拉失智人聚集地", qrcode: "/img_part/二维码/informal/16.jpg" },
    { name: "特摄群", qrcode: "/img_part/二维码/informal/17.jpg" },
    {
      name: "蔚（碧）蓝档案交流群",
      qrcode: "/img_part/二维码/informal/18.jpg",
    },
    { name: "西电战雷黑奴群", qrcode: "/img_part/二维码/informal/19.jpg" },
    { name: "小主姬", qrcode: "/img_part/二维码/informal/20.jpg" },
    { name: "应急食物储备仓", qrcode: "/img_part/二维码/informal/21.jpg" },
    {
      name: "有小加加那有没有小小加加",
      qrcode: "/img_part/二维码/informal/22.jpg",
    },
    { name: "战双帕弥什交流群", qrcode: "/img_part/二维码/informal/23.jpg" },
  ] as Department[];
  return { officialDepartments, informalDepartments };
});
