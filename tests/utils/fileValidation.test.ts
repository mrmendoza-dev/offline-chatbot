import {
  checkFileType,
  isFileAccepted,
  validateFile,
} from "@/components/OfflineChatbot/utils/fileValidation";
import { describe, expect, it } from "vitest";

describe("fileValidation utilities", () => {
  describe("checkFileType", () => {
    it("should identify image files", () => {
      const file = { type: "image/jpeg" } as File;
      expect(checkFileType(file)).toBe("image");
    });

    it("should identify document files", () => {
      const file = { type: "text/plain" } as File;
      expect(checkFileType(file)).toBe("document");
    });

    it("should return 'other' for unsupported files", () => {
      const file = { type: "video/mp4" } as File;
      expect(checkFileType(file)).toBe("other");
    });
  });

  describe("validateFile", () => {
    it("should validate accepted file types", () => {
      const file = {
        name: "test.json",
        type: "application/json",
        size: 1000,
      } as File;

      const result = validateFile(file);
      expect(result.isAccepted).toBe(true);
      expect(result.category).toBe("document");
      expect(result.extension).toBe("json");
    });

    it("should reject unsupported file types", () => {
      const file = {
        name: "test.exe",
        type: "application/x-msdownload",
        size: 1000,
      } as File;

      const result = validateFile(file);
      expect(result.isAccepted).toBe(false);
    });
  });

  describe("isFileAccepted", () => {
    it("should return true for accepted files", () => {
      const file = { type: "image/png" } as File;
      expect(isFileAccepted(file)).toBe(true);
    });

    it("should return false for rejected files", () => {
      const file = { type: "application/zip" } as File;
      expect(isFileAccepted(file)).toBe(false);
    });
  });
});
