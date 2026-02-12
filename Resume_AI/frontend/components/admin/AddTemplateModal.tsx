import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Palette, Type, Link as LinkIcon, Code, Eye, Hash } from 'lucide-react';
import { AdminTemplate } from '../../types';

interface AddTemplateModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (template: Partial<AdminTemplate>) => Promise<void>;
}

const AddTemplateModal: React.FC<AddTemplateModalProps> = ({ isOpen, onClose, onAdd }) => {
    const [name, setName] = useState('');
    const [category, setCategory] = useState('Professional');
    const [previewUrl, setPreviewUrl] = useState('');
    const [schemaJson, setSchemaJson] = useState('{}');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onAdd({
                name,
                category,
                previewUrl,
                status: 'Active',
                usageCount: 0,
                // schemaJson will be sent to backend
            } as any);
            onClose();
            setName('');
            setCategory('Professional');
            setPreviewUrl('');
            setSchemaJson('{}');
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
                        className="relative w-full max-w-lg bg-white/80 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl overflow-hidden"
                    >
                        <div className="p-8">
                            <div className="flex justify-between items-center mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 bg-slate-900 text-white rounded-xl shadow-lg shadow-slate-200">
                                        <Palette size={20} />
                                    </div>
                                    <h3 className="text-xl font-black text-slate-900 tracking-tight">发布新简历模板</h3>
                                </div>
                                <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-900">
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">模板名称</label>
                                        <div className="relative">
                                            <Type className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                            <input
                                                required
                                                type="text"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-bold focus:bg-white focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 transition-all outline-none"
                                                placeholder="例如: Modern Classic"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">模板分类</label>
                                        <div className="relative">
                                            <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                            <select
                                                value={category}
                                                onChange={(e) => setCategory(e.target.value)}
                                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-bold focus:bg-white focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 transition-all outline-none appearance-none"
                                            >
                                                <option value="Professional">商务专业</option>
                                                <option value="Creative">创意设计</option>
                                                <option value="Minimal">极简主义</option>
                                                <option value="Technical">技术开发</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">预览图 URL</label>
                                    <div className="relative">
                                        <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                        <input
                                            required
                                            type="text"
                                            value={previewUrl}
                                            onChange={(e) => setPreviewUrl(e.target.value)}
                                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-bold focus:bg-white focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 transition-all outline-none"
                                            placeholder="https://example.com/preview.png"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <div className="flex justify-between items-center ml-1">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Schema JSON 配置</label>
                                        <span className="text-[9px] font-bold text-blue-500 bg-blue-50 px-1.5 py-0.5 rounded uppercase tracking-tighter">Required Structure</span>
                                    </div>
                                    <div className="relative">
                                        <Code className="absolute left-4 top-4 text-slate-400" size={16} />
                                        <textarea
                                            required
                                            rows={4}
                                            value={schemaJson}
                                            onChange={(e) => setSchemaJson(e.target.value)}
                                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-mono focus:bg-white focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 transition-all outline-none resize-none"
                                            placeholder="{ ... }"
                                        />
                                    </div>
                                </div>

                                <div className="pt-4 flex gap-4">
                                    <button
                                        type="button"
                                        className="flex-1 bg-white border border-slate-200 text-slate-900 py-4 rounded-2xl font-black text-sm hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                                    >
                                        <Eye size={18} /> 预览效果
                                    </button>
                                    <button
                                        disabled={loading}
                                        type="submit"
                                        className="flex-[2] bg-slate-900 text-white py-4 rounded-2xl font-black text-sm shadow-xl shadow-slate-200 hover:bg-black transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                                    >
                                        {loading ? (
                                            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full" />
                                        ) : '即刻发布模板'}
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

export default AddTemplateModal;
