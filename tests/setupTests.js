import "@testing-library/jest-dom";
import { vi } from "vitest";

// Mock pdfjs-dist to avoid DOMMatrix errors in Node.js test environment
vi.mock("pdfjs-dist", () => ({
  default: {
    GlobalWorkerOptions: {
      workerSrc: "",
    },
    version: "5.4.296",
    getDocument: vi.fn(() => ({
      promise: Promise.resolve({
        numPages: 0,
        getPage: vi.fn(),
      }),
    })),
  },
  GlobalWorkerOptions: {
    workerSrc: "",
  },
  version: "5.4.296",
  getDocument: vi.fn(() => ({
    promise: Promise.resolve({
      numPages: 0,
      getPage: vi.fn(),
    }),
  })),
}));

// Ensure localStorage is properly available
// jsdom should provide this, but we ensure it's working correctly
if (typeof window !== "undefined") {
  // Create a proper localStorage implementation if it doesn't exist or is broken
  const createLocalStorage = () => {
    const store = {};
    return {
      getItem: (key) => {
        return store[key] || null;
      },
      setItem: (key, value) => {
        store[key] = String(value);
      },
      removeItem: (key) => {
        delete store[key];
      },
      clear: () => {
        Object.keys(store).forEach((key) => delete store[key]);
      },
      get length() {
        return Object.keys(store).length;
      },
      key: (index) => {
        const keys = Object.keys(store);
        return keys[index] || null;
      },
    };
  };

  // Check if localStorage exists and has the required methods
  if (!window.localStorage || typeof window.localStorage.getItem !== "function") {
    window.localStorage = createLocalStorage();
  }
  
  // Also ensure global localStorage is available
  if (typeof global !== "undefined" && (!global.localStorage || typeof global.localStorage.getItem !== "function")) {
    global.localStorage = window.localStorage;
  }
}
