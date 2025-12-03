import React from 'react';
import { ResumeData } from '../types';
import { Mail, Phone, Linkedin, Globe } from 'lucide-react';

interface ResumePreviewProps {
  data: ResumeData;
  targetRef?: React.RefObject<HTMLDivElement>;
}

const ResumePreview: React.FC<ResumePreviewProps> = ({ data, targetRef }) => {
  const template = data.templateId || 'modern';

  // --- RENDERERS ---

  const ModernLayout = () => (
    <div className="h-full p-[15mm] text-sm text-slate-800 leading-normal" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Header */}
      <header className="border-b-2 border-slate-800 pb-4 mb-6">
        <h1 className="text-3xl font-bold uppercase tracking-wide text-slate-900 mb-2">
          {data.personalInfo.fullName || "Your Name"}
        </h1>
        <div className="flex flex-wrap gap-4 text-xs text-slate-600">
          {data.personalInfo.email && <div className="flex items-center gap-1"><Mail size={12} /><span>{data.personalInfo.email}</span></div>}
          {data.personalInfo.phone && <div className="flex items-center gap-1"><Phone size={12} /><span>{data.personalInfo.phone}</span></div>}
          {data.personalInfo.linkedin && <div className="flex items-center gap-1"><Linkedin size={12} /><span>{data.personalInfo.linkedin}</span></div>}
          {data.personalInfo.website && <div className="flex items-center gap-1"><Globe size={12} /><span>{data.personalInfo.website}</span></div>}
        </div>
      </header>

      {/* Summary */}
      {data.personalInfo.summary && (
        <section className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 mb-2 pb-1">Professional Summary</h2>
          <p className="text-slate-700 whitespace-pre-wrap">{data.personalInfo.summary}</p>
        </section>
      )}

      {/* Education */}
      {data.education.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 mb-3 pb-1">Education</h2>
          <div className="space-y-3">
            {data.education.map((edu) => (
              <div key={edu.id}>
                <div className="flex justify-between font-medium text-slate-900">
                  <span>{edu.school}</span>
                  <span className="text-slate-500 text-xs tabular-nums">{edu.startDate} - {edu.endDate}</span>
                </div>
                <div className="text-slate-800 italic text-xs mb-1">{edu.degree}</div>
                {edu.description && <p className="text-xs text-slate-600 whitespace-pre-wrap">{edu.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Experience */}
      {data.experience.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 mb-3 pb-1">Work Experience</h2>
          <div className="space-y-4">
            {data.experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between font-medium text-slate-900">
                  <span>{exp.company}</span>
                  <span className="text-slate-500 text-xs tabular-nums">{exp.startDate} - {exp.endDate}</span>
                </div>
                <div className="text-slate-800 italic text-xs mb-1">{exp.position}</div>
                {exp.description && <p className="text-xs text-slate-600 whitespace-pre-wrap">{exp.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

       {/* Projects */}
       {data.projects.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 mb-3 pb-1">Projects</h2>
          <div className="space-y-3">
            {data.projects.map((proj) => (
              <div key={proj.id}>
                <div className="font-medium text-slate-900">{proj.name} <span className="font-normal text-slate-500 text-xs">| {proj.role}</span></div>
                {proj.description && <p className="text-xs text-slate-600 whitespace-pre-wrap">{proj.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {data.skills && (
        <section className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 mb-2 pb-1">Skills</h2>
          <p className="text-xs text-slate-700 whitespace-pre-wrap">{data.skills}</p>
        </section>
      )}
    </div>
  );

  const ClassicLayout = () => (
    <div className="h-full p-[15mm] text-sm text-slate-800 leading-normal" style={{ fontFamily: "Georgia, 'Times New Roman', Times, serif" }}>
      {/* Header */}
      <header className="text-center mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-3 tracking-wide">{data.personalInfo.fullName || "Your Name"}</h1>
        <div className="flex flex-wrap justify-center gap-3 text-xs text-slate-600 italic">
          {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
          {data.personalInfo.phone && <span className="border-l border-slate-300 pl-3">{data.personalInfo.phone}</span>}
          {data.personalInfo.linkedin && <span className="border-l border-slate-300 pl-3">{data.personalInfo.linkedin}</span>}
          {data.personalInfo.website && <span className="border-l border-slate-300 pl-3">{data.personalInfo.website}</span>}
        </div>
      </header>

      {/* Summary */}
      {data.personalInfo.summary && (
        <section className="mb-6">
          <h2 className="text-center font-bold uppercase text-slate-900 border-b border-slate-300 pb-1 mb-3 text-xs tracking-widest">Summary</h2>
          <p className="text-slate-800 text-justify">{data.personalInfo.summary}</p>
        </section>
      )}

      {/* Education */}
      {data.education.length > 0 && (
        <section className="mb-6">
          <h2 className="text-center font-bold uppercase text-slate-900 border-b border-slate-300 pb-1 mb-3 text-xs tracking-widest">Education</h2>
          <div className="space-y-4">
            {data.education.map((edu) => (
              <div key={edu.id}>
                <div className="flex justify-between font-bold text-slate-900">
                  <span>{edu.school}</span>
                  <span>{edu.startDate} - {edu.endDate}</span>
                </div>
                <div className="italic text-slate-700 mb-1">{edu.degree}</div>
                {edu.description && <p className="text-xs text-slate-700 whitespace-pre-wrap">{edu.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Experience */}
      {data.experience.length > 0 && (
        <section className="mb-6">
           <h2 className="text-center font-bold uppercase text-slate-900 border-b border-slate-300 pb-1 mb-3 text-xs tracking-widest">Experience</h2>
          <div className="space-y-5">
            {data.experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between font-bold text-slate-900">
                  <span>{exp.company}</span>
                  <span>{exp.startDate} - {exp.endDate}</span>
                </div>
                <div className="italic text-slate-700 mb-1">{exp.position}</div>
                {exp.description && <p className="text-xs text-slate-700 whitespace-pre-wrap text-justify">{exp.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
       {data.projects.length > 0 && (
        <section className="mb-6">
          <h2 className="text-center font-bold uppercase text-slate-900 border-b border-slate-300 pb-1 mb-3 text-xs tracking-widest">Projects</h2>
          <div className="space-y-4">
            {data.projects.map((proj) => (
              <div key={proj.id}>
                 <div className="font-bold text-slate-900">{proj.name} <span className="font-normal italic">| {proj.role}</span></div>
                {proj.description && <p className="text-xs text-slate-700 whitespace-pre-wrap">{proj.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

       {/* Skills */}
      {data.skills && (
        <section className="mb-6">
          <h2 className="text-center font-bold uppercase text-slate-900 border-b border-slate-300 pb-1 mb-3 text-xs tracking-widest">Skills</h2>
          <p className="text-xs text-slate-800 whitespace-pre-wrap text-center">{data.skills}</p>
        </section>
      )}
    </div>
  );

  const MinimalLayout = () => (
    <div className="h-full p-[15mm] text-sm text-slate-900 leading-snug" style={{ fontFamily: "Arial, Helvetica, sans-serif" }}>
      {/* Header */}
      <header className="mb-10">
        <h1 className="text-5xl font-extrabold text-slate-900 mb-4 tracking-tighter">
          {data.personalInfo.fullName || "Your Name"}
        </h1>
        <div className="flex flex-col gap-1 text-xs text-slate-500 font-medium">
          {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
          {data.personalInfo.phone && <span>{data.personalInfo.phone}</span>}
          {data.personalInfo.linkedin && <span>{data.personalInfo.linkedin}</span>}
          {data.personalInfo.website && <span>{data.personalInfo.website}</span>}
        </div>
      </header>

      {/* Summary */}
      {data.personalInfo.summary && (
        <section className="mb-8 grid grid-cols-4 gap-4">
           <h2 className="col-span-1 text-xs font-black uppercase text-slate-400 tracking-widest">Summary</h2>
           <div className="col-span-3">
             <p className="text-slate-800">{data.personalInfo.summary}</p>
           </div>
        </section>
      )}

      {/* Education */}
      {data.education.length > 0 && (
        <section className="mb-8 grid grid-cols-4 gap-4">
          <h2 className="col-span-1 text-xs font-black uppercase text-slate-400 tracking-widest">Education</h2>
          <div className="col-span-3 space-y-4">
            {data.education.map((edu) => (
              <div key={edu.id}>
                <div className="font-bold text-slate-900">{edu.school}</div>
                <div className="text-xs text-slate-500 mb-1 uppercase tracking-wide">{edu.degree} • {edu.startDate} - {edu.endDate}</div>
                {edu.description && <p className="text-xs text-slate-700 whitespace-pre-wrap">{edu.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Experience */}
      {data.experience.length > 0 && (
        <section className="mb-8 grid grid-cols-4 gap-4">
          <h2 className="col-span-1 text-xs font-black uppercase text-slate-400 tracking-widest">Experience</h2>
          <div className="col-span-3 space-y-6">
            {data.experience.map((exp) => (
              <div key={exp.id}>
                <div className="font-bold text-slate-900">{exp.company}</div>
                <div className="text-xs text-slate-500 mb-2 uppercase tracking-wide">{exp.position} • {exp.startDate} - {exp.endDate}</div>
                {exp.description && <p className="text-xs text-slate-700 whitespace-pre-wrap">{exp.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {data.projects.length > 0 && (
        <section className="mb-8 grid grid-cols-4 gap-4">
           <h2 className="col-span-1 text-xs font-black uppercase text-slate-400 tracking-widest">Projects</h2>
           <div className="col-span-3 space-y-4">
            {data.projects.map((proj) => (
              <div key={proj.id}>
                 <div className="font-bold text-slate-900">{proj.name}</div>
                 <div className="text-xs text-slate-500 mb-1 uppercase tracking-wide">{proj.role}</div>
                {proj.description && <p className="text-xs text-slate-700 whitespace-pre-wrap">{proj.description}</p>}
              </div>
            ))}
           </div>
        </section>
      )}

      {/* Skills */}
      {data.skills && (
        <section className="mb-8 grid grid-cols-4 gap-4">
          <h2 className="col-span-1 text-xs font-black uppercase text-slate-400 tracking-widest">Skills</h2>
          <div className="col-span-3">
             <p className="text-xs text-slate-800 whitespace-pre-wrap font-medium">{data.skills}</p>
          </div>
        </section>
      )}
    </div>
  );

  return (
    <div className="w-full h-full bg-slate-100 overflow-y-auto p-4 md:p-8 flex justify-center no-print">
      <div 
        ref={targetRef}
        className="bg-white w-[210mm] min-h-[297mm] shadow-lg print-only transition-all duration-300"
      >
        {template === 'modern' && <ModernLayout />}
        {template === 'classic' && <ClassicLayout />}
        {template === 'minimal' && <MinimalLayout />}
      </div>
    </div>
  );
};

export default ResumePreview;