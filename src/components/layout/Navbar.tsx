import { ThemeToggle } from "@/components/common/ThemeToggle";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Link } from "react-router-dom";
import { ChatHeader } from "@/components/Chatbot/ChatHeader";
import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";

export const Navbar = () => {
  const handleGithub = () => {
    window.open("https://github.com/mrmendoza-dev/offline-chatbot", "_blank");
  };

  return (
    <nav className="flex-none h-16 border-b bg-background backdrop-blur-sm z-50">
      <div className="flex justify-between h-full items-center px-4 gap-4">
        <div className="flex items-center gap-2">
          {/* <SidebarTrigger className="text-foreground p-4" /> */}
          <Link to="/" className="flex items-center justify-between mr-4">
            {/* <img src="/images/logo.png" className="mr-3 h-8" alt="App Logo" /> */}
            <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white text-black">
              Offline Chatbot
            </span>
          </Link>
        </div>

        <ChatHeader />

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={handleGithub}>
            <Github />
          </Button>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
};
