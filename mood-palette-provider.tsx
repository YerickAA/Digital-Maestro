import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type MoodType = 'calm' | 'energetic' | 'focused' | 'stressed' | 'happy' | 'overwhelmed';

interface MoodPalette {
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  card: string;
  text: string;
  border: string;
  gradient: string;
  shadow: string;
}

interface MoodContextType {
  currentMood: MoodType;
  palette: MoodPalette;
  setMood: (mood: MoodType) => void;
  detectMoodFromData: (digitalData: any) => void;
  isTransitioning: boolean;
}

const moodPalettes: Record<MoodType, MoodPalette> = {
  calm: {
    name: 'Calm',
    primary: 'hsl(200, 70%, 60%)',
    secondary: 'hsl(180, 50%, 70%)',
    accent: 'hsl(220, 60%, 65%)',
    background: 'hsl(210, 30%, 98%)',
    card: 'hsl(210, 40%, 97%)',
    text: 'hsl(210, 20%, 25%)',
    border: 'hsl(210, 30%, 88%)',
    gradient: 'linear-gradient(135deg, hsl(200, 70%, 60%), hsl(180, 50%, 70%))',
    shadow: 'hsl(210, 30%, 85%)'
  },
  energetic: {
    name: 'Energetic',
    primary: 'hsl(340, 80%, 60%)',
    secondary: 'hsl(20, 90%, 65%)',
    accent: 'hsl(300, 70%, 65%)',
    background: 'hsl(350, 20%, 98%)',
    card: 'hsl(350, 30%, 97%)',
    text: 'hsl(350, 30%, 25%)',
    border: 'hsl(350, 20%, 88%)',
    gradient: 'linear-gradient(135deg, hsl(340, 80%, 60%), hsl(20, 90%, 65%))',
    shadow: 'hsl(350, 20%, 85%)'
  },
  focused: {
    name: 'Focused',
    primary: 'hsl(120, 50%, 50%)',
    secondary: 'hsl(140, 60%, 55%)',
    accent: 'hsl(100, 50%, 55%)',
    background: 'hsl(120, 10%, 98%)',
    card: 'hsl(120, 15%, 97%)',
    text: 'hsl(120, 20%, 25%)',
    border: 'hsl(120, 10%, 88%)',
    gradient: 'linear-gradient(135deg, hsl(120, 50%, 50%), hsl(140, 60%, 55%))',
    shadow: 'hsl(120, 10%, 85%)'
  },
  stressed: {
    name: 'Stressed',
    primary: 'hsl(0, 60%, 55%)',
    secondary: 'hsl(15, 70%, 60%)',
    accent: 'hsl(30, 80%, 60%)',
    background: 'hsl(0, 10%, 98%)',
    card: 'hsl(0, 15%, 97%)',
    text: 'hsl(0, 20%, 25%)',
    border: 'hsl(0, 10%, 88%)',
    gradient: 'linear-gradient(135deg, hsl(0, 60%, 55%), hsl(15, 70%, 60%))',
    shadow: 'hsl(0, 10%, 85%)'
  },
  happy: {
    name: 'Happy',
    primary: 'hsl(50, 90%, 60%)',
    secondary: 'hsl(40, 80%, 65%)',
    accent: 'hsl(60, 70%, 65%)',
    background: 'hsl(50, 30%, 98%)',
    card: 'hsl(50, 40%, 97%)',
    text: 'hsl(50, 30%, 25%)',
    border: 'hsl(50, 30%, 88%)',
    gradient: 'linear-gradient(135deg, hsl(50, 90%, 60%), hsl(40, 80%, 65%))',
    shadow: 'hsl(50, 30%, 85%)'
  },
  overwhelmed: {
    name: 'Overwhelmed',
    primary: 'hsl(280, 40%, 50%)',
    secondary: 'hsl(260, 50%, 55%)',
    accent: 'hsl(300, 45%, 55%)',
    background: 'hsl(280, 5%, 98%)',
    card: 'hsl(280, 10%, 97%)',
    text: 'hsl(280, 15%, 25%)',
    border: 'hsl(280, 5%, 88%)',
    gradient: 'linear-gradient(135deg, hsl(280, 40%, 50%), hsl(260, 50%, 55%))',
    shadow: 'hsl(280, 5%, 85%)'
  }
};

