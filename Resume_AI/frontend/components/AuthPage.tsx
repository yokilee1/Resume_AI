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
    <div className="w-full min-h-screen font-sans relative flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/Users/yorkie/.gemini/antigravity/brain/6f06cf85-81da-49f0-8da5-662c6d9be93c/hero_background_mountain_jpg_1770850736374.png"
          alt="Auth Background"
          className="w-full h-full object-cover scale-105"
        />
        <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"></div>
      </div>

      <div className="relative z-10 w-full max-w-lg p-4">

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white/70 backdrop-blur-2xl border border-white/40 rounded-[2.5rem] p-8 md:p-12 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.3)]"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={view}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="space-y-8"
            >
              <div className="text-center">
                <h2 className="text-4xl font-black text-slate-900 tracking-tight">
                  {view === AppView.LOGIN ? '欢迎回来' : '创建账户'}
                </h2>
                <p className="mt-3 text-slate-600 font-medium">
                  {view === AppView.LOGIN
                    ? '请输入您的凭据以访问您的帐户。'
                    : '立即开始您的免费账户之旅。'}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-700 text-sm font-bold flex items-center gap-3"
                  >
                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
                    {error}
                  </motion.div>
                )}

                {view === AppView.REGISTER && (
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">全名</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-black transition-colors">
                        <User size={20} />
                      </div>
                      <input
                        type="text"
                        required
                        placeholder="张三"
                        className="block w-full pl-12 pr-4 py-4 bg-white/50 border border-slate-200/50 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black focus:bg-white transition-all shadow-sm"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">电子邮箱</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-black transition-colors">
                      <Mail size={20} />
                    </div>
                    <input
                      type="email"
                      required
                      placeholder="name@university.edu"
                      className="block w-full pl-12 pr-4 py-4 bg-white/50 border border-slate-200/50 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black focus:bg-white transition-all shadow-sm"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">密码</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-black transition-colors">
                      <Lock size={20} />
                    </div>
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      className="block w-full pl-12 pr-4 py-4 bg-white/50 border border-slate-200/50 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black focus:bg-white transition-all shadow-sm"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center items-center py-5 px-4 border border-transparent rounded-2xl text-base font-black text-white bg-black hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-all shadow-2xl disabled:opacity-70 disabled:cursor-not-allowed group"
                >
                  {isLoading ? <Loader2 className="animate-spin" size={24} /> : (
                    <>
                      {view === AppView.LOGIN ? '登 录' : '注 册'} <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </motion.button>
              </form>

              <div className="text-center pt-4">
                <p className="text-slate-500 font-medium">
                  {view === AppView.LOGIN ? "没有账户？" : "已有账户？"}
                  <button
                    onClick={toggleView}
                    className="ml-2 font-bold text-black border-b-2 border-black hover:opacity-70 transition-opacity"
                  >
                    {view === AppView.LOGIN ? '立即注册' : '返回登录'}
                  </button>
                </p>
              </div>

              <div className="text-center border-t border-slate-200/50 pt-6">
                <button
                  onClick={() => navigate('/')}
                  className="text-sm font-bold text-slate-400 hover:text-black transition-colors flex items-center justify-center gap-2 mx-auto"
                >
                  <ArrowRight size={16} className="rotate-180" /> 返回首页
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default AuthPage;