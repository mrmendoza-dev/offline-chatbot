import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useChatContext } from "@/contexts/ChatContext";
import { ChatSystemModal } from "@/components/chatbot/ChatSystemModal";

export const ChatHeader = ({}) => {
  const {
    models,
    currentModel,
    setCurrentModel,
    systemMessage,
    setSystemMessage,
    resetChat,
  }: any = useChatContext();
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <div className="flex justify-between items-center gap-2 w-full">
      <div className="flex items-center gap-2">
        <Label htmlFor="model-select" className="text-foreground text-xs">
          Model
        </Label>

        <Select value={currentModel} onValueChange={setCurrentModel}>
          <SelectTrigger className="max-w-48 text-foreground text-sm border-none shadow-none !bg-transparent">
            <SelectValue placeholder="Select a model" />
          </SelectTrigger>
          <SelectContent>
            {models?.map((model: any, index: number) => (
              <SelectItem
                key={index}
                value={model.model}
                className="text-foreground"
              >
                {model.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <ChatSystemModal
          dialogOpen={dialogOpen}
          setDialogOpen={setDialogOpen}
          systemMessage={systemMessage}
          setSystemMessage={setSystemMessage}
        />
      </div>

      <div className="flex items-center gap-2 lg:order-2">
        <Button
        size="sm"
          variant="outline"
          onClick={resetChat}
          className="text-foreground"
        >
          Reset
        </Button>
      </div>
    </div>
  );
};
