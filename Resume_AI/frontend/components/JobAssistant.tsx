import React, { useState, useEffect, useRef } from 'react';
import { searchJobs as searchJobsAI } from '../services/geminiService';
import { analyzeJobMatchBackend } from '../services/aiApi';
import { searchJobsDB } from '../services/jobApi';
import { useReactToPrint } from 'react-to-print';
import { JobMatchResult, ResumeData, JobSearchResult } from '../types';
import { Search, CheckCircle, AlertCircle, Loader2, ArrowRight, Briefcase, FileText, ChevronRight, Check, Building2, MapPin, DollarSign, Printer } from 'lucide-react';

import { useResumes } from '../context/ResumeContext';
import { useJobs } from '../context/JobContext';

// Helper to convert resume object to text for analysis
const getResumeAsText = (r: ResumeData) => `
  Name: ${r.personalInfo.fullName}
  Summary: ${r.personalInfo.summary}
  Skills: ${r.skills}
  Experience: ${r.experience.map(e => `${e.position} at ${e.company}: ${e.description}`).join('\n')}
  Education: ${r.education.map(e => `${e.degree} at ${e.school}`).join('\n')}
  Projects: ${r.projects.map(p => `${p.name}: ${p.description}`).join('\n')}
`;

type Step = 'FIND_JOB' | 'SELECT_RESUME' | 'RESULT';

