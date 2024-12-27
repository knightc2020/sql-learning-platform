import { Request, Response } from 'express';
import CursorAgent from '../services/cursor-agent';
import { logger } from '../utils/logger';
import { AppError } from '../utils/error-handler';

export const executeSql = async (req: Request, res: Response) => {
  try {
    const { sql } = req.body;

    if (!sql) {
      throw new AppError(400, 'SQL 查询语句不能为空');
    }

    const result = await CursorAgent.executeQuery(sql);
    res.json(result);
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({
        status: 'error',
        message: error.message
      });
    } else {
      logger.error('SQL执行器错误:', error);
      res.status(500).json({
        status: 'error',
        message: '服务器内部错误'
      });
    }
  }
}; 