import { RefObject, useEffect, useRef } from "react";

export const useScrollToBottom = (
  dependency: unknown
): RefObject<HTMLDivElement> => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [dependency]);

  return messagesEndRef;
};
