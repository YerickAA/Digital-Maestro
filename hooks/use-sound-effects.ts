import { useCallback } from 'react';

export interface SoundEffects {
  playDelete: () => void;
  playBulkDelete: () => void;
  playSuccess: () => void;
  playClick: () => void;
  playSwipe: () => void;
  playError: () => void;
}

export function useSoundEffects(): SoundEffects {
  const createOscillator = useCallback((frequency: number, duration: number, type: OscillatorType = 'sine') => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = frequency;
      oscillator.type = type;
      
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration);
    } catch (error) {
      // Fallback for browsers without audio context
      // Audio not supported in this browser
    }
  }, []);

  const playDelete = useCallback(() => {
    // Gentle "whoosh" sound for single delete
    createOscillator(800, 0.1, 'sine');
    setTimeout(() => createOscillator(400, 0.1, 'sine'), 50);
  }, [createOscillator]);

  const playBulkDelete = useCallback(() => {
    // Satisfying cascading sound for bulk delete
    const frequencies = [1000, 800, 600, 400, 300];
    frequencies.forEach((freq, index) => {
      setTimeout(() => createOscillator(freq, 0.15, 'sine'), index * 80);
    });
  }, [createOscillator]);

  const playSuccess = useCallback(() => {
    // Uplifting success sound
    createOscillator(523, 0.1, 'sine'); // C
    setTimeout(() => createOscillator(659, 0.1, 'sine'), 100); // E
    setTimeout(() => createOscillator(784, 0.2, 'sine'), 200); // G
  }, [createOscillator]);

  const playClick = useCallback(() => {
    // Subtle click sound
    createOscillator(1000, 0.05, 'square');
  }, [createOscillator]);

  const playSwipe = useCallback(() => {
    // Swipe gesture sound
    createOscillator(600, 0.1, 'sine');
    setTimeout(() => createOscillator(400, 0.1, 'sine'), 50);
  }, [createOscillator]);

  const playError = useCallback(() => {
    // Error sound
    createOscillator(200, 0.2, 'sawtooth');
  }, [createOscillator]);

  return {
    playDelete,
    playBulkDelete,
    playSuccess,
    playClick,
    playSwipe,
    playError,
  };
}