// ChatContext.js
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import useLocalStorage from "@hooks/useLocalStorage";

const ChatContext = React.createContext(null);

export const ChatProvider = ({ children }) => {
  const models = ["mistral", "llama3.1:8b"];
  const [prompt, setPrompt] = useState("");
  const [userPromptPlaceholder, setUserPromptPlaceholder] = useState(null);
  const [responseStream, setResponseStream] = useState("");
  const [currentModel, setCurrentModel] = useLocalStorage(
    "currentOfflineModel",
    models[0]
  );
  const [errorMessage, setErrorMessage] = useState(null);

  const [systemMessage, setSystemMessage] = useLocalStorage(
    "systemMessage",
    "You are a helpful personal assistant. Please reply in Markdown format when necessary for headings, links, bold, etc."
  );
  const [responseStreamLoading, setResponseStreamLoading] = useState(false);
  const [conversationHistory, setConversationHistory] = useLocalStorage(
    "conversationHistory",
    []
  );

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversationHistory, responseStream, userPromptPlaceholder]);

  const handleAskPrompt = async (event) => {
    event.preventDefault();
    const userPrompt = prompt;
    if (!userPrompt) return;

    setPrompt("");
    setUserPromptPlaceholder(userPrompt);

    setResponseStream("");
    setResponseStreamLoading(true);

    try {
      const res = await fetch("http://localhost:3000/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          conversationHistory,
          prompt: userPrompt,
          model: currentModel,
          systemMessage,
        }),
      });

      const reader = res.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let botresponseStream = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        botresponseStream += chunk;
        setResponseStream((prev) => prev + chunk);
      }

      // Update conversation history with bot's responseStream
      setConversationHistory((prevHistory) => [
        ...prevHistory,
        { role: "user", content: userPrompt },
        { role: "assistant", content: botresponseStream },
      ]);
    } catch (error) {
      console.error("Error asking question:", error);
      setErrorMessage("An error occurred. Please try again.");
    } finally {
      setResponseStreamLoading(false);
      setUserPromptPlaceholder(null);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleAskPrompt(event);
    }
  };

  return (
    <ChatContext.Provider
      value={{
        prompt,
        setPrompt,
        userPromptPlaceholder,
        responseStream,
        currentModel,
        setCurrentModel,
        errorMessage,
        setErrorMessage,
        systemMessage,
        setSystemMessage,
        responseStreamLoading,
        conversationHistory,
        setConversationHistory,
        handleAskPrompt,
        handleKeyDown,
        messagesEndRef,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => useContext(ChatContext);
