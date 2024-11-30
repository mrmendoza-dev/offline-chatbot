import { icons } from "@assets/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";

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
      className={clsx(className)}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? (
        <div className="flex gap-2 items-center">
          <FontAwesomeIcon
            className="text-primary-500 size-5"
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
