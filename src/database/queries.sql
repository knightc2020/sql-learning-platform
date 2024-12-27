-- 1. 基本查询：查看所有客户
SELECT * FROM customers;

-- 2. 条件查询：查看北京的客户
SELECT * FROM customers WHERE address LIKE '%北京%';

-- 3. 连接查询：查看客户及其账户信息
SELECT c.name, c.email, a.account_type, a.balance 
FROM customers c 
JOIN accounts a ON c.customer_id = a.customer_id;

-- 4. 分组统计：每个客户的账户数量和总余额
SELECT 
    c.name, 
    COUNT(a.account_id) as account_count, 
    SUM(a.balance) as total_balance 
FROM customers c 
LEFT JOIN accounts a ON c.customer_id = a.customer_id 
GROUP BY c.customer_id, c.name;

-- 5. 子查询：查找余额高于平均值的账户
SELECT c.name, a.account_type, a.balance 
FROM customers c 
JOIN accounts a ON c.customer_id = a.customer_id 
WHERE a.balance > (SELECT AVG(balance) FROM accounts);

-- 6. 聚合查询：不同类型账户的统计信息
SELECT 
    account_type, 
    COUNT(*) as account_count, 
    SUM(balance) as total_balance, 
    AVG(balance) as avg_balance 
FROM accounts 
GROUP BY account_type;

-- 7. 排序查询：按余额降序显示账户信息
SELECT c.name, a.account_type, a.balance 
FROM customers c 
JOIN accounts a ON c.customer_id = a.customer_id 
ORDER BY a.balance DESC; 