import { Router } from "express";
import UserController from "../../controllers/students/users.controller.js";

const userRouter = Router();
const userController = new UserController();


// step 1 - Register via email 
userRouter.post('/register-user', (req, res) => {
    userController.registerByEmail(req, res);
});

// step 2 - verify otp
userRouter.post('/verify-otp', (req, res) => {
    userController.verifyOtp(req, res);
});

// step 3 - set password and complete registration.
userRouter.post('/create-password', (req, res) => {
    userController.setPassword(req, res);
});

userRouter.post('/login', (req, res) => {
    userController.login(req, res);
});


export default userRouter;