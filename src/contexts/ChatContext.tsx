import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import useLocalStorage from "@hooks/useLocalStorage";

const ChatContext = createContext(null);

export const ChatProvider = ({ children }) => {
  const [models, setModels] = useState([]);

  // Fetches the installed models from the Ollama API, port 11434 is the default port for Ollama
  async function fetchInstalledModels() {
    try {
      const response = await fetch("http://localhost:11434/api/tags");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setModels(data.models);
      return data.models;
    } catch (error) {
      console.error("Failed to fetch models:", error);
      return [];
    }
  }

  useEffect(() => {
    fetchInstalledModels();
  }, []);

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

  const generateFileString = () => {
    if (uploadedFiles.length > 0) {
      return uploadedFiles
        .map((file) => {
          return `File Name: ${file.name}\nFile Type: ${file.type}\nContent:\n${file.content}\n\n`;
        })
        .join("--------------------------------------------------\n");
    }
    return "";
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversationHistory, responseStream, userPromptPlaceholder]);

  const handleAskPrompt = async (event) => {
    event.preventDefault();
    if (!prompt) return;

    let userPrompt = "";

    userPrompt = prompt;

    if (uploadedFiles.length > 0) {
      const fileString = generateFileString();
      userPrompt = `${prompt}\n\nUploaded files: ${fileString}`;
    } else {
      userPrompt = prompt;
    }

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
      setUploadedFiles([]);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleAskPrompt(event);
    }
  };

  const handleFileUpload = async (event) => {
    const files = Array.from(event.target.files);
    const acceptedFileTypes = ["application/json", "text/plain", "text/csv"];

    const newFiles = await Promise.all(
      files
        .filter((file) => acceptedFileTypes.includes(file.type))
        .map(async (file) => {
          const content = await readFileContent(file);
          return {
            name: file.name,
            size: file.size,
            type: file.type,
            lastModified: file.lastModified,
            url: URL.createObjectURL(file),
            content: content,
          };
        })
    );
    setUploadedFiles((prevFiles) => [...prevFiles, ...newFiles]);
  };

  const readFileContent = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
      reader.readAsText(file);
    });
  };

  const removeFile = (index) => {
    setUploadedFiles((prevFiles) => prevFiles.filter((file, i) => i !== index));
  };

  const [uploadedFiles, setUploadedFiles] = useState([]);

  const resetChat = () => {
    setConversationHistory([]);
    setUploadedFiles([]);
    setPrompt("");
    setResponseStream("");
    setResponseStreamLoading(false);
  };

  return (
    <ChatContext.Provider
      value={{
        models,
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
        handleFileUpload,
        removeFile,
        uploadedFiles,
        setUploadedFiles,
        resetChat,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => useContext(ChatContext);
