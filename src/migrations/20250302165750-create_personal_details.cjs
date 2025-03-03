'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.createTable('userProfile', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      userId: { 
        type: Sequelize.UUID, 
        allowNull: false,
        references: {
          model: 'users',  
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      name: { type: Sequelize.STRING, allowNull: false },
      email: { type: Sequelize.STRING, allowNull: false, unique: true },
      contact: { type: Sequelize.STRING, allowNull: true },
      address: { type: Sequelize.STRING, allowNull: true },
      dateOfBirth: { type: Sequelize.DATE, allowNull: true },
      createdAt: { type: Sequelize.DATE, defaultValue: Sequelize.fn('NOW') },
      updatedAt: { type: Sequelize.DATE, defaultValue: Sequelize.fn('NOW') }
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('userProfile');
  }
};
