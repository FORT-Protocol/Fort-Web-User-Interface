import { useEffect, useState } from "react";
import { createContainer } from "unstated-next";

export enum ThemeType {
  white = "white",
  dark = "dark",
}

const useThemesBase = () => {
  const [theme, setTheme] = useState<ThemeType>(getTheme());
  useEffect(() => {
    localStorage.setItem("theme", theme.valueOf());
  }, [theme]);
  return {theme, setTheme};
};

const themeBase = createContainer(useThemesBase);

const useThemes = () => {
  return themeBase.useContainer();
};

export default useThemes;
export const Provider = themeBase.Provider;

export function getTheme() {
  var cache = localStorage.getItem("theme");
  if (cache == null || cache === "dark") {
    localStorage.setItem("theme", "dark");
    return ThemeType.dark;
  } else {
    return ThemeType.white;
  }
}
