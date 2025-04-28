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

## API文档

本API文档描述了前后端交互的接口规范，目前包含用户认证（注册/登录）相关接口。

### 基础信息

- 基础URL: `http://api.example.com` (实际地址以开发环境为准)
- 数据格式: 所有请求和响应均使用JSON格式
- 认证方式: JWT Token (Bearer Authentication)
- 错误响应: 所有错误响应使用统一格式，包含错误码和错误信息

### 通用响应格式

```json
{
  "code": 200,         // 状态码，200表示成功，非200表示失败
  "message": "成功",    // 状态描述
  "data": {}           // 响应数据，可能为对象、数组或null
}
```

### 错误码说明

| 错误码 | 描述 |
| ------ | ---- |
| 200    | 成功 |
| 400    | 请求参数错误 |
| 401    | 未授权或Token无效 |
| 403    | 权限不足 |
| 404    | 资源不存在 |
| 500    | 服务器内部错误 |

### 用户认证接口

#### 1. 用户注册

- **URL**: `/api/auth/register`
- **方法**: `POST`
- **描述**: 创建新用户账号

**请求参数**:

```json
{
  "nickname": "用户昵称",         // 用户昵称，长度2-20个字符
  "account": "user@example.com", // 邮箱账号
  "password": "password123"      // 密码，长度8-20个字符
}
```

**成功响应**:

```json
{
  "code": 200,
  "message": "注册成功",
  "data": {
    "userId": "12345678",         // 用户ID
    "nickname": "用户昵称",        // 用户昵称
    "account": "user@example.com", // 用户账号
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." // JWT Token
  }
}
```

**错误响应示例**:

```json
{
  "code": 400,
  "message": "账号已存在",
  "data": null
}
```

#### 2. 用户登录

- **URL**: `/api/auth/login`
- **方法**: `POST`
- **描述**: 用户登录并获取认证Token

**请求参数**:

```json
{
  "account": "user@example.com", // 邮箱账号
  "password": "password123"      // 密码
}
```

**成功响应**:

```json
{
  "code": 200,
  "message": "登录成功",
  "data": {
    "userId": "12345678",         // 用户ID
    "nickname": "用户昵称",        // 用户昵称
    "account": "user@example.com", // 用户账号
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." // JWT Token
  }
}
```

**错误响应示例**:

```json
{
  "code": 401,
  "message": "账号或密码错误",
  "data": null
}
```

#### 3. 获取当前登录用户信息

- **URL**: `/api/auth/user`
- **方法**: `GET`
- **描述**: 获取当前登录用户的详细信息
- **认证**: 需要在请求头中携带Token

**请求头**:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**成功响应**:

```json
{
  "code": 200,
  "message": "成功",
  "data": {
    "userId": "12345678",         // 用户ID
    "nickname": "用户昵称",        // 用户昵称
    "account": "user@example.com", // 用户账号
    "createdAt": "2023-06-15T08:30:00Z", // 注册时间
    "lastLoginAt": "2023-06-16T10:20:00Z" // 最后登录时间
  }
}
```

**错误响应示例**:

```json
{
  "code": 401,
  "message": "Token已过期，请重新登录",
  "data": null
}
```

#### 4. 退出登录

- **URL**: `/api/auth/logout`
- **方法**: `POST`
- **描述**: 用户退出登录，使当前Token失效
- **认证**: 需要在请求头中携带Token

**请求头**:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**成功响应**:

```json
{
  "code": 200,
  "message": "退出成功",
  "data": null
}
```

### 前端实现说明

前端已实现用户认证UI界面，包括：

1. 登录表单：支持账号（学号/手机号/邮箱）和密码登录
2. 注册表单：支持设置昵称、账号和密码
3. 用户状态展示：登录后在页面右上角显示用户头像和昵称
4. 退出登录功能

前端将在登录/注册成功后，存储用户信息和认证Token，并在后续请求中携带Token进行身份验证。

### 安全建议

1. 密码传输应使用HTTPS协议加密
2. 密码存储应使用加盐哈希算法
3. Token应设置合理的过期时间，建议为一周
4. 敏感操作应要求重新验证用户身份
5. 实现请求频率限制，防止暴力破解