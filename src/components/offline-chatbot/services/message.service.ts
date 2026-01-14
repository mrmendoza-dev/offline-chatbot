import type { UploadedFile } from "../types/attachment.types";

export const generateDocumentString = (documents: UploadedFile[]): string => {
  if (documents.length === 0) {
    return "";
  }

  const getCategoryLabel = (category: string): string => {
    switch (category) {
      case "text":
        return "Text File";
      case "code":
        return "Code File";
      case "pdf":
        return "PDF Document";
      default:
        return "Document";
    }
  };

  return documents
    .map((file) => {
      const categoryLabel = getCategoryLabel(file.category);
      const content = file.content || "No content available";

      // Truncate very long content
      const maxLength = 10000;
      const truncatedContent =
        content.length > maxLength
          ? content.substring(0, maxLength) + "\n\n... (content truncated)"
          : content;

      return `--- ${categoryLabel}: ${file.name} ---\nFile Type: ${file.type}\nContent:\n${truncatedContent}\n\n`;
    })
    .join("=" + "=".repeat(60) + "\n");
};
