import express from "express";
import { authenticate, requireRole } from "../middleware/auth.middleware.js";
import { getProfile, updateProfile, completeOnboarding } from "../controllers/profile.controller.js";

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// GET /api/profile
router.get("/", getProfile);

// PUT /api/profile
router.put("/", updateProfile);

// POST /api/profile/onboarding — provider onboarding
router.post("/onboarding", requireRole("PROVIDER"), completeOnboarding);

export default router;
