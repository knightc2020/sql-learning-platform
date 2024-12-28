const http = require('http');

const data = JSON.stringify({
  username: 'testuser',
  password: 'password123'
});

const options = {
  hostname: '127.0.0.1',
  port: 3000,
  path: '/api/users/login',
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
    console.log('状态码:', res.statusCode);
    console.log('响应头:', res.headers);
    console.log('响应体:', responseData);
  });
});

req.on('error', (error) => {
  console.error('请求错误:', error);
});

req.write(data);
req.end(); 