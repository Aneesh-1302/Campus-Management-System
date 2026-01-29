import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/protected", authenticate, (req, res) => {
  res.json({
    message: "Access granted",
    user: req.user
  });
});

export default router;
