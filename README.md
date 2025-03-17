本项目技术栈：Vue 3 + TypeScript + Vite + Pinia + Vue-Router + Gsap

1.复杂动画系统设计（Logo_frame.vue）
实现星系轨道旋转动画系统
支持动态内外圈布局算法
智能方向感知的气泡卡片定位系统

2.性能优化（Background.vue）
使用will-change优化CSS动画性能
实现光圈动画的随机路径生成算法
动态模糊与颜色混合效果优化
使用vue-lazyload实现图片的懒加载，同时配置占位符、错误图懒加载选项
使用srcset和sizes实现图片自适应加载
使⽤ keep-alive 对整个⻚⾯进⾏缓存，⽀持多级嵌套⻚⾯

3.路由架构设计
使用Vue-Router完成路由架构设计
配置16+路由的懒加载策略

4.模块依赖管理
基于pnpm采⽤monorepo的⽅式来对代码进⾏管理、持久化保持设置。