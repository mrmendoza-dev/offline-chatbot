import { useChatContext } from "@contexts/ChatContext";
import ThemeToggle from "@components/ApplicationShell/ThemeToggle";

function ChatHeader() {
  const {
    models,
    currentModel,
    setCurrentModel,
    systemMessage,
    setSystemMessage,
    resetChat,
  } = useChatContext();


  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-2.5 dark:bg-gray-800 dark:border-gray-700 fixed left-0 right-0 top-0 z-50">
      <div className="flex  justify-between items-start gap-2">
        <form
          className="flex gap-2 relative text-left w-full"
          action=""
          onClick={(e) => e.preventDefault()}
        >
          <div className="">
            <label
              htmlFor="modelSelect"
              className="block mb-1 text-xs font-medium text-gray-900 dark:text-white"
            >
              Model select
            </label>

            <select
              id="modelSelect"
              className="block w-full p-2 mb-6 text-lg text-gray-900 bg-white dark:bg-gray-800 border-none dark:placeholder-gray-400 dark:text-gray-300 focus:outline-none focus:border-none cursor-pointer"
              value={currentModel}
              onChange={(e) => setCurrentModel(e.target.value)}
            >
              {models.map((model: any, index: number) => (
                <option key={index} value={model.model}>
                  {model.name}
                </option>
              ))}
            </select>
          </div>

          <div className="w-full max-w-3xl">
            <label className="block mb-1 text-xs font-medium text-gray-900 dark:text-white">
              System Message
            </label>
            <textarea
              value={systemMessage}
              onChange={(e) => setSystemMessage(e.target.value)}
              className="resize-none bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
            />
          </div>
        </form>

        <div className="flex items-center gap-2 lg:order-2">
          <button
            type="button"
            onClick={() => resetChat()}
            className="place-self-center py-2.5 px-5 whitespace-nowrap text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
          >
            Clear Chat
          </button>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}

export default ChatHeader;
