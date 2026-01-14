export const generateDocumentString = (
  documents: Array<{ name: string; type: string; content: string }>
): string => {
  if (documents.length === 0) {
    return "";
  }

  return documents
    .map((file) => {
      return `File Name: ${file.name}\nFile Type: ${file.type}\nContent:\n${file.content}\n\n`;
    })
    .join("--------------------------------------------------\n");
};

