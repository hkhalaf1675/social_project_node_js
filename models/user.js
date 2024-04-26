'use strict';
const bcrypt = require("bcrypt");
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {

    static associate(models) {
        User.belongsTo(models.Role, 
          { 
            foreignKey: 'roleId', 
            as: 'role' 
          }
        );

        User.hasMany(models.Post, 
          {
            foreignKey: 'userId',
            as: 'user'
          }
        );

        User.hasMany(models.Comment, {
          foreignKey: 'userId',
          as: 'comments'
        });
    }

  }
  User.init({
    username: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    profilePicture: {
        type: DataTypes.BLOB,
        allowNull: true
    },
    password: {
      type: DataTypes.STRING,
      set(value) {
        if (value) {
          const salt = bcrypt.genSaltSync(10);
          const hash = bcrypt.hashSync(value, salt);
          this.setDataValue('password', hash);
        }
      }
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    bio: {
      type: DataTypes.STRING,
      allowNull: true
    },
    roleId: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    lastLogin: {
        type: DataTypes.DATE,
        allowNull: true
    }
  }, {
    defaultScope: {
      attributes: { exclude: ['password'] },
    },
    sequelize,
    modelName: 'User',
  });

  return User;
};
