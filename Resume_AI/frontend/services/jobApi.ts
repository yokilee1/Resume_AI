import { JobSearchResult } from "../types";
import { getToken } from "./apiClient";

/**
 * 从后端数据库检索职位列表
 * @param keywords 搜索关键词（匹配职位标题/公司/描述）
 * @param city 可选城市过滤
 * @param page 页码，默认 1
 * @param pageSize 每页数量，默认 10
 * @returns 映射为前端展示用的职位列表
 */
export const searchJobsDB = async (
  keywords: string,
  city?: string,
  page: number = 1,
  pageSize: number = 10
): Promise<JobSearchResult[]> => {
  const params = new URLSearchParams();
  if (keywords != null) params.set("keywords", keywords);
  if (city) params.set("city", city);
  params.set("page", String(page));
  params.set("pageSize", String(pageSize));

  const token = (typeof window !== "undefined" && getToken()) || "";
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`/api/jobs/search?${params.toString()}`, {
    method: "GET",
    headers,
  });

  if (!res.ok) {
    return [];
  }

  const json = await res.json();
  const items = json?.data?.items ?? [];

  const mapped: JobSearchResult[] = Array.isArray(items)
    ? items.map((job: any) => ({
        title: String(job?.jobTitle ?? job?.job_title ?? job?.title ?? ""),
        company: String(job?.companyName ?? job?.company_name ?? job?.company ?? ""),
        location: String(job?.location ?? job?.city ?? ""),
        description: String(job?.jobDescription ?? job?.job_description ?? job?.description ?? ""),
        url: job?.sourceUrl ?? job?.source_url ?? job?.url ?? undefined,
        salary: job?.salary ?? job?.salary_range ?? undefined,
      }))
    : [];

  return mapped;
};
