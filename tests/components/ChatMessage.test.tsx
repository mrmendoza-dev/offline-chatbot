import { ChatMessage } from "@/components/OfflineChatbot/components/chat/ChatMessage";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

describe("ChatMessage", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders user message correctly", () => {
    render(<ChatMessage content="Hello!" role="user" />);
    expect(screen.getByText("Hello!")).toBeInTheDocument();
  });

  it("renders assistant message correctly", () => {
    render(<ChatMessage content="Hi there!" role="assistant" />);
    expect(screen.getByText("Hi there!")).toBeInTheDocument();
  });

  it("renders placeholder variant correctly", () => {
    render(
      <ChatMessage content="Placeholder" role="user" variant="placeholder" />
    );
    expect(screen.getByText("Placeholder")).toBeInTheDocument();
  });

  it("renders markdown content correctly", () => {
    render(<ChatMessage content="# Header" role="assistant" />);
    expect(screen.getByText("Header")).toBeInTheDocument();
  });
});
