import { Router } from 'express';
import CollegeController from '../../controllers/colleges/college.controller.js';
import { CollegeApplicationController } from '../../controllers/colleges/college.controller.js';
import { authorizeRoles, jwtAuth } from '../../../middlewares/jwt.middleware.js';
import { uploadFields } from '../../../middlewares/fileUploads.js';

const collegeRouter = Router();
const collegeController = new CollegeController();
const collegeApplicationController = new CollegeApplicationController();

// CRUD API - College
collegeRouter.post('/add-college', jwtAuth, authorizeRoles(['Admin']), uploadFields, (req, res) => collegeController.createCollege(req, res));
collegeRouter.get('/fetch-all', jwtAuth, authorizeRoles(['Admin', 'Student']), (req, res) => collegeController.getAllColleges(req, res));
collegeRouter.get('/get-by-id/:id', jwtAuth, authorizeRoles(['Admin', 'Student']), (req, res) => collegeController.getCollegeById(req, res));
collegeRouter.get('/explore-courses-colleges', jwtAuth, authorizeRoles(['Admin', 'Student']), (req, res) => collegeController.exploreCoursesAndColleges(req, res));
collegeRouter.put('/update-college/:id', jwtAuth, authorizeRoles(['Admin']), uploadFields, (req, res) => collegeController.updateCollege(req, res));
collegeRouter.delete('/delete/:id', jwtAuth, authorizeRoles(['Admin']), (req, res) => collegeController.deleteCollege(req, res));

// ----------------- APIs to Track Application -------------------

// APIs to enroll student application - COLLEGE & COURSE
collegeRouter.post('/apply/college', jwtAuth, authorizeRoles(['Admin', 'Student']), (req, res) => collegeApplicationController.applyToCollege(req, res));
// Student applies to course (only if college application accepted)
collegeRouter.post('/apply/course', jwtAuth, authorizeRoles(['Admin', 'Student']), (req, res) => collegeApplicationController.applyToCourse(req, res));
// Admin updates application status (college or course)
collegeRouter.patch('/application/status', jwtAuth, authorizeRoles(['Admin']), (req, res) => collegeApplicationController.updateApplicationStatus(req, res));
// Fetch all applications for a student
collegeRouter.get('/student/status', jwtAuth, authorizeRoles(['Student']), (req, res) => collegeApplicationController.getStudentApplications(req, res));

export default collegeRouter;
