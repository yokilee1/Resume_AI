import React, { useState } from 'react';
import { ResumeData, Education, Experience, Project } from '../types';
import { optimizeText } from '../services/geminiService';
import { Plus, Trash2, Sparkles, Loader2, Edit3, LayoutTemplate } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

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
      alert("AI optimization failed. Please try again.");
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

  return (
    <div className="w-full h-full overflow-y-auto p-6 bg-white border-r border-slate-200">
      <div className="mb-8 border-b border-slate-100 pb-4">
        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Resume Name</label>
        <div className="flex items-center mb-4">
          <input 
            type="text" 
            value={data.title} 
            onChange={(e) => handleTitleChange(e.target.value)}
            className="text-xl font-bold text-slate-800 bg-transparent border-none p-0 focus:ring-0 w-full placeholder-slate-300"
            placeholder="Untitled Resume"
          />
          <Edit3 size={16} className="text-slate-400 ml-2 flex-shrink-0" />
        </div>

        <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
           <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
             <LayoutTemplate size={14} /> Resume Template
           </div>
           <div className="grid grid-cols-3 gap-2">
             {['modern', 'classic', 'minimal', 'elegant', 'compact', 'timeline'].map((t) => (
               <button
                 key={t}
                 onClick={() => handleTemplateChange(t as any)}
                 className={`px-3 py-2 text-xs font-medium rounded-md border transition-all ${
                   data.templateId === t 
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm' 
                    : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-600'
                 }`}
               >
                 {t.charAt(0).toUpperCase() + t.slice(1)}
               </button>
             ))}
           </div>
        </div>
      </div>

      {/* Personal Info */}
      <section className="mb-8">
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Personal Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Full Name"
            className="input-field"
            value={data.personalInfo.fullName}
            onChange={e => handleInfoChange('fullName', e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            className="input-field"
            value={data.personalInfo.email}
            onChange={e => handleInfoChange('email', e.target.value)}
          />
          <input
            type="text"
            placeholder="Phone"
            className="input-field"
            value={data.personalInfo.phone}
            onChange={e => handleInfoChange('phone', e.target.value)}
          />
          <input
            type="text"
            placeholder="LinkedIn URL"
            className="input-field"
            value={data.personalInfo.linkedin}
            onChange={e => handleInfoChange('linkedin', e.target.value)}
          />
           <input
            type="text"
            placeholder="Website / Portfolio"
            className="input-field md:col-span-2"
            value={data.personalInfo.website}
            onChange={e => handleInfoChange('website', e.target.value)}
          />
        </div>
        <div className="mt-4 relative">
          <label className="block text-xs font-medium text-slate-700 mb-1">Professional Summary</label>
          <textarea
            className="input-field w-full h-24 pb-8"
            placeholder="Briefly describe your career goals..."
            value={data.personalInfo.summary}
            onChange={e => handleInfoChange('summary', e.target.value)}
          />
          <button
            onClick={() => handleOptimize('summary', data.personalInfo.summary, 'summary', (val) => handleInfoChange('summary', val))}
            disabled={optimizingId === 'summary' || !data.personalInfo.summary}
            className="absolute right-2 bottom-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 px-3 py-1.5 rounded-md text-xs font-medium flex items-center transition-colors border border-indigo-200 disabled:opacity-50"
            title="AI Polish Summary"
          >
            {optimizingId === 'summary' ? <Loader2 className="animate-spin mr-1" size={12} /> : <Sparkles size={12} className="mr-1" />}
            AI Polish
          </button>
        </div>
      </section>

      {/* Education */}
      <section className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Education</h3>
          <button onClick={addEducation} className="text-indigo-600 hover:text-indigo-800 flex items-center text-xs font-medium">
            <Plus size={14} className="mr-1" /> Add
          </button>
        </div>
        <div className="space-y-4">
          {data.education.map((edu, index) => (
            <div key={edu.id} className="p-4 bg-slate-50 rounded-lg border border-slate-100 relative group">
              <button onClick={() => removeEducation(index)} className="absolute top-2 right-2 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                <Trash2 size={14} />
              </button>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <input
                  placeholder="School / University"
                  className="input-field"
                  value={edu.school}
                  onChange={e => updateEducation(index, 'school', e.target.value)}
                />
                <input
                  placeholder="Degree"
                  className="input-field"
                  value={edu.degree}
                  onChange={e => updateEducation(index, 'degree', e.target.value)}
                />
                <input
                  placeholder="Start Date"
                  className="input-field"
                  value={edu.startDate}
                  onChange={e => updateEducation(index, 'startDate', e.target.value)}
                />
                <input
                  placeholder="End Date"
                  className="input-field"
                  value={edu.endDate}
                  onChange={e => updateEducation(index, 'endDate', e.target.value)}
                />
              </div>
              <textarea
                placeholder="Description (Optional)"
                className="input-field w-full h-16 text-xs"
                value={edu.description}
                onChange={e => updateEducation(index, 'description', e.target.value)}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Experience */}
      <section className="mb-8">
         <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Experience</h3>
          <button onClick={addExperience} className="text-indigo-600 hover:text-indigo-800 flex items-center text-xs font-medium">
            <Plus size={14} className="mr-1" /> Add
          </button>
        </div>
        <div className="space-y-4">
          {data.experience.map((exp, index) => (
            <div key={exp.id} className="p-4 bg-slate-50 rounded-lg border border-slate-100 relative group">
               <button onClick={() => removeExperience(index)} className="absolute top-2 right-2 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                <Trash2 size={14} />
              </button>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <input
                  placeholder="Company"
                  className="input-field"
                  value={exp.company}
                  onChange={e => updateExperience(index, 'company', e.target.value)}
                />
                <input
                  placeholder="Position"
                  className="input-field"
                  value={exp.position}
                  onChange={e => updateExperience(index, 'position', e.target.value)}
                />
                <input
                  placeholder="Start Date"
                  className="input-field"
                  value={exp.startDate}
                  onChange={e => updateExperience(index, 'startDate', e.target.value)}
                />
                <input
                  placeholder="End Date"
                  className="input-field"
                  value={exp.endDate}
                  onChange={e => updateExperience(index, 'endDate', e.target.value)}
                />
              </div>
              <div className="relative">
                <textarea
                  placeholder="Describe your responsibilities and achievements..."
                  className="input-field w-full h-32 pb-8 text-xs"
                  value={exp.description}
                  onChange={e => updateExperience(index, 'description', e.target.value)}
                />
                 <button
                    onClick={() => handleOptimize(exp.id, exp.description, 'bullet', (val) => updateExperience(index, 'description', val))}
                    disabled={optimizingId === exp.id || !exp.description}
                    className="absolute right-2 bottom-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 px-3 py-1.5 rounded-md text-xs font-medium flex items-center transition-colors border border-indigo-200 disabled:opacity-50"
                    title="AI Polish Description"
                  >
                    {optimizingId === exp.id ? <Loader2 className="animate-spin mr-1" size={12} /> : <Sparkles size={12} className="mr-1" />}
                    AI Polish
                  </button>
              </div>
            </div>
          ))}
        </div>
      </section>
      
      {/* Projects */}
      <section className="mb-8">
         <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Projects</h3>
          <button onClick={addProject} className="text-indigo-600 hover:text-indigo-800 flex items-center text-xs font-medium">
            <Plus size={14} className="mr-1" /> Add
          </button>
        </div>
        <div className="space-y-4">
          {data.projects.map((proj, index) => (
            <div key={proj.id} className="p-4 bg-slate-50 rounded-lg border border-slate-100 relative group">
               <button onClick={() => removeProject(index)} className="absolute top-2 right-2 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                <Trash2 size={14} />
              </button>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <input
                  placeholder="Project Name"
                  className="input-field"
                  value={proj.name}
                  onChange={e => updateProject(index, 'name', e.target.value)}
                />
                <input
                  placeholder="Your Role"
                  className="input-field"
                  value={proj.role}
                  onChange={e => updateProject(index, 'role', e.target.value)}
                />
              </div>
              <div className="relative">
                <textarea
                  placeholder="Project description..."
                  className="input-field w-full h-24 pb-8 text-xs"
                  value={proj.description}
                  onChange={e => updateProject(index, 'description', e.target.value)}
                />
                  <button
                    onClick={() => handleOptimize(proj.id, proj.description, 'bullet', (val) => updateProject(index, 'description', val))}
                    disabled={optimizingId === proj.id || !proj.description}
                    className="absolute right-2 bottom-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 px-3 py-1.5 rounded-md text-xs font-medium flex items-center transition-colors border border-indigo-200 disabled:opacity-50"
                    title="AI Polish Description"
                  >
                    {optimizingId === proj.id ? <Loader2 className="animate-spin mr-1" size={12} /> : <Sparkles size={12} className="mr-1" />}
                    AI Polish
                  </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Skills */}
      <section className="mb-20">
         <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Skills</h3>
         <div className="relative">
           <textarea
              className="input-field w-full h-32 pb-8"
              placeholder="List your skills (comma separated or loose list)..."
              value={data.skills}
              onChange={e => onChange({ ...data, skills: e.target.value })}
            />
            <button
                onClick={() => handleOptimize('skills', data.skills, 'skills', (val) => onChange({ ...data, skills: val }))}
                disabled={optimizingId === 'skills' || !data.skills}
                className="absolute right-2 bottom-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 px-3 py-1.5 rounded-md text-xs font-medium flex items-center transition-colors border border-indigo-200 disabled:opacity-50"
                title="AI Format Skills"
              >
                {optimizingId === 'skills' ? <Loader2 className="animate-spin mr-1" size={12} /> : <Sparkles size={12} className="mr-1" />}
                AI Format
            </button>
         </div>
      </section>
      
      <style>{`
        .input-field {
          @apply w-full rounded border border-slate-300 px-3 py-2 text-sm text-slate-800 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white placeholder:text-slate-400;
        }
      `}</style>
    </div>
  );
};

export default EditorForm;
