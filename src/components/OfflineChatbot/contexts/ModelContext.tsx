import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { toast } from "sonner";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { fetchModels } from "../services/model.service";
import type { OllamaModel } from "../types/chat.types";

interface ModelContextType {
  models: OllamaModel[];
  currentModel: OllamaModel | null;
  setCurrentModel: (model: OllamaModel | null) => void;
  isLoading: boolean;
  isModelLoading: boolean;
  setIsModelLoading: (loading: boolean) => void;
  refreshModels: () => Promise<void>;
}

const ModelContext = createContext<ModelContextType | null>(null);

interface ModelProviderProps {
  children: ReactNode;
}

export const ModelProvider = ({ children }: ModelProviderProps) => {
  const [models, setModels] = useState<OllamaModel[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModelLoading, setIsModelLoading] = useState(false);
  const [currentModel, setCurrentModel] = useLocalStorage<OllamaModel | null>(
    "currentModel",
    null
  );

  const refreshModels = useCallback(async () => {
    setIsLoading(true);
    try {
      const fetchedModels = await fetchModels();
      setModels(fetchedModels);

      // If no current model is set, try to set the first available model
      if (!currentModel && fetchedModels.length > 0) {
        setCurrentModel(fetchedModels[0]);
      }
    } catch (error) {
      console.error("Failed to fetch models:", error);
      toast.error("Failed to fetch models. Please check if Ollama is running.");
    } finally {
      setIsLoading(false);
    }
  }, [currentModel, setCurrentModel]);

  useEffect(() => {
    refreshModels();
  }, [refreshModels]);

  return (
    <ModelContext.Provider
      value={{
        models,
        currentModel,
        setCurrentModel,
        isLoading,
        isModelLoading,
        setIsModelLoading,
        refreshModels,
      }}
    >
      {children}
    </ModelContext.Provider>
  );
};

export const useModelContext = () => {
  const context = useContext(ModelContext);
  if (!context) {
    throw new Error("useModelContext must be used within a ModelProvider");
  }
  return context;
};
