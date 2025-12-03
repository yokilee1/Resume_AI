INSERT INTO templates (name, category, preview_url, schema_json) VALUES
 ('现代简约', 'modern', NULL, '{"sections":["basicInfo","experiences","education","skills"]}'),
 ('专业商务', 'business', NULL, '{"sections":["basicInfo","experiences","education","skills"]}');

INSERT INTO job_positions (job_title, company_name, job_description, location, salary, source_url, crawl_time) VALUES
 ('前端开发工程师', '优雅科技', 'React Vue JavaScript CSS HTML 前端性能优化', '上海', '20k-30k', 'https://example.com/job/1', CURRENT_TIMESTAMP),
 ('后端开发工程师', '稳健软件', 'Java Spring Boot MySQL Redis API 设计', '北京', '25k-35k', 'https://example.com/job/2', CURRENT_TIMESTAMP),
 ('数据分析师', '洞察数据', 'Python SQL BI 可视化 统计分析', '深圳', '18k-28k', 'https://example.com/job/3', CURRENT_TIMESTAMP),
 ('产品经理', '灵感科技', '需求分析 产品规划 项目管理 沟通能力', '杭州', '22k-32k', 'https://example.com/job/4', CURRENT_TIMESTAMP),
 ('算法工程师', '智能未来', '机器学习 深度学习 PyTorch TensorFlow 算法优化', '北京', '30k-45k', 'https://example.com/job/5', CURRENT_TIMESTAMP);