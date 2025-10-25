import * as pdfjsLib from "pdfjs-dist";

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export interface ParsedFile {
  content?: string;
  base64?: string;
  error?: string;
}

export const parseTextFile = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const result = reader.result as string;
        resolve(result);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsText(file, "UTF-8");
  });
};

export const parseImageFile = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const result = reader.result as string;
        // Extract base64 data without data URL prefix
        const base64 = result.split(",")[1];
        resolve(base64);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};

export const parsePDFFile = async (file: File): Promise<string> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

    let fullText = "";

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map((item: any) => item.str).join(" ");
      fullText += `Page ${i}:\n${pageText}\n\n`;
    }

    return fullText;
  } catch (error) {
    throw new Error(`Failed to parse PDF: ${error}`);
  }
};

export const parseFile = async (
  file: File,
  category: "text" | "code" | "image" | "pdf" | "unsupported"
): Promise<ParsedFile> => {
  try {
    if (category === "image") {
      const base64 = await parseImageFile(file);
      return { base64 };
    } else if (category === "pdf") {
      const content = await parsePDFFile(file);
      return { content };
    } else if (category === "text" || category === "code") {
      const content = await parseTextFile(file);
      return { content };
    } else {
      return {
        error: "Unsupported file type",
      };
    }
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Parse error occurred",
    };
  }
};
