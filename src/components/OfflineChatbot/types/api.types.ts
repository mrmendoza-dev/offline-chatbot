export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

export interface OllamaApiResponse {
  models: OllamaModel[];
}

export interface OllamaTagsResponse {
  models: OllamaModel[];
}

import type { OllamaModel } from "./chat.types";
