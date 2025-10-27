import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { Check, ChevronDown, RefreshCw } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useModelContext } from "../../contexts/ModelContext";
import { fetchLoadedModels, loadModel } from "../../services/model.service";
import type { LoadedModel, OllamaModel } from "../../types/chat.types";
import { BASE_URL } from "../../utils/api";

interface ModelSelectorPopoverProps {
  models: OllamaModel[];
  currentModel: OllamaModel | null;
  setCurrentModel: (model: OllamaModel) => void;
  isLoading: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const ModelSelectorPopover = ({
  models,
  currentModel,
  setCurrentModel,
  isLoading,
  open,
  onOpenChange,
}: ModelSelectorPopoverProps) => {
  const {
    isModelLoading,
    setIsModelLoading,
    loadWebLLMModel,
    webLLMLoadProgress,
  } = useModelContext();
  const [loadedModels, setLoadedModels] = useState<LoadedModel[]>([]);
  const [loadingCache, setLoadingCache] = useState(false);
  const [internalPopoverOpen, setInternalPopoverOpen] = useState(false);
  const [webLLMSelectOpen, setWebLLMSelectOpen] = useState(false);

  // Use controlled state if provided, otherwise use internal state
  const popoverOpen = open !== undefined ? open : internalPopoverOpen;
  const setPopoverOpen = onOpenChange || setInternalPopoverOpen;
  const [selectedWebLLMModel, setSelectedWebLLMModel] =
    useState<OllamaModel | null>(null);
  const [ollamaServerStatus, setOllamaServerStatus] = useState<
    "online" | "offline" | "checking"
  >("checking");

  const refreshLoadedModels = async () => {
    setLoadingCache(true);
    try {
      const loaded = await fetchLoadedModels();
      setLoadedModels(loaded);
    } catch (error) {
      console.error("Failed to fetch loaded models:", error);
    } finally {
      setLoadingCache(false);
    }
  };

  const checkOllamaServer = async () => {
    try {
      // Ping Express server health check endpoint
      const response = await fetch(`${BASE_URL}/health`, {
        method: "GET",
        signal: AbortSignal.timeout(2000), // 2 second timeout
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      setOllamaServerStatus("online");
    } catch (error) {
      setOllamaServerStatus("offline");
      // Only show error toast if popover is open (don't spam on mount)
      if (popoverOpen && error instanceof Error) {
        console.error("Ollama server check failed:", error);
      }
    }
  };

  const handlePopoverOpen = async (isOpen: boolean) => {
    setPopoverOpen(isOpen);
    if (isOpen) {
      await Promise.all([refreshLoadedModels(), checkOllamaServer()]);
    }
  };

  const handleLoadWebLLMModel = async () => {
    if (!selectedWebLLMModel) return;
    await loadWebLLMModel(selectedWebLLMModel);
    setSelectedWebLLMModel(null);
    setPopoverOpen(false);
  };

  const handleModelClick = async (model: OllamaModel) => {
    if (model.provider === "webllm") {
      // For WebLLM, just select but don't load yet - user needs to click Load button
      setSelectedWebLLMModel(model);
      setPopoverOpen(false);
      return;
    }

    setIsModelLoading(true);
    const loadingToast = toast.loading(`Loading ${model.name}...`);

    try {
      // Load the model into Ollama's memory
      await loadModel(model.model);
      // Select it as the current model
      setCurrentModel(model);
      // Refresh the loaded models list to show the new status
      await refreshLoadedModels();

      toast.success(`${model.name} loaded successfully`, {
        id: loadingToast,
      });
    } catch (error) {
      console.error("Failed to load model:", error);
      toast.error(`Failed to load ${model.name}`, {
        id: loadingToast,
        description: error instanceof Error ? error.message : "Unknown error",
      });
      // Still set as current model even if preload fails
      setCurrentModel(model);
    } finally {
      setIsModelLoading(false);
      setPopoverOpen(false);
    }
  };

  // Check if current model is loaded in memory
  const isCurrentModelLoaded = loadedModels.some((lm) =>
    currentModel ? lm.name.startsWith(currentModel.model.split(":")[0]) : false
  );

  // Get unified currently loaded info for both providers
  const getCurrentLoadedInfo = () => {
    if (!currentModel) return null;

    // Check if WebLLM is loaded
    const isWebLLMReady =
      currentModel.provider === "webllm" &&
      (!webLLMLoadProgress || webLLMLoadProgress.progress >= 1);

    if (currentModel.provider === "webllm" && isWebLLMReady) {
      return {
        name: currentModel.name,
        provider: "WebLLM",
        isLoaded: true,
      };
    }

    if (currentModel.provider === "ollama") {
      const loadedModel = loadedModels.find((lm) =>
        lm.name.startsWith(currentModel.model.split(":")[0])
      );
      if (loadedModel) {
        return {
          name: loadedModel.name,
          provider: "Ollama",
          isLoaded: true,
          size: loadedModel.size,
          processor: loadedModel.processor,
          until: loadedModel.until,
        };
      }
    }

    return null;
  };

  const currentLoadedInfo = getCurrentLoadedInfo();

  // Separate models by provider
  const ollamaModels = models.filter((m) => m.provider === "ollama");
  const webLLMModels = models.filter((m) => m.provider === "webllm");

  // Helper to check if a model is currently loaded in memory
  const checkModelLoaded = (model: OllamaModel) => {
    if (model.provider === "webllm") {
      return (
        currentModel?.provider === "webllm" &&
        currentModel.model === model.model &&
        (!webLLMLoadProgress || webLLMLoadProgress.progress >= 1)
      );
    }
    return loadedModels.some((lm) =>
      lm.name.startsWith(model.model.split(":")[0])
    );
  };

  // Helper to format model size
  const formatModelSize = (size: number) => {
    return `${(size / 1024 / 1024 / 1024).toFixed(1)} GB`;
  };

  const BACKEND_PORT = import.meta.env.VITE_API_PORT || 5001;

  return (
    <Popover open={popoverOpen} onOpenChange={handlePopoverOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className="gap-1 text-sm border-none shadow-none"
          disabled={isLoading}
        >
          <div className="flex items-center gap-2">
            {isCurrentModelLoaded && (
              <span className="size-1.5 rounded-full bg-green-500 flex-shrink-0" />
            )}
            <span className="max-w-32 truncate">
              {currentModel?.name || "No model loaded"}
            </span>
          </div>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="start">
        <div className="space-y-4">
          {/* Unified Currently Loaded Section */}
          {currentLoadedInfo && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium">Currently Loaded</h4>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-6 w-6"
                  onClick={refreshLoadedModels}
                  disabled={loadingCache}
                >
                  <RefreshCw
                    className={cn("h-3 w-3", loadingCache && "animate-spin")}
                  />
                </Button>
              </div>
              <div className="text-xs space-y-0.5 border rounded p-2 bg-card border-border">
                <div className="font-medium flex items-center gap-1 w-full">
                  <span className="size-1.5 rounded-full bg-green-500" />
                  <span className="truncate">{currentLoadedInfo.name}</span>
                </div>
                {currentLoadedInfo.provider === "Ollama" && (
                  <>
                    <div className="text-muted-foreground">
                      {currentLoadedInfo.size} • {currentLoadedInfo.processor}
                    </div>
                    <div className="text-muted-foreground">
                      Unloads {currentLoadedInfo.until}
                    </div>
                  </>
                )}

                {currentLoadedInfo.provider === "WebLLM" && (
                  <div className="text-muted-foreground">
                    WebLLM Running in browser
                  </div>
                )}
              </div>
            </div>
          )}

          {!currentLoadedInfo && (
            <div>
              <h4 className="text-sm font-medium mb-2">Currently Loaded</h4>
              <p className="text-xs text-muted-foreground">
                No models currently loaded
              </p>
            </div>
          )}

          {/* Separator */}
          <div className="border-t" />

          {/* Ollama Models Section */}
          {ollamaModels.length > 0 && (
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
                      onClick={() => handleModelClick(model)}
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

                {/* Browse More Models Button */}
                <Button
                  variant="outline"
                  className="w-full mt-2"
                  onClick={() =>
                    window.open("https://ollama.com/search", "_blank")
                  }
                >
                  Browse Models on Ollama
                </Button>
              </div>
            </div>
          )}

          {/* Separator */}
          {ollamaModels.length > 0 && webLLMModels.length > 0 && (
            <div className="border-t" />
          )}

          {/* WebLLM Models Section */}
          {webLLMModels.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-2">WebLLM Models</h4>
              <Popover
                open={webLLMSelectOpen}
                onOpenChange={setWebLLMSelectOpen}
              >
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-between"
                    disabled={isModelLoading}
                  >
                    <span className="text-sm max-w-48 truncate">
                      {currentModel?.provider === "webllm"
                        ? currentModel.name
                        : selectedWebLLMModel
                        ? selectedWebLLMModel.name
                        : "Select WebLLM model..."}
                    </span>
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[400px] p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Search models..." />
                    <CommandList>
                      <CommandEmpty>No model found.</CommandEmpty>
                      <CommandGroup>
                        {webLLMModels.map((model) => (
                          <CommandItem
                            key={model.model}
                            value={model.name}
                            onSelect={() => {
                              setSelectedWebLLMModel(model);
                              setWebLLMSelectOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                currentModel?.model === model.model ||
                                  selectedWebLLMModel?.model === model.model
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {model.name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>

              {/* Load Button and Progress */}
              {selectedWebLLMModel && (
                <div className="mt-2 space-y-2">
                  {!webLLMLoadProgress && (
                    <>
                      <Button
                        onClick={handleLoadWebLLMModel}
                        className="w-full"
                        disabled={isModelLoading}
                      >
                        Load Model
                      </Button>
                      <p className="text-xs text-muted-foreground text-center px-2">
                        Verify model requirements and available system resources
                        before loading
                      </p>
                    </>
                  )}
                  {webLLMLoadProgress && (
                    <>
                      <Progress value={webLLMLoadProgress.progress * 100} />
                      <p className="text-xs text-muted-foreground">
                        {webLLMLoadProgress.text}
                      </p>
                    </>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};
