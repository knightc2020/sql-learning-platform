import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import sqlRoutes from './routes/sql.routes';
import { errorHandler } from './utils/error-handler';
import { logger } from './utils/logger';

// 加载环境变量
dotenv.config();

const app = express();

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 路由
app.use('/api/sql', sqlRoutes);

// 错误处理中间件
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  logger.info(`服务器运行在端口 ${PORT}`);
}); 