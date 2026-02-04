import React from 'react';
import { AppView } from '../types';
import { Sparkles, Target, Search, ArrowRight, CheckCircle2, FileText, Briefcase } from 'lucide-react';

interface LandingPageProps {
  onNavigate: (view: AppView) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      {/* Navigation */}
      <nav className="fixed w-full bg-white/80 backdrop-blur-md border-b border-slate-100 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">R</div>
              <span className="text-xl font-bold text-slate-900">Resume AI</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <button onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })} className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">核心功能</button>
              <button onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })} className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">工作原理</button>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => onNavigate(AppView.LOGIN)}
                className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors"
              >
                登录
              </button>
              <button
                onClick={() => onNavigate(AppView.REGISTER)}
                className="bg-indigo-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
              >
                注册
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 text-indigo-700 text-sm font-semibold mb-8 border border-indigo-100">
            <Sparkles size={16} />
            <span>AI 驱动的职业助手</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 mb-8 leading-tight">
            开启职业生涯 <br />
            <span className="text-indigo-600">更具自信</span>
          </h1>
          <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Resume AI 专为大学生打造。我们通过智能简历优化和职位匹配，帮助您将学术成就转化为职场成功。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => onNavigate(AppView.REGISTER)}
              className="px-8 py-4 bg-indigo-600 text-white rounded-full font-bold text-lg hover:bg-indigo-700 transition-all transform hover:-translate-y-1 shadow-xl shadow-indigo-200 flex items-center gap-2 w-full sm:w-auto justify-center"
            >
              创建简历 <ArrowRight size={20} />
            </button>
            <button
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-full font-bold text-lg hover:bg-slate-50 transition-all w-full sm:w-auto"
            >
              了解更多
            </button>
          </div>
        </div>

        {/* Abstract App Visualization */}
        <div className="mt-20 relative mx-auto max-w-5xl">
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl blur opacity-20"></div>
          <div className="relative bg-slate-50 border border-slate-200 rounded-2xl p-4 shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center p-8 bg-white rounded-xl">
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                    <Sparkles size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">AI 内容优化</h3>
                    <p className="text-sm text-slate-500">即时将您的经历描述转化为专业的职场成就。</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                    <Target size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">简历匹配分析</h3>
                    <p className="text-sm text-slate-500">获取简历与职位描述匹配程度的实时反馈。</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                    <Search size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">智能职位搜索</h3>
                    <p className="text-sm text-slate-500">发现专为应届毕业生量身定制的机会。</p>
                  </div>
                </div>
              </div>
              <div className="hidden md:block bg-slate-100 rounded-lg h-64 border border-slate-200 relative overflow-hidden">
                {/* Fake UI illustration */}
                <div className="absolute top-4 left-4 right-4 h-4 bg-white rounded w-1/3"></div>
                <div className="absolute top-12 left-4 right-4 h-32 bg-white rounded shadow-sm p-3 space-y-2">
                  <div className="h-2 bg-slate-100 rounded w-full"></div>
                  <div className="h-2 bg-slate-100 rounded w-5/6"></div>
                  <div className="h-2 bg-slate-100 rounded w-4/6"></div>
                </div>
                <div className="absolute bottom-4 right-4 p-2 bg-indigo-600 rounded-lg text-white text-xs font-bold shadow-lg">
                  匹配得分: 95%
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">为您提供入职所需的一切</h2>
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
              <div key={idx} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                <div className="text-indigo-600 mb-6 bg-indigo-50 w-16 h-16 rounded-xl flex items-center justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-indigo-600 rounded flex items-center justify-center text-white text-xs font-bold">R</div>
            <span className="font-bold text-slate-900">Resume AI</span>
          </div>
          <div className="text-slate-500 text-sm">
            © {new Date().getFullYear()} Resume AI. 保留所有权利。
          </div>
          <div className="flex gap-6">
            <a href="#" className="text-slate-500 hover:text-indigo-600 text-sm">隐私政策</a>
            <a href="#" className="text-slate-500 hover:text-indigo-600 text-sm">服务条款</a>
            <a href="#" className="text-slate-500 hover:text-indigo-600 text-sm">联系我们</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;