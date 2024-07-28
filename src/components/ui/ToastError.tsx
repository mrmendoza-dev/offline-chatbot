


import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { icons } from "@assets/icons";



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


export default ToastError;