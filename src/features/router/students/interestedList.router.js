import { Router } from "express";
import InterestedListController from "../../controllers/students/interestedList.controller.js";
import { jwtAuth, authorizeRoles } from "../../../middlewares/jwt.middleware.js";

const interestedListRouter = Router();
const interestedListController = new InterestedListController();

interestedListRouter.post("/create-wishlist", jwtAuth, authorizeRoles(['Admin', 'Student']), (req, res) => interestedListController.addToInterestedList(req, res));
interestedListRouter.get("/fetch-all-wishlist", jwtAuth, authorizeRoles(['Admin', 'Student']), (req, res) => interestedListController.getInterestedList(req, res));
interestedListRouter.delete("/:id/remove-wishlist", jwtAuth, authorizeRoles(['Admin', 'Student']), (req, res) => interestedListController.removeFromInterestedList(req, res));

export default interestedListRouter;
