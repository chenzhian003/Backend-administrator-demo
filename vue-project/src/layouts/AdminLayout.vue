<template>
  <div class="layout-container">
    <!-- 侧边栏 -->
    <el-aside :width="isCollapse ? '64px' : '200px'" class="aside">
      <div class="logo">
        <img src="../assets/logo.svg" alt="Logo" />
        <span v-show="!isCollapse">后台管理系统</span>
      </div>
      <el-scrollbar>
        <el-menu
          :default-active="activeMenu"
          class="el-menu-vertical"
          :collapse="isCollapse"
          background-color="#304156"
          text-color="#bfcbd9"
          active-text-color="#409EFF"
          router
        >
          <el-menu-item index="/dashboard">
            <el-icon><House /></el-icon>
            <template #title>控制台</template>
          </el-menu-item>

          <el-sub-menu index="/products">
            <template #title>
              <el-icon><ShoppingCart /></el-icon>
              <span>商品管理</span>
            </template>
            <el-menu-item index="/products/list">商品列表</el-menu-item>
            <el-menu-item index="/products/category">商品分类</el-menu-item>
          </el-sub-menu>

          <el-sub-menu index="/orders">
            <template #title>
              <el-icon><List /></el-icon>
              <span>订单管理</span>
            </template>
            <el-menu-item index="/orders/list">订单列表</el-menu-item>
            <el-menu-item index="/orders/delivery">发货管理</el-menu-item>
          </el-sub-menu>

          <el-sub-menu index="/users">
            <template #title>
              <el-icon><User /></el-icon>
              <span>用户管理</span>
            </template>
            <el-menu-item index="/users/list">用户列表</el-menu-item>
            <el-menu-item index="/users/roles">角色管理</el-menu-item>
          </el-sub-menu>

          <el-menu-item index="/settings">
            <el-icon><Setting /></el-icon>
            <template #title>系统设置</template>
          </el-menu-item>
        </el-menu>
      </el-scrollbar>
    </el-aside>

    <!-- 主要内容区 -->
    <el-container class="main-container">
      <!-- 头部 -->
      <el-header class="header">
        <div class="header-left">
          <el-icon 
            class="collapse-btn"
            @click="toggleCollapse"
          >
            <Fold v-if="!isCollapse" />
            <Expand v-else />
          </el-icon>
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/dashboard' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>{{ currentRoute }}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="header-right">
          <el-dropdown @command="handleCommand">
            <span class="user-dropdown">
              <el-avatar :size="32" :src="userStore.userInfo.avatar || '../assets/default-avatar.svg'" />
              <span>{{ userStore.userInfo.username }}</span>
              <el-icon><CaretBottom /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="profile">个人信息</el-dropdown-item>
                <el-dropdown-item command="password">修改密码</el-dropdown-item>
                <el-dropdown-item divided command="logout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>

      <!-- 内容区 -->
      <el-main class="main">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </el-main>
    </el-container>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { ElMessageBox } from 'element-plus'
import {
  House,
  ShoppingCart,
  List,
  User,
  Setting,
  Fold,
  Expand,
  CaretBottom
} from '@element-plus/icons-vue'

// 侧边栏折叠状态
const isCollapse = ref(false)
const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

// 当前激活的菜单
const activeMenu = computed(() => route.path)
// 当前路由名称
const currentRoute = computed(() => route.meta.title || '页面')

// 切换侧边栏折叠状态
const toggleCollapse = () => {
  isCollapse.value = !isCollapse.value
}

// 处理下拉菜单命令
const handleCommand = async (command) => {
  switch (command) {
    case 'profile':
      router.push('/settings/profile')
      break
    case 'password':
      router.push('/settings/password')
      break
    case 'logout':
      try {
        await ElMessageBox.confirm(
          '确定要退出登录吗？',
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        )
        userStore.logout()
        router.push('/login')
      } catch {
        // 用户取消操作
      }
      break
  }
}
</script>

<style scoped>
.layout-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  background-color: var(--el-bg-color-page);
}

/* 侧边栏样式 */
.aside {
  background-color: #304156;
  transition: width 0.3s;
  height: 100%;
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  z-index: 1001;
  overflow: hidden;
  box-shadow: 2px 0 6px rgba(0, 21, 41, 0.35);
}

/* 主要内容区样式 */
.main-container {
  flex: 1;
  margin-left: 200px;
  transition: all 0.3s;
  display: flex;
  flex-direction: column;
  background-color: var(--el-bg-color-page);
  min-width: 0; /* 防止flex子项溢出 */
}

/* 侧边栏折叠时的样式 */
.layout-container :deep(.aside.el-aside--64px) + .main-container {
  margin-left: 64px;
}

/* logo样式 */
.logo {
  height: 60px;
  display: flex;
  align-items: center;
  padding: 0 16px;
  background: #2b2f3a;
  color: #fff;
  font-size: 18px;
  white-space: nowrap;
  overflow: hidden;
  flex-shrink: 0;
}

.logo img {
  width: 32px;
  height: 32px;
  margin-right: 12px;
  flex-shrink: 0;
}

/* 菜单样式 */
.el-menu-vertical {
  border-right: none;
  height: calc(100% - 60px);
  overflow-y: auto;
}

.el-menu-vertical:not(.el-menu--collapse) {
  width: 200px;
}

/* 头部样式 */
.header {
  background-color: #fff;
  border-bottom: 1px solid #e6e6e6;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  height: 60px;
  position: sticky;
  top: 0;
  z-index: 1000;
  width: 100%;
  box-sizing: border-box;
  flex-shrink: 0;
}

/* 头部左侧样式 */
.header-left {
  display: flex;
  align-items: center;
  overflow: hidden;
}

/* 折叠按钮样式 */
.collapse-btn {
  font-size: 20px;
  cursor: pointer;
  margin-right: 20px;
  flex-shrink: 0;
}

/* 头部右侧样式 */
.header-right {
  display: flex;
  align-items: center;
}

/* 用户下拉菜单样式 */
.user-dropdown {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 0 8px;
}

.user-dropdown span {
  margin: 0 8px;
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 主内容样式 */
.main {
  flex: 1;
  padding: 20px;
  box-sizing: border-box;
  background-color: var(--el-fill-color);
  position: relative;
  overflow: auto;
  display: flex;
  flex-direction: column;
  min-height: 0; /* 防止flex子项溢出 */
}

/* 响应式布局 */
@media screen and (max-width: 1200px) {
  .main {
    padding: 15px;
  }
}

@media screen and (max-width: 768px) {
  .aside {
    transform: translateX(-200px);
  }

  .aside.el-aside--64px {
    transform: translateX(-64px);
  }

  .main-container {
    margin-left: 0 !important;
  }

  .header {
    padding: 0 10px;
  }

  .user-dropdown span {
    max-width: 80px;
  }

  .el-breadcrumb {
    display: none;
  }

  .main {
    padding: 10px;
  }

  :deep(.el-card) {
    --el-card-padding: 15px;
  }
}

/* 渐变效果 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 表格容器样式 */
:deep(.el-table) {
  flex: 1;
  min-height: 0; /* 防止flex子项溢出 */
}

:deep(.el-card) {
  height: 100%;
  display: flex;
  flex-direction: column;
  flex: 1;
}

:deep(.el-card__body) {
  flex: 1;
  overflow: auto;
  display: flex;
  flex-direction: column;
}

:deep(.product-list) {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0; /* 防止flex子项溢出 */
}
</style> 