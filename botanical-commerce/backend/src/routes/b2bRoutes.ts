import { Router } from 'express';
import { B2BController } from '../controllers/b2bController.js';
import { authenticate, authorizeRoles } from '../middlewares/auth.js';
import { UserRole } from '../types/index.js';

const router = Router();

router.post('/enquiries', B2BController.submitEnquiry);
router.get('/enquiries', authenticate, authorizeRoles(UserRole.ADMIN), B2BController.getEnquiries);
router.get('/enquiries/:id', authenticate, authorizeRoles(UserRole.ADMIN), B2BController.getEnquiryById);
router.post('/quotations', authenticate, authorizeRoles(UserRole.ADMIN), B2BController.createQuotation);

export default router;
