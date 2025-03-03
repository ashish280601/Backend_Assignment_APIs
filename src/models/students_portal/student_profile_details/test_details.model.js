import { DataTypes } from "sequelize";
import { sequelize } from "../../../config/db.js";

const TestModel = sequelize.define("Test", {
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
    testType: {
        type: DataTypes.ENUM('IELTS', 'PTE', 'GMAT', 'SAT', 'DUOLINGO'),
        allowNull: false
    },
    testDate: {
        type: DataTypes.DATE,
        allowNull: true
    },
    // IELTS Specific Fields
    ieltsListening: { type: DataTypes.FLOAT, allowNull: true },
    ieltsReading: { type: DataTypes.FLOAT, allowNull: true },
    ieltsWriting: { type: DataTypes.FLOAT, allowNull: true },
    ieltsSpeaking: { type: DataTypes.FLOAT, allowNull: true },
    ieltsOverall: { type: DataTypes.FLOAT, allowNull: true },

    // PTE Specific Fields
    pteOverall: { type: DataTypes.FLOAT, allowNull: true },
    pteListening: { type: DataTypes.FLOAT, allowNull: true },
    pteReading: { type: DataTypes.FLOAT, allowNull: true },
    pteSpeaking: { type: DataTypes.FLOAT, allowNull: true },
    pteWriting: { type: DataTypes.FLOAT, allowNull: true },

    // GMAT Specific Fields
    gmatQuantitative: { type: DataTypes.FLOAT, allowNull: true },
    gmatVerbal: { type: DataTypes.FLOAT, allowNull: true },
    gmatIntegratedReasoning: { type: DataTypes.FLOAT, allowNull: true },
    gmatAnalyticalWriting: { type: DataTypes.FLOAT, allowNull: true },
    gmatTotalScore: { type: DataTypes.FLOAT, allowNull: true },

    // SAT Specific Fields
    satMath: { type: DataTypes.FLOAT, allowNull: true },
    satReading: { type: DataTypes.FLOAT, allowNull: true },
    satWriting: { type: DataTypes.FLOAT, allowNull: true },
    satTotalScore: { type: DataTypes.FLOAT, allowNull: true },

    // Duolingo Specific Fields
    duolingoOverallScore: { type: DataTypes.FLOAT, allowNull: true }
}, {
    tableName: "tests",
    freezeTableName: true,
    timestamps: true
});

export default TestModel;
