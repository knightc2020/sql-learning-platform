const http = require('http');
const fs = require('fs');

// 使用登录时获得的 token
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoyLCJ1c2VybmFtZSI6InRlc3R1c2VyIiwicm9sZSI6InN0dWRlbnQiLCJpYXQiOjE3MzUzNTUwNTgsImV4cCI6MTczNTQ0MTQ1OH0.ioT7QiEbu5Jb1J6DE8At0OizeSD6NkIVREgoEXaFvlM';

const options = {
  hostname: '127.0.0.1',
  port: 3000,
  path: '/api/users/profile',
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
};

const req = http.request(options, (res) => {
  let responseData = '';

  res.on('data', (chunk) => {
    responseData += chunk;
  });

  res.on('end', () => {
    // 将响应信息格式化为易读的格式
    const response = {
      statusCode: res.statusCode,
      headers: res.headers,
      body: JSON.parse(responseData)
    };

    // 将响应信息保存到文件
    fs.writeFileSync(
      'test-results.json', 
      JSON.stringify(response, null, 2), 
      'utf8'
    );

    console.log('测试结果已保存到 test-results.json 文件中');
    
    // 在控制台显示格式化的结果
    console.log('\n测试结果：');
    console.log('状态码：', response.statusCode);
    console.log('\n用户信息：');
    console.log('用户ID：', response.body.data.user.user_id);
    console.log('用户名：', response.body.data.user.username);
    console.log('邮箱：', response.body.data.user.email);
    console.log('角色：', response.body.data.user.role);
    console.log('状态：', response.body.data.user.status);
    console.log('最后登录：', response.body.data.user.last_login);
    console.log('创建时间：', response.body.data.user.created_at);
  });
});

req.on('error', (error) => {
  console.error('请求错误:', error);
});

req.end(); 