'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Rating extends Model {
    static associate(models) {
      // define association here
      Rating.belongsTo(models.Post, {
        foreignKey: 'postId',
        as: 'post'
      });
    }
  }
  Rating.init({
    likeCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    disLikeCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    postId: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Rating',
  });
  return Rating;
};
