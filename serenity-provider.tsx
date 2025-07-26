import { createContext, useContext, useEffect, useState } from "react";

type SerenityLevel = 0 | 1 | 2 | 3 | 4 | 5;

interface SerenitySettings {
  level: SerenityLevel;
  name: string;
  description: string;
  colors: {
    primary: string;
    background: string;
    card: string;
    text: string;
    accent: string;
  };
  animations: {
    duration: string;
    easing: string;
  };
  spacing: {
    padding: string;
    margin: string;
  };
  effects: {
    blur: string;
    shadow: string;
    rounded: string;
  };
}

const serenityConfigs: Record<SerenityLevel, SerenitySettings> = {
  0: {
    level: 0,
    name: "Energized",
    description: "Full intensity with vibrant colors and fast animations",
    colors: {
      primary: "hsl(207, 90%, 54%)",
      background: "hsl(0, 0%, 100%)",
      card: "hsl(0, 0%, 100%)",
      text: "hsl(28, 8%, 25%)",
      accent: "hsl(142, 70%, 45%)",
    },
    animations: {
      duration: "150ms",
      easing: "ease-out",
    },
    spacing: {
      padding: "1rem",
      margin: "1rem",
    },
    effects: {
      blur: "0px",
      shadow: "0 10px 25px -5px rgb(0 0 0 / 0.1)",
      rounded: "0.75rem",
    },
  },
  1: {
    level: 1,
    name: "Focused",
    description: "Slightly reduced intensity with balanced colors",
    colors: {
      primary: "hsl(207, 75%, 58%)",
      background: "hsl(240, 8%, 98%)",
      card: "hsl(0, 0%, 100%)",
      text: "hsl(28, 8%, 30%)",
      accent: "hsl(142, 60%, 50%)",
    },
    animations: {
      duration: "200ms",
      easing: "ease-out",
    },
    spacing: {
      padding: "1.25rem",
      margin: "1.25rem",
    },
    effects: {
      blur: "0px",
      shadow: "0 8px 20px -3px rgb(0 0 0 / 0.08)",
      rounded: "0.875rem",
    },
  },
  2: {
    level: 2,
    name: "Balanced",
    description: "Moderate intensity with softer colors",
    colors: {
      primary: "hsl(207, 60%, 62%)",
      background: "hsl(240, 12%, 96%)",
      card: "hsl(0, 0%, 99%)",
      text: "hsl(28, 8%, 35%)",
      accent: "hsl(142, 50%, 55%)",
    },
    animations: {
      duration: "300ms",
      easing: "ease-in-out",
    },
    spacing: {
      padding: "1.5rem",
      margin: "1.5rem",
    },
    effects: {
      blur: "0px",
      shadow: "0 6px 15px -2px rgb(0 0 0 / 0.06)",
      rounded: "1rem",
    },
  },
  3: {
    level: 3,
    name: "Calm",
    description: "Reduced intensity with muted colors",
    colors: {
      primary: "hsl(207, 45%, 66%)",
      background: "hsl(240, 15%, 94%)",
      card: "hsl(0, 0%, 98%)",
      text: "hsl(28, 8%, 40%)",
      accent: "hsl(142, 40%, 60%)",
    },
    animations: {
      duration: "400ms",
      easing: "ease-in-out",
    },
    spacing: {
      padding: "1.75rem",
      margin: "1.75rem",
    },
    effects: {
      blur: "0.5px",
      shadow: "0 4px 10px -1px rgb(0 0 0 / 0.04)",
      rounded: "1.125rem",
    },
  },
  4: {
    level: 4,
    name: "Serene",
    description: "Low intensity with gentle, pastel colors",
    colors: {
      primary: "hsl(207, 30%, 70%)",
      background: "hsl(240, 20%, 92%)",
      card: "hsl(0, 0%, 97%)",
      text: "hsl(28, 8%, 45%)",
      accent: "hsl(142, 30%, 65%)",
    },
    animations: {
      duration: "500ms",
      easing: "ease-in-out",
    },
    spacing: {
      padding: "2rem",
      margin: "2rem",
    },
    effects: {
      blur: "1px",
      shadow: "0 2px 6px 0 rgb(0 0 0 / 0.02)",
      rounded: "1.25rem",
    },
  },
  5: {
    level: 5,
    name: "Zen",
    description: "Minimal intensity with ultra-soft, monochromatic colors",
    colors: {
      primary: "hsl(207, 15%, 74%)",
      background: "hsl(240, 25%, 90%)",
      card: "hsl(0, 0%, 96%)",
      text: "hsl(28, 8%, 50%)",
      accent: "hsl(142, 20%, 70%)",
    },
    animations: {
      duration: "600ms",
      easing: "ease-in-out",
    },
    spacing: {
      padding: "2.5rem",
      margin: "2.5rem",
    },
    effects: {
      blur: "2px",
      shadow: "0 1px 3px 0 rgb(0 0 0 / 0.01)",
      rounded: "1.5rem",
    },
  },
};

interface SerenityContextType {
  level: SerenityLevel;
  settings: SerenitySettings;
  setLevel: (level: SerenityLevel) => void;
  nextLevel: () => void;
  previousLevel: () => void;
}

const SerenityContext = createContext<SerenityContextType | undefined>(undefined);

export function SerenityProvider({ children }: { children: React.ReactNode }) {
  const [level, setLevel] = useState<SerenityLevel>(() => {
    const stored = localStorage.getItem("serenityLevel");
    return stored ? (parseInt(stored) as SerenityLevel) : 2;
  });

  const settings = serenityConfigs[level];

  useEffect(() => {
    localStorage.setItem("serenityLevel", level.toString());
    
    // Apply CSS custom properties to the root element
    const root = document.documentElement;
    root.style.setProperty("--serenity-primary", settings.colors.primary);
    root.style.setProperty("--serenity-background", settings.colors.background);
    root.style.setProperty("--serenity-card", settings.colors.card);
    root.style.setProperty("--serenity-text", settings.colors.text);
    root.style.setProperty("--serenity-accent", settings.colors.accent);
    root.style.setProperty("--serenity-animation-duration", settings.animations.duration);
    root.style.setProperty("--serenity-animation-easing", settings.animations.easing);
    root.style.setProperty("--serenity-padding", settings.spacing.padding);
    root.style.setProperty("--serenity-margin", settings.spacing.margin);
    root.style.setProperty("--serenity-blur", settings.effects.blur);
    root.style.setProperty("--serenity-shadow", settings.effects.shadow);
    root.style.setProperty("--serenity-rounded", settings.effects.rounded);
  }, [level, settings]);

  const nextLevel = () => {
    setLevel((prev) => Math.min(5, prev + 1) as SerenityLevel);
  };

  const previousLevel = () => {
    setLevel((prev) => Math.max(0, prev - 1) as SerenityLevel);
  };

  return (
    <SerenityContext.Provider
      value={{
        level,
        settings,
        setLevel,
        nextLevel,
        previousLevel,
      }}
    >
      {children}
    </SerenityContext.Provider>
  );
}

export function useSerenity() {
  const context = useContext(SerenityContext);
  if (!context) {
    throw new Error("useSerenity must be used within a SerenityProvider");
  }
  return context;
}