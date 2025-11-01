import express from 'express';
import {
  createDiscussion,
  getDiscussions,
  addReplyToDiscussion,
  likeDiscussion,
  likeReply
} from '../controllers/discussionController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getDiscussions)
  .post(protect, createDiscussion);

router.route('/:id/reply')
  .post(protect, addReplyToDiscussion);

router.route('/:id/like')
  .put(protect, likeDiscussion);

router.route('/:discussionId/reply/:replyId/like')
  .put(protect, likeReply);

export default router;
