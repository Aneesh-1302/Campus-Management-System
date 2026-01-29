import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorizeAdmin } from "../middleware/authorization.middleware.js";
import {
  createResource,
  getResources,
  updateResource,
  deleteResource
} from "../controllers/resource.controller.js";
import { getAvailableResources } from "../controllers/resource.controller.js";

const router = Router();

// READ
router.get("/", authenticate, getResources);

// CREATE
router.post("/", authenticate, authorizeAdmin, createResource);

router.get(
  "/available",
  authenticate,
  getAvailableResources
);

// UPDATE
router.put("/:id", authenticate, authorizeAdmin, updateResource);

// DELETE (soft)
router.delete("/:id", authenticate, authorizeAdmin, deleteResource);

export default router;