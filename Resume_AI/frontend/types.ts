import { v4 as uuidv4 } from 'uuid';

export interface Education {
  id: string;
  school: string;
  degree: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Project {
  id: string;
  name: string;
  role: string;
  description: string;
}

export interface ResumeData {
  id: string;
  title: string;
  templateId: 'modern' | 'classic' | 'minimal' | 'elegant' | 'compact' | 'timeline' | 'twoColumn';
  lastModified: number;
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    linkedin: string;
    website: string;
    summary: string;
  };
  education: Education[];
  experience: Experience[];
  projects: Project[];
  skills: string;
}

export interface UserProfile {
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

export interface JobMatchResult {
  score: number;
  analysis: string;
  missingKeywords: string[];
  suggestions: string[];
  skillMatch?: number;
  experienceRelevance?: number;
  cultureFit?: number;
}

export interface JobSearchResult {
  id?: string;
  title: string;
  company: string;
  location: string;
  description: string; // Changed from snippet to description for better matching
  url?: string;
  salary?: string;
  postedDate?: string;
  source?: 'Manual' | 'AI Crawler';
}

export enum AppView {
  LANDING = 'LANDING',
  LOGIN = 'LOGIN',
  REGISTER = 'REGISTER',
  DASHBOARD = 'DASHBOARD',
  EDITOR = 'EDITOR',
  MATCH = 'MATCH',
  PROFILE = 'PROFILE',
  ADMIN = 'ADMIN'
}

export interface AdminStats {
  userCount: number;
  resumeCount: number;
  jobCount?: number;
  recentActivity: Array<{
    id: number;
    user: string;
    action: string;
    time: string;
  }>;
  crawlTrend?: Array<{ date: string; count: number }>;
  sourceDistribution?: Array<{ source: string; count: number }>;
}

export interface AdminUser {
  id: number;
  email: string;
  nickname: string;
  role: 'User' | 'Admin';
  status: 'Active' | 'Inactive';
  joinedAt: string;
}

export interface CrawlerTask {
  id: string;
  query: string;
  source: string;
  frequency: string;
  lastRun: string | null;
  nextRun: string;
  status: 'Active' | 'Paused';
}

export interface AdminTemplate {
  id: number;
  name: string;
  category: string;
  previewUrl: string;
  status: 'Active' | 'Inactive';
  usageCount: number;
}

export const createEmptyResume = (): ResumeData => ({
  id: uuidv4(),
  title: '我的简历',
  templateId: 'modern',
  lastModified: Date.now(),
  personalInfo: {
    fullName: '',
    email: '',
    phone: '',
    linkedin: '',
    website: '',
    summary: ''
  },
  education: [],
  experience: [],
  projects: [],
  skills: ''
});
