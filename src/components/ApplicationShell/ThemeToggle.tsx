import { icons } from "@assets/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useThemeToggle from "@hooks/useThemeToggle";

const ThemeToggle = () => {
  const [isDarkMode, toggleTheme] = useThemeToggle();

  return (
    <button
      id="theme-toggle"
      type="button"
      className="nav-link text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-2.5"
      onClick={toggleTheme}
    >
      <FontAwesomeIcon
        icon={isDarkMode ? icons.faMoon : icons.faSun}
        id={isDarkMode ? "theme-toggle-dark-icon" : "theme-toggle-light-icon"}
        className={`size-5`}
      />
    </button>
  );
};

export default ThemeToggle;
