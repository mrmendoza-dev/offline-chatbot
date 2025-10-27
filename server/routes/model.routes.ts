import { exec } from "child_process";
import express, { Request, Response } from "express";
import ollama from "ollama";
import { promisify } from "util";
import { logger } from "../utils/logger.js";

const router = express.Router();
const execAsync = promisify(exec);

// Get list of available models
router.get("/models", async (_req: Request, res: Response) => {
  try {
    const models = await ollama.list();
    logger.info(`Retrieved ${models.models.length} available models`);
    return res.status(200).json(models);
  } catch (error) {
    logger.error("Failed to list models:", error);
    return res.status(500).json({ error: "Failed to retrieve models" });
  }
});

// Get currently loaded models from ollama ps
router.get("/models/loaded", async (_req: Request, res: Response) => {
  try {
    const { stdout } = await execAsync("ollama ps");

    // Parse the text table output
    const lines = stdout.trim().split("\n");

    if (lines.length <= 1) {
      // Only header or empty, no models loaded
      return res.status(200).json({ models: [] });
    }

    // Skip header line
    const modelLines = lines.slice(1);

    const loadedModels = modelLines.map((line) => {
      // Parse columns: NAME, ID, SIZE, PROCESSOR, CONTEXT, UNTIL
      const parts = line.trim().split(/\s{2,}/); // Split by 2+ spaces

      return {
        name: parts[0] || "",
        id: parts[1] || "",
        size: parts[2] || "",
        processor: parts[3] || "",
        context: parts[4] || "",
        until: parts[5] || "",
      };
    });

    logger.info(`Retrieved ${loadedModels.length} loaded models`);
    return res.status(200).json({ models: loadedModels });
  } catch (error) {
    logger.error("Failed to get loaded models:", error);
    return res.status(500).json({ error: "Failed to retrieve loaded models" });
  }
});

// Check Ollama server status
router.get("/status", async (_req: Request, res: Response) => {
  try {
    // Try to list models as a health check
    const models = await ollama.list();

    return res.status(200).json({
      status: "ok",
      ollama: "connected",
      availableModels: models.models.length,
      models: models.models.map((m) => ({
        name: m.name,
        size: m.size,
        modified: m.modified_at,
      })),
    });
  } catch (error) {
    logger.error("Ollama status check failed:", error);
    return res.status(503).json({
      status: "error",
      ollama: "disconnected",
      error: "Cannot connect to Ollama server",
    });
  }
});

export default router;
