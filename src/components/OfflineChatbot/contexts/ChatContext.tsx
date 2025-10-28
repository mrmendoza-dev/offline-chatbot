import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { toast } from "sonner";
import { modelSupportsVision } from "../config/model-configs";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { generateDocumentString } from "../services/message.service";
import { sendChatMessage } from "../services/model.service";
import type { ChatMessage, ModelOptions } from "../types/chat.types";
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
  modelOptions: ModelOptions;
  setModelOptions: (options: ModelOptions) => void;
  responseStreamLoading: boolean;
  conversationHistory: ChatMessage[];
  setConversationHistory: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  handleAskPrompt: (event: React.FormEvent) => void;
  handleKeyDown: (event: React.KeyboardEvent) => void;
  messagesEndRef: React.RefObject<HTMLDivElement>;
  resetChat: () => void;
  stopGeneration: () => void;
  focusInput: () => void;
  setInputRef: (ref: HTMLTextAreaElement | null) => void;
}

const ChatContext = createContext<ChatContextType | null>(null);

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const { uploadedFiles, setUploadedFiles } = useAttachment();
  const { currentModel, isModelLoading } = useModelContext();
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

  const [modelOptions, setModelOptions] = useLocalStorage<ModelOptions>(
    "modelOptions",
    { temperature: 1.0, top_p: 1.0, seed: undefined }
  );

  const [conversationHistory, setConversationHistory] = useLocalStorage<
    ChatMessage[]
  >("conversationHistory", []);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const readerRef = useRef<ReadableStreamDefaultReader<Uint8Array> | null>(
    null
  );
  const currentPromptRef = useRef<string>("");
  const currentAttachmentsRef = useRef<ChatMessage["attachments"]>([]);

  const setInputRef = useCallback((ref: HTMLTextAreaElement | null) => {
    if (inputRef.current !== ref) {
      (inputRef as React.MutableRefObject<HTMLTextAreaElement | null>).current =
        ref;
    }
  }, []);

  const focusInput = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const stopGeneration = useCallback(() => {
    // Cancel the abort controller to stop the fetch
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Cancel the reader stream
    if (readerRef.current) {
      readerRef.current.cancel();
    }

    // Save the partial response to conversation history
    const partialResponse = responseStream;
    if (partialResponse) {
      const base64Images = currentAttachmentsRef.current
        ?.filter((att) => att.base64)
        .map((att) => att.base64!);

      const userMessageWithAttachments: ChatMessage = {
        role: "user",
        content: currentPromptRef.current,
        ...(base64Images &&
          base64Images.length > 0 && { images: base64Images }),
        ...(currentAttachmentsRef.current &&
          currentAttachmentsRef.current.length > 0 && {
            attachments: currentAttachmentsRef.current,
          }),
      };

      setConversationHistory((prevHistory) => [
        ...prevHistory,
        userMessageWithAttachments,
        { role: "assistant", content: partialResponse },
      ]);
    }

    // Clean up state
    setResponseStreamLoading(false);
    setUserPromptPlaceholder(null);
    setUploadedFiles([]);
    setResponseStream("");
    abortControllerRef.current = null;
    readerRef.current = null;
    currentPromptRef.current = "";
    currentAttachmentsRef.current = [];
  }, [responseStream, setConversationHistory, setUploadedFiles]);

  const handleAskPrompt = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();

      // Prevent submission if generation is already active or model is loading
      if (responseStreamLoading || isModelLoading) {
        return;
      }

      if (!prompt && uploadedFiles.length === 0) {
        toast("Please enter a prompt or attach a file.");
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

      // Create abort controller for this request
      const controller = new AbortController();
      abortControllerRef.current = controller;

      setUserPromptPlaceholder(prompt);
      setPrompt("");
      setResponseStream("");
      setResponseStreamLoading(true);

      // Store current prompt and attachments for potential cancellation
      currentPromptRef.current = prompt;

      try {
        const base64Images =
          uploadedImages.length > 0
            ? await convertImagesToBase64(uploadedImages)
            : [];

        const hasImages = base64Images.length > 0;
        const supportsVision = modelSupportsVision(currentModel);

        if (hasImages && !supportsVision) {
          toast.warning(
            "This model doesn't support vision. Images will be ignored.",
            { duration: 4000 }
          );
        }

        // Only send images if model supports them
        const imagesToSend = supportsVision ? base64Images : undefined;

        const documentString =
          uploadedTextFiles.length > 0
            ? generateDocumentString(uploadedTextFiles)
            : "";

        const combinedPrompt = documentString
          ? `${documentString}\n\n${prompt}`
          : prompt;

        // Create attachment metadata before streaming
        const attachments = uploadedFiles.map((file) => ({
          name: file.name,
          category: file.category,
          size: file.size,
          type: file.type,
          content: file.content,
          base64: file.base64,
          parseError: file.parseError,
        }));
        currentAttachmentsRef.current = attachments;

        const stream = await sendChatMessage(
          {
            conversationHistory,
            prompt: combinedPrompt,
            model: currentModel.model,
            systemMessage,
            provider: currentModel.provider,
            images: imagesToSend,
            options: modelOptions,
          },
          abortControllerRef.current.signal
        );

        const reader = stream.getReader();
        readerRef.current = reader;
        const decoder = new TextDecoder("utf-8");
        let botResponseStream = "";

        // Add timeout to detect hanging
        let streamTimeout: ReturnType<typeof setTimeout> | null = null;

        const resetTimeout = () => {
          if (streamTimeout) {
            clearTimeout(streamTimeout);
          }
          streamTimeout = setTimeout(() => {
            console.error("Stream timeout - no data received for 60 seconds");
            reader.cancel();
            throw new Error("Stream timeout - no response from server");
          }, 60000);
        };

        try {
          resetTimeout(); // Initial timeout
          // eslint-disable-next-line no-constant-condition
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            clearTimeout(streamTimeout!); // Clear previous timeout

            const chunk = decoder.decode(value, { stream: true });
            botResponseStream += chunk;
            setResponseStream((prev) => prev + chunk);

            resetTimeout(); // Reset timeout for next chunk
          }
        } finally {
          if (streamTimeout) {
            clearTimeout(streamTimeout);
          }
        }

        const userMessageWithImages: ChatMessage = {
          role: "user",
          content: currentPromptRef.current,
          ...(base64Images.length > 0 && { images: base64Images }),
          ...(currentAttachmentsRef.current.length > 0 && {
            attachments: currentAttachmentsRef.current,
          }),
        };

        setConversationHistory((prevHistory) => [
          ...prevHistory,
          userMessageWithImages,
          { role: "assistant", content: botResponseStream },
        ]);
      } catch (error) {
        // Check if error is from abort
        if (error instanceof Error && error.name === "AbortError") {
          // Silently handle abort - stopGeneration already saved the partial response
          return;
        }
        console.error("Error fetching response:", error);

        // Show error toast with details
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        toast.error("Error fetching response", {
          description: errorMessage,
          duration: 5000,
        });
      } finally {
        setResponseStreamLoading(false);
        setUserPromptPlaceholder(null);
        setUploadedFiles([]);
        abortControllerRef.current = null;
        readerRef.current = null;
        currentPromptRef.current = "";
        currentAttachmentsRef.current = [];
      }
    },
    [
      prompt,
      uploadedFiles,
      currentModel,
      systemMessage,
      modelOptions,
      conversationHistory,
      responseStreamLoading,
      isModelLoading,
      setConversationHistory,
      setUploadedFiles,
    ]
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === "Enter" && !event.shiftKey) {
        // Prevent submission if generation is active or model is loading
        if (responseStreamLoading || isModelLoading) {
          event.preventDefault();
          return;
        }
        event.preventDefault();
        handleAskPrompt(event);
      }
    },
    [responseStreamLoading, isModelLoading, handleAskPrompt]
  );

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

  // Cleanup on unmount to prevent memory leaks and hanging connections
  useEffect(() => {
    return () => {
      // Abort any active requests
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      // Cancel any active stream readers
      if (readerRef.current) {
        readerRef.current.cancel();
      }
    };
  }, []);

  return (
    <ChatContext.Provider
      value={{
        prompt,
        setPrompt,
        userPromptPlaceholder,
        responseStream,
        systemMessage,
        setSystemMessage,
        modelOptions,
        setModelOptions,
        responseStreamLoading,
        conversationHistory,
        setConversationHistory,
        handleAskPrompt,
        handleKeyDown,
        messagesEndRef,
        resetChat,
        stopGeneration,
        focusInput,
        setInputRef,
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
