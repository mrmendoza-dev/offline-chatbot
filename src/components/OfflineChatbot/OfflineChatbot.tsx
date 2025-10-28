import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "sonner";
import { ChatMainContent } from "./components/layout/ChatMainContent";
import { ChatNavbar } from "./components/layout/ChatNavbar";
import { ChatSidebar } from "./components/layout/ChatSidebar";
import { useApplicationContext } from "./contexts/ApplicationContext";
import { useChatContext } from "./contexts/ChatContext";
import { Providers } from "./contexts/Providers";
import { useHotkeys } from "./hooks/useHotkeys";
import "./styles/index.css";

export const OfflineChatbot = () => {
  return (
    <Providers>
      <OfflineChatbotUI />
    </Providers>
  );
};

const OfflineChatbotUI = () => {
  const { sidebarOpen, setSidebarOpen } = useApplicationContext();
  const { focusInput, stopGeneration, responseStreamLoading } =
    useChatContext();

  useHotkeys({
    hotkeys: [
      {
        key: "/",
        ctrl: true,
        handler: focusInput,
      },
      {
        key: "Escape",
        global: true,
        handler: () => {
          if (responseStreamLoading) {
            stopGeneration();
          }
        },
      },
    ],
  });

  return (
    <div className="h-full w-full overflow-hidden">
      <SidebarProvider
        className="w-full"
        open={sidebarOpen}
        onOpenChange={setSidebarOpen}
        style={{
          ["--sidebar-width" as string]: "10em",
        }}
      >
        <div className="min-h-dvh h-[100dvh] w-[100dvw] flex flex-row">
          <ChatSidebar className="flex-shrink-0" />

          <div className="flex-1 flex flex-col min-h-0">
            <ChatNavbar className="flex-shrink-0 bg-background border-b backdrop-blur-sm z-50 px-4 py-2" />
            <ChatMainContent className="flex-1 overflow-auto bg-background p-4" />
          </div>
        </div>
        <Toaster
          className="Toaster-style"
          position="top-right"
          offset={{
            top: 60,
            right: 20,
          }}
        />
      </SidebarProvider>
    </div>
  );
};
