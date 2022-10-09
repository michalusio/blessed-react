import Reblessed, {blessedElement} from './blessing';

export type Brand<T, V> = T & { __type: V };

export type ItemOrArray<T> = T | T[];

export type Constructor<T> = (...args: unknown[]) => T;

const Element = (Reblessed.widget as any).Element as Constructor<blessedElement>;

/** @internal */
export function isElement(obj: any): obj is blessedElement {
  return obj instanceof Element;
}

/** @internal */
export function flatten<T>(items: ItemOrArray<T>[]): T[] {
  return items.flatMap(i => Array.isArray(i) ? i : [i]);
}