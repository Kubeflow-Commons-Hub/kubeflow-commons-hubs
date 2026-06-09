"use client";

import {
  useState,
  useEffect,
  useSyncExternalStore,
  createContext,
  useContext,
  useCallback,
} from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

type Theme = "light" | "dark" | "system";

interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: "light" | "dark";
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: "system",
  setTheme: () => {},
  resolvedTheme: "dark",
});

export function useTheme() {
  return useContext(ThemeContext);
}

const THEME_KEY = "theme";
const THEME_EVENT = "theme-change";

function getSystemTheme(): "light" | "dark" {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function resolveTheme(theme: Theme): "light" | "dark" {
  if (theme === "system") return getSystemTheme();
  return theme;
}

function applyTheme(resolved: "light" | "dark") {
  document.documentElement.classList.remove("light", "dark");
  document.documentElement.classList.add(resolved);
}

function subscribeTheme(callback: () => void) {
  window.addEventListener(THEME_EVENT, callback);
  const mq = window.matchMedia("(prefers-color-scheme: dark)");
  mq.addEventListener("change", callback);
  return () => {
    window.removeEventListener(THEME_EVENT, callback);
    mq.removeEventListener("change", callback);
  };
}

function getThemePreferenceSnapshot(): Theme {
  return (localStorage.getItem(THEME_KEY) as Theme) || "system";
}

function getThemePreferenceServerSnapshot(): Theme {
  return "system";
}

function getResolvedThemeSnapshot(): "light" | "dark" {
  return resolveTheme(getThemePreferenceSnapshot());
}

function getResolvedThemeServerSnapshot(): "light" | "dark" {
  return "dark";
}

function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useSyncExternalStore(
    subscribeTheme,
    getThemePreferenceSnapshot,
    getThemePreferenceServerSnapshot
  );
  const resolvedTheme = useSyncExternalStore(
    subscribeTheme,
    getResolvedThemeSnapshot,
    getResolvedThemeServerSnapshot
  );

  useEffect(() => {
    applyTheme(resolvedTheme);
  }, [resolvedTheme]);

  const setTheme = useCallback((newTheme: Theme) => {
    localStorage.setItem(THEME_KEY, newTheme);
    applyTheme(resolveTheme(newTheme));
    window.dispatchEvent(new Event(THEME_EVENT));
  }, []);

  return (
    <ThemeContext value={{ theme, setTheme, resolvedTheme }}>
      {children}
    </ThemeContext>
  );
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        {children}
      </ThemeProvider>
    </QueryClientProvider>
  );
}
