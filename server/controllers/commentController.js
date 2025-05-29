import Comment from '../models/Comment.js';

// POST /api/comments
export async function postComment(req, res) {
  const { placeId, text, anonId, parentCommentId } = req.body;
  try {
    const comment = await Comment.create({ placeId, text, anonId, parentCommentId });
    res.status(201).json(comment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao criar comentário' });
  }
}

// POST /api/comments/:id/like
export async function likeComment(req, res) {
  const { id } = req.params;
  try {
    const comment = await Comment.findByPk(id);
    if (!comment) {
      return res.status(404).json({ error: 'Comentário não encontrado' });
    }
    comment.likeCount += 1;
    await comment.save();
    res.json({ likeCount: comment.likeCount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao curtir comentário' });
  }
}

// GET /api/comments?placeId=X[&sortBy=curtidas]
export async function getComments(req, res) {
  const { placeId, sortBy } = req.query;

  if (!placeId) {
    return res.status(400).json({ error: 'Parâmetro "placeId" é obrigatório na query' });
  }

  try {
    const rows = await Comment.findAll({
      where: { placeId },
      order: [['createdAt', 'DESC']],
      raw: true
    });

    // Monta a árvore de respostas
    const map = {};
    rows.forEach(c => { map[c.id] = { ...c, respostas: [] }; });

    const roots = [];
    rows.forEach(c => {
      if (c.parentCommentId && map[c.parentCommentId]) {
        map[c.parentCommentId].respostas.push(map[c.id]);
      } else {
        roots.push(map[c.id]);
      }
    });

    // Opcional: ordenar por curtidas
    if (sortBy === 'curtidas') {
      roots.sort((a, b) => b.likeCount - a.likeCount);
      roots.forEach(r => r.respostas.sort((a, b) => b.likeCount - a.likeCount));
    }

    res.json(roots);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar comentários' });
  }
}

// DELETE /api/comments/:id
export async function deleteComment(req, res) {
  try {
    const { id } = req.params;
    const deleted = await Comment.destroy({ where: { id } });
    if (!deleted) {
      return res.status(404).json({ error: 'Comentário não encontrado' });
    }
    return res.status(204).end(); // 204 = sem conteúdo
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro ao tentar excluir comentário' });
  }
}
