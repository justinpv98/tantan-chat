import { useCallback, useRef } from "react";

export default function useThrottle() {
  const shouldWait = useRef<boolean>(false);

  return useCallback((cb: Function, delay = 1000, ...args: any[]) => {
    if (shouldWait.current) return;

    cb(...args);
    shouldWait.current = true;

    setTimeout(() => {
      shouldWait.current = false;
    }, delay);
  }, []);
}
