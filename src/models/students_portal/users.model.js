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
    },
    role: {
        type: DataTypes.ENUM('Admin', 'Tutor', 'Student', 'Staff', 'Counselor'),
        allowNull: false,
        defaultValue: 'Student'
    }
}, {
    tableName: "users",
    freezeTableName: true,
    timestamps: true,
});

UsersModel.associate = (models) => {
    UsersModel.hasOne(models.UserProfile, { foreignKey: 'userId', as: 'profile' });
    UsersModel.hasMany(models.Qualification, { foreignKey: 'userId', as: 'qualifications' });
    UsersModel.hasMany(models.Test, { foreignKey: 'userId', as: 'tests' });
    UsersModel.hasOne(models.Passport, { foreignKey: 'userId', as: 'passport' });
};

export default UsersModel;
