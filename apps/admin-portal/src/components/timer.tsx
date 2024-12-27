import { useCallback, useEffect, useRef } from 'react';

interface ITimerProps {
  disabled?: boolean;
  countDownValue?: number;
  onTick?: (value: number) => void;
  onComplete?: () => void;
}

const Timer: React.FC<ITimerProps> = ({ disabled = false, countDownValue, onTick, onComplete }) => {
  const timeHandle = useRef<NodeJS.Timeout>();
  const timeRef = useRef(countDownValue || 0);
  const isPaused = useRef(true);

  const pause = useCallback(() => {
    if (!isPaused.current) {
      clearInterval(timeHandle.current);
      isPaused.current = true;
    }
  }, []);

  const update = useCallback(() => {
    if (timeRef.current === 0) {
      onComplete?.();
      pause();
    }
    if (timeRef.current > 0) onTick?.(--timeRef.current);
  }, [onComplete, onTick, pause]);

  const start = useCallback(() => {
    if (isPaused.current) {
      isPaused.current = false;
      timeHandle.current = setInterval(update, 1000);
    }
  }, [update]);

  const reset = useCallback(() => {
    clearInterval(timeHandle.current);
    isPaused.current = true;
    timeRef.current = countDownValue || 0;
  }, [countDownValue]);

  useEffect(() => {
    reset();
    start();
    if (disabled) {
      pause();
    }
  }, [disabled, countDownValue, reset, start, pause]);

  return null;
};

export default Timer;
