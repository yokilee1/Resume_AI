import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppView } from '../types';
import { Mail, Lock, User, ArrowRight, Loader2 } from 'lucide-react';
import { login as loginApi, register, setToken } from '../services/apiClient';

import { useAuth } from '../context/AuthContext';

const AuthPage: React.FC<{ initialView: string }> = ({ initialView }) => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [view, setView] = useState<AppView.LOGIN | AppView.REGISTER>(initialView as any);
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
        login();
        navigate('/dashboard');
      } else {
        const data = await loginApi(formData.email, formData.password);
        setToken(data.token);
        login();
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err?.message || '请求失败，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleView = () => {
    const nextView = view === AppView.LOGIN ? AppView.REGISTER : AppView.LOGIN;
    setView(nextView);
    navigate(nextView === AppView.LOGIN ? '/auth/login' : '/auth/register');
  };

  return (
    <div className="w-full min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans">

      {/* Left Panel - Visuals */}
      <div className="hidden md:flex md:w-1/2 bg-indigo-600 text-white p-12 flex-col justify-between relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-12">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-indigo-600 font-bold">R</div>
            <span className="text-xl font-bold">Resume AI</span>
          </div>
          <h2 className="text-4xl font-bold mb-6 leading-tight">
            开启您的<br />完美职业生涯。
          </h2>
          <p className="text-indigo-100 text-lg max-w-md">
            加入数千名学生的行列，使用 Resume AI 获得世界级公司的顶级实习和工作岗位。
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
              {view === AppView.LOGIN ? '欢迎回来' : '创建账户'}
            </h2>
            <p className="mt-2 text-slate-500">
              {view === AppView.LOGIN
                ? '请输入您的凭据以访问您的帐户。'
                : '立即开始您的免费账户之旅。'}
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
                <label className="text-sm font-medium text-slate-700">全名</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <User size={20} />
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="张三"
                    className="block w-full pl-10 px-4 py-3 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">电子邮箱</label>
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
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">密码</label>
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
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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
                  {view === AppView.LOGIN ? '登录' : '注册'} <ArrowRight size={18} className="ml-2" />
                </>
              )}
            </button>
          </form>

          <div className="text-center text-sm">
            <span className="text-slate-500">
              {view === AppView.LOGIN ? "没有账户？" : "已有账户？"}
            </span>
            <button
              onClick={toggleView}
              className="font-bold text-indigo-600 hover:text-indigo-500 transition-colors"
            >
              {view === AppView.LOGIN ? '免费注册' : '登录'}
            </button>
          </div>

          <div className="text-center mt-6">
            <button onClick={() => navigate('/')} className="text-xs text-slate-400 hover:text-slate-600 transition-colors">
              返回首页
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;