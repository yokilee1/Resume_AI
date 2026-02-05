import React from 'react';
import { motion } from 'framer-motion';
import { Users, Briefcase, TrendingUp } from 'lucide-react';
import { AdminStats } from '../../types';

interface OverviewTabProps {
    stats: AdminStats | null;
    propUserCount: number;
    propResumeCount: number;
    jobsCount: number;
}

const OverviewTab: React.FC<OverviewTabProps> = ({ stats, propUserCount, propResumeCount, jobsCount }) => {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: '注册用户总数', value: stats?.userCount || propUserCount, icon: Users, color: 'blue' },
                    { label: '在线职位总数', value: stats?.jobCount || jobsCount, icon: Briefcase, color: 'purple' },
                    { label: '生成的简历总数', value: stats?.resumeCount || propResumeCount, icon: TrendingUp, color: 'indigo' }
                ].map((stat, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        whileHover={{ y: -5 }}
                        className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all group"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 bg-${stat.color}-50 text-${stat.color}-600 rounded-xl group-hover:scale-110 transition-transform`}>
                                <stat.icon size={24} />
                            </div>
                        </div>
                        <div className="text-3xl font-black text-slate-900 tracking-tight tabular-nums">
                            {(stat.value || 0).toLocaleString()}
                        </div>
                        <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mt-1">{stat.label}</p>
                    </motion.div>
                ))}
            </div>

            {/* Recent Activity */}
            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
            >
                <div className="px-6 py-4 border-b border-slate-100 font-bold text-slate-900 flex items-center gap-2">
                    <div className="w-1 h-4 bg-indigo-600 rounded-full"></div>
                    系统活动日志
                </div>
                <div className="divide-y divide-slate-100">
                    {stats?.recentActivity?.map((act, i) => (
                        <motion.div
                            key={i}
                            initial={{ x: -10, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.4 + i * 0.05 }}
                            className="px-6 py-4 flex items-center justify-between text-sm hover:bg-slate-50 transition-colors"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                <span className="text-slate-600 font-medium">{act.action} <span className="font-bold text-slate-900 underline decoration-indigo-200 underline-offset-2">{act.user}</span></span>
                            </div>
                            <span className="text-slate-400 font-bold tabular-nums">{act.time}</span>
                        </motion.div>
                    ))}
                    {!stats?.recentActivity?.length && (
                        <div className="px-6 py-12 text-center text-slate-400 font-bold">暂无最近活动</div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default OverviewTab;
