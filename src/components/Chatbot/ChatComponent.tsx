import { useChatContext } from "@/contexts/ChatContext";
import { useFileUpload } from "@/contexts/FileUploadContext";
import { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { ChatInput } from "./ChatInput";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ArrowUp, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export const ChatComponent = () => {
  const {
    prompt,
    setPrompt,
    handleAskPrompt,
    handleKeyDown,
    userPromptPlaceholder,
    responseStream,
    responseStreamLoading,
    conversationHistory,
    messagesEndRef,
  }: any = useChatContext();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversationHistory, responseStream, userPromptPlaceholder]);

  const messagesStartRef = useRef<HTMLDivElement>(null);
  const scrollToTop = () => {
    messagesStartRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleDownload = () => {
    window.open("https://ollama.com/", "_blank");
  };

  return (
    <div className="relative bg-background flex flex-col h-full">
      <div className="overflow-y-auto flex-1">
        <div ref={messagesStartRef} className="max-w-5xl mx-auto p-4 space-y-4">
          {!conversationHistory.length && !responseStreamLoading && (
            <div className="absolute left-0 right-0 top-0 bottom-0 flex items-center justify-center">
              <div className="text-center flex flex-col gap-2">
                <p className="text-xl font-bold break-words whitespace-pre-wrap text-foreground">
                  Local AI: Free, Offline, and Private
                </p>
                <p className="max-w-[400px] text-center text-sm break-words whitespace-pre-wrap text-muted-foreground">
                  Run Llama 3.3, DeepSeek-R1, Phi-4, Mistral, Gemma 2, and other
                  models, locally.
                </p>
                <Button
                  className="w-fit break-words text-sm mx-auto mt-2"
                  onClick={handleDownload}
                >
                  Download on Ollama
                </Button>
              </div>
            </div>
          )}
          {conversationHistory.map((entry: any, index: any) => (
            <Card
              key={index}
              className={cn(
                "max-w-[80%] w-fit",
                entry.role === "user"
                  ? "ml-auto bg-primary/10"
                  : "mr-auto border-none shadow-none"
              )}
            >
              <CardContent className="p-4">
                <ReactMarkdown className="text-sm markdown prose dark:prose-invert max-w-none break-words whitespace-pre-wrap">
                  {entry.content}
                </ReactMarkdown>
              </CardContent>
            </Card>
          ))}

          {responseStreamLoading && (
            <>
              <Card className="ml-auto max-w-[80%] bg-primary/10 w-fit">
                <CardContent className="p-4">
                  <p className="text-sm break-words whitespace-pre-wrap">
                    {userPromptPlaceholder}
                  </p>
                </CardContent>
              </Card>

              <div className="flex items-start space-x-4">
                <div className="pt-4 flex-shrink-0">
                  <Loader2 className="size-5 animate-spin" />
                </div>

                <Card className="max-w-[80%] border-none shadow-none w-fit">
                  <CardContent className="p-4">
                    <ReactMarkdown className="markdown prose dark:prose-invert max-w-none break-words whitespace-pre-wrap">
                      {responseStream}
                    </ReactMarkdown>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
          <div ref={messagesEndRef} className="h-1" />
        </div>
      </div>

      <div className="shrink-0 bg-gradient-to-t from-background via-background to-background/0">
        <div className="max-w-5xl mx-auto p-4">
          <ChatInput />
        </div>
      </div>

      <Button
        className="absolute bottom-0 right-0 m-2 text-foreground"
        onClick={scrollToTop}
        size={"icon"}
        variant={"outline"}
      >
        <ArrowUp className="size-4" />
      </Button>
    </div>
  );
};
