import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useChatContext } from "../contexts/ChatContext";

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SettingsDialog = ({ open, onOpenChange }: SettingsDialogProps) => {
  const { systemMessage, setSystemMessage } = useChatContext();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>System Instructions</DialogTitle>
          <DialogDescription>
            Configure the system instructions for the AI model
          </DialogDescription>
        </DialogHeader>
        <Textarea
          id="system-message"
          value={systemMessage}
          onChange={(e) => setSystemMessage(e.target.value)}
          className="min-h-[20vh] text-muted-foreground"
          placeholder="You are a helpful personal assistant. Please reply in Markdown format when necessary for headings, links, bold, etc."
        />
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
