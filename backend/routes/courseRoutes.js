import express from 'express';
import {
  getCourses,
  getCourseById,
  getCourseLearningData,
  getStatsCards,
  getMyCourses,
  addCourse,
  deleteCourse,
  updateLessonVideo,
  addSubtopics,
  addLessons,
  addModules
} from '../controllers/courseController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.route('/').get(getCourses);
router.route('/:id').get(getCourseById);
router.route('/stats/cards').get(protect, getStatsCards);

// Protected routes
router.route('/my-courses').get(protect, getMyCourses);
router.route('/:id/learning').get(protect, getCourseLearningData);

// Admin routes
router.route('/').post(protect, addCourse);
router.route('/:id').delete(protect, deleteCourse);
router.route('/:courseId/modules').post(protect, addModules);
router.route('/:courseId/lessons/:lessonId/video').put(protect, updateLessonVideo);
router.route('/:courseId/subtopics').post(protect, addSubtopics);
router.route('/:courseId/modules/:moduleId/lessons').post(protect, addLessons);

export default router;
