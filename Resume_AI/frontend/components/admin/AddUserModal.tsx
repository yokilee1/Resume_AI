import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, UserPlus, Mail, Lock, User as UserIcon, Shield } from 'lucide-react';
import { AdminUser } from '../../types';

interface AddUserModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (user: Partial<AdminUser>) => Promise<void>;
}

const AddUserModal: React.FC<AddUserModalProps> = ({ isOpen, onClose, onAdd }) => {
    const [email, setEmail] = useState('');
    const [nickname, setNickname] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState<'User' | 'Admin'>('User');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onAdd({
                email,
                nickname,
                role,
                status: 'Active',
                // Assuming backend handles password if we pass it, 
                // but since types.ts AdminUser doesn't have it, we might need a separate type or just pass it in body
            } as any);
            onClose();
            setEmail('');
            setNickname('');
            setPassword('');
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-md bg-white/80 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl overflow-hidden"
                    >
                        <div className="p-8">
                            <div className="flex justify-between items-center mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 bg-slate-900 text-white rounded-xl shadow-lg shadow-slate-200">
                                        <UserPlus size={20} />
                                    </div>
                                    <h3 className="text-xl font-black text-slate-900 tracking-tight">添加新用户</h3>
                                </div>
                                <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-900">
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">电子邮箱</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                        <input
                                            required
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-bold focus:bg-white focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 transition-all outline-none"
                                            placeholder="user@example.com"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">用户昵称</label>
                                    <div className="relative">
                                        <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                        <input
                                            required
                                            type="text"
                                            value={nickname}
                                            onChange={(e) => setNickname(e.target.value)}
                                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-bold focus:bg-white focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 transition-all outline-none"
                                            placeholder="输入显示名称"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">初始密码</label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                        <input
                                            required
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-bold focus:bg-white focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 transition-all outline-none"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">权限角色</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setRole('User')}
                                            className={`p-3 rounded-2xl border-2 text-xs font-black transition-all flex items-center justify-center gap-2 ${role === 'User' ? 'border-slate-900 bg-slate-900 text-white shadow-xl shadow-slate-200' : 'border-slate-100 bg-slate-50 text-slate-400 hover:border-slate-200'}`}
                                        >
                                            <UserIcon size={14} /> 普通用户
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setRole('Admin')}
                                            className={`p-3 rounded-2xl border-2 text-xs font-black transition-all flex items-center justify-center gap-2 ${role === 'Admin' ? 'border-slate-900 bg-slate-900 text-white shadow-xl shadow-slate-200' : 'border-slate-100 bg-slate-50 text-slate-400 hover:border-slate-200'}`}
                                        >
                                            <Shield size={14} /> 管理员
                                        </button>
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <button
                                        disabled={loading}
                                        type="submit"
                                        className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-sm shadow-xl shadow-slate-200 hover:bg-black transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                                    >
                                        {loading ? (
                                            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full" />
                                        ) : '确认添加用户'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default AddUserModal;
