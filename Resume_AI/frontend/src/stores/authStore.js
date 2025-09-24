/**
 * 用户认证状态管理
 * 管理用户登录状态、用户信息、token等
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { userApi } from '@/api'

export const useAuthStore = defineStore('auth', () => {
  // 状态
  const user = ref(null)
  const token = ref(localStorage.getItem('token') || null)
  const isLoading = ref(false)
  const error = ref(null)

  // 计算属性
  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const userInfo = computed(() => user.value)

  /**
   * 设置用户信息和token
   * @param {Object} userData - 用户数据
   * @param {string} userToken - 用户token
   */
  const setAuth = (userData, userToken) => {
    user.value = userData
    token.value = userToken
    localStorage.setItem('token', userToken)
    localStorage.setItem('user', JSON.stringify(userData))
    error.value = null
  }

  /**
   * 清除认证信息
   */
  const clearAuth = () => {
    user.value = null
    token.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    error.value = null
  }

  /**
   * 设置加载状态
   * @param {boolean} loading - 是否加载中
   */
  const setLoading = (loading) => {
    isLoading.value = loading
  }

  /**
   * 设置错误信息
   * @param {string|null} errorMessage - 错误信息
   */
  const setError = (errorMessage) => {
    error.value = errorMessage
  }

  /**
   * 用户登录
   * @param {Object} credentials - 登录凭据
   * @param {string} credentials.email - 邮箱
   * @param {string} credentials.password - 密码
   * @param {boolean} credentials.rememberMe - 是否记住我
   * @returns {Promise<Object>} 登录结果
   */
  const login = async (credentials) => {
    try {
      setLoading(true)
      setError(null)

      // 调用登录API
      const response = await userApi.login(credentials)
      const { user: userData, token: userToken } = response.data

      // 设置认证信息
      setAuth(userData, userToken)

      return { success: true, user: userData }
    } catch (error) {
      const errorMessage = error.response?.data?.message || '登录失败，请检查用户名和密码'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  /**
   * 用户注册
   * @param {Object} userData - 注册数据
   * @param {string} userData.username - 用户名
   * @param {string} userData.email - 邮箱
   * @param {string} userData.password - 密码
   * @returns {Promise<Object>} 注册结果
   */
  const register = async (userData) => {
    try {
      setLoading(true)
      setError(null)

      // 调用注册API
      const response = await userApi.register(userData)
      const { user: newUser, token: userToken } = response.data

      // 注册成功后自动登录
      setAuth(newUser, userToken)

      return { success: true, user: newUser }
    } catch (error) {
      const errorMessage = error.response?.data?.message || '注册失败，请稍后重试'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  /**
   * 用户登出
   */
  const logout = () => {
    clearAuth()
  }

  /**
   * 获取用户资料
   * @returns {Promise<Object>} 用户资料
   */
  const fetchUserProfile = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await userApi.getUserProfile()
      const userData = response.data

      // 更新用户信息
      user.value = userData
      localStorage.setItem('user', JSON.stringify(userData))

      return userData
    } catch (error) {
      const errorMessage = error.response?.data?.message || '获取用户信息失败'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  /**
   * 更新用户资料
   * @param {Object} profileData - 用户资料数据
   * @returns {Promise<Object>} 更新结果
   */
  const updateUserProfile = async (profileData) => {
    try {
      setLoading(true)
      setError(null)

      const response = await userApi.updateUserProfile(profileData)
      const updatedUser = response.data

      // 更新本地用户信息
      user.value = updatedUser
      localStorage.setItem('user', JSON.stringify(updatedUser))

      return { success: true, user: updatedUser }
    } catch (error) {
      const errorMessage = error.response?.data?.message || '更新用户信息失败'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  /**
   * 初始化认证状态
   * 从localStorage恢复用户信息
   */
  const initAuth = () => {
    const savedToken = localStorage.getItem('token')
    const savedUser = localStorage.getItem('user')

    if (savedToken && savedUser) {
      try {
        token.value = savedToken
        user.value = JSON.parse(savedUser)
      } catch (error) {
        console.error('恢复用户信息失败:', error)
        clearAuth()
      }
    }
  }

  /**
   * 检查token是否有效
   * @returns {Promise<boolean>} token是否有效
   */
  const validateToken = async () => {
    if (!token.value) {
      return false
    }

    try {
      await fetchUserProfile()
      return true
    } catch (error) {
      console.error('Token验证失败:', error)
      clearAuth()
      return false
    }
  }

  /**
   * 模拟登录（用于开发测试）
   * @param {Object} credentials - 登录凭据
   * @returns {Promise<Object>} 登录结果
   */
  const simulateLogin = async (credentials) => {
    try {
      setLoading(true)
      setError(null)

      // 模拟API延迟
      await new Promise(resolve => setTimeout(resolve, 1000))

      // 模拟用户数据
      const userData = {
        id: 1,
        username: credentials.email.split('@')[0],
        email: credentials.email,
        avatar: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      const userToken = 'mock-jwt-token-' + Date.now()

      // 设置认证信息
      setAuth(userData, userToken)

      return { success: true, user: userData }
    } catch (error) {
      const errorMessage = '模拟登录失败'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  /**
   * 模拟注册（用于开发测试）
   * @param {Object} userData - 注册数据
   * @returns {Promise<Object>} 注册结果
   */
  const simulateRegister = async (userData) => {
    try {
      setLoading(true)
      setError(null)

      // 模拟API延迟
      await new Promise(resolve => setTimeout(resolve, 1500))

      // 模拟用户数据
      const newUser = {
        id: Date.now(),
        username: userData.username,
        email: userData.email,
        avatar: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      const userToken = 'mock-jwt-token-' + Date.now()

      // 设置认证信息
      setAuth(newUser, userToken)

      return { success: true, user: newUser }
    } catch (error) {
      const errorMessage = '模拟注册失败'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return {
    // 状态
    user,
    token,
    isLoading,
    error,
    
    // 计算属性
    isAuthenticated,
    userInfo,
    
    // 方法
    login,
    register,
    logout,
    fetchUserProfile,
    updateUserProfile,
    initAuth,
    validateToken,
    simulateLogin,
    simulateRegister,
    setAuth,
    clearAuth,
    setLoading,
    setError
  }
})