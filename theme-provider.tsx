import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

type ThemeContextType = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  showDarkModePromptDialog: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    // Check localStorage for saved theme preference
    try {
      const savedTheme = localStorage.getItem("theme");
      return (savedTheme as Theme) || "dark";
    } catch (error) {
      console.error("Error accessing localStorage for theme:", error);
      return "dark";
    }
  });
  const [showDarkModePrompt, setShowDarkModePrompt] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    
    // Remove previous theme classes
    root.classList.remove("light", "dark");
    
    // Add current theme class
    root.classList.add(theme);
    
    // Store theme preference
    try {
      localStorage.setItem("theme", theme);
    } catch (error) {
      console.error("Error saving theme to localStorage:", error);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const showDarkModePromptDialog = () => {
    setShowDarkModePrompt(true);
  };

  const handleDarkModeChoice = (useDarkMode: boolean) => {
    if (useDarkMode) {
      setTheme("dark");
    }
    setShowDarkModePrompt(false);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme, showDarkModePromptDialog }}>
      {children}
      {showDarkModePrompt && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
            <h3 className="text-lg font-semibold text-ios-dark mb-3">Too harsh on your eyes?</h3>
            <p className="text-ios-gray-3 mb-6">Switch to dark mode for a more comfortable viewing experience, especially in low light.</p>
            <div className="flex space-x-3">
              <button
                onClick={() => handleDarkModeChoice(false)}
                className="flex-1 px-4 py-2 border border-ios-gray-2 rounded-lg text-ios-gray-3 hover:bg-ios-gray-2 transition-colors"
              >
                Keep Light
              </button>
              <button
                onClick={() => handleDarkModeChoice(true)}
                className="flex-1 px-4 py-2 bg-ios-blue text-white rounded-lg hover:bg-ios-blue/90 transition-colors"
              >
                Use Dark Mode
              </button>
            </div>
          </div>
        </div>
      )}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}