// inbuilt import
import { Router } from "express";

// custom import
import userRouter from "./src/features/router/students/users.router.js";
import profileRouter from "./src/features/router/students/profile.router.js";
import collegeRouter from "./src/features/router/colleges/college.router.js";
import courseRouter from "./src/features/router/courses/course.router.js";
import interestedListRouter from "./src/features/router/students/interestedList.router.js";
import counselorRouter from "./src/features/router/colleges/counselor/counselor.router.js";

const router = Router();

// root routing
router.get('/', (req, res) => {
    return res.status(200).json({
        data: {
            message: "Welcome to student portal router",
            code: 200,
            status: true,
        }
    });
})

router.use('/v1/users', userRouter);
router.use('/v1/profile', profileRouter)
router.use('/v1/college', collegeRouter)
router.use('/v1/application', collegeRouter)
router.use('/v1/course', courseRouter)
router.use('/v1/shortlist', interestedListRouter)
router.use('/v1/counselor', counselorRouter)

// middleware to handle route not found
router.use((req, res) => {
    return res.status(404).json({
        data: {
            message: 'API"s not found',
            code: 404,
            status: true,
        }
    });
});

export default router