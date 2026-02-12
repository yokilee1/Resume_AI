import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X, Check } from 'lucide-react';

interface ConfirmModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    type?: 'danger' | 'warning' | 'info';
    onConfirm: () => void;
    onCancel: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
    isOpen,
    title,
    message,
    confirmText = '确定',
    cancelText = '取消',
    type = 'warning',
    onConfirm,
    onCancel
}) => {
    const isDanger = type === 'danger';

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onCancel}
                        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-sm bg-white/90 backdrop-blur-2xl border border-white/20 shadow-2xl rounded-3xl overflow-hidden"
                    >
                        <div className="p-6">
                            <div className="flex justify-center mb-6">
                                <div className={`p-4 rounded-2xl shadow-lg ${isDanger ? 'bg-red-500 text-white shadow-red-200' : 'bg-slate-900 text-white shadow-slate-200'}`}>
                                    <AlertTriangle size={32} />
                                </div>
                            </div>

                            <div className="text-center space-y-2">
                                <h3 className="text-xl font-black text-slate-900 tracking-tight">{title}</h3>
                                <p className="text-slate-500 font-medium text-sm leading-relaxed">
                                    {message}
                                </p>
                            </div>

                            <div className="mt-8 flex gap-3">
                                <button
                                    onClick={onCancel}
                                    className="flex-1 px-4 py-3.5 bg-slate-100 text-slate-900 text-xs font-black rounded-2xl hover:bg-slate-200 transition-all active:scale-[0.98]"
                                >
                                    {cancelText}
                                </button>
                                <button
                                    onClick={onConfirm}
                                    className={`flex-1 px-4 py-3.5 text-xs font-black rounded-2xl shadow-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2 ${isDanger ? 'bg-red-600 text-white shadow-red-100 hover:bg-red-700' : 'bg-slate-900 text-white shadow-slate-200 hover:bg-black'}`}
                                >
                                    <Check size={14} /> {confirmText}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default ConfirmModal;
