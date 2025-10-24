import { ReactNode, createContext, useContext, useRef, useState } from "react";
import type { UploadedFile } from "../types/file.types";
import { processFiles } from "../utils/fileConversion";
import { filterAcceptedFiles } from "../utils/fileValidation";

interface FileUploadContextType {
  uploadedFiles: UploadedFile[];
  setUploadedFiles: React.Dispatch<React.SetStateAction<UploadedFile[]>>;
  handleFileUpload: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => Promise<void>;
  removeFile: (index: number) => void;
  fileInputRef: React.MutableRefObject<HTMLInputElement | null>;
}

const FileUploadContext = createContext<FileUploadContextType | null>(null);

interface FileUploadProviderProps {
  children: ReactNode;
}

export const FileUploadProvider = ({ children }: FileUploadProviderProps) => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(event.target.files || []);

    if (files.length === 0) return;

    const acceptedFiles = filterAcceptedFiles(files);
    const newFiles = await processFiles(acceptedFiles);

    setUploadedFiles((prevFiles) => [...prevFiles, ...newFiles]);

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
    <FileUploadContext.Provider
      value={{
        uploadedFiles,
        setUploadedFiles,
        handleFileUpload,
        removeFile,
        fileInputRef,
      }}
    >
      {children}
    </FileUploadContext.Provider>
  );
};

export const useFileUpload = () => {
  const context = useContext(FileUploadContext);
  if (!context) {
    throw new Error("useFileUpload must be used within a FileUploadProvider");
  }
  return context;
};
