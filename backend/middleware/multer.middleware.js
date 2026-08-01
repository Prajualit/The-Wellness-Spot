import multer from "multer";
import fs from "fs";
import path from "path";

const TEMP_DIR = path.resolve("./temp");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Ensure temp directory exists
    if (!fs.existsSync(TEMP_DIR)) {
      fs.mkdirSync(TEMP_DIR, { recursive: true });
    }
    cb(null, TEMP_DIR);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

// Default upload (used for avatar updates) - increase to 50MB
export const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 },
});
