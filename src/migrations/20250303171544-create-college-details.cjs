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
    await queryInterface.createTable("college_details", {
      id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          allowNull: false,
          primaryKey: true,
      },
      name: {
          type: Sequelize.STRING,
          allowNull: false,
      },
      history: {
          type: Sequelize.TEXT,
          allowNull: true,
      },
      vision: {
          type: Sequelize.TEXT,
          allowNull: true,
      },
      rankings: {
          type: Sequelize.JSONB,
          allowNull: false,
      },
      availableIntakes: {
          type: Sequelize.JSONB,
          allowNull: false,
      },
      coursesOffered: {
          type: Sequelize.JSONB,
          allowNull: false,
      },
      contactEmail: {
          type: Sequelize.STRING,
          allowNull: false,
          validate: {
              isEmail: true,
          },
      },
      contactPhone: {
          type: Sequelize.STRING,
          allowNull: false,
      },
      website: {
          type: Sequelize.STRING,
          allowNull: true,
      },
      address: {
          type: Sequelize.JSONB,
          allowNull: false,
      },
      accreditation: {
          type: Sequelize.STRING,
          allowNull: true,
      },
      establishedYear: {
          type: Sequelize.INTEGER,
          allowNull: false,
      },
      logoUrl: {
          type: Sequelize.STRING,
          allowNull: true,
      },
      mediaLibrary: {
          type: Sequelize.JSONB,
          allowNull: true,
      },
      applicationFee: {
          type: Sequelize.INTEGER,
          allowNull: false,
      },
      eligibilityCriteria: {
          type: Sequelize.JSONB,
          allowNull: false,
      },
      features: {
          type: Sequelize.JSONB,
          allowNull: true,
      },
      createdAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.fn('NOW')
      },
      updatedAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.fn('NOW')
      },
  });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable("college_details");
  }
};
