import { ThemeProvider } from "@/contexts/ThemeContext";
import { useChatContext, ChatProvider } from "@/contexts/ChatContext";
import { FileUploadProvider } from "@/contexts/FileUploadContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <FileUploadProvider>
        <ChatProvider>{children}</ChatProvider>
      </FileUploadProvider>
    </ThemeProvider>
  );
}
