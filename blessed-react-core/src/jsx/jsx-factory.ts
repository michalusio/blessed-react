import { blessedElement } from "../blessing";
import { applyClass } from "../css";
import { hookState, RopeEntry } from "../hooks/hook-base";
import { blessedElements, BlessedNode, ExoticComponent } from "./jsx";
import { getKey } from "../key";
import { flatten, isElement, ItemOrArray } from "../utils";
import { Consumer, ConsumerSymbol, Provider, ProviderSymbol } from "./context";
import { FragmentSymbol, Fragment } from "./fragment";
import { RenderError } from "../render-error";

type JSXElement = JSX.Tag | JSX.Component;
type JSXItem = JSXElement | Consumer<any> | Provider<any> | typeof Fragment;

type GetAttributesFor<T extends JSXItem> = T extends
  | Consumer<any>
  | typeof Fragment
  ? null | undefined
  : T extends Provider<infer V>
  ? { value: V }
  : T extends keyof JSX.IntrinsicElements
  ? JSX.IntrinsicElements[T] | null | undefined
  : T extends JSX.Component
  ? Parameters<T>[0] | null | undefined
  : never;

type GetChildrenFor<T extends JSXItem> = T extends Consumer<infer X>
  ? [(value: X) => JSX.Element]
  : ItemOrArray<BlessedNode>[];

export function jsx(
  tag: typeof Fragment,
  attributes: GetAttributesFor<typeof tag>,
  ...children: ItemOrArray<BlessedNode>[]
): BlessedNode;
export function jsx<T>(
  tag: Provider<T>,
  attributes: GetAttributesFor<typeof tag>,
  ...children: GetChildrenFor<typeof tag>
): BlessedNode;
export function jsx<T>(
  tag: Consumer<T>,
  attributes: GetAttributesFor<typeof tag>,
  children: (value: T) => JSX.Element
): BlessedNode;
export function jsx(
  tag: JSXElement,
  attributes: GetAttributesFor<typeof tag>,
  ...children: GetChildrenFor<typeof tag>
): BlessedNode;
export function jsx(
  tag: JSXItem,
  attributes: GetAttributesFor<typeof tag>,
  ...children: GetChildrenFor<typeof tag>
): BlessedNode {
  const flatChildren = flatten(children);
  if (isExoticComponent(tag)) {
    switch (tag.$$type) {
      case FragmentSymbol:
        return {
          _name: tag.$$type.description!,
          _children: flatChildren,
          _rendered: flatChildren,
        };
      case ConsumerSymbol:
        return tag({}, children[0] as (value: unknown) => BlessedNode);
      case ProviderSymbol:
        const value = (attributes as any)?.value;
        return tag({ value }, children[0] as BlessedNode);
    }
  }
  if (typeof tag === "function") {
    const previousHookRope = [...hookState.rope];
    const componentStackEntry = getComponentStackEntry();
    return () => {
      const currentHookRope = [
        ...previousHookRope,
        {
          componentName: getKey(tag, attributes),
          stackEntry: componentStackEntry,
        },
      ];
      const toRevertHookRope = setHookRope(currentHookRope);
      try {
        const rendered = tag(attributes ?? {}, children);
        return {
          _name: tag.name,
          _children: flatChildren,
          _rendered: rendered,
        };
      } catch (err) {
        throw new RenderError(err, hookState.rope);
      } finally {
        setHookRope(toRevertHookRope);
      }
    };
  }
  try {
    const [actualAttributes, eventHandlers] = attributes
      ? splitAttributes(attributes)
      : [{}, {}];

    const element = blessedElements[tag](actualAttributes as any);

    // attach event handlers
    Object.entries(eventHandlers).forEach(([type, handler]) => {
      element.on(type, handler);
    });

    // set special attributes
    if (actualAttributes.ref) {
      actualAttributes.ref.current = element;
    }
    applyClass(element, actualAttributes.className);

    // append children
    if (!("content" in actualAttributes)) {
      element.content = "";
    }
    flatChildren.forEach((child) => appendChild(element, child));
    return {
      _name: tag,
      _children: flatChildren,
      _rendered: element,
    };
  } catch (err) {
    throw new RenderError(err);
  }
}

function splitAttributes<T extends keyof JSX.IntrinsicElements>(
  attributes: JSX.IntrinsicElements[T]
): [
  Exclude<JSX.IntrinsicElements[T], JSX.ElementEventProperties<T>>,
  JSX.ElementEventProperties<T>
] {
  const handlers: Record<string, unknown> = {};
  const normal: Record<string, unknown> = {};
  Object.entries(attributes).forEach(([key, value]) => {
    if (
      key.length > 2 &&
      key.startsWith("on") &&
      key[2] === key[2].toUpperCase()
    ) {
      handlers[key.substring(2).toLowerCase()] = value;
    } else {
      normal[key] = value;
    }
  });
  return [
    normal as Exclude<JSX.IntrinsicElements[T], JSX.ElementEventProperties<T>>,
    handlers as JSX.ElementEventProperties<T>,
  ];
}

function appendChild(element: blessedElement, child: BlessedNode) {
  if (typeof child === "string") {
    element.content += child;
    return;
  }
  if (typeof child === "number") {
    element.content += child;
    return;
  }
  if (typeof child === "boolean" || child == null) {
    return;
  }
  if (typeof child === "function") {
    appendChild(element, child());
    return;
  }
  if (!child._rendered) {
    return;
  }
  const render = child._rendered;
  if (isElement(render)) {
    element.append(render);
  } else if (Array.isArray(render)) {
    render.forEach((node) => appendChild(element, node));
  } else {
    appendChild(element, render);
  }
}

function setHookRope(rope: RopeEntry[]): RopeEntry[] {
  const r = hookState.rope;
  hookState.rope = rope;
  return r;
}

function getComponentStackEntry(): string {
  const stack = new Error().stack;
  const lines = stack?.split("\n");
  return lines?.[3] ?? "";
}

function isExoticComponent(
  tag: any
): tag is typeof Fragment | Consumer<unknown> | Provider<unknown> {
  return (tag as ExoticComponent<any, any>).$$type != null;
}
