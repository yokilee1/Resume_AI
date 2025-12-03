import React, { useState, useRef, useEffect } from 'react';
import { ResumeData, AppView, UserProfile } from './types';
import EditorForm from './components/EditorForm';
import ResumePreview from './components/ResumePreview';
import JobAssistant from './components/JobAssistant';
import LandingPage from './components/LandingPage';
import AuthPage from './components/AuthPage';
import Dashboard from './components/Dashboard';
import UserProfilePage from './components/UserProfile';
import { FileText, Search, Printer, LogOut, LayoutDashboard, User } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { listResumes, createResume, updateResume as apiUpdateResume, deleteResume as apiDeleteResume, duplicateResume as apiDuplicateResume } from './services/resumeApi';

// Helper to create empty resume
/**
 * 创建一个空简历结构（前端模型）
 */
const createEmptyResume = (): ResumeData => ({
  id: uuidv4(),
  title: 'My First Resume',
  templateId: 'modern',
  lastModified: Date.now(),
  personalInfo: {
    fullName: '',
    email: '',
    phone: '',
    linkedin: '',
    website: '',
    summary: ''
  },
  education: [],
  experience: [],
  projects: [],
  skills: ''
});

const DEFAULT_USER: UserProfile = {
  name: 'Student User',
  email: 'student@university.edu',
  role: 'Student'
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('resume_ai_auth') === 'true';
  });

  const [view, setView] = useState<AppView>(() => {
    return isAuthenticated ? AppView.DASHBOARD : AppView.LANDING;
  });

  // State: All Resumes（从后端加载）
  const [resumes, setResumes] = useState<ResumeData[]>([]);

  // State: Current Active Resume ID
  const [currentResumeId, setCurrentResumeId] = useState<string | null>(null);

  // State: User Profile
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const savedProfile = localStorage.getItem('resume_ai_profile');
    return savedProfile ? JSON.parse(savedProfile) : DEFAULT_USER;
  });

  // Derived State: Current Resume Data
  const currentResume = resumes.find(r => r.id === currentResumeId) || resumes[0];

  const previewRef = useRef<HTMLDivElement>(null);

  // --- Persistence Effects ---
  // 从后端加载简历列表
  useEffect(() => {
    if (!isAuthenticated) return;
    (async () => {
      try {
        const list = await listResumes(1, 100);
        setResumes(list);
        if (!currentResumeId && list.length > 0) setCurrentResumeId(list[0].id);
      } catch (e) {
        // 忽略错误，保持前端可用
        console.error(e);
      }
    })();
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      localStorage.setItem('resume_ai_auth', 'true');
    } else {
      localStorage.removeItem('resume_ai_auth');
    }
  }, [isAuthenticated]);

  useEffect(() => {
    localStorage.setItem('resume_ai_profile', JSON.stringify(userProfile));
  }, [userProfile]);

  // --- Helpers ---
  // 保存节流（避免每次输入都打接口）
  const saveTimerRef = useRef<any>(null);
  const pendingResumeRef = useRef<ResumeData | null>(null);

  /**
   * 更新本地状态并在短延时后自动同步到后端
   */
  const handleUpdateResume = (updatedData: ResumeData) => {
    const newResumes = resumes.map(r =>
      r.id === updatedData.id ? { ...updatedData, lastModified: Date.now() } : r
    );
    setResumes(newResumes);
    pendingResumeRef.current = updatedData;
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(async () => {
      try {
        // 将状态标记为 draft 保存
        const saved = await apiUpdateResume(pendingResumeRef.current as ResumeData, 'draft');
        // 用服务端回写的时间戳更新本地
        setResumes(prev => prev.map(r => r.id === saved.id ? saved : r));
      } catch (e) {
        console.error(e);
      }
    }, 800);
  };

  /**
   * 创建简历（后端）
   */
  const handleCreateResume = async () => {
    const newResumeLocal = createEmptyResume();
    newResumeLocal.title = 'New Resume';
    try {
      const created = await createResume(newResumeLocal);
      setResumes([created, ...resumes]);
      setCurrentResumeId(created.id);
      setView(AppView.EDITOR);
    } catch (e) {
      console.error(e);
    }
  };

  /**
   * 删除简历（后端）
   */
  const handleDeleteResume = async (id: string) => {
    if (!confirm("Are you sure you want to delete this resume?")) return;
    try {
      await apiDeleteResume(id);
      setResumes(resumes.filter(r => r.id !== id));
      if (currentResumeId === id) setCurrentResumeId(null);
    } catch (e) {
      console.error(e);
    }
  };

  /**
   * 复制简历（后端）
   */
  const handleDuplicateResume = async (id: string) => {
    try {
      const copy = await apiDuplicateResume(id);
      setResumes([copy, ...resumes]);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSelectResume = (id: string) => {
    setCurrentResumeId(id);
    setView(AppView.EDITOR);
  };

  const handlePrint = () => {
     window.print();
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setView(AppView.DASHBOARD);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setView(AppView.LANDING);
    setCurrentResumeId(null);
  };

  // --- Routing Logic ---

  if (view === AppView.LANDING) {
    return <LandingPage onNavigate={setView} />;
  }

  if (view === AppView.LOGIN || view === AppView.REGISTER) {
    return (
      <AuthPage 
        initialView={view} 
        onNavigate={setView} 
        onLoginSuccess={handleLoginSuccess} 
      />
    );
  }

  return (
    <div className="h-screen w-full flex flex-col bg-slate-100 text-slate-900 font-sans overflow-hidden">
      {/* Navbar */}
      <nav className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 z-20 no-print flex-shrink-0">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView(AppView.DASHBOARD)}>
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">R</div>
          <span className="text-xl font-bold text-slate-800 hidden md:block">Resume AI</span>
        </div>

        {isAuthenticated && (
          <div className="flex bg-slate-100 p-1 rounded-lg">
             <button
              onClick={() => setView(AppView.DASHBOARD)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
                view === AppView.DASHBOARD ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LayoutDashboard size={16} /> <span className="hidden sm:inline">Dashboard</span>
            </button>
            
            {/* Show Editor only if we have a current resume */}
            {currentResume && (
              <button
                onClick={() => setView(AppView.EDITOR)}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
                  view === AppView.EDITOR ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <FileText size={16} /> <span className="hidden sm:inline">Editor</span>
              </button>
            )}

            <button
              onClick={() => setView(AppView.MATCH)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
                view === AppView.MATCH ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Search size={16} /> <span className="hidden sm:inline">Jobs & Match</span>
            </button>
          </div>
        )}

        <div className="flex items-center gap-4">
           {view === AppView.EDITOR && (
             <button 
               onClick={handlePrint}
               className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-slate-50 rounded-full transition-colors hidden sm:block"
               title="Print / Save as PDF"
             >
              <Printer size={20} />
            </button>
           )}
           <div className="h-6 w-px bg-slate-200 mx-1 hidden sm:block"></div>
           
           <button 
             onClick={() => setView(AppView.PROFILE)}
             className={`flex items-center gap-2 text-sm font-medium transition-colors ${view === AppView.PROFILE ? 'text-indigo-600' : 'text-slate-600 hover:text-slate-900'}`}
             title="Profile"
           >
              <User size={20} />
           </button>

           <button 
             onClick={handleLogout}
             className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-red-600 transition-colors"
             title="Sign Out"
           >
            <LogOut size={20} />
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 flex overflow-hidden relative">
        
        {/* View: Dashboard */}
        {view === AppView.DASHBOARD && (
          <div className="w-full h-full overflow-y-auto bg-slate-50">
            <Dashboard 
              resumes={resumes} 
              onCreate={handleCreateResume} 
              onSelect={handleSelectResume} 
              onDelete={handleDeleteResume}
              onDuplicate={handleDuplicateResume}
            />
          </div>
        )}

        {/* View: Profile */}
        {view === AppView.PROFILE && (
           <div className="w-full h-full overflow-y-auto bg-slate-50">
             <UserProfilePage user={userProfile} onUpdate={setUserProfile} />
           </div>
        )}

        {/* View: Editor (Split View) */}
        {view === AppView.EDITOR && currentResume && (
          <>
            {/* Editor Pane */}
            <div className="w-full md:w-1/2 lg:w-5/12 h-full z-10 no-print">
              <EditorForm data={currentResume} onChange={handleUpdateResume} />
            </div>
            {/* Preview Pane */}
            <div className="hidden md:block md:w-1/2 lg:w-7/12 h-full bg-slate-200/50">
               <ResumePreview data={currentResume} targetRef={previewRef} />
            </div>
          </>
        )}

        {/* View: Match & Search */}
        {view === AppView.MATCH && (
          <div className="w-full h-full no-print">
            <JobAssistant resumes={resumes} />
          </div>
        )}

        {/* Fallback for Editor if no resume selected */}
        {view === AppView.EDITOR && !currentResume && (
           <div className="w-full h-full flex items-center justify-center bg-slate-50">
             <div className="text-center">
               <p className="text-slate-500 mb-4">No resume selected.</p>
               <button onClick={() => setView(AppView.DASHBOARD)} className="text-indigo-600 hover:underline">Go to Dashboard</button>
             </div>
           </div>
        )}
        
        {/* Print-only container */}
        <div className="hidden print-only absolute top-0 left-0 w-full h-full bg-white z-50">
           {currentResume && <ResumePreview data={currentResume} />}
        </div>

      </main>
    </div>
  );
}

export default App;