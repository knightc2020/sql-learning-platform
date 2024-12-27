import mysql from 'mysql2/promise';
import { dbConfig } from '../config/database';
import { logger } from '../utils/logger';

class DatabaseConnection {
  private static pool: mysql.Pool;

  static async getPool(): Promise<mysql.Pool> {
    if (!this.pool) {
      try {
        this.pool = mysql.createPool(dbConfig);
        logger.info('数据库连接池已创建');
      } catch (error) {
        logger.error('创建数据库连接池失败:', error);
        throw error;
      }
    }
    return this.pool;
  }

  static async query<T>(sql: string, params?: any[]): Promise<T> {
    const pool = await this.getPool();
    try {
      const [results] = await pool.query(sql, params);
      return results as T;
    } catch (error) {
      logger.error('执行查询失败:', error);
      throw error;
    }
  }

  static async getConnection(): Promise<mysql.PoolConnection> {
    const pool = await this.getPool();
    try {
      return await pool.getConnection();
    } catch (error) {
      logger.error('获取数据库连接失败:', error);
      throw error;
    }
  }
}

export default DatabaseConnection; 