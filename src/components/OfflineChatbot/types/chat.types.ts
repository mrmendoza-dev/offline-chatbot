import type { AttachmentMetadata } from "./attachment.types";

export interface OllamaModel {
  name: string;
  model: string;
  modified_at: string;
  size: number;
  digest: string;
  details: {
    format: string;
    family: string;
    families: string[] | null;
    parameter_size: string;
    quantization_level: string;
  };
}

export interface LoadedModel {
  name: string;
  id: string;
  size: string;
  processor: string;
  context: string;
  until: string;
}

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
  images?: string[];
  attachments?: AttachmentMetadata[];
}

export interface ConversationHistory extends Array<ChatMessage> {}

export interface SystemMessage {
  role: "system";
  content: string;
}

export interface ChatRequest {
  conversationHistory: ConversationHistory;
  prompt: string;
  model: string;
  systemMessage: string;
  images?: string[];
}

export interface ChatStreamResponse {
  stream: string;
  isLoading: boolean;
}
