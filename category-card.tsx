import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { LucideIcon } from "lucide-react";
import { useLongPress } from "@/hooks/use-long-press";
import { motion } from "framer-motion";

interface CategoryCardProps {
  title: string;
  icon: LucideIcon;
  iconColor: string;
  iconBgColor: string;
  count: string;
  alertCount: number;
  alertLabel: string;
  alertColor: string;
  storage: string;
  storagePercent: number;
  progressColor: string;
  onClick: () => void;
  onLongPress?: () => void;
}

export default function CategoryCard({
  title,
  icon: Icon,
  iconColor,
  iconBgColor,
  count,
  alertCount,
  alertLabel,
  alertColor,
  storage,
  storagePercent,
  progressColor,
  onClick,
  onLongPress,
}: CategoryCardProps) {
  const longPressProps = useLongPress({
    onLongPress: onLongPress || (() => {}),
    onClick: onClick,
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      className="mb-2 sm:mb-4"
    >
      <Card
        className="p-3 sm:p-4 border border-ios-gray-2 dark:border-gray-700 select-none transition-all duration-300 hover:shadow-lg hover:border-ios-blue/30 dark:hover:border-blue-400/30 category-card w-full relative"
      >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <motion.div 
                className={`w-12 h-12 ${iconBgColor} rounded-xl flex items-center justify-center`}
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Icon className={`${iconColor} w-6 h-6 transition-transform duration-200`} />
              </motion.div>
              <div>
                <motion.h4 
                  className="font-semibold text-ios-dark dark:text-white"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  {title}
                </motion.h4>
                <motion.p 
                  className="text-sm text-ios-gray-3 dark:text-gray-400"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {count}
                </motion.p>
              </div>
            </div>
            <motion.button
              className="text-right p-2 rounded-lg hover:bg-ios-gray-2 dark:hover:bg-gray-700 transition-colors duration-200 cursor-pointer"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              {...longPressProps}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div 
                className={`text-lg font-semibold ${alertColor}`}
                key={alertCount}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                {alertCount}
              </motion.div>
              <div className="text-xs text-ios-gray-3 dark:text-gray-400">{alertLabel}</div>
            </motion.button>
          </div>
          
          <motion.div 
            className="mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex justify-between text-sm mb-1">
              <span className="text-ios-gray-3 dark:text-gray-400">Storage used</span>
              <motion.span 
                className="text-ios-dark dark:text-white font-medium"
                key={storage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {storage}
              </motion.span>
            </div>
            <div className="w-full bg-ios-gray-2 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
              <motion.div
                className={`${progressColor} h-2 rounded-full`}
                initial={{ width: 0 }}
                animate={{ width: `${storagePercent}%` }}
                transition={{ 
                  duration: 1.2, 
                  ease: "easeInOut",
                  delay: 0.5 
                }}
              />
            </div>
          </motion.div>
        </Card>
      </motion.div>
  );
}
