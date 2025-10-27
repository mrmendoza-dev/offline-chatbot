import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import * as webllm from "@mlc-ai/web-llm";
import { Check, ChevronsUpDown } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

interface Message {
  content: string;
  role: "system" | "user" | "assistant";
}

export const WebLLMLight = () => {
  const [messages, setMessages] = useState<Message[]>([
    { content: "You are a helpful AI agent helping users.", role: "system" },
  ]);
  const [selectedModel, setSelectedModel] = useState(
    "TinyLlama-1.1B-Chat-v0.4-q4f32_1-MLC-1k"
  );
  const [downloadStatus, setDownloadStatus] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);
  const [isEngineReady, setIsEngineReady] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [chatStats, setChatStats] = useState("");
  const [showStats, setShowStats] = useState(false);
  const [progress, setProgress] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [openModelSelect, setOpenModelSelect] = useState(false);

  const engineRef = useRef<webllm.MLCEngine | null>(null);
  const chatBoxRef = useRef<HTMLDivElement>(null);
  const bufferRef = useRef<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Dynamic model list - combobox with search handles performance
  const availableModels = useMemo(
    () => webllm.prebuiltAppConfig.model_list.map((m) => m.model_id),
    []
  );

  // Initialize engine
  useEffect(() => {
    engineRef.current = new webllm.MLCEngine();
    engineRef.current.setInitProgressCallback((report) => {
      setDownloadStatus(report.text);
      setProgress(report.progress * 100);
    });
  }, []);

  // Auto-scroll chat
  useEffect(() => {
    chatBoxRef.current?.scrollTo({
      top: chatBoxRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  const initializeWebLLMEngine = useCallback(async () => {
    if (!engineRef.current) return;
    setIsDownloading(true);
    setDownloadStatus("");
    try {
      await engineRef.current.reload(selectedModel, {
        temperature: 1.0,
        top_p: 1,
      });
      setIsEngineReady(true);
      setDownloadStatus("Model loaded successfully");
    } catch {
      setDownloadStatus("Failed to load model. Try again.");
    } finally {
      setIsDownloading(false);
    }
  }, [selectedModel]);

  const updateLastAssistantMessage = useCallback((content: string) => {
    setMessages((prev) => {
      if (prev.length === 0) return prev;
      const newMsgs = [...prev];
      const last = newMsgs[newMsgs.length - 1];
      if (last && last.role === "assistant") {
        newMsgs[newMsgs.length - 1] = { ...last, content };
      }
      return newMsgs;
    });
  }, []);

  const streamingGenerating = useCallback(
    async (
      msgs: Message[],
      onUpdate: (c: string) => void,
      onFinish: (c: string) => void,
      onError: (e: Error) => void
    ) => {
      if (!engineRef.current) return;
      try {
        let curMessage = "";
        const completion = await engineRef.current.chat.completions.create({
          stream: true,
          messages: msgs,
        });

        let raf: number | null = null;
        const flush = () => {
          onUpdate(bufferRef.current);
          raf = null;
        };

        for await (const chunk of completion) {
          const delta = chunk.choices[0]?.delta?.content;
          if (delta) {
            curMessage += delta;
            bufferRef.current = curMessage;
            if (!raf) raf = requestAnimationFrame(flush);
          }
        }

        const finalMsg = await engineRef.current.getMessage();
        onFinish(finalMsg);
      } catch (err) {
        onError(err as Error);
      }
    },
    []
  );

  const handleSend = useCallback(async () => {
    const input = inputValue.trim();
    if (!input || !engineRef.current) return;

    const savedInput = input;
    setIsGenerating(true);
    setInputValue(""); // Clear immediately

    // Build conversation
    const userMsg: Message = { role: "user", content: input };
    const placeholder: Message = { role: "assistant", content: "..." };

    const msgsToSend = [...messages, userMsg];
    setMessages([...msgsToSend, placeholder]);

    await streamingGenerating(
      msgsToSend,
      updateLastAssistantMessage,
      async (finalMsg) => {
        updateLastAssistantMessage(finalMsg);
        setIsGenerating(false);
        inputRef.current?.focus();
        try {
          const stats = await engineRef.current!.runtimeStatsText();
          setChatStats(stats);
          setShowStats(true);
        } catch {}
      },
      (err) => {
        console.error("Streaming error:", err);
        setIsGenerating(false);
        setInputValue(savedInput); // Restore on error
        inputRef.current?.focus();
      }
    );
  }, [inputValue, messages, streamingGenerating, updateLastAssistantMessage]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !isGenerating && isEngineReady) handleSend();
  };

  const handleModelChange = (model: string) => {
    setSelectedModel(model);
    setIsEngineReady(false);
    setDownloadStatus("");
    setProgress(0);
  };

  const clearChat = () => {
    setMessages([
      { content: "You are a helpful AI agent helping users.", role: "system" },
    ]);
    setShowStats(false);
    setChatStats("");
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6 p-4">
      <Card>
        <CardHeader>
          <CardTitle>Initialize WebLLM</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2">
            <Popover open={openModelSelect} onOpenChange={setOpenModelSelect}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openModelSelect}
                  className="flex-1 justify-between"
                  disabled={isDownloading}
                >
                  {selectedModel || "Select model..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[400px] p-0">
                <Command>
                  <CommandInput placeholder="Search models..." />
                  <CommandList>
                    <CommandEmpty>No model found.</CommandEmpty>
                    <CommandGroup>
                      {availableModels.map((model) => (
                        <CommandItem
                          key={model}
                          value={model}
                          onSelect={(currentValue) => {
                            handleModelChange(currentValue);
                            setOpenModelSelect(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              selectedModel === model
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {model}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            <Button
              onClick={initializeWebLLMEngine}
              disabled={isDownloading || isEngineReady}
            >
              {isEngineReady
                ? "Ready"
                : isDownloading
                ? "Downloading..."
                : "Download"}
            </Button>
          </div>
          {isDownloading && <Progress value={progress} className="h-2" />}
          {downloadStatus && (
            <p className="text-sm text-muted-foreground">{downloadStatus}</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle>Chat</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={clearChat}
            disabled={messages.length <= 1}
          >
            Clear
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          <div
            ref={chatBoxRef}
            className="h-80 overflow-y-auto rounded-md border bg-muted/30 p-3 space-y-2"
          >
            {messages
              .filter((m) => m.role !== "system")
              .map((m, i) => (
                <div
                  key={i}
                  className={`flex ${
                    m.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`rounded-lg px-3 py-2 text-sm max-w-[80%] shadow-sm ${
                      m.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground"
                    }`}
                  >
                    {m.content}
                  </div>
                </div>
              ))}
          </div>

          {showStats && (
            <div className="rounded-md bg-accent p-2 text-xs text-accent-foreground whitespace-pre-wrap">
              {chatStats}
            </div>
          )}

          <div className="flex gap-2">
            <Input
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isGenerating ? "Generating..." : "Type a message..."}
              disabled={!isEngineReady}
            />

            <Button
              onClick={handleSend}
              disabled={!isEngineReady || isGenerating}
            >
              Send
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
