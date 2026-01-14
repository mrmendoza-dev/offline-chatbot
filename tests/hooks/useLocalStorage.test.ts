import { useLocalStorage } from "@/components/offline-chatbot/hooks/useLocalStorage";
import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

// Helper function to clear localStorage
const clearLocalStorage = () => {
  if (typeof localStorage !== "undefined") {
    if (typeof localStorage.clear === "function") {
      localStorage.clear();
    } else {
      // Fallback: remove all keys manually
      const keys = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key !== null) {
          keys.push(key);
        }
      }
      keys.forEach((key) => localStorage.removeItem(key));
    }
  }
};

describe("useLocalStorage hook", () => {
  beforeEach(() => {
    clearLocalStorage();
  });

  afterEach(() => {
    clearLocalStorage();
  });

  it("should initialize with default value", () => {
    const { result } = renderHook(() => useLocalStorage("test-key", "default"));
    expect(result.current[0]).toBe("default");
  });

  it("should save to localStorage", () => {
    const { result } = renderHook(() => useLocalStorage("test-key", "initial"));

    act(() => {
      result.current[1]("new-value");
    });

    expect(result.current[0]).toBe("new-value");
    expect(localStorage.getItem("test-key")).toBe('"new-value"');
  });

  it("should read from localStorage on initialization", () => {
    localStorage.setItem("test-key", '"stored-value"');

    const { result } = renderHook(() => useLocalStorage("test-key", "default"));
    expect(result.current[0]).toBe("stored-value");
  });

  it("should handle function updates", () => {
    const { result } = renderHook(() => useLocalStorage("test-key", 0));

    act(() => {
      result.current[1]((prev: number) => prev + 1);
    });

    expect(result.current[0]).toBe(1);
  });
});
