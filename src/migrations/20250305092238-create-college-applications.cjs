'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.createTable('college_applications', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true
      },
      studentId: {
        type: Sequelize.UUID,
        allowNull: false
      },
      collegeId: {
        type: Sequelize.UUID,
        allowNull: true
      },
      courseId: {
        type: Sequelize.UUID,
        allowNull: true
      },
      type: {
        type: Sequelize.ENUM('College', 'Course'),
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM('Pending', 'Under Review', 'Accepted', 'Rejected'),
        defaultValue: 'Pending',
        allowNull: false
      },
      appliedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: false
      }
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('college_applications');
  }
};
