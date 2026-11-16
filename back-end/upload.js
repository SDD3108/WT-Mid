import multer from "multer";
import path from "node:path";
import fs from "node:fs";
import { randomUUID } from "node:crypto";
import { fileURLToPath } from "node:url";

const backendDir = path.dirname(fileURLToPath(import.meta.url));
export const uploadsDir = path.join(backendDir, "uploads");
fs.mkdirSync(uploadsDir, { recursive: true });

const extensions = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
};

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => cb(null, `${randomUUID()}${extensions[file.mimetype]}`),
});

export const gameImageUpload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024, files: 5 },
  fileFilter: (_req, file, cb) => {
    if (!extensions[file.mimetype]) {
      return cb(new Error("Only JPG, PNG and WEBP images are allowed"));
    }
    cb(null, true);
  },
}).fields([
  { name: "image_vertical", maxCount: 1 },
  { name: "image_horizontal", maxCount: 1 },
  { name: "screenshots", maxCount: 3 },
]);

export function removeUploadedFiles(files) {
  for (const list of Object.values(files || {})) {
    for (const file of list) {
      try {
        fs.unlinkSync(file.path);
      } catch (error) {
        if (error.code !== "ENOENT") console.error("Upload cleanup failed:", error);
      }
    }
  }
}

export function imageUrl(req, file) {
  return file ? `${req.protocol}://${req.get("host")}/uploads/${file.filename}` : "";
}
