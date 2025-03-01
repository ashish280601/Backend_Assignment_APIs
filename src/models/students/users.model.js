// inbuilt imports package
import { DataTypes } from "sequelize";
import { sequelize } from "../../config/db.js";

const UsersModel = sequelize.define("Users", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    otp: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    otpExpiresAt: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    registrationType: {
        type: DataTypes.ENUM("Email", "Google", "Apple"),
        allowNull: false,
    },
    googleId: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    appleId: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    status: {
        type: DataTypes.ENUM('PENDING', 'REGISTERED'),
        allowNull: false,
        defaultValue: 'PENDING'
    }
}, {
    tableName: "users",
    freezeTableName: true,
    timestamps: true,
});

export default UsersModel;
