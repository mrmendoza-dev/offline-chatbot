import { execSync } from "child_process";
import { createServer } from "http";

/**
 * Detect the operating system
 */
function getOS() {
  const platform = process.platform;
  if (platform === "win32") return "windows";
  if (platform === "darwin") return "mac";
  if (platform === "linux") return "linux";
  return "unknown";
}

/**
 * Kill processes using a specific port (cross-platform)
 */
export function killPort(port: number): void {
  try {
    console.log(`Checking port ${port}...`);

    const os = getOS();
    let pids: string[] = [];

    if (os === "windows") {
      // Windows: Use netstat to find PID
      try {
        const netstatResult = execSync(`netstat -ano | findstr :${port}`, {
          encoding: "utf8",
        });
        const lines = netstatResult.trim().split("\n");
        lines.forEach((line) => {
          const parts = line.trim().split(/\s+/);
          const pid = parts[parts.length - 1];
          if (pid && pid !== "0" && !isNaN(Number(pid))) {
            pids.push(pid);
          }
        });
      } catch (error) {
        // No process found
      }
    } else {
      // Linux/Mac: Use lsof or fuser
      try {
        execSync("which lsof", { stdio: "ignore" });
        // Try lsof - if it fails, no process is using the port
        try {
          const result = execSync(`lsof -ti :${port}`, { encoding: "utf8" });
          pids = result.trim().split("\n").filter(Boolean);
        } catch (error) {
          // No process found - pids stays empty
        }
      } catch (error) {
        // lsof not found, try fuser
        try {
          execSync("which fuser", { stdio: "ignore" });
          const result = execSync(`fuser -n tcp ${port}`, { encoding: "utf8" });
          const match = result.match(/\d+/g);
          if (match) pids = match;
        } catch (err) {
          console.log(
            `⚠️  Could not find lsof or fuser. Skipping port ${port} cleanup.`
          );
          return;
        }
      }
    }

    // Remove duplicates
    pids = [...new Set(pids)];

    if (pids.length > 0) {
      console.log(`🔪 Killing ${pids.length} process(es) on port ${port}...`);
      pids.forEach((pid) => {
        try {
          if (os === "windows") {
            execSync(`taskkill /F /PID ${pid}`, { stdio: "ignore" });
          } else {
            execSync(`kill -9 ${pid}`, { stdio: "ignore" });
          }
        } catch (error) {
          console.log(`⚠️  Could not kill process ${pid} (may require admin)`);
        }
      });
      console.log(`✅ Port ${port} is now free`);
    } else {
      console.log(`✅ Port ${port} is already free`);
    }
  } catch (error) {
    console.log(`⚠️  Error checking port ${port}: ${error.message}`);
  }
}

/**
 * Verify that a port is actually free
 */
export function verifyPort(port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const server = createServer();

    server.listen(port, () => {
      const actualPort = server.address()?.port;
      server.close(() => {
        resolve(actualPort === port);
      });
    });

    server.on("error", () => {
      resolve(false);
    });

    // Timeout after 100ms
    setTimeout(() => resolve(false), 100);
  });
}

/**
 * Clean up ports and verify they're free
 */
export async function cleanupAndVerifyPorts(
  frontendPort: number,
  backendPort: number
): Promise<void> {
  console.log("🧹 Cleaning up ports...\n");
  killPort(frontendPort);
  killPort(backendPort);
  console.log("\n✨ Ports are ready!\n");

  // Verify ports are actually free (with small delay for OS to release)
  console.log("🔍 Verifying ports are free...\n");

  // Wait a bit for OS to release ports
  await new Promise((resolve) => setTimeout(resolve, 500));

  const [frontendOk, backendOk] = await Promise.all([
    verifyPort(frontendPort),
    verifyPort(backendPort),
  ]);

  if (!frontendOk) {
    console.log(`⚠️  Warning: Port ${frontendPort} may still be in use`);
  }
  if (!backendOk) {
    console.log(`⚠️  Warning: Port ${backendPort} may still be in use`);
  }
  if (frontendOk && backendOk) {
    console.log("✅ All ports verified free\n");
  }
}

/**
 * Find an available port starting from the given port
 */
export function findAvailablePort(startPort: number): Promise<number> {
  return new Promise((resolve, reject) => {
    const server = createServer();

    server.listen(startPort, () => {
      const port = (server.address() as { port: number })?.port;
      server.close(() => resolve(port));
    });

    server.on("error", (err: NodeJS.ErrnoException) => {
      if (err.code === "EADDRINUSE") {
        // Try next port
        findAvailablePort(startPort + 1)
          .then(resolve)
          .catch(reject);
      } else {
        reject(err);
      }
    });
  });
}
