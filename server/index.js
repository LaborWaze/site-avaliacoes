import express from 'express';
import sequelize from './utils/db.js';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 10000;

(async () => {
  try {
    const dialect = sequelize.getDialect(); // 'sqlite' ou 'postgres'

    // 1) Backup apenas no SQLite
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

    // 2) Sincroniza modelos (cria/atualiza tabelas)
    await sequelize.sync({ alter: true });
    console.log('🗄️  Banco sincronizado');

    // 3) Inicia o servidor
    app.listen(PORT, () => console.log(`🚀  Servidor rodando na porta ${PORT}`));
  } catch (error) {
    console.error('❌  Falha ao iniciar o servidor:', error);
    process.exit(1);
  }
})();

// suas rotas aqui, sem alterações...
// ex:
// app.get('/api/reviews', async (req, res) => { … });


