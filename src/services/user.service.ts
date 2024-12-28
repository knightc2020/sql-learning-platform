import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, UserRole, UserStatus, LoginCredentials, RegisterData, AuthResponse } from '../types/user.types';
import DatabaseConnection from './db-connection';
import { AppError } from '../utils/error-handler';
import { logger } from '../utils/logger';

interface QueryResult {
  insertId: number;
  affectedRows: number;
}

class UserService {
  private static readonly SALT_ROUNDS = 10;
  private static readonly JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
  private static readonly JWT_EXPIRES_IN = '24h';

  static async register(data: RegisterData): Promise<AuthResponse> {
    try {
      // 检查用户名是否已存在
      const existingUser = await DatabaseConnection.query<User[]>(
        'SELECT * FROM users WHERE username = ? OR email = ?',
        [data.username, data.email]
      );

      if (existingUser.length > 0) {
        throw new AppError(400, '用户名或邮箱已存在');
      }

      // 加密密码
      const hashedPassword = await bcrypt.hash(data.password, this.SALT_ROUNDS);

      // 创建用户
      const result = await DatabaseConnection.query<QueryResult>(
        'INSERT INTO users (username, email, password, role, status) VALUES (?, ?, ?, ?, ?)',
        [data.username, data.email, hashedPassword, UserRole.STUDENT, UserStatus.ACTIVE]
      );

      // 获取创建的用户
      const user = await DatabaseConnection.query<User[]>(
        'SELECT * FROM users WHERE user_id = ?',
        [result.insertId]
      );

      if (user.length === 0) {
        throw new AppError(500, '用户创建失败');
      }

      // 生成 JWT
      const token = this.generateToken(user[0]);

      return {
        token,
        user: this.sanitizeUser(user[0])
      };
    } catch (error) {
      logger.error('用户注册失败:', error);
      throw error;
    }
  }

  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      // 查找用户
      const users = await DatabaseConnection.query<User[]>(
        'SELECT * FROM users WHERE username = ?',
        [credentials.username]
      );

      if (users.length === 0) {
        throw new AppError(401, '用户名或密码错误');
      }

      const user = users[0];

      // 验证密码
      const isValidPassword = await bcrypt.compare(credentials.password, user.password);
      if (!isValidPassword) {
        throw new AppError(401, '用户名或密码错误');
      }

      // 检查用户状态
      if (user.status !== UserStatus.ACTIVE) {
        throw new AppError(403, '账户已被禁用');
      }

      // 更新最后登录时间
      await DatabaseConnection.query(
        'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE user_id = ?',
        [user.user_id]
      );

      // 生成 JWT
      const token = this.generateToken(user);

      return {
        token,
        user: this.sanitizeUser(user)
      };
    } catch (error) {
      logger.error('用户登录失败:', error);
      throw error;
    }
  }

  static async getUserById(userId: number): Promise<Omit<User, 'password'>> {
    try {
      const users = await DatabaseConnection.query<User[]>(
        'SELECT * FROM users WHERE user_id = ?',
        [userId]
      );

      if (users.length === 0) {
        throw new AppError(404, '用户不存在');
      }

      return this.sanitizeUser(users[0]);
    } catch (error) {
      logger.error('获取用户信息失败:', error);
      throw error;
    }
  }

  private static generateToken(user: User): string {
    return jwt.sign(
      {
        user_id: user.user_id,
        username: user.username,
        role: user.role
      },
      this.JWT_SECRET,
      { expiresIn: this.JWT_EXPIRES_IN }
    );
  }

  private static sanitizeUser(user: User): Omit<User, 'password'> {
    const { password, ...sanitizedUser } = user;
    return sanitizedUser;
  }
}

export default UserService; 