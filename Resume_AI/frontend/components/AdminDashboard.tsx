import React, { useState, useEffect } from 'react';
import { AppView, JobSearchResult, AdminUser, AdminStats, CrawlerTask, AdminTemplate } from '../types';
import {
  getStats,
  listUsers,
  updateUserRole,
  updateUserStatus,
  listCrawlerTasks,
  createCrawlerTask,
  deleteCrawlerTask,
  updateCrawlerTaskStatus,
  listTemplates,
  updateTemplateStatus,
  listJobs,
  deleteJob
} from '../services/adminApi';
import { useJobs } from '../context/JobContext';
import { useResumes } from '../context/ResumeContext';
import {
  LayoutDashboard,
  Users,
  Database,
  Palette,
  LogOut,
  TrendingUp,
  Briefcase,
  Search,
  Plus,
  Trash2,
  ExternalLink,
  Bot,
  Loader2,
  Settings,
  MoreHorizontal,
  Clock,
  Play,
  Pause,
  Calendar,
  PieChart,
  Activity
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

interface AdminDashboardProps {
  jobs: JobSearchResult[];
  onUpdateJobs: (jobs: JobSearchResult[]) => void;
  userCount?: number;
  resumeCount?: number;
}

type Tab = 'overview' | 'jobs' | 'users' | 'templates';

// Simple internal SVG components for visualization
const SimpleLineChart = ({ data }: { data: { label: string; value: number }[] }) => {
  const height = 100;
  const width = 300;
  const maxVal = Math.max(...data.map(d => d.value), 1);
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - (d.value / maxVal) * height;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="w-full h-32 flex flex-col justify-end">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
        {/* Grid lines */}
        <line x1="0" y1="0" x2={width} y2="0" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="4 4" />
        <line x1="0" y1={height / 2} x2={width} y2={height / 2} stroke="#e2e8f0" strokeWidth="1" strokeDasharray="4 4" />
        <line x1="0" y1={height} x2={width} y2={height} stroke="#e2e8f0" strokeWidth="1" />

        {/* Line */}
        <polyline points={points} fill="none" stroke="#4f46e5" strokeWidth="2" />

        {/* Dots */}
        {data.map((d, i) => {
          const x = (i / (data.length - 1)) * width;
          const y = height - (d.value / maxVal) * height;
          return (
            <g key={i}>
              <circle cx={x} cy={y} r="3" fill="#fff" stroke="#4f46e5" strokeWidth="2" />
            </g>
          );
        })}
      </svg>
      <div className="flex justify-between mt-2 text-[10px] text-slate-400">
        {data.map((d, i) => <span key={i}>{d.label}</span>)}
      </div>
    </div>
  );
};

