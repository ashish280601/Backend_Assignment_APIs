import CollegeRepository from "../../repository/colleges/college.repository.js";
import { controllerLogger } from "../../../utils/logger.js";
import sendResponse from "../../../utils/responseHelper.js";

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
