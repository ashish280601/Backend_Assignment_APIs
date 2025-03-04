import { Router } from "express";
import CourseController from "../../controllers/courses/course.controller.js";
import { authorizeRoles, jwtAuth } from "../../../middlewares/jwt.middleware.js";

const courseRouter = Router();
const courseController = new CourseController();

courseRouter.post("/:collegeId/colleges", jwtAuth, authorizeRoles(['Admin']), (req, res) => courseController.createCourse(req, res));
courseRouter.get("/all-courses", jwtAuth, authorizeRoles(['Admin']), (req, res) => courseController.getAllCourses(req, res));
courseRouter.get("/:collegeId/college", jwtAuth, authorizeRoles(['Admin']), (req, res) => courseController.getCourses(req, res));
courseRouter.get("/:courseId/get-by-coursesId", jwtAuth, authorizeRoles(['Admin']), (req, res) => courseController.getCourseById(req, res));
courseRouter.put("/:courseId/update-course", jwtAuth, authorizeRoles(['Admin']), (req, res) => courseController.updateCourse(req, res));
courseRouter.delete("/:courseId/delete", jwtAuth, authorizeRoles(['Admin']), (req, res) => courseController.deleteCourse(req, res));

export default courseRouter;
