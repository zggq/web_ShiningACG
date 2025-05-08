<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useUserStore } from '../stores/userStore';

const emit = defineEmits(['close', 'login-success']);
const isLogin = ref(true); // true为登录界面，false为注册界面
const loading = ref(false);

const userStore = useUserStore();

const loginForm = reactive({
  account: '',
  password: ''
});

const registerForm = reactive({
  nickname: '',
  account: '',
  password: '',
  confirmPassword: ''
});

const loginErrorMsg = ref('');
const registerErrorMsg = ref('');

const switchMode = () => {
  isLogin.value = !isLogin.value;
  loginErrorMsg.value = '';
  registerErrorMsg.value = '';
};

const handleLogin = async () => {
  // 基础验证
  if (!loginForm.account || !loginForm.password) {
    loginErrorMsg.value = '请填写完整信息';
    return;
  }
  
  // 邮箱格式验证
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(loginForm.account)) {
    loginErrorMsg.value = '请输入有效的邮箱地址';
    return;
  }
  
  loading.value = true;
  try {
    // 记录请求参数以便调试
    const requestBody = {
      account: loginForm.account.trim(),
      password: loginForm.password
    };
    console.log('登录请求参数:', requestBody);
    
    // 实际登录请求
    const response = await fetch('https://d1-tutorial.2604101517.workers.dev/proxy/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });
    
    // 尝试读取响应数据
    let data;
    try {
      data = await response.json();
      console.log('登录响应:', data);
    } catch (e) {
      console.error('解析响应失败:', e);
      data = { message: '服务器响应格式错误' };
    }
    
    if (!response.ok) {
      // 提取更详细的错误信息
      const errorMessage = data.message || 
                           (response.status === 400 ? '请求参数格式不正确' : '登录失败');
      throw new Error(errorMessage);
    }
    
    // 检查响应格式
    if (!data.data || !data.data.token) {
      throw new Error('登录成功但未返回令牌，请稍后重试');
    }
    
    // 保存token和用户信息
    const userData = data.data;
    localStorage.setItem('token', userData.token);
    
    // 存储用户信息
    userStore.setUser({
      account: userData.account,
      isLoggedIn: true,
      username: userData.nickname
    });
    
    console.log('已设置用户信息，当前store状态:', userStore.user);
    
    // 发送登录成功事件
    emit('login-success');
    // 关闭模态框
    emit('close');
  } catch (error) {
    console.error('登录错误:', error);
    loginErrorMsg.value = error instanceof Error ? error.message : '登录失败，请重试';
  } finally {
    loading.value = false;
  }
};

