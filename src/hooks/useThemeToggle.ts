import { useState, useEffect } from "react";


type UseThemeToggle = [boolean, () => void];

const useThemeToggle = (): UseThemeToggle => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("color-theme");
    if (savedTheme) {
      return savedTheme === "dark";
    }
    return true;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("color-theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("color-theme", "light");
    }
  }, [isDarkMode]);

  const toggleTheme = (): any => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  return [isDarkMode, toggleTheme];
};

export default useThemeToggle;
