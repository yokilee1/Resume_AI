import React from 'react';
import { ResumeData } from '../types';
import { Plus, FileText, Copy, Trash2, Clock, Edit3, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useResumes } from '../context/ResumeContext';
import { createResume, duplicateResume as apiDuplicateResume, deleteResume as apiDeleteResume } from '../services/resumeApi';
import { motion } from 'framer-motion';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { resumes, addResume, removeResume, setCurrentResumeId } = useResumes();

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const onCreate = async () => {
    try {
      const created = await createResume({
        title: '新建简历',
        templateId: 'modern',
        lastModified: Date.now(),
        personalInfo: { fullName: '', email: '', phone: '', linkedin: '', website: '', summary: '' },
        education: [], experience: [], projects: [], skills: ''
      } as any);
      addResume(created);
      navigate(`/editor/${created.id}`);
    } catch (e) {
      console.error(e);
    }
  };

  const onSelect = (id: string) => {
    setCurrentResumeId(id);
    navigate(`/editor/${id}`);
  };

  const onDelete = async (id: string) => {
    if (!confirm("确定删除吗？")) return;
    try {
      await apiDeleteResume(id);
      removeResume(id);
    } catch (e) {
      console.error(e);
    }
  };

  const onDuplicate = async (id: string) => {
    try {
      const copy = await apiDuplicateResume(id);
      addResume(copy);
    } catch (e) {
      console.error(e);
    }
  };
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.4, ease: "easeOut" as const }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative">
      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-0 right-0 w-[30%] h-[30%] bg-slate-100/50 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-slate-100/30 rounded-full blur-[120px]"></div>
      </div>

      <div className="flex justify-between items-end mb-10">
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
        >
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">我的简历</h1>
          <p className="text-slate-500 mt-2 font-medium">管理并组织您的求职申请</p>
        </motion.div>
        <motion.button
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onCreate}
          className="bg-slate-900 text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-black transition-all flex items-center shadow-xl shadow-slate-200/50"
        >
          <Plus size={20} className="mr-2" />
          新建简历
        </motion.button>
      </div>

      {resumes.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-24 bg-white rounded-3xl border-2 border-dashed border-slate-200 shadow-sm"
        >
          <div className="w-20 h-20 bg-slate-50 text-slate-400 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner">
            <FileText size={40} />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-3">暂无简历</h3>
          <p className="text-slate-500 max-w-sm mx-auto mb-8 font-medium">创建您的第一份简历，利用 AI 建议开始申请职位。</p>
          <button
            onClick={onCreate}
            className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-black transition-all shadow-lg shadow-slate-200/30 flex items-center gap-2 mx-auto"
          >
            立即创建 <ArrowRight size={18} />
          </button>
        </motion.div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {/* Create New Card (Visual shortcut) */}
          <motion.button
            variants={itemVariants}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            whileTap={{ scale: 0.98 }}
            onClick={onCreate}
            className="group flex flex-col items-center justify-center h-64 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl hover:border-slate-400 hover:bg-slate-100/50 transition-all cursor-pointer shadow-sm hover:shadow-md"
          >
            <div className="w-14 h-14 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 group-hover:text-slate-900 group-hover:border-slate-400 transition-colors mb-4 shadow-sm">
              <Plus size={28} />
            </div>
            <span className="text-slate-600 font-bold group-hover:text-slate-900">创建新简历</span>
          </motion.button>

          {/* Resume Cards */}
          {resumes.map((resume) => (
            <motion.div
              key={resume.id}
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all flex flex-col h-64 group relative overflow-hidden"
            >
              {/* Preview Area (Fake visual) */}
              <div
                className="flex-1 bg-slate-50 p-4 overflow-hidden relative cursor-pointer"
                onClick={() => onSelect(resume.id)}
              >
                <div className="w-full h-[200%] bg-white shadow-sm rounded-sm p-4 text-[5px] text-slate-300 leading-relaxed pointer-events-none transform transition-transform group-hover:scale-105 origin-top border border-slate-100">
                  <div className="w-1/3 h-2.5 bg-slate-800 mb-3 rounded-full opacity-90"></div>
                  <div className="flex gap-2 mb-4">
                    <div className="w-10 h-1 bg-slate-200 rounded-full"></div>
                    <div className="w-10 h-1 bg-slate-200 rounded-full"></div>
                    <div className="w-10 h-1 bg-slate-200 rounded-full"></div>
                  </div>

                  <div className="w-1/4 h-2 bg-slate-400 mb-2 rounded-full"></div>
                  <div className="space-y-1.5 mb-4">
                    <div className="w-full h-1 bg-slate-100 rounded-full"></div>
                    <div className="w-full h-1 bg-slate-100 rounded-full"></div>
                    <div className="w-5/6 h-1 bg-slate-100 rounded-full"></div>
                  </div>

                  <div className="w-1/4 h-2 bg-slate-400 mb-2 rounded-full"></div>
                  <div className="space-y-1.5">
                    <div className="w-full h-1 bg-slate-100 rounded-full"></div>
                    <div className="w-full h-1 bg-slate-100 rounded-full"></div>
                    <div className="w-4/6 h-1 bg-slate-100 rounded-full"></div>
                  </div>
                </div>
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/5 transition-colors flex items-center justify-center">
                  <motion.div
                    className="bg-slate-900 text-white px-5 py-2.5 rounded-full font-bold text-sm shadow-xl shadow-slate-900/10 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all flex items-center gap-2"
                  >
                    <Edit3 size={16} /> 编辑简历
                  </motion.div>
                </div>
              </div>

              {/* Footer Info */}
              <div className="p-4 border-t border-slate-100 bg-white z-10">
                <div className="flex justify-between items-start">
                  <div onClick={() => onSelect(resume.id)} className="cursor-pointer flex-1 min-w-0">
                    <h3 className="font-bold text-slate-800 truncate pr-2 group-hover:text-slate-900 transition-colors" title={resume.title}>
                      {resume.title || '未命名简历'}
                    </h3>
                    <div className="flex items-center text-xs text-slate-400 mt-1.5">
                      <Clock size={12} className="mr-1" />
                      {formatDate(resume.lastModified)}
                    </div>
                  </div>

                  <div className="flex items-center gap-0.5 ml-2">
                    <button
                      onClick={(e) => { e.stopPropagation(); onDuplicate(resume.id); }}
                      className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all"
                      title="复制"
                    >
                      <Copy size={16} />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); onDelete(resume.id); }}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                      title="删除"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default Dashboard;