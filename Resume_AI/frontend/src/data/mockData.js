/**
 * Mock数据文件
 * 包含用于测试的简历数据和职位数据
 */

// 简历Mock数据
export const mockResumes = [
  {
    id: 1,
    name: '前端开发工程师简历',
    createTime: '2024-01-10',
    updateTime: '2024-01-15',
    status: 'completed',
    content: {
      basicInfo: {
        name: '张三',
        email: 'zhangsan@example.com',
        phone: '13800138000',
        position: '前端开发工程师',
        location: '北京市',
        avatar: '',
        summary: '5年前端开发经验，精通Vue.js、React等主流框架，具备良好的代码规范和团队协作能力。'
      },
      experiences: [
        {
          id: 1,
          company: '阿里巴巴',
          position: '高级前端工程师',
          startDate: '2022-01',
          endDate: '2024-01',
          description: '负责前端架构设计和开发，主导多个核心项目的技术选型和实施。参与了电商平台的重构项目，使用Vue 3和TypeScript提升了代码质量和开发效率。'
        },
        {
          id: 2,
          company: '字节跳动',
          position: '前端工程师',
          startDate: '2020-06',
          endDate: '2021-12',
          description: '负责移动端H5页面开发，优化页面性能，提升用户体验。使用React和Webpack构建高性能的单页应用。'
        }
      ],
      education: [
        {
          id: 1,
          school: '清华大学',
          major: '计算机科学与技术',
          degree: '本科',
          startDate: '2018-09',
          endDate: '2022-06'
        }
      ],
      skills: 'Vue.js, React, JavaScript, TypeScript, Node.js, Webpack, Git, Docker, MySQL'
    }
  },
  {
    id: 2,
    name: '产品经理简历',
    createTime: '2024-01-08',
    updateTime: '2024-01-10',
    status: 'draft',
    content: {
      basicInfo: {
        name: '李四',
        email: 'lisi@example.com',
        phone: '13900139000',
        position: '产品经理',
        location: '上海市',
        avatar: '',
        summary: '3年产品经验，擅长用户需求分析和产品规划，具备敏捷开发和数据分析能力。'
      },
      experiences: [
        {
          id: 1,
          company: '腾讯',
          position: '产品经理',
          startDate: '2021-03',
          endDate: '2024-01',
          description: '负责社交产品的功能规划和迭代，通过数据分析优化用户体验，DAU提升30%。'
        }
      ],
      education: [
        {
          id: 1,
          school: '复旦大学',
          major: '工商管理',
          degree: '硕士',
          startDate: '2019-09',
          endDate: '2021-06'
        }
      ],
      skills: 'Axure, Figma, SQL, Python, 数据分析, 用户研究, 敏捷开发'
    }
  },
  {
    id: 3,
    name: 'UI设计师简历',
    createTime: '2024-01-05',
    updateTime: '2024-01-08',
    status: 'completed',
    content: {
      basicInfo: {
        name: '王五',
        email: 'wangwu@example.com',
        phone: '13700137000',
        position: 'UI设计师',
        location: '深圳市',
        avatar: '',
        summary: '4年UI设计经验，专注于移动端界面设计，具备良好的视觉设计能力和用户体验思维。'
      },
      experiences: [
        {
          id: 1,
          company: '腾讯',
          position: 'UI设计师',
          startDate: '2021-06',
          endDate: '2024-01',
          description: '负责移动端UI设计，参与多款产品的视觉设计和用户体验优化。设计的界面获得了用户好评，提升了产品的整体体验。'
        },
        {
          id: 2,
          company: '美团',
          position: '视觉设计师',
          startDate: '2020-03',
          endDate: '2021-05',
          description: '负责品牌视觉设计和营销物料制作，参与了多个重要活动的视觉设计工作。'
        }
      ],
      education: [
        {
          id: 1,
          school: '中央美术学院',
          major: '视觉传达设计',
          degree: '本科',
          startDate: '2017-09',
          endDate: '2021-06'
        }
      ],
      skills: 'Figma, Sketch, Adobe Creative Suite, Principle, Protopie, After Effects'
    }
  },
  {
    id: 4,
    name: '后端开发工程师简历',
    createTime: '2024-01-12',
    updateTime: '2024-01-18',
    status: 'completed',
    content: {
      basicInfo: {
        name: '赵六',
        email: 'zhaoliu@example.com',
        phone: '13600136000',
        position: '后端开发工程师',
        location: '杭州市',
        avatar: '',
        summary: '6年后端开发经验，精通Java和Spring框架，具备微服务架构设计和高并发系统优化经验。'
      },
      experiences: [
        {
          id: 1,
          company: '阿里云',
          position: '高级后端工程师',
          startDate: '2021-08',
          endDate: '2024-01',
          description: '负责云计算平台的后端服务开发，设计和实现了高可用的微服务架构，支撑千万级用户访问。'
        },
        {
          id: 2,
          company: '网易',
          position: '后端工程师',
          startDate: '2019-07',
          endDate: '2021-07',
          description: '负责游戏后端服务开发，优化数据库性能，提升系统并发处理能力。'
        }
      ],
      education: [
        {
          id: 1,
          school: '浙江大学',
          major: '软件工程',
          degree: '本科',
          startDate: '2015-09',
          endDate: '2019-06'
        }
      ],
      skills: 'Java, Spring Boot, MySQL, Redis, Kafka, Docker, Kubernetes, AWS'
    }
  },
  {
    id: 5,
    name: '数据分析师简历',
    createTime: '2024-01-20',
    updateTime: '2024-01-22',
    status: 'published',
    content: {
      basicInfo: {
        name: '孙七',
        email: 'sunqi@example.com',
        phone: '13500135000',
        position: '数据分析师',
        location: '广州市',
        avatar: '',
        summary: '3年数据分析经验，熟练使用Python和SQL进行数据处理，具备商业洞察和数据可视化能力。'
      },
      experiences: [
        {
          id: 1,
          company: '滴滴出行',
          position: '数据分析师',
          startDate: '2021-09',
          endDate: '2024-01',
          description: '负责业务数据分析和用户行为分析，通过数据驱动产品优化，提升用户留存率15%。'
        }
      ],
      education: [
        {
          id: 1,
          school: '中山大学',
          major: '统计学',
          degree: '硕士',
          startDate: '2019-09',
          endDate: '2021-06'
        }
      ],
      skills: 'Python, SQL, Tableau, Power BI, R, Excel, 统计分析, 机器学习'
    }
  },
  {
    id: 6,
    name: '移动端开发工程师简历',
    createTime: '2024-01-25',
    updateTime: '2024-01-25',
    status: 'draft',
    content: {
      basicInfo: {
        name: '周八',
        email: 'zhouba@example.com',
        phone: '13400134000',
        position: '移动端开发工程师',
        location: '成都市',
        avatar: '',
        summary: '4年移动端开发经验，精通iOS和Android开发，具备跨平台开发经验。'
      },
      experiences: [
        {
          id: 1,
          company: '小米',
          position: 'Android开发工程师',
          startDate: '2020-04',
          endDate: '2024-01',
          description: '负责MIUI系统应用开发，优化应用性能和用户体验，参与了多个核心功能的开发。'
        }
      ],
      education: [
        {
          id: 1,
          school: '电子科技大学',
          major: '计算机科学与技术',
          degree: '本科',
          startDate: '2016-09',
          endDate: '2020-06'
        }
      ],
      skills: 'Android, Kotlin, Java, Flutter, React Native, iOS, Swift'
    }
  },
  {
    id: 7,
    name: '运营专员简历',
    createTime: '2024-01-28',
    updateTime: '2024-01-30',
    status: 'completed',
    content: {
      basicInfo: {
        name: '吴九',
        email: 'wujiu@example.com',
        phone: '13300133000',
        position: '运营专员',
        location: '武汉市',
        avatar: '',
        summary: '2年运营经验，擅长内容运营和用户运营，具备良好的文案能力和数据分析能力。'
      },
      experiences: [
        {
          id: 1,
          company: '字节跳动',
          position: '内容运营',
          startDate: '2022-06',
          endDate: '2024-01',
          description: '负责短视频平台的内容运营，策划和执行多个爆款活动，提升平台活跃度。'
        }
      ],
      education: [
        {
          id: 1,
          school: '华中科技大学',
          major: '新闻传播学',
          degree: '本科',
          startDate: '2018-09',
          endDate: '2022-06'
        }
      ],
      skills: '内容策划, 社群运营, 数据分析, 文案写作, 活动策划, 新媒体运营'
    }
  },
  {
    id: 8,
    name: '测试工程师简历',
    createTime: '2024-02-01',
    updateTime: '2024-02-01',
    status: 'draft',
    content: {
      basicInfo: {
        name: '郑十',
        email: 'zhengshi@example.com',
        phone: '13200132000',
        position: '测试工程师',
        location: '西安市',
        avatar: '',
        summary: '3年测试经验，熟悉自动化测试和性能测试，具备良好的质量意识和问题定位能力。'
      },
      experiences: [
        {
          id: 1,
          company: '华为',
          position: '测试工程师',
          startDate: '2021-07',
          endDate: '2024-01',
          description: '负责移动应用的功能测试和自动化测试，建立了完善的测试流程，提升了产品质量。'
        }
      ],
      education: [
        {
          id: 1,
          school: '西安电子科技大学',
          major: '软件工程',
          degree: '本科',
          startDate: '2017-09',
          endDate: '2021-06'
        }
      ],
      skills: 'Selenium, Appium, JMeter, Python, Java, 性能测试, 接口测试'
    }
  }
]

