import { Router } from 'express';
import { executeSql } from '../controllers/sql-executor';

const router = Router();

router.post('/execute', executeSql);

export default router; 