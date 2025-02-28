const withTimestamps = (modelDefinition) => {
    return {
        ...modelDefinition,
        createdAt: {
            type: 'TIMESTAMP',
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP') // Database default, not Sequelize internal tracking
        },
        updatedAt: {
            type: 'TIMESTAMP',
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP') // Auto-update in DB layer
        }
    };
};

export default withTimestamps;