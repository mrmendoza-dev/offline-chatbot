import { renderHook, waitFor } from "@testing-library/react";
import { act } from "react";
import { describe, expect, it, vi } from "vitest";
import { AttachmentProvider } from "../../src/components/OfflineChatbot/contexts/AttachmentContext";
import {
  ChatProvider,
  useChatContext,
} from "../../src/components/OfflineChatbot/contexts/ChatContext";
import { ModelProvider } from "../../src/components/OfflineChatbot/contexts/ModelContext";

// Mock dependencies
vi.mock("../../src/components/OfflineChatbot/services/model.service", () => ({
  sendChatMessage: vi.fn(),
  fetchModels: vi.fn(() => Promise.resolve([])),
}));

vi.mock("sonner", () => ({
  toast: vi.fn(),
}));

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ModelProvider>
    <AttachmentProvider>
      <ChatProvider>{children}</ChatProvider>
    </AttachmentProvider>
  </ModelProvider>
);

describe("ChatContext - Stop Generation", () => {
  it("should expose stopGeneration function", () => {
    const { result } = renderHook(() => useChatContext(), { wrapper });

    expect(result.current.stopGeneration).toBeDefined();
    expect(typeof result.current.stopGeneration).toBe("function");
  });

  it("should allow calling stopGeneration without errors", () => {
    const { result } = renderHook(() => useChatContext(), { wrapper });

    act(() => {
      result.current.stopGeneration();
    });

    // Should not throw and should maintain consistent state
    expect(result.current.responseStreamLoading).toBe(false);
  });

  it("should clean up state when stopGeneration is called", async () => {
    const { result } = renderHook(() => useChatContext(), { wrapper });

    act(() => {
      result.current.setPrompt("Test prompt");
    });

    expect(result.current.prompt).toBe("Test prompt");

    // Call stopGeneration
    act(() => {
      result.current.stopGeneration();
    });

    await waitFor(() => {
      expect(result.current.responseStreamLoading).toBe(false);
    });
  });
});
