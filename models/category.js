'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    static associate(models) {
      // define association here
    //   Category.hasMany(models.User, {
    //     foreignKey: 'categoryId'
    //   });
    }
  }
  Category.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    section: {
        type: DataTypes.ENUM('Movies', 'Tv shows', 'Video games', 'Books'),
        allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Category',
  });
  return Category;
};
