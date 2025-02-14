import { useFileUpload } from "@/contexts/FileUploadContext";
import { toast } from "@/hooks/use-toast";
import useLocalStorage from "@/hooks/useLocalStorage";
import { checkFileType, convertImagesToBase64 } from "@/utils/fileUtility";
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

const PORT = import.meta.env.VITE_PORT;

interface ChatContextType {
  models: any[];
  prompt: string;
  setPrompt: React.Dispatch<React.SetStateAction<string>>;
  userPromptPlaceholder: string | null;
  responseStream: string;
  currentModel: any;
  setCurrentModel: any;
  systemMessage: string;
  setSystemMessage: (message: string) => void;
  responseStreamLoading: boolean;
  conversationHistory: any[];
  setConversationHistory: React.Dispatch<React.SetStateAction<any[]>>;
  handleAskPrompt: (event: any) => void;
  handleKeyDown: (event: any) => void;
  messagesEndRef: React.RefObject<any>;
  resetChat: () => void;
}

const ChatContext = createContext<ChatContextType | null>(null);

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

  const generateDocumentString = (documents: any[]) => {
    if (documents.length > 0) {
      return documents
        .map((file: any) => {
          return `File Name: ${file.name}\nFile Type: ${file.type}\nContent:\n${file.content}\n\n`;
        })
        .join("--------------------------------------------------\n");
    }
    return "";
  };

  const handleAskPrompt = async (event: any) => {
    event.preventDefault();

    if (!prompt && uploadedFiles.length == 0) {
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

    const uploadedImages = uploadedFiles.filter(
      (file: any) => checkFileType(file) == "image"
    );
    const uploadedDocuments = uploadedFiles.filter(
      (file: any) => checkFileType(file) == "document"
    );

    const filesList = uploadedFiles.map((file: any) => file.name).join(", ");

    const getDocumentText = (count: number) => {
      if (count === 0) return "";
      return `${count} ${count === 1 ? "Document" : "Documents"}`;
    };

    const getImageText = (count: number) => {
      if (count === 0) return "";
      return `${count} ${count === 1 ? "Image" : "Images"}`;
    };

    const filesSummary =
      uploadedFiles.length > 0
        ? `${prompt ? "\n" : ""}Uploaded Files: ${[
            getDocumentText(uploadedDocuments.length),
            getImageText(uploadedImages.length),
          ]
            .filter(Boolean)
            .join(" ")}\n${filesList}`
        : "";

    const displayPrompt: any = (prompt || "") + filesSummary;

    setUserPromptPlaceholder(displayPrompt);
    setPrompt("");
    setResponseStream("");
    setResponseStreamLoading(true);
    try {
      const base64Images =
        uploadedImages.length > 0
          ? await convertImagesToBase64(uploadedImages)
          : [];

      const documentString =
        uploadedDocuments.length > 0
          ? generateDocumentString(uploadedDocuments)
          : "";

      const combinedPrompt = documentString
        ? `${documentString}\n\n${prompt}`
        : prompt;

      const res: any = await fetch(`http://localhost:${PORT}/ask`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          conversationHistory,
          prompt: combinedPrompt,
          model: currentModel,
          systemMessage,
          images: base64Images,
        }),
      });

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

      const userMessageWithImages = {
        role: "user",
        content: displayPrompt,
        ...(base64Images.length && { images: base64Images }),
      };

      setConversationHistory((prevHistory: any) => [
        ...prevHistory,
        userMessageWithImages,
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
            "Failed to fetch models. Make sure your models are stored in default directory and server is running.",
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
