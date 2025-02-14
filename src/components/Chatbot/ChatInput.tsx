import { ArrowUp, File, MessageSquare, Paperclip, Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export const ChatInput = ({
  uploadedFiles,
  removeFile,
  handleFileUpload,
  fileInputRef,
  prompt,
  setPrompt,
  handleKeyDown,
  handleAskPrompt,
  responseStreamLoading,
}: any) => {
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow">
      {uploadedFiles.length > 0 && (
          <div className="px-4 pt-4 flex gap-2 overflow-x-auto">
            {uploadedFiles.map((file: any, index: number) => (
              <div
                key={index}
                className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm"
              >
                <File className="h-4 w-4" />
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
            ))}
        </div>
      )}

      <Label className="flex flex-col gap-2 p-4" htmlFor="prompt">
        <div className="relative flex">
          <Textarea
            id="prompt"
            placeholder="Ask me anything"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            className={cn(
              "min-h-[80px] resize-none border-0 focus:ring-0 focus-visible:ring-0 shadow-none",
              "placeholder:text-muted-foreground",
              "scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-muted-foreground/20"
            )}
          />
        </div>

        <div className="flex items-center justify-between gap-2">
          <div className="flex gap-2">
            <Label
              htmlFor="file-upload"
              className="inline-flex cursor-pointer items-center justify-center rounded-md h-9 w-9 hover:bg-muted"
            >
              <Paperclip className="h-4 w-4" />
              <Input
                id="file-upload"
                type="file"
                multiple
                onChange={handleFileUpload}
                className="hidden"
                ref={fileInputRef}
              />
            </Label>
          </div>

          <Button
            size="icon"
            className={cn(
              "h-10 w-10",
              responseStreamLoading && "animate-pulse"
            )}
            onClick={handleAskPrompt}
            disabled={responseStreamLoading}
          >
            <ArrowUp className="h-5 w-5" />
          </Button>
        </div>
      </Label>
    </div>
  );
};

export default ChatInput;
