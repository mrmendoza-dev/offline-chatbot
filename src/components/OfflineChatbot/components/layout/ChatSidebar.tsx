import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { PanelLeft, PanelRight, Settings, SquarePen } from "lucide-react";
import { useState } from "react";
import { useMediaQuery } from "react-responsive";
import { useChatContext } from "../../contexts/ChatContext";
import { SettingsDialog } from "../dialogs/SettingsDialog";

export const ChatSidebar = ({ className }: { className?: string }) => {
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const { resetChat } = useChatContext();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { toggleSidebar, state } = useSidebar();

  // TODO: Replace with actual new chat logic
  const handleNewChat = () => {
    resetChat();
  };

  return (
    <Sidebar
      className={cn("h-full relative", className)}
      variant={isMobile ? "sidebar" : "sidebar"}
      collapsible={isMobile ? "offcanvas" : "icon"}
    >
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem key="Toggle Sidebar">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <SidebarMenuButton onClick={toggleSidebar}>
                      {state === "expanded" ? <PanelRight /> : <PanelLeft />}
                      <span>
                        {state === "expanded" ? "Collapse" : "Expand"}
                      </span>
                    </SidebarMenuButton>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>
                      {state === "expanded"
                        ? "Collapse sidebar"
                        : "Expand sidebar"}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem key="New Chat">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <SidebarMenuButton onClick={handleNewChat}>
                      <SquarePen />
                      <span>New Chat</span>
                    </SidebarMenuButton>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>Start a new chat</p>
                  </TooltipContent>
                </Tooltip>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* <SidebarGroup>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: sidebarOpen ? 1 : 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <SidebarGroupLabel>Chats</SidebarGroupLabel>
          </motion.div>
          <SidebarGroupContent>
            <SidebarMenu>
              <AnimatePresence>
                {chats.map((chat) => (
                  <SidebarMenuItem key={chat.title}>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: sidebarOpen ? 1 : 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <SidebarMenuButton asChild>
                        <a href="#">
                          <span>{chat.title}</span>
                        </a>
                      </SidebarMenuButton>
                    </motion.div>
                  </SidebarMenuItem>
                ))}
              </AnimatePresence>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup> */}

        <div className="mt-auto">
          <SidebarGroup>
            <SidebarGroupLabel>System</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem key="Settings">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <SidebarMenuButton onClick={() => setSettingsOpen(true)}>
                        <Settings />
                        <span>Settings</span>
                      </SidebarMenuButton>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <p>Open settings</p>
                    </TooltipContent>
                  </Tooltip>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </div>
      </SidebarContent>
      <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
    </Sidebar>
  );
};
