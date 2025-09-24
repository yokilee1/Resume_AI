<template>
  <div class="competitive-match">
    <div class="match-container">
      <!-- 左侧职位列表区域 -->
      <div class="left-panel">
        <!-- 搜索和筛选区域 -->
        <div class="search-section">
          <el-input
            v-model="searchKeyword"
            placeholder="Search tickets..."
            class="search-input"
            :prefix-icon="Search"
          />
          <el-button class="filter-btn" :icon="Filter">Filter</el-button>
        </div>
        
        <!-- 职位列表 -->
        <div class="job-list">
          <div 
            v-for="job in filteredJobs" 
            :key="job.id"
            class="job-card"
            :class="{ active: selectedJob?.id === job.id }"
            @click="selectJob(job)"
          >
            <div class="job-title">{{ job.title }}</div>
            <div class="job-info">
              <span class="company">{{ job.company }}</span>
              <span class="type">{{ job.type }}</span>
              <span class="location">{{ job.location }}</span>
              <span class="salary">{{ job.salary }}</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 右侧匹配区域 -->
      <div class="right-panel">
        <div class="match-section">
          <h2>选择你要匹配的简历</h2>
          
          <!-- 简历选择 -->
          <div class="resume-selection">
            <el-select 
              v-model="selectedResume" 
              placeholder="选择简历"
              class="resume-select"
            >
              <el-option
                v-for="resume in resumes"
                :key="resume.id"
                :label="resume.name"
                :value="resume.id"
              />
            </el-select>
            <BlackButton 
              @click="startMatching" 
              :disabled="!canMatch"
              class="match-btn"
            >
              开始匹配
            </BlackButton>
          </div>
          
          <!-- 匹配结果显示 -->
          <div v-if="matchResult" class="match-result">
            <h3>你与该岗位的匹配度</h3>
            
            <div class="match-score">
              <el-progress
                type="dashboard"
                :percentage="matchResult.score"
                :color="scoreColor"
                :width="200"
              />
            </div>
            
            <!-- 优势和劣势 -->
            <div class="advantages-disadvantages">
              <div class="advantages">
                <h4>你的优势</h4>
                <ul>
                  <li v-for="advantage in matchResult.advantages" :key="advantage">
                    {{ advantage }}
                  </li>
                </ul>
              </div>
              
              <div class="disadvantages">
                <h4>你的劣势</h4>
                <ul>
                  <li v-for="disadvantage in matchResult.disadvantages" :key="disadvantage">
                    {{ disadvantage }}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { Search, Star, StarFilled } from '@element-plus/icons-vue';
import { useResumeStore } from '../stores/resumeStore';
import BlackButton from '../components/ui/BlackButton.vue';
import { mockJobs, mockMatchResults } from '../data/mockData.js';

const resumeStore = useResumeStore();
const searchKeyword = ref('');
const selectedResume = ref('');
const selectedJob = ref(null);
const matchResult = ref(null);

// 使用丰富的职位mock数据
const jobs = ref([...mockJobs]);

// Mock resumes data
const resumes = computed(() => {
  return resumeStore.resumes.length > 0 ? resumeStore.resumes : [
    { id: 1, name: '前端开发简历' },
    { id: 2, name: '产品经理简历' }
  ];
});

/**
 * 过滤后的职位列表
 */
const filteredJobs = computed(() => {
  if (!searchKeyword.value) return jobs.value;
  return jobs.value.filter(job => 
    job.title.toLowerCase().includes(searchKeyword.value.toLowerCase()) ||
    job.company.toLowerCase().includes(searchKeyword.value.toLowerCase())
  );
});

/**
 * 是否可以开始匹配
 */
const canMatch = computed(() => {
  return selectedJob.value && selectedResume.value;
});

/**
 * 匹配度颜色
 */
const scoreColor = computed(() => {
  if (!matchResult.value) return '';
  const score = matchResult.value.score;
  if (score >= 80) return '#67C23A';
  if (score >= 60) return '#E6A23C';
  return '#F56C6C';
});

