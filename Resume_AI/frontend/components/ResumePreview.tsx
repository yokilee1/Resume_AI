import React from 'react';
import { ResumeData } from '../types';
import { Mail, Phone, Linkedin, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
          {data.personalInfo.fullName || "您的姓名"}
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
        <section className="mb-6 avoid-break">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 mb-2 pb-1">个人简介</h2>
          <p className="text-slate-700 whitespace-pre-wrap">{data.personalInfo.summary}</p>
        </section>
      )}

      {/* Education */}
      {data.education.length > 0 && (
        <section className="mb-6 avoid-break">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 mb-3 pb-1">教育经历</h2>
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
        <section className="mb-6 avoid-break">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 mb-3 pb-1">工作/实习经历</h2>
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
        <section className="mb-6 avoid-break">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 mb-3 pb-1">项目状况</h2>
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
        <section className="mb-6 avoid-break">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 mb-2 pb-1">技能专长</h2>
          <p className="text-xs text-slate-700 whitespace-pre-wrap">{data.skills}</p>
        </section>
      )}
    </div>
  );

  const ClassicLayout = () => (
    <div className="h-full p-[15mm] text-sm text-slate-800 leading-normal" style={{ fontFamily: "Georgia, 'Times New Roman', Times, serif" }}>
      {/* Header */}
      <header className="text-center mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-3 tracking-wide">{data.personalInfo.fullName || "您的姓名"}</h1>
        <div className="flex flex-wrap justify-center gap-3 text-xs text-slate-600 italic">
          {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
          {data.personalInfo.phone && <span className="border-l border-slate-300 pl-3">{data.personalInfo.phone}</span>}
          {data.personalInfo.linkedin && <span className="border-l border-slate-300 pl-3">{data.personalInfo.linkedin}</span>}
          {data.personalInfo.website && <span className="border-l border-slate-300 pl-3">{data.personalInfo.website}</span>}
        </div>
      </header>

      {/* Summary */}
      {data.personalInfo.summary && (
        <section className="mb-6 avoid-break">
          <h2 className="text-center font-bold uppercase text-slate-900 border-b border-slate-300 pb-1 mb-3 text-xs tracking-widest">个人简介</h2>
          <p className="text-slate-800 text-justify">{data.personalInfo.summary}</p>
        </section>
      )}

      {/* Education */}
      {data.education.length > 0 && (
        <section className="mb-6 avoid-break">
          <h2 className="text-center font-bold uppercase text-slate-900 border-b border-slate-300 pb-1 mb-3 text-xs tracking-widest">教育经历</h2>
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
        <section className="mb-6 avoid-break">
          <h2 className="text-center font-bold uppercase text-slate-900 border-b border-slate-300 pb-1 mb-3 text-xs tracking-widest">工作/实习经历</h2>
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
        <section className="mb-6 avoid-break">
          <h2 className="text-center font-bold uppercase text-slate-900 border-b border-slate-300 pb-1 mb-3 text-xs tracking-widest">项目状况</h2>
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
        <section className="mb-6 avoid-break">
          <h2 className="text-center font-bold uppercase text-slate-900 border-b border-slate-300 pb-1 mb-3 text-xs tracking-widest">技能专长</h2>
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
          {data.personalInfo.fullName || "您的姓名"}
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
        <section className="mb-8 grid grid-cols-4 gap-4 avoid-break">
          <h2 className="col-span-1 text-xs font-black uppercase text-slate-400 tracking-widest">个人简介</h2>
          <div className="col-span-3">
            <p className="text-slate-800">{data.personalInfo.summary}</p>
          </div>
        </section>
      )}

      {/* Education */}
      {data.education.length > 0 && (
        <section className="mb-8 grid grid-cols-4 gap-4 avoid-break">
          <h2 className="col-span-1 text-xs font-black uppercase text-slate-400 tracking-widest">教育经历</h2>
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
        <section className="mb-8 grid grid-cols-4 gap-4 avoid-break">
          <h2 className="col-span-1 text-xs font-black uppercase text-slate-400 tracking-widest">工作经历</h2>
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
        <section className="mb-8 grid grid-cols-4 gap-4 avoid-break">
          <h2 className="col-span-1 text-xs font-black uppercase text-slate-400 tracking-widest">项目状况</h2>
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
        <section className="mb-8 grid grid-cols-4 gap-4 avoid-break">
          <h2 className="col-span-1 text-xs font-black uppercase text-slate-400 tracking-widest">技能专长</h2>
          <div className="col-span-3">
            <p className="text-xs text-slate-800 whitespace-pre-wrap font-medium">{data.skills}</p>
          </div>
        </section>
      )}
    </div>
  );

  /**
   * ElegantLayout
   * 渲染优雅风格的简历版式：精致分隔线与更柔和的层次
   */
  const ElegantLayout = () => (
    <div className="h-full p-[15mm] text-sm leading-relaxed text-slate-800" style={{ fontFamily: "'Inter', ui-sans-serif, system-ui" }}>
      <header className="mb-6">
        <h1 className="text-4xl font-semibold tracking-wide text-slate-900">{data.personalInfo.fullName || '您的姓名'}</h1>
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-600">
          {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
          {data.personalInfo.phone && <span className="border-l border-slate-300 pl-4">{data.personalInfo.phone}</span>}
          {data.personalInfo.linkedin && <span className="border-l border-slate-300 pl-4">{data.personalInfo.linkedin}</span>}
          {data.personalInfo.website && <span className="border-l border-slate-300 pl-4">{data.personalInfo.website}</span>}
        </div>
      </header>

      {data.personalInfo.summary && (
        <section className="mb-6 avoid-break">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">个人简介</h2>
          <div className="border border-slate-200 rounded-md p-4 bg-white">
            <p className="text-slate-700 whitespace-pre-wrap">{data.personalInfo.summary}</p>
          </div>
        </section>
      )}

      {data.experience.length > 0 && (
        <section className="mb-6 avoid-break">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">工作/实习经历</h2>
          <div className="divide-y divide-slate-200">
            {data.experience.map(exp => (
              <div key={exp.id} className="py-3">
                <div className="flex justify-between">
                  <span className="font-medium text-slate-900">{exp.company}</span>
                  <span className="text-xs text-slate-500 tabular-nums">{exp.startDate} - {exp.endDate}</span>
                </div>
                <div className="text-xs text-slate-600 italic mb-1">{exp.position}</div>
                {exp.description && <p className="text-xs text-slate-700 whitespace-pre-wrap">{exp.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {data.education.length > 0 && (
        <section className="mb-6 avoid-break">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">教育经历</h2>
          <div className="grid grid-cols-2 gap-4">
            {data.education.map(edu => (
              <div key={edu.id} className="border border-slate-200 rounded-md p-3">
                <div className="flex justify-between">
                  <span className="font-medium text-slate-900">{edu.school}</span>
                  <span className="text-xs text-slate-500 tabular-nums">{edu.startDate} - {edu.endDate}</span>
                </div>
                <div className="text-xs text-slate-600 italic mb-1">{edu.degree}</div>
                {edu.description && <p className="text-xs text-slate-700 whitespace-pre-wrap">{edu.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {data.projects.length > 0 && (
        <section className="mb-6 avoid-break">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">项目状况</h2>
          <div className="space-y-3">
            {data.projects.map(proj => (
              <div key={proj.id} className="border-l-2 border-slate-900 pl-3">
                <div className="font-medium text-slate-900">{proj.name} <span className="text-xs text-slate-500 font-normal">| {proj.role}</span></div>
                {proj.description && <p className="text-xs text-slate-700 whitespace-pre-wrap">{proj.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {data.skills && (
        <section className="avoid-break">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">技能专长</h2>
          <div className="border border-slate-200 rounded-md p-3">
            <p className="text-xs text-slate-800 whitespace-pre-wrap">{data.skills}</p>
          </div>
        </section>
      )}
    </div>
  );

  /**
   * CompactLayout
   * 渲染紧凑风格的简历版式：更小字号与更紧密的间距，适合单页
   */
  const CompactLayout = () => (
    <div className="h-full p-[12mm] text-[12px] leading-tight text-slate-900" style={{ fontFamily: "Arial, Helvetica, sans-serif" }}>
      <header className="mb-3">
        <h1 className="text-2xl font-bold tracking-wide">{data.personalInfo.fullName || '您的姓名'}</h1>
        <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-slate-600">
          {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
          {data.personalInfo.phone && <span className="border-l border-slate-300 pl-3">{data.personalInfo.phone}</span>}
          {data.personalInfo.linkedin && <span className="border-l border-slate-300 pl-3">{data.personalInfo.linkedin}</span>}
          {data.personalInfo.website && <span className="border-l border-slate-300 pl-3">{data.personalInfo.website}</span>}
        </div>
      </header>

      {data.personalInfo.summary && (
        <section className="mb-3 avoid-break">
          <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-500">个人简介</h2>
          <p className="mt-1 text-[12px] text-slate-700 whitespace-pre-wrap">{data.personalInfo.summary}</p>
        </section>
      )}

      {data.experience.length > 0 && (
        <section className="mb-3 avoid-break">
          <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-500">工作/实习经历</h2>
          <div className="mt-1 space-y-2">
            {data.experience.map(exp => (
              <div key={exp.id}>
                <div className="flex justify-between">
                  <span className="font-semibold">{exp.company}</span>
                  <span className="text-[11px] text-slate-500 tabular-nums">{exp.startDate} - {exp.endDate}</span>
                </div>
                <div className="text-[11px] text-slate-600 italic">{exp.position}</div>
                {exp.description && <p className="text-[11px] text-slate-700 whitespace-pre-wrap">{exp.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {data.education.length > 0 && (
        <section className="mb-3 avoid-break">
          <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-500">教育经历</h2>
          <div className="mt-1 space-y-2">
            {data.education.map(edu => (
              <div key={edu.id}>
                <div className="flex justify-between">
                  <span className="font-semibold">{edu.school}</span>
                  <span className="text-[11px] text-slate-500 tabular-nums">{edu.startDate} - {edu.endDate}</span>
                </div>
                <div className="text-[11px] text-slate-600 italic">{edu.degree}</div>
                {edu.description && <p className="text-[11px] text-slate-700 whitespace-pre-wrap">{edu.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {data.projects.length > 0 && (
        <section className="mb-3 avoid-break">
          <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-500">项目状况</h2>
          <div className="mt-1 space-y-2">
            {data.projects.map(proj => (
              <div key={proj.id}>
                <div className="font-semibold">{proj.name} <span className="font-normal text-[11px] text-slate-600">| {proj.role}</span></div>
                {proj.description && <p className="text-[11px] text-slate-700 whitespace-pre-wrap">{proj.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {data.skills && (
        <section className="avoid-break">
          <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-500">技能专长</h2>
          <p className="mt-1 text-[11px] text-slate-800 whitespace-pre-wrap">{data.skills}</p>
        </section>
      )}
    </div>
  );

  /**
   * TimelineLayout
   * 渲染时间线风格的简历版式：左侧时间轴、右侧详情卡片
   */
  const TimelineLayout = () => (
    <div className="h-full p-[15mm] text-sm leading-normal text-slate-900" style={{ fontFamily: "'Inter', ui-sans-serif, system-ui" }}>
      <header className="mb-6">
        <h1 className="text-3xl font-bold tracking-wide">{data.personalInfo.fullName || '您的姓名'}</h1>
        <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-600">
          {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
          {data.personalInfo.phone && <span className="border-l border-slate-300 pl-3">{data.personalInfo.phone}</span>}
          {data.personalInfo.linkedin && <span className="border-l border-slate-300 pl-3">{data.personalInfo.linkedin}</span>}
          {data.personalInfo.website && <span className="border-l border-slate-300 pl-3">{data.personalInfo.website}</span>}
        </div>
      </header>

      {data.personalInfo.summary && (
        <section className="mb-6 avoid-break">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">个人简介</h2>
          <p className="mt-1 text-slate-700 whitespace-pre-wrap">{data.personalInfo.summary}</p>
        </section>
      )}

      {data.experience.length > 0 && (
        <section className="mb-6 avoid-break">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">工作/实习经历</h2>
          <div className="relative">
            <div className="absolute left-2 top-0 bottom-0 w-px bg-slate-300" />
            <div className="space-y-6">
              {data.experience.map((exp, idx) => (
                <div key={exp.id} className="grid grid-cols-[24px_1fr] gap-3">
                  <div className="relative">
                    <div className="w-4 h-4 rounded-full bg-slate-900 border-2 border-white shadow ring-1 ring-slate-300 translate-x-[-2px]" />
                  </div>
                  <div className="pb-2 border-b border-slate-200">
                    <div className="flex justify-between">
                      <span className="font-semibold text-slate-900">{exp.company}</span>
                      <span className="text-xs text-slate-500 tabular-nums">{exp.startDate} - {exp.endDate}</span>
                    </div>
                    <div className="text-xs text-slate-600 italic mb-1">{exp.position}</div>
                    {exp.description && <p className="text-xs text-slate-700 whitespace-pre-wrap">{exp.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {data.education.length > 0 && (
        <section className="mb-6 avoid-break">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">教育经历</h2>
          <div className="space-y-3">
            {data.education.map(edu => (
              <div key={edu.id} className="border border-slate-200 rounded-md p-3">
                <div className="flex justify-between">
                  <span className="font-medium text-slate-900">{edu.school}</span>
                  <span className="text-xs text-slate-500 tabular-nums">{edu.startDate} - {edu.endDate}</span>
                </div>
                <div className="text-xs text-slate-600 italic mb-1">{edu.degree}</div>
                {edu.description && <p className="text-xs text-slate-700 whitespace-pre-wrap">{edu.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {data.projects.length > 0 && (
        <section className="mb-6 avoid-break">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">项目状况</h2>
          <div className="space-y-3">
            {data.projects.map(proj => (
              <div key={proj.id} className="border-l-2 border-slate-900 pl-3">
                <div className="font-medium text-slate-900">{proj.name} <span className="text-xs text-slate-500 font-normal">| {proj.role}</span></div>
                {proj.description && <p className="text-xs text-slate-700 whitespace-pre-wrap">{proj.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {data.skills && (
        <section className="avoid-break">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">技能专长</h2>
          <p className="text-xs text-slate-800 whitespace-pre-wrap">{data.skills}</p>
        </section>
      )}
    </div>
  );

  return (
    <div className="w-full h-full bg-slate-100 overflow-y-auto p-4 md:p-8 flex justify-center custom-scrollbar">
      <motion.div
        ref={targetRef}
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="bg-white w-[210mm] min-h-[297mm] shadow-lg no-shadow-print transition-all duration-300 page origin-top"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={template}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {template === 'modern' && <ModernLayout />}
            {template === 'classic' && <ClassicLayout />}
            {template === 'minimal' && <MinimalLayout />}
            {template === 'elegant' && <ElegantLayout />}
            {template === 'compact' && <CompactLayout />}
            {template === 'timeline' && <TimelineLayout />}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default ResumePreview;
