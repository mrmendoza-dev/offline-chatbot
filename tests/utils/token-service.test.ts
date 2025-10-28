import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { TokenService } from "../../src/components/OfflineChatbot/services/token.service";
import type { ChatMessage } from "../../src/components/OfflineChatbot/types/chat.types";

describe("TokenService", () => {
  let tokenService: TokenService;

  beforeAll(() => {
    tokenService = new TokenService("gpt-4");
  });

  afterAll(() => {
    tokenService.cleanup();
  });

  describe("countTokens", () => {
    it("should count tokens for simple text", () => {
      const text = "Hello world";
      const count = tokenService.countTokens(text);
      expect(count).toBeGreaterThan(0);
    });

    it("should count tokens for empty string", () => {
      const text = "";
      const count = tokenService.countTokens(text);
      expect(count).toBe(0);
    });

    it("should count tokens for longer text", () => {
      const text =
        "This is a much longer piece of text that should result in more tokens being counted.";
      const count = tokenService.countTokens(text);
      expect(count).toBeGreaterThan(5);
    });
  });

  describe("countMessageTokens", () => {
    it("should count tokens for a simple message", () => {
      const message: ChatMessage = {
        role: "user",
        content: "Hello, how are you?",
      };
      const count = tokenService.countMessageTokens(message);
      expect(count).toBeGreaterThan(0);
    });

    it("should add overhead for message structure", () => {
      const message: ChatMessage = {
        role: "assistant",
        content: "Test",
      };
      const count = tokenService.countMessageTokens(message);
      expect(count).toBeGreaterThanOrEqual(5);
    });

    it("should count tokens for messages with images", () => {
      const message: ChatMessage = {
        role: "user",
        content: "What's in this image?",
        images: ["base64image1", "base64image2"],
      };
      const count = tokenService.countMessageTokens(message);
      expect(count).toBeGreaterThan(300);
    });

    it("should count tokens for messages with attachments", () => {
      const message: ChatMessage = {
        role: "user",
        content: "Please review this file",
        attachments: [
          {
            name: "test.txt",
            category: "text",
            size: 100,
            type: "text/plain",
            content:
              "This is some content from a text file that should be counted as tokens.",
          },
        ],
      };
      const count = tokenService.countMessageTokens(message);
      expect(count).toBeGreaterThan(20);
    });
  });

  describe("validateContextWindow", () => {
    it("should not throw when conversation fits within context window", () => {
      const history: ChatMessage[] = [
        { role: "user", content: "Short message" },
        { role: "assistant", content: "Short response" },
      ];

      expect(() => {
        tokenService.validateContextWindow(history, "System", "Prompt", 1000);
      }).not.toThrow();
    });

    it("should throw error when context exceeds limit", () => {
      const history: ChatMessage[] = [
        { role: "user", content: "First message" },
        { role: "assistant", content: "First response" },
      ];

      expect(() => {
        tokenService.validateContextWindow(
          history,
          "You are a helpful assistant",
          "What was the last thing?",
          50 // Very small context window
        );
      }).toThrow("exceeds context window");
    });

    it("should include token usage in error message", () => {
      const history: ChatMessage[] = [{ role: "user", content: "Message 1" }];

      try {
        tokenService.validateContextWindow(history, "System", "Prompt", 50);
        expect.fail("Should have thrown error");
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toMatch(/tokens/);
      }
    });
  });

  describe("estimateContextUsage", () => {
    it("should estimate total context usage", () => {
      const messages: ChatMessage[] = [
        { role: "user", content: "Test message" },
        { role: "assistant", content: "Test response" },
      ];

      const usage = tokenService.estimateContextUsage(
        messages,
        "You are a helpful assistant",
        "What can you do?"
      );

      expect(usage.used).toBeGreaterThan(0);
    });

    it("should include all message types in estimation", () => {
      const messages: ChatMessage[] = [
        { role: "user", content: "Question" },
        { role: "assistant", content: "Answer" },
        { role: "user", content: "Follow-up" },
      ];

      const usage = tokenService.estimateContextUsage(
        messages,
        "System message",
        "Final prompt"
      );

      expect(usage.used).toBeGreaterThan(10);
    });
  });
});
