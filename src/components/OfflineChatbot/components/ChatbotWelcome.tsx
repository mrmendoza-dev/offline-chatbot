import { Button } from "@/components/ui/button";
import { useApplicationContext } from "../contexts/ApplicationContext";

const GITHUB_URL = "https://github.com/mrmendoza-dev/offline-chatbot";

export const ChatbotWelcome = () => {
  const { setModelSelectorOpen } = useApplicationContext();

  const handleOpenModelSelector = () => {
    setModelSelectorOpen(true);
  };

  const handleOpenDocs = () => {
    window.open(GITHUB_URL, "_blank");
  };

  return (
    <div className="absolute left-0 right-0 top-0 bottom-0 flex items-center justify-center">
      <div className="text-center flex flex-col gap-2">
        <p className="text-xl font-bold break-words whitespace-pre-wrap text-foreground">
          Local AI: Free, Offline, and Private
        </p>

        <p className="max-w-[400px] text-center text-sm break-words whitespace-pre-wrap text-muted-foreground">
          Run open-source models locally with Ollama, or directly in your
          browser with WebLLM. Select a model to get started.
        </p>

        <div className="flex gap-2 justify-center items-center mt-2">
          <Button
            className="w-fit break-words text-sm"
            onClick={handleOpenModelSelector}
            size="sm"
            variant="default"
          >
            Select Model
          </Button>
          <Button
            className="w-fit break-words text-sm"
            onClick={handleOpenDocs}
            size="sm"
            variant="outline"
          >
            View Documentation
          </Button>
        </div>
      </div>
    </div>
  );
};
