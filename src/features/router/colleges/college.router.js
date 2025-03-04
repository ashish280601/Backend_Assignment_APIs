import { Router } from 'express';
import CollegeController from '../../controllers/colleges/college.controller.js';
import { authorizeRoles, jwtAuth } from '../../../middlewares/jwt.middleware.js';
import { uploadFields } from '../../../middlewares/fileUploads.js';

const collegeRouter = Router();
const collegeController = new CollegeController();

collegeRouter.post('/add-college', jwtAuth, authorizeRoles(['Admin']), uploadFields, (req, res) => collegeController.createCollege(req, res));
collegeRouter.get('/fetch-all', jwtAuth, authorizeRoles(['Admin', 'Student']), (req, res) => collegeController.getAllColleges(req, res));
collegeRouter.get('/get-by-id/:id', jwtAuth, authorizeRoles(['Admin', 'Student']), (req, res) => collegeController.getCollegeById(req, res));
collegeRouter.get('/explore-courses-colleges', jwtAuth, authorizeRoles(['Admin', 'Student']), (req, res) => collegeController.exploreCoursesAndColleges(req, res));
collegeRouter.put('/update-college/:id', jwtAuth, authorizeRoles(['Admin']), uploadFields, (req, res) => collegeController.updateCollege(req, res));
collegeRouter.delete('/delete/:id', jwtAuth, authorizeRoles(['Admin']), (req, res) => collegeController.deleteCollege(req, res));

export default collegeRouter;
