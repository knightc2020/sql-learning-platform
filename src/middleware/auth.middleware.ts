import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from '../utils/error-handler';

interface JwtPayload {
  user_id: number;
  username: string;
  role: string;
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // 从请求头或 cookie 中获取 token
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new AppError(401, '未登录');
    }

    try {
      // 验证 token
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'your-secret-key'
      ) as JwtPayload;

      // 将用户信息添加到请求对象
      (req as any).user = decoded;

      next();
    } catch (error) {
      throw new AppError(401, '登录已过期，请重新登录');
    }
  } catch (error) {
    next(error);
  }
}; 