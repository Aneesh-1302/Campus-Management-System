import express from "express";
import cors from "cors";
import healthRoutes from "./routes/health.routes.js";
import dbRoutes from "./routes/db.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/", healthRoutes);
app.use("/", dbRoutes);

export default app;