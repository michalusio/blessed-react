import { forceRerender } from '../start';
import { hookId, hookMap, UseStateCall, UseStateData } from './hook-base';

export function useState<T>(initialValue: T): [T, UseStateCall<T>] {
  const last = hookMap.get(hookId.value);
  if (last && last.type === 'useState') {
    hookId.value++;
    return [
      last.ref.value,
      getStateSetter(last.ref)
    ];
  }
  const ref: UseStateData = { type: 'useState', ref: { value: initialValue } };
  hookMap.set(hookId.value, ref);
  hookId.value++;
  return [
    ref.ref.value,
    getStateSetter(ref.ref)
  ];
}

function getStateSetter<T>(ref: UseStateData['ref']): UseStateCall<T> {
  return (data) => {
    if (typeof data === 'function') {
      ref.value = (data as Function)(ref.value);
    } else {
      ref.value = data;
    }
    forceRerender();
  }
}