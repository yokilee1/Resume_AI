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
import { useAuth } from './context/AuthContext';
import { useResumes } from './context/ResumeContext';
import { useJobs } from './context/JobContext';

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/auth/login" replace />;
  return <>{children}</>;
};

// App 主控组件 - 仅保留路由配置与顶层布局

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, userProfile, logout } = useAuth();
  const { resumes, currentResumeId, currentResume, updateResume, addResume, removeResume, setCurrentResumeId } = useResumes();
  const { globalJobs, setGlobalJobs } = useJobs();

  const previewRef = useRef<HTMLDivElement>(null);

  // Sync currentResumeId with URL for editor
  useEffect(() => {
    if (location.pathname.startsWith('/editor/')) {
      const id = location.pathname.split('/').pop();
      if (id && id !== currentResumeId) {
        setCurrentResumeId(id);
      }
    }
  }, [location.pathname, currentResumeId]);

  const handleExportPDF = useReactToPrint({
    contentRef: previewRef,
    documentTitle: currentResume ? (currentResume.title || '简历') : '简历',
  });

  const handleLogout = () => {
    logout();
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
          <Route path="/auth/login" element={<AuthPage initialView={AppView.LOGIN} />} />
          <Route path="/auth/register" element={<AuthPage initialView={AppView.REGISTER} />} />

          {/* Protected Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <div className="w-full h-full overflow-y-auto bg-slate-50">
                <Dashboard />
              </div>
            </ProtectedRoute>
          } />

          <Route path="/editor/:id" element={
            <ProtectedRoute>
              <div className="flex w-full h-full">
                <div className="w-full md:w-1/2 lg:w-5/12 h-full z-10 no-print">
                  {currentResume ? <EditorForm data={currentResume} onChange={updateResume} /> : <div>加载中...</div>}
                </div>
                <div className="hidden md:block md:w-1/2 lg:w-7/12 h-full bg-slate-200/50">
                  {currentResume && <ResumePreview data={currentResume} targetRef={previewRef} />}
                </div>
              </div>
            </ProtectedRoute>
          } />

          <Route path="/match" element={
            <ProtectedRoute>
              <div className="w-full h-full no-print">
                <JobAssistant />
              </div>
            </ProtectedRoute>
          } />

          <Route path="/profile" element={
            <ProtectedRoute>
              <div className="w-full h-full overflow-y-auto bg-slate-50">
                <UserProfilePage />
              </div>
            </ProtectedRoute>
          } />

          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminDashboard />
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
