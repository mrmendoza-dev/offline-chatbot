
import express from "express";
import ollama from "ollama";

const router = express.Router();

router.post("/ask", async (req, res) => {
  const { conversationHistory, prompt, model, systemMessage } = req.body;
  if (!prompt) {
    return res
      .status(400)
      .send("Please provide a question in the request body.");
  }

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
      messages: [...messages, { role: "user", content: prompt }],
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
