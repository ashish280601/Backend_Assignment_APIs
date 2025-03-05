import CollegeRepository, { CollegeApplicationRepository } from "../../repository/colleges/college.repository.js";
import { controllerLogger } from "../../../utils/logger.js";
import sendResponse from "../../../utils/responseHelper.js";
import ProfileDetailsRepository from "../../repository/students/profile_details/profile_details.repository.js";

export default class CollegeController {
    constructor() {
        this.collegeRepository = new CollegeRepository();
    }

    async createCollege(req, res) {

        try {
            const {
                name,
                history,
                vision,
                contactEmail,
                contactPhone,
                website,
                accreditation,
                establishedYear,
                applicationFee
            } = req.body;

            const parseJSON = (value, fallback) => {
                if (Array.isArray(value)) return value;
                if (typeof value === 'object' && value !== null) return value;
                if (typeof value !== 'string') return fallback;

                try {
                    return JSON.parse(value);
                } catch (err) {
                    console.warn(`Invalid JSON for field: ${value}`);
                    return fallback;
                }
            };

            // Parse nested fields
            const rankings = parseJSON(req.body.rankings, {});
            const availableIntakes = parseJSON(req.body.availableIntakes, []);  // Make sure frontend sends ["Fall","Spring"] as stringified JSON
            const coursesOffered = parseJSON(req.body.coursesOffered, []);
            const address = parseJSON(req.body.address, {});
            const eligibilityCriteria = parseJSON(req.body.eligibilityCriteria, {});
            const features = parseJSON(req.body.features, {});
            const mediaLibrary = parseJSON(req.body.mediaLibrary, { images: [], videos: [], documents: [] });

            const collegeData = {
                name,
                history,
                vision,
                rankings,
                availableIntakes,
                coursesOffered,
                contactEmail,
                contactPhone,
                website,
                address,
                accreditation,
                establishedYear: establishedYear ? parseInt(establishedYear, 10) : undefined,
                applicationFee: applicationFee ? parseInt(applicationFee, 10) : undefined,
                eligibilityCriteria,
                features,
                mediaLibrary
            };

            if (!name || !contactEmail || !contactPhone || !address || !establishedYear || !applicationFee || !eligibilityCriteria) {
                return sendResponse(res, 400, "Missing required fields", false);
            }

            const college = await this.collegeRepository.createCollege(collegeData, req.files || {});

            return sendResponse(res, 201, "College created successfully.", true, college);
        } catch (error) {
            console.error("Error creating college:", error.message);

            controllerLogger.error(`Error creating college: ${error.message}`);
            return sendResponse(res, 500, "Failed to create college.", false);
        }
    }


    async getAllColleges(req, res) {
        try {
            controllerLogger.info("Received request to fetch all colleges");

            const colleges = await this.collegeRepository.getAllColleges();

            if (!colleges || colleges.length === 0) {
                controllerLogger.warn("No colleges found");
                return sendResponse(res, 404, "No colleges found.", false);
            }

            controllerLogger.info(`Fetched ${colleges.length} colleges successfully`);

            return sendResponse(res, 200, "Colleges retrieved successfully.", true, colleges);

        } catch (error) {
            console.error("Error...............", error.message);

            controllerLogger.error(`Error in getAllColleges controller: ${error.message}`);
            return sendResponse(res, 500, "Failed to fetch colleges.", false);
        }
    }

    async getCollegeById(req, res) {
        try {
            const { id } = req.params;

            controllerLogger.info(`Received request to fetch college by ID: ${id}`);

            if (!id) {
                controllerLogger.warn("Fetch college by ID failed due to missing ID");
                return sendResponse(res, 400, "College ID is required.", false);
            }

            const college = await this.collegeRepository.getCollegeById(id);

            if (!college) {
                controllerLogger.warn(`College with ID ${id} not found`);
                return sendResponse(res, 404, "College not found.", false);
            }

            controllerLogger.info(`College with ID ${id} retrieved successfully`);

            return sendResponse(res, 200, "College retrieved successfully.", true, college);

        } catch (error) {
            controllerLogger.error(`Error in getCollegeById controller: ${error.message}`);
            return sendResponse(res, 500, "Failed to fetch college.", false);
        }
    }

