import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Target, Search, ArrowRight, CheckCircle2, FileText, Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" as const }
    }
  };

  return (
    <div className="w-full min-h-screen bg-white text-slate-900 font-sans overflow-x-hidden">
      {/* Animated Background Blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-100 rounded-full blur-[120px] opacity-60 animate-pulse-slow"></div>
        <div className="absolute bottom-[5%] right-[-5%] w-[35%] h-[35%] bg-purple-100 rounded-full blur-[100px] opacity-40 animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Navigation */}
      <nav className="fixed w-full bg-white/70 backdrop-blur-xl border-b border-slate-100 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="flex items-center gap-2"
            >
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-200">R</div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600">Resume AI</span>
            </motion.div>
            <div className="hidden md:flex items-center space-x-8">
              <button onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })} className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">核心功能</button>
            </div>
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="flex items-center gap-4"
            >
              <button
                onClick={() => navigate('/auth/login')}
                className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors"
              >
                登录
              </button>
              <button
                onClick={() => navigate('/auth/register')}
                className="bg-indigo-600 text-white px-5 py-2 rounded-full text-sm font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 active:scale-95"
              >
                免费注册
              </button>
            </motion.div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center max-w-4xl mx-auto"
        >
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 text-indigo-700 text-sm font-bold mb-8 border border-indigo-100 shadow-sm"
          >
            <Sparkles size={16} className="animate-pulse" />
            <span>AI 驱动的职业助手</span>
          </motion.div>
          <motion.h1
            variants={itemVariants}
            className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-8 leading-tight"
          >
            开启职业生涯 <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">更具自信</span>
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            Resume AI 专为大学生打造。我们通过智能简历优化和职位匹配，帮助您将学术成就转化为职场成功。
          </motion.p>
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <button
              onClick={() => navigate('/auth/register')}
              className="px-8 py-4 bg-indigo-600 text-white rounded-full font-bold text-lg hover:bg-indigo-700 transition-all transform hover:-translate-y-1 shadow-2xl shadow-indigo-200 flex items-center gap-2 w-full sm:w-auto justify-center group"
            >
              创建简历 <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-full font-bold text-lg hover:bg-slate-50 hover:border-slate-300 transition-all w-full sm:w-auto shadow-sm"
            >
              了解更多
            </button>
          </motion.div>
        </motion.div>

        {/* Abstract App Visualization */}
        <motion.div
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mt-20 relative mx-auto max-w-5xl"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-3xl blur opacity-20 animate-pulse-slow"></div>
          <div className="relative bg-slate-50 border border-slate-200 rounded-3xl p-4 shadow-3xl overflow-hidden glass-card">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center p-8 bg-white/50 rounded-2xl">
              <div className="space-y-6">
                <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-white transition-colors cursor-default border border-transparent hover:border-slate-100 hover:shadow-sm">
                  <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl">
                    <Sparkles size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">AI 内容优化</h3>
                    <p className="text-sm text-slate-500 leading-relaxed">即时将您的经历描述转化为专业的职场成就。</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-white transition-colors cursor-default border border-transparent hover:border-slate-100 hover:shadow-sm">
                  <div className="p-3 bg-green-100 text-green-600 rounded-xl">
                    <Target size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">简历匹配分析</h3>
                    <p className="text-sm text-slate-500 leading-relaxed">获取简历与职位描述匹配程度的实时反馈。</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-white transition-colors cursor-default border border-transparent hover:border-slate-100 hover:shadow-sm">
                  <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
                    <Search size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">智能职位搜索</h3>
                    <p className="text-sm text-slate-500 leading-relaxed">发现专为应届毕业生量身定制的机会。</p>
                  </div>
                </div>
              </div>
              <div className="hidden md:block bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl h-72 border border-slate-200 relative overflow-hidden shadow-inner">
                {/* Fake UI illustration */}
                <div className="absolute top-6 left-6 right-6 h-4 bg-white rounded-full w-1/3 opacity-80"></div>
                <div className="absolute top-16 left-6 right-6 bottom-6 bg-white rounded-xl shadow-lg p-5 space-y-3">
                  <div className="h-3 bg-slate-100 rounded-full w-full"></div>
                  <div className="h-3 bg-slate-100 rounded-full w-5/6"></div>
                  <div className="h-3 bg-slate-100 rounded-full w-4/6"></div>
                  <div className="pt-4 space-y-2">
                    <div className="h-2 bg-indigo-50 rounded-full w-full"></div>
                    <div className="h-2 bg-indigo-50 rounded-full w-3/4"></div>
                  </div>
                </div>
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 1.2, type: 'spring' }}
                  className="absolute bottom-8 right-8 p-3 bg-indigo-600 rounded-2xl text-white shadow-2xl flex flex-col items-center"
                >
                  <span className="text-xs font-medium opacity-80 mb-0.5">匹配得分</span>
                  <span className="text-2xl font-black">95%</span>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-6">为您提供入职所需的一切</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">不再为格式和文书而烦恼。我们的平台为您处理最繁重的工作。</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <FileText size={32} />,
                title: "智能简历编辑器",
                desc: "直观的编辑器，在您输入时自动完美排版。无需设计技能。"
              },
              {
                icon: <Sparkles size={32} />,
                title: "AI 写作助手",
                desc: "不知道该写什么？让 AI 重新撰写您的经历，使其听起来更专业、更有影响力。"
              },
              {
                icon: <Target size={32} />,
                title: "职位匹配评分",
                desc: "粘贴职位描述，查看简历匹配度及其改进建议。"
              },
              {
                icon: <Briefcase size={32} />,
                title: "机遇发现器",
                desc: "直接在平台内搜索专门针对学生和应届毕业生的职位。"
              },
              {
                icon: <CheckCircle2 size={32} />,
                title: "ATS 友好",
                desc: "模板设计旨在通过顶级公司使用的解析系统 (ATS)。"
              },
              {
                icon: <Search size={32} />,
                title: "关键词优化",
                desc: "识别职位描述中缺失的关键技能，确保您受到招聘人员的关注。"
              }
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -8 }}
                className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl hover:border-indigo-100 transition-all"
              >
                <div className="text-indigo-600 mb-6 bg-indigo-50 w-16 h-16 rounded-2xl flex items-center justify-center shadow-inner">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">R</div>
              <span className="text-xl font-bold text-slate-900">Resume AI</span>
            </div>
            <div className="flex gap-10">
              <a href="#" className="text-slate-500 hover:text-indigo-600 transition-colors text-sm font-medium">隐私政策</a>
              <a href="#" className="text-slate-500 hover:text-indigo-600 transition-colors text-sm font-medium">服务条款</a>
              <a href="#" className="text-slate-500 hover:text-indigo-600 transition-colors text-sm font-medium">联系我们</a>
            </div>
            <div className="text-slate-400 text-sm font-medium">
              © {new Date().getFullYear()} Resume AI. 保留所有权利。
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;