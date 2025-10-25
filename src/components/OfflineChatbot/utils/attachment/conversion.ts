import type { UploadedFile } from "../../types/attachment.types";
import { parseFile } from "./parsers";
import { getFileCategory } from "./validation";

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
    files.map(async (file) => {
      if (file.base64) {
        return file.base64;
      }
      return await convertBlobToBase64(file.url);
    })
  );
};

export const processFiles = async (files: File[]): Promise<UploadedFile[]> => {
  return Promise.all(
    files.map(async (file) => {
      try {
        const category = getFileCategory(file);
        const parsed = await parseFile(file, category);

        return {
          name: file.name,
          size: file.size,
          type: file.type,
          category,
          lastModified: file.lastModified,
          url: URL.createObjectURL(file),
          content: parsed.content,
          base64: parsed.base64,
          parseError: parsed.error,
        };
      } catch (error) {
        return {
          name: file.name,
          size: file.size,
          type: file.type,
          category: "unsupported" as const,
          lastModified: file.lastModified,
          url: URL.createObjectURL(file),
          parseError:
            error instanceof Error ? error.message : "Failed to process file",
        };
      }
    })
  );
};
