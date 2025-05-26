import { Router } from 'express';
import {
  createReview,
  listReviews,
  getAverageRatings
} from '../controllers/reviewController.js';
import Review from '../models/Review.js';

const router = Router();

router.post('/', createReview);
router.get('/', listReviews);
router.get('/average/:placeId', getAverageRatings);

// PUT /api/reviews/:id — altera rating e comentário de uma review existente
router.put('/:id', async (req, res) => {
  try {
    const rev = await Review.findByPk(req.params.id);
    if (!rev) {
      return res.status(404).json({ error: 'Review não encontrada' });
    }

    const { rating, comment } = req.body;
    rev.rating  = rating;
    rev.comment = comment;
    await rev.save();

    return res.json(rev);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro ao atualizar review' });
  }
});

export default router;
