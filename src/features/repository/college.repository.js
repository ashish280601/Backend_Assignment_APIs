import CollegeModel from "../../models/colleges/college.model.js";
import { repositoryLogger } from "../../utils/logger.js";

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

}