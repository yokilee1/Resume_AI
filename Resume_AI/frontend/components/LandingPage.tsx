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


      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/Users/yorkie/.gemini/antigravity/brain/6f06cf85-81da-49f0-8da5-662c6d9be93c/hero_background_garden_jpg_1770850721607.png"
            alt="Hero Background"
            className="w-full h-full object-cover scale-105"
          />
          {/* Transition Overlay */}
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-white via-white/80 to-transparent"></div>
          <div className="absolute inset-0 bg-black/5"></div>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative z-10 text-center max-w-5xl mx-auto px-4 pt-20"
        >
          <motion.h1
            variants={itemVariants}
            className="text-6xl md:text-8xl font-extrabold tracking-tight text-slate-900 mb-8 leading-[1.1]"
          >
            让 AI 助你一臂之力 <br />
            轻松开启 <i className="font-serif italic text-slate-500">理想职业</i>
          </motion.h1>

          <motion.div
            variants={itemVariants}
            className="flex flex-col md:flex-row items-center justify-center gap-4 mb-16"
          >
            <p className="text-xl text-slate-700 max-w-xl md:text-right">
              自动化申请、面试准备、简历优化。<br />
              无需编写代码，即可让 AI 代理为您完成繁重工作。
            </p>
            <div className="h-px w-12 bg-slate-300 hidden md:block"></div>
            <div className="relative w-full max-w-sm">
              <input
                type="email"
                placeholder="输入您的邮箱"
                className="w-full pl-6 pr-32 py-4 rounded-full bg-white/80 backdrop-blur-md border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 shadow-xl"
              />
              <button
                onClick={() => navigate('/auth/register')}
                className="absolute right-2 top-2 bottom-2 px-6 bg-black text-white rounded-full font-bold text-sm hover:bg-slate-800 transition-all active:scale-95"
              >
                免费尝试
              </button>
            </div>
          </motion.div>

          {/* Trust Bar */}
          <motion.div
            variants={itemVariants}
            className="pt-12 border-t border-slate-200/50"
          >
          </motion.div>
        </motion.div>


      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 bg-black/5">
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
                className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl hover:border-slate-300 transition-all"
              >
                <div className="text-slate-900 mb-6 bg-slate-100 w-16 h-16 rounded-2xl flex items-center justify-center shadow-inner">
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
      <footer className="bg-black/5 border-t border-slate-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white font-bold">R</div>
              <span className="text-xl font-bold text-slate-900">Resume AI</span>
            </div>
            <div className="flex gap-10">
              <a href="#" className="text-slate-500 hover:text-slate-900 transition-colors text-sm font-medium">隐私政策</a>
              <a href="#" className="text-slate-500 hover:text-slate-900 transition-colors text-sm font-medium">服务条款</a>
              <a href="#" className="text-slate-500 hover:text-slate-900 transition-colors text-sm font-medium">联系我们</a>
            </div>
            <div className="text-slate-400 text-sm font-medium">
              © {new Date().getFullYear()} Resume AI. 保留所有权利。
            </div>
          </div>
        </div>
      </footer>
    </div >
  );
};

export default LandingPage;