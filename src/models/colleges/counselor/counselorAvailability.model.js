import { DataTypes } from 'sequelize';
import { sequelize } from '../../../config/db.js';

const CounselorAvailabilityModel = sequelize.define('CounselorAvailability', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    counselorId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    date: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    day: {
        type: DataTypes.STRING,  // Example: "Monday", "Tuesday"
        allowNull: false
    },
    startTime: {
        type: DataTypes.TIME,
        allowNull: false
    },
    endTime: {
        type: DataTypes.TIME,
        allowNull: false
    }
}, {
    tableName: 'counselor_availabilities',
    timestamps: true,
    freezeTableName: true
});


export default CounselorAvailabilityModel;
