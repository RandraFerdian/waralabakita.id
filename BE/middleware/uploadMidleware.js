import multer from 'multer';

const storage = multer.memoryStorage();
const fileLimits = { fileSize: 5 * 1024 * 1024 }; // Maksimum 5MB per file

export const documentUpload = multer({ 
    storage: storage,
    limits: fileLimits,
    fileFilter: (req, file, cb) => {
        const allowedTypes = [
            "image/jpeg", "image/png", "image/webp", "application/pdf"
        ];
        if (!allowedTypes.includes(file.mimetype)) {
            return cb(new Error("Invalid file type. Only images and PDF are allowed."), false);
        }
        cb(null, true);
    }
}).fields([
    { name: 'ktp', maxCount: 1 }, 
    { name: 'nib', maxCount: 1 }, 
    { name: 'haki', maxCount: 1 },
    { name: 'gallery_photos', maxCount: 10 } 
]);