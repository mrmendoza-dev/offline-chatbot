export interface ModelOptions {
  temperature: number;
  top_p: number;
  seed?: number;
}

export interface ChatRequestBody {
  conversationHistory: Array<{
    role: "user" | "assistant" | "system";
    content: string;
    images?: string[];
  }>;
  prompt: string;
  model: string;
  systemMessage: string;
  images?: string[];
  options?: ModelOptions;
}

export interface OllamaMessage {
  role: "user" | "assistant" | "system";
  content: string;
  images?: string[];
}
