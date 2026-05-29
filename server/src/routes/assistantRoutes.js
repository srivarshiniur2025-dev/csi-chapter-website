import { Router } from 'express';
import { assistantChat } from '../controllers/assistantController.js';

const router = Router();

router.post('/chat', ...assistantChat);

export default router;
