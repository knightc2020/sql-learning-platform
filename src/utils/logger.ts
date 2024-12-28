import winston from 'winston';

// 自定义时间格式
const localTimeFormat = winston.format((info) => {
  info.timestamp = new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' });
  return info;
});

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    localTimeFormat(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      localTimeFormat(),
      winston.format.simple()
    )
  }));
}

export { logger }; 