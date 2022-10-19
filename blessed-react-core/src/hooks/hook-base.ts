import { Brand } from "../utils";

export const hookMap = new Map<HookId, HookData>();
export const hookState: { value: number; rope: string[] } = { value: 0, rope: [] };

type HookId = Brand<string, "hookId">;

export function hookId(): HookId {
  return `${hookState.value}-${hookState.rope.join('-')}` as HookId;
}

export type HookData = UseRefData | UseEffectData | UseStateData;

export type UseRefData = { type: 'useRef', ref: { current: any } };

export type UseEffectCall = () => ((() => void) | void);
export type UseEffectData = { type: 'useEffect', call: UseEffectCall, lastCleanup: (() => void) | void, lastDeps: unknown[] };

export type UseStateCall<T> = (newValue: T | ((currentValue: T) => T)) => void;
export type UseStateData = { type: 'useState', ref: { value: any } };