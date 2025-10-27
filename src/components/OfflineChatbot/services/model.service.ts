import type {
  ChatRequest,
  LoadedModel,
  OllamaModel,
} from "../types/chat.types";
import {
  BASE_URL,
  apiClient,
  endpoints,
  handleApiError,
  ollamaClient,
} from "../utils/api";

export const fetchModels = async (): Promise<OllamaModel[]> => {
  try {
    const response = await ollamaClient.get(endpoints.ollama.tags);
    return response.data.models || [];
  } catch (error) {
    console.error("Failed to fetch models:", error);
    throw new Error(handleApiError(error));
  }
};

export const fetchLoadedModels = async (): Promise<LoadedModel[]> => {
  try {
    const response = await apiClient.get("/models/loaded");
    return response.data.models || [];
  } catch (error) {
    console.error("Failed to fetch loaded models:", error);
    throw new Error(handleApiError(error));
  }
};

export const loadModel = async (modelName: string): Promise<void> => {
  try {
    // Send a minimal request to Ollama to load the model into memory
    await ollamaClient.post("/generate", {
      model: modelName,
      prompt: "",
      stream: false,
      keep_alive: "5m", // Keep model loaded for 5 minutes
    });
  } catch (error) {
    console.error("Failed to load model:", error);
    throw new Error(handleApiError(error));
  }
};

export const sendChatMessage = async (
  request: ChatRequest,
  signal?: AbortSignal
): Promise<ReadableStream<Uint8Array>> => {
  const response = await fetch(`${BASE_URL}/ask`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
    signal,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  if (!response.body) {
    throw new Error("Response body is null");
  }

  return response.body;
};
