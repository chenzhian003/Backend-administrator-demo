<script setup>
import { ElConfigProvider } from 'element-plus'
</script>

<template>
  <el-config-provider>
    <router-view />
  </el-config-provider>
</template>

<style>
html, body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100vh;
  font-family: var(--el-font-family);
  overflow: hidden;
}

#app {
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.el-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.el-main {
  flex: 1;
  padding: 20px;
  background-color: var(--el-fill-color);
  overflow: auto;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.el-aside {
  height: 100%;
  overflow: hidden;
}

.el-header {
  height: 60px;
  width: 100%;
  padding: 0 20px;
  position: relative;
  z-index: 100;
  flex-shrink: 0;
}

/* 自定义滚动条样式 */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-thumb {
  background: rgba(144, 147, 153, 0.3);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(144, 147, 153, 0.5);
}

::-webkit-scrollbar-track {
  background: transparent;
}

/* 页面通用样式 */
.page-container {
  background-color: #fff;
  border-radius: 4px;
  padding: 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.page-header {
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #ebeef5;
  flex-shrink: 0;
}

.page-content {
  flex: 1;
  overflow: auto;
  min-height: 0;
}

/* 响应式布局 */
@media screen and (max-width: 1200px) {
  .el-main {
    padding: 15px;
  }
  
  .page-container {
    padding: 15px;
  }
}

@media screen and (max-width: 768px) {
  .el-main {
    padding: 10px;
  }
  
  .page-container {
    padding: 10px;
  }
}
</style>
