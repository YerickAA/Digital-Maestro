import { motion, AnimatePresence } from "framer-motion";
import { Plus, X } from "lucide-react";
import { useState } from "react";

interface FloatingActionButtonProps {
  onAction: (action: string) => void;
  actions: {
    id: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
  }[];
}

export default function FloatingActionButton({ onAction, actions }: FloatingActionButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-24 right-4 z-40">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute bottom-16 right-0 flex flex-col space-y-3"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
          >
            {actions.map((action, index) => {
              const Icon = action.icon;
              return (
                <motion.button
                  key={action.id}
                  className={`w-12 h-12 ${action.color} rounded-full shadow-lg flex items-center justify-center text-white`}
                  onClick={() => {
                    onAction(action.id);
                    setIsOpen(false);
                  }}
                  initial={{ opacity: 0, y: 20, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 20, scale: 0.8 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Icon className="w-5 h-5" />
                </motion.button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
      
      <motion.button
        className="w-14 h-14 bg-ios-blue rounded-full shadow-lg flex items-center justify-center"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={{ rotate: isOpen ? 45 : 0 }}
        transition={{ duration: 0.2 }}
      >
        <motion.div
          initial={false}
          animate={{ opacity: isOpen ? 0 : 1 }}
          transition={{ duration: 0.1 }}
        >
          <Plus className="w-6 h-6 text-white" />
        </motion.div>
        <motion.div
          className="absolute"
          initial={false}
          animate={{ opacity: isOpen ? 1 : 0 }}
          transition={{ duration: 0.1 }}
        >
          <X className="w-6 h-6 text-white" />
        </motion.div>
      </motion.button>
    </div>
  );
}