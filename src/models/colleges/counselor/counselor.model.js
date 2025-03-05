import { DataTypes } from 'sequelize';
import { sequelize } from '../../../config/db.js';

const CounselorModel = sequelize.define('Counselor', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    collegeId: { type: DataTypes.UUID, allowNull: false },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    phone: { type: DataTypes.STRING },
    experience: { type: DataTypes.INTEGER, allowNull: false },
    qualification: { type: DataTypes.STRING, allowNull: false },
    specialization: { type: DataTypes.STRING },
}, {
    tableName: 'counselors',
    timestamps: true
});

export default CounselorModel;
