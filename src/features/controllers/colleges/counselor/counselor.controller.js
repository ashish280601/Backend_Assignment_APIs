// Inbuilt import
import { validationResult } from 'express-validator';

// Custom import
import CounselorRepository from '../../../repository/colleges/counselor/counselor.repository.js';
import { controllerLogger } from '../../../../utils/logger.js';
import sendResponse from '../../../../utils/responseHelper.js';

export default class CounselorController {
    constructor() {
        this.counselorRepository = new CounselorRepository();
    }

    // Create counselor
    async createCounselorData(req, res) {
        controllerLogger.info('Starting create counselor process');

        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return sendResponse(res, 400, 'Validation failed', false, errors.array());
            }
            const data = req.body;
            const counselor = await this.counselorRepository.createCounselor(data);
            controllerLogger.info('Counselor created successfully', { counselor });
            return sendResponse(res, 201, 'Counselor created successfully', true, counselor);
        } catch (error) {
            controllerLogger.error('Error creating counselor', { error: error.message });
            return sendResponse(res, 500, 'Internal Server Error', false);
        }
    }

    // Get counselor by ID
    async getCounselorByIdData(req, res) {
        const { id } = req.params;

        controllerLogger.info(`Fetching counselor data for ID: ${id}`);

        try {
            const counselor = await this.counselorRepository.getCounselorById(id);
            if (!counselor) {
                return sendResponse(res, 404, 'Counselor not found', false);
            }

            return sendResponse(res, 200, 'Counselor data fetched successfully', true, counselor);
        } catch (error) {
            controllerLogger.error(`Error fetching counselor data for ID: ${id}`, { error: error.message });
            return sendResponse(res, 500, 'Internal Server Error', false);
        }
    }

    // Get all counselors by college
    async getAllCounselorsData(req, res) {
        const { collegeId } = req.query;

        controllerLogger.info(`Fetching all counselors for college ID: ${collegeId}`);

        try {
            const counselors = await this.counselorRepository.getAllCounselors(collegeId);
            return sendResponse(res, 200, 'All counselors fetched successfully', true, counselors);
        } catch (error) {
            console.error("Errror", error.message);
            
            controllerLogger.error('Error fetching all counselors', { error: error.message });
            return sendResponse(res, 500, 'Internal Server Error', false);
        }
    }

    // Update counselor
    async updateCounselorData(req, res) {
        const { id } = req.params;
        const updateData = req.body;

        controllerLogger.info(`Updating counselor with ID: ${id}`, { updateData });

        try {
            const updatedCounselor = await this.counselorRepository.updateCounselor(id, updateData);
            if (!updatedCounselor) {
                return sendResponse(res, 404, 'Counselor not found', false);
            }

            return sendResponse(res, 200, 'Counselor updated successfully', true, updatedCounselor);
        } catch (error) {
            controllerLogger.error(`Error updating counselor for ID: ${id}`, { error: error.message });
            return sendResponse(res, 500, 'Internal Server Error', false);
        }
    }

    // Delete counselor
    async deleteCounselorData(req, res) {
        const { id } = req.params;

        controllerLogger.info(`Deleting counselor with ID: ${id}`);

        try {
            const deleted = await this.counselorRepository.deleteCounselor(id);
            if (deleted === 0) {
                return sendResponse(res, 404, 'Counselor not found', false);
            }

            return sendResponse(res, 200, 'Counselor deleted successfully', true);
        } catch (error) {
            controllerLogger.error(`Error deleting counselor for ID: ${id}`, { error: error.message });
            return sendResponse(res, 500, 'Internal Server Error', false);
        }
    }

    // Add counselor availability
    async addCounselorAvailabilityData(req, res) {
        const { counselorId } = req.params;
        const { date, day, startTime, endTime } = req.body;

        controllerLogger.info(`Adding availability for counselor ${counselorId}`, { date, day, startTime, endTime });

        try {
            const conflict = await this.counselorRepository.checkAvailabilityConflict(counselorId, date, startTime, endTime);
            if (conflict) {
                controllerLogger.warn(`Time slot conflict for counselor ${counselorId}`, { date, startTime, endTime });
                return sendResponse(res, 400, 'Time slot overlaps with existing availability', false);
            }

            const availability = await this.counselorRepository.addCounselorAvailability(counselorId, { date, day, startTime, endTime });
            return sendResponse(res, 201, 'Availability added successfully', true, availability);
        } catch (error) {
            console.error("Error", error.message);
            controllerLogger.error(`Error adding availability for counselor ${counselorId}`, { error: error.message });
            return sendResponse(res, 500, 'Internal Server Error', false);
        }
    }

    // Get counselor availability
    async getCounselorAvailabilityData(req, res) {
        const { counselorId } = req.params;

        controllerLogger.info(`Fetching availability for counselor ${counselorId}`);

        try {
            const availability = await this.counselorRepository.getCounselorAvailability(counselorId);
            return sendResponse(res, 200, 'Availability fetched successfully', true, availability);
        } catch (error) {
            controllerLogger.error(`Error fetching availability for counselor ${counselorId}`, { error: error.message });
            return sendResponse(res, 500, 'Internal Server Error', false);
        }
    }

    // Check if a slot is available (optional)
    async checkCounselorSlotAvailabilityData(req, res) {
        const { counselorId } = req.params;
        const { date, startTime, endTime } = req.body;

        controllerLogger.info(`Checking availability for counselor ${counselorId} on ${date}`, { startTime, endTime });

        try {
            const conflict = await this.counselorRepository.checkAvailabilityConflict(counselorId, date, startTime, endTime);
            if (conflict) {
                controllerLogger.warn(`Conflict found for counselor ${counselorId}`, { date, startTime, endTime });
                return sendResponse(res, 400, 'Time slot is not available', false);
            }

            return sendResponse(res, 200, 'Time slot is available', true);
        } catch (error) {
            controllerLogger.error(`Error checking slot availability for counselor ${counselorId}`, { error: error.message });
            return sendResponse(res, 500, 'Internal Server Error', false);
        }
    }
};
