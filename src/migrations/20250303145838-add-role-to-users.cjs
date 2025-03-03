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
    await queryInterface.addColumn('users', 'role', {
      type: Sequelize.ENUM('Admin', 'Tutor', 'Student', 'Staff'),
      allowNull: false,
      defaultValue: 'Student'
  });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn('users', 'role');

        await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_users_role";');

  }
};
