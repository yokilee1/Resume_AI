/**
 * 轻量级 API 客户端，统一处理后端请求与鉴权
 */
export interface ApiResponse<T> {
  code: string;
  message: string;
  data: T;
  traceId?: string;
}

/**
 * 获取当前存储的访问令牌
 */
export function getToken(): string | null {
  return localStorage.getItem('resume_ai_token');
}

/**
 * 保存访问令牌到本地存储
 */
export function setToken(token: string) {
  localStorage.setItem('resume_ai_token', token);
  localStorage.setItem('resume_ai_auth', 'true');
}

/**
 * 基础请求封装，自动附加 Authorization 头
 */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

/**
 * 基础请求封装，自动附加 Authorization 头
 */
export async function apiFetch<T>(input: RequestInfo, init?: RequestInit): Promise<ApiResponse<T>> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(init?.headers as Record<string, string>),
  };
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  // 处理 input，如果是相对路径则加上 API_BASE_URL
  let url = String(input);
  if (url.startsWith('/')) {
    url = `${API_BASE_URL}${url}`;
  }

  const res = await fetch(url, { ...init, headers });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Request failed');
  }
  return res.json();
}

/**
 * 用户注册
 * @param nickname 昵称
 * @param email 邮箱
 * @param password 密码
 */
export async function register(nickname: string, email: string, password: string): Promise<{ token: string; userId: number; }> {
  const resp = await apiFetch<{ token: string; userId: number; }>(`/api/auth/register`, {
    method: 'POST',
    body: JSON.stringify({ nickname, email, password })
  });
  return resp.data;
}

/**
 * 用户登录
 * @param email 邮箱
 * @param password 密码
 */
export async function login(email: string, password: string): Promise<{ token: string; userId: number; }> {
  const resp = await apiFetch<{ token: string; userId: number; }>(`/api/auth/login`, {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });
  return resp.data;
}

/**
 * 刷新令牌
 */
export async function refreshToken(): Promise<{ token: string }> {
  const token = getToken();
  const resp = await apiFetch<{ token: string }>(`/api/auth/refresh`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  return resp.data;
}