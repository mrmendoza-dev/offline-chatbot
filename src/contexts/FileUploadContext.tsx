import React, { createContext, useContext, useState, useRef } from "react";

const FileUploadContext = createContext(null);

export const FileUploadProvider = ({ children }) => {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const fileInputRef = useRef(null);

  const handleFileUpload = async (event) => {
    const files = Array.from(event.target.files);
    const acceptedFileTypes = [
      "application/json",
      "text/plain",
      "text/csv",
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    const newFiles = await Promise.all(
      files
        .filter((file) => acceptedFileTypes.includes(file.type))
        .map(async (file) => {
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
    setUploadedFiles((prevFiles) => [...prevFiles, ...newFiles]);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const readFileContent = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
      reader.readAsText(file);
    });
  };

  const removeFile = (index) => {
    setUploadedFiles((prevFiles) => prevFiles.filter((file, i) => i !== index));
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
