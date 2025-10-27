/**
 * Server logging utilities with color-coded badges for easy visual parsing
 */

const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  magenta: "\x1b[35m",
  gray: "\x1b[90m",
};

export const logger = {
  info: (message: string, ...args: unknown[]) => {
    console.log(`${colors.blue}[INFO]${colors.reset} ${message}`, ...args);
  },

  success: (message: string, ...args: unknown[]) => {
    console.log(`${colors.green}[SUCCESS]${colors.reset} ${message}`, ...args);
  },

  warning: (message: string, ...args: unknown[]) => {
    console.warn(
      `${colors.yellow}[WARNING]${colors.reset} ${message}`,
      ...args
    );
  },

  error: (message: string, ...args: unknown[]) => {
    console.error(`${colors.red}[ERROR]${colors.reset} ${message}`, ...args);
  },

  request: (message: string, ...args: unknown[]) => {
    console.log(`${colors.cyan}[REQUEST]${colors.reset} ${message}`, ...args);
  },

  response: (message: string, ...args: unknown[]) => {
    console.log(`${colors.cyan}[RESPONSE]${colors.reset} ${message}`, ...args);
  },

  stream: (message: string, ...args: unknown[]) => {
    console.log(`${colors.magenta}[STREAM]${colors.reset} ${message}`, ...args);
  },

  model: (message: string, ...args: unknown[]) => {
    console.log(`${colors.blue}[MODEL]${colors.reset} ${message}`, ...args);
  },

  port: (message: string, ...args: unknown[]) => {
    console.log(`${colors.green}[PORT]${colors.reset} ${message}`, ...args);
  },

  cleanup: (message: string, ...args: unknown[]) => {
    console.log(`${colors.gray}[CLEANUP]${colors.reset} ${message}`, ...args);
  },
};