const JobAssistant: React.FC = () => {
  const { resumes } = useResumes();
  const { globalJobs } = useJobs();
  const [currentStep, setCurrentStep] = useState<Step>('FIND_JOB');

  // Step 1: Find Job State
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<JobSearchResult[]>([]);
  const [selectedJob, setSelectedJob] = useState<JobSearchResult | null>(null);
  const [manualJobDescription, setManualJobDescription] = useState('');
  const [dataSource, setDataSource] = useState<'DB' | 'AI' | null>(null);

  // Step 2: Select Resume State
  const [selectedResumeId, setSelectedResumeId] = useState<string | null>(null);

  // Step 3: Analysis State
  const [isMatching, setIsMatching] = useState(false);
  const [matchResult, setMatchResult] = useState<JobMatchResult | null>(null);

  const reportRef = useRef<HTMLDivElement>(null);
  const handleExportReport = useReactToPrint({
    contentRef: reportRef,
    documentTitle: `职位匹配报告 - ${selectedJob?.title || '分析'}`,
  });

  // 初次加载：优先拉取数据库岗位，失败或为空时不阻塞界面
  useEffect(() => {
    let mounted = true;
    const init = async () => {
      setIsSearching(true);
      try {
        const results = await searchJobsDB('');
        if (mounted && Array.isArray(results) && results.length > 0) {
          setSearchResults(results);
          setDataSource('DB');
        } else {
          const ai = await searchJobsAI('software engineer intern');
          if (mounted) {
            setSearchResults(ai);
            setDataSource('AI');
          }
        }
      } catch {
        try {
          const ai = await searchJobsAI('software engineer intern');
          if (mounted) {
            setSearchResults(ai);
            setDataSource('AI');
          }
        } catch {
          if (mounted) {
            setSearchResults([]);
            setDataSource(null);
          }
        }
      } finally {
        if (mounted) setIsSearching(false);
      }
    };
    init();
    return () => { mounted = false; };
  }, [globalJobs]);

  // --- Handlers ---

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    const query = searchQuery.trim();
    try {
      const dbResults = await searchJobsDB(query);
      if (dbResults && dbResults.length > 0) {
        setSearchResults(dbResults);
        setDataSource('DB');
      } else {
        const aiResults = await searchJobsAI(query);
        setSearchResults(aiResults);
        setDataSource('AI');
      }
    } catch {
      try {
        const aiResults = await searchJobsAI(query);
        setSearchResults(aiResults);
        setDataSource('AI');
      } catch {
        setSearchResults([]);
        setDataSource(null);
      }
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectJob = (job: JobSearchResult) => {
    setSelectedJob(job);
    setManualJobDescription(job.description); // Pre-fill the editable area
  };

  const handleJobConfirm = () => {
    if (manualJobDescription.trim()) {
      setCurrentStep('SELECT_RESUME');
    }
  };

  const handleResumeSelect = (id: string) => {
    setSelectedResumeId(id);
  };

  const handleAnalyze = async () => {
    const resume = resumes.find(r => r.id === selectedResumeId);
    if (!resume || !manualJobDescription) return;

    setIsMatching(true);
    setCurrentStep('RESULT');

    try {
      const resumeText = getResumeAsText(resume);
      const result = await analyzeJobMatchBackend(resumeText, manualJobDescription);
      setMatchResult(result);
      console.log('Job match result', result);
    } catch (e) {
      console.error(e);
      alert("Analysis failed. Please try again.");
    } finally {
      setIsMatching(false);
    }
  };

  const resetFlow = () => {
    setCurrentStep('FIND_JOB');
    setMatchResult(null);
    setSelectedJob(null);
    setManualJobDescription('');
  };

  // --- Renders ---

  return (
    <div className="w-full h-full bg-slate-50 p-6 overflow-y-auto">
      <div className="max-w-4xl mx-auto">

        {/* Progress Stepper */}
        <div className="flex items-center justify-center mb-8">
          <div className={`flex items-center gap-2 ${currentStep === 'FIND_JOB' ? 'text-indigo-600 font-bold' : 'text-slate-500'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${currentStep === 'FIND_JOB' ? 'bg-indigo-100' : 'bg-slate-200'}`}>1</div>
            <span>查找岗位</span>
          </div>
          <div className="w-12 h-px bg-slate-300 mx-4"></div>
          <div className={`flex items-center gap-2 ${currentStep === 'SELECT_RESUME' ? 'text-indigo-600 font-bold' : 'text-slate-500'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${currentStep === 'SELECT_RESUME' ? 'bg-indigo-100' : 'bg-slate-200'}`}>2</div>
            <span>选择简历</span>
          </div>
          <div className="w-12 h-px bg-slate-300 mx-4"></div>
          <div className={`flex items-center gap-2 ${currentStep === 'RESULT' ? 'text-indigo-600 font-bold' : 'text-slate-500'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${currentStep === 'RESULT' ? 'bg-indigo-100' : 'bg-slate-200'}`}>3</div>
            <span>匹配结果</span>
          </div>
        </div>

        {/* STEP 1: FIND JOB */}
        {currentStep === 'FIND_JOB' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <h2 className="text-xl font-bold text-slate-800 mb-4">搜索职位</h2>
              <form onSubmit={handleSearch} className="flex gap-2 mb-6">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="筛选职位 (例如：开发、字节跳动、上海)..."
                  className="flex-1 rounded-lg border border-slate-300 px-4 py-3 text-slate-800 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                <button
                  type="submit"
                  disabled={isSearching}
                  className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 flex items-center"
                >
                  {isSearching ? <Loader2 className="animate-spin" size={20} /> : <Search size={20} />}
                </button>
              </form>

              {/* Search Results Grid */}
              <div className="mb-8">
                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">
                  {searchResults.length > 0 ? `可用职位 (${searchResults.length})` : '未找到相关职位'}
                  {dataSource && (
                    <span className={`ml-2 px-2 py-0.5 rounded-full text-[10px] font-bold ${dataSource === 'DB' ? 'bg-green-100 text-green-700' : 'bg-indigo-100 text-indigo-700'}`}>
                      {dataSource === 'DB' ? '数据库' : 'AI'}
                    </span>
                  )}
                </h3>
                {searchResults.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto pr-2">
                    {searchResults.map((job, idx) => (
                      <div
                        key={idx}
                        onClick={() => handleSelectJob(job)}
                        className={`p-4 rounded-lg border cursor-pointer transition-all ${selectedJob === job
                          ? 'border-indigo-500 bg-indigo-50 ring-1 ring-indigo-500'
                          : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50'
                          }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            <h4 className="font-bold text-slate-900 line-clamp-1" title={job.title}>{job.title}</h4>
                            <div className="flex flex-col gap-1 mt-1">
                              <div className="flex items-center text-xs text-slate-600 font-medium">
                                <Building2 size={12} className="mr-1 text-slate-400" /> {job.company}
                              </div>
                              <div className="flex items-center text-xs text-slate-500">
                                <MapPin size={12} className="mr-1 text-slate-400" /> {job.location}
                              </div>
                              {job.salary && (
                                <div className="flex items-center text-xs text-slate-500">
                                  <DollarSign size={12} className="mr-1 text-slate-400" /> {job.salary}
                                </div>
                              )}
                            </div>
                          </div>
                          {selectedJob === job && <CheckCircle size={18} className="text-indigo-600 flex-shrink-0 ml-2" />}
                        </div>
                        <p className="text-xs text-slate-500 mt-2 line-clamp-3 leading-relaxed border-t border-slate-100 pt-2">{job.description}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Job Description Input (Manual or Selected) */}
              <div className="pt-6 border-t border-slate-100">
                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  职位详情
                </h3>
                <p className="text-xs text-slate-400 mb-3">
                  {selectedJob ? '请查看下方选中的职位详情。' : '请从上方选择一个职位或在此粘贴职位描述。'}
                </p>
                <textarea
                  value={manualJobDescription}
                  onChange={(e) => setManualJobDescription(e.target.value)}
                  placeholder="职位描述将在此显示..."
                  className="w-full h-40 rounded-lg border border-slate-300 px-4 py-3 text-sm text-slate-800 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 mb-4"
                />

                <div className="flex justify-end">
                  <button
                    onClick={handleJobConfirm}
                    disabled={!manualJobDescription.trim()}
                    className="bg-slate-900 text-white px-6 py-2 rounded-lg font-medium hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    下一步：选择简历 <ArrowRight size={16} className="ml-2" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}


        {/* STEP 2: SELECT RESUME */}
        {currentStep === 'SELECT_RESUME' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <h2 className="text-xl font-bold text-slate-800 mb-2">选择简历</h2>
              <p className="text-slate-500 mb-6">选择一份简历来与该职位进行匹配分析。</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {resumes.map((resume) => (
                  <div
                    key={resume.id}
                    onClick={() => handleResumeSelect(resume.id)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${selectedResumeId === resume.id
                      ? 'border-indigo-500 bg-indigo-50 ring-1 ring-indigo-500 shadow-sm'
                      : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50'
                      }`}
                  >
                    <div className={`p-3 rounded-lg ${selectedResumeId === resume.id ? 'bg-indigo-200 text-indigo-700' : 'bg-slate-100 text-slate-500'}`}>
                      <FileText size={24} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-slate-900">{resume.title || '未命名'}</h4>
                      <p className="text-xs text-slate-500">更新于: {new Date(resume.lastModified).toLocaleDateString('zh-CN')}</p>
                    </div>
                    {selectedResumeId === resume.id && <CheckCircle size={20} className="text-indigo-600" />}
                  </div>
                ))}

                {resumes.length === 0 && (
                  <div className="col-span-2 text-center py-8 text-slate-500">
                    您目前还没有简历。请前往“我的简历”页面创建一个。
                  </div>
                )}
              </div>

              <div className="flex justify-between pt-6 border-t border-slate-100">
                <button
                  onClick={() => setCurrentStep('FIND_JOB')}
                  className="text-slate-600 font-medium hover:text-slate-900 px-4 py-2"
                >
                  返回
                </button>
                <button
                  onClick={handleAnalyze}
                  disabled={!selectedResumeId}
                  className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center shadow-md shadow-indigo-200"
                >
                  开始匹配分析 <Briefcase size={18} className="ml-2" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: RESULT */}
        {currentStep === 'RESULT' && (
          <div className="animate-in fade-in slide-in-from-right-4">
            {isMatching ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-slate-200 shadow-sm">
                <Loader2 size={48} className="text-indigo-600 animate-spin mb-4" />
                <h3 className="text-xl font-bold text-slate-800">正在分析匹配度...</h3>
                <p className="text-slate-500 mt-2">正在将您的简历技能与职位要求进行对比。</p>
              </div>
            ) : matchResult ? (
              <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-8 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">分析报告</span>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900">职位匹配度</h2>
                  </div>
                  <div className="flex items-center gap-3 no-print">
                    <button
                      onClick={() => handleExportReport()}
                      className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-slate-50 rounded-full transition-colors border border-slate-200"
                      title="导出报告"
                    >
                      <Printer size={20} />
                    </button>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-xs text-slate-500 uppercase tracking-wider">综合评分</div>
                        <div className={`text-4xl font-black ${matchResult.score >= 70 ? 'text-green-600' : matchResult.score >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                          {matchResult.score}%
                        </div>
                      </div>
                      <div className={`w-16 h-16 rounded-full border-4 flex items-center justify-center ${matchResult.score >= 70 ? 'border-green-100 bg-green-50' : 'border-red-100 bg-red-50'}`}>
                        {matchResult.score >= 70 ? <Check size={32} className="text-green-600" /> : <AlertCircle size={32} className="text-red-600" />}
                      </div>
                    </div>
                  </div>
                </div>

                <div ref={reportRef} className="print-padding">

                  <div className="mb-8">
                    <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                      <Briefcase size={18} className="text-slate-400" /> 分析摘要
                    </h4>
                    <p className="text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-100">
                      {matchResult.analysis}
                    </p>
                  </div>

                  {/* Additional Dimensions */}
                  {(matchResult.skillMatch != null || matchResult.experienceRelevance != null || matchResult.cultureFit != null) && (
                    <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                      {matchResult.skillMatch != null && (
                        <div className="p-4 rounded-lg border border-slate-200 bg-white">
                          <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">技能匹配</div>
                          <div className="text-2xl font-bold text-slate-900">{Number(matchResult.skillMatch)}%</div>
                        </div>
                      )}
                      {matchResult.experienceRelevance != null && (
                        <div className="p-4 rounded-lg border border-slate-200 bg-white">
                          <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">经历相关度</div>
                          <div className="text-2xl font-bold text-slate-900">{Number(matchResult.experienceRelevance)}%</div>
                        </div>
                      )}
                      {matchResult.cultureFit != null && (
                        <div className="p-4 rounded-lg border border-slate-200 bg-white">
                          <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">文化契合度</div>
                          <div className="text-2xl font-bold text-slate-900">{Number(matchResult.cultureFit)}%</div>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h4 className="font-bold text-red-700 mb-4 flex items-center gap-2">
                        <AlertCircle size={18} /> 缺失关键词
                      </h4>
                      <div className="bg-red-50 rounded-lg p-5 border border-red-100 h-full">
                        {matchResult.missingKeywords.length > 0 ? (
                          <ul className="space-y-2">
                            {matchResult.missingKeywords.map((kw, i) => (
                              <li key={i} className="flex items-start text-sm text-red-800">
                                <span className="mr-2 mt-1.5 w-1.5 h-1.5 bg-red-400 rounded-full flex-shrink-0"></span>
                                {kw}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-sm text-red-600 italic">没有明显的关键缺失。</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-bold text-indigo-700 mb-4 flex items-center gap-2">
                        <CheckCircle size={18} /> 改进建议
                      </h4>
                      <div className="bg-indigo-50 rounded-lg p-5 border border-indigo-100 h-full">
                        <ul className="space-y-3">
                          {matchResult.suggestions.map((sugg, i) => (
                            <li key={i} className="flex items-start text-sm text-indigo-800">
                              <span className="bg-indigo-200 text-indigo-700 rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold mr-2 flex-shrink-0 mt-0.5">{i + 1}</span>
                              {sugg}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                </div>

                <div className="mt-10 pt-6 border-t border-slate-100 flex justify-center no-print">
                  <button onClick={resetFlow} className="text-slate-600 font-medium hover:text-indigo-600 flex items-center gap-2">
                    开始新的分析 <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        )}

      </div>
    </div>
  );
};

export default JobAssistant;
