import express from 'express';
import { getUserProfile } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/profile').get(protect, getUserProfile);

export default router;