const handleRegister = async () => {
  // 基础验证
  if (!registerForm.nickname || !registerForm.account || !registerForm.password || !registerForm.confirmPassword) {
    registerErrorMsg.value = '请填写完整信息';
    return;
  }
  
  // 密码匹配验证
  if (registerForm.password !== registerForm.confirmPassword) {
    registerErrorMsg.value = '两次密码输入不一致';
    return;
  }
  
  // 邮箱格式验证
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(registerForm.account)) {
    registerErrorMsg.value = '请输入有效的邮箱地址';
    return;
  }
  
  // 密码长度验证
  if (registerForm.password.length < 6) {
    registerErrorMsg.value = '密码长度至少为6位';
    return;
  }
  
  loading.value = true;
  try {
    // 记录请求参数以便调试
    const requestBody = {
      nickname: registerForm.nickname.trim(),
      account: registerForm.account.trim(),
      password: registerForm.password
    };
    console.log('注册请求参数:', requestBody);
    
    // 实际注册请求
    const response = await fetch('https://d1-tutorial.2604101517.workers.dev/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });
    
    // 尝试读取响应数据
    let data;
    try {
      data = await response.json();
      console.log('注册响应:', data);
    } catch (e) {
      console.error('解析响应失败:', e);
      data = { message: '服务器响应格式错误' };
    }
    
    if (!response.ok) {
      // 提取更详细的错误信息
      const errorMessage = data.message || 
                           (response.status === 400 ? '请求参数格式不正确' : '注册失败');
      throw new Error(errorMessage);
    }
    
    // 检查是否注册成功并返回了用户数据
    if (data.data && data.data.token) {
      // 保存token
      localStorage.setItem('token', data.data.token);
      
      // 注册成功，自动登录
      userStore.setUser({
        account: data.data.account,
        isLoggedIn: true,
        username: data.data.nickname
      });
      
      console.log('注册成功，已设置用户信息，当前store状态:', userStore.user);
      
      // 发送登录成功事件
      emit('login-success');
      // 关闭模态框 
      emit('close');
    } else {
      // 如果注册成功但没有返回数据，切换到登录界面让用户登录
      isLogin.value = true;
      registerForm.password = '';
      registerForm.confirmPassword = '';
      loginForm.account = registerForm.account;
      loginErrorMsg.value = '注册成功，请登录';
    }
  } catch (error) {
    console.error('注册错误:', error);
    registerErrorMsg.value = error instanceof Error ? error.message : '注册失败，请重试';
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="modal-overlay" @click.self="emit('close')">
    <div class="modal-container">
      <div class="modal-header">
        <h2>{{ isLogin ? '登录' : '注册' }}</h2>
        <button class="close-btn" @click="emit('close')">×</button>
      </div>
      
      <div class="modal-body">
        <!-- 登录表单 -->
        <form v-if="isLogin" @submit.prevent="handleLogin">
          <div class="form-group">
            <label>账号</label>
            <input 
              type="text" 
              v-model="loginForm.account" 
              placeholder="请输入邮箱"
              autocomplete="username"
            >
          </div>
          
          <div class="form-group">
            <label>密码</label>
            <input 
              type="password" 
              v-model="loginForm.password" 
              placeholder="请输入密码"
              autocomplete="current-password"
            >
          </div>
          
          <p class="error-message" v-if="loginErrorMsg">{{ loginErrorMsg }}</p>
          
          <div class="form-actions">
            <button type="submit" class="submit-btn" :disabled="loading">
              {{ loading ? '登录中...' : '登录' }}
            </button>
          </div>
          
          <div class="switch-mode">
            <span>没有账号？</span>
            <a href="#" @click.prevent="switchMode">立即注册</a>
          </div>
        </form>
        
        <!-- 注册表单 -->
        <form v-else @submit.prevent="handleRegister">
          <div class="form-group">
            <label>昵称</label>
            <input 
              type="text" 
              v-model="registerForm.nickname" 
              placeholder="请设置您的昵称"
            >
          </div>
          
          <div class="form-group">
            <label>账号</label>
            <input 
              type="text" 
              v-model="registerForm.account" 
              placeholder="请输入邮箱"
              autocomplete="username"
            >
          </div>
          
          <div class="form-group">
            <label>密码</label>
            <input 
              type="password" 
              v-model="registerForm.password" 
              placeholder="请设置密码"
              autocomplete="new-password"
            >
          </div>
          
          <div class="form-group">
            <label>确认密码</label>
            <input 
              type="password" 
              v-model="registerForm.confirmPassword" 
              placeholder="请再次输入密码"
              autocomplete="new-password"
            >
          </div>
          
          <p class="error-message" v-if="registerErrorMsg">{{ registerErrorMsg }}</p>
          
          <div class="form-actions">
            <button type="submit" class="submit-btn" :disabled="loading">
              {{ loading ? '注册中...' : '注册' }}
            </button>
          </div>
          
          <div class="switch-mode">
            <span>已有账号？</span>
            <a href="#" @click.prevent="switchMode">返回登录</a>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
}

.modal-container {
  background-color: white;
  border-radius: 15px;
  width: 400px;
  max-width: 90%;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  animation: fadeIn 0.3s ease;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background-color: rgba(208, 229, 237, 0.896);
  color: rgba(15, 135, 210, 0.8);
  border-bottom: 1px solid #eee;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.4rem;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: rgba(15, 135, 210, 0.8);
  cursor: pointer;
}

.modal-body {
  padding: 20px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  color: #555;
  font-size: 0.9rem;
}

.form-group input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  box-sizing: border-box;
}

.form-group input:focus {
  border-color: rgba(15, 135, 210, 0.5);
  outline: none;
  box-shadow: 0 0 5px rgba(15, 135, 210, 0.2);
}

.error-message {
  color: #e74c3c;
  font-size: 0.9rem;
  margin: 10px 0;
}

.form-actions {
  margin-top: 20px;
}

.submit-btn {
  width: 100%;
  padding: 12px;
  background-color: rgba(15, 135, 210, 0.8);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.submit-btn:hover {
  background-color: rgba(15, 135, 210, 1);
}

.submit-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.switch-mode {
  margin-top: 15px;
  text-align: center;
  font-size: 0.9rem;
  color: #666;
}

.switch-mode a {
  color: rgba(15, 135, 210, 0.8);
  text-decoration: none;
  margin-left: 5px;
}

.switch-mode a:hover {
  text-decoration: underline;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 480px) {
  .modal-container {
    width: 90%;
  }
}
</style> 