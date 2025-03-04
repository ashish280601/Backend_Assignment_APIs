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
    await queryInterface.createTable('courses', {
      id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true,
          allowNull: false
      },
      name: {
          type: Sequelize.STRING,
          allowNull: false
      },
      courseCode: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true
      },
      duration: {
          type: Sequelize.STRING,
          allowNull: false
      },
      tuitionFees: {
          type: Sequelize.INTEGER,
          allowNull: false
      },
      overview: {
          type: Sequelize.TEXT
      },
      eligibilityCriteria: {
          type: Sequelize.JSONB
      },
      courseFeatures: {
          type: Sequelize.JSONB
      },
      applicationDeadline: {
          type: Sequelize.DATE
      },
      modeOfStudy: {
          type: Sequelize.ENUM("Full-time", "Part-time", "Online", "Hybrid")
      },
      totalSeats: {
          type: Sequelize.INTEGER
      },
      accreditation: {
          type: Sequelize.STRING
      },
      faculty: {
          type: Sequelize.ARRAY(Sequelize.STRING)
      },
      careerOpportunities: {
          type: Sequelize.TEXT
      },
      courseBrochureUrl: {
          type: Sequelize.STRING
      },
      collegeId: {
          type: Sequelize.UUID,
          allowNull: false,
          references: {
              model: 'college_details',
              key: 'id'
          },
          onDelete: 'CASCADE'
      },
      createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
  });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('courses');
  }
};
