'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('qualifications', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      userId: {
        type: Sequelize.UUID, allowNull: false,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      level: { type: Sequelize.STRING, allowNull: false }, // 12th, Bachelor, Master

      // Score type - marks/percentage/cgpa
      scoreType: { 
        type: Sequelize.ENUM('marks', 'percentage', 'cgpa'), 
        allowNull: false 
      },

      // Marks (optional, only if scoreType = 'marks')
      marksObtained: { type: Sequelize.FLOAT, allowNull: true },
      totalMarks: { type: Sequelize.FLOAT, allowNull: true },

      // Percentage (optional, only if scoreType = 'percentage')
      percentage: { type: Sequelize.FLOAT, allowNull: true },

      // CGPA (optional, only if scoreType = 'cgpa')
      cgpa: { type: Sequelize.FLOAT, allowNull: true },

      institutionName: { type: Sequelize.STRING, allowNull: true },
      graduationYear: { type: Sequelize.INTEGER, allowNull: true },
      createdAt: { type: Sequelize.DATE, defaultValue: Sequelize.fn('NOW') },
      updatedAt: { type: Sequelize.DATE, defaultValue: Sequelize.fn('NOW') }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('qualifications');
  }
};
