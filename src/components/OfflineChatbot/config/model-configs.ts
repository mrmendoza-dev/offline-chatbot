import type { OllamaModel } from "../types/chat.types";

/**
 * Simple helper to check if a model supports vision based on model name/family
 * This is a best-guess heuristic that works for most models
 */
export const modelSupportsVision = (model: OllamaModel | null): boolean => {
  if (!model) return false;

  // Check provider
  if (model.provider === "webllm") {
    return false; // WebLLM models typically don't support vision
  }

  // Check if model name includes vision-related keywords
  const modelName = model.name.toLowerCase();
  if (
    modelName.includes("vision") ||
    modelName.includes("llava") ||
    modelName.includes("bakllava")
  ) {
    return true;
  }

  // Check family details
  const family = Array.isArray(model.details.families)
    ? model.details.families.join(" ")
    : model.details.family || "";

  return family.toLowerCase().includes("vision");
};
