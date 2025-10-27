import express, { Request, Response } from "express";
import ollama from "ollama";
import type { ChatRequestBody } from "../types/chat.types";
import { logger } from "../utils/logger.js";

const router = express.Router();

router.post("/ask", async (req: Request, res: Response) => {
  const startTime = Date.now();

  try {
    const {
      conversationHistory,
      prompt,
      model,
      systemMessage,
      images,
      options,
    } = req.body as ChatRequestBody;

    logger.request(
      `Chat request - Model: ${model}, Prompt: ${prompt?.length || 0} chars`
    );

    if (!model) {
      logger.error("Missing model field");
      return res.status(400).json({ error: "Missing model" });
    }

    if (
      !prompt &&
      (!images || images.length === 0) &&
      (!conversationHistory || conversationHistory.length === 0)
    ) {
      logger.error("No input provided");
      return res
        .status(400)
        .json({ error: "Provide prompt, images, or conversation history" });
    }

    res.setHeader("Content-Type", "text/plain");
    res.setHeader("Transfer-Encoding", "chunked");

    const system = {
      role: "system" as const,
      content: systemMessage,
    };

    const messages = conversationHistory
      ? [system, ...conversationHistory]
      : [system];

    logger.model(`Starting Ollama chat stream for: ${model}`);

    const response = await ollama.chat({
      model: model,
      messages: [
        ...messages,
        {
          role: "user" as const,
          content: prompt,
          images: images,
        },
      ],
      stream: true,
      options: options
        ? {
            temperature: options.temperature,
            top_p: options.top_p,
            seed: options.seed,
          }
        : undefined,
    });

    let chunkCount = 0;
    let charCount = 0;

    for await (const part of response) {
      const content = part.message.content;
      if (content) {
        const writeSuccess = res.write(content);
        chunkCount++;
        charCount += content.length;

        if (chunkCount === 1) {
          logger.stream(`First chunk sent (${content.length} chars)`);
        }

        if (!writeSuccess) {
          logger.warning("Write buffer full, pausing");
          await new Promise((resolve) => res.once("drain", resolve));
        }
      }
    }

    const duration = Date.now() - startTime;
    logger.success(
      `Stream complete: ${chunkCount} chunks, ${charCount} chars, ${duration}ms`
    );

    res.end();
  } catch (error) {
    logger.error("Chat request failed:", error);
    if (!res.headersSent) {
      res.status(500).send("An error occurred while processing your request.");
    }
  }
});

export default router;
