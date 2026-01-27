import { Router } from "express";
import { pool } from "../db/pool.js";

const router = Router();

router.get("/db-test", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT 1 + 1 AS result");
    res.json({
      db: "connected",
      result: rows[0].result
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database connection failed" });
  }
});

export default router;
