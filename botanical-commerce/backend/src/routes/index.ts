import { Router } from 'express';
import authRoutes from './authRoutes.js';
import productRoutes from './productRoutes.js';
import botanicalRoutes from './botanicalRoutes.js';
import recipeRoutes from './recipeRoutes.js';
import cartRoutes from './cartRoutes.js';
import orderRoutes from './orderRoutes.js';
import paymentRoutes from './paymentRoutes.js';
import b2bRoutes from './b2bRoutes.js';
import adminRoutes from './adminRoutes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/botanicals', botanicalRoutes);
router.use('/recipes', recipeRoutes);
router.use('/cart', cartRoutes);
router.use('/orders', orderRoutes);
router.use('/payments', paymentRoutes);
router.use('/b2b', b2bRoutes);
router.use('/admin', adminRoutes);

export default router;
