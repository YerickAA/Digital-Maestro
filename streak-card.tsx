import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";
import { motion } from "framer-motion";

interface StreakCardProps {
  currentStreak: number;
  streakHistory: string[];
}

export default function StreakCard({ currentStreak, streakHistory }: StreakCardProps) {
  // Show last 7 days for visualization
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return date.toISOString().split('T')[0];
  });

  return (
    <motion.div 
      className="px-4 py-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        whileHover={{ scale: 1.02, y: -2 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <Card className="p-4 border border-ios-gray-2 dark:border-gray-700">
          <div className="flex items-center justify-between mb-3">
            <motion.h3 
              className="text-lg font-semibold text-ios-dark dark:text-white"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              Declutter Streak
            </motion.h3>
            <motion.div 
              className="text-right"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <motion.div 
                className="text-2xl font-bold text-ios-orange"
                key={currentStreak}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 300, 
                  damping: 20, 
                  delay: 0.3 
                }}
              >
                {currentStreak}
              </motion.div>
              <motion.div 
                className="text-xs text-ios-gray-3 dark:text-gray-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                days
              </motion.div>
            </motion.div>
          </div>
          
          <motion.div 
            className="flex justify-between mb-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex space-x-2">
              {last7Days.map((date, index) => {
                const isActive = streakHistory.includes(date);
                const isToday = date === new Date().toISOString().split('T')[0];
                
                return (
                  <motion.div
                    key={index}
                    className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      isActive
                        ? "bg-ios-green"
                        : isToday
                        ? "bg-ios-orange"
                        : "bg-ios-gray-2 dark:bg-gray-700"
                    }`}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ 
                      delay: 0.6 + index * 0.1,
                      type: "spring",
                      stiffness: 300
                    }}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {isActive && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.8 + index * 0.1 }}
                      >
                        <Check className="w-3 h-3 text-white" />
                      </motion.div>
                    )}
                    {isToday && !isActive && (
                      <motion.div
                        className="w-2 h-2 bg-white rounded-full"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ 
                          duration: 2, 
                          repeat: Infinity,
                          repeatType: "reverse"
                        }}
                      />
                    )}
                  </motion.div>
              );
            })}
            </div>
          </motion.div>
          
          <motion.p 
            className="text-sm text-ios-gray-3 dark:text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3 }}
          >
            Keep it up! You're building a great habit.
          </motion.p>
        </Card>
      </motion.div>
    </motion.div>
  );
}
