const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function initDatabase() {
  const config = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    multipleStatements: true // 允许执行多条 SQL 语句
  };

  console.log('正在使用以下配置连接数据库：');
  console.log('主机：', config.host);
  console.log('用户：', config.user);
  console.log('密码：', '*'.repeat(config.password.length));

  try {
    console.log('尝试连接数据库...');
    const connection = await mysql.createConnection(config);
    console.log('数据库连接成功！');

    const sqlPath = path.join(__dirname, 'init.sql');
    console.log('正在读取 SQL 文件：', sqlPath);
    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    console.log('SQL 文件内容：');
    console.log(sql);
    
    console.log('\n正在初始化数据库...');
    const [results] = await connection.query(sql);
    console.log('SQL 执行结果：', results);
    console.log('数据库初始化成功！');

    // 验证表是否创建成功
    console.log('\n验证表创建：');
    const [tables] = await connection.query('SHOW TABLES');
    console.log('已创建的表：');
    console.table(tables);

    // 验证数据是否插入成功
    console.log('\n验证数据插入：');
    const [customers] = await connection.query('SELECT * FROM customers');
    console.log('客户表数据：');
    console.table(customers);

    const [accounts] = await connection.query('SELECT * FROM accounts');
    console.log('账户表数据：');
    console.table(accounts);

    await connection.end();
    console.log('数据库连接已关闭');
  } catch (error) {
    console.error('错误详情：');
    console.error('- 错误代码：', error.code);
    console.error('- 错误消息：', error.message);
    console.error('- SQL 状态：', error.sqlState);
    console.error('- 错误号：', error.errno);
    
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('\n可能的解决方案：');
      console.error('1. 检查用户名和密码是否正确');
      console.error('2. 确保 MySQL 服务正在运行');
      console.error('3. 尝试在 MySQL 命令行中使用相同的凭据登录');
    }
    
    process.exit(1);
  }
}

initDatabase(); 