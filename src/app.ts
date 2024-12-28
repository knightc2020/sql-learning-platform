import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import sqlRoutes from './routes/sql.routes';
import userRoutes from './routes/user.routes';
import { errorHandler } from './utils/error-handler';
import { logger } from './utils/logger';

// 加载环境变量
dotenv.config();

const app = express();

// 中间件
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// 路由
app.use('/api/sql', sqlRoutes);
app.use('/api/users', userRoutes);

// 错误处理中间件
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  logger.info(`服务器运行在端口 ${PORT}`);
}); 