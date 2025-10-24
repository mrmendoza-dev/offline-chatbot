import { ChatComponent } from "../ChatComponent";
import { cn } from "@/lib/utils";

export const ChatMainContent = ({ className }: { className?: string }) => {
  return (
    <main className={cn("flex-1 flex flex-col min-w-0", className)}>
      <ChatComponent />
    </main>
  );
};


