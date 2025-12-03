import React from 'react';
import { ResumeData } from '../types';
import { Plus, FileText, MoreVertical, Copy, Trash2, Clock, Edit3 } from 'lucide-react';

interface DashboardProps {
  resumes: ResumeData[];
  onCreate: () => void;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ resumes, onCreate, onSelect, onDelete, onDuplicate }) => {
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Resumes</h1>
          <p className="text-slate-500 mt-1">Manage and organize your job applications.</p>
        </div>
        <button
          onClick={onCreate}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors flex items-center shadow-lg shadow-indigo-200"
        >
          <Plus size={18} className="mr-2" />
          Create New Resume
        </button>
      </div>

      {resumes.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-slate-200">
          <div className="w-16 h-16 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText size={32} />
          </div>
          <h3 className="text-lg font-medium text-slate-900 mb-2">No resumes yet</h3>
          <p className="text-slate-500 max-w-sm mx-auto mb-6">Create your first resume to start applying for jobs with AI-powered suggestions.</p>
          <button
            onClick={onCreate}
            className="text-indigo-600 font-medium hover:text-indigo-800"
          >
            Create your first resume &rarr;
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Create New Card (Visual shortcut) */}
          <button
            onClick={onCreate}
            className="group flex flex-col items-center justify-center h-64 bg-slate-50 border-2 border-dashed border-slate-300 rounded-xl hover:border-indigo-500 hover:bg-indigo-50/50 transition-all cursor-pointer"
          >
            <div className="w-12 h-12 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 group-hover:text-indigo-600 group-hover:border-indigo-200 transition-colors mb-3 shadow-sm">
              <Plus size={24} />
            </div>
            <span className="text-slate-600 font-medium group-hover:text-indigo-700">New Resume</span>
          </button>

          {/* Resume Cards */}
          {resumes.map((resume) => (
            <div
              key={resume.id}
              className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col h-64 group relative overflow-hidden"
            >
              {/* Preview Area (Fake visual) */}
              <div 
                className="flex-1 bg-slate-100 p-4 overflow-hidden relative cursor-pointer"
                onClick={() => onSelect(resume.id)}
              >
                <div className="w-full h-[200%] bg-white shadow-sm p-3 text-[5px] text-slate-300 leading-relaxed pointer-events-none transform transition-transform group-hover:scale-105 origin-top">
                  <div className="w-1/2 h-2 bg-slate-800 mb-2 rounded-[1px]"></div>
                  <div className="w-full h-1 bg-slate-200 mb-1 rounded-[1px]"></div>
                  <div className="w-full h-1 bg-slate-200 mb-1 rounded-[1px]"></div>
                  <div className="w-2/3 h-1 bg-slate-200 mb-3 rounded-[1px]"></div>
                  
                  <div className="w-1/4 h-1.5 bg-slate-400 mb-1 rounded-[1px]"></div>
                  <div className="w-full h-1 bg-slate-200 mb-1 rounded-[1px]"></div>
                  <div className="w-full h-1 bg-slate-200 mb-1 rounded-[1px]"></div>
                  <div className="w-full h-1 bg-slate-200 mb-1 rounded-[1px]"></div>
                  <div className="w-full h-1 bg-slate-200 mb-1 rounded-[1px]"></div>

                  <div className="mt-2 w-1/4 h-1.5 bg-slate-400 mb-1 rounded-[1px]"></div>
                   <div className="w-full h-1 bg-slate-200 mb-1 rounded-[1px]"></div>
                  <div className="w-full h-1 bg-slate-200 mb-1 rounded-[1px]"></div>
                </div>
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-indigo-900/0 group-hover:bg-indigo-900/5 transition-colors flex items-center justify-center">
                   <div className="bg-white/90 backdrop-blur text-indigo-600 px-4 py-2 rounded-full font-medium text-sm shadow-sm opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all">
                     Edit Resume
                   </div>
                </div>
              </div>

              {/* Footer Info */}
              <div className="p-4 border-t border-slate-100 bg-white z-10">
                <div className="flex justify-between items-start">
                  <div onClick={() => onSelect(resume.id)} className="cursor-pointer">
                    <h3 className="font-semibold text-slate-800 truncate pr-2" title={resume.title}>
                      {resume.title || 'Untitled Resume'}
                    </h3>
                    <div className="flex items-center text-xs text-slate-500 mt-1">
                      <Clock size={12} className="mr-1" />
                      Updated {formatDate(resume.lastModified)}
                    </div>
                  </div>
                  
                  {/* Actions Dropdown (Simplified as visible buttons for this demo) */}
                  <div className="flex items-center gap-1">
                     <button 
                        onClick={(e) => { e.stopPropagation(); onDuplicate(resume.id); }}
                        className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
                        title="Duplicate"
                      >
                        <Copy size={16} />
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); onDelete(resume.id); }}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;