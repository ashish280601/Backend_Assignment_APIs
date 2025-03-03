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
    await queryInterface.createTable('tests', {
      id: { 
        type: Sequelize.INTEGER, 
        primaryKey: true, 
        autoIncrement: true 
      },
      userId: { 
        type: Sequelize.UUID, 
        allowNull: false, 
        references: { model: 'users', key: 'id' }, 
        onUpdate: 'CASCADE', 
        onDelete: 'CASCADE' 
      },
      testType: { 
        type: Sequelize.ENUM('IELTS', 'PTE', 'GMAT', 'SAT', 'DUOLINGO'), 
        allowNull: false 
      },
      // Common Fields
      testDate: { type: Sequelize.DATE, allowNull: true },

      // IELTS Specific Fields
      ieltsListening: { type: Sequelize.FLOAT, allowNull: true },
      ieltsReading: { type: Sequelize.FLOAT, allowNull: true },
      ieltsWriting: { type: Sequelize.FLOAT, allowNull: true },
      ieltsSpeaking: { type: Sequelize.FLOAT, allowNull: true },
      ieltsOverall: { type: Sequelize.FLOAT, allowNull: true },

      // PTE Specific Fields
      pteOverall: { type: Sequelize.FLOAT, allowNull: true },
      pteListening: { type: Sequelize.FLOAT, allowNull: true },
      pteReading: { type: Sequelize.FLOAT, allowNull: true },
      pteSpeaking: { type: Sequelize.FLOAT, allowNull: true },
      pteWriting: { type: Sequelize.FLOAT, allowNull: true },

      // GMAT Specific Fields
      gmatQuantitative: { type: Sequelize.FLOAT, allowNull: true },
      gmatVerbal: { type: Sequelize.FLOAT, allowNull: true },
      gmatIntegratedReasoning: { type: Sequelize.FLOAT, allowNull: true },
      gmatAnalyticalWriting: { type: Sequelize.FLOAT, allowNull: true },
      gmatTotalScore: { type: Sequelize.FLOAT, allowNull: true },

      // SAT Specific Fields
      satMath: { type: Sequelize.FLOAT, allowNull: true },
      satReading: { type: Sequelize.FLOAT, allowNull: true },
      satWriting: { type: Sequelize.FLOAT, allowNull: true },
      satTotalScore: { type: Sequelize.FLOAT, allowNull: true },

      // Duolingo Specific Fields
      duolingoOverallScore: { type: Sequelize.FLOAT, allowNull: true },

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
    await queryInterface.dropTable('tests');
  }
};
