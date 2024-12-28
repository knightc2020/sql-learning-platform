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

// 执行单个查询并显示结果
async function executeQuery(sql) {
  try {
    const response = await api.post('/api/sql/execute', { sql });
    return response.data.data;
  } catch (error) {
    console.error('执行查询失败:', error.message);
    return null;
  }
}

// 查询历史记录并显示结果
async function getQueryHistory() {
  console.log('获取查询历史记录并执行查询...\n');

  try {
    // 1. 获取查询历史
    const historyResponse = await api.post('/api/sql/execute', {
      sql: `
        SELECT DISTINCT query
        FROM query_history 
        WHERE status = 'success'
        ORDER BY created_at DESC 
        LIMIT 5
      `
    });

    const queries = historyResponse.data.data;
    
    // 2. 对每个历史查询重新执行并显示结果
    for (let i = 0; i < queries.length; i++) {
      const query = queries[i].query;
      
      console.log('\n' + '='.repeat(100));
      console.log(`查询 #${i + 1}:`);
      console.log('SQL:', query);
      console.log('-'.repeat(100));
      
      const results = await executeQuery(query);
      if (results) {
        console.log('\n查询结果:');
        if (Array.isArray(results)) {
          results.forEach((row, index) => {
            console.log(`\n行 ${index + 1}:`, JSON.stringify(row, null, 2));
          });
        } else {
          console.log(JSON.stringify(results, null, 2));
        }
      }
      
      console.log('\n' + '='.repeat(100));
    }
  } catch (error) {
    if (error.response) {
      console.error('\n请求失败:', error.response.status, error.response.data);
    } else {
      console.error('\n请求错误:', error.message);
    }
  }
}

getQueryHistory(); 