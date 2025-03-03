import { DataTypes } from "sequelize";
import { sequelize } from "../../../config/db.js";

const PassportModel = sequelize.define("Passport", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'users',  // Reference to users table
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    },
    passportNumber: {
        type: DataTypes.STRING,
        allowNull: false
    },
    issuingCountry: {
        type: DataTypes.STRING,
        allowNull: true
    },
    expiryDate: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    tableName: "passports",
    freezeTableName: true,
    timestamps: true // Automatically manages createdAt and updatedAt
});

export default PassportModel;
