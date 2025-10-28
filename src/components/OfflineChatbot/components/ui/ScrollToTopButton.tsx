import { Button } from "@/components/ui/button";
import { ArrowUp } from "lucide-react";

interface ScrollToTopButtonProps {
  onClick: () => void;
}

export const ScrollToTopButton = ({ onClick }: ScrollToTopButtonProps) => {
  return (
    <Button
      className="absolute bottom-0 right-0 m-2 text-foreground"
      onClick={onClick}
      size="icon"
      variant="outline"
    >
      <ArrowUp className="size-4" />
    </Button>
  );
};
