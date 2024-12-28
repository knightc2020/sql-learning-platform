-- 创建数据库
CREATE DATABASE IF NOT EXISTS sql_learning;
USE sql_learning;

-- 删除现有的表（如果存在）
DROP TABLE IF EXISTS user_progress;
DROP TABLE IF EXISTS accounts;
DROP TABLE IF EXISTS customers;
DROP TABLE IF EXISTS query_history;
DROP TABLE IF EXISTS users;

-- 创建用户表
CREATE TABLE IF NOT EXISTS users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('student', 'teacher', 'admin') DEFAULT 'student',
    status ENUM('active', 'inactive', 'banned') DEFAULT 'active',
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 创建用户学习进度表
CREATE TABLE IF NOT EXISTS user_progress (
    progress_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    exercise_id INT NOT NULL,
    status ENUM('not_started', 'in_progress', 'completed') DEFAULT 'not_started',
    score INT DEFAULT 0,
    attempts INT DEFAULT 0,
    last_attempt_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- 创建查询历史表
CREATE TABLE IF NOT EXISTS query_history (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    query TEXT NOT NULL,
    execution_time INT,
    status VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- 创建示例表：客户表
CREATE TABLE IF NOT EXISTS customers (
    customer_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE,
    phone VARCHAR(20),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 创建示例表：账户表
CREATE TABLE IF NOT EXISTS accounts (
    account_id INT PRIMARY KEY AUTO_INCREMENT,
    customer_id INT,
    account_type ENUM('savings', 'checking') NOT NULL,
    balance DECIMAL(15,2) DEFAULT 0.00,
    status ENUM('active', 'inactive', 'closed') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
);

-- 插入一些示例数据
INSERT INTO customers (name, email, phone, address) VALUES
    ('张三', 'zhangsan@example.com', '13800138000', '北京市朝阳区'),
    ('李四', 'lisi@example.com', '13900139000', '上海市浦东新区'),
    ('王五', 'wangwu@example.com', '13700137000', '广州市天河区');

INSERT INTO accounts (customer_id, account_type, balance) VALUES
    (1, 'savings', 10000.00),
    (1, 'checking', 5000.00),
    (2, 'savings', 20000.00),
    (3, 'checking', 15000.00);

-- 插入管理员用户
INSERT INTO users (username, email, password, role) VALUES
    ('admin', 'admin@example.com', '$2a$10$XKoNmFZgW.x5r5Tz5Q5Q5O5Q5O5Q5O5Q5O5Q5O5Q5O5Q5O5Q5O', 'admin'); 