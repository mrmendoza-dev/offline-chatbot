import cors from "cors";
import dotenv from "dotenv";
import express, { Request, Response } from "express";
import chatRoutes from "./routes/chat.routes.js";
import modelRoutes from "./routes/model.routes.js";
import { logger } from "./utils/logger.js";
import { findAvailablePort } from "./utils/port-manager.js";

const app = express();

dotenv.config();

// Middleware
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cors());

// Routes
app.use("/", chatRoutes);
app.use("/", modelRoutes);

// Health check endpoint
app.get("/health", (_req: Request, res: Response) => {
  return res.status(200).json({ status: "ok", message: "Server is running" });
});

// Error handling middleware
app.use((err: Error, _req: Request, res: Response) => {
  console.error("Error:", err);
  res.status(500).json({ error: "Internal server error" });
});

const PORT = Number(process.env.VITE_API_PORT) || 5001;

findAvailablePort(PORT)
  .then((port) => {
    app.listen(port, () => {
      logger.success(`Server running on http://localhost:${port}`);
      logger.port(`API endpoint: http://localhost:${port}/ask`);

      // Log if port changed
      if (port !== PORT) {
        logger.warning(`Port ${PORT} was in use, using port ${port} instead`);
      }
    });
  })
  .catch((err) => {
    logger.error("Failed to start server:", err);
    process.exit(1);
  });
