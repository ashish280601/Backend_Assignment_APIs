import { DataTypes } from 'sequelize';
import { sequelize } from '../../../config/db.js';  

const CollegeApplicationModel = sequelize.define('CollegeApplication', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    studentId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    collegeId: {
        type: DataTypes.UUID,
        allowNull: true 
    },
    courseId: {
        type: DataTypes.UUID,
        allowNull: true 
    },
    type: {
        type: DataTypes.ENUM('College', 'Course'),
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('Pending', 'Under Review', 'Accepted', 'Rejected'),
        defaultValue: 'Pending'
    },
    appliedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'college_applications',
    timestamps: false,
    freezeTableName: true
});

export default CollegeApplicationModel;
