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

export const formatFilesSummary = (
  documents: Array<{ name: string }>,
  images: Array<{ name: string }>,
  prompt: string
): string => {
  const filesList = [...documents, ...images]
    .map((file) => file.name)
    .join(", ");
  const documentCount = documents.length;
  const imageCount = images.length;

  const getDocumentText = (count: number) => {
    if (count === 0) return "";
    return `${count} ${count === 1 ? "Document" : "Documents"}`;
  };

  const getImageText = (count: number) => {
    if (count === 0) return "";
    return `${count} ${count === 1 ? "Image" : "Images"}`;
  };

  const filesSummary = [
    getDocumentText(documentCount),
    getImageText(imageCount),
  ]
    .filter(Boolean)
    .join(" ");

  return prompt
    ? `${prompt}\n\nUploaded Files: ${filesSummary}\n${filesList}`
    : `Uploaded Files: ${filesSummary}\n${filesList}`;
};
