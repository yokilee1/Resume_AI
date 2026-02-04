-- 数据库迁移脚本：适配管理员仪表盘功能
-- 说明：由于 templates 和 users 表已存在，请运行此脚本来更新表结构，而不是运行 schema.sql

-- 1. 更新 users 表
-- 添加 role 字段 (User/Admin)
ALTER TABLE users ADD COLUMN role VARCHAR(20) NOT NULL DEFAULT 'User';
-- 添加 status 字段 (Active/Inactive)
ALTER TABLE users ADD COLUMN status VARCHAR(20) NOT NULL DEFAULT 'Active';

-- 2. 更新 templates 表
-- 添加 status 字段
ALTER TABLE templates ADD COLUMN status VARCHAR(20) NOT NULL DEFAULT 'Active';
-- 添加 usage_count 字段
ALTER TABLE templates ADD COLUMN usage_count INT NOT NULL DEFAULT 0;

-- 3. 创建 crawler_tasks 表 (新表)
CREATE TABLE IF NOT EXISTS crawler_tasks (
  id VARCHAR(36) PRIMARY KEY,
  query VARCHAR(255) NOT NULL,
  source VARCHAR(100) NOT NULL,
  frequency VARCHAR(50) NOT NULL,
  last_run DATETIME NULL,
  next_run VARCHAR(50) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'Active',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
