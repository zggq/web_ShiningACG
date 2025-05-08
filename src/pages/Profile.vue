<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useUserStore } from "../stores/userStore";
import { usePartListStore } from "../stores/partList";

const userStore = useUserStore();
const partListStore = usePartListStore();
const { partList } = partListStore;

// 用户基本信息
const username = computed(() => userStore.user.username);
const email = computed(() => userStore.user.account);

// 用户信息编辑
const editableUsername = ref(username.value);
const isEditingUsername = ref(false);
const avatarSrc = ref(""); // 默认头像，后续可以从服务器获取
const avatarFile = ref<File | null>(null);
const showAvatarInput = ref(false);

// 部门相关
const userDepartments = ref<string[]>([]);
const showDepartmentSelector = ref(false);

// 登出确认
const showLogoutConfirm = ref(false);

// 修改昵称
const startEditUsername = () => {
  editableUsername.value = username.value;
  isEditingUsername.value = true;
};

const saveUsername = () => {
  if (editableUsername.value.trim()) {
    // 实际应该调用API保存到服务器
    userStore.setUser({
      ...userStore.user,
      username: editableUsername.value,
    });
    isEditingUsername.value = false;
  }
};

const cancelEditUsername = () => {
  isEditingUsername.value = false;
};

// 处理头像上传
const handleAvatarClick = () => {
  showAvatarInput.value = true;
};

const handleAvatarChange = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    avatarFile.value = input.files[0];

    // 预览图片
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target) {
        avatarSrc.value = e.target.result as string;
      }
    };
    reader.readAsDataURL(input.files[0]);

    // 实际项目中这里应该上传头像到服务器并获取URL
  }
  showAvatarInput.value = false;
};

// 部门管理
const toggleDepartment = (departmentName: string) => {
  const index = userDepartments.value.indexOf(departmentName);
  if (index === -1) {
    userDepartments.value.push(departmentName);
  } else {
    userDepartments.value.splice(index, 1);
  }

  // 实际项目中应该调用API保存部门信息
};

// 登出逻辑
const confirmLogout = async () => {
  await userStore.logout();
  showLogoutConfirm.value = false;
  window.location.href = "/"; // 强制跳转到首页
};

// 模拟加载用户数据
onMounted(() => {
  // 模拟从服务器获取所属部门
  // 实际项目中应该调用API获取
  userDepartments.value = []; // 示例数据

  // 设置默认头像
  avatarSrc.value = username.value
    ? `https://ui-avatars.com/api/?name=${encodeURIComponent(
        username.value
      )}&background=random&color=fff`
    : "/default-avatar.png";
});
</script>

