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
