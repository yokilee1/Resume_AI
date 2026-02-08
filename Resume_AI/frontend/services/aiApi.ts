import { JobMatchResult, JobSearchResult } from "../types";
import { apiFetch } from "./apiClient";

/**
 * 调用后端 AI：简历润色
 * 请求：{ text, industry?, role?, language? }
 * 响应：{ polished_text, suggestions[] }
 */
export const polishResume = async (
  payload: { text: string; industry?: string; role?: string; language?: string }
): Promise<{ polished_text: string; suggestions: string[] }> => {
  const res = await apiFetch<any>(`/api/ai/polish`, {
    method: "POST",
    body: JSON.stringify(payload),
  });

  const data = res?.data || {};
  return {
    polished_text: String(data?.polished_text ?? ""),
    suggestions: Array.isArray(data?.suggestions) ? data.suggestions : [],
  };
};

/**
 * 调用后端 AI：匹配度分析
 * 请求：{ resume_text, job_description }
 * 响应映射为前端类型 JobMatchResult
 */
export const analyzeJobMatchBackend = async (
  resumeText: string,
  jobDescription: string
): Promise<JobMatchResult> => {
  const res = await apiFetch<any>(`/api/ai/match-report`, {
    method: "POST",
    body: JSON.stringify({ resume_text: resumeText, job_description: jobDescription }),
  });

  const data = res?.data || {};
  const score = Number(data?.overall_score ?? data?.overallScore ?? data?.score ?? 0);
  const analysis = String(data?.analysis ?? "");
  const missingKeywords = Array.isArray(data?.missing_keywords)
    ? data.missing_keywords
    : Array.isArray(data?.missingKeywords)
      ? data.missingKeywords
      : [];
  const suggestions = Array.isArray(data?.suggestions) ? data.suggestions : [];
  const skillMatchRaw = data?.skill_match ?? data?.skillMatch;
  const experienceRelevanceRaw = data?.experience_relevance ?? data?.experienceRelevance;
  const cultureFitRaw = data?.culture_fit ?? data?.cultureFit;
  const skillMatch = skillMatchRaw != null ? Number(skillMatchRaw) : undefined;
  const experienceRelevance = experienceRelevanceRaw != null ? Number(experienceRelevanceRaw) : undefined;
  const cultureFit = cultureFitRaw != null ? Number(cultureFitRaw) : undefined;
  return { score, analysis, missingKeywords, suggestions, skillMatch, experienceRelevance, cultureFit };
};

/**
 * 调用后端 AI：岗位推荐（映射为 JobSearchResult[] 用于统一列表渲染）
 * 请求：{ resume_text, experience_years?, preferred_cities?, target_industry?, target_role? }
 */
export const recommendJobsBackend = async (
  req: {
    resume_text: string;
    experience_years?: number;
    preferred_cities?: string[];
    target_industry?: string;
    target_role?: string;
  },
  options?: { sort?: string; minScore?: number; city?: string }
): Promise<JobSearchResult[]> => {
  const params = new URLSearchParams();
  if (options?.sort) params.set("sort", options.sort);
  if (options?.minScore != null) params.set("minScore", String(options.minScore));
  if (options?.city) params.set("city", options.city);

  const res = await apiFetch<any>(`/api/ai/recommend-jobs?${params.toString()}`, {
    method: "POST",
    body: JSON.stringify(req),
  });

  const items = res?.data?.items ?? [];
  return Array.isArray(items)
    ? items.map((it: any) => ({
      title: String(it?.title ?? ""),
      company: String(it?.company ?? ""),
      location: String(it?.location ?? ""),
      description: String(it?.reason ?? ""),
      url: undefined,
    }))
    : [];
};
