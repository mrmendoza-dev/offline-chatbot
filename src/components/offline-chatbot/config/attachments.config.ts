export const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB in bytes

export const FILE_EXTENSIONS = {
  text: [".txt", ".md", ".csv", ".json", ".xml", ".yaml", ".yml"],
  code: [
    ".js",
    ".jsx",
    ".ts",
    ".tsx",
    ".py",
    ".java",
    ".css",
    ".html",
    ".htm",
    ".c",
    ".cpp",
    ".cc",
    ".go",
    ".rs",
    ".rb",
    ".php",
    ".sh",
    ".bash",
    ".zsh",
    ".sql",
    ".r",
    ".swift",
    ".kt",
    ".scala",
    ".clj",
    ".fs",
    ".dart",
  ],
  images: [
    ".jpg",
    ".jpeg",
    ".png",
    ".gif",
    ".webp",
    ".svg",
    ".bmp",
    ".tiff",
    ".ico",
  ],
  pdf: [".pdf"],
} as const;

export const MIME_TYPES = {
  text: [
    "text/plain",
    "text/markdown",
    "text/csv",
    "application/json",
    "application/xml",
    "text/xml",
    "application/x-yaml",
    "text/yaml",
  ],
  code: [
    "text/javascript",
    "application/javascript",
    "text/typescript",
    "application/x-python",
    "text/x-java",
    "text/css",
    "text/html",
    "text/x-c",
    "text/x-c++",
    "application/x-go",
    "application/x-rust",
    "application/x-ruby",
    "application/x-php",
    "application/x-sh",
    "text/x-sql",
  ],
  images: [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "image/svg+xml",
    "image/bmp",
    "image/tiff",
    "image/x-icon",
  ],
  pdf: ["application/pdf"],
} as const;

export const getFileExtension = (filename: string): string => {
  const parts = filename.split(".");
  return parts.length > 1 ? `.${parts[parts.length - 1]}` : "";
};

export const getFileCategoryFromExtension = (
  extension: string
): "text" | "code" | "image" | "pdf" | "unsupported" => {
  const ext = extension.toLowerCase();

  if (FILE_EXTENSIONS.text.includes(ext as any)) return "text";
  if (FILE_EXTENSIONS.code.includes(ext as any)) return "code";
  if (FILE_EXTENSIONS.images.includes(ext as any)) return "image";
  if (FILE_EXTENSIONS.pdf.includes(ext as any)) return "pdf";

  return "unsupported";
};

export const getFileCategoryFromMime = (
  mimeType: string
): "text" | "code" | "image" | "pdf" | "unsupported" => {
  const mime = mimeType.toLowerCase();

  if (MIME_TYPES.text.includes(mime as any)) return "text";
  if (MIME_TYPES.code.includes(mime as any)) return "code";
  if (MIME_TYPES.images.includes(mime as any)) return "image";
  if (MIME_TYPES.pdf.includes(mime as any)) return "pdf";

  return "unsupported";
};

export const isFileSupported = (
  filename: string,
  mimeType: string
): boolean => {
  const extension = getFileExtension(filename);
  const category = getFileCategoryFromExtension(extension);
  const mimeCategory = getFileCategoryFromMime(mimeType);

  return (
    category !== "unsupported" ||
    mimeCategory !== "unsupported" ||
    mimeType.startsWith("text/")
  );
};
