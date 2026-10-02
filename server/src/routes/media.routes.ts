import { Router } from "express";

import { requireAuth } from "../middleware/auth.middleware.js";

import { upload } from "../middleware/upload.middleware.js";

import {
  uploadMedia,
  getMedia,
  getMediaStats,
  getSingleMedia,
  analyzeMedia,
  removeMedia,
} from "../controllers/media.controller.js";

const router = Router();

router.use(requireAuth);

// Upload
router.post(
  "/upload",
  upload.single("file"),
  uploadMedia
);

// Dashboard statistics
// IMPORTANT: this must be before /:id
router.get(
  "/stats",
  getMediaStats
);

// Media list
router.get(
  "/",
  getMedia
);

// Single media
router.get(
  "/:id",
  getSingleMedia
);

// AI analysis
router.post(
  "/:id/analyze",
  analyzeMedia
);

// Delete
router.delete(
  "/:id",
  removeMedia
);

export default router;