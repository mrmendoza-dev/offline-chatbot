import { OfflineChatbot } from "@/components/OfflineChatbot/OfflineChatbot";

export const ApplicationShell = () => {
  return (
    <div className="h-full w-full overflow-hidden">
      <div className="min-h-dvh h-[100dvh] w-[100dvw] flex flex-col">
        <OfflineChatbot />
      </div>
    </div>
  );
};
