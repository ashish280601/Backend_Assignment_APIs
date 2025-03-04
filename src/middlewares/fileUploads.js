import multer from 'multer';
import fs from 'fs';
import path from 'path';

// Base uploads directory inside src
const baseUploadsDir = path.join('src', 'uploads');

// Helper to ensure the directory exists
const ensureDirExists = (dir) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
};

// Configure dynamic storage location
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log("file...........in multer", file);

        let folder = 'others'; // Default folder inside uploads

        if (file.fieldname === 'logo') {
            folder = 'logos';
        } else if (file.mimetype.startsWith('image/')) {
            folder = 'images';
        } else if (file.mimetype.startsWith('video/')) {
            folder = 'videos';
        } else if (
            file.mimetype === 'application/pdf' ||
            file.mimetype.includes('document') ||
            file.mimetype.includes('word')
        ) {
            folder = 'documents';
        }

        const fullPath = path.join(baseUploadsDir, folder);

        ensureDirExists(fullPath);  // Create folder if needed
        cb(null, fullPath);
    },

    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `${Date.now()}-${file.fieldname}${ext}`);
    }
});

// Multer upload instance with size limits
const upload = multer({
    storage,
    limits: {
        fileSize: 100 * 1024 * 1024 // 100 MB limit
    }
});

// Accept multiple fields, including 'logo'
export const uploadFields = upload.fields([
    { name: 'logo', maxCount: 1 },
    { name: 'images', maxCount: 10 },
    { name: 'videos', maxCount: 5 },
    { name: 'documents', maxCount: 5 }
]);
