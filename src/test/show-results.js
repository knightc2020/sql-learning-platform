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

// 示例查询列表
const queries = [
  {
    name: '所有客户信息',
    sql: 'SELECT * FROM customers'
  },
  {
    name: '北京的客户',
    sql: "SELECT * FROM customers WHERE address LIKE '%北京%'"
  },
  {
    name: '客户账户信息',
    sql: `
      SELECT 
        c.name, 
        c.email, 
        a.account_type, 
        a.balance 
      FROM customers c 
      JOIN accounts a ON c.customer_id = a.customer_id
    `
  },
  {
    name: '客户账户统计',
    sql: `
      SELECT 
        c.name, 
        COUNT(a.account_id) as account_count, 
        SUM(a.balance) as total_balance 
      FROM customers c 
      LEFT JOIN accounts a ON c.customer_id = a.customer_id 
      GROUP BY c.customer_id, c.name
    `
  }
];

// 执行查询并显示结果
async function executeQuery(name, sql) {
  try {
    console.log('\n' + '='.repeat(100));
    console.log(`查询: ${name}`);
    console.log('SQL:', sql.replace(/\n\s*/g, ' '));
    console.log('-'.repeat(100));

    const response = await api.post('/api/sql/execute', { sql });
    const results = response.data.data;

    console.log('\n查询结果:');
    if (Array.isArray(results)) {
      results.forEach((row, index) => {
        console.log(`\n行 ${index + 1}:`, JSON.stringify(row, null, 2));
      });
    } else {
      console.log(JSON.stringify(results, null, 2));
    }

    console.log('\n' + '='.repeat(100));
  } catch (error) {
    console.error('\n执行查询失败:', error.message);
    if (error.response) {
      console.error('错误详情:', error.response.data);
    }
  }
}

// 依次执行所有查询
async function runQueries() {
  console.log('开始执行示例查询...\n');
  
  for (const query of queries) {
    await executeQuery(query.name, query.sql);
  }
}

runQueries(); 