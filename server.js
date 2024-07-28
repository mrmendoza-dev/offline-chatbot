import express from "express";
import cors from "cors";
import ollama from "ollama";

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());


console.log("Starting server...");




app.post("/ask", async (req, res) => {
  const { question } = req.body;
  if (!question) {
    res.status(400).send("Please provide a question in the request body.");
  } else {
    try {
      const response = await ollama.chat({
        model: "mistral",
        messages: [
          { role: "system", content: "You are a helpful personal assistant. Please reply in Markdown format when necessary for headings, links, bold, etc." },
          { role: "user", content: question },
        ],
      });
      res.status(200).send(response.message.content);
    } catch (error) {
      res.status(500).send("An error occurred while processing your request.");
    }
  }
});




app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
