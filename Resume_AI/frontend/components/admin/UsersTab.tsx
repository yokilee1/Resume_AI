import React from 'react';
import { motion } from 'framer-motion';
import { Plus, MoreHorizontal } from 'lucide-react';
import { AdminUser } from '../../types';

interface UsersTabProps {
    users: AdminUser[];
    handleUserRoleChange: (user: AdminUser) => Promise<void>;
    handleUserStatusChange: (user: AdminUser) => Promise<void>;
}

const UsersTab: React.FC<UsersTabProps> = ({ users, handleUserRoleChange, handleUserStatusChange }) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.99 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
        >
            <div className="px-8 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <span className="font-black text-slate-900 tracking-tight text-lg">所有用户管理</span>
                <button className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-xs font-black shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center gap-2">
                    <Plus size={16} /> 添加新用户
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-slate-600">
                    <thead className="text-[10px] text-slate-500 uppercase font-black bg-slate-100/50 border-b border-slate-100 tracking-widest">
                        <tr>
                            <th className="px-8 py-4">用户信息</th>
                            <th className="px-8 py-4">职位角色</th>
                            <th className="px-8 py-4">状态控制</th>
                            <th className="px-8 py-4">加入日期</th>
                            <th className="px-8 py-4 text-right">操作</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {users.map((user, idx) => (
                            <motion.tr
                                key={user.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className="hover:bg-slate-50/50 transition-colors"
                            >
                                <td className="px-8 py-5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white font-black text-xs">
                                            {user.nickname?.substring(0, 1) || 'U'}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-bold text-slate-900">{user.nickname || '未设置昵称'}</span>
                                            <span className="text-xs text-slate-400 font-medium">{user.email}</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-5">
                                    <button
                                        onClick={() => handleUserRoleChange(user)}
                                        className={`inline-flex items-center px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest cursor-pointer transition-all ${user.role === 'Admin' ? 'bg-indigo-100 text-indigo-700 border border-indigo-200' : 'bg-slate-100 text-slate-600 border border-slate-200'}`}
                                    >
                                        {user.role === 'Admin' ? '管理员' : '普通用户'}
                                    </button>
                                </td>
                                <td className="px-8 py-5">
                                    <button
                                        onClick={() => handleUserStatusChange(user)}
                                        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest cursor-pointer transition-all ${user.status === 'Active' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}
                                    >
                                        <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'Active' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
                                        {user.status === 'Active' ? '已激活' : '已禁用'}
                                    </button>
                                </td>
                                <td className="px-8 py-5 text-slate-500 font-bold tabular-nums">{user.joinedAt?.split('T')[0]}</td>
                                <td className="px-8 py-5 text-right">
                                    <button className="p-2 text-slate-400 hover:text-slate-900 hover:bg-white rounded-xl border border-transparent hover:border-slate-200 transition-all shadow-sm">
                                        <MoreHorizontal size={18} />
                                    </button>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </motion.div>
    );
};

export default UsersTab;
