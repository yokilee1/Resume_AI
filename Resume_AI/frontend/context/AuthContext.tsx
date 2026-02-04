import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserProfile } from '../types';

interface AuthContextType {
    isAuthenticated: boolean;
    userProfile: UserProfile;
    login: (profile?: UserProfile) => void;
    logout: () => void;
    setUserProfile: (profile: UserProfile) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        return localStorage.getItem('resume_ai_auth') === 'true';
    });

    const [userProfile, setUserProfileState] = useState<UserProfile>(() => {
        const saved = localStorage.getItem('resume_ai_profile');
        return saved ? JSON.parse(saved) : {
            fullName: '张小明',
            email: 'xiaoming.zhang@university.edu',
            phone: '138-0000-0000',
            location: '上海, 中国',
            website: 'www.xiaoming-resume.me',
            avatar: '',
            bio: '一名对 AI 和前端开发充满热情的软件工程专业学生。'
        };
    });

    useEffect(() => {
        localStorage.setItem('resume_ai_auth', isAuthenticated ? 'true' : 'false');
    }, [isAuthenticated]);

    useEffect(() => {
        localStorage.setItem('resume_ai_profile', JSON.stringify(userProfile));
    }, [userProfile]);

    const login = (profile?: UserProfile) => {
        if (profile) setUserProfileState(profile);
        setIsAuthenticated(true);
    };

    const logout = () => {
        setIsAuthenticated(false);
        localStorage.removeItem('resume_ai_auth');
    };

    const setUserProfile = (profile: UserProfile) => {
        setUserProfileState(profile);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, userProfile, login, logout, setUserProfile }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
