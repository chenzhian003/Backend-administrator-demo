<template>
  <div class="login-container">
    <div class="login-bg">
      <div class="bg-circle circle-1"></div>
      <div class="bg-circle circle-2"></div>
      <div class="bg-circle circle-3"></div>
    </div>
    <div class="login-content">
      <div class="login-left">
        <div class="welcome-text">
          <h1>欢迎使用</h1>
          <h2>后台管理系统</h2>
          <p>高效 · 简洁 · 强大</p>
        </div>
        <div class="decoration">
          <div class="circle"></div>
          <div class="line"></div>
        </div>
      </div>
      <div class="login-right">
        <div class="login-box">
          <div class="login-header">
            <img src="../assets/logo.svg" alt="Logo" class="logo" />
            <h2>{{ isRegister ? '创建账号' : '欢迎回来' }}</h2>
            <p class="subtitle">{{ isRegister ? '开启您的管理之旅' : '请输入您的账号信息' }}</p>
          </div>
          <el-form
            ref="formRef"
            :model="form"
            :rules="rules"
            class="login-form"
            @keyup.enter="handleSubmit"
          >
            <el-form-item prop="username">
              <el-input
                v-model="form.username"
                placeholder="用户名"
                :prefix-icon="User"
              />
            </el-form-item>
            <el-form-item prop="password">
              <el-input
                v-model="form.password"
                type="password"
                placeholder="密码"
                :prefix-icon="Lock"
                show-password
              />
            </el-form-item>
            <el-form-item v-if="isRegister" prop="confirmPassword">
              <el-input
                v-model="form.confirmPassword"
                type="password"
                placeholder="确认密码"
                :prefix-icon="Lock"
                show-password
              />
            </el-form-item>
            <div class="form-options">
              <el-checkbox v-model="form.remember" v-if="!isRegister">记住密码</el-checkbox>
              <el-link type="primary" @click="toggleMode">
                {{ isRegister ? '已有账号？去登录' : '没有账号？去注册' }}
              </el-link>
            </div>
            <el-form-item>
              <el-button
                type="primary"
                class="submit-button"
                :loading="loading"
                @click="handleSubmit"
              >
                {{ isRegister ? '注册' : '登录' }}
              </el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { User, Lock } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'

// 路由和用户状态管理
const router = useRouter()
const userStore = useUserStore()
const formRef = ref(null)
const loading = ref(false)
const isRegister = ref(false)

// 表单数据
const form = reactive({
  username: '',
  password: '',
  confirmPassword: '',
  remember: false
})

// 表单验证规则
const rules = computed(() => ({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
  ],
  ...(isRegister.value ? {
    confirmPassword: [
      { required: true, message: '请确认密码', trigger: 'blur' },
      {
        validator: (rule, value, callback) => {
          if (value !== form.password) {
            callback(new Error('两次输入的密码不一致'))
          } else {
            callback()
          }
        },
        trigger: 'blur'
      }
    ]
  } : {})
}))

