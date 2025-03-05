import { Router } from "express";
import CounselorController from "../../../controllers/colleges/counselor/counselor.controller.js";
import { jwtAuth, authorizeRoles } from "../../../../middlewares/jwt.middleware.js";

const counselorRouter = Router();
const counselorController = new CounselorController();


counselorRouter.post('/create-counselor',jwtAuth, authorizeRoles(['Admin', 'Counselor']),(req, res) => counselorController.createCounselorData(req, res));
counselorRouter.get('/:id/fetch-by-counselorId',jwtAuth, authorizeRoles(['Admin', 'Counselor']),(req, res) => counselorController.getCounselorByIdData(req, res));
counselorRouter.get('/fetch-counselor-details',jwtAuth, authorizeRoles(['Admin', 'Counselor']),(req, res) => counselorController.getAllCounselorsData(req, res));
counselorRouter.put('/:id/update-counselor-details',jwtAuth, authorizeRoles(['Admin', 'Counselor']),(req, res) => counselorController.updateCounselorData(req, res));
counselorRouter.delete('/:id/delete-counselor',jwtAuth, authorizeRoles(['Admin', 'Counselor']),(req, res) => counselorController.deleteCounselorData(req, res));

counselorRouter.post('/:counselorId/availability',jwtAuth, authorizeRoles(['Admin', 'Counselor']), (req, res) => counselorController.addCounselorAvailabilityData(req, res));
counselorRouter.get('/:counselorId/availability',jwtAuth, authorizeRoles(['Admin', 'Counselor']), (req, res) => counselorController.getCounselorAvailabilityData(req, res));
counselorRouter.post('/:counselorId/availability/check',jwtAuth, authorizeRoles(['Admin', 'Counselor']), (req, res) => counselorController.checkCounselorSlotAvailabilityData(req, res));

export default counselorRouter