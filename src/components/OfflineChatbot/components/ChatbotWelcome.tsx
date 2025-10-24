import { Button } from "@/components/ui/button";

const RECOMMENDED_MODELS = [
  { name: "Llama 3.3", url: "https://ollama.com/library/llama3.3" },
  { name: "DeepSeek-R1", url: "https://ollama.com/library/deepseek-r1" },
  { name: "Phi-4", url: "https://ollama.com/library/phi4" },
  { name: "Mistral", url: "https://ollama.com/library/mistral" },
  { name: "Gemma 2", url: "https://ollama.com/library/gemma2" },
] as const;

const GITHUB_URL = "https://github.com/mrmendoza-dev/offline-chatbot";
const OLLAMA_URL = "https://ollama.com/";

interface ModelLinkProps {
  name: string;
  url: string;
  isLast: boolean;
}

const ModelLink = ({ name, url, isLast }: ModelLinkProps) => (
  <>
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="text-foreground underline"
    >
      {name}
    </a>
    {!isLast && ", "}
  </>
);

export const ChatbotWelcome = () => {
  const handleDownload = () => {
    window.open(OLLAMA_URL, "_blank");
  };

  const modelLinks = RECOMMENDED_MODELS.map((model, index) => (
    <ModelLink
      key={model.name}
      name={model.name}
      url={model.url}
      isLast={index === RECOMMENDED_MODELS.length - 1}
    />
  ));

  return (
    <div className="absolute left-0 right-0 top-0 bottom-0 flex items-center justify-center">
      <div className="text-center flex flex-col gap-2">
        <p className="text-xl font-bold break-words whitespace-pre-wrap text-foreground">
          Local AI: Free, Offline, and Private
        </p>
        <p className="max-w-[400px] text-center text-sm break-words whitespace-pre-wrap text-muted-foreground">
          Run {modelLinks} and other models, locally. View setup instructions
          here on{" "}
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
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
