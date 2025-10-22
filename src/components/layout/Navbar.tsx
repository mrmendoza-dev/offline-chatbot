
import { Link } from "react-router-dom";
import { ChatHeader } from "@/components/chatbot/ChatHeader";
import { Button } from "@/components/ui/button";
import { Github, Moon, Sun } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";


export const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  return (
    <Button
      id="theme-toggle"
      type="button"
      size="icon"
      variant="ghost"
      className="text-foreground hover:text-foreground"
      onClick={toggleTheme}
    >
      {theme === "dark" ? <Sun /> : <Moon />}
    </Button>
  );
};



export const Navbar = () => {
  const handleGithub = () => {
    window.open("https://github.com/mrmendoza-dev/offline-chatbot", "_blank");
  };

  return (
    <nav className="flex-none h-14 border-b bg-background backdrop-blur-sm z-50 px-2">
      <div className="flex justify-between h-full items-center px-4 gap-4">
        <div className="flex items-center gap-2">
          {/* <SidebarTrigger className="text-foreground p-4" /> */}
          <Link to="/" className="flex items-center justify-between">
            {/* <img src="/images/logo.png" className="mr-3 h-8" alt="App Logo" /> */}
            <span className="self-center text-base font-medium whitespace-nowrap text-foreground">
              Local AI
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <ChatHeader />

          <Button variant="ghost" size="icon" onClick={handleGithub}>
            <Github />
          </Button>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
};