// 切换注册和登录模式
const toggleMode = () => {
  isRegister.value = !isRegister.value
  form.password = ''
  form.confirmPassword = ''
  if (formRef.value) {
    formRef.value.clearValidate()
  }
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    loading.value = true
    
    if (isRegister.value) {
      // 注册逻辑
      await userStore.register({
        username: form.username,
        password: form.password
      })
      ElMessage.success('注册成功，请登录')
      isRegister.value = false
    } else {
      // 登录逻辑
      await userStore.login({
        username: form.username,
        password: form.password,
        remember: form.remember
      })
      ElMessage.success('登录成功')
      router.push('/dashboard')
    }
  } catch (error) {
    ElMessage.error(error.message || (isRegister.value ? '注册失败' : '登录失败'))
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-container {
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #ffffff;
  position: fixed;
  top: 0;
  left: 0;
  overflow: hidden;
}

/* 背景样式 */
.login-bg {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

/* 背景圆圈样式 */
.bg-circle {
  position: absolute;
  border-radius: 50%;
  background: linear-gradient(135deg, #0062ff 0%, #00a6ff 100%);
  opacity: 0.1;
  animation: float 20s infinite ease-in-out;
}

/* 各个圆圈的样式 */
.circle-1 {
  width: 800px;
  height: 800px;
  top: -200px;
  left: -200px;
  animation-delay: 0s;
}

.circle-2 {
  width: 600px;
  height: 600px;
  top: 40%;
  right: -100px;
  animation-delay: -5s;
}

.circle-3 {
  width: 400px;
  height: 400px;
  bottom: -100px;
  left: 30%;
  animation-delay: -10s;
}

/* 登录内容样式 */
.login-content {
  display: flex;
  width: 100%;
  max-width: 1200px;
  min-height: 600px;
  margin: 20px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 30px;
  box-shadow: 0 20px 60px rgba(0, 98, 255, 0.1);
  overflow: hidden;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(0, 98, 255, 0.1);
  transition: all 0.3s ease;
  position: relative;
  z-index: 1;
}

/* 登录左侧样式 */
.login-left {
  flex: 1.2;
  background: linear-gradient(135deg, #0062ff 0%, #00a6ff 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px;
  color: #fff;
  position: relative;
  overflow: hidden;
}

/* 装饰样式 */
.decoration {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  pointer-events: none;
}

/* 装饰圆圈样式 */
.decoration .circle {
  position: absolute;
  width: 300px;
  height: 300px;
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation: rotate 20s linear infinite;
}

/* 装饰线条样式 */
.decoration .line {
  position: absolute;
  width: 100%;
  height: 100%;
  background: linear-gradient(45deg, transparent 45%, rgba(255, 255, 255, 0.1) 45%, rgba(255, 255, 255, 0.1) 55%, transparent 55%);
  animation: wave 8s linear infinite;
}

/* 欢迎文本样式 */
.welcome-text {
  text-align: left;
  animation: fadeInUp 0.8s ease;
  position: relative;
  z-index: 1;
}

.welcome-text h1 {
  font-size: 48px;
  margin-bottom: 20px;
  font-weight: 600;
  letter-spacing: -0.5px;
  line-height: 1.2;
}

.welcome-text h2 {
  font-size: 36px;
  margin-bottom: 30px;
  font-weight: 400;
  opacity: 0.9;
}

.welcome-text p {
  font-size: 20px;
  opacity: 0.8;
  font-weight: 300;
  letter-spacing: 0.3px;
}

/* 登录右侧样式 */
.login-right {
  flex: 0.8;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px;
  background: #ffffff;
  position: relative;
}

/* 登录框样式 */
.login-box {
  width: 100%;
  max-width: 400px;
  animation: fadeIn 0.8s ease;
}

/* 登录头部样式 */
.login-header {
  text-align: center;
  margin-bottom: 40px;
}

.logo {
  width: 48px;
  height: 48px;
  margin-bottom: 20px;
  animation: pulse 2s infinite;
}

.login-header h2 {
  margin: 0;
  font-size: 28px;
  color: #333;
  font-weight: 500;
  margin-bottom: 8px;
}

.subtitle {
  color: #666;
  font-size: 16px;
  margin: 0;
}

/* 登录表单样式 */
.login-form :deep(.el-input__wrapper) {
  background: #f5f7fa;
  border: 2px solid transparent;
  border-radius: 12px;
  height: 50px;
  transition: all 0.3s ease;
  box-shadow: none;
}

.login-form :deep(.el-input__wrapper:hover) {
  background: #eef1f6;
  border-color: #e6e8eb;
}

.login-form :deep(.el-input__wrapper.is-focus) {
  background: #ffffff;
  border-color: #0062ff;
  box-shadow: 0 0 0 3px rgba(0, 98, 255, 0.1);
}

.login-form :deep(.el-input__inner) {
  color: #333;
  height: 50px;
  font-size: 16px;
}

.login-form :deep(.el-input__inner::placeholder) {
  color: #999;
}

/* 表单选项样式 */
.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.login-form :deep(.el-checkbox__label) {
  color: #666;
}

.login-form :deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
  background-color: #0062ff;
  border-color: #0062ff;
}

.login-form :deep(.el-checkbox__inner) {
  border-color: #d4d7dc;
  background: #ffffff;
}

/* 提交按钮样式 */
.login-form :deep(.el-button) {
  width: 100%;
  height: 50px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 500;
  letter-spacing: 0.5px;
  background: linear-gradient(135deg, #0062ff 0%, #00a6ff 100%);
  border: none;
  transition: all 0.3s ease;
}

.login-form :deep(.el-button:hover) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 98, 255, 0.3);
}

.login-form :deep(.el-button:active) {
  transform: translateY(0);
}

.login-form :deep(.el-link) {
  color: #0062ff;
  font-size: 14px;
  transition: all 0.3s ease;
}

.login-form :deep(.el-link:hover) {
  color: #00a6ff;
}

/* 动画效果 */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-30px) rotate(5deg);
  }
}

@keyframes rotate {
  from {
    transform: translate(-50%, -50%) rotate(0deg);
  }
  to {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}

@keyframes wave {
  from {
    background-position: 0 0;
  }
  to {
    background-position: 100% 100%;
  }
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

/* 媒体查询样式 */
@media (max-width: 768px) {
  .login-content {
    flex-direction: column;
    min-height: auto;
    margin: 16px;
  }
  
  .login-left {
    padding: 40px 20px;
  }
  
  .login-right {
    padding: 40px 20px;
  }
  
  .welcome-text h1 {
    font-size: 36px;
  }
  
  .welcome-text h2 {
    font-size: 28px;
  }
  
  .welcome-text p {
    font-size: 18px;
  }

  .bg-circle {
    opacity: 0.05;
  }
}
</style> 