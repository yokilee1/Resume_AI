import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getToken, setToken, apiFetch } from '../services/apiClient';

describe('apiClient', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('setToken 应保存 token 到 localStorage', () => {
    setToken('test-token');
    expect(localStorage.getItem('resume_ai_token')).toBe('test-token');
    expect(getToken()).toBe('test-token');
  });

  it('apiFetch 应在 Headers 中包含 Authorization 令牌', async () => {
    setToken('my-token');
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ data: 'ok' }),
    });
    global.fetch = mockFetch;

    await apiFetch('/test');

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/test'),
      expect.objectContaining({
        headers: expect.objectContaining({
          'Authorization': 'Bearer my-token'
        })
      })
    );
  });

  it('apiFetch 在网络错误时应抛出异常', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      text: () => Promise.resolve('Access Denied'),
    });

    await expect(apiFetch('/fail')).rejects.toThrow('Access Denied');
  });
});
