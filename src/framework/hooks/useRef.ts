import { hookId, hookMap, UseRefData } from './hook-base';

export function useRef<T>(): { current?: T };
export function useRef<T>(initialValue: T): { readonly current: T };
export function useRef<T>(initialValue?: T): { current?: T } {
  const last = hookMap.get(hookId.value);
  if (last && last.type === 'useRef') {
    hookId.value++;
    return last.ref;
  }
  const ref: UseRefData = { type: 'useRef', ref: { current: initialValue } };
  hookMap.set(hookId.value, ref);
  hookId.value++;
  return ref.ref;
}