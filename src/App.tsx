import { ApplicationShell } from "@/components/layout/ApplicationShell";
import { Providers } from "@/contexts/Providers";
// import { ErrorBoundary } from "@/components/feedback/ErrorBoundary";

export const App = () => {
  return (
    // <ErrorBoundary label="App ErrorBoundary">
      <div className="App w-full h-full">
        <Providers>
          <ApplicationShell />
        </Providers>
      </div>
    // </ErrorBoundary>
  );
};

