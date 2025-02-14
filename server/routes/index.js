
import express from "express";
import ollama from "ollama";

const router = express.Router();



router.post("/ask", async (req, res) => {
  const { conversationHistory, prompt, model, systemMessage, images } =
    req.body;

  try {
    res.setHeader("Content-Type", "text/plain");
    res.setHeader("Transfer-Encoding", "chunked");

    const system = {
      role: "system",
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
          role: "user",
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
    res.status(500).send("An error occurred while processing your request.");
    console.log(error);
  }
});

export default router;
