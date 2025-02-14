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
import { ChatSystemModal } from "@/components/Chatbot/ChatSystemModal";

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
    <div className="flex justify-between items-start gap-2 w-full">
      <div className="flex items-center gap-2">
        <Label htmlFor="model-select" className="text-foreground">
          Model select
        </Label>

        <Select value={currentModel} onValueChange={setCurrentModel}>
          <SelectTrigger className="w-48 text-foreground">
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
          variant="outline"
          onClick={resetChat}
          className="text-foreground"
        >
          Clear Chat
        </Button>
      </div>
    </div>
  );
};
