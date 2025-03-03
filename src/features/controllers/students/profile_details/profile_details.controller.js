import { sequelize } from "../../../../config/db.js";
import { controllerLogger } from "../../../../utils/logger.js";
import ProfileDetailsRepository from "../../../repository/students/profile_details/profile_details.repository.js";

export default class ProfileDetailsController {
    constructor() {
        this.profileDetailsRepository = new ProfileDetailsRepository();
    }

    // async upsertProfile(req, res) {
    //     const functionName = 'upsertProfile';
    //     const { personalDetails, qualifications, tests, passport } = req.body;
    //     const userId = req.userId;

    //     console.log("personal-details", personalDetails);

    //     if (!userId) {
    //         controllerLogger.error(functionName, 'Missing userId in request');
    //         return res.status(400).json({
    //             data: { status: false, code: 400, message: 'Missing userId', response: null }
    //         });
    //     }

    //     const transaction = await sequelize.transaction();

    //     try {
    //         controllerLogger.info(functionName, 'Upsert profile request received', { userId });

    //         if (personalDetails) {
    //             if (!personalDetails?.name || !personalDetails?.contact || !personalDetails?.email) {
    //                 await transaction.rollback();
    //                 const message = 'Personal details are incomplete';
    //                 controllerLogger.info(functionName, message, { userId, personalDetails });
    //                 return res.status(400).json({
    //                     data: { status: false, code: 400, message, response: null }
    //                 });
    //             }
    //         }

    //         controllerLogger.info(functionName, 'Final payload before upsertProfileData', {
    //             userId,
    //             personalDetails,
    //             qualifications,
    //             tests,
    //             passport
    //         });

    //         const profileData = await this.profileDetailsRepository.upsertProfileData(
    //             userId,
    //             personalDetails,
    //             qualifications,
    //             tests,
    //             passport,
    //             transaction
    //         );

    //         await transaction.commit();

    //         const message = 'Profile saved successfully';
    //         controllerLogger.info(functionName, message, { userId });

    //         res.status(200).json({
    //             data: { status: true, code: 200, message, response: profileData }
    //         });

    //     } catch (error) {
    //         await transaction.rollback();
    //         controllerLogger.error(functionName, 'Error saving profile', error);
    //         res.status(500).json({
    //             data: { status: false, code: 500, message: 'Error saving profile', error: error.message }
    //         });
    //     }
    // }
    async upsertProfile(req, res) {
        const functionName = 'upsertProfile';
        const { personalDetails, qualifications, tests, passport } = req.body;
        const { userId } = req.user;

        if (!userId) {
            controllerLogger.error(functionName, 'Missing userId in request');
            return res.status(400).json({
                data: { status: false, code: 400, message: 'Missing userId', response: null }
            });
        }

        const transaction = await sequelize.transaction();

        try {
            controllerLogger.info(functionName, 'Upsert profile request received', { userId });

            const { actionType, profileData } = await this.profileDetailsRepository.upsertProfileData(
                userId,
                personalDetails,
                qualifications,
                tests,
                passport,
                transaction
            );

            await transaction.commit();

            res.status(200).json({
                data: {
                    status: true,
                    code: 200,
                    message: actionType === 'created' ? 'Profile created successfully' : 'Profile updated successfully',
                    response: profileData
                }
            });

        } catch (error) {
            await transaction.rollback();
            controllerLogger.error(functionName, 'Error saving profile', error);
            res.status(500).json({
                data: { status: false, code: 500, message: 'Error saving profile', error: error.message }
            });
        }
    }





    async getProfile(req, res) {
        const functionName = 'getProfile';
        const { userId } = req.user;

        try {
            controllerLogger.info(functionName, 'Get profile request received', { userId });

            const profile = await this.profileDetailsRepository.getProfileByUserId(userId);

            if (!profile) {
                const message = 'Profile not found';
                controllerLogger.info(functionName, message, { userId });
                return res.status(404).json({ data: { status: false, code: 404, message, response: null } });
            }
            const responseData = {
                profile: profile.profile,
                qualifications: profile.qualifications,
                tests: profile.tests,
                passport: profile.passport
            };

            controllerLogger.info(functionName, 'Profile retrieved successfully', { userId });

            res.status(200).json({ data: { status: true, code: 200, message: 'Profile retrieved successfully', response: responseData } });

        } catch (error) {
            controllerLogger.error(functionName, 'Error fetching profile', { error: error.message });
            res.status(500).json({ data: { status: false, code: 500, message: 'Error fetching profile', error: error.message } });
        }
    }

    async deleteProfile(req, res) {
        const functionName = 'deleteProfile';
        const { userId } = req.user;
        const { entityType, entityId } = req.query;

        const transaction = await sequelize.transaction();

        try {
            controllerLogger.info(functionName, 'Delete profile request received', { userId, entityType, entityId });

            const user = await this.profileDetailsRepository.findUserById(userId);

            if (!user) {
                await transaction.rollback();
                const message = 'User profile not found';
                controllerLogger.info(functionName, message, { userId });
                return res.status(404).json({ data: { status: false, code: 404, message, response: null } });
            }

            if (entityType && entityId) {
                await this.profileDetailsRepository.deleteSingleEntity(entityType, entityId, transaction);
                await transaction.commit();

                const message = `${entityType} with ID ${entityId} deleted successfully`;
                controllerLogger.info(functionName, message, { userId, entityType, entityId });

                return res.status(200).json({ data: { status: true, code: 200, message, response: null } });

            } else {
                await this.profileDetailsRepository.deleteAllProfileData(userId, transaction);
                await transaction.commit();

                const message = 'All profile data deleted successfully';
                controllerLogger.info(functionName, message, { userId });

                return res.status(200).json({ data: { status: true, code: 200, message, response: null } });
            }

        } catch (error) {
            await transaction.rollback();
            controllerLogger.error(functionName, 'Error deleting profile', { error: error.message });
            return res.status(500).json({ data: { status: false, code: 500, message: 'Error deleting profile', error: error.message } });
        }
    }

}
