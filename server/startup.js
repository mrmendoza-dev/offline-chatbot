#!/usr/bin/env node

import dotenv from "dotenv";
import { cleanupAndVerifyPorts } from "./utils/port-manager.js";

dotenv.config();

const FRONTEND_PORT = Number(process.env.VITE_PORT) || 8080;
const BACKEND_PORT = Number(process.env.VITE_API_PORT) || 8081;

// Check if --skip-cleanup flag is passed
const skipCleanup = process.argv.includes("--skip-cleanup");

(async () => {
  if (!skipCleanup) {
    await cleanupAndVerifyPorts(FRONTEND_PORT, BACKEND_PORT);
  } else {
    console.log("⏭️  Skipping port cleanup (--skip-cleanup flag)\n");
  }
})();
