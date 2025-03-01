'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('users', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
            },
            email: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true,
            },
            password: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            otp: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            otpExpiresAt: {
                type: Sequelize.DATE,
                allowNull: true,
            },
            registrationType: {
                type: Sequelize.ENUM("Email", "Google", "Apple"),
                allowNull: false,
            },
            googleId: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            appleId: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            status: {
                type: Sequelize.ENUM('PENDING', 'REGISTERED'),
                allowNull: false,
                defaultValue: 'PENDING'
            },
            createdAt: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            updatedAt: {
                type: Sequelize.DATE,
                allowNull: false,
            }
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('users');
    }
};
