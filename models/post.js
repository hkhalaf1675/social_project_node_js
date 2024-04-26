'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    static associate(models) {
      // define association here
      Post.belongsTo(models.User, {
        foreignKey: 'userId'
      });
      Post.belongsTo(models.Category, {
        foreignKey: 'categoryId'
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
  }, {
    sequelize,
    modelName: 'Post',
  });
  return Post;
};
