import { icons } from "@assets/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ApplicationShellContext } from "./ApplicationShell";
import ThemeToggle from "./ThemeToggle";
import { useChatContext, ChatProvider } from "@contexts/ChatContext";
import React, { useContext } from "react";



function Nav() {


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
      resetChat,
    } = useChatContext();

    const models = ["mistral", "llama3.1:8b"];




      return (
        <div className="Nav">
          <nav className="bg-white border-b border-gray-200 px-4 py-2.5 dark:bg-gray-800 dark:border-gray-700 fixed left-0 right-0 top-0 z-50">
            <div className="flex  justify-between items-center">
              <div className="flex justify-start items-center w-full">
                <button
                  data-drawer-target="drawer-navigation"
                  data-drawer-toggle="drawer-navigation"
                  aria-controls="drawer-navigation"
                  className="p-2 mr-2 text-gray-600 rounded-lg cursor-pointer md:hidden hover:text-gray-900 hover:bg-gray-100 focus:bg-gray-100 dark:focus:bg-gray-700 focus:ring-2 focus:ring-gray-100 dark:focus:ring-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                >
                  <svg
                    aria-hidden="true"
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                      clipRule="evenodd"
                    ></path>
                  </svg>

                  <svg
                    aria-hidden="true"
                    className="hidden w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  <span className="sr-only">Toggle sidebar</span>
                </button>
                <a href="#" className="flex items-center justify-between mr-4">
                  {/* <img
                src="/images/logo.png"
                className="mr-3 h-8"
                alt="Flowbite Logo"
              /> */}
                  <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white text-black">
                    Local AI
                  </span>
                </a>

                <form
                  className="flex gap-4 relative text-left w-full"
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

                  <div className="w-full max-w-3xl">
                    <label className="block mb-1 text-xs font-medium text-gray-900 dark:text-white">
                      System Message
                    </label>
                    <textarea
                      value={systemMessage}
                      onChange={(e) => setSystemMessage(e.target.value)}
                      className="resize-none bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    />
                  </div>
                </form>
              </div>

              <div className="flex items-center gap-2 lg:order-2">
                <button
                  type="button"
                  onClick={() => resetChat()}
                  className="place-self-center py-2.5 px-5 whitespace-nowrap text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                >
                  Clear Chat
                </button>
                <ThemeToggle />
              </div>
            </div>
          </nav>
        </div>
      );
}

export default Nav;
