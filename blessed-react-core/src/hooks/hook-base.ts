import { Brand } from "../utils";

/** @internal */
export const hookMap = new Map<HookId, HookData>();
/** @internal */
export const hookState: { value: number; rope: string[] } = { value: 0, rope: [] };

type HookId = Brand<string, "hookId">;

/** @internal */
export function hookId(): HookId {
  return `${hookState.value}-${hookState.rope.join('-')}` as HookId;
}

/** @internal */
export type HookData = UseRefData | UseEffectData | UseStateData;

/** @internal */
export type UseRefData = { type: 'useRef', ref: { current: any } };

export type UseEffectCall = () => ((() => void) | void);
/** @internal */
export type UseEffectData = { type: 'useEffect', call: UseEffectCall, lastCleanup: (() => void) | void, lastDeps: unknown[] };

export type UseStateCall<T> = (newValue: T | ((currentValue: T) => T)) => void;
/** @internal */
export type UseStateData = { type: 'useState', ref: { value: any } };