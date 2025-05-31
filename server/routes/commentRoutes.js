import { Router } from 'express';
import {
  postComment,
  getComments,
  likeComment,
  deleteComment,
  unlikeComment
} from '../controllers/commentController.js';

const router = Router();

router.post('/', postComment);
router.get('/', getComments);
router.post('/:id/like', likeComment);
router.delete('/:id', deleteComment);
router.delete('/:id/like', unlikeComment);

export default router;
