import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import {
  authorizeAdmin,
  authorizeOrganizerOrAdmin
} from "../middleware/authorization.middleware.js";

import {
  createBooking,
  approveBooking,
  getBookings
} from "../controllers/booking.controller.js";

const router = Router();

// Create booking (organizer)
router.post(
  "/",
  authenticate,
  authorizeOrganizerOrAdmin,
  createBooking
);

// View bookings
router.get(
  "/",
  authenticate,
  getBookings
);

// Approve booking (admin only)
router.post(
  "/:id/approve",
  authenticate,
  authorizeAdmin,
  approveBooking
);

export default router;
