import { Navbar } from "@/components/layout/Navbar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { MainContent } from "@/components/layout/MainContent";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "sonner";

export const ApplicationShell = () => {
  return (
    <SidebarProvider defaultOpen={false}>
      <div className="fixed inset-0 flex flex-col">
        <Navbar />
        <div className="flex flex-1 overflow-hidden">
          {/* <AppSidebar /> */}
          <MainContent />
        </div>
      </div>
      <Toaster className="Toaster-style" />
    </SidebarProvider>
  );
};
