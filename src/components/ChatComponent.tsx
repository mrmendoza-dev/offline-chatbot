import { useEffect, useRef, useState } from "react";
import useLocalStorage from "@hooks/useLocalStorage";
import LoaderButton from "@components/ui/LoaderButton";
import { marked, use } from "marked";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { icons } from "@assets/icons";

const models = ["mistral", "llama3.1:8b"];

const ChatComponent = () => {
  const [prompt, setPrompt] = useState("");
  const [userPromptPlaceholder, setUserPromptPlaceholder] = useState(null);
  const [responseStream, setResponseStream] = useState("");
  const [currentModel, setCurrentModel] = useLocalStorage(
    "currentOfflineModel",
    models[0]
  );
  const [errorMessage, setErrorMessage] = useState(null);

  const [systemMessage, setSystemMessage] = useLocalStorage(
    "systemMessage",
    "You are a helpful personal assistant. Please reply in Markdown format when necessary for headings, links, bold, etc."
  );
  const [responseStreamLoading, setResponseStreamLoading] = useState(false);
  const [conversationHistory, setConversationHistory] = useLocalStorage(
    "conversationHistory",
    []
  );

  const handleAskPrompt = async (event) => {
    event.preventDefault();
    const userPrompt = prompt;
    if (!userPrompt) return;

    setPrompt("");
    setUserPromptPlaceholder(userPrompt);

    setResponseStream("");
    setResponseStreamLoading(true);

    try {
      const res = await fetch("http://localhost:3000/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          conversationHistory,
          prompt: userPrompt,
          model: currentModel,
          systemMessage,
        }),
      });

      const reader = res.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let botresponseStream = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        botresponseStream += chunk;
        setResponseStream((prev) => prev + chunk);
      }

      // Update conversation history with bot's responseStream
      setConversationHistory((prevHistory) => [
        ...prevHistory,
        { role: "user", content: userPrompt },

        { role: "assistant", content: botresponseStream },
      ]);
    } catch (error) {
      console.error("Error asking question:", error);
      setErrorMessage("An error occurred. Please try again.");
    } finally {
      setResponseStreamLoading(false);
      setUserPromptPlaceholder(null);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleAskPrompt(event);
    }
  };

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversationHistory, responseStream, userPromptPlaceholder]);

  return (
    <div className="flex flex-col relative mx-auto w-full h-full text-left">
      <form
        className="flex gap-4 relative mx-auto w-full p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 text-left"
        action=""
        onClick={(e) => e.preventDefault()}
      >
        <div className="">
          <label
            htmlFor="modelSelect"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Model select
          </label>

          <select
            id="modelSelect"
            className="block w-full p-2 mb-6 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            value={currentModel}
            onChange={(e) => setCurrentModel(e.target.value)}
          >
            {models.map((model) => (
              <option key={model} value={model}>
                {model}
              </option>
            ))}
          </select>
        </div>

        <div className="w-full">
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            System Message
          </label>
          <textarea
            value={systemMessage}
            onChange={(e) => setSystemMessage(e.target.value)}
            className="resize-none bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
        </div>
        <button
          type="button"
          onClick={() => setConversationHistory([])}
          className="place-self-center
          py-2.5 px-5 whitespace-nowrap text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
        >
          Clear Chat
        </button>
        {/* <button
          onClick={() => {
            console.log(conversationHistory);
          }}
        >
          TEST
        </button> */}
      </form>


      <div className="text-left p-6 markdown overflow-auto mx-auto w-full max-w-5xl h-full flex flex-col gap-4">
        {conversationHistory.map((entry, index) => (
          <div
            key={index}
            className={`inline-flex flex-col max-w-4xl leading-1.5 py-4 px-6 border-gray-200 bg-gray-100 rounded-xl dark:bg-gray-800 text-base font-normal text-gray-900 dark:text-white ${
              entry.role === "user"
                ? "self-end bg-blue-100 dark:bg-blue-950"
                : "self-start"
            }`}
          >
            <div
              className={`break-words text-left`}
              dangerouslySetInnerHTML={{
                __html: marked(entry.content),
              }}
            ></div>
          </div>
        ))}

        {responseStreamLoading && (
          <>
            <div
              className={`inline-flex flex-col max-w-4xl leading-1.5 py-4 px-6 border-gray-200 bg-gray-100 rounded-xl dark:bg-gray-800 text-base font-normal text-gray-900 dark:text-white ${"self-end bg-blue-100 dark:bg-blue-950"}`}
            >
              <p>{userPromptPlaceholder}</p>
            </div>
            <div
              className={`inline-flex flex-col max-w-4xl leading-1.5 py-4 px-6 border-gray-200 bg-gray-100 rounded-xl dark:bg-gray-800 text-base font-normal text-gray-900 dark:text-white ${"self-start"}`}
            >
              <p>{responseStream}</p>
            </div>
          </>
        )}

        <div ref={messagesEndRef}></div>
      </div>

      <div
        className="
            relative max-w-5xl mx-auto w-full p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 text-left"
      >
        {errorMessage && (
          <ToastError
            message={errorMessage}
            onClose={() => setErrorMessage("")}
            className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2"
          />
        )}

        <div className="flex items-start">
          <button
            type="button"
            onClick={() => {
              navigator.mediaDevices.getUserMedia({ audio: true });
            }}
            className="text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 hover:text-blue-700 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
          >
            <FontAwesomeIcon icon={icons.faMicrophone} className="size-5" />
          </button>

          <button
            type="button"
            className="text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 hover:text-blue-700 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
          >
            <FontAwesomeIcon icon={icons.faPaperclip} className="size-5" />
          </button>

          <textarea
            placeholder="Ask me anything"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            className="
            resize-none bg-gray-50 border border-gray-300 text-gray-900 text-base rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
          <LoaderButton
            onClick={handleAskPrompt}
            className="text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 hover:text-blue-700 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
            isLoading={responseStreamLoading}
            loadingText=""
          >
            <FontAwesomeIcon icon={icons.faCircleArrowUp} className="size-5" />
          </LoaderButton>
        </div>
      </div>
    </div>
  );
};

export default ChatComponent;

const ToastError = ({ message, onClose, className }) => {
  return (
    <div
      id="toast-error"
      className={`${className}
                        flex items-center w-full max-w-xs p-4 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800 border border-gray-200 dark:border-gray-600`}
      role="alert"
    >
      <div className="text-sm font-normal">{message}</div>
      <div
        className="flex items
      -center ms-auto space-x-2 rtl:space-x-reverse"
      >
        <button
          type="button"
          className="ms-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700"
          data-dismiss-target="#toast-error"
          aria-label="Close"
          onClick={onClose}
        >
          <FontAwesomeIcon icon={icons.faXmark} className="size-5" />
        </button>
      </div>
    </div>
  );
};
