import { DataTypes } from "sequelize";

const withTimestamps = (modelDefinition) => {
    return {
        ...modelDefinition,
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
            allowNull: false,
        },
        updatedAt: {
            type: DataTypes.DATE,
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
            allowNull: false,
        }
    };
};

export default withTimestamps;
