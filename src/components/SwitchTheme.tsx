import React, { useEffect } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import type DaisyTheme from "../constants/daisy";
import { MoonIcon, SunIcon } from "./Icons";

// SwitchTheme.tsx
// https://reacthustle.com/blog/how-to-setup-daisyui-theme-with-nextjs
const SwitchTheme: React.FC = () => {
  const [theme, setTheme] = useLocalStorage<DaisyTheme>("DaisyTheme", "night");

  useEffect(() => {
    const body = document.body;
    body.setAttribute("data-theme", theme);
  }, [theme]);

  function switchTheme(): void {
    if (theme === "night") {
      setTheme("winter");
    } else {
      setTheme("night");
    }
  }

  return (
    <label className="cursor-pointer" onClick={switchTheme}>
      {theme === "night" ? (
        <MoonIcon className="h-10 w-10" />
      ) : (
        <SunIcon className="h-10 w-10" />
      )}
    </label>
  );
};

export default SwitchTheme;
