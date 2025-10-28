import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";
import { Github, Moon, RotateCcw, Settings, Sun } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useApplicationContext } from "../../contexts/ApplicationContext";
import { useChatContext } from "../../contexts/ChatContext";
import { useModelContext } from "../../contexts/ModelContext";
import { SettingsDialog } from "../dialogs/SettingsDialog";
import { ModelSelectorPopover } from "./ModelSelectorPopover";

export const ChatNavbar = ({ className }: { className?: string }) => {
  const handleGithub = () => {
    window.open("https://github.com/mrmendoza-dev/offline-chatbot", "_blank");
  };

  const { resetChat } = useChatContext();
  const { currentModel, setCurrentModel, isLoading } = useModelContext();
  const { modelSelectorOpen, setModelSelectorOpen } = useApplicationContext();

  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <nav className={cn("", className)}>
      <div className="flex justify-between h-full items-center gap-4">
        <div className="flex items-center gap-2">
          {/* <SidebarTrigger /> */}
          <Link to="/" className="flex items-center justify-between gap-2">
            <span className="self-center text-base font-medium whitespace-nowrap text-foreground">
              Local AI
            </span>
          </Link>

          {/* Model selector popover */}
          <ModelSelectorPopover
            currentModel={currentModel}
            setCurrentModel={setCurrentModel}
            isLoading={isLoading}
            open={modelSelectorOpen}
            onOpenChange={setModelSelectorOpen}
          />
          {currentModel && (
            <Badge variant="outline" className="">
              {currentModel.provider === "ollama" ? "Ollama" : "WebLLM"}
            </Badge>
          )}
        </div>

        <div className="flex items-center justify-center gap-1">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setSettingsOpen(true)}
          >
            <Settings />
            Settings
          </Button>
          <Button size="sm" variant="ghost" onClick={resetChat}>
            <RotateCcw />
            Reset
          </Button>
          <Button variant="ghost" size="icon" onClick={handleGithub}>
            <Github />
          </Button>
          <ThemeToggle />
        </div>
      </div>
      <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
    </nav>
  );
};

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  return (
    <Button variant="ghost" size="icon" onClick={toggleTheme}>
      {theme === "dark" ? <Sun /> : <Moon />}
    </Button>
  );
};