    async updateCollege(req, res) {
        try {
            const { id } = req.params;
            const updateData = req.body;

            controllerLogger.info(`Received request to update college by ID: ${id}`, { updateData, files: req.files });

            if (!id) {
                controllerLogger.warn("Update college failed due to missing ID");
                return sendResponse(res, 400, "College ID is required.", false);
            }

            // If no update data or files provided, warn and return
            if (Object.keys(updateData).length === 0 && (!req.files || Object.keys(req.files).length === 0)) {
                controllerLogger.warn("Update college failed due to empty update data and no files");
                return sendResponse(res, 400, "No data or files provided for update.", false);
            }

            const college = await this.collegeRepository.updateCollege(id, updateData, req.files);

            if (!college) {
                controllerLogger.warn(`College with ID ${id} not found for update`);
                return sendResponse(res, 404, "College not found.", false);
            }

            controllerLogger.info(`College with ID ${id} updated successfully`, { updatedCollege: college });

            return sendResponse(res, 200, "College updated successfully.", true, college);

        } catch (error) {
            console.error("Error in updateCollege controller", error.message);

            controllerLogger.error(`Error in updateCollege controller: ${error.message}`, { error });
            return sendResponse(res, 500, "Failed to update college.", false);
        }
    }

    async deleteCollege(req, res) {
        try {
            const { id } = req.params;

            controllerLogger.info(`Received request to delete college by ID: ${id}`);

            if (!id) {
                controllerLogger.warn("Delete college failed due to missing ID");
                return sendResponse(res, 400, "College ID is required.", false);
            }

            const isDeleted = await this.collegeRepository.deleteCollege(id);

            if (!isDeleted) {
                controllerLogger.warn(`College with ID ${id} not found for deletion`);
                return sendResponse(res, 404, "College not found.", false);
            }

            controllerLogger.info(`College with ID ${id} deleted successfully`);

            return sendResponse(res, 200, "College deleted successfully.", true);

        } catch (error) {
            controllerLogger.error(`Error in deleteCollege controller: ${error.message}`);
            return sendResponse(res, 500, "Failed to delete college.", false);
        }
    }

    async exploreCoursesAndColleges(req, res) {
        try {
            const filters = {
                collegeName: req.query.collegeName || null,
                location: req.query.location || null,
                establishedYear: req.query.establishedYear ? parseInt(req.query.establishedYear, 10) : null,
                accreditation: req.query.accreditation || null,
                contactEmail: req.query.contactEmail || null,
                courseName: req.query.courseName || null,
                modeOfStudy: req.query.modeOfStudy || null,
                minFees: req.query.minFees ? parseInt(req.query.minFees, 10) : null,
                maxFees: req.query.maxFees ? parseInt(req.query.maxFees, 10) : null,
                applicationDeadlineFrom: req.query.applicationDeadlineFrom || null,
                applicationDeadlineTo: req.query.applicationDeadlineTo || null,
                academicQualifications: req.query.academicQualifications || null,
                entranceTest: req.query.entranceTest || null
            };

            controllerLogger.info("Fetching filtered colleges and courses", { filters });

            const result = await this.collegeRepository.getFilteredCollegesWithCourses(filters);

            return sendResponse(res, 200, "Colleges with courses fetched successfully", true, result);
        } catch (error) {
            controllerLogger.error(`Failed to fetch colleges and courses: ${error.message}`, { error });
            return sendResponse(res, 500, "Failed to fetch data", false, { error: error.message });
        }
    }
}

// export class CollegeApplicationController {
//     constructor() {
//         this.collegeApplicationRepository = new CollegeApplicationRepository();
//         this.profileDetailsRepository = new ProfileDetailsRepository();
//     }

//     async applyToCollegeCourse(req, res) {
//         const studentId = req.user.userId
//         const { collegeId, courseId } = req.body;

//         controllerLogger.info(`Student ${studentId} initiated application to College ${collegeId}, Course ${courseId}`);

//         try {
//             const studentProfile = await this.profileDetailsRepository.getProfileByUserId(studentId);
//             if (!studentProfile) {
//                 controllerLogger.warn(`Student profile not found for ${studentId}`);
//                 return sendResponse(res, 404, 'Student profile not found', false);
//             }

//             const college = await this.collegeApplicationRepository.findCollegeByIdData(collegeId);
//             const course = await this.collegeApplicationRepository.findCourseByIdAndCollegeData(courseId, collegeId);

//             // Eligibility Checks
//             const collegeEligibilityMessage = this.checkEligibility(studentProfile, college.eligibilityCriteria);
//             if (collegeEligibilityMessage) {
//                 controllerLogger.warn(`Student ${studentId} failed college eligibility: ${collegeEligibilityMessage}`);
//                 return sendResponse(res, 400, `College Eligibility Failed: ${collegeEligibilityMessage}`, false);
//             }

