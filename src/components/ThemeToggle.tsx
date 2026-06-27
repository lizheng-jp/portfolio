"use client";

import React, { useSyncExternalStore } from "react";
import { ToggleButton, useTheme } from "@once-ui-system/core";

type ResolvedTheme = "dark" | "light";

const serverResolvedTheme: ResolvedTheme = "dark";

function readResolvedTheme(): ResolvedTheme {
  if (typeof document === "undefined") {
    return serverResolvedTheme;
  }

  return document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";
}

function subscribeToThemeChanges(onStoreChange: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  const observer = new MutationObserver(onStoreChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });

  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  mediaQuery.addEventListener("change", onStoreChange);

  return () => {
    observer.disconnect();
    mediaQuery.removeEventListener("change", onStoreChange);
  };
}

export const ThemeToggle: React.FC = () => {
  const { setTheme } = useTheme();
  const resolvedTheme = useSyncExternalStore(
    subscribeToThemeChanges,
    readResolvedTheme,
    () => serverResolvedTheme,
  );
  const icon = resolvedTheme === "dark" ? "light" : "dark";
  const nextTheme = resolvedTheme === "light" ? "dark" : "light";

  return (
    <ToggleButton
      prefixIcon={icon}
      onClick={() => setTheme(nextTheme)}
      aria-label={`Switch to ${nextTheme} mode`}
    />
  );
};
