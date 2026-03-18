import type {
  ChatRequest,
  LoadedModel,
  OllamaModel,
} from "../types/chat.types";
import { BASE_URL, apiClient, handleApiError } from "../utils/api";
import { sendWebLLMMessage } from "./provider.service";

export const fetchModels = async (): Promise<OllamaModel[]> => {
  try {
    const response = await apiClient.get("/models");
    const models = response.data.models || [];
    // Add provider field to all Ollama models
    return models.map((model: OllamaModel) => ({
      ...model,
      provider: "ollama" as const,
    }));
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
    await apiClient.post("/models/load", { model: modelName });
  } catch (error) {
    console.error("Failed to load model:", error);
    throw new Error(handleApiError(error));
  }
};

export const sendChatMessage = async (
  request: ChatRequest,
  signal?: AbortSignal
): Promise<ReadableStream<Uint8Array>> => {
  // Route to WebLLM if provider is webllm
  if (request.provider === "webllm") {
    return sendWebLLMMessage(request, signal);
  }

  // Otherwise use Ollama backend
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
