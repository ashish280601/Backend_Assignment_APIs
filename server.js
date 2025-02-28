import "./env.js";
// inbuilt import
import express from "express";
import cors from "cors";

// custom import
import {connectDB, closeDB} from "./src/config/db.js";


const app = express()

const port = process.env.PORT || 5000;

var corsOptions = {
    origin: ["http://localhost:5173", "https://bookish-guide-44qxw4xp4x5f969-5173.app.github.dev", "https://task-manager-ui.onrender.com",],
    allowedHeaders: "*",
};

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use('/api', router)

app.listen(port, async () => {
    try {
        console.log(`Server is running at port ${port}`);
      await connectDB(); 
    } catch (error) {
        console.error("Error while connecting to database", error);
    }
});

// Graceful Shutdown Handling
const handleShutdown = async (signal) => {
    console.log(`Received signal: ${signal}`);
    try {
        await closeDB();  // Close database connection
        console.log("Database connection closed. Exiting now.");
        process.exit(0);
    } catch (error) {
        console.error("Error during shutdown:", error);
        process.exit(1);
    }
};

process.on('SIGINT', () => handleShutdown('SIGINT'));    // CTRL+C
process.on('SIGTERM', () => handleShutdown('SIGTERM'));  // Docker/Cloud Stop