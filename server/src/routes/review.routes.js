import express from "express";
import { authenticate, requireRole } from "../middleware/auth.middleware.js";
import { createReview, getProviderReviews } from "../controllers/review.controller.js";

const router = express.Router();

// POST /api/reviews — create review (homeowner only)
router.post("/", authenticate, requireRole("HOMEOWNER"), createReview);

// GET /api/reviews/provider/:id — get reviews for a provider (public)
router.get("/provider/:id", getProviderReviews);

export default router;
