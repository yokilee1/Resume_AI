/**
 * 简历管理状态存储
 * 使用Pinia管理简历数据和相关操作
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { mockResumes } from '../data/mockData.js'

export const useResumeStore = defineStore('resume', () => {
  // 状态 - 使用丰富的mock数据
  const resumes = ref([...mockResumes])

  const loading = ref(false)
  const error = ref(null)

  // 计算属性
  const resumeCount = computed(() => resumes.value.length)
  
  const completedCount = computed(() => 
    resumes.value.filter(resume => resume.status === 'completed').length
  )
  
  const draftCount = computed(() => 
    resumes.value.filter(resume => resume.status === 'draft').length
  )
  
  const publishedCount = computed(() => 
    resumes.value.filter(resume => resume.status === 'published').length
  )

  // 操作方法
  /**
   * 获取所有简历
   * @returns {Array} 简历列表
   */
  const getAllResumes = () => {
    return resumes.value
  }

  /**
   * 根据ID获取简历
   * @param {number|string} id - 简历ID
   * @returns {Object|null} 简历对象
   */
  const getResumeById = (id) => {
    return resumes.value.find(resume => resume.id == id) || null
  }

  /**
   * 创建新简历
   * @param {Object} resumeData - 简历数据
   * @returns {Object} 新创建的简历
   */
  const createResume = (resumeData) => {
    const newResume = {
      id: Date.now(),
      name: resumeData.name || '新建简历',
      createTime: new Date().toISOString().split('T')[0],
      updateTime: new Date().toISOString().split('T')[0],
      status: 'draft',
      content: {
        basicInfo: resumeData.basicInfo || {},
        experiences: resumeData.experiences || [],
        education: resumeData.education || [],
        skills: resumeData.skills || ''
      }
    }
    
    resumes.value.unshift(newResume)
    return newResume
  }

  /**
   * 更新简历
   * @param {number} id - 简历ID
   * @param {Object} updateData - 更新数据
   * @returns {boolean} 是否更新成功
   */
  const updateResume = (id, updateData) => {
    const index = resumes.value.findIndex(resume => resume.id === id)
    if (index === -1) return false

    resumes.value[index] = {
      ...resumes.value[index],
      ...updateData,
      updateTime: new Date().toISOString().split('T')[0]
    }
    
    return true
  }

  /**
   * 删除简历
   * @param {number} id - 简历ID
   * @returns {boolean} 是否删除成功
   */
  const deleteResume = (id) => {
    const index = resumes.value.findIndex(resume => resume.id === id)
    if (index === -1) return false

    resumes.value.splice(index, 1)
    return true
  }

  /**
   * 批量删除简历
   * @param {Array} ids - 简历ID数组
   * @returns {number} 删除的数量
   */
  const batchDeleteResumes = (ids) => {
    let deletedCount = 0
    ids.forEach(id => {
      if (deleteResume(id)) {
        deletedCount++
      }
    })
    return deletedCount
  }

  /**
   * 复制简历
   * @param {number} id - 原简历ID
   * @returns {Object|null} 新简历对象
   */
  const duplicateResume = (id) => {
    const originalResume = getResumeById(id)
    if (!originalResume) return null

    const duplicatedResume = {
      ...originalResume,
      id: Date.now(),
      name: `${originalResume.name} - 副本`,
      createTime: new Date().toISOString().split('T')[0],
      updateTime: new Date().toISOString().split('T')[0],
      status: 'draft'
    }

    resumes.value.unshift(duplicatedResume)
    return duplicatedResume
  }

  /**
   * 搜索简历
   * @param {string} keyword - 搜索关键词
   * @returns {Array} 匹配的简历列表
   */
  const searchResumes = (keyword) => {
    if (!keyword) return resumes.value

    const lowerKeyword = keyword.toLowerCase()
    return resumes.value.filter(resume => 
      resume.name.toLowerCase().includes(lowerKeyword) ||
      resume.content?.basicInfo?.name?.toLowerCase().includes(lowerKeyword) ||
      resume.content?.basicInfo?.position?.toLowerCase().includes(lowerKeyword)
    )
  }

  /**
   * 按状态筛选简历
   * @param {string} status - 状态
   * @returns {Array} 筛选后的简历列表
   */
  const filterResumesByStatus = (status) => {
    if (!status) return resumes.value
    return resumes.value.filter(resume => resume.status === status)
  }

  /**
   * 排序简历
   * @param {Array} resumeList - 简历列表
   * @param {string} sortBy - 排序字段
   * @param {string} order - 排序顺序 (asc/desc)
   * @returns {Array} 排序后的简历列表
   */
  const sortResumes = (resumeList, sortBy = 'updateTime', order = 'desc') => {
    return [...resumeList].sort((a, b) => {
      let comparison = 0
      
      switch (sortBy) {
        case 'updateTime':
        case 'createTime':
          comparison = new Date(a[sortBy]) - new Date(b[sortBy])
          break
        case 'name':
          comparison = a.name.localeCompare(b.name)
          break
        default:
          return 0
      }
      
      return order === 'desc' ? -comparison : comparison
    })
  }

  /**
   * 设置加载状态
   * @param {boolean} isLoading - 是否加载中
   */
  const setLoading = (isLoading) => {
    loading.value = isLoading
  }

  /**
   * 设置错误信息
   * @param {string|null} errorMessage - 错误信息
   */
  const setError = (errorMessage) => {
    error.value = errorMessage
  }

  /**
   * 清除错误信息
   */
  const clearError = () => {
    error.value = null
  }

  return {
    // 状态
    resumes,
    loading,
    error,
    
    // 计算属性
    resumeCount,
    completedCount,
    draftCount,
    publishedCount,
    
    // 方法
    getAllResumes,
    getResumeById,
    createResume,
    updateResume,
    deleteResume,
    batchDeleteResumes,
    duplicateResume,
    searchResumes,
    filterResumesByStatus,
    sortResumes,
    setLoading,
    setError,
    clearError
  }
})