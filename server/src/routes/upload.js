import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { auth } from '../middleware/auth.js';
import express from 'express';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const serverRoot = path.resolve(__dirname, '../../');
const uploadStoragePath = process.env.UPLOAD_PATH
  ? path.resolve(serverRoot, process.env.UPLOAD_PATH)
  : path.resolve(serverRoot, 'src/uploads');

const router = Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    // Create directory if it doesn't exist
    await fs.promises.mkdir(uploadStoragePath, { recursive: true });
    cb(null, uploadStoragePath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5000000, // 5MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

// POST /upload/image
router.post('/image', auth, upload.single('image'), (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const serverUrl = process.env.NODE_ENV === 'production' ? process.env.SERVER_URL : `http://localhost:${process.env.PORT || 5000}`;
    const imageUrl = `${serverUrl}/api/v1/upload/static/${req.file.filename}`;

    res.json({
      url: imageUrl,
      filename: req.file.filename,
      size: req.file.size,
    });
  } catch (error) {
    if (error instanceof multer.MulterError) {
      if (error.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ message: 'File too large' });
      }
    }
    next(error);
  }
});

// Serve static files
router.use('/static', express.static(uploadStoragePath));

export default router;