// 职位Mock数据
export const mockJobs = [
  {
    id: 1,
    title: '高级前端开发工程师',
    company: '阿里巴巴',
    type: '全职',
    location: '杭州',
    salary: '25-40K',
    experience: '3-5年',
    education: '本科',
    description: '负责前端架构设计和开发，要求熟练掌握Vue.js、React等主流框架，具备良好的代码规范和团队协作能力。',
    requirements: [
      '3年以上前端开发经验',
      '精通Vue.js、React等前端框架',
      '熟悉TypeScript、Webpack等工具',
      '具备良好的代码规范和团队协作能力',
      '有大型项目经验者优先'
    ],
    skills: ['Vue.js', 'React', 'TypeScript', 'Webpack', 'Node.js'],
    publishTime: '2024-02-01',
    deadline: '2024-03-01'
  },
  {
    id: 2,
    title: '产品经理',
    company: '腾讯',
    type: '全职',
    location: '深圳',
    salary: '20-35K',
    experience: '2-4年',
    education: '本科',
    description: '负责产品规划和需求分析，要求具备良好的逻辑思维和沟通能力，有互联网产品经验。',
    requirements: [
      '2年以上产品经验',
      '熟悉产品设计流程',
      '具备数据分析能力',
      '良好的沟通协调能力',
      '有社交产品经验者优先'
    ],
    skills: ['产品设计', '需求分析', '数据分析', 'Axure', 'Figma'],
    publishTime: '2024-01-28',
    deadline: '2024-02-28'
  },
  {
    id: 3,
    title: 'UI设计师',
    company: '字节跳动',
    type: '全职',
    location: '北京',
    salary: '18-30K',
    experience: '2-4年',
    education: '本科',
    description: '负责移动端UI设计，要求具备良好的视觉设计能力和用户体验思维。',
    requirements: [
      '2年以上UI设计经验',
      '熟练使用Figma、Sketch等设计工具',
      '具备良好的视觉设计能力',
      '了解用户体验设计原则',
      '有移动端设计经验者优先'
    ],
    skills: ['Figma', 'Sketch', 'UI设计', 'UX设计', 'Principle'],
    publishTime: '2024-01-30',
    deadline: '2024-02-29'
  },
  {
    id: 4,
    title: 'Java后端开发工程师',
    company: '美团',
    type: '全职',
    location: '北京',
    salary: '22-38K',
    experience: '3-5年',
    education: '本科',
    description: '负责后端服务开发，要求熟练掌握Java和Spring框架，具备微服务架构经验。',
    requirements: [
      '3年以上Java开发经验',
      '熟练掌握Spring Boot框架',
      '熟悉MySQL、Redis等数据库',
      '具备微服务架构经验',
      '有高并发系统经验者优先'
    ],
    skills: ['Java', 'Spring Boot', 'MySQL', 'Redis', 'Kafka'],
    publishTime: '2024-01-25',
    deadline: '2024-02-25'
  },
  {
    id: 5,
    title: '数据分析师',
    company: '滴滴出行',
    type: '全职',
    location: '北京',
    salary: '15-25K',
    experience: '1-3年',
    education: '本科',
    description: '负责业务数据分析，要求熟练使用Python和SQL，具备数据可视化能力。',
    requirements: [
      '1年以上数据分析经验',
      '熟练使用Python、SQL',
      '熟悉Tableau、Power BI等工具',
      '具备统计学基础',
      '有业务分析经验者优先'
    ],
    skills: ['Python', 'SQL', 'Tableau', '统计分析', '数据可视化'],
    publishTime: '2024-02-02',
    deadline: '2024-03-02'
  },
  {
    id: 6,
    title: 'Android开发工程师',
    company: '小米',
    type: '全职',
    location: '北京',
    salary: '20-32K',
    experience: '2-4年',
    education: '本科',
    description: '负责Android应用开发，要求熟练掌握Kotlin和Java，具备性能优化经验。',
    requirements: [
      '2年以上Android开发经验',
      '熟练掌握Kotlin、Java',
      '熟悉Android SDK和框架',
      '具备性能优化经验',
      '有MIUI开发经验者优先'
    ],
    skills: ['Android', 'Kotlin', 'Java', 'Android SDK', '性能优化'],
    publishTime: '2024-01-26',
    deadline: '2024-02-26'
  },
  {
    id: 7,
    title: '运营专员',
    company: '快手',
    type: '全职',
    location: '北京',
    salary: '12-20K',
    experience: '1-3年',
    education: '本科',
    description: '负责内容运营和用户运营，要求具备良好的文案能力和创意思维。',
    requirements: [
      '1年以上运营经验',
      '具备良好的文案能力',
      '熟悉新媒体运营',
      '具备数据分析能力',
      '有短视频运营经验者优先'
    ],
    skills: ['内容运营', '用户运营', '文案策划', '数据分析', '新媒体'],
    publishTime: '2024-01-29',
    deadline: '2024-02-28'
  },
  {
    id: 8,
    title: '测试工程师',
    company: '华为',
    type: '全职',
    location: '深圳',
    salary: '16-28K',
    experience: '2-4年',
    education: '本科',
    description: '负责软件测试工作，要求熟悉自动化测试工具，具备良好的质量意识。',
    requirements: [
      '2年以上测试经验',
      '熟悉自动化测试工具',
      '具备编程基础',
      '良好的质量意识',
      '有移动应用测试经验者优先'
    ],
    skills: ['自动化测试', 'Selenium', 'Python', '性能测试', '接口测试'],
    publishTime: '2024-02-03',
    deadline: '2024-03-03'
  },
  {
    id: 9,
    title: '前端开发实习生',
    company: '百度',
    type: '实习',
    location: '北京',
    salary: '150-200/天',
    experience: '应届生',
    education: '本科',
    description: '负责前端页面开发，要求熟悉HTML、CSS、JavaScript基础，学习能力强。',
    requirements: [
      '计算机相关专业在读',
      '熟悉HTML、CSS、JavaScript',
      '了解Vue.js或React框架',
      '学习能力强，责任心强',
      '能实习3个月以上'
    ],
    skills: ['HTML', 'CSS', 'JavaScript', 'Vue.js', 'Git'],
    publishTime: '2024-02-05',
    deadline: '2024-03-05'
  },
  {
    id: 10,
    title: '全栈开发工程师',
    company: '蚂蚁金服',
    type: '全职',
    location: '杭州',
    salary: '30-50K',
    experience: '5-8年',
    education: '本科',
    description: '负责全栈开发工作，要求同时具备前端和后端开发能力，有金融科技经验。',
    requirements: [
      '5年以上全栈开发经验',
      '精通前端和后端技术栈',
      '熟悉微服务架构',
      '具备系统设计能力',
      '有金融科技经验者优先'
    ],
    skills: ['Vue.js', 'React', 'Node.js', 'Java', 'Spring Boot', 'MySQL'],
    publishTime: '2024-02-04',
    deadline: '2024-03-04'
  }
]

// 匹配结果Mock数据
export const mockMatchResults = [
  {
    resumeId: 1,
    jobId: 1,
    matchScore: 85,
    matchDetails: {
      skillsMatch: 90,
      experienceMatch: 85,
      educationMatch: 80,
      locationMatch: 70
    },
    strengths: [
      '技能匹配度高，精通Vue.js和React',
      '工作经验丰富，有大厂背景',
      '教育背景优秀'
    ],
    weaknesses: [
      '地理位置不完全匹配',
      '缺少TypeScript相关经验描述'
    ],
    suggestions: [
      '建议补充TypeScript项目经验',
      '可以考虑远程工作或搬迁到杭州'
    ]
  }
]