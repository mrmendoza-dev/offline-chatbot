import * as webllm from "@mlc-ai/web-llm";
import type { ChatRequest, OllamaModel } from "../types/chat.types";

let webLLMEngine: webllm.MLCEngine | null = null;
let currentWebLLMModel: string | null = null;

export const initializeWebLLM = async (
  model: string,
  onProgress?: (text: string, progress: number) => void
): Promise<void> => {
  if (!webLLMEngine) {
    webLLMEngine = new webllm.MLCEngine();
  }

  if (currentWebLLMModel === model) {
    return;
  }

  webLLMEngine.setInitProgressCallback((report) => {
    if (onProgress) {
      onProgress(report.text, report.progress);
    }
  });

  await webLLMEngine.reload(model, {
    temperature: 1.0,
    top_p: 1,
  });

  currentWebLLMModel = model;
};

// Helper to estimate token count (rough approximation)
const estimateTokens = (text: string): number => {
  // Rough approximation: 1 token ≈ 4 characters for English text
  return Math.ceil(text.length / 4);
};

// Truncate conversation history to fit within context window
const truncateConversationHistory = (
  history: ChatRequest["conversationHistory"],
  systemMessage: string,
  prompt: string,
  maxTokens: number = 800
): ChatRequest["conversationHistory"] => {
  const systemTokens = estimateTokens(systemMessage);
  const promptTokens = estimateTokens(prompt);
  const reservedTokens = systemTokens + promptTokens + 100; // +100 buffer
  const availableTokens = maxTokens - reservedTokens;

  if (availableTokens <= 0) {
    // If even the prompt is too large, return empty history
    return [];
  }

  // Calculate tokens used by history, going backwards
  let tokensUsed = 0;
  const truncatedHistory: ChatRequest["conversationHistory"] = [];

  for (let i = history.length - 1; i >= 0; i--) {
    const messageTokens = estimateTokens(history[i].content || "");
    if (tokensUsed + messageTokens > availableTokens) {
      break;
    }
    tokensUsed += messageTokens;
    truncatedHistory.unshift(history[i]);
  }

  return truncatedHistory;
};

export const sendWebLLMMessage = async (
  request: ChatRequest,
  signal?: AbortSignal
): Promise<ReadableStream<Uint8Array>> => {
  // Auto-initialize engine if not already loaded or if model changed
  if (!webLLMEngine || currentWebLLMModel !== request.model) {
    try {
      await initializeWebLLM(request.model);
    } catch (error) {
      throw new Error(
        `Failed to initialize WebLLM model: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  const encoder = new TextEncoder();
  let bufferRef = "";

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        // Truncate conversation history to fit within small context window
        const truncatedHistory = truncateConversationHistory(
          request.conversationHistory,
          request.systemMessage,
          request.prompt,
          800 // Conservative limit for browser models
        );

        const messages = [
          { role: "system" as const, content: request.systemMessage },
          ...truncatedHistory,
          {
            role: "user" as const,
            content: request.prompt,
          },
        ];

        const completion = await webLLMEngine!.chat.completions.create({
          stream: true,
          messages: messages as any,
          temperature: request.options?.temperature ?? 1.0,
          top_p: request.options?.top_p ?? 1.0,
          seed: request.options?.seed,
        });

        let raf: number | null = null;
        const flush = () => {
          const encoded = encoder.encode(bufferRef);
          if (encoded.length > 0 && !signal?.aborted) {
            controller.enqueue(encoded);
          }
          bufferRef = "";
          raf = null;
        };

        for await (const chunk of completion) {
          if (signal?.aborted) {
            controller.close();
            return;
          }

          const delta = chunk.choices[0]?.delta?.content;
          if (delta) {
            bufferRef += delta;
            if (!raf) {
              raf = requestAnimationFrame(flush);
            }
          }
        }

        // Flush remaining buffer
        if (bufferRef) {
          flush();
        }

        controller.close();
      } catch (error) {
        controller.error(error);
      }
    },
    cancel() {
      // Handle cancellation
      bufferRef = "";
    },
  });

  return stream;
};

export const fetchWebLLMModels = (): OllamaModel[] => {
  return webllm.prebuiltAppConfig.model_list.map((m) => ({
    name: m.model_id,
    model: m.model_id,
    modified_at: new Date().toISOString(),
    size: 0, // WebLLM models are downloaded dynamically
    digest: "",
    provider: "webllm" as const,
    details: {
      format: "webllm",
      family: m.model_id.split("-")[0] || "unknown",
      families: null,
      parameter_size: m.model_id.includes("1B")
        ? "1B"
        : m.model_id.includes("3B")
        ? "3B"
        : m.model_id.includes("7B")
        ? "7B"
        : "unknown",
      quantization_level: m.model_id.includes("q4") ? "q4" : "unknown",
    },
  }));
};

export const isWebLLMModel = (model: OllamaModel | null): boolean => {
  return model?.provider === "webllm";
};
