import * as webllm from "@mlc-ai/web-llm";
import type { ChatRequest, OllamaModel } from "../types/chat.types";
import { webLLMManager } from "../types/webllm.types";
import { tokenService } from "./token.service";

export const initializeWebLLM = async (
  model: string,
  onProgress?: (text: string, progress: number) => void
): Promise<void> => {
  if (
    webLLMManager.isInitialized() &&
    webLLMManager.getCurrentModel() === model
  ) {
    return;
  }

  await webLLMManager.initialize(model, onProgress || undefined);
};

export const sendWebLLMMessage = async (
  request: ChatRequest,
  signal?: AbortSignal
): Promise<ReadableStream<Uint8Array>> => {
  // Auto-initialize engine if not already loaded or if model changed
  if (
    !webLLMManager.isInitialized() ||
    webLLMManager.getCurrentModel() !== request.model
  ) {
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
        // WebLLM models typically have smaller context windows
        // Conservative limit to avoid errors
        const webLLMContextWindow = 2048;

        // Validate context window usage
        tokenService.validateContextWindow(
          request.conversationHistory,
          request.systemMessage,
          request.prompt,
          webLLMContextWindow,
          100 // buffer
        );

        const messages = [
          { role: "system" as const, content: request.systemMessage },
          ...request.conversationHistory,
          {
            role: "user" as const,
            content: request.prompt,
          },
        ];

        const completion = await webLLMManager.createCompletion({
          stream: true,
          messages,
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
