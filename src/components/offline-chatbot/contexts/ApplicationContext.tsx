import { ReactNode, createContext, useContext, useMemo } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";

interface ApplicationContextType {
  sidebarOpen: boolean;
  setSidebarOpen: (sidebarOpen: boolean) => void;
  modelSelectorOpen: boolean;
  setModelSelectorOpen: (open: boolean) => void;
}

const ApplicationContext = createContext<ApplicationContextType | null>(null);

export const useApplicationContext = () => {
  const context = useContext(ApplicationContext);
  if (!context) {
    throw new Error(
      "useApplicationContext must be used within an ApplicationProvider"
    );
  }
  return context;
};

export const ApplicationProvider = ({ children }: { children: ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useLocalStorage("sidebarOpen", true);
  const [modelSelectorOpen, setModelSelectorOpen] = useLocalStorage(
    "modelSelectorOpen",
    false
  );

  const value = useMemo(
    () => ({
      sidebarOpen,
      setSidebarOpen,
      modelSelectorOpen,
      setModelSelectorOpen,
    }),
    [sidebarOpen, setSidebarOpen, modelSelectorOpen, setModelSelectorOpen]
  );

  return (
    <ApplicationContext.Provider value={value}>
      {children}
    </ApplicationContext.Provider>
  );
};
