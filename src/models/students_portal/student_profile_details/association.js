import UsersModel from '../users.model.js';
import UserProfileModel from './personal_details.model.js';
import QualificationModel from './qualification_details.model.js'
import TestModel from './test_details.model.js';
import PassportModel from "./passport_details.model.js"

export default function setupAssociations() {
    UsersModel.hasOne(UserProfileModel, { foreignKey: 'userId', as: 'profile' });
    UserProfileModel.belongsTo(UsersModel, { foreignKey: 'userId', as: 'user' });

    UsersModel.hasMany(QualificationModel, { foreignKey: 'userId', as: 'qualifications' });
    QualificationModel.belongsTo(UsersModel, { foreignKey: 'userId', as: 'user' });

    UsersModel.hasMany(TestModel, { foreignKey: 'userId', as: 'tests' });
    TestModel.belongsTo(UsersModel, { foreignKey: 'userId', as: 'user' });

    UsersModel.hasOne(PassportModel, { foreignKey: 'userId', as: 'passport' });
    PassportModel.belongsTo(UsersModel, { foreignKey: 'userId', as: 'user' });
}
