import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  // 从 localStorage 初始化状态
  const token = ref(localStorage.getItem('token') || '')
  const userInfo = ref(JSON.parse(localStorage.getItem('userInfo') || '{}'))
  
  // 模拟用户数据库
  const users = ref(JSON.parse(localStorage.getItem('users') || '[]'))
  
  // 设置 token
  const setToken = (newToken) => {
    token.value = newToken
    localStorage.setItem('token', newToken)
  }

  // 设置用户信息
  const setUserInfo = (info) => {
    userInfo.value = info
    localStorage.setItem('userInfo', JSON.stringify(info))
  }

  // 登录
  const login = async (loginForm) => {
    try {
      // 这里应该是实际的登录 API 调用
      // 模拟登录成功
      const mockToken = 'mock_token_' + Date.now()
      const mockUserInfo = {
        username: loginForm.username,
        avatar: '../assets/default-avatar.png', // 使用本地默认头像
        nickname: loginForm.username,
        email: '',
        phone: ''
      }

      // 如果选择记住密码，将登录信息保存到 localStorage
      if (loginForm.remember) {
        localStorage.setItem('rememberedUser', JSON.stringify({
          username: loginForm.username,
          password: loginForm.password
        }))
      } else {
        localStorage.removeItem('rememberedUser')
      }

      setToken(mockToken)
      setUserInfo(mockUserInfo)

      return Promise.resolve()
    } catch (error) {
      return Promise.reject(error)
    }
  }

  // 注册
  const register = async (registerForm) => {
    try {
      // 检查用户名是否已存在
      const existingUser = users.value.find(u => u.username === registerForm.username)
      if (existingUser) {
        return Promise.reject(new Error('用户名已存在'))
      }

      // 模拟注册成功
      const newUser = {
        username: registerForm.username,
        password: registerForm.password,
        createTime: Date.now(),
        avatar: '../assets/default-avatar.png', // 使用本地默认头像
        nickname: registerForm.username,
        email: '',
        phone: ''
      }
      users.value.push(newUser)
      localStorage.setItem('users', JSON.stringify(users.value))
      return Promise.resolve()
    } catch (error) {
      return Promise.reject(error)
    }
  }

  // 修改密码
  const updatePassword = async (passwordForm) => {
    try {
      // 这里应该是实际的修改密码 API 调用
      // 模拟修改密码
      const user = users.value.find(u => u.username === userInfo.value.username)
      if (!user) {
        return Promise.reject(new Error('用户不存在'))
      }
      
      if (user.password !== passwordForm.oldPassword) {
        return Promise.reject(new Error('当前密码错误'))
      }
      
      user.password = passwordForm.newPassword
      localStorage.setItem('users', JSON.stringify(users.value))
      
      // 如果有记住的用户信息，也需要更新
      const rememberedUser = JSON.parse(localStorage.getItem('rememberedUser') || '{}')
      if (rememberedUser.username === user.username) {
        localStorage.setItem('rememberedUser', JSON.stringify({
          ...rememberedUser,
          password: passwordForm.newPassword
        }))
      }
      
      return Promise.resolve()
    } catch (error) {
      return Promise.reject(error)
    }
  }

  // 登出
  const logout = () => {
    token.value = ''
    userInfo.value = {}
    localStorage.removeItem('token')
    localStorage.removeItem('userInfo')
    localStorage.removeItem('rememberedUser') // 确保清除记住的用户信息
  }

  // 检查登录状态
  const checkLogin = () => {
    const currentToken = localStorage.getItem('token')
    const currentUserInfo = localStorage.getItem('userInfo')
    
    if (!currentToken || !currentUserInfo) {
      // 如果没有token或用户信息，确保清除所有状态
      logout()
      return false
    }
    
    try {
      // 验证用户信息是否完整
      const userInfo = JSON.parse(currentUserInfo)
      if (!userInfo.username) {
        logout()
        return false
      }
      
      token.value = currentToken
      userInfo.value = userInfo
      return true
    } catch {
      // 如果解析用户信息失败，清除状态
      logout()
      return false
    }
  }

  // 获取记住的用户信息
  const getRememberedUser = () => {
    const remembered = localStorage.getItem('rememberedUser')
    return remembered ? JSON.parse(remembered) : null
  }

  // 自动登录
  const autoLogin = async () => {
    const remembered = getRememberedUser()
    if (remembered) {
      try {
        await login({
          username: remembered.username,
          password: remembered.password,
          remember: true
        })
        return Promise.resolve()
      } catch {
        localStorage.removeItem('rememberedUser')
        return Promise.reject('自动登录失败')
      }
    }
    return Promise.reject('没有记住的登录信息')
  }

  return {
    token,
    userInfo,
    users,
    login,
    register,
    logout,
    checkLogin,
    getRememberedUser,
    autoLogin,
    setUserInfo,
    updatePassword
  }
}, {
  persist: true
}) 