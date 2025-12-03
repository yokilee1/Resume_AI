import { JobSearchResult } from "../types";

/**
 * 优化文本内容（摘要/要点/技能）
 * @param text 待优化的原始文本
 * @param type 优化类型：summary | bullet | skills
 * @returns 优化后的文本
 */
export const optimizeText = async (text: string, type: 'summary' | 'bullet' | 'skills'): Promise<string> => {
  if (!text) return "";
  const res = await fetch(`/ai/optimizeText`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, type })
  });
  const data = await res.json();
  return String(data.text || "");
};

/**
 * 分析简历与目标岗位的匹配度
 * @param resumeText 简历文本
 * @param jobDescription 岗位描述文本
 * @returns 包含分数、分析、缺失关键词和建议的对象
 */
export const analyzeJobMatch = async (resumeText: string, jobDescription: string) => {
  const res = await fetch(`/ai/analyzeJobMatch`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ resumeText, jobDescription })
  });
  const data = await res.json();
  return data;
};

/**
 * 搜索职位列表
 * @param query 搜索关键词
 * @returns 职位搜索结果列表
 */
export const searchJobs = async (query: string): Promise<JobSearchResult[]> => {
  const res = await fetch(`/ai/searchJobs`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query })
  });
  const data = await res.json();
  return Array.isArray(data) ? data as JobSearchResult[] : [];
};