import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Users, Database, Palette, LogOut,
  Settings, Loader2
} from 'lucide-react';

// Types and Services
import { JobSearchResult, AdminUser, AdminStats, CrawlerTask, AdminTemplate } from '../types';
import {
  getStats, listUsers, updateUserRole, updateUserStatus,
  listCrawlerTasks, createCrawlerTask, deleteCrawlerTask, updateCrawlerTaskStatus,
  listTemplates, updateTemplateStatus, listJobs, deleteJob
} from '../services/adminApi';
import { useJobs } from '../context/JobContext';
import { useResumes } from '../context/ResumeContext';

// Decoupled Components
import OverviewTab from './admin/OverviewTab';
import JobsTab from './admin/JobsTab';
import UsersTab from './admin/UsersTab';
import TemplatesTab from './admin/TemplatesTab';

type Tab = 'overview' | 'jobs' | 'users' | 'templates';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { globalJobs: jobs } = useJobs();
  const { resumes } = useResumes();
  const propUserCount = 1240;
  const propResumeCount = resumes.length + 5000;

  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [loading, setLoading] = useState(false);

  // --- Real Data State ---
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [tasks, setTasks] = useState<CrawlerTask[]>([]);
  const [templates, setTemplates] = useState<AdminTemplate[]>([]);
  const [dbJobs, setDbJobs] = useState<JobSearchResult[]>([]);
  const [totalJobs, setTotalJobs] = useState(0);
  const [page, setPage] = useState(1);
  const pageSize = 20;

  // --- Job Manager State ---
  const [crawlQuery, setCrawlQuery] = useState('');
  const [crawlSource, setCrawlSource] = useState('');
  const [isCrawling, setIsCrawling] = useState(false);
  const [newTaskFreq, setNewTaskFreq] = useState('Daily');
  // Transform backend stats to chart format
  const chartLineData = React.useMemo(() => {
    if (!stats?.crawlTrend) return [];
    return stats.crawlTrend.map(d => ({ label: d.date, value: d.count }));
  }, [stats]);

  const chartPieData = React.useMemo(() => {
    if (!stats?.sourceDistribution) return [];
    const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#3b82f6'];
    return stats.sourceDistribution.map((d, i) => ({
      label: d.source,
      value: d.count,
      color: colors[i % colors.length]
    }));
  }, [stats]);

  // --- Effects ---
  useEffect(() => {
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
          const s = await getStats(); // Ensure we have stats for the charts in Jobs tab
          setStats(s);
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
    loadData();
  }, [activeTab, page, pageSize]);

  // --- Handlers ---
  const handleCrawlJobs = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!crawlQuery.trim()) return;
    setIsCrawling(true);
    try {
      await createCrawlerTask({
        query: crawlQuery,
        source: crawlSource || 'shixiseng.com',
        frequency: 'Instant',
        status: 'Active'
      });
      // Update stats if needed (re-fetch or optimistic update)
      // For now, we rely on the next loadData or we can optimistically update chartLineData if we move it to state
      // Update stats if needed (re-fetch or optimistic update)
      // For now, we rely on the next loadData or we can optimistically update chartLineData if we move it to state
      // setLineData(prev => prev.map(p => p.label === today ? { ...p, value: p.value + 1 } : p));
      window.alert(`Crawler triggered for "${crawlQuery}".`);
      setCrawlQuery('');
      setTimeout(async () => {
        const { jobs, total } = await listJobs(page, pageSize);
        setDbJobs(jobs);
        setTotalJobs(total);
        const t = await listCrawlerTasks();
        setTasks(t);
      }, 2000);
    } catch (error) {
      console.error("Crawling failed", error);
      window.alert("Failed to trigger crawler.");
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
    try {
      const newStatus = task.status === 'Active' ? 'Paused' : 'Active';
      await updateCrawlerTaskStatus(task.id, newStatus);
      setTasks(tasks.map(t => t.id === task.id ? { ...t, status: newStatus } : t));
    } catch (e) { console.error(e); }
  };

  const handleDeleteTask = async (id: string) => {
    if (!confirm("Delete this task?")) return;
    try {
      await deleteCrawlerTask(id);
      setTasks(tasks.filter(t => t.id !== id));
    } catch (e) { console.error(e); }
  };

  const handleDeleteJob = async (id: string | number) => {
    if (!confirm("Delete this job?")) return;
    try {
      await deleteJob(id.toString());
      setDbJobs(dbJobs.filter(j => j.id !== id));
    } catch (e) { console.error(e); }
  };

  const toggleTemplateStatus = async (tpl: AdminTemplate) => {
    try {
      const newStatus = tpl.status === 'Active' ? 'Inactive' : 'Active';
      await updateTemplateStatus(tpl.id, newStatus);
      setTemplates(templates.map(t => t.id === tpl.id ? { ...t, status: newStatus } : t));
    } catch (e) { console.error(e); }
  };

  const handleUserRoleChange = async (user: AdminUser) => {
    const newRole = user.role === 'Admin' ? 'User' : 'Admin';
    if (!confirm(`Change role to ${newRole}?`)) return;
    try {
      await updateUserRole(user.id, newRole);
      setUsers(users.map(u => u.id === user.id ? { ...u, role: newRole } : u));
    } catch (e) { console.error(e); }
  };

  const handleUserStatusChange = async (user: AdminUser) => {
    const newStatus = user.status === 'Active' ? 'Inactive' : 'Active';
    if (!confirm(`${newStatus === 'Active' ? 'Activate' : 'Deactivate'} user?`)) return;
    try {
      await updateUserStatus(user.id, newStatus);
      setUsers(users.map(u => u.id === user.id ? { ...u, status: newStatus } : u));
    } catch (e) { console.error(e); }
  };

  const SidebarItem = ({ id, icon: Icon, label }: { id: Tab, icon: any, label: string }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold transition-all rounded-xl mb-2 relative group overflow-hidden ${activeTab === id
        ? 'text-indigo-600 shadow-lg shadow-indigo-100'
        : 'text-slate-500 hover:text-indigo-600 hover:bg-white/50'
        }`}
    >
      {activeTab === id && (
        <motion.div
          layoutId="sidebar-active"
          className="absolute inset-0 bg-white/80 backdrop-blur-sm border border-white/50"
          initial={false}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      )}
      <Icon size={18} className={`relative z-10 transition-transform group-hover:scale-110 ${activeTab === id ? 'text-indigo-600' : 'text-slate-400 group-hover:text-indigo-600'}`} />
      <span className="relative z-10">{label}</span>
    </button>
  );

  return (
    <div className="w-full flex h-screen bg-slate-50 font-sans overflow-hidden">
      {/* 
        GLASSMORPHISM SIDEBAR 
        Using backdrop-blur and semi-transparent colors
      */}
      <aside className="w-64 bg-white/60 backdrop-blur-2xl text-slate-800 flex-shrink-0 flex flex-col border-r border-white/50 shadow-2xl relative z-20">
        {/* Simple background pattern for depth */}
        <div className="absolute inset-0 pointer-events-none opacity-40 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.8),transparent_50%)]"></div>

        <div className="h-16 flex items-center gap-2 px-6 border-b border-indigo-50/50 relative z-10">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-black text-white shadow-lg shadow-indigo-200">R</div>
          <span className="font-black text-lg tracking-tighter text-slate-800">Resume AI</span>
          <span className="text-[10px] bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full ml-auto font-bold border border-indigo-100 uppercase tracking-widest">Admin</span>
        </div>

        <div className="flex-1 p-4 overflow-y-auto relative z-10">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 px-4">菜单</div>
          <SidebarItem id="overview" icon={LayoutDashboard} label="概览" />
          <SidebarItem id="jobs" icon={Database} label="职位数据库" />
          <SidebarItem id="users" icon={Users} label="用户管理" />
          <SidebarItem id="templates" icon={Palette} label="简历模版" />
        </div>

        <div className="p-4 border-t border-indigo-50/50 relative z-10">
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-500 hover:bg-white/50 hover:text-indigo-600 rounded-lg transition-colors border border-transparent hover:border-white/60"
          >
            <LogOut size={18} /> 退出管理
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-slate-50 relative">
        {/* Background Ambience */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-indigo-100/40 rounded-full blur-[120px] opacity-60"></div>
          <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-purple-100/40 rounded-full blur-[100px] opacity-40"></div>
        </div>

        <header className="bg-white/70 backdrop-blur-md border-b border-slate-200/60 h-16 px-8 flex items-center justify-between sticky top-0 z-20 shadow-sm">
          <h2 className="text-lg font-black text-slate-900 tracking-tight uppercase">{activeTab}</h2>
          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-400 hover:text-indigo-600 rounded-full hover:bg-slate-100/50 transition-all">
              <Settings size={20} />
            </button>
            <div className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-white font-black text-xs shadow-lg shadow-slate-200">
              A
            </div>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto relative z-10">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex justify-center py-20"
              >
                <Loader2 className="animate-spin text-indigo-600" size={32} />
              </motion.div>
            ) : (
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                {activeTab === 'overview' && (
                  <OverviewTab
                    stats={stats}
                    propUserCount={propUserCount}
                    propResumeCount={propResumeCount}
                    jobsCount={jobs.length}
                  />
                )}
                {activeTab === 'jobs' && (
                  <JobsTab
                    lineData={chartLineData} pieData={chartPieData}
                    crawlQuery={crawlQuery} setCrawlQuery={setCrawlQuery}
                    crawlSource={crawlSource} setCrawlSource={setCrawlSource}
                    newTaskFreq={newTaskFreq} setNewTaskFreq={setNewTaskFreq}
                    isCrawling={isCrawling} handleCrawlJobs={handleCrawlJobs}
                    handleAddTask={handleAddTask} tasks={tasks}
                    toggleTaskStatus={toggleTaskStatus} handleDeleteTask={handleDeleteTask}
                    totalJobs={totalJobs} dbJobs={dbJobs}
                    page={page} setPage={setPage} pageSize={pageSize}
                    handleDeleteJob={handleDeleteJob}
                  />
                )}
                {activeTab === 'users' && (
                  <UsersTab
                    users={users}
                    handleUserRoleChange={handleUserRoleChange}
                    handleUserStatusChange={handleUserStatusChange}
                  />
                )}
                {activeTab === 'templates' && (
                  <TemplatesTab
                    templates={templates}
                    toggleTemplateStatus={toggleTemplateStatus}
                  />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;