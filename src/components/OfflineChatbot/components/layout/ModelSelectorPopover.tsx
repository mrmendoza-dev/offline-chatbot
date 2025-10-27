import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { ChevronDown, RefreshCw } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useModelContext } from "../../contexts/ModelContext";
import { fetchLoadedModels, loadModel } from "../../services/model.service";
import type { LoadedModel, OllamaModel } from "../../types/chat.types";

interface ModelSelectorPopoverProps {
  models: OllamaModel[];
  currentModel: OllamaModel | null;
  setCurrentModel: (model: OllamaModel) => void;
  isLoading: boolean;
}

export const ModelSelectorPopover = ({
  models,
  currentModel,
  setCurrentModel,
  isLoading,
}: ModelSelectorPopoverProps) => {
  const { isModelLoading, setIsModelLoading } = useModelContext();
  const [loadedModels, setLoadedModels] = useState<LoadedModel[]>([]);
  const [loadingCache, setLoadingCache] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);

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

  const handlePopoverOpen = async (open: boolean) => {
    setPopoverOpen(open);
    if (open) {
      await refreshLoadedModels();
    }
  };

  const handleModelClick = async (model: OllamaModel) => {
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
            <span>{currentModel?.name || "No model loaded"}</span>
          </div>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="start">
        <div className="space-y-4">
          {/* Currently Loaded Section */}
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
            {loadedModels.length === 0 ? (
              <p className="text-xs text-muted-foreground">
                No models currently loaded
              </p>
            ) : (
              <div className="space-y-2">
                {loadedModels.map((model) => (
                  <div
                    key={model.id}
                    className="text-xs space-y-0.5 border rounded p-2"
                  >
                    <div className="font-medium flex items-center gap-1">
                      <span className="size-1.5 rounded-full bg-green-500" />
                      {model?.name || "Unknown Model"}
                    </div>
                    <div className="text-muted-foreground">
                      {model?.size || "Unknown Size"} •{" "}
                      {model?.processor || "Unknown Processor"}
                    </div>
                    <div className="text-muted-foreground">
                      Unloads {model?.until || "Unknown Until"}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Separator */}
          <div className="border-t" />

          {/* Available Models Section */}
          <div>
            <h4 className="text-sm font-medium mb-2">Available Models</h4>
            <div className="space-y-1">
              {models?.map((model: OllamaModel) => {
                const loadedModel = loadedModels.find((lm) =>
                  lm.name.startsWith(model.model.split(":")[0])
                );
                const sizeGB = (model.size / 1024 / 1024 / 1024).toFixed(1);
                return (
                  <button
                    key={model.model}
                    onClick={() => handleModelClick(model)}
                    disabled={isModelLoading}
                    className={cn(
                      "w-full px-2 py-1.5 rounded hover:bg-accent transition-colors",
                      currentModel?.model === model.model &&
                        "bg-accent font-medium",
                      isModelLoading && "opacity-70 cursor-not-allowed"
                    )}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {loadedModel && (
                          <span className="size-1.5 rounded-full bg-green-500 flex-shrink-0" />
                        )}
                        <span className="text-sm">
                          {model?.name || "Unknown Model"}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-xs px-1.5 py-0.5 rounded bg-secondary text-secondary-foreground">
                          {model?.details?.parameter_size ||
                            "Unknown Parameter Size"}
                        </span>
                        <span className="text-xs px-1.5 py-0.5 rounded bg-secondary text-secondary-foreground">
                          {sizeGB} GB
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
