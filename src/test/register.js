const http = require('http');
const fs = require('fs');

const data = JSON.stringify({
  username: 'testuser2',
  email: 'test2@example.com',
  password: 'password123'
});

const options = {
  hostname: '127.0.0.1',
  port: 3000,
  path: '/api/users/register',
  method: 'POST',
  headers: {
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
    const response = {
      statusCode: res.statusCode,
      headers: res.headers,
      body: JSON.parse(responseData)
    };

    fs.writeFileSync(
      'test-results.json', 
      JSON.stringify(response, null, 2), 
      'utf8'
    );

    console.log('测试结果已保存到 test-results.json 文件中');
    
    console.log('\n测试结果：');
    console.log('状态码：', response.statusCode);
    console.log('\n用户信息：');
    console.log('用户ID：', response.body.data.user.user_id);
    console.log('用户名：', response.body.data.user.username);
    console.log('邮箱：', response.body.data.user.email);
    console.log('角色：', response.body.data.user.role);
    console.log('状态：', response.body.data.user.status);
    console.log('创建时间：', new Date(response.body.data.user.created_at).toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' }));
  });
});

req.on('error', (error) => {
  console.error('请求错误:', error);
});

req.write(data);
req.end(); 