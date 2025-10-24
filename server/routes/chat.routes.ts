import express, { Request, Response } from "express";
import ollama from "ollama";
import type { ChatRequestBody } from "../types/chat.types";

const router = express.Router();

router.post("/ask", async (req: Request, res: Response) => {
  try {
    const { conversationHistory, prompt, model, systemMessage, images } =
      req.body as ChatRequestBody;

    if (!prompt || !model) {
      return res.status(400).json({ error: "Missing required fields" });
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
    });

    for await (const part of response) {
      res.write(part.message.content);
    }

    res.end();
  } catch (error) {
    console.error("Error processing chat request:", error);
    res.status(500).send("An error occurred while processing your request.");
  }
});

export default router;
