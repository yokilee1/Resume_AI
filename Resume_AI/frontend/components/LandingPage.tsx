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
              <button onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })} className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Features</button>
              <button onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })} className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">How it Works</button>
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => onNavigate(AppView.LOGIN)}
                className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors"
              >
                Sign In
              </button>
              <button 
                onClick={() => onNavigate(AppView.REGISTER)}
                className="bg-indigo-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
              >
                Get Started
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
            <span>AI-Powered Career Assistant</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 mb-8 leading-tight">
            Launch Your Career <br />
            <span className="text-indigo-600">With Confidence</span>
          </h1>
          <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Resume AI is tailored for university students. We help you translate your academic achievements into professional success with intelligent resume optimization and job matching.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button 
              onClick={() => onNavigate(AppView.REGISTER)}
              className="px-8 py-4 bg-indigo-600 text-white rounded-full font-bold text-lg hover:bg-indigo-700 transition-all transform hover:-translate-y-1 shadow-xl shadow-indigo-200 flex items-center gap-2 w-full sm:w-auto justify-center"
            >
              Create Your Resume <ArrowRight size={20} />
            </button>
            <button 
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-full font-bold text-lg hover:bg-slate-50 transition-all w-full sm:w-auto"
            >
              Learn More
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
                      <h3 className="font-semibold text-slate-900">AI Content Optimization</h3>
                      <p className="text-sm text-slate-500">Transform bullet points into professional achievements instantly.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                      <Target size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">Resume Score Analysis</h3>
                      <p className="text-sm text-slate-500">Get real-time feedback on how well your resume matches job descriptions.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                      <Search size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">Smart Job Search</h3>
                      <p className="text-sm text-slate-500">Find opportunities tailored for fresh graduates.</p>
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
                    Match Score: 95%
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
             <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Everything you need to get hired</h2>
             <p className="text-lg text-slate-600 max-w-2xl mx-auto">Stop struggling with formatting and writer's block. Our platform handles the heavy lifting.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <FileText size={32} />,
                title: "Smart Resume Editor",
                desc: "Intuitive editor that formats your resume perfectly as you type. No design skills required."
              },
              {
                icon: <Sparkles size={32} />,
                title: "AI Writing Assistant",
                desc: "Stuck on what to say? Let AI rewrite your experience to sound more professional and impactful."
              },
              {
                icon: <Target size={32} />,
                title: "Job Match Scoring",
                desc: "Paste a job description and see exactly how well your resume matches, with tips to improve."
              },
              {
                icon: <Briefcase size={32} />,
                title: "Opportunity Finder",
                desc: "Search for jobs specifically for students and recent grads directly within the platform."
              },
              {
                icon: <CheckCircle2 size={32} />,
                title: "ATS Friendly",
                desc: "Templates designed to pass Applicant Tracking Systems used by top companies."
              },
              {
                icon: <Search size={32} />,
                title: "Keyword Optimization",
                desc: "Identify missing keywords from job descriptions to ensure you get noticed by recruiters."
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
            © {new Date().getFullYear()} Resume AI. All rights reserved.
          </div>
          <div className="flex gap-6">
            <a href="#" className="text-slate-500 hover:text-indigo-600 text-sm">Privacy Policy</a>
            <a href="#" className="text-slate-500 hover:text-indigo-600 text-sm">Terms of Service</a>
            <a href="#" className="text-slate-500 hover:text-indigo-600 text-sm">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;