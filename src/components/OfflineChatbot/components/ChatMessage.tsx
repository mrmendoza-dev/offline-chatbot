import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";

interface ChatMessageProps {
  content: string;
  role: "user" | "assistant" | "system";
  variant?: "default" | "placeholder";
}

export const ChatMessage = ({
  content,
  role,
  variant = "default",
}: ChatMessageProps) => {
  const isUser = role === "user";
  const isPlaceholder = variant === "placeholder";

  return (
    <div
      className={cn(
        "p-4 max-w-[80%] w-fit rounded-sm",
        isUser ? "ml-auto" : "mr-auto",
        isPlaceholder && isUser
          ? "bg-primary/10"
          : isUser
          ? "bg-secondary"
          : "bg-card"
      )}
    >
      {variant === "default" ? (
        <ReactMarkdown className="text-sm markdown prose max-w-none break-words whitespace-pre-wrap">
          {content}
        </ReactMarkdown>
      ) : (
        <p className="text-sm break-words whitespace-pre-wrap">{content}</p>
      )}
    </div>
  );
};
