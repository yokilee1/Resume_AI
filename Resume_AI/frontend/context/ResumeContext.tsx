import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { ResumeData } from '../types';
import { listResumes, updateResume as apiUpdateResume } from '../services/resumeApi';
import { createEmptyResume } from '../types';
import { useAuth } from './AuthContext';

interface ResumeContextType {
    resumes: ResumeData[];
    currentResumeId: string | null;
    currentResume: ResumeData | null;
    loading: boolean;
    setCurrentResumeId: (id: string | null) => void;
    updateResume: (updatedData: ResumeData) => void;
    addResume: (resume: ResumeData) => void;
    removeResume: (id: string) => void;
    fetchResumes: () => Promise<void>;
}

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

export const ResumeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { isAuthenticated } = useAuth();
    const [resumes, setResumes] = useState<ResumeData[]>([]);
    const [currentResumeId, setCurrentResumeId] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const saveTimerRef = useRef<any>(null);
    const pendingResumeRef = useRef<ResumeData | null>(null);

    const fetchResumes = async () => {
        if (!isAuthenticated) return;
        setLoading(true);
        try {
            const list = await listResumes(1, 100);
            setResumes(list);
            if (!currentResumeId && list.length > 0) {
                setCurrentResumeId(list[0].id);
            }
        } catch (e) {
            console.error('Failed to fetch resumes:', e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchResumes();
    }, [isAuthenticated]);

    const currentResume = resumes.find(r => r.id === currentResumeId) || null;

    const updateResume = (updatedData: ResumeData) => {
        const newResumes = resumes.map(r =>
            r.id === updatedData.id ? { ...updatedData, lastModified: Date.now() } : r
        );
        setResumes(newResumes);
        pendingResumeRef.current = updatedData;

        if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
        saveTimerRef.current = setTimeout(async () => {
            try {
                if (pendingResumeRef.current) {
                    const saved = await apiUpdateResume(pendingResumeRef.current, 'draft');
                    setResumes(prev => prev.map(r => r.id === saved.id ? saved : r));
                }
            } catch (e) {
                console.error('Auto-save failed:', e);
            }
        }, 800);
    };

    const addResume = (resume: ResumeData) => {
        setResumes(prev => [resume, ...prev]);
        setCurrentResumeId(resume.id);
    };

    const removeResume = (id: string) => {
        setResumes(prev => prev.filter(r => r.id !== id));
        if (currentResumeId === id) {
            setCurrentResumeId(null);
        }
    };

    return (
        <ResumeContext.Provider value={{
            resumes,
            currentResumeId,
            currentResume,
            loading,
            setCurrentResumeId,
            updateResume,
            addResume,
            removeResume,
            fetchResumes
        }}>
            {children}
        </ResumeContext.Provider>
    );
};

export const useResumes = () => {
    const context = useContext(ResumeContext);
    if (context === undefined) {
        throw new Error('useResumes must be used within a ResumeProvider');
    }
    return context;
};
