import { ApplicationProvider } from "./ApplicationContext";
import { AttachmentProvider } from "./AttachmentContext";
import { ChatProvider } from "./ChatContext";
import { ModelProvider } from "./ModelContext";

const CoreProviders = ({ children }: { children: React.ReactNode }) => {
  return <ApplicationProvider>{children}</ApplicationProvider>;
};

const ServiceProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <ModelProvider>
      <AttachmentProvider>
        <ChatProvider>{children}</ChatProvider>
      </AttachmentProvider>
    </ModelProvider>
  );
};

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <CoreProviders>
      <ServiceProviders>{children}</ServiceProviders>
    </CoreProviders>
  );
};
