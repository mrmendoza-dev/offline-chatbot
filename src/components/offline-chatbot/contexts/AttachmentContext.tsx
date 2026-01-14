import { ReactNode, createContext, useContext, useRef, useState } from "react";
import { toast } from "sonner";
import type { UploadedFile } from "../types/attachment.types";
import { processFiles } from "../utils/attachment/conversion";
import {
  filterAcceptedFiles,
  validateFile,
} from "../utils/attachment/validation";

interface AttachmentContextType {
  uploadedFiles: UploadedFile[];
  setUploadedFiles: React.Dispatch<React.SetStateAction<UploadedFile[]>>;
  handleFileUpload: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => Promise<void>;
  removeFile: (index: number) => void;
  fileInputRef: React.MutableRefObject<HTMLInputElement | null>;
  isLoading: boolean;
}

const AttachmentContext = createContext<AttachmentContextType | null>(null);

interface AttachmentProviderProps {
  children: ReactNode;
}

export const AttachmentProvider = ({ children }: AttachmentProviderProps) => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(event.target.files || []);

    if (files.length === 0) return;

    setIsLoading(true);

    try {
      // Validate files
      const validationResults = files.map((file) => {
        const result = validateFile(file);
        return { file, result };
      });

      // Show errors for invalid files
      validationResults.forEach(({ file, result }) => {
        if (!result.isValid) {
          toast.error(`${file.name}: ${result.error || "Invalid file"}`);
        }
      });

      // Filter only valid files
      const validFiles = validationResults
        .filter(({ result }) => result.isValid)
        .map(({ file }) => file);

      if (validFiles.length === 0) {
        return;
      }

      const acceptedFiles = filterAcceptedFiles(validFiles);
      const newFiles = await processFiles(acceptedFiles);

      // Check for parsing errors
      newFiles.forEach((file) => {
        if (file.parseError) {
          toast.error(`${file.name}: Failed to parse - ${file.parseError}`);
        }
      });

      setUploadedFiles((prevFiles) => [...prevFiles, ...newFiles]);
    } finally {
      setIsLoading(false);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <AttachmentContext.Provider
      value={{
        uploadedFiles,
        setUploadedFiles,
        handleFileUpload,
        removeFile,
        fileInputRef,
        isLoading,
      }}
    >
      {children}
    </AttachmentContext.Provider>
  );
};

export const useAttachment = () => {
  const context = useContext(AttachmentContext);
  if (!context) {
    throw new Error("useAttachment must be used within an AttachmentProvider");
  }
  return context;
};
