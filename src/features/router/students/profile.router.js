import { Router } from "express";
import ProfileDetailsController from "../../controllers/students/profile_details/profile_details.controller.js";
import { jwtAuth, authorizeRoles } from "../../../middlewares/jwt.middleware.js";

const profileRouter = Router();
const profileDetailsController = new ProfileDetailsController();

profileRouter.post('/upsert', jwtAuth, authorizeRoles(['Admin', 'Student']), (req, res) => {
    profileDetailsController.upsertProfile(req, res);
});

profileRouter.get('/fetch', jwtAuth, authorizeRoles(['Admin', 'Student']), (req, res) => {
    profileDetailsController.getProfile(req, res);
});

profileRouter.delete('/delete', jwtAuth, authorizeRoles(['Admin', 'Student']), (req, res) => {
    profileDetailsController.deleteProfile(req, res);
});



export default profileRouter;