const SimplePieChart = ({ data }: { data: { label: string; value: number; color: string }[] }) => {
  const total = data.reduce((acc, curr) => acc + curr.value, 0);
  let cumulativePercent = 0;

  return (
    <div className="flex items-center gap-6">
      <div className="relative w-24 h-24 rounded-full flex-shrink-0">
        <svg viewBox="0 0 32 32" className="w-full h-full transform -rotate-90">
          {data.map((slice, i) => {
            const percent = slice.value / total;
            const dashArray = `${percent * 100} 100`;
            const offset = -(cumulativePercent * 100);
            cumulativePercent += percent;
            return (
              <circle
                key={i}
                r="16"
                cx="16"
                cy="16"
                fill="transparent"
                stroke={slice.color}
                strokeWidth="32" // Full pie
                strokeDasharray={dashArray}
                strokeDashoffset={offset}
              />
            );
          })}
        </svg>
      </div>
      <div className="space-y-1">
        {data.map((slice, i) => (
          <div key={i} className="flex items-center text-xs">
            <span className="w-2.5 h-2.5 rounded-full mr-2" style={{ backgroundColor: slice.color }}></span>
            <span className="text-slate-600 font-medium">{slice.label}</span>
            <span className="text-slate-400 ml-1">({Math.round((slice.value / total) * 100)}%)</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { globalJobs: jobs, setGlobalJobs: onUpdateJobs } = useJobs();
  const { resumes } = useResumes();
  const propUserCount = 1240;
  const propResumeCount = resumes.length + 5000;
  const [activeTab, setActiveTab] = useState<Tab>('overview');

  // Real Data State
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [tasks, setTasks] = useState<CrawlerTask[]>([]);
  const [templates, setTemplates] = useState<AdminTemplate[]>([]);
  const [dbJobs, setDbJobs] = useState<JobSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalJobs, setTotalJobs] = useState(0);
  const [page, setPage] = useState(1);
  const pageSize = 20;

  // Job Manager State
  const [crawlQuery, setCrawlQuery] = useState('');
  const [crawlSource, setCrawlSource] = useState('');
  const [isCrawling, setIsCrawling] = useState(false);
  const [newTaskFreq, setNewTaskFreq] = useState('Daily');

  // Chart Data State
  const [lineData, setLineData] = useState([
    { label: 'Mon', value: 12 },
    { label: 'Tue', value: 18 },
    { label: 'Wed', value: 10 },
    { label: 'Thu', value: 25 },
    { label: 'Fri', value: 32 },
    { label: 'Sat', value: 8 },
    { label: 'Sun', value: 15 },
  ]);

  // Derived Pie Data based on current jobs
  const pieData = React.useMemo(() => {
    const counts: Record<string, number> = { 'Manual': 0, 'AI Crawler': 0, 'External': 0 };
    dbJobs.forEach(j => {
      if (j.source === 'Manual') counts['Manual']++;
      else if (j.source === 'AI Crawler') counts['AI Crawler']++;
      else counts['External']++;
    });

    // Add mock data if empty for visualization
    const total = Object.values(counts).reduce((a, b) => a + b, 0);
    if (total < 5) return [
      { label: 'Manual Input', value: 30, color: '#6366f1' },
      { label: 'lagou', value: 45, color: '#0ea5e9' },
      { label: 'shixiseng', value: 25, color: '#ec4899' },
    ];

    return [
      { label: 'Manual', value: counts['Manual'] || 1, color: '#6366f1' }, // Indigo
      { label: 'AI Crawler', value: counts['AI Crawler'] || 1, color: '#8b5cf6' }, // Violet
      { label: 'Imported', value: counts['External'] || 0, color: '#10b981' }, // Emerald
    ];
  }, [dbJobs]);

  // --- Effects ---
  useEffect(() => {
    loadData();
  }, [activeTab, page]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'overview') {
        const s = await getStats();
        setStats(s);
      } else if (activeTab === 'users') {
        const u = await listUsers();
        setUsers(u);
      } else if (activeTab === 'jobs') {
        const t = await listCrawlerTasks();
        setTasks(t);
        const { jobs, total } = await listJobs(page, pageSize);
        setDbJobs(jobs);
        setTotalJobs(total);
      } else if (activeTab === 'templates') {
        const t = await listTemplates();
        setTemplates(t);
      }
    } catch (e) {
      console.error("Failed to load admin data", e);
    } finally {
      setLoading(false);
    }
  };

  // --- Handlers ---

  const handleCrawlJobs = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!crawlQuery.trim()) return;

    setIsCrawling(true);
    try {
      // Trigger backend crawler by creating a task (backend will execute it immediately)
      await createCrawlerTask({
        query: crawlQuery,
        source: crawlSource || 'shixiseng.com', // Default to a valid source
        frequency: 'Instant', // Mark as instant run
        status: 'Active'
      });

      // Update stats mock (optional)
      const today = new Date().toLocaleDateString('en-US', { weekday: 'short' });
      setLineData(prev => prev.map(p => p.label === today ? { ...p, value: p.value + 1 } : p));

      window.alert(`Crawler triggered for "${crawlQuery}". Data will appear shortly.`);
      setCrawlQuery('');

      // Wait a bit for crawler to start/finish (simple simulation)
      setTimeout(async () => {
        const { jobs, total } = await listJobs(page, pageSize);
        setDbJobs(jobs);
        setTotalJobs(total);
        // Refresh tasks list too
        const t = await listCrawlerTasks();
        setTasks(t);
      }, 2000);

    } catch (error) {
      console.error("Crawling failed", error);
      window.alert("Failed to trigger crawler. Please check API configuration.");
    } finally {
      setIsCrawling(false);
    }
  };

  const handleAddTask = async () => {
    if (!crawlQuery) return;
    try {
      const newTask = await createCrawlerTask({
        query: crawlQuery,
        source: crawlSource || 'All Sources',
        frequency: newTaskFreq,
        status: 'Active'
      });
      setTasks([newTask, ...tasks]);
      setCrawlQuery('');
    } catch (e) {
      console.error(e);
      alert("Failed to create task");
    }
  };

  const toggleTaskStatus = async (task: CrawlerTask) => {
    const newStatus = task.status === 'Active' ? 'Paused' : 'Active';
    try {
      await updateCrawlerTaskStatus(task.id, newStatus);
      setTasks(tasks.map(t => t.id === task.id ? { ...t, status: newStatus } : t));
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteTask = async (id: string) => {
    if (!confirm("Delete this task?")) return;
    try {
      await deleteCrawlerTask(id);
      setTasks(tasks.filter(t => t.id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteJob = async (id: string | number) => {
    if (!confirm("Delete this job?")) return;
    try {
      // Assuming id is string (UUID) or number (DB ID)
      await deleteJob(id.toString());
      setDbJobs(dbJobs.filter(j => j.id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  const toggleTemplateStatus = async (tpl: AdminTemplate) => {
    const newStatus = tpl.status === 'Active' ? 'Inactive' : 'Active';
    try {
      await updateTemplateStatus(tpl.id, newStatus);
      setTemplates(templates.map(t =>
        t.id === tpl.id ? { ...t, status: newStatus } : t
      ));
    } catch (e) {
      console.error(e);
    }
  };

  const handleUserRoleChange = async (user: AdminUser) => {
    const newRole = user.role === 'Admin' ? 'User' : 'Admin';
    if (!confirm(`Change role to ${newRole}?`)) return;
    try {
      await updateUserRole(user.id, newRole);
      setUsers(users.map(u => u.id === user.id ? { ...u, role: newRole } : u));
    } catch (e) {
      console.error(e);
    }
  };

  const handleUserStatusChange = async (user: AdminUser) => {
    const newStatus = user.status === 'Active' ? 'Inactive' : 'Active';
    if (!confirm(`${newStatus === 'Active' ? 'Activate' : 'Deactivate'} user?`)) return;
    try {
      await updateUserStatus(user.id, newStatus);
      setUsers(users.map(u => u.id === user.id ? { ...u, status: newStatus } : u));
    } catch (e) {
      console.error(e);
    }
  };

  // --- Renderers ---

  const SidebarItem = ({ id, icon: Icon, label }: { id: Tab, icon: any, label: string }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors rounded-lg mb-1 ${activeTab === id
        ? 'bg-indigo-600 text-white shadow-md'
        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
        }`}
    >
      <Icon size={18} />
      {label}
    </button>
  );

  return (
    <div className="w-full flex h-screen bg-slate-100 font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex-shrink-0 flex flex-col">
        <div className="h-16 flex items-center gap-2 px-6 border-b border-slate-800">
          <div className="w-7 h-7 bg-indigo-500 rounded flex items-center justify-center font-bold text-white">R</div>
          <span className="font-bold text-lg tracking-tight">Resume AI</span>
          <span className="text-[10px] bg-indigo-900 text-indigo-200 px-1.5 py-0.5 rounded ml-2 border border-indigo-700">ADMIN</span>
        </div>

        <div className="flex-1 p-4 overflow-y-auto">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 px-4">菜单</div>
          <SidebarItem id="overview" icon={LayoutDashboard} label="概览" />
          <SidebarItem id="jobs" icon={Database} label="职位数据库" />
          <SidebarItem id="users" icon={Users} label="用户管理" />
          <SidebarItem id="templates" icon={Palette} label="简历模版" />
        </div>

        <div className="p-4 border-t border-slate-800">
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-white rounded-lg transition-colors"
          >
            <LogOut size={18} /> 退出管理
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-slate-50">
        <header className="bg-white border-b border-slate-200 h-16 px-8 flex items-center justify-between sticky top-0 z-10">
          <h2 className="text-xl font-bold text-slate-800 capitalize">{activeTab}</h2>
          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100">
              <Settings size={20} />
            </button>
            <div className="w-8 h-8 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center text-indigo-700 font-bold text-sm">
              A
            </div>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto">
          {loading && (
            <div className="flex justify-center py-8">
              <Loader2 className="animate-spin text-indigo-600" size={32} />
            </div>
          )}

          {!loading && activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-lg"><Users size={24} /></div>
                  </div>
                  <h3 className="text-3xl font-bold text-slate-900">{stats?.userCount?.toLocaleString() || propUserCount}</h3>
                  <p className="text-sm text-slate-500">注册用户总数</p>
                </div>
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-purple-50 text-purple-600 rounded-lg"><Briefcase size={24} /></div>
                  </div>
                  <h3 className="text-3xl font-bold text-slate-900">{stats?.jobCount?.toLocaleString() || jobs.length.toLocaleString()}</h3>
                  <p className="text-sm text-slate-500">在线职位总数</p>
                </div>
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg"><TrendingUp size={24} /></div>
                  </div>
                  <h3 className="text-3xl font-bold text-slate-900">{stats?.resumeCount?.toLocaleString() || propResumeCount}</h3>
                  <p className="text-sm text-slate-500">生成的简历总数</p>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 font-semibold text-slate-800">系统活动日志</div>
                <div className="divide-y divide-slate-100">
                  {stats?.recentActivity?.map((act, i) => (
                    <div key={i} className="px-6 py-3 flex items-center justify-between text-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        <span className="text-slate-600">{act.action} <span className="font-medium text-slate-900">{act.user}</span></span>
                      </div>
                      <span className="text-slate-400">{act.time}</span>
                    </div>
                  ))}
                  {!stats?.recentActivity?.length && (
                    <div className="px-6 py-8 text-center text-slate-400">暂无最近活动</div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* JOB DATABASE TAB */}
          {!loading && activeTab === 'jobs' && (
            <div className="space-y-6">

              {/* Visualization Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                      <Activity size={16} className="text-indigo-600" /> 爬取频率（最近 7 天）
                    </h3>
                  </div>
                  <SimpleLineChart data={lineData} />
                </div>
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                      <PieChart size={16} className="text-indigo-600" /> 职位来源
                    </h3>
                  </div>
                  <SimplePieChart data={pieData} />
                </div>
              </div>

              {/* Crawler Controls */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Bot size={20} className="text-indigo-600" /> AI 职位爬虫配置
                  </h3>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Left: Instant / Add Task */}
                  <div className="lg:col-span-1 space-y-4 border-r border-slate-100 pr-0 lg:pr-8">
                    <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">新建任务 / 立即运行</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">职位关键词</label>
                        <input
                          type="text"
                          value={crawlQuery}
                          onChange={(e) => setCrawlQuery(e.target.value)}
                          placeholder="例如：软件工程师..."
                          className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">来源网站 (可选)</label>
                        <div className="relative">
                          <input
                            type="text"
                            value={crawlSource}
                            onChange={(e) => setCrawlSource(e.target.value)}
                            placeholder="例如：lagou.com"
                            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                          />
                          {/* Preset suggestions */}
                          <div className="absolute right-1 top-1.5 flex gap-1">
                            {['lagou.com', 'shixiseng.com'].map(site => (
                              <button key={site} onClick={() => setCrawlSource(site)} className="text-[10px] bg-slate-100 hover:bg-slate-200 px-1.5 py-0.5 rounded text-slate-600">
                                {site.split('.')[0]}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">运行周期</label>
                        <select
                          value={newTaskFreq}
                          onChange={(e) => setNewTaskFreq(e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none text-sm bg-white"
                        >
                          <option>每 6 小时</option>
                          <option>每 12 小时</option>
                          <option>每天</option>
                          <option>每周</option>
                        </select>
                      </div>

                      <div className="flex gap-2 pt-2">
                        <button
                          onClick={handleCrawlJobs}
                          disabled={isCrawling || !crawlQuery}
                          className="flex-1 bg-indigo-600 text-white py-2 rounded-md font-medium text-sm hover:bg-indigo-700 disabled:opacity-50 flex justify-center items-center gap-2"
                        >
                          {isCrawling ? <Loader2 className="animate-spin" size={16} /> : <Search size={16} />}
                          立即运行
                        </button>
                        <button
                          onClick={handleAddTask}
                          disabled={!crawlQuery}
                          className="flex-1 bg-white border border-slate-300 text-slate-700 py-2 rounded-md font-medium text-sm hover:bg-slate-50 flex justify-center items-center gap-2"
                        >
                          <Calendar size={16} />
                          计划运行
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Right: Scheduled Tasks List */}
                  <div className="lg:col-span-2">
                    <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">已计划的任务</h4>
                    <div className="bg-slate-50 rounded-lg border border-slate-200 overflow-hidden">
                      <table className="w-full text-sm text-left">
                        <thead className="bg-slate-100 text-xs text-slate-500 uppercase">
                          <tr>
                            <th className="px-4 py-2">关键词</th>
                            <th className="px-4 py-2">来源</th>
                            <th className="px-4 py-2">频率</th>
                            <th className="px-4 py-2">状态</th>
                            <th className="px-4 py-2 text-right">操作</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                          {tasks.map(task => (
                            <tr key={task.id} className="bg-white">
                              <td className="px-4 py-3 font-medium text-slate-900">{task.query}</td>
                              <td className="px-4 py-3 text-slate-500">{task.source}</td>
                              <td className="px-4 py-3 text-slate-500">{task.frequency}</td>
                              <td className="px-4 py-3">
                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${task.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                  {task.status === 'Active' ? '正在运行' : '已暂停'}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-right flex justify-end gap-2">
                                <button onClick={() => toggleTaskStatus(task)} className="p-1 text-slate-400 hover:text-indigo-600" title={task.status === 'Active' ? "暂停" : "恢复"}>
                                  {task.status === 'Active' ? <Pause size={14} /> : <Play size={14} />}
                                </button>
                                <button onClick={() => handleDeleteTask(task.id)} className="p-1 text-slate-400 hover:text-red-600" title="删除">
                                  <Trash2 size={14} />
                                </button>
                              </td>
                            </tr>
                          ))}
                          {tasks.length === 0 && (
                            <tr>
                              <td colSpan={5} className="px-4 py-8 text-center text-slate-400 text-xs">暂无计划任务。</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>

              {/* Job Listings Table */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                  <span className="font-semibold text-slate-800">职位列表 ({totalJobs})</span>
                  <div className="flex gap-2">
                    <button className="px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 rounded hover:bg-slate-200 transition-colors">导出 CSV</button>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left text-slate-600">
                    <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-100">
                      <tr>
                        <th className="px-6 py-3">职位</th>
                        <th className="px-6 py-3">公司</th>
                        <th className="px-6 py-3">地点</th>
                        <th className="px-6 py-3">链接</th>
                        <th className="px-6 py-3">来源</th>
                        <th className="px-6 py-3 text-right">操作</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {dbJobs.map((job) => (
                        <tr key={job.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4 font-medium text-slate-900">{job.title}</td>
                          <td className="px-6 py-4">{job.company}</td>
                          <td className="px-6 py-4">{job.location}</td>
                          <td className="px-6 py-4">{job.url}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${job.source === 'AI Crawler' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-600'}`}>
                              {job.source === 'AI Crawler' ? 'AI 爬虫' : (job.source || '手动')}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right flex justify-end gap-2">
                            {job.url && (
                              <a href={job.url} target="_blank" rel="noreferrer" className="p-1.5 text-slate-400 hover:text-blue-600 transition-colors" title="查看链接">
                                <ExternalLink size={16} />
                              </a>
                            )}
                            <button onClick={() => handleDeleteJob(job.id)} className="p-1.5 text-slate-400 hover:text-red-600 transition-colors" title="删除">
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50">
                  <div className="text-xs text-slate-500">
                    当前显示 <span className="font-medium">{(page - 1) * pageSize + 1}</span> 到 <span className="font-medium">{Math.min(page * pageSize, totalJobs)}</span> 条，共 <span className="font-medium">{totalJobs}</span> 条
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="px-3 py-1 bg-white border border-slate-300 rounded text-xs font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      上一页
                    </button>
                    <span className="flex items-center px-2 text-xs font-medium text-slate-600">
                      第 {page} 页
                    </span>
                    <button
                      onClick={() => setPage(p => p + 1)}
                      disabled={page * pageSize >= totalJobs}
                      className="px-3 py-1 bg-white border border-slate-300 rounded text-xs font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      下一页
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* USER MANAGEMENT TAB */}
          {!loading && activeTab === 'users' && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                <span className="font-semibold text-slate-800">所有用户</span>
                <button className="bg-slate-900 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-slate-800 transition-colors flex items-center gap-1">
                  <Plus size={14} /> 添加用户
                </button>
              </div>
              <table className="w-full text-sm text-left text-slate-600">
                <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-3">姓名</th>
                    <th className="px-6 py-3">角色</th>
                    <th className="px-6 py-3">状态</th>
                    <th className="px-6 py-3">加入时间</th>
                    <th className="px-6 py-3 text-right">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-medium text-slate-900">{user.nickname || '未设置昵称'}</span>
                          <span className="text-xs text-slate-400">{user.email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleUserRoleChange(user)}
                          className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium cursor-pointer hover:opacity-80 ${user.role === 'Admin' ? 'bg-purple-100 text-purple-800' : 'bg-slate-100 text-slate-800'}`}
                        >
                          {user.role === 'Admin' ? '管理员' : '普通用户'}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleUserStatusChange(user)}
                          className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium cursor-pointer hover:opacity-80 ${user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'Active' ? 'bg-green-600' : 'bg-red-600'}`}></span>
                          {user.status === 'Active' ? '激活' : '禁用'}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-slate-500">{user.joinedAt?.split('T')[0]}</td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-slate-400 hover:text-slate-600"><MoreHorizontal size={18} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* TEMPLATE MANAGER TAB */}
          {!loading && activeTab === 'templates' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {templates.map(t => (
                  <div key={t.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden group">
                    {/* Fake Preview */}
                    <div className="h-40 bg-slate-100 flex items-center justify-center relative">
                      <div className="w-24 h-32 bg-white shadow-md border border-slate-200 transform group-hover:scale-105 transition-transform">
                        <div className="w-full h-2 bg-slate-200 mb-2 mt-2"></div>
                        <div className="w-3/4 h-2 bg-slate-200 ml-2"></div>
                      </div>
                      <div className="absolute top-2 right-2">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${t.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                          {t.status === 'Active' ? '可用' : '禁用'}
                        </span>
                      </div>
                    </div>
                    <div className="p-4">
                      <h4 className="font-bold text-slate-900">{t.name === 'Modern' ? '现代经典' : t.name === 'Classic' ? '传统稳重' : t.name === 'Minimal' ? '极简主义' : t.name === 'Elegant' ? '优雅别致' : t.name === 'Compact' ? '紧凑高效' : t.name === 'Timeline' ? '时序脉络' : t.name}</h4>
                      <p className="text-xs text-slate-500 mb-4">{t.usageCount} 位活跃用户</p>
                      <div className="flex gap-2">
                        <button className="flex-1 px-3 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded hover:bg-slate-200 transition-colors">编辑</button>
                        <button
                          onClick={() => toggleTemplateStatus(t)}
                          className={`flex-1 px-3 py-2 text-xs font-bold rounded transition-colors ${t.status === 'Active' ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-green-50 text-green-600 hover:bg-green-100'}`}
                        >
                          {t.status === 'Active' ? '禁用' : '发布'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Add New Template Placeholder */}
                <button className="bg-slate-50 rounded-xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center h-full min-h-[250px] hover:bg-indigo-50 hover:border-indigo-300 transition-all text-slate-400 hover:text-indigo-600">
                  <Plus size={32} className="mb-2" />
                  <span className="font-medium">添加新模板</span>
                </button>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;