import fs from 'fs';
import path from 'path';

// File paths
const logsDir = path.join(process.cwd(), 'logs');

const controllerLogFile = path.join(logsDir, 'controller.log');
const repositoryLogFile = path.join(logsDir, 'repository.log');

// Ensure logs folder exists
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
}

// Generic log function
const logToFile = (filePath, level, message) => {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [${level}] ${message}\n`;

    fs.appendFile(filePath, logMessage, (err) => {
        if (err) console.error('Failed to write log:', err.message);
    });
};

// Controller logger
const controllerLogger = {
    info: (message) => logToFile(controllerLogFile, 'INFO', message),
    error: (message) => logToFile(controllerLogFile, 'ERROR', message),
    warn: (message) => logToFile(controllerLogFile, 'WARN', message),
};

// Repository logger
const repositoryLogger = {
    info: (message) => logToFile(repositoryLogFile, 'INFO', message),
    error: (message) => logToFile(repositoryLogFile, 'ERROR', message),
    warn: (message) => logToFile(repositoryLogFile, 'WARN', message),
};

export { controllerLogger, repositoryLogger };
