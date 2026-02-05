import React from 'react';
import { motion } from 'framer-motion';
import { Palette, Activity, Plus } from 'lucide-react';
import { AdminTemplate } from '../../types';

interface TemplatesTabProps {
    templates: AdminTemplate[];
    toggleTemplateStatus: (tpl: AdminTemplate) => Promise<void>;
}

const TemplatesTab: React.FC<TemplatesTabProps> = ({ templates, toggleTemplateStatus }) => {
    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {templates.map((t, idx) => (
                    <motion.div
                        key={t.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden group hover:shadow-xl hover:border-indigo-100 transition-all"
                    >
                        {/* Fake Preview */}
                        <div className="h-48 bg-slate-50 flex items-center justify-center relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5"></div>
                            <div className="w-28 h-36 bg-white shadow-xl border border-slate-100 transform group-hover:scale-110 group-hover:rotate-2 transition-transform duration-500 p-2">
                                <div className="w-full h-1 bg-slate-100 mb-2"></div>
                                <div className="w-1/2 h-1 bg-slate-50 mb-4"></div>
                                <div className="space-y-1">
                                    {[1, 2, 3, 4, 5].map(i => <div key={i} className="w-full h-0.5 bg-slate-50"></div>)}
                                </div>
                            </div>
                            <div className="absolute top-4 right-4">
                                <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${t.status === 'Active' ? 'bg-green-500 text-white shadow-lg shadow-green-200' : 'bg-slate-200 text-slate-500'}`}>
                                    {t.status === 'Active' ? 'ONLINE' : 'OFFLINE'}
                                </span>
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-2">
                                <h4 className="font-black text-slate-900 text-lg tracking-tight">
                                    {t.name === 'Modern' ? '现代经典' : t.name === 'Classic' ? '传统稳重' : t.name === 'Minimal' ? '极简主义' : t.name === 'Elegant' ? '优雅别致' : t.name === 'Compact' ? '紧凑高效' : t.name === 'Timeline' ? '时序脉络' : t.name}
                                </h4>
                                <span className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg"><Palette size={14} /></span>
                            </div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                                <Activity size={12} className="text-green-500" /> {(t.usageCount || 0).toLocaleString()} 位活跃用户
                            </p>
                            <div className="flex gap-3">
                                <button className="flex-1 px-4 py-2.5 bg-slate-50 text-slate-800 text-xs font-black rounded-xl hover:bg-slate-100 transition-all border border-slate-100">配置</button>
                                <button
                                    onClick={() => toggleTemplateStatus(t)}
                                    className={`flex-1 px-4 py-2.5 text-xs font-black rounded-xl transition-all shadow-lg ${t.status === 'Active' ? 'bg-white border border-red-100 text-red-600 shadow-red-50 hover:bg-red-50' : 'bg-indigo-600 text-white shadow-indigo-100 hover:bg-indigo-700'}`}
                                >
                                    {t.status === 'Active' ? '下架' : '发布'}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}

                {/* Add New Template Placeholder */}
                <motion.button
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: templates.length * 0.1 }}
                    className="bg-slate-50/50 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center h-full min-h-[300px] hover:bg-indigo-50/50 hover:border-indigo-300 transition-all group"
                >
                    <div className="p-4 bg-white rounded-2xl shadow-sm border border-slate-100 group-hover:scale-110 transition-transform text-slate-400 group-hover:text-indigo-600">
                        <Plus size={32} />
                    </div>
                    <span className="font-black text-slate-400 group-hover:text-indigo-600 uppercase tracking-tighter mt-4 text-xs">设计新模板</span>
                </motion.button>
            </div>
        </div>
    );
};

export default TemplatesTab;
