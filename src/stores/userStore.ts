import { defineStore } from 'pinia';
import { ref, watch } from 'vue';

interface User {
  account: string;
  isLoggedIn: boolean;
  username: string;
}

export const useUserStore = defineStore('user', () => {
  // 从localStorage尝试获取用户信息
  const getInitialState = (): User => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        return JSON.parse(storedUser);
      } catch (e) {
        console.error('解析存储的用户信息失败:', e);
        return { account: '', isLoggedIn: false, username: '' };
      }
    }
    return { account: '', isLoggedIn: false, username: '' };
  };

  const user = ref<User>(getInitialState());

  // 监听user变化，自动存储到localStorage
  watch(user, (newUser) => {
    console.log('用户状态更新:', newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
  }, { deep: true });

  // 设置用户信息
  const setUser = (userData: User) => {
    console.log('设置用户信息:', userData);
    user.value = userData;
    // 确保立即存储到localStorage
    localStorage.setItem('user', JSON.stringify(userData));
  };

  // 退出登录
  const logout = async () => {
    console.log('执行退出登录操作');
    // 调用退出登录API
    const token = localStorage.getItem('token');
    if (token) {
      try {
        console.log('发送登出请求到服务器');
        const response = await fetch('http://127.0.0.1:8787/api/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        console.log('登出响应状态:', response.status);
        
        if (!response.ok) {
          const errorData = await response.json();
          console.error('登出API错误:', errorData);
        }
      } catch (error) {
        console.error('登出请求发生错误:', error);
        // 即使API调用失败，仍然清除本地状态
      }
    } else {
      console.log('没有token，跳过API调用');
    }
    
    // 清除token
    localStorage.removeItem('token');
    console.log('已清除token');
    
    // 重置用户信息
    const logoutState = { account: '', isLoggedIn: false, username: '' };
    user.value = logoutState;
    console.log('已重置用户状态:', user.value);
    
    // 确保立即从localStorage中更新
    localStorage.setItem('user', JSON.stringify(logoutState));
    console.log('已更新localStorage');
    
    // 返回一个Promise以便调用者知道操作完成
    return Promise.resolve();
  };

  return {
    user,
    setUser,
    logout
  };
}, {
  // 启用Pinia持久化
  persist: true,
}); 