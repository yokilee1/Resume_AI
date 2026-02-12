import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    LayoutDashboard,
    FileText,
    Search,
    User,
    LogOut,
    Sparkles,
    Menu,
    X,
    Printer
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useResumes } from '../context/ResumeContext';

interface NavbarProps {
    onExport?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onExport }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { isAuthenticated, logout } = useAuth();
    const { currentResumeId } = useResumes();

    const isLanding = location.pathname === '/';
    const isAuth = location.pathname.startsWith('/auth');
    const isAdmin = location.pathname === '/admin' || location.pathname.startsWith('/admin/');
    const isActive = (path: string) => location.pathname === path;
    const isEditor = location.pathname.startsWith('/editor');

    // Admin Mode Navbar
    if (isAdmin) {
        const adminTabs = [
            { id: 'overview', label: '概览', icon: LayoutDashboard },
            { id: 'jobs', label: '职位库', icon: Search },
            { id: 'users', label: '用户', icon: User },
            { id: 'templates', label: '模板', icon: FileText },
        ];

        return (
            <div className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4 no-print">
                <motion.nav
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="bg-black/80 backdrop-blur-xl border border-white/10 rounded-full px-4 md:px-6 h-14 flex items-center gap-4 md:gap-8 shadow-2xl shadow-black/20"
                >
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/dashboard')}>
                        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-black font-bold">R</div>
                        <span className="text-lg font-bold text-white hidden lg:block tracking-tight">Resume AI</span>
                    </div>

                    <div className="flex bg-white/10 p-1 rounded-full border border-white/5">
                        {adminTabs.map(tab => {
                            const path = `/admin/${tab.id}`;
                            const isTabActive = location.pathname === path || (tab.id === 'overview' && location.pathname === '/admin');
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => navigate(path)}
                                    className={`px-4 py-1.5 rounded-full text-xs md:text-sm font-bold transition-all flex items-center gap-2 ${isTabActive ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-300 hover:text-white'}`}
                                >
                                    <tab.icon size={16} /> <span className="hidden sm:inline">{tab.label}</span>
                                </button>
                            );
                        })}
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="bg-white/10 p-2 rounded-full text-slate-300 hover:text-white hover:bg-white/20 transition-all border border-white/10"
                            title="返回控制面板"
                        >
                            <LayoutDashboard size={20} />
                        </button>
                        <button
                            onClick={() => { logout(); navigate('/'); }}
                            className="p-2 text-slate-400 hover:text-red-400 hover:bg-white/10 rounded-full transition-all"
                            title="退出登录"
                        >
                            <LogOut size={20} />
                        </button>
                    </div>
                </motion.nav>
            </div>
        );
    }

    // Landing Mode Navbar
    if (isLanding) {
        return (
            <div className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4 no-print">
                <motion.nav
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="bg-black/80 backdrop-blur-xl border border-white/10 rounded-full px-6 py-3 flex items-center gap-8 shadow-2xl"
                >
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
                        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-black font-bold">R</div>
                        <span className="text-white font-bold hidden sm:inline">Resume AI</span>
                    </div>

                    <div className="hidden md:flex items-center space-x-6 text-sm font-medium text-slate-300">
                        <button onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-white transition-colors">核心功能</button>
                    </div>

                    <div className="flex items-center gap-4">
                        {isAuthenticated ? (
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="bg-white text-black px-5 py-2 rounded-full text-sm font-bold hover:bg-slate-100 transition-all active:scale-95 flex items-center gap-2"
                            >
                                控制面板 <LayoutDashboard size={14} />
                            </button>
                        ) : (
                            <>
                                <button
                                    onClick={() => navigate('/auth/login')}
                                    className="text-sm font-medium text-white hover:text-slate-300 transition-colors"
                                >
                                    登录
                                </button>
                                <button
                                    onClick={() => navigate('/auth/register')}
                                    className="bg-white text-black px-5 py-2 rounded-full text-sm font-bold hover:bg-slate-100 transition-all active:scale-95"
                                >
                                    免费开通
                                </button>
                            </>
                        )}
                    </div>
                </motion.nav>
            </div>
        );
    }

    // Auth Mode Navbar (Minimal)
    if (isAuth) {
        return (
            <div className="fixed top-8 left-0 right-0 z-50 flex justify-center px-4 no-print pointer-events-none">
                <div className="pointer-events-auto flex flex-col items-center gap-4">
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-black font-bold shadow-2xl">R</div>
                        <span className="text-white text-2xl font-black tracking-tight drop-shadow-lg">Resume AI</span>
                    </div>
                </div>
            </div>
        );
    }

    // App Mode Navbar
    return (
        <div className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4 no-print pointer-events-none">
            <div className="relative flex items-center">
                <motion.nav
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="pointer-events-auto bg-black/80 backdrop-blur-xl border border-white/10 rounded-full px-4 md:px-6 h-14 flex items-center gap-4 md:gap-8 shadow-2xl shadow-black/20"
                >
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/dashboard')}>
                        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-black font-bold">R</div>
                        <span className="text-lg font-bold text-white hidden lg:block tracking-tight">Resume AI</span>
                    </div>

                    <div className="flex bg-white/10 p-1 rounded-full border border-white/5">
                        <button
                            onClick={() => navigate('/dashboard')}
                            className={`px-4 py-1.5 rounded-full text-xs md:text-sm font-bold transition-all flex items-center gap-2 ${isActive('/dashboard') ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-300 hover:text-white'}`}
                        >
                            <LayoutDashboard size={16} /> <span className="hidden sm:inline">控制面板</span>
                        </button>

                        {currentResumeId && (
                            <button
                                onClick={() => navigate(`/editor/${currentResumeId}`)}
                                className={`px-4 py-1.5 rounded-full text-xs md:text-sm font-bold transition-all flex items-center gap-2 ${isEditor ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-300 hover:text-white'}`}
                            >
                                <FileText size={16} /> <span className="hidden sm:inline">简历编辑</span>
                            </button>
                        )}

                        <button
                            onClick={() => navigate('/match')}
                            className={`px-4 py-1.5 rounded-full text-xs md:text-sm font-bold transition-all flex items-center gap-2 ${isActive('/match') ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-300 hover:text-white'}`}
                        >
                            <Search size={16} /> <span className="hidden sm:inline">职位匹配</span>
                        </button>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => navigate('/profile')}
                            className={`p-2 rounded-full transition-all ${isActive('/profile') ? 'bg-white text-slate-900' : 'text-slate-400 hover:text-white hover:bg-white/10'}`}
                            title="个人资料"
                        >
                            <User size={20} />
                        </button>

                        <button
                            onClick={() => { logout(); navigate('/'); }}
                            className="p-2 text-slate-400 hover:text-red-400 hover:bg-white/10 rounded-full transition-all"
                            title="退出登录"
                        >
                            <LogOut size={20} />
                        </button>
                    </div>
                </motion.nav>

                {/* Floating Export Button for Editor - Closer to navbar */}
                {isEditor && onExport && (
                    <div className="absolute left-[calc(100%+0.75rem)] h-14 flex items-center">
                        <motion.button
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={onExport}
                            className="pointer-events-auto w-14 h-14 bg-black/80 backdrop-blur-xl border border-white/10 rounded-full flex items-center justify-center text-white hover:bg-black transition-all shadow-xl shadow-black/20"
                            title="下载 PDF"
                        >
                            <Printer size={20} />
                        </motion.button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Navbar;
