// inbuilt import
import { Op } from "sequelize";

// custom import
import CollegeModel from "../../../models/colleges/college.model.js";
import CourseModel from "../../../models/courses/course.model.js";
import CollegeApplicationModel from "../../../models/colleges/college_applications/collegeApplications.model.js";
import { repositoryLogger } from "../../../utils/logger.js";

export default class CollegeRepository {
    // write your code logic here
    async createCollege(data, files) {

        try {
            // Initialize mediaLibrary if missing
            if (!data.mediaLibrary) {
                data.mediaLibrary = { images: [], videos: [], documents: [] };
            }

            if (files.logo && files.logo.length > 0) {
                data.logoUrl = `/uploads/logos/${files.logo[0].filename}`;
            }

            if (files.images && files.images.length > 0) {
                data.mediaLibrary.images = files.images.map(file => `/uploads/images/${file.filename}`);
            }

            if (files.videos && files.videos.length > 0) {
                data.mediaLibrary.videos = files.videos.map(file => `/uploads/videos/${file.filename}`);
            }

            if (files.documents && files.documents.length > 0) {
                data.mediaLibrary.documents = files.documents.map(file => `/uploads/documents/${file.filename}`);
            }

            // Save to MongoDB
            const college = await CollegeModel.create(data);
            repositoryLogger.info(`College created with ID: ${college.id}`);
            return college;
        } catch (error) {
            repositoryLogger.error(`Error creating college: ${error.message}`);
            throw error;
        }
    }

    async getAllColleges() {
        try {
            const colleges = await CollegeModel.findAll();
            repositoryLogger.info(`Fetched all colleges successfully.`);
            return colleges;
        } catch (error) {
            repositoryLogger.error(`Failed to fetch colleges: ${error.message}`);
            throw error;
        }
    };

    async getCollegeById(id) {
        try {
            const college = await CollegeModel.findByPk(id);
            if (!college) {
                repositoryLogger.warn(`College not found with id: ${id}`);
                return null;  // Let controller decide how to respond
            }
            repositoryLogger.info(`Fetched college successfully with id: ${id}`);
            return college;
        } catch (error) {
            repositoryLogger.error(`Failed to fetch college by id ${id}: ${error.message}`);
            throw error;
        }
    };

    async updateCollege(id, data, files) {
        try {
            const college = await CollegeModel.findByPk(id);
            if (!college) return null;

            // Initialize mediaLibrary if it doesn't exist in DB
            let mediaLibrary = college.mediaLibrary || { images: [], videos: [], documents: [] };

            // Handle logo - overwrite existing logo if new logo uploaded
            if (files.logo && files.logo.length > 0) {
                data.logoUrl = `/uploads/logos/${files.logo[0].filename}`;
            }

            // Handle images - append new images to existing images array
            if (files.images && files.images.length > 0) {
                const newImages = files.images.map(file => `/uploads/images/${file.filename}`);
                mediaLibrary.images = [...mediaLibrary.images, ...newImages];
            }

            // Handle videos - append new videos to existing videos array
            if (files.videos && files.videos.length > 0) {
                const newVideos = files.videos.map(file => `/uploads/videos/${file.filename}`);
                mediaLibrary.videos = [...mediaLibrary.videos, ...newVideos];
            }

            // Handle documents - append new documents to existing documents array
            if (files.documents && files.documents.length > 0) {
                const newDocuments = files.documents.map(file => `/uploads/documents/${file.filename}`);
                mediaLibrary.documents = [...mediaLibrary.documents, ...newDocuments];
            }

            // Include updated mediaLibrary in the update data
            data.mediaLibrary = mediaLibrary;

            // Perform the update
            await college.update(data);

            repositoryLogger.info(`College updated with ID: ${id}`);
            return college;
        } catch (error) {
            repositoryLogger.error(`Error updating college: ${error.message}`);
            throw error;
        }
    }

    async deleteCollege(id) {
        try {
            const college = await CollegeModel.findByPk(id);
            if (!college) {
                repositoryLogger.warn(`College not found with id: ${id}`);
                return null;  // Let controller decide how to respond
            }

            await college.destroy();
            repositoryLogger.info(`College deleted successfully with id: ${id}`);
            return true;
        } catch (error) {
            repositoryLogger.error(`Failed to delete college with id ${id}: ${error.message}`);
            throw error;
        }
    };

