import { ChatComponent } from "@/components/chatbot/ChatComponent";

export const MainContent = () => {
  return (
    <main className="flex-1 flex flex-col min-w-0">
      <ChatComponent />
    </main>
  );
};
