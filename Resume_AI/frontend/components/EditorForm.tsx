import React, { useState } from 'react';
import { ResumeData, Education, Experience, Project } from '../types';
import { optimizeText } from '../services/geminiService';
import { Plus, Trash2, Sparkles, Loader2, Edit3, LayoutTemplate } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { motion } from 'framer-motion';

interface EditorFormProps {
  data: ResumeData;
  onChange: (data: ResumeData) => void;
}

const EditorForm: React.FC<EditorFormProps> = ({ data, onChange }) => {
  const [optimizingId, setOptimizingId] = useState<string | null>(null);

  const handleInfoChange = (field: keyof typeof data.personalInfo, value: string) => {
    onChange({
      ...data,
      personalInfo: { ...data.personalInfo, [field]: value }
    });
  };

  const handleTitleChange = (newTitle: string) => {
    onChange({ ...data, title: newTitle });
  };

  const handleTemplateChange = (templateId: 'modern' | 'classic' | 'minimal') => {
    onChange({ ...data, templateId });
  };

  const handleOptimize = async (id: string, text: string, type: 'summary' | 'bullet' | 'skills', callback: (val: string) => void) => {
    setOptimizingId(id);
    try {
      const optimized = await optimizeText(text, type);
      callback(optimized);
    } catch (e) {
      alert("AI 优化失败。请重试。");
    } finally {
      setOptimizingId(null);
    }
  };

  // Education Helpers
  const addEducation = () => {
    onChange({
      ...data,
      education: [...data.education, { id: uuidv4(), school: '', degree: '', startDate: '', endDate: '', description: '' }]
    });
  };

  const updateEducation = (index: number, field: keyof Education, value: string) => {
    const newEdu = [...data.education];
    newEdu[index] = { ...newEdu[index], [field]: value };
    onChange({ ...data, education: newEdu });
  };

  const removeEducation = (index: number) => {
    onChange({ ...data, education: data.education.filter((_, i) => i !== index) });
  };

  // Experience Helpers
  const addExperience = () => {
    onChange({
      ...data,
      experience: [...data.experience, { id: uuidv4(), company: '', position: '', startDate: '', endDate: '', description: '' }]
    });
  };

  const updateExperience = (index: number, field: keyof Experience, value: string) => {
    const newExp = [...data.experience];
    newExp[index] = { ...newExp[index], [field]: value };
    onChange({ ...data, experience: newExp });
  };

  const removeExperience = (index: number) => {
    onChange({ ...data, experience: data.experience.filter((_, i) => i !== index) });
  };

  // Project Helpers
  const addProject = () => {
    onChange({
      ...data,
      projects: [...data.projects, { id: uuidv4(), name: '', role: '', description: '' }]
    });
  };

  const updateProject = (index: number, field: keyof Project, value: string) => {
    const newProj = [...data.projects];
    newProj[index] = { ...newProj[index], [field]: value };
    onChange({ ...data, projects: newProj });
  };

  const removeProject = (index: number) => {
    onChange({ ...data, projects: data.projects.filter((_, i) => i !== index) });
  };

  const templateTranslations: Record<string, string> = {
    modern: '现代',
    classic: '经典',
    minimal: '极简',
    elegant: '优雅',
    compact: '紧凑',
    timeline: '时间线'
  };

  return (
    <div className="w-full h-full overflow-y-auto p-6 bg-white border-r border-slate-200 custom-scrollbar">
      <div className="mb-8 border-b border-slate-100 pb-6">
        <label className="section-header">简历名称</label>
        <div className="flex items-center mb-6 group">
          <input
            type="text"
            value={data.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            className="text-2xl font-black text-slate-900 bg-transparent border-none p-0 focus:ring-0 w-full placeholder-slate-200"
            placeholder="未命名简历"
          />
          <Edit3 size={20} className="text-slate-300 group-focus-within:text-indigo-500 ml-2 flex-shrink-0 transition-colors" />
        </div>

        <div className="bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100/50 shadow-sm shadow-indigo-100/20">
          <div className="flex items-center gap-2 mb-3 text-[10px] font-bold text-indigo-400 uppercase tracking-widest">
            <LayoutTemplate size={14} /> 简历模板
          </div>
          <div className="grid grid-cols-3 gap-3">
            {['modern', 'classic', 'minimal', 'elegant', 'compact', 'timeline'].map((t) => (
              <motion.button
                key={t}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleTemplateChange(t as any)}
                className={`px-3 py-2.5 text-xs font-bold rounded-xl border transition-all ${data.templateId === t
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-100'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-600'
                  }`}
              >
                {templateTranslations[t] || t}
              </motion.button>
            ))}
          </div>
        </div>
      </div>


      {/* Personal Info */}
      <section className="mb-10">
        <h3 className="section-header">个人信息</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="姓名"
            className="input-field"
            value={data.personalInfo.fullName}
            onChange={e => handleInfoChange('fullName', e.target.value)}
          />
          <input
            type="email"
            placeholder="邮箱"
            className="input-field"
            value={data.personalInfo.email}
            onChange={e => handleInfoChange('email', e.target.value)}
          />
          <input
            type="text"
            placeholder="电话"
            className="input-field"
            value={data.personalInfo.phone}
            onChange={e => handleInfoChange('phone', e.target.value)}
          />
          <input
            type="text"
            placeholder="LinkedIn 链接"
            className="input-field"
            value={data.personalInfo.linkedin}
            onChange={e => handleInfoChange('linkedin', e.target.value)}
          />
          <input
            type="text"
            placeholder="个人网站 / 作品集"
            className="input-field md:col-span-2"
            value={data.personalInfo.website}
            onChange={e => handleInfoChange('website', e.target.value)}
          />
        </div>
        <div className="mt-5 relative">
          <label className="block text-xs font-bold text-slate-500 mb-2 ml-1">专业简介</label>
          <textarea
            className="input-field w-full h-32 pb-10"
            placeholder="简要描述您的职业目标..."
            value={data.personalInfo.summary}
            onChange={e => handleInfoChange('summary', e.target.value)}
          />
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleOptimize('summary', data.personalInfo.summary, 'summary', (val) => handleInfoChange('summary', val))}
            disabled={optimizingId === 'summary' || !data.personalInfo.summary}
            className="absolute right-2.5 bottom-2.5 bg-white text-indigo-600 hover:bg-indigo-50 px-4 py-2 rounded-xl text-xs font-bold flex items-center transition-all border border-indigo-100 shadow-sm shadow-indigo-100/50 disabled:opacity-50"
          >
            {optimizingId === 'summary' ? <Loader2 className="animate-spin mr-2" size={14} /> : <Sparkles size={14} className="mr-2 text-indigo-400" />}
            AI 润色
          </motion.button>
        </div>
      </section>

      {/* Education */}
      <section className="mb-10">
        <div className="flex justify-between items-center mb-4">
          <h3 className="section-header">教育经历</h3>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={addEducation}
            className="text-indigo-600 hover:text-indigo-700 flex items-center text-xs font-bold bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors"
          >
            <Plus size={14} className="mr-1" /> 添加
          </motion.button>
        </div>
        <div className="space-y-4">
          {data.education.map((edu, index) => (
            <motion.div
              key={edu.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-5 bg-slate-50/50 rounded-2xl border border-slate-100 relative group hover:border-indigo-100 hover:bg-white transition-all shadow-sm hover:shadow-md"
            >
              <button
                onClick={() => removeEducation(index)}
                className="absolute top-3 right-3 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                title="删除"
              >
                <Trash2 size={16} />
              </button>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">学校</label>
                  <input
                    placeholder="学校名称"
                    className="input-field"
                    value={edu.school}
                    onChange={e => updateEducation(index, 'school', e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">学位</label>
                  <input
                    placeholder="学位"
                    className="input-field"
                    value={edu.degree}
                    onChange={e => updateEducation(index, 'degree', e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">开始日期</label>
                  <input
                    placeholder="YYYY-MM"
                    className="input-field"
                    value={edu.startDate}
                    onChange={e => updateEducation(index, 'startDate', e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">结束日期</label>
                  <input
                    placeholder="至今"
                    className="input-field"
                    value={edu.endDate}
                    onChange={e => updateEducation(index, 'endDate', e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">描述</label>
                <textarea
                  placeholder="详情描述（可选）"
                  className="input-field w-full h-20 text-xs"
                  value={edu.description}
                  onChange={e => updateEducation(index, 'description', e.target.value)}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Experience */}
      <section className="mb-10">
        <div className="flex justify-between items-center mb-4">
          <h3 className="section-header">工作/实习经历</h3>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={addExperience}
            className="text-indigo-600 hover:text-indigo-700 flex items-center text-xs font-bold bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors"
          >
            <Plus size={14} className="mr-1" /> 添加
          </motion.button>
        </div>
        <div className="space-y-5">
          {data.experience.map((exp, index) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-5 bg-slate-50/50 rounded-2xl border border-slate-100 relative group hover:border-indigo-100 hover:bg-white transition-all shadow-sm hover:shadow-md"
            >
              <button
                onClick={() => removeExperience(index)}
                className="absolute top-3 right-3 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                title="删除"
              >
                <Trash2 size={16} />
              </button>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">公司</label>
                  <input
                    placeholder="公司名称"
                    className="input-field"
                    value={exp.company}
                    onChange={e => updateExperience(index, 'company', e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">职位</label>
                  <input
                    placeholder="职位"
                    className="input-field"
                    value={exp.position}
                    onChange={e => updateExperience(index, 'position', e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">开始日期</label>
                  <input
                    placeholder="YYYY-MM"
                    className="input-field"
                    value={exp.startDate}
                    onChange={e => updateExperience(index, 'startDate', e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">结束日期</label>
                  <input
                    placeholder="至今"
                    className="input-field"
                    value={exp.endDate}
                    onChange={e => updateExperience(index, 'endDate', e.target.value)}
                  />
                </div>
              </div>
              <div className="relative space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">职责与成就</label>
                <textarea
                  placeholder="描述您的工作职责和成就..."
                  className="input-field w-full h-40 pb-10 text-xs leading-relaxed"
                  value={exp.description}
                  onChange={e => updateExperience(index, 'description', e.target.value)}
                />
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleOptimize(exp.id, exp.description, 'bullet', (val) => updateExperience(index, 'description', val))}
                  disabled={optimizingId === exp.id || !exp.description}
                  className="absolute right-2.5 bottom-2.5 bg-white text-indigo-600 hover:bg-indigo-50 px-4 py-2 rounded-xl text-xs font-bold flex items-center transition-all border border-indigo-100 shadow-sm shadow-indigo-100/50 disabled:opacity-50"
                  title="AI 润色描述"
                >
                  {optimizingId === exp.id ? <Loader2 className="animate-spin mr-2" size={14} /> : <Sparkles size={14} className="mr-2 text-indigo-400" />}
                  AI 润色
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Projects */}
      <section className="mb-10">
        <div className="flex justify-between items-center mb-4">
          <h3 className="section-header">项目状况</h3>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={addProject}
            className="text-indigo-600 hover:text-indigo-700 flex items-center text-xs font-bold bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors"
          >
            <Plus size={14} className="mr-1" /> 添加
          </motion.button>
        </div>
        <div className="space-y-5">
          {data.projects.map((proj, index) => (
            <motion.div
              key={proj.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-5 bg-slate-50/50 rounded-2xl border border-slate-100 relative group hover:border-indigo-100 hover:bg-white transition-all shadow-sm hover:shadow-md"
            >
              <button
                onClick={() => removeProject(index)}
                className="absolute top-3 right-3 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                title="删除"
              >
                <Trash2 size={16} />
              </button>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">项目名称</label>
                  <input
                    placeholder="项目名称"
                    className="input-field"
                    value={proj.name}
                    onChange={e => updateProject(index, 'name', e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">您的角色</label>
                  <input
                    placeholder="您的角色"
                    className="input-field"
                    value={proj.role}
                    onChange={e => updateProject(index, 'role', e.target.value)}
                  />
                </div>
              </div>
              <div className="relative space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">项目描述</label>
                <textarea
                  placeholder="项目描述..."
                  className="input-field w-full h-32 pb-10 text-xs leading-relaxed"
                  value={proj.description}
                  onChange={e => updateProject(index, 'description', e.target.value)}
                />
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleOptimize(proj.id, proj.description, 'bullet', (val) => updateProject(index, 'description', val))}
                  disabled={optimizingId === proj.id || !proj.description}
                  className="absolute right-2.5 bottom-2.5 bg-white text-indigo-600 hover:bg-indigo-50 px-4 py-2 rounded-xl text-xs font-bold flex items-center transition-all border border-indigo-100 shadow-sm shadow-indigo-100/50 disabled:opacity-50"
                  title="AI 润色描述"
                >
                  {optimizingId === proj.id ? <Loader2 className="animate-spin mr-2" size={14} /> : <Sparkles size={14} className="mr-2 text-indigo-400" />}
                  AI 润色
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Skills */}
      <section className="mb-24">
        <h3 className="section-header">技能专长</h3>
        <div className="relative space-y-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">核心技能</label>
          <textarea
            className="input-field w-full h-32 pb-10 leading-relaxed"
            placeholder="列出您的技能（逗号分隔或列表）..."
            value={data.skills}
            onChange={e => onChange({ ...data, skills: e.target.value })}
          />
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleOptimize('skills', data.skills, 'skills', (val) => onChange({ ...data, skills: val }))}
            disabled={optimizingId === 'skills' || !data.skills}
            className="absolute right-2.5 bottom-2.5 bg-white text-indigo-600 hover:bg-indigo-50 px-4 py-2 rounded-xl text-xs font-bold flex items-center transition-all border border-indigo-100 shadow-sm shadow-indigo-100/50 disabled:opacity-50"
            title="AI 格式化技能"
          >
            {optimizingId === 'skills' ? <Loader2 className="animate-spin mr-2" size={14} /> : <Sparkles size={14} className="mr-2 text-indigo-400" />}
            AI 格式化
          </motion.button>
        </div>
      </section>

      <style>{`
        .input-field {
          @apply w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-800 focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 bg-slate-50/50 placeholder:text-slate-400 transition-all;
        }
        .section-header {
          @apply text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2;
        }
      `}</style>
    </div>
  );
};

export default EditorForm;
