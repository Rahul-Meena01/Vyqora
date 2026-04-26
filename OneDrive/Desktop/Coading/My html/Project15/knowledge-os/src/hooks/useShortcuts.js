import { useEffect, useRef } from "react";

const keyMatches = (event, shortcut) => {
  return (
    event.key.toLowerCase() === shortcut.key.toLowerCase() &&
    Boolean(event.ctrlKey || event.metaKey) === Boolean(shortcut.ctrlOrMeta) &&
    Boolean(event.shiftKey) === Boolean(shortcut.shift) &&
    Boolean(event.altKey) === Boolean(shortcut.alt)
  );
};

export const useShortcuts = (shortcuts) => {
  const shortcutsRef = useRef(shortcuts);

  useEffect(() => {
    shortcutsRef.current = shortcuts;
  }, [shortcuts]);

  useEffect(() => {
    const onKeyDown = (event) => {
      const tag = event.target?.tagName;
      const isTypingTarget =
        tag === "INPUT" ||
        tag === "TEXTAREA" ||
        event.target?.isContentEditable;

      for (const shortcut of shortcutsRef.current) {
        if (isTypingTarget && !shortcut.allowWhileTyping) {
          continue;
        }

        if (keyMatches(event, shortcut)) {
          event.preventDefault();
          shortcut.handler(event);
          break;
        }
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);
};
