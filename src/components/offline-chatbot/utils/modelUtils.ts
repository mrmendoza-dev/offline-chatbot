import type { OllamaModel } from "../types/chat.types";

/**
 * Check if a model supports vision capabilities
 * Currently only Ollama vision models are supported
 * @param model - The model to check
 * @returns true if the model supports vision
 */
export const supportsVision = (model: OllamaModel | null): boolean => {
  if (!model) return false;

  // Disable vision for WebLLM models
  if (model.provider === "webllm") return false;

  // Check if Ollama model name contains vision indicators
  const visionKeywords = [
    "vision",
    "llava",
    "bakllava",
    "cogvlm",
    "moondream",
    "mini-cpm-v",
  ];
  const modelName = model.name.toLowerCase();

  return visionKeywords.some((keyword) => modelName.includes(keyword));
};
