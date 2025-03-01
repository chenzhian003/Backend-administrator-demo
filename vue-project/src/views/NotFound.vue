<template>
  <div class="not-found">
    <div class="content">
      <h1>404</h1>
      <h2>页面不存在</h2>
      <p>抱歉，您访问的页面不存在或已被删除</p>
      <el-button type="primary" @click="router.push('/dashboard')">返回首页</el-button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<style scoped>
.not-found {
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f2f5;
  overflow: hidden;
}

.content {
  text-align: center;
  padding: 40px;
  max-width: 600px;
  width: 100%;
}

h1 {
  font-size: 120px;
  color: #1890ff;
  margin: 0;
  line-height: 1.2;
}

h2 {
  font-size: 24px;
  color: #1f2d3d;
  margin: 20px 0;
}

p {
  font-size: 16px;
  color: #5e6d82;
  margin-bottom: 30px;
}
</style> 