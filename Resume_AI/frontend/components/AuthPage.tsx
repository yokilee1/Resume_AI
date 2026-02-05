import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppView } from '../types';
import { Mail, Lock, User, ArrowRight, Loader2 } from 'lucide-react';
import { login as loginApi, register, setToken } from '../services/apiClient';
import { motion, AnimatePresence } from 'framer-motion';

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
    <div className="w-full min-h-screen bg-white flex flex-col md:flex-row font-sans">

      {/* Left Panel - Visuals */}
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="hidden md:flex md:w-1/2 bg-indigo-600 text-white p-12 flex-col justify-between relative overflow-hidden"
      >
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-12">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-indigo-600 font-bold shadow-lg shadow-indigo-900/20">R</div>
            <span className="text-xl font-bold tracking-tight">Resume AI</span>
          </div>
          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-5xl font-extrabold mb-6 leading-tight"
          >
            开启您的<br />完美职业生涯。
          </motion.h2>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-indigo-100 text-lg max-w-md leading-relaxed"
          >
            加入数千名学生的行列，使用 Resume AI 获得世界级公司的顶级实习和工作岗位。
          </motion.p>
        </div>

        {/* Decorative Circles */}
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse-slow"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse-slow" style={{ animationDelay: '2s' }}></div>

        <div className="relative z-10 text-sm text-indigo-200 font-medium">
          © {new Date().getFullYear()} Resume AI Inc.
        </div>
      </motion.div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 bg-white relative">
        {/* Background gradient hint */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50/50 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-50/50 rounded-full blur-3xl -z-10"></div>

        <div className="w-full max-w-md">
          <AnimatePresence mode="wait">
            <motion.div
              key={view}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="space-y-8"
            >
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

              <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    className="p-3 rounded-xl bg-red-50 border border-red-100 text-red-700 text-sm font-medium flex items-center gap-2"
                  >
                    <div className="w-1 h-1 bg-red-400 rounded-full"></div>
                    {error}
                  </motion.div>
                )}
                {view === AppView.REGISTER && (
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 ml-1">全名</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                        <User size={18} />
                      </div>
                      <input
                        type="text"
                        required
                        placeholder="张三"
                        className="block w-full pl-11 px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 ml-1">电子邮箱</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                      <Mail size={18} />
                    </div>
                    <input
                      type="email"
                      required
                      placeholder="name@university.edu"
                      className="block w-full pl-11 px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 ml-1">密码</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                      <Lock size={18} />
                    </div>
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      className="block w-full pl-11 px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                  </div>
                </div>

                <motion.button
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center items-center py-4 px-4 border border-transparent rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all shadow-xl shadow-indigo-200 disabled:opacity-70 disabled:cursor-not-allowed group"
                >
                  {isLoading ? <Loader2 className="animate-spin" size={20} /> : (
                    <>
                      {view === AppView.LOGIN ? '登录' : '注册'} <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </motion.button>
              </form>

              <div className="text-center text-sm">
                <span className="text-slate-500">
                  {view === AppView.LOGIN ? "没有账户？" : "已有账户？"}
                </span>
                <button
                  onClick={toggleView}
                  className="ml-1 font-bold text-indigo-600 hover:text-indigo-500 transition-colors"
                >
                  {view === AppView.LOGIN ? '立即注册' : '返回登录'}
                </button>
              </div>

              <div className="text-center mt-6">
                <button
                  onClick={() => navigate('/')}
                  className="text-sm font-medium text-slate-400 hover:text-slate-600 transition-colors flex items-center justify-center gap-1 mx-auto"
                >
                  返回首页
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;