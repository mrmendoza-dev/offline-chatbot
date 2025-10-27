import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Copy } from "lucide-react";
import { memo, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";
import type { AttachmentMetadata } from "../../types/attachment.types";
import { writeToClipboard } from "../../utils/deviceUtility";
import { ChatAttachmentBlock } from "../attachments/ChatAttachmentBlock";
import { MarkdownDisplay } from "../ui/markdown-display";

interface ChatMessageProps {
  content: string;
  role: "user" | "assistant" | "system";
  variant?: "default" | "placeholder";
  attachments?: AttachmentMetadata[];
}

export const ChatMessage = memo(
  ({
    content,
    role,
    variant = "default",
    attachments = [],
  }: ChatMessageProps) => {
    const isUser = role === "user";
    const isPlaceholder = variant === "placeholder";

    const handleCopy = useCallback(async () => {
      const success = await writeToClipboard(content);
      if (success) {
        toast.success("Copied to clipboard");
      } else {
        toast.error("Failed to copy to clipboard");
      }
    }, [content]);

    return (
      <div
        className={cn(
          "group relative p-4 max-w-[80%] w-fit rounded-sm",
          isUser ? "ml-auto" : "mr-auto",
          isPlaceholder && isUser
            ? "bg-primary/10"
            : isUser
            ? "bg-secondary"
            : "bg-card"
        )}
      >
        {variant === "default" ? (
          isUser ? (
            <ReactMarkdown className="text-sm markdown prose max-w-none break-words whitespace-pre-wrap">
              {content}
            </ReactMarkdown>
          ) : (
            <MarkdownDisplay content={content} className="text-sm" />
          )
        ) : (
          <p className="text-sm break-words whitespace-pre-wrap">{content}</p>
        )}
        {attachments.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {attachments.map((attachment, index) => (
              <ChatAttachmentBlock
                key={`${attachment.name}-${index}`}
                attachment={attachment}
              />
            ))}
          </div>
        )}

        {/* Copy button */}
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "absolute bottom-0 opacity-0 translate-y-full group-hover:opacity-100 transition-all duration-200 h-8 w-8",
            isUser ? "right-0" : "left-0"
          )}
          onClick={handleCopy}
          title="Copy message"
        >
          <Copy className="h-4 w-4" />
        </Button>
      </div>
    );
  }
);
