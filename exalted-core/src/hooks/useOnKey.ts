import { screenObject } from "../start";
import { useEffect } from "./useEffect";

export interface IKeyEventArg {
  full: string;
  name: string;
  shift: boolean;
  ctrl: boolean;
  meta: boolean;
  sequence: string;
}

export function useOnKey(key: string, listener: (ch: any, key: IKeyEventArg) => void): void {
  useEffect(() => {
    screenObject?.key(key, listener);
    return () => screenObject?.unkey(key, listener);
  }, [key, listener]);
}