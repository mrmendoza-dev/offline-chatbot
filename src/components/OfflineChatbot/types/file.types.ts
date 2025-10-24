export type FileCategory = "image" | "document" | "other";

export interface UploadedFile {
  name: string;
  size: number;
  type: string;
  lastModified: number;
  url: string;
  content: string;
}

export interface FileTypeCheckResult {
  category: FileCategory;
  isAccepted: boolean;
}

export interface FileValidationResult {
  isAccepted: boolean;
  category: FileCategory;
  type: string;
  extension: string;
  size: number;
}
