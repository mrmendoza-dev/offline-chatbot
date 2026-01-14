import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { OllamaModel } from "../../types/chat.types";

interface OllamaModelsSectionProps {
  ollamaModels: OllamaModel[];
  currentModel: OllamaModel | null;
  isModelLoading: boolean;
  ollamaServerStatus: "online" | "offline" | "checking";
  onModelClick: (model: OllamaModel) => void;
  formatModelSize: (size: number) => string;
  checkModelLoaded: (model: OllamaModel) => boolean;
}

export const OllamaModelsSection = ({
  ollamaModels,
  currentModel,
  isModelLoading,
  ollamaServerStatus,
  onModelClick,
  formatModelSize,
  checkModelLoaded,
}: OllamaModelsSectionProps) => {
  const BACKEND_PORT = import.meta.env.VITE_API_PORT || 5001;

  if (ollamaModels.length > 0) {
    return (
      <>
        <div>
          <div className="flex items-center justify-between gap-2 mb-2">
            <h4 className="text-sm font-medium">Ollama Models</h4>
            <div className="flex items-center gap-1">
              <div
                className={cn(
                  "size-1.5 rounded-full flex-shrink-0",
                  ollamaServerStatus === "online" && "bg-green-500",
                  ollamaServerStatus === "offline" && "bg-red-500",
                  ollamaServerStatus === "checking" &&
                    "bg-yellow-500 animate-pulse"
                )}
                title={
                  ollamaServerStatus === "online"
                    ? "Ollama server is running"
                    : ollamaServerStatus === "offline"
                    ? "Ollama server is not running"
                    : "Checking Ollama server status"
                }
              />
              <p className="text-xs text-muted-foreground">
                {ollamaServerStatus === "online"
                  ? "Connected to port"
                  : "Disconnected from port"}{" "}
                {BACKEND_PORT}
              </p>
            </div>
          </div>
          <div className="space-y-1">
            {ollamaModels.map((model: OllamaModel) => {
              const isLoaded = checkModelLoaded(model);
              return (
                <button
                  key={model.model}
                  onClick={() => onModelClick(model)}
                  disabled={isModelLoading}
                  className={cn(
                    "w-full px-2 py-1.5 rounded hover:bg-accent transition-colors text-left",
                    currentModel?.model === model.model &&
                      "bg-accent font-medium",
                    isModelLoading && "opacity-70 cursor-not-allowed"
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {isLoaded && (
                        <span className="size-1.5 rounded-full bg-green-500 flex-shrink-0" />
                      )}
                      <span className="text-sm">
                        {model.name || "Unknown Model"}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-xs px-1.5 py-0.5 rounded bg-secondary text-secondary-foreground">
                        {model.details?.parameter_size || "Unknown"}
                      </span>
                      <span className="text-xs px-1.5 py-0.5 rounded bg-secondary text-secondary-foreground">
                        {formatModelSize(model.size)}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <Button
          variant="outline"
          className="w-full"
          onClick={() => window.open("https://ollama.com/search", "_blank")}
        >
          Browse Models on Ollama
        </Button>
      </>
    );
  }

  return (
    <>
      <div>
        <h4 className="text-sm font-medium mb-2">Ollama Models</h4>
        <a
          href="https://github.com/mrmendoza-dev/offline-chatbot"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-primary hover:underline"
        >
          View documentation to get started with Ollama
        </a>
      </div>

      <Button
        variant="outline"
        className="w-full"
        onClick={() => window.open("https://ollama.com/search", "_blank")}
      >
        Browse Models on Ollama
      </Button>
    </>
  );
};