<template>
  <div class="profile-page">
    <div class="profile-container">
      <!-- 新增顶部背景区域 -->
      <div class="profile-banner">
        <div class="banner-content">
          <div class="user-avatar" @click="handleAvatarClick">
            <img v-if="avatarSrc" :src="avatarSrc" alt="用户头像" />
            <div v-else class="avatar-fallback">
              {{ username.charAt(0).toUpperCase() }}
            </div>
            <div class="avatar-overlay">点击修改</div>
          </div>
          <h2 class="user-nickname">{{ username }}</h2>
          <input
            v-show="showAvatarInput"
            type="file"
            @change="handleAvatarChange"
            class="hidden-input"
          />
        </div>
      </div>
      <!-- 信息操作区域 -->
    <div class="operation-container">
      <!-- 基本信息卡片 -->
      <div class="info-card">
        <h3 class="card-title"><span class="icon">👤</span>基本信息</h3>
        <div class="info-item">
          <label>昵称：</label>
          <div class="editable-field">
            <span v-if="!isEditingUsername">{{ username }}</span>
            <input v-else v-model="editableUsername" type="text">
            <button class="icon-button" @click="isEditingUsername ? saveUsername() : startEditUsername()">
              {{ isEditingUsername ? '💾' : '✏️' }}
            </button>
            <button v-if="isEditingUsername" class="icon-button cancel" @click="cancelEditUsername">❌</button>
          </div>
        </div>
        <div class="info-item">
          <label>邮箱：</label>
          <span class="email-value">{{ email }}</span>
        </div>
      </div>

      <!-- 安全设置卡片 -->
      <div class="info-card">
        <h3 class="card-title"><span class="icon">🔒</span>账号安全</h3>
        <button class="security-button">
          <span class="icon">🔄</span>修改密码
        </button>
        <button class="security-button">
          <span class="icon">📱</span>绑定手机
        </button>
      </div>

      <!-- 部门管理卡片 -->
      <div class="info-card">
        <h3 class="card-title"><span class="icon">🏛️</span>社团部门</h3>
        <div class="department-management">
          <div class="selected-departments">
            <div v-for="dept in userDepartments" :key="dept" class="department-tag">
              {{ dept }}
              <span class="remove-icon" @click="toggleDepartment(dept)">×</span>
            </div>
            <button class="add-button" @click="showDepartmentSelector = true">
              <span class="icon">➕</span>添加部门
            </button>
          </div>
        </div>
      </div>

      <!-- 操作按钮区域 -->
      <div class="action-buttons">
        <button class="logout-button" @click="showLogoutConfirm = true">
          <span class="icon">🚪</span>退出登录
        </button>
      </div>
    </div>
      <!-- <div class="main-content">
        <div class="sidebar">
          <div class="sidebar-section">
            <div class="section-title">我的主页</div>
            <div class="sidebar-item active">
              <div class="item-icon">📋</div>
              <div class="item-text">基本信息</div>
            </div>
            <div class="sidebar-item">
              <div class="item-icon">🔐</div>
              <div class="item-text">账号安全</div>
            </div>
            <div class="sidebar-item">
              <div class="item-icon">👥</div>
              <div class="item-text">社团部门</div>
            </div>
            <div class="sidebar-item">
              <div class="item-icon">🏅</div>
              <div class="item-text">我的活动</div>
            </div>
            <div class="sidebar-item">
              <div class="item-icon">💫</div>
              <div class="item-text">个性装扮</div>
            </div>
          </div>
          
          <div class="logout-container">
            <button class="logout-btn" @click="showLogoutConfirm = true">退出登录</button>
          </div>
        </div> -->

      <!-- 右侧内容区 -->
      <!-- <div class="content">
          <div class="avatar-section">
            <h3>头像</h3>
            <div class="avatar-container" @click="handleAvatarClick">
              <img v-if="avatarSrc" :src="avatarSrc" alt="用户头像" class="avatar-img" />
              <div v-else class="avatar-text">{{ username.charAt(0).toUpperCase() }}</div>
              <div class="avatar-overlay">
                <span>更换头像</span>
              </div>
            </div>
            <input 
              v-show="showAvatarInput"
              type="file" 
              accept="image/*" 
              ref="avatarInput"
              @change="handleAvatarChange"
              class="hidden-input"
            >
          </div>

          <div class="info-section">
            <h3>基本信息</h3>
            <div class="info-row">
              <div class="info-label">昵称</div>
              <div class="info-value" v-if="!isEditingUsername">
                {{ username }}
                <button class="edit-button" @click="startEditUsername">修改</button>
              </div>
              <div class="edit-form" v-else>
                <input 
                  type="text" 
                  v-model="editableUsername" 
                  class="edit-input"
                >
                <div class="edit-actions">
                  <button class="save-button" @click="saveUsername">保存</button>
                  <button class="cancel-button" @click="cancelEditUsername">取消</button>
                </div>
              </div>
            </div>
            
            <div class="info-row">
              <div class="info-label">邮箱</div>
              <div class="info-value">{{ email }}</div>
            </div>
            
            <div class="info-row">
              <div class="info-label">账号安全</div>
              <div class="info-value">
                <button class="edit-button">修改密码</button>
              </div>
            </div>
          </div>

          <div class="department-section">
            <h3>所属部门</h3>
            <div class="hint-text" v-if="userDepartments.length === 0">
              您当前未加入任何部门，请点击下方按钮添加部门
            </div>
            
            <div class="department-list" v-if="userDepartments.length > 0">
              <div 
                v-for="dept in userDepartments" 
                :key="dept"
                class="department-tag"
              >
                {{ dept }}
                <span class="remove-icon" @click="toggleDepartment(dept)">×</span>
              </div>
            </div>
            
            <button class="add-dept-button" @click="showDepartmentSelector = true">
              <span class="plus-icon">+</span>
              <span>添加部门</span>
            </button>
          </div>
        </div>
      </div> -->

      <!-- 部门选择器弹窗 -->
      <div
        class="modal-overlay"
        v-if="showDepartmentSelector"
        @click.self="showDepartmentSelector = false"
      >
        <div class="modal-container">
          <div class="modal-header">
            <h3>选择部门</h3>
            <button
              class="close-button"
              @click="showDepartmentSelector = false"
            >
              ×
            </button>
          </div>
          <div class="modal-body">
            <div class="department-grid">
              <div
                v-for="dept in partList"
                :key="dept.name"
                class="department-item"
                :class="{ selected: userDepartments.includes(dept.name) }"
                @click="toggleDepartment(dept.name)"
              >
                <span>{{ dept.name }}</span>
                <span
                  class="check-icon"
                  v-if="userDepartments.includes(dept.name)"
                  >✓</span
                >
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button
              class="confirm-button"
              @click="showDepartmentSelector = false"
            >
              确定
            </button>
          </div>
        </div>
      </div>

      <!-- 登出确认弹窗 -->
      <div
        class="modal-overlay"
        v-if="showLogoutConfirm"
        @click.self="showLogoutConfirm = false"
      >
        <div class="modal-container">
          <div class="modal-header">
            <h3>确认退出</h3>
            <button class="close-button" @click="showLogoutConfirm = false">
              ×
            </button>
          </div>
          <div class="modal-body">
            <p class="confirm-text">确定要退出登录吗？</p>
          </div>
          <div class="modal-footer">
            <button class="cancel-button" @click="showLogoutConfirm = false">
              取消
            </button>
            <button class="confirm-button logout" @click="confirmLogout">
              确认退出
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "sass:color";

