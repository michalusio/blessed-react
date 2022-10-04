export const hookMap = new Map<number, HookData>();
export const hookId = { value: 0};

export type HookData = UseRefData | UseEffectData | UseStateData;

export type UseRefData = { type: 'useRef', ref: { current: any } };

export type UseEffectCall = () => ((() => void) | void);
export type UseEffectData = { type: 'useEffect', call: UseEffectCall, lastCleanup: (() => void) | void, lastDeps: unknown[] };

export type UseStateCall<T> = (newValue: T | ((currentValue: T) => T)) => void;
export type UseStateData = { type: 'useState', ref: { value: any } };