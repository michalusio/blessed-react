import Reblessed, {blessedElement} from './blessing';
import type { blessedElementsTypes } from './jsx';

export type Brand<T, V> = T & { __type: V };

export type ItemOrArray<T> = T | T[];

export type Constructor<T> = (...args: unknown[]) => T;

const Element = (Reblessed.widget as any).Element as Constructor<blessedElement>;

export type AnyElement = blessedElementsTypes[keyof blessedElementsTypes];

/** @internal */
export function isElement(obj: any): obj is blessedElement {
  return obj instanceof Element;
}

/** @internal */
export function flatten<T>(items: ItemOrArray<T>[]): T[] {
  return items.flatMap(i => Array.isArray(i) ? i : [i]);
}

/** @internal */
export function modeArray<T>(array: T[]): T | undefined {
  if (array.length == 0) return undefined;
  const modeMap = new Map<T, number>();
  let maxCount = 1;
  let modes: T[] = [];

  array.forEach(el => {
    if (modeMap.get(el) === undefined) modeMap.set(el, 1);
    else modeMap.set(el, modeMap.get(el)! + 1);

    if (modeMap.get(el)! > maxCount) {
      modes = [el];
      maxCount = modeMap.get(el)!;
    } else if (modeMap.get(el)! === maxCount) {
      modes.push(el);
      maxCount = modeMap.get(el)!;
    }
  });
  return modes[0];
}