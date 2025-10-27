import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
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
import { useApplicationContext } from "../../contexts/ApplicationContext";
import { useChatContext } from "../../contexts/ChatContext";
import { SettingsDialog } from "../SettingsDialog";

export const ChatSidebar = ({ className }: { className?: string }) => {
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const { sidebarOpen, setSidebarOpen } = useApplicationContext();
  const { resetChat } = useChatContext();
  const [settingsOpen, setSettingsOpen] = useState(false);

  // TODO: Replace with actual new chat logic
  const handleNewChat = () => {
    resetChat();
  };

  // const chats = [
  //   {
  //     title: "Chat 1",
  //     messages: [
  //       {
  //         role: "user",
  //         content: "Hello, how are you?",
  //       },
  //       {
  //         role: "assistant",
  //         content: "I'm good, thank you!",
  //       },
  //     ],
  //   },
  //   {
  //     title: "Chat 2",
  //     messages: [],
  //   },
  //   {
  //     title: "Chat 3",
  //     messages: [
  //       {
  //         role: "user",
  //         content: "Hello, how are you?",
  //       },
  //     ],
  //   },
  // ];

  return (
    <Sidebar
      className={cn("h-full relative", className)}
      variant={isMobile ? "floating" : "sidebar"}
      collapsible={isMobile ? "offcanvas" : "icon"}
    >
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem key="Toggle Sidebar">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <SidebarMenuButton
                      asChild
                      onClick={() => setSidebarOpen(!sidebarOpen)}
                    >
                      <a href="#">
                        {sidebarOpen ? <PanelRight /> : <PanelLeft />}
                        <span>{sidebarOpen ? "Collapse" : "Expand"}</span>
                      </a>
                    </SidebarMenuButton>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>{sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}</p>
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
                    <SidebarMenuButton asChild onClick={handleNewChat}>
                      <a href="#">
                        <SquarePen />
                        <span>New Chat</span>
                      </a>
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
                      <SidebarMenuButton
                        asChild
                        onClick={() => setSettingsOpen(true)}
                      >
                        <a href="#">
                          <Settings />
                          <span>Settings</span>
                        </a>
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
