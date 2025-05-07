"use client"

import { createContext, useContext, useState, useEffect } from "react"

const ThemeContext = createContext(null)

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("dark")

  useEffect(() => {
    // Check if user has a saved theme preference
    const savedTheme = localStorage.getItem("glintTheme")
    if (savedTheme) {
      setTheme(savedTheme)
    } else {
      // Check if user prefers dark mode
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
      setTheme(prefersDark ? "dark" : "light")
    }
  }, [])

  const updateTheme = (newTheme) => {
    setTheme(newTheme)
    localStorage.setItem("glintTheme", newTheme)

    // Apply theme to document
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }

  // Apply theme on change
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [theme])

  const value = {
    theme,
    setTheme: updateTheme,
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
