import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { capacitorFeatures } from "@/lib/capacitor-features";

// Prevent pull-to-refresh behavior
let touchStartY = 0;
let touchStartX = 0;

document.addEventListener('touchstart', function(e) {
  touchStartY = e.touches[0].clientY;
  touchStartX = e.touches[0].clientX;
}, { passive: true });

document.addEventListener('touchmove', function(e) {
  const touchY = e.touches[0].clientY;
  const touchX = e.touches[0].clientX;
  const deltaY = touchY - touchStartY;
  const deltaX = touchX - touchStartX;
  
  // Prevent pull-to-refresh when scrolling up from the top
  if (window.scrollY === 0 && deltaY > 0) {
    e.preventDefault();
  }
  
  // Prevent horizontal swipe navigation
  if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
    e.preventDefault();
  }
}, { passive: false });

// Initialize native app features
capacitorFeatures.initialize().then(() => {
  console.log('Native features initialized');
}).catch(error => {
  console.error('Native features initialization failed:', error);
});

createRoot(document.getElementById("root")!).render(<App />);
