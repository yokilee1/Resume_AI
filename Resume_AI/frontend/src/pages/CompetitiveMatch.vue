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
  return '#111111';
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
  /* 黑白灰主题变量（页面局部覆盖） */
  --ui-bg: #ffffff;
  --ui-bg-alt: #f8f9fa;
  --ui-hover-bg: #f2f3f5;
  --ui-border: #e5e7eb;
  --ui-text-primary: #111111;
  --ui-text-secondary: #555555;
  --ui-focus-outline: #111111;
  --ui-accent: #111111;
  background-color: #f7f7f8;
}

.match-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
  gap: 20px;
  width: 100%;
  height: calc(100vh - 40px);
  display: flex;
  flex-direction: row;
}

/* 左侧面板 */
.left-panel {
  flex: 1;
  background: var(--ui-bg);
  border-radius: 8px;
  padding: 20px;
  box-shadow: none;
  border: 1px solid var(--ui-border);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.search-section {
  flex: 0 0 auto;
  padding: 20px;
}

.job-list {
  flex: 1 1 auto;
  overflow-y: auto;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
  scroll-snap-type: y proximity;
}

.job-card {
  scroll-snap-align: start;
}

.right-panel {
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
}
.filter-btn {
  background: var(--ui-hover-bg);
  border: 1px solid var(--ui-border);
  color: var(--ui-text-primary);
}

.job-card {
  padding: 16px;
  border: 1px solid var(--ui-border);
  border-radius: 6px;
  margin-bottom: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: var(--ui-bg);
}

.job-card:hover {
  border-color: var(--ui-focus-outline);
  box-shadow: none;
  background: var(--ui-hover-bg);
}

.job-card.active {
  border-color: var(--ui-focus-outline);
  background: var(--ui-bg-alt);
}

.job-card:focus-visible {
  outline: 2px solid var(--ui-focus-outline);
  outline-offset: 2px;
}

.job-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--ui-text-primary);
  margin-bottom: 8px;
}

.job-info {
  display: flex;
  gap: 12px;
  font-size: 14px;
  color: var(--ui-text-secondary);
}

.job-info span {
  padding: 2px 8px;
  background: var(--ui-hover-bg);
  border-radius: 4px;
}

.right-panel {
  flex: 1;
  background: var(--ui-bg);
  border-radius: 8px;
  padding: 30px;
  box-shadow: none;
  border: 1px solid var(--ui-border);
  overflow-y: auto;
}

.match-section h2 {
  font-size: 24px;
  font-weight: 600;
  color: var(--ui-text-primary);
  margin-bottom: 30px;
  text-align: center;
}

/* 响应式布局 */
@media (max-width: 1024px) {
  .match-container {
    height: auto;
  }
}

@media (max-width: 768px) {
  .match-container {
    flex-direction: column;
    padding: 16px;
    gap: 12px;
  }
  .left-panel,
  .right-panel {
    width: 100%;
    padding: 16px;
  }
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
  color: #343a40;
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
  color: var(--ui-text-primary);
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
  border-bottom: 1px solid #dee2e6;
  font-size: 14px;
  color: #6c757d;
  position: relative;
  padding-left: 20px;
}

.advantages li:before,
.disadvantages li:before {
  content: '\u2713';
  position: absolute;
  left: 0;
  color: #495057;
  font-weight: bold;
}

.disadvantages li:before {
  content: '\u2717';
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