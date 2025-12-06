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
  title: string;
  company: string;
  location: string;
  description: string; // Changed from snippet to description for better matching
  url?: string;
  salary?: string;
}

export enum AppView {
  LANDING = 'LANDING',
  LOGIN = 'LOGIN',
  REGISTER = 'REGISTER',
  DASHBOARD = 'DASHBOARD',
  EDITOR = 'EDITOR',
  MATCH = 'MATCH',
  PROFILE = 'PROFILE'
}
