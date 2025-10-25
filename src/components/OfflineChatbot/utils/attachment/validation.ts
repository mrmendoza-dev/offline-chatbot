import {
  MAX_FILE_SIZE,
  getFileCategoryFromExtension,
  getFileCategoryFromMime,
  getFileExtension,
  isFileSupported,
} from "../../config/attachments.config";
import type { AttachmentCategory } from "../../types/attachment.types";

export const getFileCategory = (file: File): AttachmentCategory => {
  const extension = getFileExtension(file.name);
  const category = getFileCategoryFromExtension(extension);

  // Fallback to MIME type check if extension doesn't match
  if (category === "unsupported") {
    const mimeCategory = getFileCategoryFromMime(file.type);
    if (mimeCategory !== "unsupported") {
      return mimeCategory;
    }
  }

  return category;
};

export const validateFileSize = (file: File): boolean => {
  return file.size <= MAX_FILE_SIZE;
};

export const validateFile = (
  file: File
): {
  isValid: boolean;
  category: AttachmentCategory;
  error?: string;
} => {
  // Check file size
  if (!validateFileSize(file)) {
    return {
      isValid: false,
      category: "unsupported",
      error: `File size exceeds maximum allowed size of ${
        MAX_FILE_SIZE / 1024 / 1024
      }MB`,
    };
  }

  // Check if file is supported
  if (!isFileSupported(file.name, file.type)) {
    return {
      isValid: false,
      category: "unsupported",
      error: "Unsupported file type",
    };
  }

  const category = getFileCategory(file);

  return {
    isValid: true,
    category,
  };
};

export const filterAcceptedFiles = (files: File[]): File[] => {
  return files.filter((file) => {
    const validation = validateFile(file);
    return validation.isValid;
  });
};
