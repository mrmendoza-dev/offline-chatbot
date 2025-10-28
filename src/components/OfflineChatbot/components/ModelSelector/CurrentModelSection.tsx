import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { RefreshCw } from "lucide-react";

interface CurrentLoadedInfo {
  name: string;
  provider: "WebLLM" | "Ollama";
  isLoaded: true;
  size?: string;
  processor?: string;
  until?: string;
}

interface CurrentModelSectionProps {
  currentLoadedInfo: CurrentLoadedInfo | null;
  loadingCache: boolean;
  onRefresh: () => void;
}

export const CurrentModelSection = ({
  currentLoadedInfo,
  loadingCache,
  onRefresh,
}: CurrentModelSectionProps) => {
  if (currentLoadedInfo) {
    return (
      <div>
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-medium">Currently Loaded</h4>
          <Button
            size="icon"
            variant="ghost"
            className="h-6 w-6"
            onClick={onRefresh}
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
    );
  }

  return (
    <div>
      <h4 className="text-sm font-medium mb-2">Currently Loaded</h4>
      <p className="text-xs text-muted-foreground">
        No models currently loaded
      </p>
    </div>
  );
};