//             const courseEligibilityMessage = this.checkEligibility(studentProfile, course.eligibilityCriteria);
//             if (courseEligibilityMessage) {
//                 controllerLogger.warn(`Student ${studentId} failed course eligibility: ${courseEligibilityMessage}`);
//                 return sendResponse(res, 400, `Course Eligibility Failed: ${courseEligibilityMessage}`, false);
//             }

//             // Check for existing application
//             const existingApplication = await this.collegeApplicationRepository.checkExistingApplicationData(studentId, collegeId, courseId);
//             if (existingApplication) {
//                 controllerLogger.warn(`Student ${studentId} already applied for College ${collegeId}, Course ${courseId}`);
//                 return sendResponse(res, 400, 'You have already applied for this course at this college', false);
//             }

//             const application = await this.collegeApplicationRepository.createApplicationData(studentId, collegeId, courseId);
//             controllerLogger.info(`Student ${studentId} successfully applied to College ${collegeId}, Course ${courseId}`, application);

//             return sendResponse(res, 201, 'Application submitted successfully', true, application);

//         } catch (error) {
//             controllerLogger.error(`Application process failed for Student ${studentId}`, { error: error.message });
//             return this.handleErrors(res, error);
//         }
//     }

//     checkEligibility(student, criteria) {
//         if (!criteria) return null;

//         if (criteria.minimumPercentage && student.percentage < criteria.minimumPercentage) {
//             return `Minimum Percentage Required: ${criteria.minimumPercentage}`;
//         }

//         if (criteria.requiredExams) {
//             for (const exam of criteria.requiredExams) {
//                 if (!student.entranceExamScores[exam.name] || student.entranceExamScores[exam.name] < exam.minScore) {
//                     return `Minimum ${exam.name} Score Required: ${exam.minScore}`;
//                 }
//             }
//         }
//         return null;
//     }

//     handleErrors(res, error) {
//         if (error.message === 'COLLEGE_NOT_FOUND') {
//             return sendResponse(res, 404, 'College not found', false);
//         } else if (error.message === 'COURSE_NOT_FOUND') {
//             return sendResponse(res, 404, 'Course not found in the selected college', false);
//         } else {
//             return sendResponse(res, 500, 'Internal Server Error', false);
//         }
//     }
// }

export class CollegeApplicationController {
    constructor() {
        this.collegeApplicationRepository = new CollegeApplicationRepository();
    }

    async applyToCollege(req, res) {
        const studentId = req.user?.userId;

        if (!studentId) {
            controllerLogger.warn('Unauthorized access attempt to applyToCollege');
            return sendResponse(res, 401, 'Unauthorized', false);
        }

        const { collegeId } = req.body;

        if (!collegeId) {
            controllerLogger.warn(`Student ${studentId} attempted to apply without providing collegeId`);
            return sendResponse(res, 400, 'College ID is required', false);
        }

        try {
            controllerLogger.info(`Student ${studentId} is attempting to apply to college ${collegeId}`);

            const existingApplication = await this.collegeApplicationRepository.findCollegeApplicationData(studentId, collegeId);
            if (existingApplication) {
                controllerLogger.warn(`Student ${studentId} already applied to college ${collegeId}`);
                return sendResponse(res, 409, 'Application already exists for this college', false, existingApplication);
            }

            const application = await this.collegeApplicationRepository.createApplicationData(studentId, collegeId, null, 'College');

            controllerLogger.info(`Student ${studentId} successfully applied to college ${collegeId}`);

            return sendResponse(res, 201, 'Application submitted successfully', true, application);
        } catch (error) {
            console.error("Error", error.message);
            controllerLogger.error(`Error applying to college for student ${studentId}`, { error: error.message });
            return sendResponse(res, 400, error.message, false);
        }
    }

