import {
  filterAcceptedFiles,
  getFileCategory,
  validateFile,
} from "@/components/OfflineChatbot/utils/attachment/validation";
import { describe, expect, it } from "vitest";

describe("fileValidation utilities", () => {
  describe("getFileCategory", () => {
    it("should identify image files", () => {
      const file = new File(["content"], "test.jpg", { type: "image/jpeg" });
      expect(getFileCategory(file)).toBe("image");
    });

    it("should identify text files", () => {
      const file = new File(["content"], "test.txt", { type: "text/plain" });
      expect(getFileCategory(file)).toBe("text");
    });

    it("should return 'unsupported' for unsupported files", () => {
      const file = new File(["content"], "test.exe", {
        type: "application/x-msdownload",
      });
      expect(getFileCategory(file)).toBe("unsupported");
    });
  });

  describe("validateFile", () => {
    it("should validate accepted file types", () => {
      const file = new File(['{"test": "data"}'], "test.json", {
        type: "application/json",
      });

      const result = validateFile(file);
      expect(result.isValid).toBe(true);
      expect(result.category).toBe("text");
    });

    it("should reject unsupported file types", () => {
      const file = new File(["content"], "test.exe", {
        type: "application/x-msdownload",
      });

      const result = validateFile(file);
      expect(result.isValid).toBe(false);
    });
  });

  describe("filterAcceptedFiles", () => {
    it("should filter only accepted files", () => {
      const files = [
        new File(["content"], "test.txt", { type: "text/plain" }),
        new File(["content"], "test.exe", { type: "application/x-msdownload" }),
        new File(["content"], "test.png", { type: "image/png" }),
      ];

      const accepted = filterAcceptedFiles(files);
      expect(accepted).toHaveLength(2);
    });
  });
});
