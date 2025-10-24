import { OfflineChatbot } from "@/components/OfflineChatbot/OfflineChatbot";

const ApplicationLayout = () => {
  return (
    <div className="min-h-dvh h-[100dvh] w-[100dvw] flex flex-col">
      <OfflineChatbot />
    </div>
  );
};

export const ApplicationShell = () => {
  return (
    <div className="h-full w-full overflow-hidden">
      <ApplicationLayout />
    </div>
  );
};
