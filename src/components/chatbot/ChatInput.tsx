import { File, Image, Paperclip, Send, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { useChatContext } from "@/contexts/ChatContext";
import { useFileUpload } from "@/contexts/FileUploadContext";
import { cn } from "@/lib/utils";
import { checkFileType } from "@/utils/fileUtility";
import { useRef } from "react";

const FilePreview = ({ file, index }: { file: any; index: number }) => {
  const fileType = checkFileType(file);
  const { removeFile }: any = useFileUpload();

  return (
    <HoverCard openDelay={0} closeDelay={0}>
      <HoverCardTrigger asChild>
        <div className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm cursor-pointer">
          {fileType === "image" ? (
            <Image className="h-4 w-4" />
          ) : (
            <File className="h-4 w-4" />
          )}
          <span className="max-w-[150px] truncate">{file.name}</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-4 w-4 p-0"
            onClick={() => removeFile(index)}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </HoverCardTrigger>
      {fileType === "image" && (
        <HoverCardContent className="w-80">
          <div className="space-y-2">
            <img
              src={file.url}
              alt={file.name}
              className="rounded-lg w-full h-auto object-cover"
            />
            <p className="text-sm text-muted-foreground">{file.name}</p>
          </div>
        </HoverCardContent>
      )}
    </HoverCard>
  );
};

export const ChatInput = () => {
  const {
    prompt,
    setPrompt,
    handleAskPrompt,
    handleKeyDown,
    responseStreamLoading,
  }: any = useChatContext();

  const { uploadedFiles, handleFileUpload, fileInputRef }: any =
    useFileUpload();

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  return (
    <div className="rounded-lg border bg-card/50 backdrop-blur-sm text-card-foreground shadow">
      {/* File Attachments Section */}
      {uploadedFiles.length > 0 && (
        <div className="border-b px-4 py-3 border-border/50">
          <div className="flex gap-2 overflow-x-auto">
            {uploadedFiles.map((file: any, index: number) => (
              <FilePreview key={index} file={file} index={index} />
            ))}
          </div>
        </div>
      )}

      {/* Input Section */}
      <div
        className="p-3"
        onClick={(e) => {
          if (textareaRef.current) {
            textareaRef.current.focus();
          }
        }}
      >
        <div className="relative">
          <Textarea
            ref={textareaRef}
            id="prompt"
            placeholder="Ask me anything..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            className={cn(
              "min-h-[48px] resize-none border-0 p-0 !bg-transparent px-3",
              "focus:ring-0 focus-visible:ring-0 shadow-none",
              "placeholder:text-muted-foreground",
              "scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-muted-foreground/20"
            )}
          />
          <div className="flex items-center justify-between gap-2">
            <div className="flex gap-1">
              <Label
                htmlFor="file-upload"
                className="inline-flex cursor-pointer items-center justify-center rounded-md h-9 w-9 hover:bg-muted transition-colors"
              >
                <Paperclip className="h-4 w-4" />
                <span className="sr-only">Attach file</span>
              </Label>
              <Input
                id="file-upload"
                type="file"
                multiple
                onChange={handleFileUpload}
                className="hidden"
                ref={fileInputRef}
              />
            </div>

            <Button
              size="icon"
              className={cn(
                "h-9 w-9",
                responseStreamLoading && "animate-pulse"
              )}
              onClick={handleAskPrompt}
              disabled={responseStreamLoading || !prompt.trim()}
            >
              <Send className="h-4 w-4" />
              <span className="sr-only">Send message</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
