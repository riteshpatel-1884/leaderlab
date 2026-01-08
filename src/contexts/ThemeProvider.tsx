'use client';

import React, { createContext, useContext, useState, useEffect } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
  setIsDark: (value: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // 1. Initialize with a default to ensure context always has a value
  const [theme, setTheme] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // 2. Client-side only: check storage or system preference
    const storedTheme = localStorage.getItem("theme") as Theme | null;
    if (storedTheme) {
      setTheme(storedTheme);
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTheme("dark");
    } else {
      setTheme("light");
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    // 3. Apply theme to HTML element
    if (!mounted) return;
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme, mounted]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const setIsDark = (val: boolean) => setTheme(val ? "dark" : "light");

  // 4. PREVENT FLASH: Optional. 
  // If you want to avoid a flash of wrong theme, render nothing until mounted.
  // If you want SEO/faster LCP, render immediately (might flicker).
  // The crucial fix is: NEVER render {children} without the Provider wrapping it.
  if (!mounted) {
     return null; // Don't render anything until we know the theme preference
  }

  return (
    <ThemeContext.Provider 
      value={{ 
        theme, 
        isDark: theme === "dark", 
        toggleTheme,
        setIsDark 
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used inside ThemeProvider");
  }
  return context;
}