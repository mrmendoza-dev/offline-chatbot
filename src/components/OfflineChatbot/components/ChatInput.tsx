import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { AnimatePresence } from "framer-motion";
import { Camera, Paperclip, Send, Settings, Square } from "lucide-react";
import { memo, useCallback, useRef, useState } from "react";
import { toast } from "sonner";
import { useAttachment } from "../contexts/AttachmentContext";
import { useChatContext } from "../contexts/ChatContext";
import { useModelContext } from "../contexts/ModelContext";
import { processFiles } from "../utils/attachment/conversion";
import { captureScreen } from "../utils/deviceUtility";
import { supportsVision } from "../utils/modelUtils";
import { FilePreview } from "./FilePreview";
import { SettingsDialog } from "./SettingsDialog";
import { AttachmentLoadingPlaceholder } from "./attachments/AttachmentLoadingPlaceholder";

export const ChatInput = memo(() => {
  const {
    prompt,
    setPrompt,
    handleAskPrompt,
    handleKeyDown,
    responseStreamLoading,
    stopGeneration,
    setInputRef,
  } = useChatContext();

  const {
    uploadedFiles,
    handleFileUpload,
    fileInputRef,
    removeFile,
    setUploadedFiles,
    isLoading,
  } = useAttachment();

  const { isModelLoading, currentModel } = useModelContext();

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const hasPromptOrFiles = prompt.trim().length > 0 || uploadedFiles.length > 0;
  const isDisabled =
    responseStreamLoading || !hasPromptOrFiles || isModelLoading;

  const handleScreenCapture = useCallback(async () => {
    try {
      const imageUrl = await captureScreen();
      if (imageUrl) {
        // Create a file-like object from the captured image
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        const file = new File([blob], `screenshot-${Date.now()}.png`, {
          type: "image/png",
        });

        // Process the file and add to attachments
        const processedFiles = await processFiles([file]);
        setUploadedFiles((prevFiles) => [...prevFiles, ...processedFiles]);
        toast.success("Screenshot captured and attached!");
      } else {
        toast.error("Failed to capture screenshot");
      }
    } catch (error) {
      console.error("Screen capture error:", error);
      toast.error("Screen capture failed");
    }
  }, [setUploadedFiles]);

  return (
    <div className="rounded-lg border bg-card/50 backdrop-blur-sm text-card-foreground shadow">
      {/* File Attachments Section */}
      {(uploadedFiles.length > 0 || isLoading) && (
        <div className="border-b px-4 py-3 border-border/50">
          <div className="flex gap-2 overflow-x-auto">
            <AnimatePresence mode="popLayout">
              {uploadedFiles.map((file, index) => (
                <FilePreview
                  key={`${file.name}-${file.lastModified}`}
                  file={file}
                  index={index}
                  onRemove={removeFile}
                />
              ))}
              {isLoading && <AttachmentLoadingPlaceholder />}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Hidden file input */}
      <Input
        id="file-upload"
        type="file"
        multiple
        onChange={handleFileUpload}
        className="hidden"
        ref={fileInputRef}
      />

      {/* Input Section */}
      <div
        className="p-3"
        onClick={() => {
          textareaRef.current?.focus();
        }}
      >
        <div className="relative">
          <Textarea
            ref={(ref) => {
              if (textareaRef.current !== ref) {
                (
                  textareaRef as React.MutableRefObject<HTMLTextAreaElement | null>
                ).current = ref;
              }
              setInputRef(ref);
            }}
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
              <Tooltip>
                <TooltipTrigger asChild>
                  <Label
                    htmlFor="file-upload"
                    className="inline-flex cursor-pointer items-center justify-center rounded-md h-9 w-9 hover:bg-muted transition-colors"
                  >
                    <Paperclip className="h-4 w-4" />
                    <span className="sr-only">Attach file</span>
                  </Label>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>Attach file</p>
                </TooltipContent>
              </Tooltip>
              {supportsVision(currentModel) && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleScreenCapture}
                      disabled={responseStreamLoading}
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>Capture screen</p>
                  </TooltipContent>
                </Tooltip>
              )}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSettingsOpen(true)}
                    disabled={responseStreamLoading}
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>Settings</p>
                </TooltipContent>
              </Tooltip>
            </div>

            {responseStreamLoading ? (
              <Button
                size="icon"
                className="h-9 w-9"
                onClick={stopGeneration}
                variant="ghost"
              >
                <Square className="h-4 w-4" />
                <span className="sr-only">Stop generation</span>
              </Button>
            ) : (
              <Button
                size="icon"
                className="h-9 w-9"
                onClick={handleAskPrompt}
                disabled={isDisabled}
                variant="ghost"
              >
                <Send className="h-4 w-4" />
                <span className="sr-only">Send message</span>
              </Button>
            )}
          </div>
        </div>
      </div>
      <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
    </div>
  );
});
