import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";
import { Github, Moon, RotateCcw, Settings, Sun } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useChatContext } from "../../contexts/ChatContext";
import { useModelContext } from "../../contexts/ModelContext";
import type { OllamaModel } from "../../types/chat.types";
import { SettingsDialog } from "../SettingsDialog";

export const ChatNavbar = ({ className }: { className?: string }) => {
  const handleGithub = () => {
    window.open("https://github.com/mrmendoza-dev/offline-chatbot", "_blank");
  };

  const { resetChat } = useChatContext();
  const { models, currentModel, setCurrentModel, isLoading } =
    useModelContext();

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

          {/* Model selector */}
          <div className="flex items-center gap-0">
            <Select
              value={currentModel?.model || ""}
              onValueChange={(value) => {
                const selectedModel = models.find(
                  (m: OllamaModel) => m.model === value
                );
                if (selectedModel) setCurrentModel(selectedModel);
              }}
              disabled={isLoading}
            >
              <SelectTrigger className="max-w-48 text-foreground text-sm border-none shadow-none !bg-transparent">
                <SelectValue
                  placeholder={
                    isLoading ? "Loading models..." : "Select a model"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {models?.map((model: OllamaModel, index: number) => (
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
          </div>
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
