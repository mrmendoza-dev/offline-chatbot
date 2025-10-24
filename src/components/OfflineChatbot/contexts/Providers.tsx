import { ApplicationProvider } from "./ApplicationContext";
import { ChatProvider } from "./ChatContext";
import { FileUploadProvider } from "./FileUploadContext";

const CoreProviders = ({ children }: { children: React.ReactNode }) => {
  return <ApplicationProvider>{children}</ApplicationProvider>;
};

const ServiceProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <FileUploadProvider>
      <ChatProvider>{children}</ChatProvider>
    </FileUploadProvider>
  );
};

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <CoreProviders>
      <ServiceProviders>{children}</ServiceProviders>
    </CoreProviders>
  );
};
