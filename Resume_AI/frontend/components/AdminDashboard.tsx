import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
  listTemplates, updateTemplateStatus, listJobs, deleteJob, deleteTemplate
} from '../services/adminApi';
import { useJobs } from '../context/JobContext';
import { useResumes } from '../context/ResumeContext';

// Decoupled Components
import OverviewTab from './admin/OverviewTab';
import JobsTab from './admin/JobsTab';
import UsersTab from './admin/UsersTab';
import TemplatesTab from './admin/TemplatesTab';
import AddUserModal from './admin/AddUserModal';
import AddTemplateModal from './admin/AddTemplateModal';
import ConfirmModal from './admin/ConfirmModal';

type Tab = 'overview' | 'jobs' | 'users' | 'templates';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { globalJobs: jobs } = useJobs();
  const { resumes } = useResumes();

  const { tab } = useParams<{ tab: string }>();
  const activeTab = (tab || 'overview') as Tab;
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

  // --- Modal State ---
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isAddTemplateModalOpen, setIsAddTemplateModalOpen] = useState(false);
  const [confirmState, setConfirmState] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: 'danger' | 'warning' | 'info';
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'warning',
    onConfirm: () => { },
  });

  const showConfirm = (title: string, message: string, onConfirm: () => void, type: 'danger' | 'warning' | 'info' = 'warning') => {
    setConfirmState({
      isOpen: true,
      title,
      message,
      type,
      onConfirm: () => {
        onConfirm();
        setConfirmState(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

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
    const colors = ['#0f172a', '#334155', '#475569', '#64748b', '#94a3b8', '#cbd5e1'];
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
    showConfirm("删除任务", "确定要永久移除此爬虫任务吗？", async () => {
      try {
        await deleteCrawlerTask(id);
        setTasks(tasks.filter(t => t.id !== id));
      } catch (e) { console.error(e); }
    }, 'danger');
  };

  const handleDeleteJob = async (id: string | number) => {
    showConfirm("删除职位", "确定要从数据库中移除此职位信息吗？", async () => {
      try {
        await deleteJob(id.toString());
        setDbJobs(dbJobs.filter(j => j.id !== id));
      } catch (e) { console.error(e); }
    }, 'danger');
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
    showConfirm(
      "变更权限",
      `确定将用户 "${user.nickname}" 的权限修改为 ${newRole === 'Admin' ? '管理员' : '普通用户'} 吗？`,
      async () => {
        try {
          await updateUserRole(user.id, newRole);
          setUsers(users.map(u => u.id === user.id ? { ...u, role: newRole } : u));
        } catch (e) { console.error(e); }
      }
    );
  };

  const handleUserStatusChange = async (user: AdminUser) => {
    const newStatus = user.status === 'Active' ? 'Inactive' : 'Active';
    showConfirm(
      newStatus === 'Active' ? "激活用户" : "禁用用户",
      `确定要${newStatus === 'Active' ? '激活' : '禁用'}用户 "${user.nickname}" 吗？`,
      async () => {
        try {
          await updateUserStatus(user.id, newStatus);
          setUsers(users.map(u => u.id === user.id ? { ...u, status: newStatus } : u));
        } catch (e) { console.error(e); }
      }
    );
  };

  const handleAddUser = async (user: Partial<AdminUser>) => {
    try {
      await import('../services/adminApi').then(api => api.createUser(user));
      const u = await listUsers();
      setUsers(u);
    } catch (e) {
      console.error(e);
      alert("Failed to add user");
    }
  };

  const handleDeleteUser = async (id: number) => {
    showConfirm("彻底删除用户", "确定要永久删除该用户吗？此操作将无法撤销，其关联数据可能会受到影响。", async () => {
      try {
        await import('../services/adminApi').then(api => api.deleteUser(id));
        setUsers(users.filter(u => u.id !== id));
      } catch (e) {
        console.error(e);
        alert("Failed to delete user");
      }
    }, 'danger');
  };

  const handleAddTemplate = async (template: Partial<AdminTemplate>) => {
    try {
      await import('../services/adminApi').then(api => api.createTemplate(template));
      const t = await listTemplates();
      setTemplates(t);
    } catch (e) {
      console.error(e);
      alert("Failed to add template");
    }
  };

  const handleDeleteTemplate = async (id: number) => {
    showConfirm("删除模板", "确定要移除此简历模板吗？", async () => {
      try {
        await deleteTemplate(id);
        setTemplates(templates.filter(t => t.id !== id));
      } catch (e) {
        console.error(e);
        alert("Failed to delete template");
      }
    }, 'danger');
  };


  return (
    <div className="w-full h-full bg-white relative">
      <div className="p-8 max-w-7xl mx-auto relative z-10">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight uppercase">{activeTab}</h1>
            <p className="text-slate-500 mt-1 font-medium">管理后台系统设置与监控</p>
          </div>
        </div>
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-center py-20"
            >
              <Loader2 className="animate-spin text-slate-900" size={32} />
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
                  propUserCount={0}
                  propResumeCount={0}
                  jobsCount={0}
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
                  onAddClick={() => setIsAddUserModalOpen(true)}
                  onDeleteClick={handleDeleteUser}
                />
              )}
              {activeTab === 'templates' && (
                <TemplatesTab
                  templates={templates}
                  toggleTemplateStatus={toggleTemplateStatus}
                  onAddClick={() => setIsAddTemplateModalOpen(true)}
                  onDeleteClick={handleDeleteTemplate}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AddUserModal
        isOpen={isAddUserModalOpen}
        onClose={() => setIsAddUserModalOpen(false)}
        onAdd={handleAddUser}
      />

      <AddTemplateModal
        isOpen={isAddTemplateModalOpen}
        onClose={() => setIsAddTemplateModalOpen(false)}
        onAdd={handleAddTemplate}
      />

      <ConfirmModal
        isOpen={confirmState.isOpen}
        title={confirmState.title}
        message={confirmState.message}
        type={confirmState.type}
        onConfirm={confirmState.onConfirm}
        onCancel={() => setConfirmState(prev => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
};

export default AdminDashboard;