const MoodContext = createContext<MoodContextType | undefined>(undefined);

export function MoodPaletteProvider({ children }: { children: ReactNode }) {
  const [currentMood, setCurrentMood] = useState<MoodType>('calm');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [palette, setPalette] = useState<MoodPalette>(moodPalettes.calm);

  // Detect mood from digital data patterns
  const detectMoodFromData = (digitalData: any) => {
    if (!digitalData) return;

    const {
      healthScore,
      photosCount,
      filesCount,
      appsCount,
      emailCount,
      photosDuplicates,
      filesLarge,
      appsUnused,
      emailUnread
    } = digitalData;

    // Calculate stress indicators
    const duplicateRatio = photosCount > 0 ? photosDuplicates / photosCount : 0;
    const largeFileRatio = filesCount > 0 ? filesLarge / filesCount : 0;
    const unusedAppRatio = appsCount > 0 ? appsUnused / appsCount : 0;
    const unreadEmailRatio = emailCount > 0 ? emailUnread / emailCount : 0;

    const overallClutterScore = (duplicateRatio + largeFileRatio + unusedAppRatio + unreadEmailRatio) / 4;

    let newMood: MoodType;

    if (healthScore >= 85) {
      newMood = 'happy';
    } else if (healthScore >= 70) {
      newMood = 'focused';
    } else if (healthScore >= 50) {
      newMood = 'calm';
    } else if (overallClutterScore > 0.7) {
      newMood = 'overwhelmed';
    } else if (overallClutterScore > 0.4) {
      newMood = 'stressed';
    } else {
      newMood = 'energetic';
    }

    if (newMood !== currentMood) {
      setMood(newMood);
    }
  };

  const setMood = (mood: MoodType) => {
    setIsTransitioning(true);
    setCurrentMood(mood);
    
    // Smooth transition to new palette
    setTimeout(() => {
      setPalette(moodPalettes[mood]);
      updateCSSVariables(moodPalettes[mood]);
      setIsTransitioning(false);
    }, 150);
  };

  const updateCSSVariables = (newPalette: MoodPalette) => {
    const root = document.documentElement;
    root.style.setProperty('--mood-primary', newPalette.primary);
    root.style.setProperty('--mood-secondary', newPalette.secondary);
    root.style.setProperty('--mood-accent', newPalette.accent);
    root.style.setProperty('--mood-background', newPalette.background);
    root.style.setProperty('--mood-card', newPalette.card);
    root.style.setProperty('--mood-text', newPalette.text);
    root.style.setProperty('--mood-border', newPalette.border);
    root.style.setProperty('--mood-gradient', newPalette.gradient);
    root.style.setProperty('--mood-shadow', newPalette.shadow);
  };

  useEffect(() => {
    // Initialize CSS variables
    updateCSSVariables(palette);
  }, [palette]);

  return (
    <MoodContext.Provider value={{
      currentMood,
      palette,
      setMood,
      detectMoodFromData,
      isTransitioning
    }}>
      <motion.div
        className="min-h-screen transition-all duration-500"
        style={{
          background: palette.background,
          color: palette.text
        }}
        animate={{
          backgroundColor: palette.background,
          color: palette.text
        }}
        transition={{ duration: 0.5 }}
      >
        <AnimatePresence>
          {isTransitioning && (
            <motion.div
              className="fixed inset-0 z-50 pointer-events-none"
              style={{
                background: `radial-gradient(circle at center, ${palette.primary}20, transparent 70%)`
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            />
          )}
        </AnimatePresence>
        {children}
      </motion.div>
    </MoodContext.Provider>
  );
}

export function useMoodPalette() {
  const context = useContext(MoodContext);
  if (!context) {
    throw new Error('useMoodPalette must be used within a MoodPaletteProvider');
  }
  return context;
}

// Mood indicator component
export function MoodIndicator() {
  const { currentMood, palette, setMood } = useMoodPalette();

  return (
    <motion.div
      className="fixed top-4 right-4 z-40"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <div
        className="w-3 h-3 rounded-full border-2 border-white/50 shadow-lg"
        style={{
          backgroundColor: palette.primary,
          boxShadow: `0 0 10px ${palette.primary}40`
        }}
        title={`Current mood: ${palette.name}`}
      />
    </motion.div>
  );
}