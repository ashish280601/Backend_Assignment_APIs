import { DataTypes } from 'sequelize';
import { sequelize } from '../../config/db.js';

const InterestedListModel = sequelize.define('InterestedList', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
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
        type: DataTypes.ENUM('college', 'course'),
        allowNull: false
    }
}, {
    tableName: 'interested_list',
    timestamps: true,
    freezeTableName: true
});

export default InterestedListModel;
