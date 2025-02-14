import { useChatContext } from "@/contexts/ChatContext";
import { useFileUpload } from "@/contexts/FileUploadContext";
import { useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { ChatInput } from "./ChatInput";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

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

  const {
    uploadedFiles,
    setUploadedFiles,
    handleFileUpload,
    removeFile,
    fileInputRef,
  }: any = useFileUpload();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversationHistory, responseStream, userPromptPlaceholder]);

  return (
    <div className="relative bg-background flex flex-col h-full">
      <div className="overflow-y-auto flex-1">
        <div className="max-w-5xl mx-auto p-4 space-y-4">
          {conversationHistory.map((entry: any, index: number) => (
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
                <ReactMarkdown className="markdown prose dark:prose-invert max-w-none">
                  {entry.content}
                </ReactMarkdown>
              </CardContent>
            </Card>
          ))}

          {responseStreamLoading && (
            <>
              <Card className="ml-auto max-w-[80%] bg-primary/10 w-fit">
                <CardContent className="p-4">
                  <p className="text-sm">{userPromptPlaceholder}</p>
                </CardContent>
              </Card>

              <div className="flex">
                <div className="pt-4">
                  <Loader2 className="size-5 animate-spin" />
                </div>

                <Card className="mr-auto max-w-[80%] border-none shadow-none w-fit">
                  <CardContent className="p-4">
                    <p className="text-sm">{responseStream}</p>
                  </CardContent>
                </Card>
              </div>
            </>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="shrink-0 bg-gradient-to-t from-background via-background to-background/0">
        <div className="max-w-5xl mx-auto p-4">
          <ChatInput
            uploadedFiles={uploadedFiles}
            removeFile={removeFile}
            handleFileUpload={handleFileUpload}
            fileInputRef={fileInputRef}
            prompt={prompt}
            setPrompt={setPrompt}
            handleKeyDown={handleKeyDown}
            handleAskPrompt={handleAskPrompt}
            responseStreamLoading={responseStreamLoading}
          />
        </div>
      </div>
    </div>
  );
};
