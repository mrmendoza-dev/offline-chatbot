import React, { useState } from "react";
import useLocalStorage from "@hooks/useLocalStorage";
import LoaderButton from "@components/ui/LoaderButton";
import { marked } from "marked";



const models = [
  "mistral", "llama3.1:8b"
]


const ChatComponent = () => {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [currentModel, setCurrentModel] = useLocalStorage("currentOfflineModel", models[0]);

  const [systemMessage, setSystemMessage] = useLocalStorage("systemMessage", "You are a helpful personal assistant. Please reply in Markdown format when necessary for headings, links, bold, etc.");
  const [responseLoading, setResponseLoading] = useState(false);






  const handleAskPrompt = async (event) => {
    event.preventDefault();

    try {
      setResponseLoading(true);
      setPrompt("");
      const res = await fetch("http://localhost:3000/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt, model: currentModel, systemMessage }),
      });
      const data = await res.text();
      console.log(data);
      setResponse(data);
    } catch (error) {
      setResponse("An error occurred while processing your request.");
    } finally {
      setResponseLoading(false);
    }
  };

    const handleKeyDown = (event) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        handleAskPrompt(event);
      }
    };


    //   const customRenderer: any = new marked.Renderer();
    //   customRenderer.heading = (text, level) => {
    //     console.log(text, level);
    // return `<h${level} class="text-gray-900 dark:text-white">${text}</h${level}>`;
    //   };


    //   const htmlContent = marked(response, {
    //     renderer: customRenderer,
    //   });
    //   console.log(response);



  return (
    <div className="mx-auto w-full max-w-xl p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 text-left">
      <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">
        <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">
          Ollama Chatbot
        </h5>
      </h5>

      <form className="max-w-lg" action="">
        <div className="mb-6 model">
          <label
            htmlFor="modelSelect"
            className="block mb-2 text-base font-medium text-gray-900 dark:text-white"
          >
            Model select
          </label>

          <select
            id="modelSelect"
            className="block w-full p-2 mb-6 text-base text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            value={currentModel}
            onChange={(e) => setCurrentModel(e.target.value)}
          >
            {models.map((model) => (
              <option key={model} value={model}>
                {model}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-6">
          <label className="block mb-2 text-base font-medium text-gray-900 dark:text-white">
            System Message
          </label>
          <textarea
            value={systemMessage}
            onChange={(e) => setSystemMessage(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-base rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
        </div>

        <div className="mb-6">
          <label className="block mb-2 text-base font-medium text-gray-900 dark:text-white">
            Prompt
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-base rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
        </div>

        <LoaderButton
          onClick={handleAskPrompt}
          className="py-2.5 px-5 me-2 mb-2 text-base font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
          isLoading={responseLoading}
          loadingText="Generating..."
        >
          Ask
        </LoaderButton>
      </form>

      <div className="max-w-full">
        <div className="chatbot-message max-h-96 overflow-y-auto overflow-y-auto text-base text-gray-700 dark:text-gray-400">
          <div
            className="markdown w-full break-words"
            dangerouslySetInnerHTML={{
              // __html: htmlContent,
              __html: marked(response),
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatComponent;
