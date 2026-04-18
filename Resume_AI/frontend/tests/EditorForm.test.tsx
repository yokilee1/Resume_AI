import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import EditorForm from '../components/EditorForm';
import { ResumeData } from '../types';

// Mock geminiService
vi.mock('../services/geminiService', () => ({
  optimizeText: vi.fn(() => Promise.resolve('Optimized Text')),
}));

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
  },
}));

const mockData: ResumeData = {
  id: '1',
  userId: 1,
  title: 'My Resume',
  templateId: 'modern',
  personalInfo: {
    fullName: 'John Doe',
    email: 'john@example.com',
    phone: '123456789',
    linkedin: '',
    website: '',
    summary: 'A test summary',
  },
  education: [],
  experience: [],
  projects: [],
  skills: '',
};

describe('EditorForm', () => {
  const mockOnChange = vi.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it('修改姓名时应触发 onChange', () => {
    render(<EditorForm data={mockData} onChange={mockOnChange} />);
    const nameInput = screen.getByPlaceholderText(/请输入姓名/i);
    fireEvent.change(nameInput, { target: { value: 'Jane Doe' } });
    
    expect(mockOnChange).toHaveBeenCalled();
    const callArg = mockOnChange.mock.calls[0][0];
    expect(callArg.personalInfo.fullName).toBe('Jane Doe');
  });

  it('点击“添加”教育经历应触发 onChange', () => {
    render(<EditorForm data={mockData} onChange={mockOnChange} />);
    const addButtons = screen.getAllByRole('button', { name: /添加/i });
    fireEvent.click(addButtons[0]);
    
    expect(mockOnChange).toHaveBeenCalled();
    const callArg = mockOnChange.mock.calls[0][0];
    expect(callArg.education).toHaveLength(1);
  });

  it('切换模板应触发 onChange', () => {
    render(<EditorForm data={mockData} onChange={mockOnChange} />);
    const classicBtn = screen.getByText(/经典/i);
    fireEvent.click(classicBtn);
    
    expect(mockOnChange).toHaveBeenCalled();
    const callArg = mockOnChange.mock.calls[0][0];
    expect(callArg.templateId).toBe('classic');
  });
});
