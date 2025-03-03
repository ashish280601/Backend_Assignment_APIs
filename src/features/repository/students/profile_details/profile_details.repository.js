import UsersModel from "../../../../models/students_portal/users.model.js";
import UserProfileModel from "../../../../models/students_portal/student_profile_details/personal_details.model.js";
import QualificationModel from "../../../../models/students_portal/student_profile_details/qualification_details.model.js";
import TestModel from "../../../../models/students_portal/student_profile_details/test_details.model.js";
import PassportModel from "../../../../models/students_portal/student_profile_details/passport_details.model.js";
import { repositoryLogger } from "../../../../utils/logger.js";

export default class ProfileDetailsRepository {

    async findUserById(userId) {
        const functionName = 'findUserById';
        try {
            repositoryLogger.info(`${functionName} - Finding user by ID`, { userId });
            const user = await UsersModel.findByPk(userId);
            return user;
        } catch (error) {
            repositoryLogger.error(`${functionName} - Error finding user by ID`, { userId, error: error.message });
            throw error; // Pass error to controller
        }
    }
    
    async upsertProfileData(userId, personalDetails, qualifications, tests, passport, transaction) {
        const functionName = 'upsertProfileData';
    
        try {
            repositoryLogger.info(`${functionName} - Start upserting profile data`, { userId });
    
            const responseData = {};  // This will store only created/updated sections
            let actionType = 'updated';
            let createdNew = false;
    
            // --- Personal Details ---
            if (personalDetails) {
                if (personalDetails.id) {
                    const profile = await UserProfileModel.findOne({
                        where: { id: personalDetails.id, userId },
                        transaction
                    });
    
                    if (profile) {
                        await profile.update(personalDetails, { transaction });
                        responseData.personalDetails = profile.dataValues;
                        repositoryLogger.info(`${functionName} - Updated personal details`, { userId, profileId: personalDetails.id });
                    } else {
                        throw new Error(`Profile with id ${personalDetails.id} not found for user ${userId}`);
                    }
                } else {
                    const newProfile = await UserProfileModel.create({ userId, ...personalDetails }, { transaction });
                    responseData.personalDetails = newProfile.dataValues;
                    repositoryLogger.info(`${functionName} - Created new personal details`, { userId, profileId: newProfile.id });
                    createdNew = true;
                }
            }
    
            // --- Qualifications ---
            if (Array.isArray(qualifications)) {
                const qualificationResults = [];
    
                for (const qualification of qualifications) {
                    if (qualification.id) {
                        const existingQualification = await QualificationModel.findOne({
                            where: { id: qualification.id, userId },
                            transaction
                        });
    
                        if (existingQualification) {
                            await existingQualification.update(qualification, { transaction });
                            qualificationResults.push(existingQualification.dataValues);
                            repositoryLogger.info(`${functionName} - Updated qualification`, { userId, qualificationId: qualification.id });
                        } else {
                            throw new Error(`Qualification with id ${qualification.id} not found for user ${userId}`);
                        }
                    } else {
                        const newQualification = await QualificationModel.create({ userId, ...qualification }, { transaction });
                        qualificationResults.push(newQualification.dataValues);
                        repositoryLogger.info(`${functionName} - Created qualification`, { userId });
                        createdNew = true;
                    }
                }
    
                if (qualificationResults.length > 0) {
                    responseData.qualifications = qualificationResults;
                }
            }
    
            // --- Tests ---
            if (Array.isArray(tests)) {
                const testResults = [];
    
                for (const test of tests) {
                    if (test.id) {
                        const existingTest = await TestModel.findOne({
                            where: { id: test.id, userId },
                            transaction
                        });
    
                        if (existingTest) {
                            await existingTest.update(test, { transaction });
                            testResults.push(existingTest.dataValues);
                            repositoryLogger.info(`${functionName} - Updated test`, { userId, testId: test.id });
                        } else {
                            throw new Error(`Test with id ${test.id} not found for user ${userId}`);
                        }
                    } else {
                        const newTest = await TestModel.create({ userId, ...test }, { transaction });
                        testResults.push(newTest.dataValues);
                        repositoryLogger.info(`${functionName} - Created test`, { userId });
                        createdNew = true;
                    }
                }
    
                if (testResults.length > 0) {
                    responseData.tests = testResults;
                }
            }
    
            // --- Passport ---
            if (passport) {
                if (passport.id) {
                    const existingPassport = await PassportModel.findOne({
                        where: { id: passport.id, userId },
                        transaction
                    });
    
                    if (existingPassport) {
                        await existingPassport.update(passport, { transaction });
                        responseData.passport = existingPassport.dataValues;
                        repositoryLogger.info(`${functionName} - Updated passport`, { userId, passportId: passport.id });
                    } else {
                        throw new Error(`Passport with id ${passport.id} not found for user ${userId}`);
                    }
                } else {
                    const newPassport = await PassportModel.create({ userId, ...passport }, { transaction });
                    responseData.passport = newPassport.dataValues;
                    repositoryLogger.info(`${functionName} - Created passport`, { userId, passportId: newPassport.id });
                    createdNew = true;
                }
            }
    
            actionType = createdNew ? 'created' : 'updated';
    
            return { actionType, profileData: responseData };
    
        } catch (error) {
            repositoryLogger.error(`${functionName} - Error during profile upsert`, {
                userId,
                error: error.message
            });
            throw error;  // To trigger rollback in controller
        }
    } 

    async getProfileByUserId(userId) {
        const functionName = 'getProfileByUserId';
        try {
            repositoryLogger.info(`${functionName} - Retrieving profile by user ID`, { userId });

            const profile = await UsersModel.findByPk(userId, {
                include: [
                    { model: UserProfileModel, as: 'profile' },
                    { model: QualificationModel, as: 'qualifications' },
                    { model: TestModel, as: 'tests' },
                    { model: PassportModel, as: 'passport' }
                ]
            });
            
            repositoryLogger.info(`${functionName} - Profile retrieved`, { userId });
            return profile;
        } catch (error) {
            repositoryLogger.error(`${functionName} - Error retrieving profile`, { userId, error: error.message });
            throw error; // Pass error to controller
        }
    }

    async deleteAllProfileData(userId, transaction) {
        const functionName = 'deleteAllProfileData';
        try {
            repositoryLogger.info(`${functionName} - Deleting all profile data`, { userId });

            await UserProfileModel.destroy({ where: { userId }, transaction });
            await QualificationModel.destroy({ where: { userId }, transaction });
            await TestModel.destroy({ where: { userId }, transaction });
            await PassportModel.destroy({ where: { userId }, transaction });

            repositoryLogger.info(`${functionName} - All profile data deleted`, { userId });
        } catch (error) {
            repositoryLogger.error(`${functionName} - Error deleting all profile data`, { userId, error: error.message });
            throw error; // Pass error to controller
        }
    }

    async deleteSingleEntity(entityType, entityId, transaction) {
        const functionName = 'deleteSingleEntity';
        try {
            repositoryLogger.info(`${functionName} - Deleting single entity`, { entityType, entityId });

            const models = {
                qualification: QualificationModel,
                test: TestModel,
                passport: PassportModel,
            };

            const Model = models[entityType];

            if (!Model) {
                throw new Error(`Invalid entity type: ${entityType}`);
            }

            await Model.destroy({ where: { id: entityId }, transaction });
            repositoryLogger.info(`${functionName} - Deleted entity successfully`, { entityType, entityId });
        } catch (error) {
            repositoryLogger.error(`${functionName} - Error deleting entity`, { entityType, entityId, error: error.message });
            throw error; // Pass error to controller
        }
    }
}
