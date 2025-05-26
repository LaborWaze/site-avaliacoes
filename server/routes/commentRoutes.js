import { Router } from 'express';
import {
  postComment,
  getComments,
  likeComment
} from '../controllers/commentController.js';

const router = Router();

router.post('/', postComment);
router.get('/', getComments);
router.post('/:id/like', likeComment);

export default router;
