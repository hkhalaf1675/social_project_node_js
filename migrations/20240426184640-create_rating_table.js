'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Ratings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      likeCount: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      disLikeCount: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      postId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Posts",
          key: "id"
        },
        onDelete: 'cascade',
        onUpdate: 'cascade',
      },
      createdAt: {
        allowNull: true,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: true,
        type: Sequelize.DATE
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Ratings');
  }
};
