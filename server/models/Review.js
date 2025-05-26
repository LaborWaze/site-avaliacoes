import { DataTypes } from 'sequelize';
import sequelize from '../utils/db.js';

const Review = sequelize.define('Review', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  placeId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: { min: 1, max: 5 }
  },
  comment: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  anonId: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'reviews',
  timestamps: true
});

export default Review;
