import InterestedListModel from '../../../models/students_portal/interestedList.model.js';
import CollegeModel from '../../../models/colleges/college.model.js';
import CourseModel from '../../../models/courses/course.model.js';
import { repositoryLogger } from '../../../utils/logger.js';

export default class InterestedListRepository {
    async addToInterestedListData(studentId, collegeId, courseId, type) {
        
        try {
            repositoryLogger.info(`Adding to interested list for student ${studentId}`, { studentId, collegeId, courseId, type });

            const favorite = await InterestedListModel.create({
                studentId,
                collegeId,
                courseId,
                type
            });

            repositoryLogger.info(`Added to interested list successfully`, { favorite });
            return favorite;
        } catch (error) {
            repositoryLogger.error(`Error adding to interested list for student ${studentId}`, { error: error.message });
            throw error;
        }
    }

    async removeFromInterestedListData(studentId, id) {
        try {
            repositoryLogger.info(`Removing item from interested list for student ${studentId}`, { studentId, id });

            const favorite = await InterestedListModel.findOne({ where: { id, studentId } });
            if (!favorite) {
                repositoryLogger.warn(`Interested list item not found for student ${studentId} and id ${id}`);
                return null;
            }

            await favorite.destroy();
            repositoryLogger.info(`Removed item from interested list successfully`, { id });
            return true;
        } catch (error) {
            repositoryLogger.error(`Error removing item from interested list for student ${studentId}`, { error: error.message });
            throw error;
        }
    }

    async getInterestedListData(studentId) {
        try {
            repositoryLogger.info(`Fetching interested list for student ${studentId}`, { studentId });

            const interestedList = await InterestedListModel.findAll({
                where: { studentId },
                include: [
                    {
                        model: CollegeModel,
                        as: 'college',
                        required: false
                    },
                    {
                        model: CourseModel,
                        as: 'course',
                        required: false
                    }
                ]
            });

            repositoryLogger.info(`Fetched interested list successfully`, { count: interestedList.length });
            return interestedList;
        } catch (error) {
            repositoryLogger.error(`Error fetching interested list for student ${studentId}`, { error: error.message });
            throw error;
        }
    }
}