    async applyToCourse(req, res) {
        const studentId = req.user?.userId;

        if (!studentId) {
            controllerLogger.warn('Unauthorized access attempt to applyToCourse');
            return sendResponse(res, 401, 'Unauthorized', false);
        }

        const { collegeId, courseId } = req.body;

        if (!collegeId || !courseId) {
            controllerLogger.warn(`Student ${studentId} attempted to apply to a course with missing data`);
            return sendResponse(res, 400, 'College ID and Course ID are required', false);
        }

        try {
            controllerLogger.info(`Student ${studentId} is attempting to apply to course ${courseId} in college ${collegeId}`);

            // Check if college application exists and its status
            const collegeApplication = await this.collegeApplicationRepository.findCollegeApplicationData(studentId, collegeId);

            if (!collegeApplication) {
                controllerLogger.warn(`Student ${studentId} has not applied to college ${collegeId} yet`);
                return sendResponse(res, 400, 'You must apply to the college first before applying to a course', false);
            }

            if (collegeApplication.status !== 'Accepted') {
                controllerLogger.warn(`Student ${studentId} tried to apply to a course while college application is ${collegeApplication.status}`);
                return sendResponse(res, 400, `You can only apply to courses after your college application is accepted. Current status: ${collegeApplication.status}`, false);
            }

            const course = await this.collegeApplicationRepository.findCourseById(courseId);

            if (!course) {
                controllerLogger.warn(`Course ${courseId} does not exist`);
                return sendResponse(res, 404, 'Course not found', false);
            }

            if (course.collegeId !== collegeId) {
                controllerLogger.warn(`Student ${studentId} attempted to apply to course ${courseId} which does not belong to college ${collegeId}`);
                return sendResponse(res, 400, 'The selected course does not belong to the specified college', false);
            }

            // Check if course application already exists
            const existingApplication = await this.collegeApplicationRepository.findCourseApplicationData(studentId, courseId);
            `x`
            if (existingApplication) {
                controllerLogger.warn(`Student ${studentId} already applied to course ${courseId}`);
                return sendResponse(res, 409, 'Application already exists for this course', false, existingApplication);
            }

            // Create course application
            const application = await this.collegeApplicationRepository.createApplicationData(studentId, collegeId, courseId, 'Course');

            controllerLogger.info(`Student ${studentId} successfully applied to course ${courseId} in college ${collegeId}`);

            return sendResponse(res, 201, 'Course application submitted successfully', true, application);
        } catch (error) {
            controllerLogger.error(`Error applying to course for student ${studentId}`, { error: error.message });
            return sendResponse(res, 400, error.message, false);
        }
    }


    async updateApplicationStatus(req, res) {
        const { applicationId, status } = req.body;

        if (!applicationId || !status) {
            controllerLogger.warn('Attempt to update application status with missing data');
            return sendResponse(res, 400, 'Application ID and status are required', false);
        }

        try {
            controllerLogger.info(`Updating application ${applicationId} status to ${status}`);

            const application = await this.collegeApplicationRepository.updateApplicationStatusData(applicationId, status);

            controllerLogger.info(`Successfully updated application ${applicationId} status to ${status}`);

            return sendResponse(res, 200, 'Application status updated successfully', true, application);
        } catch (error) {
            controllerLogger.error(`Error updating application status for ${applicationId}`, { error: error.message });
            return sendResponse(res, 400, error.message, false);
        }
    }

    // async getStudentApplications(req, res) {
    //     const studentId = req.user.userId;

    //     if (!studentId) {
    //         controllerLogger.warn('Attempt to fetch student applications without studentId');
    //         return sendResponse(res, 400, 'Student ID is required', false);
    //     }

    //     try {
    //         controllerLogger.info(`Fetching applications for student ${studentId}`);

    //         const applications = await this.collegeApplicationRepository.getApplicationsByStudentData(studentId);

    //         // Initialize grouped response object
    //         const groupedApplications = {};

    //         for (const app of applications) {
    //             if (app.type === 'College' && app.status === 'Accepted') {
    //                 // Fetch college details (Assuming CollegeModel has details like name, location, etc.)
    //                 const collegeDetails = await this.collegeApplicationRepository.findCollegeById(app.collegeId);

    //                 if (!groupedApplications[app.collegeId]) {
    //                     groupedApplications[app.collegeId] = {
    //                         collegeId: app.collegeId,
    //                         collegeName: collegeDetails?.name || 'N/A',
    //                         eligibilityCriteria: collegeDetails?.eligibilityCriteria || 'N/A',
    //                         status: app.status,
    //                         appliedAt: app.appliedAt,
    //                         courses: []
    //                     };
    //                 }
    //             } else if (app.type === 'Course') {
    //                 // Fetch course details (Assuming CourseModel has details like name, duration, etc.)
    //                 const courseDetails = await this.collegeApplicationRepository.findCourseById(app.courseId);

    //                 if (app.collegeId && groupedApplications[app.collegeId]) {
    //                     groupedApplications[app.collegeId].courses.push({
    //                         courseId: app.courseId,
    //                         courseName: courseDetails?.name || 'N/A',
    //                         duration: courseDetails?.duration || 'N/A',
    //                         status: app.status,
    //                         appliedAt: app.appliedAt
    //                     });
    //                 }
    //             }
    //         }

    //         const responseArray = Object.values(groupedApplications);

    //         controllerLogger.info(`Successfully fetched applications for student ${studentId}`);

    //         return sendResponse(res, 200, 'Applications retrieved successfully', true, responseArray);

