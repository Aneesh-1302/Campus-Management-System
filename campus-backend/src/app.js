import express from "express";
import cors from "cors";
import healthRoutes from "./routes/health.routes.js";
import dbRoutes from "./routes/db.routes.js";
import authRoutes from "./routes/auth.routes.js";
import protectedRoutes from "./routes/protected.routes.js";
import resourceRoutes from "./routes/resource.routes.js";
import bookingRoutes from "./routes/booking.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

//routes
app.use("/", healthRoutes);
app.use("/", dbRoutes);
app.use("/bookings", bookingRoutes);
app.use("/resources", resourceRoutes);
app.use("/auth", authRoutes);
app.use("/test", protectedRoutes);
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

export default app;