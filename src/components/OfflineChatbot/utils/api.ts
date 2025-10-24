import axios from "axios";

const PORT = import.meta.env.VITE_API_PORT || 3001;
export const BASE_URL = `http://localhost:${PORT}`;
const OLLAMA_BASE_URL = "http://localhost:11434/api";

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const ollamaClient = axios.create({
  baseURL: OLLAMA_BASE_URL,
});

export const handleApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "An unexpected error occurred";
};

export const endpoints = {
  chat: "/ask",
  health: "/health",
  ollama: {
    tags: "/tags",
  },
} as const;