// 色彩变量
$primary-color: #67d5d8; // 主题蓝绿色
$primary-light: #dcf6f6; // 淡蓝绿色（背景）
$primary-dark: #45c7ca; // 深蓝绿色（悬停）
$bg-color: #f5f9fa; // 背景色
$text-color: #333; // 主文本色
$text-secondary: #666; // 次要文本色
$border-color: #e1e8ea; // 边框颜色
$white: #fff; // 白色
$red: #f56c6c; // 红色（警告/删除）
$gray-light: #f2f6f7; // 浅灰色背景
$shadow: rgba(0, 0, 0, 0.05); // 阴影色

// 全局样式
.profile-page {
  margin: 0;
  padding-top: 95px; // 为顶部导航栏留出空间
  min-height: 100vh;
  background-color: $bg-color;
  font-family: "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
}

.profile-banner {
  width: 100vw;
  height: 50vh;
  background: linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.2)), 
              url('/public/img_nav/背景1.jpg') center/cover;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  .banner-content {
    text-align: center;
    color: white;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
  }

  .user-avatar {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    overflow: hidden;
    margin: 0 auto 20px;
    cursor: pointer;
    position: relative;
    
    img, .avatar-fallback {
      width: 100%;
      height: 100%;
      object-fit: cover;
      background: #67d5d8;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2.5em;
    }

    .avatar-overlay {
      position: absolute;
      bottom: 0;
      width: 100%;
      background: rgba(0,0,0,0.6);
      color: white;
      padding: 8px;
      font-size: 0.9em;
      opacity: 0;
      transition: opacity 0.3s;
    }

    &:hover .avatar-overlay {
      opacity: 1;
    }
  }

  .user-nickname {
    font-size: 2em;
    margin-top: 15px;
  }
}

.operation-container {
  max-width: 1200px;
  margin: -50px auto 0;
  padding: 0 20px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 25px;
  position: relative;
  z-index: 1;
}

.info-card {
  background: white;
  border-radius: 15px;
  padding: 25px;
  box-shadow: 0 8px 20px rgba(0,0,0,0.1);
  transition: transform 0.3s;

  &:hover {
    transform: translateY(-5px);
  }

  .card-title {
    font-size: 1.3em;
    margin-bottom: 1.5em;
    display: flex;
    align-items: center;
    
    .icon {
      margin-right: 10px;
    }
  }
}

