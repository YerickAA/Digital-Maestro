import { useCallback } from 'react';
import { capacitorFeatures } from '@/lib/capacitor-features';

export interface HapticFeedback {
  light: () => void;
  medium: () => void;
  heavy: () => void;
  success: () => void;
  warning: () => void;
  error: () => void;
  selection: () => void;
}

export function useHapticFeedback(): HapticFeedback {
  const triggerHaptic = useCallback(async (type: string) => {
    try {
      switch (type) {
        case 'light':
          await capacitorFeatures.hapticFeedback('light');
          break;
        case 'medium':
          await capacitorFeatures.hapticFeedback('medium');
          break;
        case 'heavy':
          await capacitorFeatures.hapticFeedback('heavy');
          break;
        case 'success':
          await capacitorFeatures.hapticFeedback('medium');
          break;
        case 'warning':
          await capacitorFeatures.hapticFeedback('medium');
          break;
        case 'error':
          await capacitorFeatures.hapticFeedback('heavy');
          break;
        case 'selection':
          await capacitorFeatures.hapticFeedback('light');
          break;
        default:
          await capacitorFeatures.hapticFeedback('light');
      }
    } catch (error) {
      console.error('Haptic feedback failed:', error);
    }
  }, []);

  return {
    light: () => triggerHaptic('light'),
    medium: () => triggerHaptic('medium'),
    heavy: () => triggerHaptic('heavy'),
    success: () => triggerHaptic('success'),
    warning: () => triggerHaptic('warning'),
    error: () => triggerHaptic('error'),
    selection: () => triggerHaptic('selection'),
  };
}