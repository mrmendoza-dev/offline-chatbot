import type { FileCategory, FileValidationResult } from "../types/file.types";

export const FILE_TYPES = {
  images: [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "image/svg+xml",
    "image/bmp",
    "image/tiff",
  ],
  documents: [
    "application/json",
    "text/plain",
    "text/csv",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "text/markdown",
  ],
} as const;

export const ACCEPTED_FILE_TYPES = [
  ...FILE_TYPES.images,
  ...FILE_TYPES.documents,
] as const;

export const checkFileType = (file: File | { type: string }): FileCategory => {
  const { type } = file;

  if (FILE_TYPES.images.includes(type as any)) {
    return "image";
  }

  if (FILE_TYPES.documents.includes(type as any)) {
    return "document";
  }

  return "other";
};

export const validateFile = (file: File): FileValidationResult => {
  const category = checkFileType(file);
  const isAccepted = ACCEPTED_FILE_TYPES.includes(file.type as any);
  const extension = file.name.split(".").pop() || "";

  return {
    isAccepted,
    category,
    type: file.type,
    extension,
    size: file.size,
  };
};

export const isFileAccepted = (file: File): boolean => {
  return ACCEPTED_FILE_TYPES.includes(file.type as any);
};

export const filterAcceptedFiles = (files: File[]): File[] => {
  return files.filter(isFileAccepted);
};
