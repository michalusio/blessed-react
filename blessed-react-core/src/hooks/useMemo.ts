import { BlessedNode } from '../jsx';
import { useEffect } from './useEffect';
import { useRef } from './useRef';

export function useMemo<T extends unknown[], N extends BlessedNode>(call: (...args: T) => N, deps: T): N {
  const node = useRef<N>();
  useEffect(() => {
    node.current = call(...deps);
  }, deps);
  return node.current!;
}