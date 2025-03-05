import {
    ValidationError, Op
} from 'sequelize';

import CounselorModel from '../../../../models/colleges/counselor/counselor.model.js';
import CounselorAvailabilityModel from '../../../../models/colleges/counselor/counselorAvailability.model.js';
import { repositoryLogger } from '../../../../utils/logger.js';

export default class CounselorRepository {

    // Create a new counselor
    async createCounselor(data) {
        console.log("repo............", data);

        try {
            repositoryLogger.info(`Creating counselor for college ${data.collegeId}`, data);
            const counselor = await CounselorModel.create(data);
            repositoryLogger.info(`Counselor created successfully`, { counselorId: counselor.id });
            return counselor;
        } catch (error) {
            if (error instanceof ValidationError) {
                // Handle specific validation errors from Sequelize (missing fields, wrong types, etc.)
                repositoryLogger.error('Sequelize Validation Error while creating counselor', { errors: error.errors });
                const validationErrors = error.errors.map(err => ({
                    message: err.message,
                    field: err.path
                }));
                throw new Error(JSON.stringify({ type: 'ValidationError', errors: validationErrors }));
            }

            // For all other errors (like database connection issues, etc.)
            repositoryLogger.error(`Error creating counselor`, { error: error.message, stack: error.stack });
            throw error;  // Let controller catch this
        }
    }


    // Get counselor by ID
    async getCounselorById(id) {
        try {
            repositoryLogger.info(`Fetching counselor by ID ${id}`);
            const counselor = await CounselorModel.findByPk(id, {
                include: [
                    {
                        model: CounselorAvailabilityModel,
                        as: 'availability'
                    }
                ]
            });
            if (!counselor) {
                repositoryLogger.warn(`Counselor not found for ID ${id}`);
            }
            return counselor;
        } catch (error) {
            repositoryLogger.error(`Error fetching counselor by ID ${id}`, { error: error.message });
            throw error;
        }
    }

    // Get all counselors for a specific college
    async getAllCounselors(collegeId) {
        try {
            repositoryLogger.info(`Fetching all counselors for college ${collegeId}`);
            const counselors = await CounselorModel.findAll({
                where: { collegeId },
                include: [
                    {
                        model: CounselorAvailabilityModel,
                        as: 'availability'
                    }
                ]
            });
            return counselors;
        } catch (error) {
            repositoryLogger.error(`Error fetching counselors for college ${collegeId}`, { error: error.message });
            throw error;
        }
    }

    // Update counselor data
    async updateCounselor(id, data) {
        try {
            repositoryLogger.info(`Updating counselor ${id}`, data);

            const counselor = await CounselorModel.findByPk(id);
            if (!counselor) {
                repositoryLogger.warn(`Counselor not found for update ${id}`);
                return null; // No counselor found with this ID
            }

            // Correct the update() call with WHERE condition
            const [updatedCount] = await CounselorModel.update(data, {
                where: { id: id },
                returning: true // Optional - works in PostgreSQL, not MySQL
            });

            if (updatedCount === 0) {
                repositoryLogger.warn(`No fields updated for counselor ${id}`);
                return counselor; // Returning old data in case nothing changed
            }

            const updatedCounselor = await CounselorModel.findByPk(id);

            repositoryLogger.info(`Counselor ${id} updated successfully`);
            return updatedCounselor;

        } catch (error) {
            repositoryLogger.error(`Error updating counselor ${id}`, { error: error.message });
            throw error;
        }
    }


    // Delete counselor by ID
    async deleteCounselor(id) {
        try {
            repositoryLogger.info(`Deleting counselor ${id}`);
            const result = await CounselorModel.destroy({ where: { id } });
            if (result === 0) {
                repositoryLogger.warn(`Counselor ${id} not found for deletion`);
            } else {
                repositoryLogger.info(`Counselor ${id} deleted successfully`);
            }
            return result;
        } catch (error) {
            repositoryLogger.error(`Error deleting counselor ${id}`, { error: error.message });
            throw error;
        }
    }

    // Add counselor availability (date, time, day)
    async addCounselorAvailability(counselorId, availabilityData) {
        try {
            repositoryLogger.info(`Adding availability for counselor ${counselorId}`, availabilityData);
            const availability = await CounselorAvailabilityModel.create({
                counselorId,
                ...availabilityData
            });
            repositoryLogger.info(`Availability added for counselor ${counselorId}`, availability);
            return availability;
        } catch (error) {
            repositoryLogger.error(`Error adding availability for counselor ${counselorId}`, { error: error.message });
            throw error;
        }
    }

    // Get counselor availability
    async getCounselorAvailability(counselorId) {
        try {
            repositoryLogger.info(`Fetching availability for counselor ${counselorId}`);
            const availability = await CounselorAvailabilityModel.findAll({
                where: { counselorId }
            });
            return availability;
        } catch (error) {
            repositoryLogger.error(`Error fetching availability for counselor ${counselorId}`, { error: error.message });
            throw error;
        }
    }

    // Check for overlapping availability before booking
    async checkAvailabilityConflict(counselorId, date, startTime, endTime) {
        try {
            repositoryLogger.info(`Checking availability conflict for counselor ${counselorId}`, { date, startTime, endTime });

            const conflicts = await CounselorAvailabilityModel.findOne({
                where: {
                    counselorId,
                    date,
                    [Op.or]: [
                        {
                            startTime: {
                                [Op.between]: [startTime, endTime]
                            }
                        },
                        {
                            endTime: {
                                [Op.between]: [startTime, endTime]
                            }
                        }
                    ]
                }
            });

            return !!conflicts;
        } catch (error) {
            repositoryLogger.error(`Error checking availability conflict for counselor ${counselorId}`, { error: error.message });
            throw error;
        }
    }
};

