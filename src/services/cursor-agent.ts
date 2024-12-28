import DatabaseConnection from './db-connection';
import { logger } from '../utils/logger';
import { AppError } from '../utils/error-handler';

class CursorAgent {
  private static readonly QUERY_TIMEOUT = 10000; // 10秒超时
  private static readonly MAX_ROWS = 1000; // 最大返回行数

  static async executeQuery(sql: string): Promise<any> {
    // 验证 SQL 语句（只允许 SELECT 语句）
    if (!this.isSelectQuery(sql)) {
      throw new AppError(400, '只允许执行 SELECT 查询');
    }

    try {
      // 添加 LIMIT 子句以限制结果集大小
      const limitedSql = this.addLimit(sql);
      
      // 设置查询超时
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new AppError(408, '查询超时')), this.QUERY_TIMEOUT);
      });

      // 执行查询
      const queryPromise = DatabaseConnection.query(limitedSql);
      
      const results = await Promise.race([queryPromise, timeoutPromise]);
      
      // 记录查询历史
      await this.logQuery(sql, true);
      
      return results;
    } catch (error) {
      // 记录失败的查询
      await this.logQuery(sql, false);
      
      if (error instanceof AppError) {
        throw error;
      }
      
      logger.error('查询执行失败:', error);
      throw new AppError(500, '查询执行失败');
    }
  }

  private static isSelectQuery(sql: string): boolean {
    const normalizedSql = sql.trim().toLowerCase();
    return normalizedSql.startsWith('select');
  }

  private static addLimit(sql: string): string {
    const normalizedSql = sql.trim().toLowerCase();
    if (normalizedSql.includes('limit')) {
      return sql;
    }
    return `${sql} LIMIT ${this.MAX_ROWS}`;
  }

  private static async logQuery(sql: string, success: boolean): Promise<void> {
    const query = `
      INSERT INTO query_history (query, status)
      VALUES (?, ?)
    `;
    
    try {
      await DatabaseConnection.query(query, [sql, success ? 'success' : 'failed']);
    } catch (error) {
      logger.error('记录查询历史失败:', error);
    }
  }
}

export default CursorAgent; 