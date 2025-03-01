<template>
  <div class="settings-container">
    <router-view />
  </div>
</template>

<script setup>
// 设置页面是一个容器组件，用于显示子路由（个人信息和修改密码）
</script>

<style scoped>
.settings-container {
  background-color: #fff;
  border-radius: 4px;
  padding: 20px;
  min-height: calc(100vh - 100px);
  height: 100%;
  width: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
</style> 