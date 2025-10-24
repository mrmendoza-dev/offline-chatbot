import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { toast } from "sonner";
import { useLocalStorage } from "../hooks/useLocalStorage";
import {
  formatFilesSummary,
  generateDocumentString,
} from "../services/chat.service";
import { fetchModels, sendChatMessage } from "../services/model.service";
import type { ChatMessage, OllamaModel } from "../types/chat.types";
import { convertImagesToBase64 } from "../utils/fileConversion";
import { checkFileType } from "../utils/fileValidation";
import { useFileUpload } from "./FileUploadContext";

interface ChatContextType {
  models: OllamaModel[];
  prompt: string;
  setPrompt: React.Dispatch<React.SetStateAction<string>>;
  userPromptPlaceholder: string | null;
  responseStream: string;
  currentModel: OllamaModel | null;
  setCurrentModel: React.Dispatch<React.SetStateAction<OllamaModel | null>>;
  systemMessage: string;
  setSystemMessage: (message: string) => void;
  responseStreamLoading: boolean;
  conversationHistory: ChatMessage[];
  setConversationHistory: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  handleAskPrompt: (event: React.FormEvent) => void;
  handleKeyDown: (event: React.KeyboardEvent) => void;
  messagesEndRef: React.RefObject<HTMLDivElement>;
  resetChat: () => void;
}

const ChatContext = createContext<ChatContextType | null>(null);

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const { uploadedFiles, setUploadedFiles } = useFileUpload();
  const [models, setModels] = useState<OllamaModel[]>([]);
  const [currentModel, setCurrentModel] = useLocalStorage<OllamaModel | null>(
    "currentOfflineModel",
    null
  );
  const [prompt, setPrompt] = useState<string>("");
  const [userPromptPlaceholder, setUserPromptPlaceholder] = useState<
    string | null
  >(null);
  const [responseStream, setResponseStream] = useState<string>("");
  const [responseStreamLoading, setResponseStreamLoading] = useState(false);

  const [systemMessage, setSystemMessage] = useLocalStorage<string>(
    "systemMessage",
    "You are a helpful personal assistant. Please reply in Markdown format when necessary for headings, links, bold, etc."
  );

  const [conversationHistory, setConversationHistory] = useLocalStorage<
    ChatMessage[]
  >("conversationHistory", []);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const handleAskPrompt = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!prompt && uploadedFiles.length === 0) {
      toast("Please enter a prompt.");
      return;
    }

    if (!currentModel) {
      toast("Please select a model.");
      return;
    }

    const uploadedImages = uploadedFiles.filter(
      (file) => checkFileType(file) === "image"
    );
    const uploadedDocuments = uploadedFiles.filter(
      (file) => checkFileType(file) === "document"
    );

    const displayPrompt = formatFilesSummary(
      uploadedDocuments,
      uploadedImages,
      prompt
    );

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

      const stream = await sendChatMessage({
        conversationHistory,
        prompt: combinedPrompt,
        model: currentModel.model,
        systemMessage,
        images: base64Images,
      });

      const reader = stream.getReader();
      const decoder = new TextDecoder("utf-8");
      let botResponseStream = "";

      // eslint-disable-next-line no-constant-condition
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        botResponseStream += chunk;
        setResponseStream((prev) => prev + chunk);
      }

      const userMessageWithImages: ChatMessage = {
        role: "user",
        content: displayPrompt,
        ...(base64Images.length > 0 && { images: base64Images }),
      };

      setConversationHistory((prevHistory) => [
        ...prevHistory,
        userMessageWithImages,
        { role: "assistant", content: botResponseStream },
      ]);
    } catch (error) {
      console.error("Error fetching response:", error);
      toast("Error fetching response.");
    } finally {
      setResponseStreamLoading(false);
      setUserPromptPlaceholder(null);
      setUploadedFiles([]);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleAskPrompt(event);
    }
  };

  const resetChat = useCallback(() => {
    setConversationHistory([]);
    setUploadedFiles([]);
    setPrompt("");
    setResponseStream("");
    setResponseStreamLoading(false);
  }, [setConversationHistory, setUploadedFiles]);

  useEffect(() => {
    const loadModels = async () => {
      try {
        const fetchedModels = await fetchModels();
        setModels(fetchedModels);
      } catch (error) {
        console.error("Failed to fetch models:", error);
        toast(
          "Failed to fetch models. Make sure your models are stored in default directory and server is running."
        );
      }
    };

    loadModels();
  }, []);

  useEffect(() => {
    if (models.length > 0 && !currentModel) {
      setCurrentModel(models[0]);
    }
  }, [models, currentModel, setCurrentModel]);

  useEffect(() => {
    scrollToBottom();
  }, [
    conversationHistory,
    responseStream,
    userPromptPlaceholder,
    scrollToBottom,
  ]);

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

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChatContext must be used within a ChatProvider");
  }
  return context;
};
