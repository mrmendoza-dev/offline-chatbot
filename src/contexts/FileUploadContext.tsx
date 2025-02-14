import React, { createContext, useContext, useState, useRef } from "react";

interface FileUploadContextType {
  uploadedFiles: any[];
  setUploadedFiles: React.Dispatch<React.SetStateAction<any[]>>;
  handleFileUpload: (event: any) => Promise<void>;
  removeFile: (index: any) => void;
  fileInputRef: React.MutableRefObject<any>;
}

const FileUploadContext = createContext<FileUploadContextType | null>(null);

export const FileUploadProvider = ({ children }: any) => {
  const [uploadedFiles, setUploadedFiles] = useState<any>([]);
  const fileInputRef = useRef<any>(null);

  const handleFileUpload = async (event: any) => {
    const files = Array.from(event.target.files);
    const acceptedFileTypes = [
      "application/json",
      "text/plain",
      "text/csv",
      "application/pdf",
      "text/markdown",

      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "image/svg+xml",
    ];

    const newFiles = await Promise.all(
      files
        .filter((file: any) => acceptedFileTypes.includes(file.type))
        .map(async (file: any) => {
          const content = await readFileContent(file);
          return {
            name: file.name,
            size: file.size,
            type: file.type,
            lastModified: file.lastModified,
            url: URL.createObjectURL(file),
            content: content,
          };
        })
    );
    setUploadedFiles((prevFiles: any) => [...prevFiles, ...newFiles]);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const readFileContent = (file: any) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
      reader.readAsText(file);
    });
  };

  const removeFile = (index: any) => {
    setUploadedFiles((prevFiles: any) =>
      prevFiles.filter((file: any, i: any) => i !== index)
    );
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

export const useFileUpload = () => useContext(FileUploadContext);
