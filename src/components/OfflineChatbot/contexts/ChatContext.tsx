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
import { generateDocumentString } from "../services/message.service";
import { sendChatMessage } from "../services/model.service";
import type { ChatMessage } from "../types/chat.types";
import { convertImagesToBase64 } from "../utils/attachment/conversion";
import { useAttachment } from "./AttachmentContext";
import { useModelContext } from "./ModelContext";

interface ChatContextType {
  prompt: string;
  setPrompt: React.Dispatch<React.SetStateAction<string>>;
  userPromptPlaceholder: string | null;
  responseStream: string;
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
  const { uploadedFiles, setUploadedFiles } = useAttachment();
  const { currentModel } = useModelContext();
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
      (file) => file.category === "image"
    );
    const uploadedTextFiles = uploadedFiles.filter(
      (file) =>
        file.category === "text" ||
        file.category === "code" ||
        file.category === "pdf"
    );

    setUserPromptPlaceholder(prompt);
    setPrompt("");
    setResponseStream("");
    setResponseStreamLoading(true);

    try {
      const base64Images =
        uploadedImages.length > 0
          ? await convertImagesToBase64(uploadedImages)
          : [];

      const documentString =
        uploadedTextFiles.length > 0
          ? generateDocumentString(uploadedTextFiles)
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

      // Create attachment metadata for history
      const attachments = uploadedFiles.map((file) => ({
        name: file.name,
        category: file.category,
        size: file.size,
        type: file.type,
        content: file.content,
        base64: file.base64,
        parseError: file.parseError,
      }));

      const userMessageWithImages: ChatMessage = {
        role: "user",
        content: prompt,
        ...(base64Images.length > 0 && { images: base64Images }),
        ...(attachments.length > 0 && { attachments }),
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
        prompt,
        setPrompt,
        userPromptPlaceholder,
        responseStream,
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
