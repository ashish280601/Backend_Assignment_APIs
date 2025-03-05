import UsersModel from './students_portal/users.model.js';
import UserProfileModel from './students_portal/student_profile_details/personal_details.model.js';
import QualificationModel from './students_portal/student_profile_details/qualification_details.model.js'
import TestModel from './students_portal/student_profile_details/test_details.model.js';
import PassportModel from "./students_portal/student_profile_details/passport_details.model.js"
import CollegeModel from './colleges/college.model.js';
import CourseModel from './courses/course.model.js';
import InterestedListModel from './students_portal/interestedList.model.js';
import CounselorModel from './colleges/counselor/counselor.model.js';
import CounselorAvailabilityModel from './colleges/counselor/counselorAvailability.model.js';

export default function setupAssociations() {
    UsersModel.hasOne(UserProfileModel, { foreignKey: 'userId', as: 'profile' });
    UserProfileModel.belongsTo(UsersModel, { foreignKey: 'userId', as: 'user' });

    UsersModel.hasMany(QualificationModel, { foreignKey: 'userId', as: 'qualifications' });
    QualificationModel.belongsTo(UsersModel, { foreignKey: 'userId', as: 'user' });

    UsersModel.hasMany(TestModel, { foreignKey: 'userId', as: 'tests' });
    TestModel.belongsTo(UsersModel, { foreignKey: 'userId', as: 'user' });

    UsersModel.hasOne(PassportModel, { foreignKey: 'userId', as: 'passport' });
    PassportModel.belongsTo(UsersModel, { foreignKey: 'userId', as: 'user' });

    // Added interested list associations
    InterestedListModel.belongsTo(UsersModel, { foreignKey: 'studentId', as: 'user' });
    InterestedListModel.belongsTo(CollegeModel, { foreignKey: 'collegeId', as: 'college' });
    InterestedListModel.belongsTo(CourseModel, { foreignKey: 'courseId', as: 'course' });

    UsersModel.hasMany(InterestedListModel, { foreignKey: 'studentId', as: 'interestedList' });

    CounselorModel.hasMany(CounselorAvailabilityModel, { foreignKey: 'counselorId', as: 'availability' });
    CounselorAvailabilityModel.belongsTo(CounselorModel, { foreignKey: 'counselorId', as: 'counselor' });
}
