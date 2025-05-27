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

app.use(cors());
app.use(express.json());

// 1) Serve o front-end estático da pasta server/public
const publicDir = path.join(__dirname, 'public');
app.use(express.static(publicDir));

// 2) Rota raiz — envia o index.html de server/public
app.get('/', (req, res) => {
  res.sendFile(path.join(publicDir, 'index.html'));
});

// 3) Rotas de API
app.use('/api/reviews', reviewRoutes);
app.use('/api/comments', commentRoutes);

const PORT = process.env.PORT || 3000;

(async () => {
  try {
    const dialect = sequelize.getDialect(); // 'sqlite' ou 'postgres'

    // Backup apenas quando for SQLite
    if (dialect === 'sqlite') {
      await sequelize.query('DROP TABLE IF EXISTS reviews_backup;');
      await sequelize.query('DROP TABLE IF EXISTS comments_backup;');
      console.log('🗄️  backup tables removidas (se existiam), iniciando sync');

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

      await sequelize.query(`
        INSERT INTO reviews_backup (id, placeId, rating, comment, anonId, createdAt, updatedAt)
        SELECT id, placeId, rating, comment, anonId, createdAt, updatedAt FROM reviews;
      `);
      await sequelize.query(`
        INSERT INTO comments_backup (id, placeId, text, anonId, parentCommentId, likeCount, createdAt, updatedAt)
        SELECT id, placeId, text, anonId, parentCommentId, likeCount, createdAt, updatedAt FROM comments;
      `);
      console.log('🗄️  backup tables populadas com sucesso');
    }

    // Sincroniza modelos (cria/atualiza tables reviews e comments)
    await sequelize.sync({ alter: true });
    console.log('🗄️  Banco sincronizado');

    // Inicia o servidor
    app.listen(PORT, () => console.log(`🚀  Servidor rodando na porta ${PORT}`));
  } catch (err) {
    console.error('❌  Falha ao sincronizar ou repovoar backups:', err);
    process.exit(1);
  }
})();
