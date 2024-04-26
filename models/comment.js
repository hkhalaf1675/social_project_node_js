'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Comment extends Model{
        static associate(models){
            Comment.belongsTo(models.Post, {
                as: 'post',
                foreignKey: 'postId'
            });

            Comment.belongsTo(models.User, {
                as: 'user',
                foreignKey: 'userId'
            });
        }
    }

    Comment.init({
        comment_text: {
            type: DataTypes.STRING,
            allowNull: false
        },
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
        modelName: 'Comment'
    });

    return Comment;
};