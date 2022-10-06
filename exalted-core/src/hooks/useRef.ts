import { hookState, hookMap, UseRefData, hookId } from './hook-base';

export function useRef<T>(): { current?: T };
export function useRef<T>(initialValue: T): { readonly current: T };
export function useRef<T>(initialValue?: T): { current?: T } {
  const last = hookMap.get(hookId());
  if (last && last.type === 'useRef') {
    hookState.value++;
    return last.ref;
  }
  const ref: UseRefData = { type: 'useRef', ref: { current: initialValue } };
  hookMap.set(hookId(), ref);
  hookState.value++;
  return ref.ref;
}