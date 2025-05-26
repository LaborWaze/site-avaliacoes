import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import sequelize from './utils/db.js';
import reviewRoutes from './routes/reviewRoutes.js';
import commentRoutes from './routes/commentRoutes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

// Middleware para servir arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Forçar GET / para index.html em SPAs
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use(cors());
app.use(express.json());

app.use('/api/reviews', reviewRoutes);
app.use('/api/comments', commentRoutes);

const PORT = process.env.PORT || 3000;

// 1) Remove antigas tabelas de backup para evitar conflitos
sequelize.query('DROP TABLE IF EXISTS reviews_backup;')
  .then(() => sequelize.query('DROP TABLE IF EXISTS comments_backup;'))
  .then(() => {
    console.log('🗄️  backup tables removidas (se existiam), iniciando sync');
    // 2) Sincroniza modelos (cria/atualiza tables reviews e comments)
    return sequelize.sync({ alter: true });
  })
  .then(async () => {
    console.log('🗄️  Banco sincronizado');

    // 3) (Re)cria estrutura vazia das tabelas de backup a partir das tabelas principais
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS reviews_backup AS
        SELECT id, placeId, rating, comment, anonId, createdAt, updatedAt
        FROM reviews WHERE 0;
    `);
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS comments_backup AS
        SELECT id, placeId, text, anonId, parentCommentId, likeCount, createdAt, updatedAt
        FROM comments WHERE 0;
    `);
    console.log('🗄️  backup tables (reviews_backup, comments_backup) criadas');

    // 4) Popula as tabelas de backup do zero
    await sequelize.query(`
      INSERT INTO reviews_backup (id, placeId, rating, comment, anonId, createdAt, updatedAt)
      SELECT id, placeId, rating, comment, anonId, createdAt, updatedAt FROM reviews;
    `);
    await sequelize.query(`
      INSERT INTO comments_backup (id, placeId, text, anonId, parentCommentId, likeCount, createdAt, updatedAt)
      SELECT id, placeId, text, anonId, parentCommentId, likeCount, createdAt, updatedAt FROM comments;
    `);
    console.log('🗄️  backup tables populadas com sucesso');

    // 5) Inicia o servidor
    app.listen(PORT, () => console.log(`🚀  Servidor rodando na porta ${PORT}`));
  })
  .catch(err => {
    console.error('❌  Falha ao sincronizar ou repovoar backups:', err);
    process.exit(1);
  });
