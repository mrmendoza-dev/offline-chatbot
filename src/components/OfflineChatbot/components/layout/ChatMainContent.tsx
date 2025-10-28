import { cn } from "@/lib/utils";
import { ChatComponent } from "../chat/ChatComponent";

export const ChatMainContent = ({ className }: { className?: string }) => {
  return (
    <main className={cn("flex-1 flex flex-col min-w-0", className)}>
      <ChatComponent />
    </main>
  );
};
