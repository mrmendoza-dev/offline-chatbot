export interface FileTypeResult {
  isAccepted: boolean;
  category: "image" | "document" | "other";
  type: string;
  extension: string;
  size: number;
}

const FILE_TYPES = {
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
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
    "text/markdown",
  ],
} as const;

// Type for file categories
type FileCategory = "image" | "document" | "other";

export const checkFileType = (file: File): string => {
  const imageTypes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "image/svg+xml",
  ];
  const documentTypes = [
    "application/json",
    "text/plain",
    "text/csv",
    "application/pdf",
    "text/markdown",
  ];

  if (imageTypes.includes(file.type)) {
    return "image";
  }

  if (documentTypes.includes(file.type)) {
    return "document";
  }

  return "other";
};

export const convertBlobToBase64 = async (blobUrl: string): Promise<string> => {
  try {
    const response = await fetch(blobUrl);
    const blob = await response.blob();

    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        // Get just the base64 data without the prefix
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

// Add this helper functionp
export const convertImagesToBase64 = async (
  files: any[]
): Promise<string[]> => {
  return Promise.all(
    files.map(async (file) => await convertBlobToBase64(file.url))
  );
};
