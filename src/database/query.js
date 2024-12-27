const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

async function executeQuery(sql) {
  const config = {
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'sql_learning'
  };

  try {
    const connection = await mysql.createConnection(config);
    console.log('数据库连接成功！');

    console.log('\n执行查询:', sql);
    const [results] = await connection.query(sql);
    
    console.log('\n查询结果:');
    console.table(results);

    await connection.end();
  } catch (error) {
    console.error('查询失败:', error.message);
  }
}

// 从命令行参数获取 SQL 语句
const sql = process.argv[2];

if (!sql) {
  console.log('请提供 SQL 查询语句');
  console.log('使用方法: node src/database/query.js "YOUR SQL QUERY"');
  console.log('例如: node src/database/query.js "SELECT * FROM customers"');
  process.exit(1);
}

executeQuery(sql); 