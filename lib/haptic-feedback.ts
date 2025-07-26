// Enhanced haptic feedback patterns for better mobile experience
export const HapticFeedback = {
  // Success patterns
  success: () => {
    if (navigator.vibrate) {
      navigator.vibrate([100, 50, 100, 50, 200]);
    }
  },

  // Error patterns
  error: () => {
    if (navigator.vibrate) {
      navigator.vibrate([200, 100, 200, 100, 200]);
    }
  },

  // Light tap feedback
  light: () => {
    if (navigator.vibrate) {
      navigator.vibrate(30);
    }
  },

  // Medium tap feedback
  medium: () => {
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
  },

  // Heavy tap feedback
  heavy: () => {
    if (navigator.vibrate) {
      navigator.vibrate(100);
    }
  },

  // Selection feedback
  select: () => {
    if (navigator.vibrate) {
      navigator.vibrate(40);
    }
  },

  // Long press feedback
  longPress: () => {
    if (navigator.vibrate) {
      navigator.vibrate([50, 30, 50]);
    }
  },

  // Notification feedback
  notification: () => {
    if (navigator.vibrate) {
      navigator.vibrate([100, 50, 100]);
    }
  },

  // Progress feedback
  progress: () => {
    if (navigator.vibrate) {
      navigator.vibrate(25);
    }
  },

  // Impact feedback for important actions
  impact: () => {
    if (navigator.vibrate) {
      navigator.vibrate([150, 50, 150]);
    }
  },

  // Subtle feedback for UI transitions
  subtle: () => {
    if (navigator.vibrate) {
      navigator.vibrate(20);
    }
  },

  // Check if vibration is supported
  isSupported: () => {
    return 'vibrate' in navigator && navigator.vibrate;
  }
};