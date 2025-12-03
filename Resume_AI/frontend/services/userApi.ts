import { apiFetch } from './apiClient';
import { UserProfile } from '../types';

interface ServerUser {
  id: number;
  email: string;
  nickname?: string;
}

/**
 * 拉取当前登录用户资料
 */
export async function getMe(): Promise<UserProfile> {
  const resp = await apiFetch<ServerUser>(`/api/users/me`);
  const u = resp.data;
  return {
    name: u.nickname || '',
    email: u.email || '',
    role: 'Student',
  };
}

/**
 * 更新当前登录用户资料（仅昵称与邮箱）
 */
export async function updateMe(profile: UserProfile): Promise<UserProfile> {
  const payload = {
    nickname: profile.name,
    email: profile.email,
  };
  const resp = await apiFetch<ServerUser>(`/api/users/me`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
  const u = resp.data;
  return {
    name: u.nickname || '',
    email: u.email || '',
    role: profile.role || 'Student',
    avatar: profile.avatar,
  };
}