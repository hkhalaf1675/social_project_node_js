'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    static associate(models) {
      // define association here
      Post.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user'
      });
      Post.belongsTo(models.Category, {
        foreignKey: 'categoryId',
        as: 'category'
      });
      Post.hasMany(models.Rating, {
        foreignKey: 'postId',
        as: 'ratings'
      });
    }
  }
  Post.init({
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    image: {
        type: DataTypes.BLOB,
        allowNull: true
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Post',
  });
  return Post;
};
