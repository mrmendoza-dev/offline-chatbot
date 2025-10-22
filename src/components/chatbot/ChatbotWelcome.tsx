import { Button } from "@/components/ui/button";

export const ChatbotWelcome = () => {
  const handleDownload = () => {
    window.open("https://ollama.com/", "_blank");
  };
  return (
    <div className="absolute left-0 right-0 top-0 bottom-0 flex items-center justify-center">
      <div className="text-center flex flex-col gap-2">
        <p className="text-xl font-bold break-words whitespace-pre-wrap text-foreground">
          Local AI: Free, Offline, and Private
        </p>
        <p className="max-w-[400px] text-center text-sm break-words whitespace-pre-wrap text-muted-foreground">
          Run{" "}
          <a
            href="https://ollama.com/library/llama3.3"
            target="_blank"
            className="text-foreground underline"
          >
            Llama 3.3
          </a>
          ,{" "}
          <a
            href="https://ollama.com/library/deepseek-r1"
            target="_blank"
            className="text-foreground underline"
          >
            DeepSeek-R1
          </a>
          ,{" "}
          <a
            href="https://ollama.com/library/phi4"
            target="_blank"
            className="text-foreground underline"
          >
            Phi-4
          </a>
          ,{" "}
          <a
            href="https://ollama.com/library/mistral"
            target="_blank"
            className="text-foreground underline"
          >
            Mistral
          </a>
          ,{" "}
          <a
            href="https://ollama.com/library/gemma2"
            target="_blank"
            className="text-foreground underline"
          >
            Gemma 2
          </a>
          , and other models, locally. View setup instructions here on{" "}
          <a
            href="https://github.com/mrmendoza-dev/offline-chatbot"
            target="_blank"
            className="text-foreground underline"
          >
            GitHub
          </a>
        </p>
        <Button
          className="w-fit break-words text-sm mx-auto mt-2"
          onClick={handleDownload}
        >
          Download on Ollama
        </Button>
      </div>
    </div>
  );
};
