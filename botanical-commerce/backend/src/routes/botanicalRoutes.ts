import { Router } from 'express';
import { BotanicalController } from '../controllers/botanicalController.js';

const router = Router();

router.get('/', BotanicalController.getAllBotanicals);
router.get('/:slug', BotanicalController.getBotanicalBySlug);

export default router;
