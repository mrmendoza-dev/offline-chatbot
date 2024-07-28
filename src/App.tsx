import ApplicationShell from "@components/ApplicationShell/ApplicationShell";
import { useChatContext, ChatProvider } from "@contexts/ChatContext";

function App() {
  return (
    <div className="App">
      <ChatProvider>
        <ApplicationShell />
      </ChatProvider>
    </div>
  );
}

export default App;
