import express from "express";
import { authenticate, requireRole } from "../middleware/auth.middleware.js";
import {
  createBooking,
  getMyBookings,
  acceptBooking,
  rejectBooking,
  completeBooking,
  cancelBooking,
} from "../controllers/booking.controller.js";

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// POST /api/bookings — create booking (homeowner)
router.post("/", requireRole("HOMEOWNER"), createBooking);

// GET /api/bookings/my — my bookings (role-aware)
router.get("/my", getMyBookings);

// PATCH /api/bookings/:id/accept — accept (provider)
router.patch("/:id/accept", requireRole("PROVIDER"), acceptBooking);

// PATCH /api/bookings/:id/reject — reject (provider)
router.patch("/:id/reject", requireRole("PROVIDER"), rejectBooking);

// PATCH /api/bookings/:id/complete — mark complete (provider)
router.patch("/:id/complete", requireRole("PROVIDER"), completeBooking);

// PATCH /api/bookings/:id/cancel — cancel (homeowner)
router.patch("/:id/cancel", requireRole("HOMEOWNER"), cancelBooking);

export default router;
