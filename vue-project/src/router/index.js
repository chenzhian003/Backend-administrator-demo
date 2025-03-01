import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// 路由配置
const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/LoginView.vue'),
    meta: { title: '登录', public: true }
  },
  {
    path: '/',
    component: () => import('@/layouts/AdminLayout.vue'),
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/DashboardView.vue'),
        meta: { title: '控制台' }
      },
      {
        path: 'products',
        name: 'Products',
        redirect: '/products/list',
        children: [
          {
            path: 'list',
            name: 'ProductList',
            component: () => import('@/views/products/ListView.vue'),
            meta: { title: '商品列表' }
          },
          {
            path: 'category',
            name: 'ProductCategory',
            component: () => import('@/views/products/CategoryView.vue'),
            meta: { title: '商品分类' }
          }
        ]
      },
      {
        path: 'orders',
        name: 'Orders',
        redirect: '/orders/list',
        children: [
          {
            path: 'list',
            name: 'OrderList',
            component: () => import('@/views/orders/ListView.vue'),
            meta: { title: '订单列表' }
          },
          {
            path: 'delivery',
            name: 'OrderDelivery',
            component: () => import('@/views/orders/DeliveryView.vue'),
            meta: { title: '发货管理' }
          }
        ]
      },
      {
        path: 'users',
        name: 'Users',
        redirect: '/users/list',
        children: [
          {
            path: 'list',
            name: 'UserList',
            component: () => import('@/views/users/ListView.vue'),
            meta: { title: '用户列表' }
          },
          {
            path: 'roles',
            name: 'UserRoles',
            component: () => import('@/views/users/RolesView.vue'),
            meta: { title: '角色管理' }
          }
        ]
      },
      {
        path: 'settings',
        name: 'Settings',
        component: () => import('@/views/settings/SettingsView.vue'),
        meta: { title: '系统设置' },
        children: [
          {
            path: 'profile',
            name: 'Profile',
            component: () => import('@/views/settings/ProfileView.vue'),
            meta: { title: '个人信息' }
          },
          {
            path: 'password',
            name: 'Password',
            component: () => import('@/views/settings/PasswordView.vue'),
            meta: { title: '修改密码' }
          }
        ]
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFound.vue'),
    meta: { title: '404', public: true }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// 配置 NProgress
NProgress.configure({ 
  showSpinner: false,
  minimum: 0.2,
  easing: 'ease',
  speed: 500
})

// 路由守卫
router.beforeEach((to, from, next) => {
  // 开始加载进度条
  NProgress.start()

  // 设置页面标题
  document.title = `${to.meta.title} - 后台管理系统`

  // 获取用户状态
  const userStore = useUserStore()
  const isLoggedIn = userStore.checkLogin()

  // 处理路由权限
  if (to.meta.public) {
    // 公开页面
    if (isLoggedIn && to.path === '/login') {
      // 已登录用户访问登录页，重定向到首页
      next('/dashboard')
    } else {
      next()
    }
  } else {
    // 需要登录的页面
    if (isLoggedIn) {
      next()
    } else {
      // 未登录，直接跳转到登录页
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    }
  }
})

// 路由后置钩子
router.afterEach(() => {
  // 结束加载进度条
  NProgress.done()
})

export default router
