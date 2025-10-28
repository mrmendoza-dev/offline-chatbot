import * as webllm from "@mlc-ai/web-llm";

export interface WebLLMInitOptions {
  temperature?: number;
  top_p?: number;
}

export interface WebLLMMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface WebLLMChatCompletionRequest {
  stream: boolean;
  messages: WebLLMMessage[];
  temperature?: number;
  top_p?: number;
  seed?: number;
}

export interface WebLLMChatCompletionChunk {
  choices: Array<{
    delta?: {
      content?: string | null;
    };
  }>;
}

export type WebLLMInitProgressCallback = (
  text: string,
  progress: number
) => void;

export class WebLLMManager {
  private engine: webllm.MLCEngine | null = null;
  private currentModel: string | null = null;
  private onProgressCallback: WebLLMInitProgressCallback | null = null;

  async initialize(
    model: string,
    onProgress?: WebLLMInitProgressCallback
  ): Promise<void> {
    if (this.currentModel === model && this.engine) {
      return;
    }

    if (!this.engine) {
      this.engine = new webllm.MLCEngine();
    }

    this.onProgressCallback = onProgress || null;

    if (onProgress) {
      this.engine.setInitProgressCallback((report) => {
        onProgress(report.text, report.progress);
      });
    }

    await this.engine.reload(model, {
      temperature: 1.0,
      top_p: 1,
    });

    this.currentModel = model;
  }

  async createCompletion(
    request: WebLLMChatCompletionRequest
  ): Promise<AsyncIterable<WebLLMChatCompletionChunk>> {
    if (!this.engine) {
      throw new Error("WebLLM engine not initialized");
    }

    const completion = await this.engine.chat.completions.create(request);

    // Type assertion needed due to WebLLM's internal types
    return completion as unknown as AsyncIterable<WebLLMChatCompletionChunk>;
  }

  getCurrentModel(): string | null {
    return this.currentModel;
  }

  isInitialized(): boolean {
    return this.engine !== null && this.currentModel !== null;
  }

  async cleanup(): Promise<void> {
    // Cleanup logic if needed
    this.engine = null;
    this.currentModel = null;
    this.onProgressCallback = null;
  }
}

export const webLLMManager = new WebLLMManager();
