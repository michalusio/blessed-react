import { IKeyEventArg } from "../blessing";
import { screenObject } from "../start";
import { useEffect } from "./useEffect";

export function useOnKey(key: string, listener: (ch: any, key: IKeyEventArg) => void): void {
  useEffect(() => {
    screenObject?.key(key, listener);
    return () => screenObject?.unkey(key, listener);
  }, [key, listener]);
}