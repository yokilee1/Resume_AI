import React from 'react';
import { motion } from 'framer-motion';
import {
    Activity, PieChart, Bot, Loader2, Search, Calendar,
    Pause, Play, Trash2, ExternalLink, ChevronRight
} from 'lucide-react';
import { SimpleLineChart, SimplePieChart } from './AdminCharts';
import { JobSearchResult, CrawlerTask } from '../../types';

interface JobsTabProps {
    lineData: { label: string; value: number }[];
    pieData: { label: string; value: number; color: string }[];
    crawlQuery: string;
    setCrawlQuery: (val: string) => void;
    crawlSource: string;
    setCrawlSource: (val: string) => void;
    newTaskFreq: string;
    setNewTaskFreq: (val: string) => void;
    isCrawling: boolean;
    handleCrawlJobs: (e: React.FormEvent) => Promise<void>;
    handleAddTask: () => Promise<void>;
    tasks: CrawlerTask[];
    toggleTaskStatus: (task: CrawlerTask) => Promise<void>;
    handleDeleteTask: (id: string) => Promise<void>;
    totalJobs: number;
    dbJobs: JobSearchResult[];
    page: number;
    setPage: (val: React.SetStateAction<number>) => void;
    pageSize: number;
    handleDeleteJob: (id: string | number) => Promise<void>;
}