.info-item {
  margin-bottom: 1.2em;
  
  label {
    color: #666;
    margin-right: 10px;
  }

  .editable-field {
    display: flex;
    align-items: center;
    gap: 10px;

    input {
      flex: 1;
      border: 1px solid #ddd;
      border-radius: 4px;
      padding: 6px 10px;
    }
  }
}

.icon-button {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2em;
  padding: 5px;
  
  &.cancel {
    color: #ff4444;
  }
}

.department-management {
  .selected-departments {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }

  .department-tag {
    background: #e3f7f7;
    color: #2db7b9;
    padding: 6px 15px;
    border-radius: 15px;
    display: flex;
    align-items: center;
    
    .remove-icon {
      margin-left: 8px;
      cursor: pointer;
      font-weight: bold;
    }
  }

  .add-button {
    background: none;
    border: 2px dashed #67d5d8;
    color: #67d5d8;
    padding: 8px 15px;
    border-radius: 15px;
    cursor: pointer;
    
    &:hover {
      background: #f5fdfd;
    }
  }
}

.action-buttons {
  grid-column: 1 / -1;
  text-align: center;
  margin-top: 30px;

  .logout-button {
    background: #ff4444;
    color: white;
    padding: 12px 35px;
    border-radius: 25px;
    border: none;
    cursor: pointer;
    transition: background 0.3s;
    
    &:hover {
      background: #cc0000;
    }
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .operation-container {
    margin-top: -30px;
    grid-template-columns: 1fr;
  }
  
  .profile-banner {
    height: 40vh;
    
    .user-avatar {
      width: 100px;
      height: 100px;
    }
    
    .user-nickname {
      font-size: 1.5em;
    }
  }
}



// 主内容区布局
.main-content {
  display: flex;
  gap: 20px;
}

// 侧边栏
.sidebar {
  width: 200px;
  flex-shrink: 0;
  background-color: $white;
  border-radius: 10px;
  box-shadow: 0 2px 10px $shadow;
  padding: 15px 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: fit-content;
}

.sidebar-section {
  margin-bottom: 20px;

  .section-title {
    padding: 0 20px;
    margin-bottom: 10px;
    font-size: 15px;
    color: $text-secondary;
  }
}

.sidebar-item {
  display: flex;
  align-items: center;
  padding: 10px 20px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: $primary-light;
  }

  &.active {
    background-color: $primary-light;
    color: $primary-color;
    font-weight: 500;
  }

  .item-icon {
    margin-right: 10px;
    font-size: 16px;
  }

  .item-text {
    font-size: 14px;
  }
}

.logout-container {
  margin-top: auto;
}

.logout-btn {
  display: flex;
  align-items: center;
  width: 100%;
  background-color: transparent;
  border: none;
  color: $text-color;
  padding: 10px 20px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 14px;
  text-align: left;

  &:hover {
    background-color: rgba($red, 0.1);
    color: $red;
  }

  &::before {
    content: "🚪";
    margin-right: 10px;
    font-size: 16px;
  }
}

// 内容区
.content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.avatar-section,
.info-section,
.department-section {
  background-color: $white;
  border-radius: 10px;
  box-shadow: 0 2px 10px $shadow;
  padding: 20px;

  h3 {
    font-size: 16px;
    font-weight: 500;
    margin: 0 0 20px;
    color: $text-color;
    border-bottom: 1px solid $border-color;
    padding-bottom: 10px;
  }
}

// 头像区域
.avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;

  .avatar-container {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    overflow: hidden;
    position: relative;
    cursor: pointer;
    box-shadow: 0 2px 8px $shadow;

    .avatar-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .avatar-text {
      width: 100%;
      height: 100%;
      background-color: $primary-color;
      color: $white;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 36px;
      font-weight: 500;
    }

    .avatar-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      color: $white;
      display: flex;
      justify-content: center;
      align-items: center;
      opacity: 0;
      transition: opacity 0.3s;

      span {
        font-size: 12px;
      }
    }

    &:hover .avatar-overlay {
      opacity: 1;
    }
  }
}

