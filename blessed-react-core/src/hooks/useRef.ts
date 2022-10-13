import { hookState, hookMap, UseRefData, hookId } from './hook-base';

export type MutableRef<T> = { current?: T };
export type ImmutableRef<T> = { readonly current: T };

export function useRef<T>(): MutableRef<T>;
export function useRef<T>(initialValue: T): ImmutableRef<T>;
export function useRef<T>(initialValue?: T): MutableRef<T> {
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