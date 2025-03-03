import { DataTypes } from "sequelize";
import { sequelize } from "../../../config/db.js";

const QualificationModel = sequelize.define("Qualification", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'users',  
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    },
    level: {
        type: DataTypes.STRING,
        allowNull: false, 
    },
    scoreType: {
        type: DataTypes.ENUM('marks', 'percentage', 'cgpa'),
        allowNull: false,
    },
    marksObtained: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    totalMarks: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    percentage: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    cgpa: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    institutionName: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    graduationYear: {
        type: DataTypes.INTEGER,
        allowNull: true,
    }
}, {
    tableName: "qualifications",
    freezeTableName: true,   
    timestamps: true,      
});

export default QualificationModel;
