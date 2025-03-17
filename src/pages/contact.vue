<template>
  <div class="contact-container">
    <!-- 问题反馈区块 -->
    <div class="feedback-section">
      <form @submit.prevent="handleSubmit" class="feedback-form">
        <h2 class="section-title">问题反馈</h2>
        <div class="form-group">
          <label>问题类型</label>
          <select v-model="feedbackType" required>
            <option value="bug">网站故障</option>
            <option value="flex_err">布局错误</option>
            <option value="suggestion">改进建议</option>
            <option value="other">其他问题</option>
          </select>
        </div>
        <div class="form-group">
          <label>问题描述</label>
          <textarea v-model="feedbackContent" required rows="4"></textarea>
        </div>
        <button type="submit" :disabled="isSubmitting" class="submit-btn">
          {{ isSubmitting ? "提交中..." : "提交反馈" }}
        </button>
      </form>
    </div>

    <!-- 联系方式区块 -->
    <div class="contact-methods">
      <div class="contact-card" @click="copyText('715016610')">
        <i class="fab fa-qq"></i>
        <div>
          <p>社团官方QQ群:</p>
          <p>715016610</p>
        </div>
        <div class="tooltip">点击复制</div>
      </div>
      <div class="contact-card" @click="copyText('2604101517@qq.com')">
        <i class="fas fa-envelope"></i>
        <div>
          <p>站长邮箱：</p>
          <p>2604101517@qq.com</p>
        </div>
        <div class="tooltip">点击复制</div>
      </div>
      <div class="contact-card" style="cursor: default">
        <i class="fas fa-map-marker-alt"></i>
        <div>
          <p>活动室地址:</p>
          <p>大学生活动中心524室</p>
          <p>开放时间: 每天14:00-22:00</p>
        </div>
      </div>
    </div>

    <!-- 社交矩阵区块 -->

    <div class="social-section">
      <h3 class="subtitle">关注我们的社交媒体</h3>
      <div class="social-grid">
        <a
          href="https://space.bilibili.com/30032438"
          target="_blank"
          class="social-link bilibili"
        >
          <img
            src="/icon/bilibili.jpg"
            alt="哔哩哔哩图标"
            style="margin: 0 5px 0 0"
          />
          <span>哔哩哔哩</span>
        </a>
      </div>
    </div>

    <!-- 友情链接 -->
    <div class="partner-links">
      <h3 class="subtitle">友情链接</h3>
      <div class="logo-wall">
        <a href="https://www.xidian.edu.cn/" target="_blank"
          ><img src="/icon/xd.jpg" alt="学校官网"
        /></a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useClipboard } from "@vueuse/core";
const { copy } = useClipboard();

// 反馈表单逻辑
const feedbackType = ref("bug");
const feedbackContent = ref("");
const isSubmitting = ref(false);

const handleSubmit = async () => {
  isSubmitting.value = true;
  try {
    // 这里添加实际提交逻辑
    await new Promise((resolve) => setTimeout(resolve, 1000));
    alert("提交成功！感谢您的反馈");
    feedbackContent.value = "";
  } finally {
    isSubmitting.value = false;
  }
};

// 复制功能
const copyText = (text: string) => {
  copy(text);
  alert("已复制到剪贴板");
};
</script>

<style scoped>
.contact-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  font-family: "Firstfont";
}

.section-title {
  color: #2c3e50;
  font-size: 2rem;
  text-align: center;
  margin: 2rem 0;
}

/* 反馈表单样式 */
.feedback-form {
  background: white;
  padding: 5vh 2rem 2rem 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 700px;
  margin: 0 auto;
}

.form-group {
  margin-bottom: 1.5rem;
}
.form-group label {
  font-size: 1.6rem;
  font-family: "隶书";
  display: block;
  margin-bottom: 0.5rem;
}

select,
textarea {
  width: 90%;
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
}

.submit-btn {
  background: #ce3838;
  color: white;
  padding: 0.8rem 2rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: opacity 0.3s;
  font-family: "Firstfont";
  font-size: 1.4rem;
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* 联系方式卡片 */
.subtitle {
  font-size: 1.8rem;
}
.contact-methods {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin: 3rem 0;
  font-size: 1.4rem;
}

.contact-card {
  background: white;
  padding: 1.5rem;
  border-radius: 18px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 1rem;
  position: relative;
  cursor: pointer;
  transition: transform 0.3s;
}

.contact-card:hover {
  transform: translateY(-5px);
}

.contact-card i {
  font-size: 2rem;
  color: #ce3838;
}

.tooltip {
  position: absolute;
  top: 90px;
  right: 25px;
  background: rgba(15, 136, 210);
  color: white;
  padding: 4px 8px;
  border-radius: 14px;
  opacity: 0;
  transition: opacity 0.3s;
}

.contact-card:hover .tooltip {
  opacity: 1;
}

/* 社交媒体 */
.social-grid {
  display: flex;
  justify-content: flex-start;
  margin: 0 20px;
  gap: 2rem;
  flex-wrap: wrap;
}

.social-link {
  display: flex;
  align-items: center;
  padding: 1rem 2rem;
  border-radius: 8px;
  color: black;
  text-decoration: none;
  transition: transform 0.3s;
}

.social-link:hover {
  transform: scale(1.05);
}

.bilibili {
  background: rgb(200, 224, 228);
}

/* 友情链接 */
.logo-wall {
  display: flex;
  justify-content: center;
  gap: 3rem;
  flex-wrap: wrap;
}

.logo-wall img {
  height: 60px;
  opacity: 0.8;
  transition: opacity 0.3s;
}

.logo-wall img:hover {
  opacity: 1;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .contact-container {
    padding: 1rem;
  }

  .contact-methods {
    grid-template-columns: 1fr;
  }
}
</style>
