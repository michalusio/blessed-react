import { screenObject } from "../start";
import { useEffect } from "./useEffect";

export function useOnResize(listener: () => void): void {
  useEffect(() => {
    screenObject?.on('resize', listener);
    return () => screenObject?.removeListener('resize', listener);
  }, [listener]);
}