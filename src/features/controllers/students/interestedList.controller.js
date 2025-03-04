import InterestedListRepository from '../../repository/students/interestedList.repository.js';
import sendResponse from '../../../utils/logs/responseHelper.js';
import { controllerLogger } from '../../../utils/logger.js';

export default class InterestedListController {
    constructor() {
        this.interestedListRepository = new InterestedListRepository();
    }

    async addToInterestedList(req, res) {
        try {
            const studentId = req.user.userId;
            console.log("studentId", studentId);

            const { collegeId, courseId, type } = req.body;

            if (type !== 'college' && type !== 'course') {
                controllerLogger.warn(`Invalid type provided by student ${studentId}`);
                return sendResponse(res, 400, 'Invalid type, must be "college" or "course"', false);
            }

            if (type === 'college' && !collegeId) {
                controllerLogger.warn(`Missing collegeId for type "college" by student ${studentId}`);
                return sendResponse(res, 400, 'College ID is required for type "college"', false);
            }

            if (type === 'course' && !courseId) {
                controllerLogger.warn(`Missing courseId for type "course" by student ${studentId}`);
                return sendResponse(res, 400, 'Course ID is required for type "course"', false);
            }

            const favorite = await this.interestedListRepository.addToInterestedListData(studentId, collegeId, courseId, type);
            controllerLogger.info(`Added to interested list for student ${studentId}`, { studentId, favorite });

            return sendResponse(res, 201, 'Added to interested list successfully', true, favorite);
        } catch (error) {
            console.error("Failed to add to interested list for student:", error.message);

            controllerLogger.error(`Failed to add to interested list for student ${req.user.userId}`, { error: error.message });
            return sendResponse(res, 500, 'Failed to add to interested list', false, { error: error.message });
        }
    }

    async removeFromInterestedList(req, res) {
        try {
            const studentId = req.user.userId;
            const { id } = req.params;

            const removed = await this.interestedListRepository.removeFromInterestedListData(studentId, id);

            if (!removed) {
                controllerLogger.warn(`Attempt to remove non-existing item by student ${studentId}`, { studentId, id });
                return sendResponse(res, 404, 'Favorite item not found', false);
            }

            controllerLogger.info(`Removed item from interested list for student ${studentId}`, { studentId, id });
            return sendResponse(res, 200, 'Removed from interested list', true);
        } catch (error) {
            controllerLogger.error(`Failed to remove from interested list for student ${req.user.userId}`, { error: error.message });
            return sendResponse(res, 500, 'Failed to remove from interested list', false, { error: error.message });
        }
    }

    async getInterestedList(req, res) {
        try {
            const studentId = req.user.userId;

            const interestedList = await this.interestedListRepository.getInterestedListData(studentId);
            controllerLogger.info(`Fetched interested list for student ${studentId}`, { studentId, count: interestedList.length });

            return sendResponse(res, 200, 'Interested list fetched successfully', true, interestedList);
        } catch (error) {
            controllerLogger.error(`Failed to fetch interested list for student ${studentId}`, { error: error.message });
            return sendResponse(res, 500, 'Failed to fetch interested list', false, { error: error.message });
        }
    }

}