import { Router } from "express";
import userRouter from "./src/features/router/students/users.router.js";

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

router.use('/users', userRouter);

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