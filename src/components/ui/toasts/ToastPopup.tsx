import { icons } from "@assets/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";
import React, { useEffect, useState, useRef } from "react";
import { useToast } from "@contexts/ToastContext";

const ToastPopup = ({ className, children, timerSeconds = 5 }: any) => {
  const { toastMessage, setToastMessage } = useToast();
  const [display, setDisplay] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const FADE_DURATION = 300;

  const startTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      handleClose();
    }, timerSeconds * 1000);
  };

  useEffect(() => {
    if (toastMessage) {
      setDisplay(true);
      setTimeout(() => setFadeIn(true), 10);
      startTimer();
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [toastMessage]);

  function handleClose() {
    setFadeIn(false);
    setTimeout(() => {
      setDisplay(false);
      setToastMessage(null);
    }, FADE_DURATION);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  }

  const handleMouseEnter = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  };

  const handleMouseLeave = () => {
    startTimer();
  };

  const defaultClasses =
    "ToastPopup flex flex-col gap-2 w-fit max-w-lg w-fit p-4 text-gray-500 rounded-md shadow dark:text-gray-400 bg-white dark:bg-gray-900 border border-primary-600 text-gray-500 dark:text-gray-200";
  return (
    <div
      id="toast"
      className={`${defaultClasses} ${className} 
        ${display ? "flex" : "hidden"}
        absolute z-[9999] left-1/2 transform -translate-x-1/2 top-16
      `}
      style={{
        transition: `opacity ${FADE_DURATION}ms ease-in-out`,
        opacity: fadeIn ? 1 : 0,
      }}
      role="alert"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="flex items-center justify-between gap-2 w-full ">
        <div className="text-sm font-normal">{toastMessage}</div>
        <div className="flex items-center ms-auto">
          <button
            type="button"
            data-dismiss-target="#toast"
            aria-label="Close"
            onClick={handleClose}
            className="flex-shrink-0 inline-flex justify-center items-center text-gray-400 hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 dark:hover:bg-gray-600 dark:hover:text-white"
          >
            <FontAwesomeIcon icon={icons.faXmark} className="size-4" />
            <span className="sr-only">Close banner</span>
          </button>
        </div>
      </div>
      {children && <div className="mt-2">{children}</div>}
    </div>
  );
};

export default ToastPopup;
