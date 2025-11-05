import express from 'express';
import { getNavigationItems } from '../controllers/sidebarController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Protected routes
router.route('/navigation').get(protect, getNavigationItems);

export default router;
