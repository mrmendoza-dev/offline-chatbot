import { getEncoding, type Tiktoken } from "js-tiktoken";
import type { ChatMessage } from "../types/chat.types";

export interface TokenUsage {
  used: number;
  limit: number;
  available: number;
  percentage: number;
}

export class TokenService {
  private encoder: Tiktoken;

  constructor(modelName?: string) {
    // Use cl100k_base encoding (GPT-4) as default for most models
    try {
      this.encoder = getEncoding("cl100k_base");
    } catch (error) {
      console.warn("Failed to initialize tokenizer:", error);
      throw error;
    }
  }

  countTokens(text: string): number {
    try {
      return this.encoder.encode(text).length;
    } catch (error) {
      console.warn("Token encoding failed, falling back to estimation:", error);
      // Fallback to character-based estimation
      return Math.ceil(text.length / 4);
    }
  }

  countMessageTokens(message: ChatMessage): number {
    let tokenCount = this.countTokens(message.content);

    // Add overhead for message structure
    tokenCount += 4; // Message structure overhead

    // Add image tokens if present
    if (message.images && message.images.length > 0) {
      // Approximate 170 tokens per image (GPT-4 vision estimate)
      tokenCount += message.images.length * 170;
    }

    // Add attachment content tokens if present
    if (message.attachments && message.attachments.length > 0) {
      for (const attachment of message.attachments) {
        if (attachment.content) {
          tokenCount += this.countTokens(attachment.content);
        }
      }
    }

    return tokenCount;
  }

  estimateContextUsage(
    messages: ChatMessage[],
    systemMessage: string,
    prompt: string
  ): TokenUsage {
    const systemTokens = this.countTokens(systemMessage);
    const promptTokens = this.countTokens(prompt);
    const messageTokens = messages.reduce(
      (sum, msg) => sum + this.countMessageTokens(msg),
      0
    );

    const totalUsed = systemTokens + promptTokens + messageTokens;

    return {
      used: totalUsed,
      limit: 0, // Set by caller
      available: 0, // Set by caller
      percentage: 0, // Set by caller
    };
  }

  /**
   * Validates that the conversation fits within context window
   * Throws an error with helpful message if it exceeds the limit
   */
  validateContextWindow(
    history: ChatMessage[],
    systemMessage: string,
    prompt: string,
    maxTokens: number,
    reservedBuffer: number = 100
  ): void {
    const systemTokens = this.countTokens(systemMessage);
    const promptTokens = this.countTokens(prompt);
    const historyTokens = history.reduce(
      (sum, msg) => sum + this.countMessageTokens(msg),
      0
    );

    const totalTokens =
      systemTokens + promptTokens + historyTokens + reservedBuffer;

    if (totalTokens > maxTokens) {
      const estimatedExcess = totalTokens - maxTokens;
      throw new Error(
        `Conversation exceeds context window by ~${estimatedExcess} tokens. ` +
          `Please reduce the conversation length or use a model with a larger context window. ` +
          `Current usage: ~${totalTokens}/${maxTokens} tokens`
      );
    }
  }

  cleanup(): void {
    // Note: js-tiktoken doesn't require explicit cleanup
    // The encoder is automatically garbage collected
  }
}

export const tokenService = new TokenService();
