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
import {
  fetchWebLLMModels,
  initializeWebLLM,
} from "../services/provider.service";
import type { OllamaModel } from "../types/chat.types";

interface ModelContextType {
  ollamaModels: OllamaModel[];
  webLLMModels: OllamaModel[];
  currentModel: OllamaModel | null;
  setCurrentModel: (model: OllamaModel | null) => void;
  isLoading: boolean;
  isModelLoading: boolean;
  setIsModelLoading: (loading: boolean) => void;
  refreshModels: () => Promise<void>;
  loadWebLLMModel: (model: OllamaModel) => Promise<void>;
  webLLMLoadProgress: { text: string; progress: number } | null;
}

const ModelContext = createContext<ModelContextType | null>(null);

interface ModelProviderProps {
  children: ReactNode;
}

export const ModelProvider = ({ children }: ModelProviderProps) => {
  const [ollamaModels, setOllamaModels] = useState<OllamaModel[]>([]);
  const [webLLMModels, setWebLLMModels] = useState<OllamaModel[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModelLoading, setIsModelLoading] = useState(false);
  const [webLLMLoadProgress, setWebLLMLoadProgress] = useState<{
    text: string;
    progress: number;
  } | null>(null);
  const [currentModel, setCurrentModel] = useLocalStorage<OllamaModel | null>(
    "currentModel",
    null
  );

  const refreshModels = useCallback(async () => {
    setIsLoading(true);
    try {
      const [fetchedOllamaModels, fetchedWebLLMModels] = await Promise.all([
        fetchModels().catch(() => []),
        Promise.resolve(fetchWebLLMModels()),
      ]);
      setOllamaModels(fetchedOllamaModels);
      setWebLLMModels(fetchedWebLLMModels);
    } catch (error) {
      console.error("Failed to fetch models:", error);
      toast.error("Failed to fetch models. Please check if Ollama is running.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadWebLLMModel = useCallback(
    async (model: OllamaModel) => {
      if (model.provider !== "webllm") return;

      setIsModelLoading(true);
      setWebLLMLoadProgress({ text: "Initializing...", progress: 0 });

      const loadingToast = toast.loading("Loading WebLLM model...");

      try {
        await initializeWebLLM(model.model, (text, progress) => {
          setWebLLMLoadProgress({ text, progress });
          toast.loading(text, { id: loadingToast });
        });

        setCurrentModel(model);
        toast.success(`${model.name} loaded successfully`, {
          id: loadingToast,
        });
      } catch (error) {
        console.error("Failed to load WebLLM model:", error);
        toast.error(`Failed to load ${model.name}`, {
          id: loadingToast,
          description: error instanceof Error ? error.message : "Unknown error",
        });
      } finally {
        setIsModelLoading(false);
        setWebLLMLoadProgress(null);
      }
    },
    [setCurrentModel]
  );

  useEffect(() => {
    refreshModels();
  }, [refreshModels]);

  return (
    <ModelContext.Provider
      value={{
        ollamaModels,
        webLLMModels,
        currentModel,
        setCurrentModel,
        isLoading,
        isModelLoading,
        setIsModelLoading,
        refreshModels,
        loadWebLLMModel,
        webLLMLoadProgress,
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
