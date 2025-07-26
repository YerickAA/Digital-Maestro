import { ReactNode } from "react";
import { motion } from "framer-motion";

interface MobileLayoutProps {
  children: ReactNode;
}

export default function MobileLayout({ children }: MobileLayoutProps) {
  return (
    <div className="min-h-screen min-h-[100dvh] w-full max-w-full overflow-x-hidden bg-gray-900">
      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          duration: 0.3, 
          ease: "easeOut" 
        }}
        className="pb-20 px-2 sm:px-4 pt-2 sm:pt-safe-top main-content"
        style={{ 
          paddingTop: 'env(safe-area-inset-top, 8px)',
          paddingBottom: 'env(safe-area-inset-bottom, 80px)',
          minHeight: 'calc(100dvh - 80px)',
          overscrollBehavior: 'contain'
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}