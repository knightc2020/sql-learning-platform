import { Router } from 'express';
import { body } from 'express-validator';
import { register, login, getProfile } from '../controllers/user.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// 注册验证规则
const registerValidation = [
  body('username')
    .isLength({ min: 3, max: 50 })
    .withMessage('用户名长度必须在3-50个字符之间')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('用户名只能包含字母、数字和下划线'),
  body('email')
    .isEmail()
    .withMessage('请输入有效的邮箱地址'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('密码长度至少为6个字符')
    .matches(/\d/)
    .withMessage('密码必须包含至少一个数字')
];

// 登录验证规则
const loginValidation = [
  body('username')
    .notEmpty()
    .withMessage('用户名不能为空'),
  body('password')
    .notEmpty()
    .withMessage('密码不能为空')
];

// 注册路由
router.post('/register', registerValidation, register);

// 登录路由
router.post('/login', loginValidation, login);

// 获取用户信息路由（需要认证）
router.get('/profile', authMiddleware, getProfile);

export default router; 