    //     } catch (error) {
    //         controllerLogger.error(`Error fetching applications for student ${studentId}`, { error: error.message });
    //         return sendResponse(res, 400, error.message, false);
    //     }
    // }

    async getStudentApplications(req, res) {
        const studentId = req.user.userId;

        if (!studentId) {
            controllerLogger.warn('Attempt to fetch student applications without studentId');
            return sendResponse(res, 400, 'Student ID is required', false);
        }

        try {
            controllerLogger.info(`Fetching applications for student ${studentId}`);

            const applications = await this.collegeApplicationRepository.getApplicationsByStudentData(studentId);

            // Initialize grouped response object
            const groupedApplications = {};

            for (const app of applications) {
                if (app.type === 'College') {
                    // Fetch college details (Assuming CollegeModel has details like name, location, etc.)
                    const collegeDetails = await this.collegeApplicationRepository.findCollegeById(app.collegeId);

                    if (!groupedApplications[app.collegeId]) {
                        groupedApplications[app.collegeId] = {
                            applicationId: app.id,  // Add primary key of college application
                            collegeId: app.collegeId,
                            collegeName: collegeDetails?.name || 'N/A',
                            eligibilityCriteria: collegeDetails?.eligibilityCriteria || 'N/A',
                            status: app.status,
                            appliedAt: app.appliedAt,
                            courses: []
                        };
                    }
                } else if (app.type === 'Course') {
                    // Fetch course details (Assuming CourseModel has details like name, duration, etc.)
                    const courseDetails = await this.collegeApplicationRepository.findCourseById(app.courseId);

                    if (app.collegeId && groupedApplications[app.collegeId]) {
                        groupedApplications[app.collegeId].courses.push({
                            applicationId: app.id,
                            courseId: app.courseId,
                            courseName: courseDetails?.name || 'N/A',
                            duration: courseDetails?.duration || 'N/A',
                            status: app.status,
                            appliedAt: app.appliedAt
                        });
                    }
                }
            }

            const responseArray = Object.values(groupedApplications);

            controllerLogger.info(`Successfully fetched applications for student ${studentId}`);

            return sendResponse(res, 200, 'Applications retrieved successfully', true, responseArray);

        } catch (error) {
            controllerLogger.error(`Error fetching applications for student ${studentId}`, { error: error.message });
            return sendResponse(res, 400, error.message, false);
        }
    }

    async getAllApplicationsForStudent(req, res) {
        const { studentId } = req.params;  // Student ID from URL params

        if (!studentId) {
            controllerLogger.warn('Admin attempted to fetch student applications without studentId');
            return sendResponse(res, 400, 'Student ID is required', false);
        }

        try {
            controllerLogger.info(`Admin fetching all applications for student ${studentId}`);

            const applications = await this.collegeApplicationRepository.getApplicationsByStudentData(studentId);

            const groupedApplications = {};

            for (const app of applications) {
                if (app.type === 'College') {
                    // Fetch college details (name, eligibility, etc.)
                    const collegeDetails = await this.collegeApplicationRepository.findCollegeById(app.collegeId);

                    if (!groupedApplications[app.collegeId]) {
                        groupedApplications[app.collegeId] = {
                            applicationId: app.id,  // This is the college applicationId
                            collegeId: app.collegeId,
                            collegeName: collegeDetails?.name || 'N/A',
                            eligibilityCriteria: collegeDetails?.eligibilityCriteria || 'N/A',
                            status: app.status,
                            appliedAt: app.appliedAt,
                            courses: []
                        };
                    }
                } else if (app.type === 'Course') {
                    // Fetch course details (name, duration, etc.)
                    const courseDetails = await this.collegeApplicationRepository.findCourseById(app.courseId);

                    if (app.collegeId && groupedApplications[app.collegeId]) {
                        groupedApplications[app.collegeId].courses.push({
                            applicationId: app.id,  // This is the course applicationId
                            courseId: app.courseId,
                            courseName: courseDetails?.name || 'N/A',
                            duration: courseDetails?.duration || 'N/A',
                            status: app.status,
                            appliedAt: app.appliedAt
                        });
                    }
                }
            }
            
            const responseArray = Object.values(groupedApplications);

            controllerLogger.info(`Admin successfully fetched all applications for student ${studentId}`);

            return sendResponse(res, 200, 'Applications retrieved successfully', true, responseArray);

        } catch (error) {
            controllerLogger.error(`Error fetching applications for student ${studentId}`, { error: error.message });
            return sendResponse(res, 400, error.message, false);
        }
    }


}