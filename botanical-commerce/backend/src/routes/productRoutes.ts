import { Router } from 'express';
import { ProductController } from '../controllers/productController.js';
import { authenticate, authorizeRoles } from '../middlewares/auth.js';
import { UserRole } from '../types/index.js';

const router = Router();

router.get('/', ProductController.getProducts);
router.get('/:slug', ProductController.getProductBySlug);
router.post('/', authenticate, authorizeRoles(UserRole.ADMIN), ProductController.createProduct);
router.patch('/:id', authenticate, authorizeRoles(UserRole.ADMIN), ProductController.updateProduct);
router.delete('/:id', authenticate, authorizeRoles(UserRole.ADMIN), ProductController.deleteProduct);

export default router;
