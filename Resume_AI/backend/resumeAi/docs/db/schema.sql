-- Resume_AI Schema aligned with repositories (MySQL 8+)
SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

DROP DATABASE IF EXISTS resume_ai;
CREATE DATABASE resume_ai
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_0900_ai_ci;
USE resume_ai;

-- users (UserRepository)
CREATE TABLE users (
  user_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(100) NOT NULL,
  password VARCHAR(255) NOT NULL,
  username VARCHAR(100) NOT NULL,
  type INT NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- templates (TemplateRepository)
CREATE TABLE templates (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  category VARCHAR(50) NULL,
  preview_url VARCHAR(255) NULL,
  schema_json TEXT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- resumes (ResumeRepository)
CREATE TABLE resumes (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  title VARCHAR(128) NOT NULL,
  content_json LONGTEXT NOT NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'draft',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  KEY idx_user_id (user_id),
  CONSTRAINT fk_resumes_user FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- job_positions (JobRepository)
CREATE TABLE job_positions (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  job_title VARCHAR(100) NOT NULL,
  company_name VARCHAR(100) NOT NULL,
  job_description TEXT NOT NULL,
  location VARCHAR(50) NULL,
  salary VARCHAR(50) NULL,
  source_url VARCHAR(255) NULL,
  crawl_time DATETIME NOT NULL,
  KEY idx_crawl_time (crawl_time),
  KEY idx_job_title (job_title),
  KEY idx_company_name (company_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

SET FOREIGN_KEY_CHECKS = 1;