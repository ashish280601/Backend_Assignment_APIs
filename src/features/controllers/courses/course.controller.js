import { controllerLogger } from "../../../utils/logger.js";
import sendResponse from "../../../utils/logs/responseHelper.js";
import CourseRepository from "../../repository/courses/course.repository.js";

export default class CourseController {
    constructor() {
        this.courseRepository = new CourseRepository();
    }

    async createCourse(req, res) {
        try {
            const { collegeId } = req.params;
            const courseData = req.body;

            if (!collegeId) {
                controllerLogger.warn("Create course failed: Missing collegeId");
                return sendResponse(res, 400, "College ID is required.", false);
            }

            courseData.collegeId = collegeId;

            const course = await this.courseRepository.createCourseData(courseData);

            controllerLogger.info(`Course created successfully for college ID: ${collegeId}`, { course });

            return sendResponse(res, 201, "Course created successfully", true, course);

        } catch (error) {
            controllerLogger.error(`Failed to create course: ${error.message}`, { error });

            if (error.statusCode === 409) {
                return sendResponse(res, 409, error.message, false);
            }

            return sendResponse(res, 500, "Failed to create course", false, { error: error.message });
        }
    }

    async getAllCourses(req, res) {
        try {
            const courses = await this.courseRepository.getAllCoursesData();

            controllerLogger.info("Fetched all courses successfully", { count: courses.length });

            return sendResponse(res, 200, "All courses fetched successfully", true, courses);
        } catch (error) {
            controllerLogger.error(`Failed to fetch all courses: ${error.message}`, { error });
            return sendResponse(res, 500, "Failed to fetch courses", false, { error: error.message });
        }
    }


    async getCourses(req, res) {
        try {
            const { collegeId } = req.params;

            if (!collegeId) {
                controllerLogger.warn("Get courses failed: Missing collegeId");
                return sendResponse(res, 400, "College ID is required.", false);
            }
            const courses = await this.courseRepository.getCoursesByCollegeData(collegeId);

            return sendResponse(res, 200, "Courses fetched successfully", true, courses);
        } catch (error) {
            controllerLogger.error(`Failed to fetch courses: ${error.message}`, { error });
            return sendResponse(res, 500, "Failed to fetch courses", false, { error: error.message });
        }
    }

    async getCourseById(req, res) {
        try {
            const { courseId } = req.params;

            const course = await this.courseRepository.getCourseByIdData(courseId);
            if (!course) {
                return sendResponse(res, 404, "Course not found", false);
            }

            return sendResponse(res, 200, "Course fetched successfully", true, course);
        } catch (error) {
            controllerLogger.error(`Failed to fetch course: ${error.message}`, { error });
            return sendResponse(res, 500, "Failed to fetch course", false, { error: error.message });
        }
    }

    async updateCourse(req, res) {
        try {
            const { courseId } = req.params;
            const updateData = req.body;

            const course = await this.courseRepository.getCourseByIdData(courseId);
            if (!course) {
                return sendResponse(res, 404, "Course not found", false);
            }

            const updatedCourse = await this.courseRepository.updateCourseData(courseId, updateData);
            return sendResponse(res, 200, "Course updated successfully", true, updatedCourse);
        } catch (error) {
            controllerLogger.error(`Failed to update course: ${error.message}`, { error });
            return sendResponse(res, 500, "Failed to update course", false, { error: error.message });
        }
    }

    async deleteCourse(req, res) {
        try {
            const { courseId } = req.params;

            const course = await this.courseRepository.getCourseByIdData(courseId);
            if (!course) {
                return sendResponse(res, 404, "Course not found", false);
            }

            await this.courseRepository.deleteCourseData(courseId);
            return sendResponse(res, 200, "Course deleted successfully", true);
        } catch (error) {
            controllerLogger.error(`Failed to delete course: ${error.message}`, { error });
            return sendResponse(res, 500, "Failed to delete course", false, { error: error.message });
        }
    }
}

