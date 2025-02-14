import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import useLocalStorage from "@/hooks/useLocalStorage";
import { useFileUpload } from "@/contexts/FileUploadContext";
import { toast } from "@/hooks/use-toast";

const PORT = import.meta.env.VITE_PORT;

const ChatContext = createContext(null);

export const ChatProvider = ({ children }: any) => {
  const { uploadedFiles, setUploadedFiles }: any = useFileUpload();

  const [models, setModels] = useState([]);
  const [currentModel, setCurrentModel] = useLocalStorage(
    "currentOfflineModel",
    models[0]
  );
  const [prompt, setPrompt] = useState("");
  const [userPromptPlaceholder, setUserPromptPlaceholder] = useState(null);
  const [responseStream, setResponseStream] = useState("");

  const [responseStreamLoading, setResponseStreamLoading] = useState(false);

  const [systemMessage, setSystemMessage] = useLocalStorage(
    "systemMessage",
    "You are a helpful personal assistant. Please reply in Markdown format when necessary for headings, links, bold, etc."
  );
  const [conversationHistory, setConversationHistory] = useLocalStorage(
    "conversationHistory",
    []
  );
  const messagesEndRef = useRef<any>(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const generateFileString = () => {
    if (uploadedFiles.length > 0) {
      return uploadedFiles
        .map((file: any) => {
          return `File Name: ${file.name}\nFile Type: ${file.type}\nContent:\n${file.content}\n\n`;
        })
        .join("--------------------------------------------------\n");
    }
    return "";
  };

  const handleAskPrompt = async (event: any) => {
    event.preventDefault();
    if (!prompt) {
      toast({
        description: "Please enter a prompt.",
      });
      return;
    }
    if (!currentModel) {
      toast({
        description: "Please select a model.",
      });
      return;
    }

    let userPrompt: any = prompt;
    if (uploadedFiles.length > 0) {
      const fileString = generateFileString();
      userPrompt = `${prompt}\n\nUploaded files: ${fileString}`;
    }

    setPrompt("");
    setUserPromptPlaceholder(userPrompt);
    setResponseStream("");
    setResponseStreamLoading(true);

    try {
      const res: any = await fetch(`http://localhost:${PORT}/ask`, {
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

      console.log("Response:", res);

      if (res && res.status == 404) {
        toast({
          description: `Error fetching response. Make sure server is running at http://localhost:${PORT}`,
        });
        return;
      }

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

      setConversationHistory((prevHistory: any) => [
        ...prevHistory,
        { role: "user", content: userPrompt },
        { role: "assistant", content: botresponseStream },
      ]);
    } catch (error) {
      console.error("Error fetching response:", error);
      toast({
        description: "Error fetching response.",
      });
    } finally {
      setResponseStreamLoading(false);
      setUserPromptPlaceholder(null);
      setUploadedFiles([]);
    }
  };

  const handleKeyDown = (event: any) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleAskPrompt(event);
    }
  };

  const resetChat = () => {
    setConversationHistory([]);
    setUploadedFiles([]);
    setPrompt("");
    setResponseStream("");
    setResponseStreamLoading(false);
  };

  useEffect(() => {
    async function fetchModels() {
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
        toast({
          description:
            "Failed to fetch models. Make sure your models are stored in default directory.",
        });
        return [];
      }
    }

    fetchModels();
  }, []);

  useEffect(() => {
    if (models.length > 0 && !currentModel) {
      setCurrentModel(models[0]);
    }
  }, [models]);

  useEffect(() => {
    scrollToBottom();
  }, [conversationHistory, responseStream, userPromptPlaceholder]);
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
        systemMessage,
        setSystemMessage,
        responseStreamLoading,
        conversationHistory,
        setConversationHistory,
        handleAskPrompt,
        handleKeyDown,
        messagesEndRef,
        resetChat,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => useContext(ChatContext);
