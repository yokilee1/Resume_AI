import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import LandingPage from '../components/LandingPage';

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('LandingPage', () => {
  it('应该渲染主标题', () => {
    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>
    );
    expect(screen.getByText(/让 AI 助你一臂之力/i)).toBeInTheDocument();
  });

  it('应该包含功能介绍网格', () => {
    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>
    );
    expect(screen.getByText(/智能简历编辑器/i)).toBeInTheDocument();
    expect(screen.getByText(/AI 写作助手/i)).toBeInTheDocument();
  });

  it('点击“免费尝试”按钮应跳转到注册页', () => {
    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>
    );
    const button = screen.getByRole('button', { name: /免费尝试/i });
    fireEvent.click(button);
    expect(mockNavigate).toHaveBeenCalledWith('/auth/register');
  });
});
