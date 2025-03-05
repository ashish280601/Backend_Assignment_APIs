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
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.sequelize.query(`
          DO $$ 
          BEGIN
              IF NOT EXISTS (
                  SELECT 1
                  FROM pg_type t
                  JOIN pg_enum e ON t.oid = e.enumtypid
                  WHERE t.typname = 'enum_users_role' AND e.enumlabel = 'Counselor'
              ) THEN
                  ALTER TYPE "enum_users_role" ADD VALUE 'Counselor';
              END IF;
          END $$;
      `, { transaction });
  });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    console.warn('Down migration does not remove ENUM values in PostgreSQL.');
  }
};
