'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Section extends Model {
    static associate(models) {
      // define association here
      Section.hasMany(models.Category, {
        as: 'categories',
        foreignKey: 'sectionId'
      });
    }
  }
  Section.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  }, {
    sequelize,
    modelName: 'Section',
  });
  return Section;
};
