import { useCallback, useRef, useEffect } from 'react';

interface UseLongPressOptions {
  onLongPress: () => void;
  onClick?: () => void;
  threshold?: number;
  shouldPreventDefault?: boolean;
}

export function useLongPress({
  onLongPress,
  onClick,
  threshold = 500,
  shouldPreventDefault = true
}: UseLongPressOptions) {
  const isLongPress = useRef(false);
  const timeout = useRef<NodeJS.Timeout>();
  const target = useRef<EventTarget>();

  const start = useCallback((event: React.TouchEvent | React.MouseEvent) => {
    if (shouldPreventDefault) {
      event.preventDefault();
    }
    
    // Clear existing timeout to prevent multiple triggers
    if (timeout.current) {
      clearTimeout(timeout.current);
    }
    
    target.current = event.target;
    timeout.current = setTimeout(() => {
      isLongPress.current = true;
      try {
        onLongPress();
      } catch (error) {
        console.error('Error in onLongPress handler:', error);
      }
    }, threshold);
  }, [onLongPress, shouldPreventDefault, threshold]);

  const clear = useCallback((event: React.TouchEvent | React.MouseEvent, shouldTriggerClick: boolean = true) => {
    if (timeout.current) {
      clearTimeout(timeout.current);
      timeout.current = undefined;
    }
    
    if (shouldTriggerClick && !isLongPress.current && onClick) {
      try {
        onClick();
      } catch (error) {
        console.error('Error in onClick handler:', error);
      }
    }
    
    isLongPress.current = false;
    target.current = undefined;
  }, [onClick]);

  const clickHandler = useCallback((event: React.MouseEvent) => {
    clear(event);
  }, [clear]);

  const touchStartHandler = useCallback((event: React.TouchEvent) => {
    start(event);
  }, [start]);

  const touchEndHandler = useCallback((event: React.TouchEvent) => {
    clear(event);
  }, [clear]);

  const mouseDownHandler = useCallback((event: React.MouseEvent) => {
    start(event);
  }, [start]);

  const mouseUpHandler = useCallback((event: React.MouseEvent) => {
    clear(event);
  }, [clear]);

  const mouseLeaveHandler = useCallback((event: React.MouseEvent) => {
    clear(event, false);
  }, [clear]);

  useEffect(() => {
    return () => {
      timeout.current && clearTimeout(timeout.current);
    };
  }, []);

  return {
    onTouchStart: touchStartHandler,
    onTouchEnd: touchEndHandler,
    onMouseDown: mouseDownHandler,
    onMouseUp: mouseUpHandler,
    onMouseLeave: mouseLeaveHandler,
    onClick: clickHandler
  };
}