import { Router } from 'express';
import { AdminController } from '../controllers/adminController.js';
import { authenticate, authorizeRoles } from '../middlewares/auth.js';
import { UserRole } from '../types/index.js';

const router = Router();

// Secure all admin routes with authentication and ADMIN role check
router.use(authenticate, authorizeRoles(UserRole.ADMIN));

router.get('/dashboard', AdminController.getDashboard);
router.get('/analytics', AdminController.getAnalytics);
router.get('/orders', AdminController.getOrders);
router.patch('/orders/:id/status', AdminController.updateOrderStatus);
router.get('/customers', AdminController.getCustomers);
router.get('/inventory', AdminController.getInventory);
router.patch('/inventory/stock', AdminController.updateStock);

export default router;
