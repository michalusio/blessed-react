import { useEffect } from './useEffect';
import { useRef } from './useRef';

export function useCallback<T extends unknown[]>(call: (...args: unknown[]) => unknown, deps: T): typeof call {
  const callback = useRef<typeof call>();
  useEffect(() => {
    callback.current = call;
  }, deps);
  return callback.current!;
}