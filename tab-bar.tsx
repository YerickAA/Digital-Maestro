import { useLocation } from "wouter";
import { Home, Layers, TrendingUp, Settings } from "lucide-react";
import { useHapticFeedback } from "@/hooks/use-haptic-feedback";
import { useSoundEffects } from "@/hooks/use-sound-effects";
import { useIsMobile } from "@/hooks/use-mobile";
import { motion, AnimatePresence } from "framer-motion";

const tabs = [
  { id: "dashboard", label: "Dashboard", icon: Home, path: "/" },
  { id: "organize", label: "Organize", icon: Layers, path: "/organize" },
  { id: "insights", label: "Insights", icon: TrendingUp, path: "/insights" },
  { id: "settings", label: "Settings", icon: Settings, path: "/settings" },
];

export default function TabBar() {
  const [location, navigate] = useLocation();
  const haptic = useHapticFeedback();
  const sound = useSoundEffects();
  const isMobile = useIsMobile();

  const handleTabClick = (path: string) => {
    try {
      haptic.selection();
      navigate(path);
    } catch (error) {
      console.error('Error in tab navigation:', error);
      // Fallback navigation
      window.location.href = path;
    }
  };

  return (
    <motion.div 
      className="fixed bottom-0 left-0 right-0 z-50 tab-bar"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <motion.div 
        className={`
          bg-white/90 dark:bg-gray-900/90 backdrop-blur-md 
          border-t border-ios-gray-2 dark:border-gray-700 
          ${isMobile ? 'mx-0' : 'mx-auto max-w-2xl rounded-t-2xl'}
          transition-all duration-300
        `}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <div className={`
          flex justify-around items-center
          ${isMobile ? 'py-2 px-4' : 'py-3 px-8'}
          portrait:py-2 landscape:py-1.5
        `}>
          {tabs.map((tab, index) => {
            const Icon = tab.icon;
            const isActive = location === tab.path;
            
            return (
              <motion.button
                key={tab.id}
                onClick={() => handleTabClick(tab.path)}
                className={`
                  flex flex-col items-center relative
                  ${isMobile ? 'py-2 px-3' : 'py-3 px-4'}
                  portrait:py-2 landscape:py-1 landscape:px-2
                  ${isActive 
                    ? "text-ios-blue dark:text-blue-400" 
                    : "text-ios-gray-3 dark:text-gray-400 hover:text-ios-dark dark:hover:text-white"
                  }
                `}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-ios-blue dark:bg-blue-400 rounded-full"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                </AnimatePresence>
                
                <motion.div
                  animate={{ 
                    y: isActive ? -2 : 0,
                  }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 300, 
                    damping: 30 
                  }}
                >
                  <Icon className={`
                    ${isMobile ? 'w-6 h-6' : 'w-7 h-7'}
                    portrait:w-6 portrait:h-6 landscape:w-5 landscape:h-5
                    mb-1 portrait:mb-1 landscape:mb-0.5
                    transition-all duration-200
                  `} />
                </motion.div>
                
                <motion.span 
                  className={`
                    ${isMobile ? 'text-xs' : 'text-sm'}
                    portrait:text-xs landscape:text-xs
                    font-medium transition-all duration-200
                  `}
                  animate={{ 
                    scale: isActive ? 1.05 : 1,
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  {tab.label}
                </motion.span>
              </motion.button>
            );
          })}
        </div>
        
        {/* Home indicator for iOS-style bottom bar */}
        <div className="flex justify-center pb-2">
          <motion.div 
            className="w-32 h-1 bg-ios-gray-3 dark:bg-gray-600 rounded-full opacity-30"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.3 }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}