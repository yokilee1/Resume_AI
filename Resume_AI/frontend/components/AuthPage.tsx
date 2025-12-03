import React, { useState } from 'react';
import { AppView } from '../types';
import { Mail, Lock, User, ArrowRight, Loader2 } from 'lucide-react';
import { login, register, setToken } from '../services/apiClient';

interface AuthPageProps {
  initialView: AppView.LOGIN | AppView.REGISTER;
  onNavigate: (view: AppView) => void;
  onLoginSuccess: () => void;
}

/**
 * 认证页面：支持登录与注册并与后端接口互联
 */
const AuthPage: React.FC<AuthPageProps> = ({ initialView, onNavigate, onLoginSuccess }) => {
  const [view, setView] = useState<AppView.LOGIN | AppView.REGISTER>(initialView);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState<string | null>(null);

  /**
   * 提交认证表单，按当前视图调用登录或注册接口
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      if (view === AppView.REGISTER) {
        const data = await register(formData.name, formData.email, formData.password);
        setToken(data.token);
        onLoginSuccess();
      } else {
        const data = await login(formData.email, formData.password);
        setToken(data.token);
        onLoginSuccess();
      }
    } catch (err: any) {
      setError(err?.message || '请求失败，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleView = () => {
    setView(view === AppView.LOGIN ? AppView.REGISTER : AppView.LOGIN);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans">
      
      {/* Left Panel - Visuals */}
      <div className="hidden md:flex md:w-1/2 bg-indigo-600 text-white p-12 flex-col justify-between relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-12">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-indigo-600 font-bold">R</div>
            <span className="text-xl font-bold">Resume AI</span>
          </div>
          <h2 className="text-4xl font-bold mb-6 leading-tight">
            Start your journey <br/>to the perfect career.
          </h2>
          <p className="text-indigo-100 text-lg max-w-md">
            Join thousands of students using Resume AI to land top internships and jobs at world-class companies.
          </p>
        </div>
        
        {/* Decorative Circles */}
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50"></div>

        <div className="relative z-10 text-sm text-indigo-200">
          © {new Date().getFullYear()} Resume AI Inc.
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 bg-white">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
              {view === AppView.LOGIN ? 'Welcome back' : 'Create an account'}
            </h2>
            <p className="mt-2 text-slate-500">
              {view === AppView.LOGIN 
                ? 'Enter your credentials to access your account.' 
                : 'Get started with your free account today.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 rounded-md bg-red-50 border border-red-200 text-red-700 text-sm">
                {error}
              </div>
            )}
            {view === AppView.REGISTER && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <User size={20} />
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="John Doe"
                    className="block w-full pl-10 px-4 py-3 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail size={20} />
                </div>
                <input
                  type="email"
                  required
                  placeholder="name@university.edu"
                  className="block w-full pl-10 px-4 py-3 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock size={20} />
                </div>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  className="block w-full pl-10 px-4 py-3 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all shadow-lg shadow-indigo-200 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? <Loader2 className="animate-spin" size={20} /> : (
                <>
                  {view === AppView.LOGIN ? 'Sign In' : 'Sign Up'} <ArrowRight size={18} className="ml-2" />
                </>
              )}
            </button>
          </form>

          <div className="text-center text-sm">
            <span className="text-slate-500">
              {view === AppView.LOGIN ? "Don't have an account? " : "Already have an account? "}
            </span>
            <button
              onClick={toggleView}
              className="font-bold text-indigo-600 hover:text-indigo-500 transition-colors"
            >
              {view === AppView.LOGIN ? 'Sign up for free' : 'Sign in'}
            </button>
          </div>
          
          <div className="text-center mt-6">
             <button onClick={() => onNavigate(AppView.LANDING)} className="text-xs text-slate-400 hover:text-slate-600 transition-colors">
               Back to Home
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;