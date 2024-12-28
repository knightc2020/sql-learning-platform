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

    logger.info(`执行 SQL 查询: ${sql}`);

    const result = await CursorAgent.executeQuery(sql);
    
    const response = {
      success: true,
      data: result,
      message: '查询执行成功'
    };

    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    
    res.json(response);

    logger.info('响应发送完成');
  } catch (error) {
    logger.error('SQL执行错误:', error);
    
    if (error instanceof AppError) {
      res.status(error.statusCode).json({
        success: false,
        message: error.message
      });
    } else {
      res.status(500).json({
        success: false,
        message: '执行 SQL 查询时发生错误'
      });
    }
  }
}; 