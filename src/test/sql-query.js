const axios = require('axios');

// 使用登录获得的 token
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoyLCJ1c2VybmFtZSI6InRlc3R1c2VyIiwicm9sZSI6InN0dWRlbnQiLCJpYXQiOjE3MzUzNTUwNTgsImV4cCI6MTczNTQ0MTQ1OH0.ioT7QiEbu5Jb1J6DE8At0OizeSD6NkIVREgoEXaFvlM';

// 创建 axios 实例
const api = axios.create({
  baseURL: 'http://localhost:3000',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});

// SQL 查询示例
const sqlQueries = [
  // 1. 简单查询
  'SELECT * FROM customers',
  
  // 2. 条件查询
  "SELECT * FROM customers WHERE address LIKE '%北京%'",
  
  // 3. 连接查询
  `SELECT c.name, c.email, a.account_type, a.balance 
   FROM customers c 
   JOIN accounts a ON c.customer_id = a.customer_id`,
  
  // 4. 分组统计
  `SELECT c.name, COUNT(a.account_id) as account_count, SUM(a.balance) as total_balance 
   FROM customers c 
   LEFT JOIN accounts a ON c.customer_id = a.customer_id 
   GROUP BY c.customer_id, c.name`
];

// 执行查询函数
async function executeQuery(sql) {
  console.log('\n开始执行查询...');
  console.log('SQL:', sql.replace(/\n\s*/g, ' '));

  try {
    const response = await api.post('/api/sql/execute', { sql });
    console.log('\n查询结果:', JSON.stringify(response.data, null, 2));
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error('\n请求失败:', error.response.status, error.response.data);
    } else {
      console.error('\n请求错误:', error.message);
    }
    throw error;
  }
}

// 依次执行所有查询
async function runQueries() {
  console.log('开始测试 SQL 查询功能...\n');
  
  for (const sql of sqlQueries) {
    console.log('\n' + '='.repeat(80));
    console.log('执行新的查询');
    console.log('='.repeat(80));
    
    try {
      await executeQuery(sql);
      console.log('\n查询执行成功');
      console.log('-'.repeat(80));
    } catch (error) {
      console.error('\n查询执行失败');
      console.log('-'.repeat(80));
    }
  }
}

runQueries(); 