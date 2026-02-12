import { useCallback, useEffect, useState } from "react";

export const useOtpTrigger = (storageKey: string, duration: number) => {
  const startTimer = useCallback(() => {
    localStorage.setItem(storageKey, Date.now().toString());
    localStorage.setItem(`${storageKey}_dur`, duration.toString());
    window.dispatchEvent(new Event("storage"));
  }, [storageKey, duration]);

  const clearTimer = useCallback(() => {
    localStorage.removeItem(storageKey);
    localStorage.removeItem(`${storageKey}_dur`);
    window.dispatchEvent(new Event("storage"));
  }, [storageKey]);

  return { startTimer, clearTimer };
};

export const useOtpTicker = (storageKey: string) => {
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    const calculate = () => {
      const start = localStorage.getItem(storageKey);
      const dur = localStorage.getItem(`${storageKey}_dur`);
      if (!start || !dur) {
        setTimeLeft(0);
        return;
      }
      const elapsed = Math.floor((Date.now() - parseInt(start)) / 1000);
      const remaining = Math.max(0, parseInt(dur) - elapsed);
      setTimeLeft(remaining);
      if (remaining === 0) {
        localStorage.removeItem(storageKey);
        localStorage.removeItem(`${storageKey}_dur`);
      }
    };

    calculate();
    const interval = setInterval(calculate, 1000);
    return () => clearInterval(interval);
  }, [storageKey]);

  return {
    timeLeft,
    formattedTime: `${Math.floor(timeLeft / 60)}:${(timeLeft % 60).toString().padStart(2, "0")}`,
    canResend: timeLeft === 0,
  };
};
