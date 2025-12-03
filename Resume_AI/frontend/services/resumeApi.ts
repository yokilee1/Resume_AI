import { ResumeData, Education, Experience, Project } from '../types';
import { apiFetch } from './apiClient';
import { v4 as uuidv4 } from 'uuid';

interface ServerResume {
  id: number;
  userId: number;
  title: string;
  contentJson?: string;
  content_json?: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
  created_at?: string;
  updated_at?: string;
}

/**
 * 解析后端返回的 Resume -> 前端 ResumeData
 * @param srv 后端 Resume
 */
export function deserializeResume(srv: ServerResume): ResumeData {
  let data: any;
  try {
    const rawJson = (srv as any).contentJson ?? (srv as any).content_json ?? '{}';
    data = JSON.parse(rawJson || '{}');
  } catch {
    data = {};
  }
  // 与默认结构合并，保证必要字段存在
  const base: ResumeData = {
    id: String(srv.id),
    title: srv.title || 'Untitled',
    templateId: 'modern',
    lastModified: Date.now(),
    personalInfo: { fullName: '', email: '', phone: '', linkedin: '', website: '', summary: '' },
    education: [],
    experience: [],
    projects: [],
    skills: ''
  };
  const merged: ResumeData = {
    ...base,
    ...data,
    personalInfo: { ...base.personalInfo, ...(data?.personalInfo || {}) },
    education: Array.isArray(data?.education) ? data.education : base.education,
    experience: Array.isArray(data?.experience) ? data.experience : base.experience,
    projects: Array.isArray(data?.projects) ? data.projects : base.projects,
    skills: typeof data?.skills === 'string' ? data.skills : base.skills,
  };
  // 规范化数组项的 id，避免渲染时缺少唯一 key
  merged.education = (merged.education as Education[]).map((item) => ({ ...item, id: item.id || uuidv4() }));
  merged.experience = (merged.experience as Experience[]).map((item) => ({ ...item, id: item.id || uuidv4() }));
  merged.projects = (merged.projects as Project[]).map((item) => ({ ...item, id: item.id || uuidv4() }));
  // 覆盖必要字段（以服务器为主）
  merged.id = String(srv.id);
  merged.title = srv.title || merged.title || 'Untitled';
  merged.templateId = (merged.templateId as any) || 'modern';
  const ts = (srv as any).updatedAt ?? (srv as any).updated_at ?? (srv as any).createdAt ?? (srv as any).created_at;
  merged.lastModified = ts ? new Date(ts).getTime() : (merged.lastModified || Date.now());
  return merged;
}

/**
 * 将前端 ResumeData 序列化为后端 payload
 * @param data 前端数据
 */
export function serializeResume(data: ResumeData): { title: string; content_json: string } {
  return { title: data.title || 'Untitled Resume', content_json: JSON.stringify(data) };
}

/**
 * 获取简历列表（分页简单版）
 */
export async function listResumes(page = 1, pageSize = 50): Promise<ResumeData[]> {
  const resp = await apiFetch<{ items: ServerResume[]; page: number; pageSize: number; total: number }>(`/api/resumes?page=${page}&pageSize=${pageSize}`);
  const items = Array.isArray(resp.data.items) ? resp.data.items : [];
  return items.map(deserializeResume);
}

/**
 * 创建简历
 */
export async function createResume(data: ResumeData): Promise<ResumeData> {
  const payload = serializeResume(data);
  const resp = await apiFetch<ServerResume>(`/api/resumes`, {
    method: 'POST',
    body: JSON.stringify(payload)
  });
  return deserializeResume(resp.data);
}

/**
 * 更新简历（状态默认 draft）
 */
export async function updateResume(data: ResumeData, status: string = 'draft'): Promise<ResumeData> {
  const payload = { ...serializeResume(data), status };
  const resp = await apiFetch<ServerResume>(`/api/resumes/${data.id}`, {
    method: 'PUT',
    body: JSON.stringify(payload)
  });
  return deserializeResume(resp.data);
}

/**
 * 删除简历
 */
export async function deleteResume(id: string): Promise<boolean> {
  const resp = await apiFetch<boolean>(`/api/resumes/${id}`, { method: 'DELETE' });
  return Boolean(resp.data);
}

/**
 * 复制简历
 */
export async function duplicateResume(id: string): Promise<ResumeData> {
  const resp = await apiFetch<ServerResume>(`/api/resumes/${id}/duplicate`, { method: 'POST' });
  return deserializeResume(resp.data);
}