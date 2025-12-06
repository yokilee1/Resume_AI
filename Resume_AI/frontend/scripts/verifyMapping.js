// 简单验证：模拟后端返回的数据经前端映射后的字段一致性
function mapJobMatchResult(data) {
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
}

const sample = {
  overallScore: 58,
  skillMatch: 40,
  experienceRelevance: 65,
  cultureFit: 70,
  analysis: "候选人Yorkie Lee拥有计算机相关背景...",
  suggestions: [
    "建议候选人补充在项目中是否使用过前端技术...",
    "若具备实际前端开发经验，应在简历中单独列出...",
  ],
  missingKeywords: ["React", "Vue", "JavaScript"]
};

console.log(JSON.stringify(mapJobMatchResult(sample), null, 2));
