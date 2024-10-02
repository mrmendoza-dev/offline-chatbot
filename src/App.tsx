import ApplicationShell from "@components/ApplicationShell/ApplicationShell";
import { useChatContext, ChatProvider } from "@contexts/ChatContext";
import { ToastProvider } from "@contexts/ToastContext";
import { FileUploadProvider } from "@contexts/FileUploadContext";

function App() {
  return (
    <div className="App">
      <ToastProvider>
        <FileUploadProvider>
          <ChatProvider>
            <ApplicationShell />
          </ChatProvider>
        </FileUploadProvider>
      </ToastProvider>
    </div>
  );
}

export default App;
