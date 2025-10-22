import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Settings } from "lucide-react";

export const ChatSystemModal = ({
  dialogOpen,
  setDialogOpen,
  systemMessage,
  setSystemMessage,
}: any) => {
  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="text-foreground">
          <Settings className="h-4 w-4" />
          Settings
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>System Instructions</DialogTitle>
          <DialogDescription>
            Current system instructions for the AI model
          </DialogDescription>
        </DialogHeader>
        <Textarea
          id="system-message"
          value={systemMessage}
          onChange={(e) => setSystemMessage(e.target.value)}
          className="min-h-[20vh] text-muted-foreground"
        />
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setDialogOpen(false)}
            className="text-foreground"
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
