<template>
  <div class="not-found">
    <img src="../assets/404.svg" alt="404" class="not-found-image" />
    <h1>404</h1>
    <h2>页面未找到</h2>
    <p>抱歉，您访问的页面不存在</p>
    <el-button type="primary" @click="router.push('/dashboard')">返回首页</el-button>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<style scoped>
.not-found {
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #f5f7fa;
}

.not-found-image {
  width: 300px;
  max-width: 80%;
  margin-bottom: 20px;
}

h1 {
  font-size: 72px;
  color: #409eff;
  margin: 0;
}

h2 {
  font-size: 24px;
  color: #303133;
  margin: 10px 0;
}

p {
  color: #606266;
  margin-bottom: 20px;
}

@media (max-width: 480px) {
  h1 {
    font-size: 48px;
  }
  
  h2 {
    font-size: 20px;
  }
}
</style> 