import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { icons } from "@assets/icons";
import classNames from "classnames";

const LoaderButton = ({
  isLoading,
  loadingText = "Loading...",
  onClick,
  children,
  className = "",
  ...props
}) => {
  // const defaultClasses =
  //   "py-2.5 px-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700";

  return (
    <button
      onClick={onClick}
      className={classNames(className)}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? (
        <div className="flex gap-2 items-center">
          <FontAwesomeIcon
            className="text-blue-500 size-5"
            icon={icons.faCircleNotch}
            spin
          />
          {loadingText}
        </div>
      ) : (
        children
      )}
    </button>
  );
};

export default LoaderButton;
