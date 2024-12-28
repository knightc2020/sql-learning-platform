const http = require('http');

// 使用登录获得的 token
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoyLCJ1c2VybmFtZSI6InRlc3R1c2VyIiwicm9sZSI6InN0dWRlbnQiLCJpYXQiOjE3MzUzNTUwNTgsImV4cCI6MTczNTQ0MTQ1OH0.ioT7QiEbu5Jb1J6DE8At0OizeSD6NkIVREgoEXaFvlM';

const data = JSON.stringify({
  sql: 'SELECT * FROM customers'
});

const options = {
  hostname: '127.0.0.1',
  port: 3000,
  path: '/api/sql/execute',
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, (res) => {
  let responseData = '';

  res.on('data', (chunk) => {
    responseData += chunk;
  });

  res.on('end', () => {
    try {
      const result = JSON.parse(responseData);
      console.log(JSON.stringify(result, null, 2));
    } catch (error) {
      console.error('解析响应失败:', error);
      console.log('原始响应:', responseData);
    }
  });
});

req.on('error', (error) => {
  console.error('请求错误:', error);
});

req.write(data);
req.end(); 