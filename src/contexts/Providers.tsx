import { ThemeProvider } from "@/contexts/ThemeContext";

const CoreProviders = ({ children }: { children: React.ReactNode }) => {
  return <ThemeProvider>{children}</ThemeProvider>;
};

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return <CoreProviders>{children}</CoreProviders>;
};
