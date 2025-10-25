import { useHotkeys } from "@/components/OfflineChatbot/hooks/useHotkeys";
import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

describe("useHotkeys", () => {
  it("should call handler when hotkey is pressed", () => {
    const handler = vi.fn();

    renderHook(() =>
      useHotkeys({
        hotkeys: [
          {
            key: "a",
            handler,
          },
        ],
      })
    );

    // Simulate keydown event
    const event = new KeyboardEvent("keydown", { key: "a" });
    document.dispatchEvent(event);

    expect(handler).toHaveBeenCalledTimes(1);
  });

  it("should not call handler when modifier keys don't match", () => {
    const handler = vi.fn();

    renderHook(() =>
      useHotkeys({
        hotkeys: [
          {
            key: "a",
            ctrl: true,
            handler,
          },
        ],
      })
    );

    // Simulate keydown event without ctrl
    const event = new KeyboardEvent("keydown", { key: "a" });
    document.dispatchEvent(event);

    expect(handler).not.toHaveBeenCalled();
  });

  it("should call handler when modifier keys match", () => {
    const handler = vi.fn();

    renderHook(() =>
      useHotkeys({
        hotkeys: [
          {
            key: "a",
            ctrl: true,
            handler,
          },
        ],
      })
    );

    // Simulate keydown event with ctrl
    const event = new KeyboardEvent("keydown", { key: "a", ctrlKey: true });
    document.dispatchEvent(event);

    expect(handler).toHaveBeenCalledTimes(1);
  });

  it("should not trigger hotkeys when typing in input fields", () => {
    const handler = vi.fn();

    renderHook(() =>
      useHotkeys({
        hotkeys: [
          {
            key: "a",
            handler,
          },
        ],
      })
    );

    // Create a mock input element
    const input = document.createElement("input");
    document.body.appendChild(input);
    input.focus();

    // Simulate keydown event with the input as target
    const event = new KeyboardEvent("keydown", { key: "a" });
    Object.defineProperty(event, "target", {
      value: input,
      writable: false,
    });
    document.dispatchEvent(event);

    expect(handler).not.toHaveBeenCalled();

    // Cleanup
    document.body.removeChild(input);
  });

  it("should not trigger hotkeys when disabled", () => {
    const handler = vi.fn();

    renderHook(() =>
      useHotkeys({
        hotkeys: [
          {
            key: "a",
            handler,
          },
        ],
        enabled: false,
      })
    );

    // Simulate keydown event
    const event = new KeyboardEvent("keydown", { key: "a" });
    document.dispatchEvent(event);

    expect(handler).not.toHaveBeenCalled();
  });

  it("should trigger global hotkeys even when typing in input fields", () => {
    const handler = vi.fn();

    renderHook(() =>
      useHotkeys({
        hotkeys: [
          {
            key: "Escape",
            global: true,
            handler,
          },
        ],
      })
    );

    // Create a mock input element
    const input = document.createElement("input");
    document.body.appendChild(input);
    input.focus();

    // Simulate keydown event with the input as target
    const event = new KeyboardEvent("keydown", { key: "Escape" });
    Object.defineProperty(event, "target", {
      value: input,
      writable: false,
    });
    document.dispatchEvent(event);

    expect(handler).toHaveBeenCalledTimes(1);

    // Cleanup
    document.body.removeChild(input);
  });
});
