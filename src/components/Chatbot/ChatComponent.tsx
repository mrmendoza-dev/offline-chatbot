import { icons } from "@assets/icons";
import LoaderButton from "@components/ui/LoaderButton";
import ToastError from "@components/ui/ToastError";
import { useChatContext } from "@contexts/ChatContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { marked } from "marked";
import { useEffect } from "react";

const ChatComponent = () => {
  const {
    prompt,
    setPrompt,
    currentModel,
    setCurrentModel,
    systemMessage,
    setSystemMessage,
    handleAskPrompt,
    handleKeyDown,
    setConversationHistory,

    errorMessage,
    setErrorMessage,

    userPromptPlaceholder,
    responseStream,
    responseStreamLoading,
    conversationHistory,
    messagesEndRef,

    handleFileUpload,
    removeFile,
    uploadedFiles,
  } = useChatContext();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversationHistory, responseStream, userPromptPlaceholder]);

  return (
    <div className="flex flex-col relative mx-auto w-full h-full text-left">
      <div className="text-left p-6 markdown overflow-auto mx-auto w-full max-w-5xl h-full flex flex-col gap-4">
        {conversationHistory.map((entry, index) => (
          <div
            key={index}
            className={`inline-flex flex-col max-w-4xl leading-1.5 py-4 px-6 border-gray-200 bg-gray-100 rounded-xl dark:bg-gray-800 text-base font-normal text-gray-900 dark:text-white ${
              entry.role === "user"
                ? "self-end bg-primary-100 dark:bg-primary-950"
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
              className={`inline-flex flex-col max-w-4xl leading-1.5 py-4 px-6 border-gray-200 bg-gray-100 rounded-xl dark:bg-gray-800 text-base font-normal text-gray-900 dark:text-white ${"self-end bg-primary-100 dark:bg-primary-950"}`}
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
            relative max-w-4xl mx-auto w-full p-2 bg-white border-none rounded-3xl shadow bg-gray-50 dark:bg-gray-800 text-left"
      >
        {errorMessage && (
          <ToastError
            message={errorMessage}
            onClose={() => setErrorMessage("")}
            className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2"
          />
        )}

        {uploadedFiles.length > 0 && (
          <div className="mb-2 flex gap-2 overflow-x-auto w-full">
            {uploadedFiles.map((file, index) => (
              <div
                key={index}
                className="overflow-hidden flex gap-2 max-w-sm w-min py-2 px-3 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-900 dark:border-gray-700 cursor-pointer"
                onClick={() => removeFile(index)}
                title="Remove file"
              >
                <div className="flex items-center justify-center min-w-10 h-10 rounded-lg bg-primary-500 dark:bg-primary-700">
                  <FontAwesomeIcon icon={icons.faFile} className="size-5" />
                </div>
                <div className="overflow-hidden">
                  <h5 className="text-sm text-gray-900 dark:text-white truncate">
                    {file.name}
                  </h5>
                  <p className="text-sm text-gray-700 dark:text-gray-400">
                    {file.type}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="flex items-start">
          <label className="text-gray-900 hover:text-primary-700 focus:ring-4 focus:outline-none font-medium text-sm text-center inline-flex items-center dark:text-gray-400 dark:hover:text-white cursor-pointer p-2.5">
            <input
              type="file"
              multiple
              onChange={handleFileUpload}
              className="hidden"
            />
            <FontAwesomeIcon icon={icons.faPaperclip} className="size-5" />
          </label>

          <textarea
            placeholder="Ask me anything"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            className="
            resize-none bg-gray-50 text-gray-900 text-base block w-full p-2.5 dark:bg-gray-800 dark:placeholder-gray-400 dark:text-white border-none focus:outline-none focus:ring-0 focus:border-0 max-h-32"
          />
          <LoaderButton
            onClick={handleAskPrompt}
            className="text-gray-900 hover:text-primary-700 focus:ring-4 focus:outline-none font-medium text-sm text-center inline-flex items-center dark:text-gray-400 dark:hover:text-white cursor-pointer p-2.5"
            isLoading={responseStreamLoading}
            loadingText=""
          >
            <FontAwesomeIcon icon={icons.faCircleArrowUp} className="size-6" />
          </LoaderButton>
        </div>
      </div>
    </div>
  );
};

export default ChatComponent;

{
  /* <button
            type="button"
            onClick={() => {
              navigator.mediaDevices.getUserMedia({ audio: true });
            }}
            className="text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 hover:text-primary-700 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
          >
            <FontAwesomeIcon icon={icons.faMicrophone} className="size-5" />
          </button> */
}
