import { Router } from 'express';
import {
  postComment,
  getComments,
  likeComment,
  deleteComment
} from '../controllers/commentController.js';

const router = Router();

router.post('/', postComment);
router.get('/', getComments);
router.post('/:id/like', likeComment);
router.delete('/:id', deleteComment);

export default router;
