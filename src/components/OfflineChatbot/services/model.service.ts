import type { ChatRequest, OllamaModel } from "../types/chat.types";
import {
  BASE_URL,
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