/**
 * 选择职位
 * @param {Object} job - 职位对象
 */
function selectJob(job) {
  selectedJob.value = job;
  // 清除之前的匹配结果
  matchResult.value = null;
}

/**
 * 开始匹配简历与职位
 */
function startMatching() {
  if (!canMatch.value) return;
  
  // 模拟API调用匹配
  setTimeout(() => {
    // 根据选择的职位和简历获取对应的匹配结果
    const jobId = selectedJob.value.id;
    const resumeId = parseInt(selectedResume.value);
    
    // 从mock数据中查找匹配结果，如果没有找到则使用默认结果
    const foundResult = mockMatchResults.find(result => 
      result.jobId === jobId && result.resumeId === resumeId
    );
    
    matchResult.value = foundResult || {
      score: Math.floor(Math.random() * 40) + 60,
      advantages: [
        '具备相关技能基础',
        '学习能力强，适应性好',
        '有一定项目经验'
      ],
      disadvantages: [
        '部分技能需要进一步提升',
        '相关经验有待加强'
      ]
    };
  }, 1500);
}
</script>

<style scoped>
.competitive-match {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f5f5f5;
}

.match-container {
  display: flex;
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
  gap: 20px;
  width: 100%;
  height: calc(100vh - 40px);
}

/* 左侧面板 */
.left-panel {
  flex: 1;
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.search-section {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.search-input {
  flex: 1;
}

.filter-btn {
  background: #f0f0f0;
  border: 1px solid #d9d9d9;
  color: #666;
}

.job-list {
  flex: 1;
  overflow-y: auto;
}

.job-card {
  padding: 16px;
  border: 1px solid #e8e8e8;
  border-radius: 6px;
  margin-bottom: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: white;
}

.job-card:hover {
  border-color: #1890ff;
  box-shadow: 0 2px 8px rgba(24, 144, 255, 0.2);
}

.job-card.active {
  border-color: #1890ff;
  background: #f6f9ff;
}

.job-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.job-info {
  display: flex;
  gap: 12px;
  font-size: 14px;
  color: #666;
}

.job-info span {
  padding: 2px 8px;
  background: #f5f5f5;
  border-radius: 4px;
}

/* 右侧面板 */
.right-panel {
  flex: 1;
  background: white;
  border-radius: 8px;
  padding: 30px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
}

.match-section h2 {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin-bottom: 30px;
  text-align: center;
}

.resume-selection {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 40px;
  align-items: center;
}

.resume-select {
  width: 300px;
}

.match-btn {
  width: 120px;
}

.match-result {
  text-align: center;
}

.match-result h3 {
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin-bottom: 30px;
}

.match-score {
  display: flex;
  justify-content: center;
  margin-bottom: 40px;
}

.advantages-disadvantages {
  display: flex;
  gap: 40px;
  text-align: left;
  max-width: 600px;
  margin: 0 auto;
}

.advantages,
.disadvantages {
  flex: 1;
}

.advantages h4,
.disadvantages h4 {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 15px;
  color: #333;
}

.advantages h4 {
  color: #52c41a;
}

.disadvantages h4 {
  color: #ff4d4f;
}

.advantages ul,
.disadvantages ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.advantages li,
.disadvantages li {
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
  font-size: 14px;
  color: #666;
  position: relative;
  padding-left: 20px;
}

.advantages li:before {
  content: '✓';
  position: absolute;
  left: 0;
  color: #52c41a;
  font-weight: bold;
}

.disadvantages li:before {
  content: '✗';
  position: absolute;
  left: 0;
  color: #ff4d4f;
  font-weight: bold;
}

.advantages li:last-child,
.disadvantages li:last-child {
  border-bottom: none;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .match-container {
    flex-direction: column;
    height: auto;
  }
  
  .left-panel,
  .right-panel {
    flex: none;
  }
  
  .left-panel {
    height: 400px;
  }
  
  .advantages-disadvantages {
    flex-direction: column;
    gap: 20px;
  }
}
</style>