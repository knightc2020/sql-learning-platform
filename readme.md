# SQL Learning Platform Backend

基于 Node.js 和 MySQL 的 SQL 学习平台后端服务，使用 Cursor Agent 模式实现安全的 SQL 查询执行。

## 项目概述

本项目是一个在线 SQL 学习平台的后端服务，主要功能包括：
- 安全的 SQL 查询执行
- 实时查询结果返回
- 用户查询历史记录
- 错误提示和优化建议

### 技术栈
- Node.js + TypeScript
- Express.js
- MySQL 8.0
- Docker

## 项目结构

bash
sql-learning-backend/
├── src/
│ ├── app.ts # 应用入口
│ ├── server.ts # 服务器启动
│ ├── config/ # 配置文件
│ │ ├── database.ts # 数据库配置
│ │ └── app.config.ts # 应用配置
│ ├── services/ # 核心服务
│ │ ├── cursor-agent.ts # SQL执行代理
│ │ └── db-connection.ts # 数据库连接管理
│ ├── controllers/ # 控制器
│ │ └── sql-executor.ts # SQL执行控制器
│ ├── routes/ # 路由定义
│ │ └── sql.routes.ts # SQL相关路由
│ └── utils/ # 工具函数
│ ├── logger.ts # 日志工具
│ └── sql-validator.ts # SQL验证工具
├── docker/ # Docker配置
├── tests/ # 测试文件
└── docs/ # 文档

## 核心功能实现

### 1. Cursor Agent 模式

Cursor Agent 负责管理数据库连接和 SQL 查询执行，主要特点：
- 连接池管理
- 查询超时控制
- 结果集大小限制
- 事务管理
- 错误处理

### 2. 安全特性
- SQL 注入防护
- 查询超时限制
- 只读操作限制
- 结果集大小限制
- 事务自动回滚

### 3. 性能优化
- 连接池管理
- 查询缓存
- 结果集分页
- 超时控制

## API 接口

### SQL 查询执行

3. **启动开发服务器**

## Docker 部署

1. **构建镜像**

2. **启动服务**

## 数据库设计

### 核心表结构

1. **查询历史表**
sql:readme.md
CREATE TABLE query_history (
id INT PRIMARY KEY AUTO_INCREMENT,
query TEXT NOT NULL,
execution_time INT,
status VARCHAR(20),
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

2. **示例数据表**
sql:readme.md
-- 客户表
CREATE TABLE customers (
customer_id INT PRIMARY KEY AUTO_INCREMENT,
name VARCHAR(100) NOT NULL,
email VARCHAR(100) UNIQUE
);
-- 账户表
CREATE TABLE accounts (
account_id INT PRIMARY KEY AUTO_INCREMENT,
customer_id INT,
account_type ENUM('savings', 'checking'),
balance DECIMAL(15,2)
);

## 开发指南

### 1. 代码规范
- 使用 TypeScript 强类型
- 遵循 ESLint 规则
- 使用 Prettier 格式化代码
- 编写单元测试

### 2. 错误处理
- 统一的错误处理中间件
- 结构化的错误响应
- 详细的错误日志记录

### 3. 安全考虑
- 输入验证
- SQL 注入防护
- 访问控制
- 数据加密

## 监控和日志

1. **性能监控**
- 查询执行时间
- 连接池状态
- 系统资源使用

2. **日志记录**
- 访问日志
- 错误日志
- 性能日志

## 部署检查清单

- [ ] 环境变量配置
- [ ] 数据库连接测试
- [ ] 安全设置验证
- [ ] 性能参数调优
- [ ] 日志配置检查
- [ ] 监控系统配置

## 维护和支持

### 1. 日常维护
- 日志轮转
- 数据库备份
- 性能监控
- 安全更新

### 2. 故障排除
- 查询超时处理
- 连接池满载处理
- 内存泄漏检测
- 错误日志分析

## 版本控制

- 使用 Git 进行版本控制
- 遵循 Git Flow 工作流
- 语义化版本号

## 许可证

MIT License

## 联系方式

- 项目维护者：[Your Name]
- 邮箱：[Your Email]