const JobsTab: React.FC<JobsTabProps> = ({
    lineData, pieData, crawlQuery, setCrawlQuery, crawlSource, setCrawlSource,
    newTaskFreq, setNewTaskFreq, isCrawling, handleCrawlJobs, handleAddTask,
    tasks, toggleTaskStatus, handleDeleteTask, totalJobs, dbJobs, page, setPage,
    pageSize, handleDeleteJob
}) => {
    return (
        <div className="space-y-6">
            {/* Visualization Section */}
            {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            </div> */}

            {/* Crawler Controls */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm"
            >
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                        <Bot size={24} className="text-indigo-600" /> AI 职位爬虫配置
                    </h3>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Left: Instant / Add Task */}
                    <div className="lg:col-span-1 space-y-6 border-r border-slate-100 lg:pr-10">
                        <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">新建任务 / 立即运行</h4>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-tight">职位关键词</label>
                                <input
                                    type="text"
                                    value={crawlQuery}
                                    onChange={(e) => setCrawlQuery(e.target.value)}
                                    placeholder="例如：软件工程师..."
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white outline-none text-sm transition-all font-medium"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-tight">来源网站 (可选)</label>
                                <div className="relative group">
                                    <input
                                        type="text"
                                        value={crawlSource}
                                        onChange={(e) => setCrawlSource(e.target.value)}
                                        placeholder="例如：lagou.com"
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white outline-none text-sm transition-all font-medium"
                                    />
                                    <div className="absolute right-2 top-2 flex gap-1">
                                        {['lagou.com', 'shixiseng.com'].map(site => (
                                            <button key={site} onClick={() => setCrawlSource(site)} className="text-[10px] bg-white border border-slate-200 hover:border-indigo-300 hover:text-indigo-600 px-2 py-1 rounded-lg text-slate-500 font-bold transition-all shadow-sm">
                                                {site.split('.')[0]}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-tight">运行周期</label>
                                <select
                                    value={newTaskFreq}
                                    onChange={(e) => setNewTaskFreq(e.target.value)}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white outline-none text-sm transition-all font-bold appearance-none cursor-pointer"
                                >
                                    <option>每 6 小时</option>
                                    <option>每 12 小时</option>
                                    <option>每天</option>
                                    <option>每周</option>
                                </select>
                            </div>

                            <div className="flex flex-col gap-3 pt-4">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleCrawlJobs}
                                    disabled={isCrawling || !crawlQuery}
                                    className="w-full bg-indigo-600 text-white py-3.5 rounded-xl font-black text-sm hover:bg-indigo-700 disabled:opacity-50 flex justify-center items-center gap-2 shadow-lg shadow-indigo-200"
                                >
                                    {isCrawling ? <Loader2 className="animate-spin" size={18} /> : <Search size={18} />}
                                    立即运行爬虫
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleAddTask}
                                    disabled={!crawlQuery}
                                    className="w-full bg-white border border-slate-200 text-slate-700 py-3.5 rounded-xl font-black text-sm hover:bg-slate-50 flex justify-center items-center gap-2 shadow-sm transition-all"
                                >
                                    <Calendar size={18} />
                                    计划重复任务
                                </motion.button>
                            </div>
                        </div>
                    </div>

                    {/* Right: Scheduled Tasks List */}
                    <div className="lg:col-span-2">
                        <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">正在运行的任务</h4>
                        <div className="bg-slate-50/50 rounded-2xl border border-slate-200 overflow-hidden shadow-inner">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-slate-100/80 text-[10px] text-slate-500 uppercase font-black tracking-widest">
                                    <tr>
                                        <th className="px-6 py-4">关键词</th>
                                        <th className="px-6 py-4">频率</th>
                                        <th className="px-6 py-4">状态</th>
                                        <th className="px-6 py-4 text-right">管理</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200/50">
                                    {tasks.map((task, idx) => (
                                        <motion.tr
                                            key={task.id}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.05 }}
                                            className="bg-white/50 hover:bg-white transition-colors"
                                        >
                                            <td className="px-6 py-4 font-bold text-slate-900">
                                                <div className="flex flex-col">
                                                    <span>{task.query}</span>
                                                    <span className="text-[10px] text-slate-400">{task.source}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-slate-500 font-bold">{task.frequency}</td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${task.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${task.status === 'Active' ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`}></span>
                                                    {task.status === 'Active' ? 'Running' : 'Paused'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right flex justify-end gap-3">
                                                <button onClick={() => toggleTaskStatus(task)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all" title={task.status === 'Active' ? "暂停" : "恢复"}>
                                                    {task.status === 'Active' ? <Pause size={16} /> : <Play size={16} />}
                                                </button>
                                                <button onClick={() => handleDeleteTask(task.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all" title="删除">
                                                    <Trash2 size={16} />
                                                </button>
                                            </td>
                                        </motion.tr>
                                    ))}
                                    {tasks.length === 0 && (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-12 text-center text-slate-400 font-bold text-xs uppercase tracking-widest bg-white/50">暂无可执行任务</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Job Listings Table */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
            >
                <div className="px-8 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <span className="font-black text-slate-900 tracking-tight">职位列表 <span className="text-indigo-600 ml-1">({totalJobs})</span></span>
                    <div className="flex gap-3">
                        <button className="px-4 py-2 text-xs font-black text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all shadow-sm">导出 CSV</button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-slate-600">
                        <thead className="text-[10px] text-slate-500 uppercase font-black bg-slate-100/50 border-b border-slate-100 tracking-widest">
                            <tr>
                                <th className="px-8 py-4">职位</th>
                                <th className="px-8 py-4">公司</th>
                                <th className="px-8 py-4">地点</th>
                                <th className="px-8 py-4">来源</th>
                                <th className="px-8 py-4 text-right">管理</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {dbJobs.map((job, idx) => (
                                <motion.tr
                                    key={job.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: idx * 0.03 }}
                                    className="hover:bg-indigo-50/30 transition-colors group"
                                >
                                    <td className="px-8 py-5 font-bold text-slate-900">
                                        <div className="flex flex-col">
                                            <span className="line-clamp-1">{job.title}</span>
                                            {job.url && <span className="text-[10px] text-indigo-400 font-medium line-clamp-1 opacity-0 group-hover:opacity-100 transition-opacity">{job.url}</span>}
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 font-medium">{job.company}</td>
                                    <td className="px-8 py-5 text-slate-500 font-medium">{job.location}</td>
                                    <td className="px-8 py-5">
                                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-tight ${job.source === 'AI Crawler' ? 'bg-indigo-50 text-indigo-600 border border-indigo-100' : 'bg-slate-50 text-slate-500 border border-slate-200'}`}>
                                            {job.source === 'AI Crawler' ? 'AI 爬虫' : (job.source || '手动')}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5 text-right flex justify-end gap-3">
                                        {job.url && (
                                            <a href={job.url} target="_blank" rel="noreferrer" className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-xl transition-all shadow-sm border border-transparent hover:border-slate-100" title="查看链接">
                                                <ExternalLink size={16} />
                                            </a>
                                        )}
                                        <button onClick={() => handleDeleteJob(job.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-white rounded-xl transition-all shadow-sm border border-transparent hover:border-slate-100" title="删除">
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="px-8 py-5 border-t border-slate-100 flex items-center justify-between bg-white">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                        Page <span className="text-slate-900">{page}</span> of <span className="text-slate-900">{Math.ceil(totalJobs / pageSize)}</span>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => setPage(p => Math.max(1, (p as number) - 1))}
                            disabled={page === 1}
                            className="p-2 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 disabled:opacity-30 transition-all shadow-sm"
                        >
                            <ChevronRight size={18} className="rotate-180" />
                        </button>
                        <button
                            onClick={() => setPage(p => (p as number) + 1)}
                            disabled={page * pageSize >= totalJobs}
                            className="p-2 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 disabled:opacity-30 transition-all shadow-sm"
                        >
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default JobsTab;
