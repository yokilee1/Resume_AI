import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { JobSearchResult } from '../types';

interface JobContextType {
    globalJobs: JobSearchResult[];
    setGlobalJobs: (jobs: JobSearchResult[]) => void;
}

const JobContext = createContext<JobContextType | undefined>(undefined);

export const JobProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [globalJobs, setGlobalJobsState] = useState<JobSearchResult[]>(() => {
        const saved = localStorage.getItem('resume_ai_jobs');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('resume_ai_jobs', JSON.stringify(globalJobs));
    }, [globalJobs]);

    const setGlobalJobs = (jobs: JobSearchResult[]) => {
        setGlobalJobsState(jobs);
    };

    return (
        <JobContext.Provider value={{ globalJobs, setGlobalJobs }}>
            {children}
        </JobContext.Provider>
    );
};

export const useJobs = () => {
    const context = useContext(JobContext);
    if (context === undefined) {
        throw new Error('useJobs must be used within a JobProvider');
    }
    return context;
};
