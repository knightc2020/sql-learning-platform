import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import UserService from '../services/user.service';
import { AppError } from '../utils/error-handler';
import { logger } from '../utils/logger';

export const register = async (req: Request, res: Response) => {
  try {
    // 验证请求数据
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new AppError(400, '验证错误：' + errors.array().map(err => err.msg).join(', '));
    }

    const { username, email, password } = req.body;
    const result = await UserService.register({ username, email, password });

    res.status(201).json({
      status: 'success',
      data: result
    });
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({
        status: 'error',
        message: error.message
      });
    } else {
      logger.error('注册失败:', error);
      res.status(500).json({
        status: 'error',
        message: '注册失败'
      });
    }
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    // 验证请求数据
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new AppError(400, '验证错误：' + errors.array().map(err => err.msg).join(', '));
    }

    const { username, password } = req.body;
    const result = await UserService.login({ username, password });

    // 设置 cookie
    res.cookie('token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000 // 24小时
    });

    res.json({
      status: 'success',
      data: result
    });
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({
        status: 'error',
        message: error.message
      });
    } else {
      logger.error('登录失败:', error);
      res.status(500).json({
        status: 'error',
        message: '登录失败'
      });
    }
  }
};

export const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.user_id;
    const user = await UserService.getUserById(userId);

    res.json({
      status: 'success',
      data: { user }
    });
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({
        status: 'error',
        message: error.message
      });
    } else {
      logger.error('获取用户信息失败:', error);
      res.status(500).json({
        status: 'error',
        message: '获取用户信息失败'
      });
    }
  }
}; 