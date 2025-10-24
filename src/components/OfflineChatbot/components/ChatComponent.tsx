import { Loader2 } from "lucide-react";
import { useEffect, useRef } from "react";
import { useChatContext } from "../contexts/ChatContext";
import type { ChatMessage as ChatMessageType } from "../types/chat.types";
import { ChatInput } from "./ChatInput";
import { ChatMessage } from "./ChatMessage";
import { ChatbotWelcome } from "./ChatbotWelcome";
import { ScrollToTopButton } from "./ScrollToTopButton";

export const ChatComponent = () => {
  const {
    userPromptPlaceholder,
    responseStream,
    responseStreamLoading,
    conversationHistory,
    messagesEndRef,
  } = useChatContext();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationHistory, responseStream, userPromptPlaceholder]);

  const messagesStartRef = useRef<HTMLDivElement>(null);
  const scrollToTop = () => {
    messagesStartRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="relative bg-background flex flex-col h-full">
      <div className="overflow-y-auto flex-1">
        <div ref={messagesStartRef} className="max-w-5xl mx-auto p-4 space-y-4">
          {!conversationHistory.length && !responseStreamLoading && (
            <ChatbotWelcome />
          )}
          {conversationHistory.map((entry: ChatMessageType, index: number) => (
            <ChatMessage
              key={index}
              content={entry.content}
              role={entry.role}
            />
          ))}

          {responseStreamLoading && (
            <>
              <ChatMessage
                content={userPromptPlaceholder || ""}
                role="user"
                variant="placeholder"
              />

              <div className="flex items-start space-x-4">
                <div className="pt-4 flex-shrink-0">
                  <Loader2 className="size-5 animate-spin" />
                </div>
                <ChatMessage content={responseStream} role="assistant" />
              </div>
            </>
          )}
          <div ref={messagesEndRef} className="h-1" />
        </div>
      </div>

      <div className="z-50 shrink-0 bg-gradient-to-t from-background via-background to-background/0">
        <div className="max-w-5xl mx-auto p-4">
          <ChatInput />
        </div>
      </div>

      <ScrollToTopButton onClick={scrollToTop} />
    </div>
  );
};
