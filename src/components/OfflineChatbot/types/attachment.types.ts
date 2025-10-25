export type AttachmentCategory =
  | "image"
  | "text"
  | "code"
  | "pdf"
  | "unsupported";

export interface UploadedFile {
  name: string;
  size: number;
  type: string;
  category: AttachmentCategory;
  lastModified: number;
  url: string; // blob URL for preview
  content?: string; // parsed text content (for text/code/pdf)
  base64?: string; // for images
  parseError?: string; // if parsing failed
}

export interface AttachmentMetadata {
  name: string;
  category: AttachmentCategory;
  size: number;
  type: string;
  content?: string; // parsed text content (for text/code/pdf)
  base64?: string; // for images
  parseError?: string; // if parsing failed
}

// Legacy types for backward compatibility
export type FileCategory = "image" | "document" | "other";

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
