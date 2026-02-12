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
import Navbar from './components/Navbar';

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
  const { isAuthenticated, logout } = useAuth();
  const { currentResumeId, currentResume, updateResume, addResume, removeResume, setCurrentResumeId } = useResumes();
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

  return (
    <div className="h-screen w-full flex flex-col bg-slate-100 text-slate-900 font-sans overflow-hidden">
      <Navbar onExport={handleExportPDF} />

      {/* Main Content Area */}
      <main className="flex-1 w-full overflow-hidden relative">
        <Routes>
          <Route path="/" element={
            <div className="w-full h-full overflow-y-auto">
              <LandingPage />
            </div>
          } />
          <Route path="/auth/login" element={
            <div className="w-full h-full overflow-y-auto">
              <AuthPage initialView={AppView.LOGIN} />
            </div>
          } />
          <Route path="/auth/register" element={
            <div className="w-full h-full overflow-y-auto">
              <AuthPage initialView={AppView.REGISTER} />
            </div>
          } />

          {/* Protected Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <div className="w-full h-full bg-slate-50 pt-28 px-4 md:px-6 pb-6 overflow-hidden flex flex-col">
                <div className="flex-1 overflow-y-auto bg-white rounded-[2.5rem] border border-slate-200/50 shadow-sm">
                  <Dashboard />
                </div>
              </div>
            </ProtectedRoute>
          } />

          <Route path="/editor/:id" element={
            <ProtectedRoute>
              <div className="w-full h-full bg-slate-50 pt-28 px-4 md:px-6 pb-6 overflow-hidden flex flex-col">
                <div className="flex-1 overflow-hidden bg-white rounded-[2.5rem] border border-slate-200/50 shadow-sm flex">
                  <div className="w-full md:w-1/2 lg:w-5/12 h-full z-10 no-print">
                    {currentResume ? <EditorForm data={currentResume} onChange={updateResume} /> : <div>加载中...</div>}
                  </div>
                  <div className="hidden md:block md:w-1/2 lg:w-7/12 h-full bg-slate-200/50">
                    {currentResume && <ResumePreview data={currentResume} targetRef={previewRef} />}
                  </div>
                </div>
              </div>
            </ProtectedRoute>
          } />

          <Route path="/match" element={
            <ProtectedRoute>
              <div className="w-full h-full bg-slate-50 pt-28 px-4 md:px-6 pb-6 overflow-hidden flex flex-col">
                <div className="flex-1 overflow-y-auto bg-white rounded-[2.5rem] border border-slate-200/50 shadow-sm no-print">
                  <JobAssistant />
                </div>
              </div>
            </ProtectedRoute>
          } />

          <Route path="/profile" element={
            <ProtectedRoute>
              <div className="w-full h-full bg-slate-50 pt-28 px-4 md:px-6 pb-6 overflow-hidden flex flex-col">
                <div className="flex-1 overflow-y-auto bg-white rounded-[2.5rem] border border-slate-200/50 shadow-sm">
                  <UserProfilePage />
                </div>
              </div>
            </ProtectedRoute>
          } />

          <Route path="/admin/:tab?" element={
            <ProtectedRoute>
              <div className="w-full h-full bg-slate-50 pt-28 px-4 md:px-6 pb-6 overflow-hidden flex flex-col">
                <div className="flex-1 overflow-y-auto bg-white rounded-[2.5rem] border border-slate-200/50 shadow-sm">
                  <AdminDashboard />
                </div>
              </div>
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
