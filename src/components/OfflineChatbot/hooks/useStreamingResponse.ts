import { useCallback, useState } from "react";

export const useStreamingResponse = () => {
  const [stream, setStream] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const startStream = useCallback(
    async (reader: ReadableStreamDefaultReader<Uint8Array>) => {
      setIsLoading(true);
      setStream("");

      const decoder = new TextDecoder("utf-8");
      let fullResponse = "";

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          fullResponse += chunk;
          setStream(fullResponse);
        }
      } catch (error) {
        console.error("Error reading stream:", error);
        throw error;
      } finally {
        setIsLoading(false);
      }

      return fullResponse;
    },
    []
  );

  const resetStream = useCallback(() => {
    setStream("");
    setIsLoading(false);
  }, []);

  return {
    stream,
    isLoading,
    startStream,
    resetStream,
  };
};
