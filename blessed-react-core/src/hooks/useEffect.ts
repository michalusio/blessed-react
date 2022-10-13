import { hookState, hookMap, UseEffectCall, UseEffectData, hookId } from './hook-base';

export function useEffect(call: UseEffectCall, deps: unknown[]): void {
  const last = hookMap.get(hookId());
  if (last && last.type === 'useEffect') {
    if (deps.length === last.lastDeps?.length && deps.every((item, index) => last.lastDeps[index] === item)) {
      hookState.value++;
      return;
    } else {
      last.lastCleanup?.();
    }
  }
  const ref: UseEffectData = {
    type: 'useEffect',
    call,
    lastCleanup: call(),
    lastDeps: deps
  };
  hookMap.set(hookId(), ref);
  hookState.value++;
}