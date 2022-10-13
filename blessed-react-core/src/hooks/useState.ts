import { forceRerender } from '../start';
import { hookState, hookMap, UseStateCall, UseStateData, hookId } from './hook-base';

export function useState<T>(initialValue: T): [T, UseStateCall<T>] {
  const last = hookMap.get(hookId());
  if (last && last.type === 'useState') {
    hookState.value++;
    return [
      last.ref.value,
      getStateSetter(last.ref)
    ];
  }
  const ref: UseStateData = { type: 'useState', ref: { value: initialValue } };
  hookMap.set(hookId(), ref);
  hookState.value++;
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