    async getFilteredCollegesWithCourses(filters) {
        try {
            repositoryLogger.info("Applying filters for colleges and courses", { filters });

            const whereCollege = {};
            const whereCourse = {};

            // College Filters
            if (filters.collegeName) {
                whereCollege.name = { [Op.iLike]: `%${filters.collegeName}%` };
            }

            if (filters.location) {
                whereCollege["address.city"] = { [Op.iLike]: `%${filters.location}%` };
            }

            if (filters.establishedYear) {
                whereCollege.establishedYear = filters.establishedYear;
            }

            if (filters.accreditation) {
                whereCollege.accreditation = { [Op.iLike]: `%${filters.accreditation}%` };
            }

            if (filters.contactEmail) {
                whereCollege.contactEmail = { [Op.iLike]: `%${filters.contactEmail}%` };
            }

            // Course Filters
            if (filters.courseName) {
                whereCourse.name = { [Op.iLike]: `%${filters.courseName}%` };
            }

            if (filters.modeOfStudy) {
                whereCourse.modeOfStudy = filters.modeOfStudy;
            }

            if (filters.minFees !== null && filters.maxFees !== null) {
                whereCourse.tuitionFees = { [Op.between]: [filters.minFees, filters.maxFees] };
            } else if (filters.minFees !== null) {
                whereCourse.tuitionFees = { [Op.gte]: filters.minFees };
            } else if (filters.maxFees !== null) {
                whereCourse.tuitionFees = { [Op.lte]: filters.maxFees };
            }

            if (filters.applicationDeadlineFrom && filters.applicationDeadlineTo) {
                whereCourse.applicationDeadline = {
                    [Op.between]: [filters.applicationDeadlineFrom, filters.applicationDeadlineTo]
                };
            }

            if (filters.academicQualifications) {
                whereCourse["eligibilityCriteria.academicQualifications"] = {
                    [Op.iLike]: `%${filters.academicQualifications}%`
                };
            }

            if (filters.entranceTest) {
                whereCourse["eligibilityCriteria.entranceTest"] = {
                    [Op.iLike]: `%${filters.entranceTest}%`
                };
            }

            const colleges = await CollegeModel.findAll({
                where: whereCollege,
                include: [
                    {
                        model: CourseModel,
                        as: "courses",
                        where: whereCourse,
                        required: true
                    }
                ]
            });

            repositoryLogger.info(`Fetched ${colleges.length} filtered colleges with courses.`);
            return colleges;
        } catch (error) {
            repositoryLogger.error("Error fetching filtered colleges with courses", { error: error.message });
            throw error;
        }
    }

}

export class CollegeApplicationRepository extends CollegeRepository{

    async createApplicationData(studentId, collegeId, courseId, type) {
        try {
            repositoryLogger.info(`Creating ${type} application for student ${studentId} - College: ${collegeId}, Course: ${courseId}`);
            const application = await CollegeApplicationModel.create({
                studentId,
                collegeId,
                courseId,
                type,
                status: 'Pending'
            });
            repositoryLogger.info(`Successfully created ${type} application with ID: ${application.id}`);
            return application;
        } catch (error) {
            repositoryLogger.error(`Error creating ${type} application for student ${studentId}`, { error: error.message });
            throw error;
        }
    }

    async updateApplicationStatusData(applicationId, status) {
        try {
            repositoryLogger.info(`Updating application status for application ID: ${applicationId} to ${status}`);
            const application = await CollegeApplicationModel.findByPk(applicationId);
            if (!application) {
                repositoryLogger.warn(`Application not found with ID: ${applicationId}`);
                throw new Error('APPLICATION_NOT_FOUND');
            }
            application.status = status;
            await application.save();
            repositoryLogger.info(`Successfully updated application ID: ${applicationId} to status: ${status}`);
            return application;
        } catch (error) {
            repositoryLogger.error(`Error updating application status for application ID: ${applicationId}`, { error: error.message });
            throw error;
        }
    }

    async findCollegeApplicationData(studentId, collegeId) {
        try {
            repositoryLogger.info(`Fetching college application for student ${studentId} in college ${collegeId}`);
            const application = await CollegeApplicationModel.findOne({
                where: { studentId, collegeId, type: 'College' }
            });
            if (application) {
                repositoryLogger.info(`College application found for student ${studentId} in college ${collegeId}`);
            } else {
                repositoryLogger.info(`No college application found for student ${studentId} in college ${collegeId}`);
            }
            return application;
        } catch (error) {
            repositoryLogger.error(`Error fetching college application for student ${studentId} in college ${collegeId}`, { error: error.message });
            throw error;
        }
    }

    async findCollegeById(collegeId) {
        try {
            return await CollegeModel.findOne({ where: { id: collegeId } });
        } catch (error) {
            repositoryLogger.error(`Error fetching college details for ID ${collegeId}`, { error: error.message });
            throw error;
        }
    }

    async findCourseById(courseId) {
        try {
            repositoryLogger.info(`Fetching course with ID: ${courseId}`);
            const course = await CourseModel.findOne({
                where: {
                    id: courseId
                }
            });

            if (course) {
                repositoryLogger.info(`Course found with ID: ${courseId}`);
            } else {
                repositoryLogger.warn(`No course found with ID: ${courseId}`);
            }
            return course;
        } catch (error) {
            repositoryLogger.error(`Error fetching course with ID: ${courseId}`, { error: error.message });
            throw error;
        }
    }

    async findCourseApplicationData(studentId, courseId) {
        try {
            repositoryLogger.info(`Fetching course application for student ${studentId} in course ${courseId}`);
            const application = await CollegeApplicationModel.findOne({
                where: { studentId, courseId, type: 'Course' }
            });
            if (application) {
                repositoryLogger.info(`Course application found for student ${studentId} in course ${courseId}`);
            } else {
                repositoryLogger.info(`No course application found for student ${studentId} in course ${courseId}`);
            }
            return application;
        } catch (error) {
            repositoryLogger.error(`Error fetching course application for student ${studentId} in course ${courseId}`, { error: error.message });
            throw error;
        }
    }

    async getApplicationsByStudentData(studentId) {
        try {
            repositoryLogger.info(`Fetching all applications for student ${studentId}`);
            const applications = await CollegeApplicationModel.findAll({
                where: { studentId }
            });
            repositoryLogger.info(`Found ${applications.length} applications for student ${studentId}`);
            return applications;
        } catch (error) {
            repositoryLogger.error(`Error fetching applications for student ${studentId}`, { error: error.message });
            throw error;
        }
    }
}