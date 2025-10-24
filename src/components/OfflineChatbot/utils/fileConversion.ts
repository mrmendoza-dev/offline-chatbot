import type { UploadedFile } from "../types/file.types";

export const readFileContent = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
    reader.readAsText(file);
  });
};

export const convertBlobToBase64 = async (blobUrl: string): Promise<string> => {
  try {
    const response = await fetch(blobUrl);
    const blob = await response.blob();

    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        const base64Data = base64.split(",")[1];
        resolve(base64Data);
      };
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error("Error converting blob to base64:", error);
    throw error;
  }
};

export const convertImagesToBase64 = async (
  files: UploadedFile[]
): Promise<string[]> => {
  return Promise.all(
    files.map(async (file) => await convertBlobToBase64(file.url))
  );
};

export const processFiles = async (files: File[]): Promise<UploadedFile[]> => {
  return Promise.all(
    files.map(async (file) => {
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
};
