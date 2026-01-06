import { apiFetch } from './apiClient';
import { AdminStats, AdminUser, CrawlerTask, AdminTemplate, JobSearchResult } from '../types';

export async function getStats(): Promise<AdminStats> {
  const resp = await apiFetch<AdminStats>('/api/admin/stats');
  return resp.data;
}

export async function listUsers(page = 1, pageSize = 20): Promise<AdminUser[]> {
  const resp = await apiFetch<AdminUser[]>(`/api/admin/users?page=${page}&pageSize=${pageSize}`);
  return resp.data;
}

export async function updateUserRole(id: number, role: string): Promise<boolean> {
  const resp = await apiFetch<boolean>(`/api/admin/users/${id}/role`, {
    method: 'PATCH',
    body: JSON.stringify({ role }),
  });
  return resp.data;
}

export async function updateUserStatus(id: number, status: string): Promise<boolean> {
  const resp = await apiFetch<boolean>(`/api/admin/users/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
  return resp.data;
}

interface BackendJobPosition {
  id: number;
  job_title: string;
  company_name: string;
  job_description: string;
  location: string;
  salary: string;
  source_url: string;
  crawl_time: string;
}

export async function listJobs(page = 1, pageSize = 20): Promise<{ jobs: JobSearchResult[], total: number }> {
  const resp = await apiFetch<{ items: BackendJobPosition[], total: number }>(`/api/admin/jobs?page=${page}&pageSize=${pageSize}`);
  const jobs = resp.data.items.map(job => ({
    id: job.id.toString(),
    title: job.job_title,
    company: job.company_name,
    location: job.location,
    description: job.job_description,
    url: job.source_url,
    salary: job.salary,
    postedDate: job.crawl_time,
    source: 'AI Crawler' as const // Assume database jobs are crawler jobs or handle source field if added to DB
  }));
  return { jobs, total: resp.data.total };
}

export async function deleteJob(id: string): Promise<boolean> {
  const resp = await apiFetch<boolean>(`/api/admin/jobs/${id}`, {
    method: 'DELETE',
  });
  return resp.data;
}

export async function listCrawlerTasks(): Promise<CrawlerTask[]> {
  const resp = await apiFetch<CrawlerTask[]>('/api/admin/crawler/tasks');
  return resp.data;
}

export async function createCrawlerTask(task: Partial<CrawlerTask>): Promise<CrawlerTask> {
  const resp = await apiFetch<CrawlerTask>('/api/admin/crawler/tasks', {
    method: 'POST',
    body: JSON.stringify(task),
  });
  return resp.data;
}

export async function deleteCrawlerTask(id: string): Promise<boolean> {
  const resp = await apiFetch<boolean>(`/api/admin/crawler/tasks/${id}`, {
    method: 'DELETE',
  });
  return resp.data;
}

export async function updateCrawlerTaskStatus(id: string, status: string): Promise<boolean> {
  const resp = await apiFetch<boolean>(`/api/admin/crawler/tasks/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
  return resp.data;
}

// 假设我们使用 TemplateRepository 的列表接口，但需要 Admin 视角的完整字段
export async function listTemplates(): Promise<AdminTemplate[]> {
  const resp = await apiFetch<AdminTemplate[]>('/api/templates');
  return resp.data;
}

export async function updateTemplateStatus(id: number, status: string): Promise<boolean> {
  const resp = await apiFetch<boolean>(`/api/admin/templates/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
  return resp.data;
}
