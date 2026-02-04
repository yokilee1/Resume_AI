import React, { useState, useRef, useEffect } from 'react';
import { useReactToPrint } from 'react-to-print';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { ResumeData, AppView, UserProfile, JobSearchResult } from './types';
import EditorForm from './components/EditorForm';
import ResumePreview from './components/ResumePreview';
import JobAssistant from './components/JobAssistant';
import LandingPage from './components/LandingPage';
import AuthPage from './components/AuthPage';
import Dashboard from './components/Dashboard';
import UserProfilePage from './components/UserProfile';
import AdminDashboard from './components/AdminDashboard';
import { FileText, Search, Printer, LogOut, LayoutDashboard, User, Shield } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { listResumes, createResume, updateResume as apiUpdateResume, deleteResume as apiDeleteResume, duplicateResume as apiDuplicateResume } from './services/resumeApi';

// Protected Route Component
const ProtectedRoute = ({ children, isAuthenticated }: { children: React.ReactNode, isAuthenticated: boolean }) => {
  if (!isAuthenticated) return <Navigate to="/auth/login" replace />;
  return <>{children}</>;
};

// Helper to create empty resume
const createEmptyResume = (): ResumeData => ({
  id: uuidv4(),
  title: '我的简历',
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
  name: '学生用户',
  email: 'student@university.edu',
  role: '学生'
};

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('resume_ai_auth') === 'true';
  });

  // State: All Resumes
  const [resumes, setResumes] = useState<ResumeData[]>([]);

  // State: Global Job Database
  const [globalJobs, setGlobalJobs] = useState<JobSearchResult[]>(() => {
    const savedJobs = localStorage.getItem('resume_ai_jobs');
    return savedJobs ? JSON.parse(savedJobs) : "";
  });

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
  useEffect(() => {
    if (!isAuthenticated) return;
    (async () => {
      try {
        const list = await listResumes(1, 100);
        setResumes(list);
        if (!currentResumeId && list.length > 0) setCurrentResumeId(list[0].id);
      } catch (e) {
        console.error(e);
      }
    })();
  }, [isAuthenticated]);

  useEffect(() => {
    localStorage.setItem('resume_ai_jobs', JSON.stringify(globalJobs));
  }, [globalJobs]);

  useEffect(() => {
    localStorage.setItem('resume_ai_auth', isAuthenticated ? 'true' : 'false');
  }, [isAuthenticated]);

  // Sync currentResumeId with URL for editor
  useEffect(() => {
    if (location.pathname.startsWith('/editor/')) {
      const id = location.pathname.split('/').pop();
      if (id && id !== currentResumeId) {
        setCurrentResumeId(id);
      }
    }
  }, [location.pathname, currentResumeId]);

  useEffect(() => {
    localStorage.setItem('resume_ai_profile', JSON.stringify(userProfile));
  }, [userProfile]);

  // --- Helpers ---
  const saveTimerRef = useRef<any>(null);
  const pendingResumeRef = useRef<ResumeData | null>(null);

  const handleUpdateResume = (updatedData: ResumeData) => {
    const newResumes = resumes.map(r =>
      r.id === updatedData.id ? { ...updatedData, lastModified: Date.now() } : r
    );
    setResumes(newResumes);
    pendingResumeRef.current = updatedData;
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(async () => {
      try {
        const saved = await apiUpdateResume(pendingResumeRef.current as ResumeData, 'draft');
        setResumes(prev => prev.map(r => r.id === saved.id ? saved : r));
      } catch (e) {
        console.error(e);
      }
    }, 800);
  };

  const handleCreateResume = async () => {
    const newResumeLocal = createEmptyResume();
    newResumeLocal.title = '新建简历';
    try {
      const created = await createResume(newResumeLocal);
      setResumes([created, ...resumes]);
      setCurrentResumeId(created.id);
      navigate(`/editor/${created.id}`);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteResume = async (id: string) => {
    if (!confirm("您确定要删除这份简历吗？")) return;
    try {
      await apiDeleteResume(id);
      setResumes(resumes.filter(r => r.id !== id));
      if (currentResumeId === id) setCurrentResumeId(null);
    } catch (e) {
      console.error(e);
    }
  };

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
    navigate(`/editor/${id}`);
  };

  const handleExportPDF = useReactToPrint({
    contentRef: previewRef,
    documentTitle: currentResume ? (currentResume.title || '简历') : '简历',
  });

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    navigate('/dashboard');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentResumeId(null);
    navigate('/');
  };

  // Helper to determine active tab based on path
  const isActive = (path: string) => location.pathname === path;
  const isEditor = location.pathname.startsWith('/editor');

  return (
    <div className="h-screen w-full flex flex-col bg-slate-100 text-slate-900 font-sans overflow-hidden">
      {/* Navbar - Only show if not on landing or auth pages */}
      {!['/', '/auth/login', '/auth/register', '/admin'].includes(location.pathname) && (
        <nav className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 z-20 no-print flex-shrink-0">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/dashboard')}>
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">R</div>
            <span className="text-xl font-bold text-slate-800 hidden md:block">Resume AI</span>
          </div>

          <div className="flex bg-slate-100 p-1 rounded-lg">
            <button
              onClick={() => navigate('/dashboard')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${isActive('/dashboard') ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              <LayoutDashboard size={16} /> <span className="hidden sm:inline">控制面板</span>
            </button>

            {currentResumeId && (
              <button
                onClick={() => navigate(`/editor/${currentResumeId}`)}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${isEditor ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
              >
                <FileText size={16} /> <span className="hidden sm:inline">简历编辑</span>
              </button>
            )}

            <button
              onClick={() => navigate('/match')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${isActive('/match') ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              <Search size={16} /> <span className="hidden sm:inline">职位匹配</span>
            </button>
          </div>

          <div className="flex items-center gap-4">
            {isEditor && (
              <button
                onClick={() => handleExportPDF()}
                className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-slate-50 rounded-full transition-colors hidden sm:block"
                title="导出 PDF"
              >
                <Printer size={20} />
              </button>
            )}
            <div className="h-6 w-px bg-slate-200 mx-1 hidden sm:block"></div>

            <button
              onClick={() => navigate('/profile')}
              className={`flex items-center gap-2 text-sm font-medium transition-colors ${isActive('/profile') ? 'text-indigo-600' : 'text-slate-600 hover:text-slate-900'}`}
              title="个人资料"
            >
              <User size={20} />
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-red-600 transition-colors"
              title="退出登录"
            >
              <LogOut size={20} />
            </button>
          </div>
        </nav>
      )}

      {/* Main Content Area */}
      <main className="flex-1 w-full overflow-hidden relative">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth/login" element={<AuthPage initialView={AppView.LOGIN} onLoginSuccess={handleLoginSuccess} />} />
          <Route path="/auth/register" element={<AuthPage initialView={AppView.REGISTER} onLoginSuccess={handleLoginSuccess} />} />

          {/* Protected Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <div className="w-full h-full overflow-y-auto bg-slate-50">
                <Dashboard
                  resumes={resumes}
                  onCreate={handleCreateResume}
                  onSelect={handleSelectResume}
                  onDelete={handleDeleteResume}
                  onDuplicate={handleDuplicateResume}
                />
              </div>
            </ProtectedRoute>
          } />

          <Route path="/editor/:id" element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              {currentResume ? (
                <div className="flex w-full h-full">
                  <div className="w-full md:w-1/2 lg:w-5/12 h-full z-10 no-print">
                    <EditorForm data={currentResume} onChange={handleUpdateResume} />
                  </div>
                  <div className="hidden md:block md:w-1/2 lg:w-7/12 h-full bg-slate-200/50">
                    <ResumePreview data={currentResume} targetRef={previewRef} />
                  </div>
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-slate-50">
                  <div className="text-center">
                    <p className="text-slate-500 mb-4">正在加载简历...</p>
                    <button onClick={() => navigate('/dashboard')} className="text-indigo-600 hover:underline">返回控制面板</button>
                  </div>
                </div>
              )}
            </ProtectedRoute>
          } />

          <Route path="/match" element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <div className="w-full h-full no-print">
                <JobAssistant resumes={resumes} availableJobs={globalJobs} />
              </div>
            </ProtectedRoute>
          } />

          <Route path="/profile" element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <div className="w-full h-full overflow-y-auto bg-slate-50">
                <UserProfilePage
                  user={userProfile}
                  onUpdate={setUserProfile}
                />
              </div>
            </ProtectedRoute>
          } />

          <Route path="/admin" element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <AdminDashboard
                jobs={globalJobs}
                onUpdateJobs={setGlobalJobs}
                userCount={1240}
                resumeCount={resumes.length + 5000}
              />
            </ProtectedRoute>
          } />

          {/* Fallback */}
          <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/"} replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
