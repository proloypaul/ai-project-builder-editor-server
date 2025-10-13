import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(process.cwd(), "uploads/"));
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

export const uploadOptions = multer({
  storage,
  limits: { fileSize: 512 * 1024 },
});
