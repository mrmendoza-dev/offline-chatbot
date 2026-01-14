import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Code, File, FileText, Image } from "lucide-react";
import { useState } from "react";
import type { AttachmentMetadata } from "../../types/attachment.types";

interface ChatAttachmentBlockProps {
  attachment: AttachmentMetadata;
}

export const ChatAttachmentBlock = ({
  attachment,
}: ChatAttachmentBlockProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const getIcon = () => {
    switch (attachment.category) {
      case "image":
        return <Image className="h-4 w-4" />;
      case "text":
        return <FileText className="h-4 w-4" />;
      case "code":
        return <Code className="h-4 w-4" />;
      case "pdf":
        return <FileText className="h-4 w-4" />;
      default:
        return <File className="h-4 w-4" />;
    }
  };

  const formatSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes}B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
  };

  const isParseable =
    attachment.category !== "unsupported" && !attachment.parseError;

  return (
    <>
      <button
        onClick={() => isParseable && setIsDialogOpen(true)}
        className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer"
        title={
          isParseable
            ? `Click to view ${attachment.name}`
            : attachment.parseError || "Cannot preview this file"
        }
      >
        {getIcon()}
        <span className="max-w-[150px] truncate">{attachment.name}</span>
        <span className="text-muted-foreground text-xs">
          {formatSize(attachment.size)}
        </span>
      </button>

      {/* Dialog for viewing file content */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>{attachment.name}</DialogTitle>
          </DialogHeader>
          <div className="overflow-auto max-h-[calc(80vh-100px)]">
            {attachment.category === "image" ? (
              <img
                src={
                  attachment.base64
                    ? `data:${attachment.type};base64,${attachment.base64}`
                    : undefined
                }
                alt={attachment.name}
                className="rounded-lg w-full h-auto object-contain max-h-[60vh]"
              />
            ) : attachment.parseError ? (
              <div className="bg-destructive/10 rounded-lg p-4 text-sm text-destructive">
                Error: {attachment.parseError}
              </div>
            ) : (
              <div className="bg-muted/50 rounded-lg p-4 font-mono text-sm whitespace-pre-wrap break-words">
                {attachment.content || "No content available"}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
