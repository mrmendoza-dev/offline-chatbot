import { useCallback, useEffect } from "react";

interface HotkeyConfig {
  key: string;
  ctrl?: boolean;
  alt?: boolean;
  shift?: boolean;
  meta?: boolean;
  handler: () => void;
  global?: boolean; // Allow hotkey to work even in input fields
}

interface UseHotkeysOptions {
  hotkeys: HotkeyConfig[];
  enabled?: boolean;
}

export const useHotkeys = ({ hotkeys, enabled = true }: UseHotkeysOptions) => {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return;

      // Check if we're in an input field
      const target = event.target as HTMLElement;
      const isInInputField =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.contentEditable === "true" ||
        (target.closest &&
          (target.closest("input") || target.closest("textarea")));

      for (const hotkey of hotkeys) {
        const {
          key,
          ctrl = false,
          alt = false,
          shift = false,
          meta = false,
          handler,
          global = false,
        } = hotkey;

        // Skip non-global hotkeys when in input fields
        if (isInInputField && !global) continue;

        // Check if the pressed key matches
        if (event.key.toLowerCase() !== key.toLowerCase()) continue;

        // Check modifier keys
        if (event.ctrlKey !== ctrl) continue;
        if (event.altKey !== alt) continue;
        if (event.shiftKey !== shift) continue;
        if (event.metaKey !== meta) continue;

        // Prevent default behavior and execute handler
        event.preventDefault();
        handler();
        break; // Only execute the first matching hotkey
      }
    },
    [hotkeys, enabled]
  );

  useEffect(() => {
    if (!enabled) return;

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown, enabled]);
};
