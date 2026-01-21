import express from 'express';
import * as aiController from '../controllers/aiController';
import { authenticate } from '../middlewares/authMiddleware';

const router = express.Router();

// Protected routes (require login)
router.post('/practice/generate', authenticate, aiController.generate);
router.post('/practice/evaluate', authenticate, aiController.evaluate);
router.post('/chat', authenticate, aiController.chat);

export default router;
