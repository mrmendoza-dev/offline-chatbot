import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Slider,
  SliderRange,
  SliderThumb,
  SliderTrack,
} from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import { useChatContext } from "../../contexts/ChatContext";

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SettingsDialog = ({ open, onOpenChange }: SettingsDialogProps) => {
  const { systemMessage, setSystemMessage, modelOptions, setModelOptions } =
    useChatContext();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Model Settings</DialogTitle>
          <DialogDescription>
            Configure system instructions and model parameters
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="system-message">System Instructions</Label>
            <Textarea
              id="system-message"
              value={systemMessage}
              onChange={(e) => setSystemMessage(e.target.value)}
              className="min-h-[20vh]"
              placeholder="You are a helpful assistant..."
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Model Parameters</h3>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label>Temperature</Label>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4" />
                  </TooltipTrigger>
                  <TooltipContent>Controls randomness (0-2)</TooltipContent>
                </Tooltip>
                <span className="ml-auto text-sm">
                  {modelOptions.temperature}
                </span>
              </div>
              <Slider
                value={[modelOptions.temperature]}
                onValueChange={(values: number[]) =>
                  setModelOptions({ ...modelOptions, temperature: values[0] })
                }
                min={0}
                max={2}
                step={0.1}
              >
                <SliderTrack>
                  <SliderRange />
                </SliderTrack>
                <SliderThumb />
              </Slider>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label>Top P</Label>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4" />
                  </TooltipTrigger>
                  <TooltipContent>Controls diversity (0-1)</TooltipContent>
                </Tooltip>
                <span className="ml-auto text-sm">{modelOptions.top_p}</span>
              </div>
              <Slider
                value={[modelOptions.top_p]}
                onValueChange={(values: number[]) =>
                  setModelOptions({ ...modelOptions, top_p: values[0] })
                }
                min={0}
                max={1}
                step={0.05}
              >
                <SliderTrack>
                  <SliderRange />
                </SliderTrack>
                <SliderThumb />
              </Slider>
            </div>

            <div className="space-y-2">
              <Label>Seed (optional)</Label>
              <Input
                type="number"
                value={modelOptions.seed ?? ""}
                onChange={(e) => {
                  const seed = e.target.value
                    ? parseInt(e.target.value, 10)
                    : undefined;
                  setModelOptions({ ...modelOptions, seed });
                }}
                placeholder="For reproducible outputs"
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
