'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class SavedPost extends Model {
    static associate(models) {
      // define association here
      SavedPost.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user'
      });
      SavedPost.belongsTo(models.Post, {
        foreignKey: 'postId',
        as: 'post'
      });
    }
  }
  SavedPost.init({
    postId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'SavedPost',
  });
  return SavedPost;
};
