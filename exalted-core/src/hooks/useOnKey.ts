import { Widgets } from "reblessed";
import { screenObject } from "../start";
import { useEffect } from "./useEffect";

export function useOnKey(key: string, listener: (ch: any, key: Widgets.Events.IKeyEventArg) => void): void {
  useEffect(() => {
    screenObject?.key(key, listener);
    return () => screenObject?.unkey(key, listener);
  }, [key, listener]);
}