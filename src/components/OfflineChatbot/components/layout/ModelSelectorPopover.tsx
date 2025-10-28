import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useModelContext } from "../../contexts/ModelContext";
import { fetchLoadedModels, loadModel } from "../../services/model.service";
import type { LoadedModel, OllamaModel } from "../../types/chat.types";
import { BASE_URL } from "../../utils/api";
import {
  CurrentModelSection,
  OllamaModelsSection,
  WebLLMModelsSection,
} from "../ModelSelector";

interface ModelSelectorPopoverProps {
  currentModel: OllamaModel | null;
  setCurrentModel: (model: OllamaModel) => void;
  isLoading: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const ModelSelectorPopover = ({
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
    // ollamaModels,
    webLLMModels,
  } = useModelContext();
  const ollamaModels: OllamaModel[] = [];
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
      // Silently fail - server might not be running (e.g., using WebLLM only)
      console.debug(
        "Could not fetch loaded models (server may be offline):",
        error
      );
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
      // Silently handle offline status - not an error if using WebLLM only
      console.debug(
        "Ollama server is offline (this is normal if using WebLLM only)"
      );
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

    // Load the model (this will update currentModel in context)
    await loadWebLLMModel(selectedWebLLMModel);

    // Only clear after successful load
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

    // Clear WebLLM selection when switching to Ollama
    setSelectedWebLLMModel(null);

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
        provider: "WebLLM" as const,
        isLoaded: true as const,
      };
    }

    if (currentModel.provider === "ollama") {
      const loadedModel = loadedModels.find((lm) =>
        lm.name.startsWith(currentModel.model.split(":")[0])
      );
      if (loadedModel) {
        return {
          name: loadedModel.name,
          provider: "Ollama" as const,
          isLoaded: true as const,
          size: loadedModel.size,
          processor: loadedModel.processor,
          until: loadedModel.until,
        };
      }
    }

    return null;
  };

  const currentLoadedInfo = getCurrentLoadedInfo();

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
            <span className="max-w-20 sm:max-w-32 truncate">
              {currentModel?.name || "No model loaded"}
            </span>
          </div>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="start">
        <div className="space-y-4">
          {/* Currently Loaded Section */}
          <CurrentModelSection
            currentLoadedInfo={currentLoadedInfo}
            loadingCache={loadingCache}
            onRefresh={refreshLoadedModels}
          />

          <Separator />

          {/* Ollama Models Section */}
          <OllamaModelsSection
            ollamaModels={ollamaModels}
            currentModel={currentModel}
            isModelLoading={isModelLoading}
            ollamaServerStatus={ollamaServerStatus}
            onModelClick={handleModelClick}
            formatModelSize={formatModelSize}
            checkModelLoaded={checkModelLoaded}
          />

          {/* Separator */}
          {webLLMModels.length > 0 && <Separator />}

          {/* WebLLM Models Section */}
          {webLLMModels.length > 0 && (
            <WebLLMModelsSection
              webLLMModels={webLLMModels}
              currentModel={currentModel}
              selectedWebLLMModel={selectedWebLLMModel}
              isModelLoading={isModelLoading}
              webLLMLoadProgress={webLLMLoadProgress}
              webLLMSelectOpen={webLLMSelectOpen}
              setWebLLMSelectOpen={setWebLLMSelectOpen}
              setSelectedWebLLMModel={setSelectedWebLLMModel}
              onLoadWebLLMModel={handleLoadWebLLMModel}
            />
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};
