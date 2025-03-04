import CourseModel from '../../../models/courses/course.model.js';
import { repositoryLogger } from '../../../utils/logger.js';
export default class CourseRepository {

    async createCourseData(courseData) {
        try {
            repositoryLogger.info("Creating new course", { courseData });
            const course = await CourseModel.create(courseData);
            repositoryLogger.info(`Course created successfully with ID: ${course.id}`, { course });
            return course;
        } catch (error) {
            repositoryLogger.error("Error creating course", { error: error.message });
            throw error;
        }
    }

    async getAllCoursesData() {
        try {
            repositoryLogger.info("Fetching all courses");
            const courses = await CourseModel.findAll();
            repositoryLogger.info(`Fetched ${courses.length} courses`);
            return courses;
        } catch (error) {
            repositoryLogger.error("Error fetching all courses", { error: error.message });
            throw error;
        }
    }

    async getCoursesByCollegeData(collegeId) {
        try {
            repositoryLogger.info(`Fetching courses for college ID: ${collegeId}`);
            const courses = await CourseModel.findAll({ where: { collegeId } });
            return courses;
        } catch (error) {
            repositoryLogger.error("Error fetching courses", { error: error.message });
            throw error;
        }
    }

    async getCourseByIdData(courseId) {
        try {
            repositoryLogger.info(`Fetching course with ID: ${courseId}`);
            const course = await CourseModel.findByPk(courseId);
            if (!course) {
                repositoryLogger.warn(`Course not found with ID: ${courseId}`);
            }
            return course;
        } catch (error) {
            repositoryLogger.error("Error fetching course by ID", { error: error.message });
            throw error;
        }
    }

    async updateCourseData(courseId, updateData) {
        try {
            const course = await CourseModel.findByPk(courseId);
            if (!course) {
                repositoryLogger.warn(`Course not found for update with ID: ${courseId}`);
                return null;
            }

            await course.update(updateData);
            repositoryLogger.info(`Course updated successfully with ID: ${courseId}`, { updateData });
            return course;
        } catch (error) {
            repositoryLogger.error("Error updating course", { error: error.message });
            throw error;
        }
    }

    async deleteCourseData(courseId) {
        try {
            const course = await CourseModel.findByPk(courseId);
            if (!course) {
                repositoryLogger.warn(`Course not found for deletion with ID: ${courseId}`);
                return false;
            }

            await course.destroy();
            repositoryLogger.info(`Course deleted successfully with ID: ${courseId}`);
            return true;
        } catch (error) {
            repositoryLogger.error("Error deleting course", { error: error.message });
            throw error;
        }
    }
}