// 信息区域
.info-row {
  display: flex;
  margin-bottom: 15px;

  &:last-child {
    margin-bottom: 0;
  }

  .info-label {
    width: 80px;
    color: $text-secondary;
    font-size: 14px;
    padding-top: 6px;
    flex-shrink: 0;
  }

  .info-value {
    flex: 1;
    display: flex;
    align-items: center;
    font-size: 14px;
  }

  .edit-form {
    flex: 1;

    .edit-input {
      width: 100%;
      max-width: 250px;
      border: 1px solid $border-color;
      border-radius: 4px;
      padding: 6px 10px;
      font-size: 14px;

      &:focus {
        border-color: $primary-color;
        outline: none;
      }
    }

    .edit-actions {
      margin-top: 10px;
      display: flex;
      gap: 10px;
    }
  }
}

// 按钮样式
.edit-button {
  margin-left: 15px;
  background-color: $primary-light;
  color: $primary-color;
  border: none;
  border-radius: 4px;
  padding: 4px 8px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: color.adjust($primary-light, $lightness: -5%);
  }
}

.save-button,
.confirm-button {
  background-color: $primary-color;
  color: $white;
  border: none;
  border-radius: 4px;
  padding: 6px 12px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: $primary-dark;
  }

  &.logout {
    background-color: $red;

    &:hover {
      background-color: color.adjust($red, $lightness: -10%);
    }
  }
}

.cancel-button {
  background-color: #f7f7f7;
  color: $text-secondary;
  border: 1px solid $border-color;
  border-radius: 4px;
  padding: 6px 12px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: #f0f0f0;
  }
}

// 部门管理
.department-section {
  .hint-text {
    color: $text-secondary;
    font-size: 14px;
    margin-bottom: 15px;
  }
}

.department-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 15px;
}

.department-tag {
  display: flex;
  align-items: center;
  background-color: $primary-light;
  color: $primary-color;
  border-radius: 15px;
  padding: 5px 12px;
  font-size: 12px;

  .remove-icon {
    margin-left: 6px;
    font-weight: bold;
    cursor: pointer;

    &:hover {
      color: $red;
    }
  }
}

.add-dept-button {
  display: inline-flex;
  align-items: center;
  background-color: $white;
  border: 1px dashed $primary-color;
  color: $primary-color;
  border-radius: 6px;
  padding: 6px 12px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;

  .plus-icon {
    margin-right: 5px;
    font-weight: bold;
  }

  &:hover {
    background-color: $primary-light;
  }
}

// 模态框样式
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-container {
  background-color: $white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  width: 90%;
  max-width: 400px;
  animation: modalFadeIn 0.25s;
}

@keyframes modalFadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-header {
  padding: 15px 20px;
  border-bottom: 1px solid $border-color;
  display: flex;
  justify-content: space-between;
  align-items: center;

  h3 {
    margin: 0;
    font-size: 16px;
    font-weight: 500;
    border: none;
    padding: 0;
  }

  .close-button {
    background: none;
    border: none;
    font-size: 18px;
    cursor: pointer;
    color: #999;

    &:hover {
      color: $text-color;
    }
  }
}

.modal-body {
  padding: 20px;

  .confirm-text {
    margin: 0;
    text-align: center;
    font-size: 15px;
  }
}

.modal-footer {
  padding: 0 20px 20px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

// 部门选择器网格
.department-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;

  .department-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 12px;
    border: 1px solid $border-color;
    border-radius: 6px;
    cursor: pointer;
    font-size: 13px;
    transition: all 0.2s;

    &:hover {
      border-color: $primary-color;
      background-color: $primary-light;
    }

    &.selected {
      background-color: $primary-light;
      border-color: $primary-color;
      color: $primary-color;
    }

    .check-icon {
      color: $primary-color;
      font-weight: bold;
    }
  }
}

.hidden-input {
  display: none;
}

// 响应式布局
@media (max-width: 768px) {
  .main-content {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
  }

  .department-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .info-row {
    flex-direction: column;

    .info-label {
      width: 100%;
      margin-bottom: 5px;
    }
  }
}

@media (max-width: 480px) {
  .department-grid {
    grid-template-columns: 1fr;
  }
}
</style>
