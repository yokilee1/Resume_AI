# Resume_AI 数据库设计说明

本文档说明基于提供的需求设计的 MySQL 8 数据库模型，包括表用途、字段、约束与索引，以及数据完整性与性能优化考虑。

## 设计综述
- 数据库：MySQL 8，InnoDB 引擎，`utf8mb4`/`utf8mb4_0900_ai_ci`。
- 主键：自增 `INT AUTO_INCREMENT`（可扩展为 BIGINT/UUID）。
- 时间：统一使用 `DATETIME`，`created_at` 默认 `CURRENT_TIMESTAMP`，`updated_at` 在更新时自动刷新。
- 约束：必要的唯一约束与外键，级联策略根据业务选择（见下文）。
- 索引：覆盖高频查询维度，遵循最左前缀原则。

## 表与字段

### users（用户表）
- 用途：用户注册与登录，账号基础信息。
- 主要字段：
  - `user_id` INT PK AI
  - `username` VARCHAR(50) NOT NULL UNIQUE（索引：`idx_username`）
  - `password` VARCHAR(255) NOT NULL（建议 bcrypt）
  - `email` VARCHAR(100) NOT NULL UNIQUE（索引：`idx_email`）
  - `type` INT NOT NULL（用户类型/角色编码）
  - `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  - `updated_at` DATETIME NULL ON UPDATE CURRENT_TIMESTAMP

### templates（模板表）
- 用途：简历模板定义与预览。
- 字段：
  - `template_id` INT PK AI
  - `name` VARCHAR(50) NOT NULL（索引：`idx_name`）
  - `layout` TEXT NOT NULL（JSON 布局）
  - `preview_url` VARCHAR(255) NULL
  - `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP

### resumes（简历表）
- 用途：用户简历主版本（草稿/最终版）。
- 字段：
  - `resume_id` INT PK AI
  - `user_id` INT NOT NULL FK→`users.user_id`
  - `template_id` INT NOT NULL FK→`templates.template_id`
  - `content` TEXT NOT NULL（存储结构化 JSON）
  - `status` ENUM('draft','final') NOT NULL
  - `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  - `updated_at` DATETIME NULL ON UPDATE CURRENT_TIMESTAMP
- 索引：`idx_user_id (user_id)`
- 外键策略：
  - `user_id`：`ON DELETE CASCADE`（删除用户时同时删除其简历）
  - `template_id`：`ON DELETE RESTRICT`（避免误删正在使用的模板）

### resume_versions（简历版本表）
- 用途：简历历史版本记录与回滚。
- 字段：
  - `version_id` INT PK AI
  - `resume_id` INT NOT NULL FK→`resumes.resume_id`
  - `content` TEXT NOT NULL
  - `version_note` VARCHAR(255) NULL
  - `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
- 索引：`idx_resume_id (resume_id)`
- 外键策略：`ON DELETE CASCADE`（删除简历时清理历史版本）。

### jobs（岗位表）
- 用途：爬取的岗位数据存储。
- 字段：
  - `job_id` INT PK AI
  - `title` VARCHAR(100) NOT NULL
  - `company` VARCHAR(100) NOT NULL
  - `description` TEXT NOT NULL
  - `location` VARCHAR(50) NULL
  - `salary` VARCHAR(50) NULL
  - `url` VARCHAR(255) NOT NULL
  - `crawled_at` DATETIME NOT NULL
- 索引：`idx_title (title)`, `idx_location (location)`, `idx_crawled_at (crawled_at)`
- 备注：建议定期清理过期数据（如 30 天前数据）。

### evaluations（评估记录表）
- 用途：简历与岗位的匹配评分与细节。
- 字段：
  - `eval_id` INT PK AI
  - `resume_id` INT NOT NULL FK→`resumes.resume_id`
  - `job_id` INT NOT NULL FK→`jobs.job_id`
  - `score` DECIMAL(5,2) NOT NULL（0-100）
  - `details` JSON NOT NULL（各模块得分、说明）
  - `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
- 索引：`idx_resume_id (resume_id)`, `idx_job_id (job_id)`
- 外键策略：均 `ON DELETE CASCADE`（删除主记录时清理评估）。
- 约束：`CHECK (score BETWEEN 0 AND 100)`（MySQL 8 支持）。
- 可选唯一约束：`UNIQUE(resume_id, job_id)` 防止重复评估（按业务决定）。

## 关系与ER图
- ER 图见 `docs/db/er-diagram.mmd`（Mermaid）。
- 关系摘要：
  - 用户 1:N 简历
  - 模板 1:N 简历
  - 简历 1:N 版本
  - 简历 N:1 评估 ← 岗位 1:N 评估（评估为简历与岗位的连接）

## 性能优化建议
- 索引：
  - 为高频查询条件建立 BTree 索引（如 jobs 的 `title`、`location`、`crawled_at`）。
  - 如需按 `title + location` 联合过滤，建议增加复合索引 `(location, title)` 或 `(title, location)`，遵循具体查询最左前缀。
  - 考虑为 `jobs(title, description)` 建立 `FULLTEXT` 索引以提升关键词检索（MySQL 5.6+）。
- 数据归档：
  - jobs 表可按 `crawled_at` 进行定期清理或归档，减少主表体量。
- JSON 字段：
  - `resumes.content` 与 `evaluations.details` 为 JSON 使用场景，建议在应用层确保结构稳定，必要时抽取热字段至独立列以利检索。

## 数据完整性与安全
- 外键与级联：
  - 用户删除时，相关简历与评估一并清理，避免孤儿数据。
  - 模板删除受限，需先解除被引用关系。
- 唯一约束：用户名与邮箱唯一。
- 密码：存储为 bcrypt 哈希，避免明文；账号安全需配合应用层策略（如盐值、重试限制）。

## 兼容性与迁移建议
- 现有代码中可能使用不同表名（如 `job_positions`），如需切换到本设计，请：
  - 更新仓库与 SQL 映射层的表名与字段映射。
  - 提供数据迁移脚本，将旧表数据迁移至新结构。

## 交付文件
- SQL 脚本：`backend/resumeAi/docs/db/schema.sql`
- ER 图：`backend/resumeAi/docs/db/er-diagram.mmd`
- 设计说明：`backend/resumeAi/docs/db/design.md`