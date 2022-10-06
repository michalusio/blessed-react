import { widget, Widgets } from 'reblessed';

export type Brand<T, V> = T & { __type: V };

export type ItemOrArray<T> = T | T[];

type Constructor<T> = (...args: unknown[]) => T;

const Element = (widget as any).Element as Constructor<Widgets.BlessedElement>;

/** @internal */
export function isElement(obj: any): obj is Widgets.BlessedElement {
  return obj instanceof Element;
}

/** @internal */
export function flatten<T>(items: ItemOrArray<T>[]): T[] {
  return items.flatMap(i => Array.isArray(i) ? i : [i]);
}