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
}

export interface OllamaMessage {
  role: "user" | "assistant" | "system";
  content: string;
  images?: string[];
}
