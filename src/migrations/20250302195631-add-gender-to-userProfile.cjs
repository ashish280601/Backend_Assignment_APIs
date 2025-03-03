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
    await queryInterface.addColumn('userProfile', 'gender', {
      type: Sequelize.ENUM('Male', 'Female', 'Other'),
      allowNull: true,
      defaultValue: null
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn('userProfile', 'gender');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_userProfile_gender";');
  }
};
