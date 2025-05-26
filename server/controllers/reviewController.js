import Review from '../models/Review.js';

export async function createReview(req, res) {
  try {
    const { placeId, rating, comment, anonId } = req.body;
    const review = await Review.create({ placeId, rating, comment, anonId });
    res.status(201).json(review);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao criar review' });
  }
}

export async function listReviews(req, res) {
  try {
    const { placeId } = req.query;
    const where = placeId ? { placeId } : {};
    const reviews = await Review.findAll({
      where,
      order: [['createdAt', 'DESC']]
    });
    res.json(reviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar reviews' });
  }
}

export async function getAverageRatings(req, res) {
  try {
    const { placeId } = req.params;
    const stats = await Review.findAll({
      where: { placeId },
      attributes: [
        [Review.sequelize.fn('AVG', Review.sequelize.col('rating')), 'avgRating'],
        [Review.sequelize.fn('COUNT', Review.sequelize.col('id')), 'count']
      ],
      raw: true
    });
    res.json(stats[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao calcular média de ratings' });
  }
}

// Função para atualizar uma review existente
export async function updateReview(req, res) {
  try {
    const { rating, comment } = req.body;
    const rev = await Review.findByPk(req.params.id);
    if (!rev) {
      return res.status(404).json({ error: 'Review não encontrada' });
    }

    rev.rating  = rating;
    rev.comment = comment;
    await rev.save();

    return res.json(rev);
  } catch (error) {
    console.error('Erro ao atualizar review:', error);
    res.status(500).json({ error: 'Erro ao atualizar review' });
  }
}
