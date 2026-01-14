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
import { Check, ChevronDown } from "lucide-react";
import type { OllamaModel } from "../../types/chat.types";

interface WebLLMModelsSectionProps {
  webLLMModels: OllamaModel[];
  currentModel: OllamaModel | null;
  selectedWebLLMModel: OllamaModel | null;
  isModelLoading: boolean;
  webLLMLoadProgress: { text: string; progress: number } | null;
  webLLMSelectOpen: boolean;
  setWebLLMSelectOpen: (open: boolean) => void;
  setSelectedWebLLMModel: (model: OllamaModel | null) => void;
  onLoadWebLLMModel: () => void;
}

export const WebLLMModelsSection = ({
  webLLMModels,
  currentModel,
  selectedWebLLMModel,
  isModelLoading,
  webLLMLoadProgress,
  webLLMSelectOpen,
  setWebLLMSelectOpen,
  setSelectedWebLLMModel,
  onLoadWebLLMModel,
}: WebLLMModelsSectionProps) => {
  if (webLLMModels.length === 0) {
    return null;
  }

  return (
    <div>
      <h4 className="text-sm font-medium mb-2">WebLLM Models</h4>
      <Popover open={webLLMSelectOpen} onOpenChange={setWebLLMSelectOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-between"
            disabled={isModelLoading}
          >
            <span className="text-sm max-w-48 truncate">
              {selectedWebLLMModel
                ? selectedWebLLMModel.name
                : currentModel?.provider === "webllm"
                ? currentModel.name
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
                        selectedWebLLMModel?.model === model.model ||
                          (currentModel?.provider === "webllm" &&
                            currentModel.model === model.model &&
                            !selectedWebLLMModel)
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
                onClick={onLoadWebLLMModel}
                className="w-full"
                disabled={isModelLoading}
                size="sm"
              >
                Load Model
              </Button>
              <p className="text-xs text-muted-foreground text-center px-2">
                Verify model requirements and available system resources before
                loading
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
  );
};
